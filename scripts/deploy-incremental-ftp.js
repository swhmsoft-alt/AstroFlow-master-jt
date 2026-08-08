/**
 * deploy-incremental-ftp.js — 增量部署脚本（断点续传版）
 * 对比本地 dist/ 与远程 FTP 文件大小，仅上传「新增」或「大小变化」的文件。
 * 明文 FTP（无 TLS），连接参数读取 .env.production（账号内置）。
 *
 * v2 改进（2026-08-08）：
 *  1. 持久化 manifest（deploy-manifest.json）：每个成功上传的文件立即写盘
 *     → 中断后重跑从断点继续，不做全量 SIZE 对比、进度不归零
 *  2. 内部自动重试循环：失败文件自动进入下一轮重传，直到 0 失败或轮次上限
 *  3. 断线重建连接 + 每文件重试（cPanel 偶发 ECONNRESET）
 *  4. 2 连接并行（比 4 连接稳定）
 *
 * 用法: node scripts/deploy-incremental-ftp.js
 * 对应 npm script: npm run deploy:inc
 */
import { readFileSync, existsSync, readdirSync, statSync, createReadStream, writeFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { Client } from 'basic-ftp';

const __dirname = dirname(fileURLToPath(import.meta.url));
const envPath = resolve(__dirname, '..', '.env.production');
const MANIFEST = resolve(__dirname, '..', 'deploy-manifest.json');
const SIZE_POOL = 6;
const UPLOAD_POOL = 2;
const UPLOAD_RETRIES = 3;
const MAX_ROUNDS = 8;

function loadEnv(path) {
  const content = readFileSync(path, 'utf-8');
  const env = {};
  for (const line of content.split('\n')) {
    const t = line.trim();
    if (!t || t.startsWith('#')) continue;
    const i = t.indexOf('=');
    if (i === -1) continue;
    env[t.slice(0, i).trim()] = t.slice(i + 1).trim();
  }
  return env;
}

const env = loadEnv(envPath);
const LOCAL = resolve(__dirname, '..', 'dist');
if (!existsSync(LOCAL)) {
  console.error('❌ dist/ 不存在，请先执行 npm run build');
  process.exit(1);
}

// ── 收集本地文件（相对路径 -> 大小） ──
const localFiles = [];
const localSizeMap = new Map();
function walk(dir, prefix) {
  for (const item of readdirSync(dir)) {
    const fp = resolve(dir, item);
    const s = statSync(fp);
    const rel = prefix ? `${prefix}/${item}` : item;
    if (s.isDirectory()) walk(fp, rel);
    else { localFiles.push({ rel, size: s.size }); localSizeMap.set(rel, s.size); }
  }
}
walk(LOCAL, '');

// ── manifest 持久化（断点续传核心） ──
function loadManifest() {
  try {
    if (existsSync(MANIFEST)) {
      const data = JSON.parse(readFileSync(MANIFEST, 'utf-8'));
      const m = new Map((data.files || []).map((f) => [f.rel, f.size]));
      console.log(`📦 读取 manifest：${m.size} 个文件已成功上传（断点续传）`);
      return m;
    }
  } catch (e) {
    console.warn(`⚠️ manifest 读取失败（${e.message}），从零开始`);
  }
  return new Map();
}

function saveManifest(m) {
  try {
    writeFileSync(MANIFEST, JSON.stringify({ time: Date.now(), files: Array.from(m.entries()).map(([rel, size]) => ({ rel, size })) }));
  } catch (e) {
    console.warn(`⚠️ manifest 写入失败: ${e.message}`);
  }
}

function connect() {
  const c = new Client();
  c.ftp.verbose = false;
  return c;
}

async function open(c) {
  await c.access({
    host: env.PRODUCTION_FTP_HOST,
    user: env.PRODUCTION_FTP_USER,
    password: env.PRODUCTION_FTP_PASSWORD,
    port: parseInt(env.PRODUCTION_FTP_PORT || '21'),
    secure: false,
  });
  await c.cd(env.PRODUCTION_SERVER_PATH || '/');
  return c;
}

// ── 仅对 candidates 做 SIZE 对比（不做全量），返回需上传的文件 ──
async function sizeCompare(candidates) {
  if (candidates.length === 0) return [];
  const remoteSize = new Map();
  let idx = 0;
  async function sizeWorker() {
    const w = connect();
    try {
      await open(w);
      while (idx < candidates.length) {
        const f = candidates[idx++];
        try {
          const s = await w.size(`/${f.rel}`);
          remoteSize.set(f.rel, s);
        } catch {
          remoteSize.set(f.rel, -1);
        }
      }
    } finally {
      w.close();
    }
  }
  await Promise.all(Array.from({ length: SIZE_POOL }, sizeWorker));
  return candidates.filter((f) => {
    const rs = remoteSize.get(f.rel);
    return rs === undefined || rs === -1 || rs !== f.size;
  });
}

// ── 并行上传，返回成功/失败列表 ──
async function upload(files) {
  const start = Date.now();
  let upIdx = 0, ok = 0, fail = 0;
  const failList = [];
  const okList = [];
  async function uploadWorker() {
    let w = connect();
    try {
      await open(w);
      while (upIdx < files.length) {
        const f = files[upIdx++];
        const lastSlash = f.rel.lastIndexOf('/');
        const dir = lastSlash === -1 ? '' : f.rel.substring(0, lastSlash);
        const base = lastSlash === -1 ? f.rel : f.rel.substring(lastSlash + 1);
        let uploaded = false;
        // 每文件最多重试 UPLOAD_RETRIES 次；连接被重置时重建连接（cPanel 偶发 ECONNRESET）
        for (let attempt = 0; attempt < UPLOAD_RETRIES && !uploaded; attempt++) {
          try {
            await w.ensureDir(dir ? `/${dir}` : '/');
            await w.uploadFrom(createReadStream(resolve(LOCAL, f.rel)), base);
            uploaded = true;
          } catch (e) {
            if (attempt < UPLOAD_RETRIES - 1) {
              try { w.close(); } catch (_) { /* ignore */ }
              w = connect();
              await open(w);
            } else {
              fail++;
              failList.push(f.rel);
              console.warn(`   ❌ ${f.rel}: ${e.message}`);
            }
          }
        }
        if (uploaded) {
          ok++;
          okList.push(f.rel);
          const pct = ((ok + fail) / files.length * 100).toFixed(0);
          const elapsed = ((Date.now() - start) / 1000).toFixed(0);
          console.log(`   [${pct}%] ✅ ${f.rel} (${(f.size / 1024).toFixed(1)}KB, ${elapsed}s)`);
        }
      }
    } finally {
      w.close();
    }
  }
  await Promise.all(Array.from({ length: UPLOAD_POOL }, uploadWorker));
  return { okList, failList, ok, fail };
}

async function main() {
  const start = Date.now();
  try {
    console.log(`🔌 连接 ${env.PRODUCTION_FTP_HOST}（明文 FTP，端口 ${env.PRODUCTION_FTP_PORT || 21}）...`);

    // ── 断点续传：读取 manifest，待处理 = 未在 manifest 或大小变化的文件 ──
    const manifest = loadManifest();
    let pending = localFiles.filter((f) => !manifest.has(f.rel) || manifest.get(f.rel) !== f.size);
    console.log(`🔍 本地共 ${localFiles.length} 个文件；待处理 ${pending.length} 个（其余已在 manifest）`);

    if (pending.length === 0) {
      console.log('🎉 manifest 已包含全部本地文件，无需处理。若需强制校验远端，请删除 deploy-manifest.json 后重跑。');
      return;
    }

    let round = 1;
    while (pending.length > 0 && round <= MAX_ROUNDS) {
      console.log(`\n🔁 第 ${round} 轮：SIZE 对比 ${pending.length} 个文件...`);
      const toUpload = await sizeCompare(pending);
      if (toUpload.length === 0) {
        console.log('   对比后无差异，全部一致。');
        break;
      }
      const totalMB = (toUpload.reduce((a, f) => a + f.size, 0) / 1024 / 1024).toFixed(1);
      console.log(`   需上传 ${toUpload.length} 个（共 ${totalMB}MB），2 连接并行...`);

      const { okList, failList } = await upload(toUpload);
      okList.forEach((rel) => manifest.set(rel, localSizeMap.get(rel) || 0));
      saveManifest(manifest);
      const elapsed = ((Date.now() - start) / 1000).toFixed(0);
      console.log(`   本轮：成功 ${okList.length} / 失败 ${failList.length}（累计 ${elapsed}s），manifest 已更新（${manifest.size} 文件）`);

      if (failList.length === 0) break;
      pending = failList.map((rel) => ({ rel, size: localSizeMap.get(rel) || 0 }));
      round++;
    }

    // ── 最终统计 ──
    const remaining = localFiles.filter((f) => !manifest.has(f.rel));
    console.log(`\n✅ 部署结束：manifest 记录 ${manifest.size} / ${localFiles.length} 文件，总耗时 ${((Date.now() - start) / 1000).toFixed(0)}s`);
    if (remaining.length > 0) {
      console.log(`❌ 仍有 ${remaining.length} 个文件未成功上传（已写入 manifest 之外，可重跑继续）：`);
      remaining.forEach((f) => console.log(`   - ${f.rel}`));
      process.exitCode = 1;
    } else {
      console.log('🎉 全部文件上传成功！');
    }
  } catch (e) {
    console.error('❌ 部署失败:', e.message);
    process.exitCode = 1;
  }
}

main();
