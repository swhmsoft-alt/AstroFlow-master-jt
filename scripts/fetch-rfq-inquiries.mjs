/**
 * =============================================================================
 * fetch-rfq-inquiries.mjs — 只读取回服务器上的询盘归档（READ-ONLY）
 *
 * 用途：昨天已在服务器端（public/submit-rfq.php）把每条合法询盘追加写入
 *       web 根 `rfq-inquiries.log`，图纸存入 `rfq-files/`。本脚本仅通过
 *       FTP 把这些已存储的询盘数据「调取」到本地，供查看/归档。
 *
 * 只读保障：仅使用 basic-ftp 的 `list` / `downloadTo`，绝不执行
 *       `uploadTo` / `remove` / `send` 等任何写操作，服务器数据零改动。
 *
 * 依赖：basic-ftp（已在 package.json），连接参数读取 .env.production。
 *
 * 用法：node scripts/fetch-rfq-inquiries.mjs
 * 输出：./rfq-downloads/ 下得到 rfq-inquiries.log 与 rfq-files/ 图纸 + 清单打印
 * =============================================================================
 */
import { Client } from 'basic-ftp';
import { readFileSync, existsSync, mkdirSync, writeFileSync, createWriteStream } from 'fs';
import { resolve, dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const envPath = resolve(ROOT, '.env.production');

// ── 读取 .env.production（与项目其它部署脚本一致的分行解析）──
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
const HOST = env.PRODUCTION_FTP_HOST;
const USER = env.PRODUCTION_FTP_USER;
const PASS = env.PRODUCTION_FTP_PASSWORD;
const ROOT_REMOTE = (env.PRODUCTION_SERVER_PATH || '/').replace(/\/+$/, '') || '/';

// ── 本地下载目标 ──
const DOWNLOAD_DIR = resolve(ROOT, 'rfq-downloads');
const FILES_DIR = join(DOWNLOAD_DIR, 'rfq-files');
const LOG_REMOTE = 'rfq-inquiries.log';
const LOG_LOCAL = join(DOWNLOAD_DIR, LOG_REMOTE);

if (!HOST || !USER || !PASS) {
  console.error('❌ .env.production 缺少 PRODUCTION_FTP_* 配置，无法连接。');
  process.exit(1);
}

mkdirSync(FILES_DIR, { recursive: true });

const client = new Client();
client.ftp.verbose = false;

/**
 * 递归下载远程目录到本地（保留相对结构）。仅 list + downloadTo。
 * @returns {Promise<Array<{name:string;size:number;remote:string}>>}
 */
async function downloadDir(remoteDir, localDir) {
  const results = [];
  const items = await client.list(remoteDir);
  for (const it of items) {
    const remotePath = `${remoteDir.replace(/\/+$/, '')}/${it.name}`;
    if (it.isDirectory) {
      const subLocal = join(localDir, it.name);
      mkdirSync(subLocal, { recursive: true });
      const subResults = await downloadDir(remotePath, subLocal);
      results.push(...subResults);
    } else if (it.isFile) {
      const dest = join(localDir, it.name);
      await client.downloadTo(createWriteStream(dest), remotePath);
      results.push({ name: remotePath, size: it.size });
    }
  }
  return results;
}

let logLines = -1;
let files = [];

try {
  console.log(`🔌 连接 FTP: ${HOST}（只读模式）...`);
  await client.access({ host: HOST, user: USER, password: PASS, port: Number(env.PRODUCTION_FTP_PORT || 21), secure: false });
  await client.cd(ROOT_REMOTE === '/' ? '/' : ROOT_REMOTE);
  console.log(`📁 已进入远程 web 根: ${ROOT_REMOTE}`);
  console.log('');

  // 1) 下载询盘文本归档
  const listing = await client.list();
  const hasLog = listing.some((f) => f.isFile && f.name === LOG_REMOTE);
  if (hasLog) {
    console.log(`⬇️  下载 ${LOG_REMOTE} ...`);
    await client.downloadTo(createWriteStream(LOG_LOCAL), LOG_REMOTE);
    const content = readFileSync(LOG_LOCAL, 'utf-8');
    // 每条询盘以 "[RFQ " 记录头开始，按其计数
    logLines = content ? (content.match(/^\[RFQ /gm) || []).length : 0;
    console.log(`   ✅ 已保存到: ${LOG_LOCAL}`);
  } else {
    console.log(`ℹ️  远程无 ${LOG_REMOTE}（服务器端尚未收到任何询盘归档）`);
  }
  console.log('');

  // 2) 下载图纸目录
  const hasDir = listing.some((f) => f.isDirectory && f.name === 'rfq-files');
  if (hasDir) {
    console.log('⬇️  下载 rfq-files/ 图纸 ...');
    files = await downloadDir('rfq-files', FILES_DIR, 'rfq-files');
    console.log(`   ✅ 完成，共 ${files.length} 个文件`);
  } else {
    console.log(`ℹ️  远程无 rfq-files/ 目录（尚无附件提交）`);
  }

  console.log('');
  console.log('══════════════════════════════════════════════');
  console.log('📋 调取结果清单');
  console.log('══════════════════════════════════════════════');
  if (logLines >= 0) {
    console.log(`[1] ${LOG_REMOTE}`);
    console.log(`    • 位置: ${LOG_LOCAL}`);
    console.log(`    • 询盘记录条数: ${logLines}`);
  } else {
    console.log(`[1] ${LOG_REMOTE} — 服务器端不存在`);
  }
  if (files.length > 0) {
    console.log(`[2] rfq-files/ 图纸（共 ${files.length} 个）:`);
    files.forEach((f, i) => {
      const localPath = join(FILES_DIR, f.name.replace('rfq-files/', ''));
      console.log(`    ${String(i + 1).padStart(2)}. ${f.name}  (${(f.size / 1024).toFixed(1)} KB)  → ${localPath}`);
    });
  } else {
    console.log('[2] rfq-files/ 图纸 — 服务器端无附件');
  }
  console.log('══════════════════════════════════════════════');
} catch (err) {
  console.error('❌ 连接/下载失败:', err.message);
  process.exitCode = 1;
} finally {
  client.close();
}
