import { Client } from 'basic-ftp';
import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const envPath = resolve(__dirname, '.env.production');
const content = readFileSync(envPath, 'utf-8');
const env = {};
for (const line of content.split('\n')) {
  const t = line.trim();
  if (!t || t.startsWith('#')) continue;
  const i = t.indexOf('=');
  if (i === -1) continue;
  env[t.slice(0,i).trim()] = t.slice(i+1).trim();
}

const dirs = [
  'titanium-surface-treatment',
  'titanium-surface-treatment/anodizing',
  'titanium-surface-treatment/chemical-passivation',
  'titanium-surface-treatment/polishing-sandblasting',
  'titanium-cnc-machining-services',
  'titanium-cnc-machining-services/3-5-axis-cnc-machining',
  'titanium-cnc-machining-services/cnc-milling-turning',
  'titanium-cnc-machining-services/custom-industrial-components',
  'titanium-cnc-machining-services/wire-edm-machining',
  'titanium-additive-manufacturing',
  'titanium-additive-manufacturing/3d-printing-slm',
  'titanium-additive-manufacturing/rapid-prototyping',
  'titanium-additive-manufacturing/low-volume-production',
  'titanium-fabrication-services',
  'titanium-fabrication-services/laser-cutting',
  'titanium-fabrication-services/waterjet-cutting',
  'titanium-fabrication-services/titanium-welding-assembly',
  'titanium-forming-heavy-manufacturing',
  'titanium-forming-heavy-manufacturing/titanium-forging',
  'titanium-forming-heavy-manufacturing/titanium-extrusion',
  'titanium-forming-heavy-manufacturing/raw-material-preparation-sizing',
  'branded-custom-packaging-services',
  'laser-marking-custom-logo',
];

console.log('🔍 Connecting to remote server to verify deployment...\n');

const client = new Client();
client.ftp.verbose = false;
try {
  await client.access({ host: env.PRODUCTION_FTP_HOST, user: env.PRODUCTION_FTP_USER, password: env.PRODUCTION_FTP_PASSWORD, port: 21, secure: false });

  // First list root contents
  await client.cd(env.PRODUCTION_SERVER_PATH);
  const rootFiles = await client.list();
  console.log('📂 Remote root contents:');
  for (const f of rootFiles) {
    if (f.isDirectory) {
      const marker = dirs.some(d => d === f.name || d.startsWith(f.name + '/')) ? '✅' : '  ';
      console.log(`   ${marker} ${f.name}/`);
    }
  }

  // Check each titanium subdirectory
  console.log('\n📋 Checking all titanium service subdirectories:');
  let ok = 0;
  let fail = 0;
  let missing = [];

  for (const dir of dirs) {
    try {
      await client.cd(dir);
      const files = await client.list();
      const hasIndex = files.some(f => f.name === 'index.html');
      if (hasIndex) {
        ok++;
        console.log(`   ✅ ${dir}/  (index.html present)`);
      } else {
        fail++;
        missing.push(dir);
        console.log(`   ❌ ${dir}/  (MISSING index.html)`);
      }
      await client.cd(env.PRODUCTION_SERVER_PATH);
    } catch (err) {
      fail++;
      missing.push(dir);
      console.log(`   ❌ ${dir}/  (DIRECTORY NOT FOUND!)`);
      await client.cd(env.PRODUCTION_SERVER_PATH);
    }
  }

  console.log(`\n📊 Result: ${ok} directories OK, ${fail} failed`);
  if (missing.length > 0) {
    console.log(`\n⚠️ Missing directories/pages:`);
    missing.forEach(d => console.log(`   - ${d}`));
  } else {
    console.log('\n🎉 All titanium service pages are fully synced!');
  }
} catch (err) {
  console.error('❌ Connection failed:', err.message);
} finally {
  client.close();
}