/**
 * Test a single file upload using curl
 */
import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __dirname = dirname(fileURLToPath(import.meta.url));
const envPath = resolve(__dirname, '..', '.env.production');
const content = readFileSync(envPath, 'utf-8');
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

const HOST = env.PRODUCTION_FTP_HOST;
const USER = env.PRODUCTION_FTP_USER;
const PASS = env.PRODUCTION_FTP_PASSWORD;
const REMOTE_ROOT = env.PRODUCTION_SERVER_PATH || '/';

console.log('HOST:', HOST);
console.log('USER:', USER);
console.log('REMOTE_ROOT:', REMOTE_ROOT);

// First test: just list directory
console.log('\n--- Test 1: LIST directory ---');
try {
  const curlExe = 'C:\\Windows\\System32\\curl.exe';
  const args = [
    `--ssl-reqd`,
    `--insecure`,
    `--user`, `${USER}:${PASS}`,
    `ftp://${HOST}/`,
    `--connect-timeout`, `15`
  ];
  const result = execSync(`"${curlExe}" ${args.join(' ')}`, {
    timeout: 30000,
    windowsHide: true,
    encoding: 'utf-8',
    shell: 'cmd.exe'
  });
  console.log('LIST OK:', result.substring(0, 500));
} catch (e) {
  console.log('LIST FAILED:', e.message);
  console.log('STDERR:', e.stderr?.substring(0, 500));
}

// Second test: try uploading a small file
console.log('\n--- Test 2: UPLOAD small file ---');
try {
  const localFile = resolve(__dirname, '..', 'dist', 'favicon.svg');
  const curlExe = 'C:\\Windows\\System32\\curl.exe';
  const args = [
    `--ssl-reqd`,
    `--insecure`,
    `--user`, `${USER}:${PASS}`,
    `--upload-file`, `"${localFile}"`,
    `ftp://${HOST}${REMOTE_ROOT}favicon-test.svg`,
    `--connect-timeout`, `15`
  ];
  const result = execSync(`"${curlExe}" ${args.join(' ')}`, {
    timeout: 60000,
    windowsHide: true,
    encoding: 'utf-8',
    shell: 'cmd.exe'
  });
  console.log('UPLOAD OK:', result);
} catch (e) {
  console.log('UPLOAD FAILED:', e.message);
  console.log('STDERR:', e.stderr?.substring(0, 500));
}