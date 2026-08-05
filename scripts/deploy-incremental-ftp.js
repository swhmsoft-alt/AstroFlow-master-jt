/**
 * deploy-incremental-ftp.js — 增量部署脚本
 * 对比本地 dist/ 与远程 FTP 文件大小，仅上传「新增」或「大小变化」的文件。
 * 明文 FTP（无 TLS），连接参数读取 .env.production（账号内置）。
 *
 * 策略（针对低速 cPanel FTP 优化）：
 *  1. 并行 SIZE 命令对比（控制通道，无需数据连接，实测 ~247ms/文件）
 *  2. 差异结果缓存到 .deploy-diff.json（10 分钟内有效，重启不重复对比）
 *  3. 4 连接并行上传（单连接实测 ~37KB/s，并行可提升数倍）
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
const DIFF_CACHE = resolve(__dirname, '..', '.deploy-diff.json');
const CACHE_TTL_MS = 10 * 60 * 1000;
const SIZE_POOL = 6;
const UPLOAD_POOL = 4;

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
function walk(dir, prefix) {
  for (const item of readdirSync(dir)) {
    const fp = resolve(dir, item);
    const s = statSync(fp);
    const rel = prefix ? `${prefix}/${item}` : item;
    if (s.isDirectory()) walk(fp, rel);
    else localFiles.push({ rel, size: s.size });
  }
}
walk(LOCAL, '');

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

async function main() {
  const start = Date.now();
  try {
    console.log(`🔌 连接 ${env.PRODUCTION_FTP_HOST}（明文 FTP，端口 ${env.PRODUCTION_FTP_PORT || 21}）...`);

    // ── 差异列表：优先使用新鲜缓存，否则并行 SIZE 对比 ──
    let toUpload = [];
    const cached = existsSync(DIFF_CACHE) ? JSON.parse(readFileSync(DIFF_CACHE, 'utf-8')) : null;
    if (cached && cached.files && cached.time && Date.now() - cached.time < CACHE_TTL_MS) {
      toUpload = cached.files;
      console.log(`📦 使用缓存差异列表（${toUpload.length} 个文件，缓存 ${Math.round((Date.now() - cached.time) / 1000)}s 前生成）`);
    } else {
      console.log('📡 并行 SIZE 对比远程文件...');
      const remoteSize = new Map(); // rel -> remote size | -1 = 缺失
      let idx = 0;
      async function sizeWorker() {
        const w = connect();
        try {
          await open(w);
          while (idx < localFiles.length) {
            const f = localFiles[idx++];
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
      console.log(`   远程对比完成：${localFiles.length} 个本地文件已比对`);

      let unchanged = 0;
      for (const f of localFiles) {
        const rs = remoteSize.get(f.rel);
        if (rs === undefined || rs === -1 || rs !== f.size) toUpload.push(f);
        else unchanged++;
      }
      const totalSize = toUpload.reduce((a, f) => a + f.size, 0);
      console.log(`\n📊 未变化 ${unchanged} 个，需上传 ${toUpload.length} 个（共 ${(totalSize / 1024 / 1024).toFixed(1)}MB）`);
      try {
        writeFileSync(DIFF_CACHE, JSON.stringify({ time: Date.now(), files: toUpload.map((f) => ({ rel: f.rel, size: f.size })) }));
      } catch (e) {
        console.warn(`⚠️ 差异缓存写入失败: ${e.message}`);
      }
    }

    if (toUpload.length === 0) {
      console.log('🎉 远程已是最新，无需上传。');
      return;
    }

    // ── 并行上传 ──
    console.log(`\n📤 开始上传（${UPLOAD_POOL} 连接并行）...`);
    let upIdx = 0;
    let ok = 0, fail = 0;
    const failList = [];
    async function uploadWorker() {
      const w = connect();
      try {
        await open(w);
        while (upIdx < toUpload.length) {
          const f = toUpload[upIdx++];
          const lastSlash = f.rel.lastIndexOf('/');
          const dir = lastSlash === -1 ? '' : f.rel.substring(0, lastSlash);
          const base = lastSlash === -1 ? f.rel : f.rel.substring(lastSlash + 1);
          try {
            // ensureDir(绝对路径) 会把 cwd 切到目标目录，随后用 basename 上传到该目录
            await w.ensureDir(dir ? `/${dir}` : '/');
            await w.uploadFrom(createReadStream(resolve(LOCAL, f.rel)), base);
            ok++;
            const pct = ((ok + fail) / toUpload.length * 100).toFixed(0);
            const elapsed = ((Date.now() - start) / 1000).toFixed(0);
            console.log(`   [${pct}%] ✅ ${f.rel} (${(f.size / 1024).toFixed(1)}KB, ${elapsed}s)`);
          } catch (e) {
            fail++;
            failList.push(f.rel);
            console.warn(`   ❌ ${f.rel}: ${e.message}`);
          }
        }
      } finally {
        w.close();
      }
    }
    await Promise.all(Array.from({ length: UPLOAD_POOL }, uploadWorker));

    const elapsed = ((Date.now() - start) / 1000).toFixed(0);
    console.log(`\n✅ 增量部署完成：${ok} 成功 / ${fail} 失败，总耗时 ${elapsed}s`);
    if (fail > 0) {
      console.log('❌ 失败列表：');
      failList.forEach((f) => console.log(`   - ${f}`));
      process.exitCode = 1;
    }
  } catch (e) {
    console.error('❌ 部署失败:', e.message);
    process.exitCode = 1;
  }
}

main();
