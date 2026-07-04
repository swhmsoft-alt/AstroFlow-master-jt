/**
 * Add equipment translation keys to all language files.
 * English gets the original values; other languages get English as placeholder.
 * Usage: node scripts/add-equipment-keys.mjs
 */
import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const langs = ['en','de','ja','fr','es','pt','it','ko','nl','pl'];
const tDir = join(root, 'src', 'i18n', 'translations');

function collectKeys(obj, prefix, out) {
  if (typeof obj === 'string' || typeof obj === 'number') {
    out[prefix] = String(obj);
  } else if (Array.isArray(obj)) {
    for (let i = 0; i < obj.length; i++) {
      collectKeys(obj[i], `${prefix}.${i}`, out);
    }
  } else if (obj !== null && typeof obj === 'object') {
    for (const [k, v] of Object.entries(obj)) {
      if (k !== 'key' && k !== 'category') continue; // skip metadata
      collectKeys(v, `${prefix}.${k}`, out);
    }
  }
}

// Read the complete equipment data
const data = JSON.parse(readFileSync(join(root, 'scripts', 'equipment-data.json'), 'utf-8'));

// Build all translation keys
const allKeys = {};
for (const [ek, eq] of Object.entries(data)) {
  collectKeys(eq, `equipment.${ek}`, allKeys);
}

console.log(`Total equipment keys: ${Object.keys(allKeys).length}`);

// Update each language file
for (const lang of langs) {
  const fp = join(tDir, `${lang}.json`);
  let content = JSON.parse(readFileSync(fp, 'utf-8'));
  let added = 0;
  for (const [k, v] of Object.entries(allKeys)) {
    if (!(k in content)) {
      content[k] = v;
      added++;
    }
  }
  writeFileSync(fp, JSON.stringify(content, null, 2) + '\n');
  console.log(`${lang}.json: +${added} equipment keys`);
}