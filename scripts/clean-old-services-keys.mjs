/**
 * Clean old proc0/proc1 style service keys from all language files.
 * These were generated with an older naming convention and need to be
 * replaced by new 0/1/2 style keys.
 *
 * Usage: node scripts/clean-old-services-keys.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const TRANSLATIONS_DIR = path.resolve(__dirname, '..', 'src/i18n/translations');

const files = fs.readdirSync(TRANSLATIONS_DIR).filter(f => f.endsWith('.json'));

let totalRemoved = 0;

for (const file of files) {
  const filepath = path.join(TRANSLATIONS_DIR, file);
  const original = JSON.parse(fs.readFileSync(filepath, 'utf-8'));
  const keys = Object.keys(original);
  
  // Match old pattern: services.xxx.proc0 or services.xxx.proc1 etc
  // But NOT new pattern: services.xxx.0 or services.xxx.1
  const oldKeys = keys.filter(k => {
    if (!k.startsWith('services.')) return false;
    // Look for .procN or .capN or .detailN immediately after prefix
    const rest = k.replace(/^services\.\w+\./, '');
    return /^proc\d+\./.test(rest) || /^cap\d+$/.test(rest) || /^detail\d+$/.test(rest);
  });
  
  if (oldKeys.length === 0) {
    console.log(`  ${file}: 0 old keys`);
    continue;
  }
  
  const updated = { ...original };
  for (const key of oldKeys) {
    delete updated[key];
  }
  
  fs.writeFileSync(filepath, JSON.stringify(updated, null, 2) + '\n', 'utf-8');
  console.log(`  ${file}: removed ${oldKeys.length} old keys`);
  totalRemoved += oldKeys.length;
}

console.log(`\nTotal old keys removed: ${totalRemoved}`);