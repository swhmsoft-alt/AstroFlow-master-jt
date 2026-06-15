/**
 * FTPS deployment script using Windows curl.exe
 * curl.exe handles both control and data connections natively,
 * bypassing the @icetee/ftp library's PASV timeout issues.
 * Usage: node scripts/deploy-curl.js
 */
import { readFileSync, existsSync, readdirSync, statSync } from 'fs';
import { resolve, dirname, relative, sep } from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

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

// Build file list
function getAllFiles(dir, relativeDir = '') {
  const entries = readdirSync(dir, { withFileTypes: true });
  let files = [];
  for (const entry of entries) {
    const fullPath = resolve(dir, entry.name);
    const relPath = relativeDir ? `${relativeDir}/${entry.name}` : entry.name;
    if (entry.isDirectory()) {
      files = files.concat(getAllFiles(fullPath, relPath));
    } else {
      files.push({ localPath: fullPath, remotePath: relPath });
    }
  }
  return files;
}

const allFiles = getAllFiles(LOCAL_ROOT);
console.log(`📦 Found ${allFiles.length} files in dist/`);
console.log(`🚀 Uploading to ${HOST}`);
console.log(`   Remote: ${REMOTE_ROOT}`);
console.log('');

// Escape password for curl (replace special chars)
function escapeCurlPassword(pwd) {
  // Curl on Windows cmd needs special chars escaped
  return pwd.replace(/[&^%!@#(){}|[\]\\;:'",.<>~`]/g, (c) => {
    // The password contains } which is problematic in cmd
    return c;
  });
}

// Upload using curl FTPS
const curlPath = 'C:\\Windows\\System32\\curl.exe';
let successCount = 0;
let failCount = 0;

// First, create remote directory structure using FTP
function execCurl(args) {
  const cmd = `"${curlPath}" ${args}`;
  try {
    const result = execSync(cmd, { 
      timeout: 60000,
      windowsHide: true,
      encoding: 'utf-8',
      maxBuffer: 10 * 1024 * 1024
    });
    return { ok: true, output: result };
  } catch (err) {
    return { ok: false, output: err.stderr || err.message };
  }
}

// Create directories recursively via FTP
const remoteDirs = new Set();
for (const file of allFiles) {
  const dir = file.remotePath.split('/').slice(0, -1).join('/');
  if (dir) remoteDirs.add(dir);
}

// Sort dirs so parents come first
const sortedDirs = [...remoteDirs].sort((a, b) => a.split('/').length - b.split('/').length);

console.log('📁 Creating remote directories...');
for (const dir of sortedDirs) {
  const remoteDir = `${REMOTE_ROOT}${dir}`;
  // Use MKD via FTP raw command - curl can do this
  const result = execCurl(
    `-s --ssl-reqd --insecure --user "${USER}:${PASS}" ` +
    `--quote "MKD ${remoteDir}" ` +
    `ftp://${HOST}/ --connect-timeout 15`
  );
  if (!result.ok && !result.output.includes('exists')) {
    // Directory may already exist, that's fine
  }
}
console.log(`   ✓ ${sortedDirs.length} directories processed`);

// Upload files
console.log('📤 Uploading files...');
for (const file of allFiles) {
  const remotePath = `${REMOTE_ROOT}${file.remotePath.replace(/\\/g, '/')}`;
  const localPath = file.localPath;
  
  // Use curl --upload-file for FTPS upload
  const result = execCurl(
    `-s --ssl-reqd --insecure --user "${USER}:${PASS}" ` +
    `--upload-file "${localPath}" ` +
    `--connect-timeout 30 ` +
    `ftp://${HOST}${remotePath}`
  );
  
  if (result.ok) {
    successCount++;
    process.stdout.write('.');
  } else {
    failCount++;
    process.stdout.write('x');
    console.log(`\n   ❌ Failed: ${file.remotePath} - ${result.output}`);
  }
}

console.log('\n');
console.log('='.repeat(40));
console.log(`✅ Uploaded: ${successCount} files`);
if (failCount > 0) {
  console.log(`❌ Failed: ${failCount} files`);
}
console.log('='.repeat(40));