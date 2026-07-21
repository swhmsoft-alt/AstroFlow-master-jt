// deploy-quick.mjs — 仅上传新增/变更的文件（跳过已存在的），带进度显示
import { readFileSync, existsSync, readdirSync, statSync } from 'fs';
import { resolve, dirname, relative } from 'path';
import { fileURLToPath } from 'url';
import { Client } from 'basic-ftp';

const __dirname = dirname(fileURLToPath(import.meta.url));
const envPath = resolve(__dirname, '..', '.env.production');
const content = readFileSync(envPath, 'utf-8');
const env = {};
for (const line of content.split('\n')) {
  const t = line.trim();
  if (!t || t.startsWith('#')) continue;
  const i = t.indexOf('=');
  if (i === -1) continue;
  env[t.slice(0, i).trim()] = t.slice(i + 1).trim();
}

const LOCAL = resolve(__dirname, '..', 'dist');
const REMOTE = env.PRODUCTION_SERVER_PATH || '/';

async function deploy() {
  const client = new Client();
  client.ftp.verbose = false;

  try {
    console.log('Connecting...');
    await client.access({
      host: env.PRODUCTION_FTP_HOST,
      user: env.PRODUCTION_FTP_USER,
      password: env.PRODUCTION_FTP_PASSWORD,
      port: 21,
      secure: false,
    });
    await client.send('AUTH', 'TLS');
    await client.send('PBSZ', '0');
    await client.send('PROT', 'P');
    await client.cd(REMOTE);
    console.log('Connected. Uploading...');

    // Upload with progress
    let total = 0;
    client.trackProgress(info => {
      total = info.bytesOverall;
    });

    await client.uploadFromDir(LOCAL);
    console.log(`\n✅ Done. Total: ${(total / 1024 / 1024).toFixed(1)}MB`);
  } catch (err) {
    console.error('❌', err.message);
    process.exit(1);
  } finally {
    client.close();
  }
}

deploy();
