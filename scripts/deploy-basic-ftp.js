/**
 * Deploy script using basic-ftp library
 * Supports FTPS (explicit TLS) with EPSV for better firewall compatibility.
 * Usage: node scripts/deploy-basic-ftp.js
 */
import { readFileSync, existsSync, readdirSync, statSync } from 'fs';
import { resolve, dirname, relative } from 'path';
import { fileURLToPath } from 'url';
import { Client } from 'basic-ftp';

const __dirname = dirname(fileURLToPath(import.meta.url));
const envPath = resolve(__dirname, '..', '.env.production');

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
const REMOTE_ROOT = env.PRODUCTION_SERVER_PATH || '/';
const LOCAL_ROOT = resolve(__dirname, '..', 'dist');

// Validate dist/
if (!existsSync(LOCAL_ROOT)) {
  console.error('❌ dist/ directory not found. Run "npm run build" first.');
  process.exit(1);
}

const files = readdirSync(LOCAL_ROOT);
console.log(`   ✓ dist/ exists with ${files.length} items.`);

async function deploy() {
  const client = new Client();
  // Enable debug logging
  client.ftp.verbose = true;
  
  try {
    // Connect without encryption first (control channel)
    console.log(`🔌 Connecting to ${HOST}...`);
    client.ftp.verbose = true;
    await client.access({
      host: HOST,
      user: USER,
      password: PASS,
      port: 21,
      secure: false
    });
    // Upgrade to TLS for control channel
    console.log('🔒 Upgrading to TLS...');
    await client.send('AUTH', 'TLS');
    // Set protection level
    await client.send('PBSZ', '0');
    await client.send('PROT', 'P');
    console.log('✅ Connected successfully (FTPS with encrypted data)');

    // Change to remote root
    await client.cd(REMOTE_ROOT);
    console.log(`📂 Changed to remote: ${REMOTE_ROOT}`);

    // Upload entire dist/ directory
    console.log('📤 Uploading files...');
    await client.uploadFromDir(LOCAL_ROOT);
    
    console.log('✅ Deploy complete!');
    
  } catch (err) {
    console.error('❌ Deploy failed:', err.message);
    process.exit(1);
  } finally {
    client.close();
  }
}

deploy();