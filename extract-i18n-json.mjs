/**
 * Extract i18n translations from ui.ts into separate JSON files.
 *
 * Steps:
 * 1. Parse ui.ts → extract `en` and `de` objects as JSON
 * 2. Save to src/i18n/translations/en.json and de.json
 * 3. Fill missing keys in de.json with en fallback
 * 4. Rewrite ui.ts as lightweight JSON loader
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const UI_TS = path.resolve(__dirname, 'src/i18n/ui.ts');
const OUT_DIR = path.resolve(__dirname, 'src/i18n/translations');

// ── 1. Read ui.ts ───────────────────────────────────────
const content = fs.readFileSync(UI_TS, 'utf-8');

// ── 2. Extract the `en` and `de` sections ───────────────
// Strategy: find 'en: {' and 'de: {' and match the block via brace counting
function extractSection(source, sectionName) {
  const regex = new RegExp(`(?:^|\\s)${sectionName}:\\s*\\{`);
  const match = regex.exec(source);
  if (!match) throw new Error(`Cannot find section "${sectionName}"`);

  let start = match.index + match[0].length - 1; // position of the opening `{`
  let braceCount = 0;
  let inString = false;
  let escape = false;
  let i = start;

  // Find the matching closing brace
  do {
    const ch = source[i];
    if (escape) { escape = false; i++; continue; }
    if (ch === '\\' && inString) { escape = true; i++; continue; }
    if (ch === "'" && !inString) { inString = true; i++; continue; }
    if (ch === "'" && inString) { inString = false; i++; continue; }
    if (ch === '{' && !inString) braceCount++;
    if (ch === '}' && !inString) braceCount--;
    i++;
  } while (braceCount > 0 && i < source.length);

  const block = source.slice(start, i);
  return block;
}

console.log('Extracting en section...');
const enBlock = extractSection(content, 'en');
console.log('Extracting de section...');
const deBlock = extractSection(content, 'de');

// ── 3. Parse key-value lines from a block ───────────────
function parseKeyValues(block) {
  const result = {};
  // Match lines like:   'key': 'value',  (including escaped quotes)
  const kvRegex = /^\s*'((?:[^'\\]|\\.)*)'\s*:\s*'((?:[^'\\]|\\.)*)'\s*,?$/gm;
  let m;
  while ((m = kvRegex.exec(block)) !== null) {
    let key = m[1];
    let value = m[2];
    // Unescape single quotes in value
    value = value.replace(/\\'/g, "'");
    result[key] = value;
  }
  return result;
}

const en = parseKeyValues(enBlock);
const de = parseKeyValues(deBlock);

console.log(`  en keys: ${Object.keys(en).length}`);
console.log(`  de keys: ${Object.keys(de).length}`);

// ── 4. Find missing keys in de ──────────────────────────
const missingKeys = Object.keys(en).filter(k => !(k in de));
console.log(`  missing in de: ${missingKeys.length}`);

// Fill missing keys with English fallback
for (const k of missingKeys) {
  de[k] = en[k];
}

// Also remove extra keys in de that don't exist in en (shouldn't happen, but safe)
const extraKeys = Object.keys(de).filter(k => !(k in en));
if (extraKeys.length > 0) {
  console.log(`  extra in de (will keep): ${extraKeys.length}`);
}

// ── 5. Sort keys alphabetically for clean diff ──────────
function sortKeys(obj) {
  const sorted = {};
  for (const k of Object.keys(obj).sort()) {
    sorted[k] = obj[k];
  }
  return sorted;
}

const enSorted = sortKeys(en);
const deSorted = sortKeys(de);

// ── 6. Write JSON files ─────────────────────────────────
fs.mkdirSync(OUT_DIR, { recursive: true });

fs.writeFileSync(
  path.join(OUT_DIR, 'en.json'),
  JSON.stringify(enSorted, null, 2),
  'utf-8'
);
console.log('  ✓ en.json written');

fs.writeFileSync(
  path.join(OUT_DIR, 'de.json'),
  JSON.stringify(deSorted, null, 2),
  'utf-8'
);
console.log('  ✓ de.json written');

// ── 7. Verify key count matches ─────────────────────────
const enCount = Object.keys(enSorted).length;
const deCount = Object.keys(deSorted).length;
console.log(`\nVerification:`);
console.log(`  en.json: ${enCount} keys`);
console.log(`  de.json: ${deCount} keys`);
console.log(`  Match: ${enCount === deCount ? '✓ YES' : '✗ NO (difference: ' + Math.abs(enCount - deCount) + ')'}`);

console.log('\nDone. Now rewrite ui.ts to import from JSON files.');