// deploy-now.mjs — FTP deploy without TLS (confirmed working)
import { readFileSync, existsSync, readdirSync } from 'fs';
import { resolve, dirname } from 'path';
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

if (!existsSync(LOCAL)) { console.error('dist/ not found'); process.exit(1); }

async function deploy() {
  const client = new Client();
  // Disable TLS — plain FTP confirmed working
  client.ftp.verbose = false;
  client.ftp.secured = false;

  try {
    console.log('Connecting to', env.PRODUCTION_FTP_HOST + '...');
    await client.access({
      host: env.PRODUCTION_FTP_HOST,
      user: env.PRODUCTION_FTP_USER,
      password: env.PRODUCTION_FTP_PASSWORD,
      port: parseInt(env.PRODUCTION_FTP_PORT || '21'),
      secure: false,
    });
    await client.cd(REMOTE);
    console.log('Connected. Uploading dist/ ... (this may take a few minutes)');

    let bytes = 0;
    client.trackProgress(info => { bytes = info.bytesOverall; });

    await client.uploadFromDir(LOCAL);
    const mb = (bytes / 1024 / 1024).toFixed(1);
    console.log(`✅ Done. ${mb}MB uploaded.`);
  } catch (err) {
    console.error('❌', err.message);
  } finally {
    client.close();
  }
}

deploy();
