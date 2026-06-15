import { Client } from 'basic-ftp';
import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { Writable } from 'stream';

const __dirname = dirname(fileURLToPath(import.meta.url));
const envPath = resolve(__dirname, '.env.production');
const c = readFileSync(envPath, 'utf-8');
const env = {};
for (const l of c.split('\n')) { const t=l.trim(); if(!t||t.startsWith('#')) continue; const i=t.indexOf('='); if(i===-1)continue; env[t.slice(0,i).trim()]=t.slice(i+1).trim(); }

const client = new Client();
client.ftp.verbose = false;
await client.access({host: env.PRODUCTION_FTP_HOST, user: env.PRODUCTION_FTP_USER, password: env.PRODUCTION_FTP_PASSWORD, port: 21, secure: false});

// Check working vs non-working dirs
const testDirs = [
  { name: 'titanium-cnc-machining-services', status: '✅ WORKS' },
  { name: 'titanium-surface-treatment', status: '❌ 404' },
  { name: 'branded-custom-packaging-services', status: '❌ 404' },
  { name: 'laser-marking-custom-logo', status: '❌ 404' },
];

for (const dir of testDirs) {
  try {
    await client.cd(env.PRODUCTION_SERVER_PATH + '/' + dir.name);
    // Download index.html
    const chunks = [];
    const writable = new Writable({
      write(chunk, encoding, callback) {
        chunks.push(chunk);
        callback();
      }
    });
    await client.downloadTo(writable, 'index.html');
    const content = Buffer.concat(chunks);
    const firstLine = content.toString('utf-8').substring(0, 100).replace(/\n/, '');
    console.log(`${dir.status} ${dir.name}/index.html - ${content.length} bytes - starts: ${firstLine}...`);
    await client.cd(env.PRODUCTION_SERVER_PATH);
  } catch (err) {
    console.log(`❌ ERROR ${dir.name}: ${err.message}`);
    try { await client.cd(env.PRODUCTION_SERVER_PATH); } catch(e) {}
  }
}

await client.close();