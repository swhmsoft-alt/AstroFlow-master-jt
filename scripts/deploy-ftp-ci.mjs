/**
 * CI 部署脚本 — 在 GitHub Actions 中运行
 * 从环境变量（GitHub Secrets）读取 FTP 凭据
 * 使用 basic-ftp 库上传 dist/ 到 cPanel
 *
 * 用法（在 CI 中自动执行）:
 *   node scripts/deploy-ftp-ci.mjs
 */
import { existsSync, readdirSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { Client } from 'basic-ftp';

const __dirname = dirname(fileURLToPath(import.meta.url));

const HOST = process.env.FTP_HOST;
const USER = process.env.FTP_USER;
const PASS = process.env.FTP_PASSWORD;
const REMOTE_ROOT = process.env.FTP_REMOTE_PATH || '/';
const LOCAL_ROOT = resolve(__dirname, '..', 'dist');

// ---------- 校验 ----------
if (!HOST || !USER || PASS === undefined) {
  console.error('❌ 缺少 FTP 环境变量。请确保已设置：');
  console.error('   FTP_HOST, FTP_USER, FTP_PASSWORD, FTP_REMOTE_PATH');
  process.exit(1);
}

if (!existsSync(LOCAL_ROOT)) {
  console.error('❌ dist/ 目录不存在。请先运行 npx astro build。');
  process.exit(1);
}

const files = readdirSync(LOCAL_ROOT);
console.log(`   ✓ dist/ 已就绪，共 ${files.length} 个条目。`);

// ---------- FTP 上传 ----------
async function deploy() {
  const client = new Client();
  client.ftp.verbose = false; // CI 中减少日志冗余，出错时再开启

  try {
    console.log(`🔌 正在连接 ${HOST} ...`);
    await client.access({
      host: HOST,
      user: USER,
      password: PASS,
      port: 21,
      secure: false,       // 先非加密连接控制通道
    });

    // 升级到 TLS
    console.log('🔒 正在升级到 TLS ...');
    await client.send('AUTH', 'TLS');
    await client.send('PBSZ', '0');
    await client.send('PROT', 'P');
    console.log('✅ FTPS 连接成功');

    // 切换到远程根目录
    await client.cd(REMOTE_ROOT);
    console.log(`📂 远程目录: ${REMOTE_ROOT}`);

    // 上传整个 dist/
    console.log('📤 正在上传文件 ...');
    await client.uploadFromDir(LOCAL_ROOT);

    console.log('✅ 部署完成！');
  } catch (err) {
    console.error('❌ 部署失败:', err.message);
    process.exit(1);
  } finally {
    client.close();
  }
}

deploy();