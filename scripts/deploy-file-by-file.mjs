// deploy-file-by-file.mjs — manual FTP upload with per-file progress
import { readFileSync, createReadStream, existsSync, readdirSync, statSync } from 'fs';
import { resolve, dirname, relative, sep } from 'path';
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
if (!existsSync(LOCAL)) { console.error('dist/ not found'); process.exit(1); }

// Collect all files
const allFiles = [];
function walk(dir) {
  for (const item of readdirSync(dir)) {
    const fp = resolve(dir, item);
    const s = statSync(fp);
    if (s.isDirectory()) walk(fp);
    else allFiles.push({ path: fp, size: s.size });
  }
}
walk(LOCAL);
const total = allFiles.length;
const totalSize = allFiles.reduce((a, f) => a + f.size, 0);
console.log(`${total} files, ${(totalSize/1024/1024).toFixed(1)}MB total`);

async function deploy() {
  const client = new Client();
  client.ftp.verbose = false;
  try {
    console.log('Connecting...');
    await client.access({
      host: env.PRODUCTION_FTP_HOST,
      user: env.PRODUCTION_FTP_USER,
      password: env.PRODUCTION_FTP_PASSWORD,
      port: parseInt(env.PRODUCTION_FTP_PORT || '21'),
      secure: false,
    });
    console.log('Connected. Uploading...\n');

    let uploaded = 0;
    let uploadedBytes = 0;
    let errors = 0;
    const start = Date.now();

    for (const file of allFiles) {
      const rel = relative(LOCAL, file.path).replace(/\\/g, '/');
      const dir = rel.includes('/') ? rel.substring(0, rel.lastIndexOf('/')) : '';
      try {
        // Navigate without creating — avoid 553 error on existing dirs\n      if (dir) {\n        try { await client.cd(dir); } catch { await client.ensureDir(dir); }\n      }
        await client.remove(rel).catch(()=>{}); await client.uploadFrom(createReadStream(file.path), rel);
        uploaded++;
        uploadedBytes += file.size;
        const pct = (uploaded / total * 100).toFixed(1);
        const mb = (uploadedBytes / 1024 / 1024).toFixed(1);
        const elapsed = ((Date.now() - start) / 1000).toFixed(0);
        process.stdout.write(`\r  [${pct}%] ${uploaded}/${total} files | ${mb}MB | ${elapsed}s  `);
      } catch (e) {
        errors++;
        console.log(`\n  ⚠ ${rel}: ${e.message}`);
      }
    }

    const elapsed = ((Date.now() - start) / 1000).toFixed(0);
    console.log(`\n\n✅ Done in ${elapsed}s. ${uploaded} files, ${errors} errors.`);
  } catch (e) {
    console.error('\n❌', e.message);
  } finally {
    client.close();
  }
}

deploy();
