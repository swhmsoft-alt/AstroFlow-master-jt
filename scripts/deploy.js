/**
 * FTP deployment script
 * Reads credentials from .env.production and uploads dist/ to the server.
 * Uses basic-ftp for reliable recursive directory upload.
 * Usage: npm run deploy
 */
import { readFileSync, existsSync, readdirSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { createInterface } from 'readline';
import { Client } from 'basic-ftp';

const __dirname = dirname(fileURLToPath(import.meta.url));
const envPath = resolve(__dirname, '..', '.env.production');

// Parse .env.production manually (no dotenv dependency)
function loadEnv(path) {
  const content = readFileSync(path, 'utf-8');
  const env = {};
  for (const line of content.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eqIdx = trimmed.indexOf('=');
    if (eqIdx === -1) continue;
    const key = trimmed.slice(0, eqIdx).trim();
    const val = trimmed.slice(eqIdx + 1).trim();
    env[key] = val;
  }
  return env;
}

const env = loadEnv(envPath);

const HOST = env.PRODUCTION_FTP_HOST;
const USER = env.PRODUCTION_FTP_USER;
const PASS = env.PRODUCTION_FTP_PASSWORD;
const PORT = parseInt(env.PRODUCTION_FTP_PORT || '21');
const REMOTE_ROOT = env.PRODUCTION_SERVER_PATH || '/';
const LOCAL_ROOT = resolve(__dirname, '..', 'dist');

// ── Validation: check dist/ exists and has files ──
if (!existsSync(LOCAL_ROOT)) {
  console.error('❌ dist/ directory not found. Run "npm run build" first.');
  process.exit(1);
}
const files = readdirSync(LOCAL_ROOT);
if (files.length === 0) {
  console.error('❌ dist/ directory is empty. Run "npm run build" first.');
  process.exit(1);
}
console.log('   ✓ dist/ exists with', files.length, 'items.');

// ── Confirmation prompt (skip if non-interactive, e.g. CMS backend deploy) ──
if (process.stdout.isTTY) {
  const rl = createInterface({ input: process.stdin, output: process.stdout });
  const answer = await new Promise((resolve) => {
    rl.question('⚠️  Confirm upload to production? (y/N) ', (ans) => {
      resolve(ans.trim().toLowerCase());
      rl.close();
    });
  });
  if (answer !== 'y' && answer !== 'yes') {
    console.log('❌ Deploy cancelled.');
    process.exit(0);
  }
} else {
  console.log('   (non-interactive mode, skipping confirmation)');
}

console.log('🚀 Deploying dist/ to', HOST);
console.log('   User:', USER);
console.log('   Remote:', REMOTE_ROOT);
console.log('');

// ── Upload using basic-ftp (recursive directory upload) ──
const client = new Client();
client.ftp.verbose = false; // set true for debug

try {
  console.log('🔌 Connecting to', HOST, '...');
  await client.access({
    host: HOST,
    user: USER,
    password: PASS,
    port: PORT,
    secure: false
  });

  // Change to remote root
  await client.cd(REMOTE_ROOT);
  console.log('📂 Changed to remote:', REMOTE_ROOT);

  // Upload entire dist/ directory recursively
  console.log('📤 Uploading files (recursive)...');
  await client.uploadFromDir(LOCAL_ROOT);

  console.log('✅ Deploy complete!');
} catch (err) {
  console.error('❌ Deploy failed:', err.message);
  process.exit(1);
} finally {
  client.close();
}