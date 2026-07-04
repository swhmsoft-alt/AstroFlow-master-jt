/**
 * Extract the 4 missing equipment items (turn-mill-cnc, automatic-tool-magazine,
 * tool-presetter, automatic-bar-feeder) and add their keys to all language files.
 * 
 * Usage: node scripts/fix-missing-equipment.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

const MISSING = ['turn-mill-cnc', 'automatic-tool-magazine', 'tool-presetter', 'automatic-bar-feeder'];
const LANGS = ['en', 'de', 'ja', 'fr', 'es', 'pt', 'it', 'ko', 'nl', 'pl'];

const code = fs.readFileSync(path.join(ROOT, 'src/data/equipment.ts'), 'utf-8');

/**
 * Extract a complete equipment entry from TypeScript by brace counting.
 */
function extractEntry(key) {
  const idx = code.indexOf('"' + key + '"');
  if (idx < 0) { console.log('  Not found:', key); return null; }
  
  const colon = code.indexOf(':', idx);
  let start = colon + 1;
  while (start < code.length && code[start] !== '{') start++;
  
  let depth = 0, inStr = false, esc = false;
  let result = '';
  for (let i = start; i < code.length; i++) {
    const ch = code[i];
    if (esc) { result += ch; esc = false; continue; }
    if (ch === '\\' && inStr) { result += ch; esc = true; continue; }
    
    // Handle all quote types
    if ((ch === '"' || ch === "'" || ch === '`') && !esc) {
      if (!inStr) { inStr = ch; result += '"'; }
      else if (inStr === ch) { inStr = false; result += '"'; }
      else result += ch;
      continue;
    }
    if (inStr) { result += ch; continue; }
    
    result += ch;
    if (ch === '{') depth++;
    if (ch === '}') { depth--; if (depth < 0) break; }
  }
  return result;
}

/**
 * Convert TypeScript object literal to valid JSON.
 */
function ts2json(ts) {
  let s = ts
    .replace(/\/\/.*\n?/g, '')       // Remove line comments
    .replace(/`([^`]*)`/g, '"$1"')   // Template literals → quoted
    .replace(/'/g, '"')              // Single quotes → double
    .replace(/([{,]\s*)(\w[\w]*)(\s*:)/g, '$1"$2"$3')  // Quote property names
    .replace(/:\s*(EquipmentSection|EquipmentSpecSection|EquipmentData|EquipmentProperty|string\[\]|EquipmentMap|Record<string,\s*EquipmentData>|EquipmentProperty\[\])\s*/g, ':')
    .replace(/:\s*string/g, '').replace(/:\s*number/g, '').replace(/:\s*boolean/g, '')
    .replace(/,\s*([}\]])/g, '$1')   // Remove trailing commas
    .trim();
  return s;
}

/**
 * Collect all leaf string values from a parsed object.
 */
function collect(obj, prefix, out) {
  if (typeof obj === 'string') { out[prefix] = obj; }
  else if (Array.isArray(obj)) { obj.forEach((v, i) => collect(v, prefix + '.' + i, out)); }
  else if (obj && typeof obj === 'object') {
    for (const [k, v] of Object.entries(obj)) {
      if (k === 'key' || k === 'category') continue;
      collect(v, prefix + '.' + k, out);
    }
  }
}

// Parse all missing items
console.log('Extracting missing equipment items...');
const allKeys = {};
let ok = 0, fail = 0;

for (const key of MISSING) {
  const raw = extractEntry(key);
  if (!raw) { fail++; continue; }
  
  const json = ts2json(raw);
  try {
    const obj = JSON.parse(json);
    collect(obj, 'equipment.' + key, allKeys);
    console.log('  ✓ ' + key);
    ok++;
  } catch (e) {
    console.log('  ✗ ' + key + ': ' + e.message);
    fail++;
  }
}

console.log(`\nParsed ${ok}/${MISSING.length} items, ${Object.keys(allKeys).length} total keys`);

// Add to all language files
console.log('\nAdding keys to language files...');
for (const lang of LANGS) {
  const fp = path.join(ROOT, 'src/i18n/translations', lang + '.json');
  let content = JSON.parse(fs.readFileSync(fp, 'utf-8'));
  let added = 0;
  for (const [k, v] of Object.entries(allKeys)) {
    if (!(k in content)) { content[k] = v; added++; }
  }
  if (added > 0) {
    fs.writeFileSync(fp, JSON.stringify(content, null, 2) + '\n');
  }
  console.log(`  ${lang}: +${added} keys`);
}

// Now translate the new keys for 9 target languages
const DEEPSEEK_API_KEY = 'sk-b187f5cf84c74f9aac8bd04b7fd0d2f8';
const DEEPSEEK_API_URL = 'https://api.deepseek.com/v1/chat/completions';
const LANG_NAMES = { de:'German', ja:'Japanese', fr:'French', es:'Spanish', pt:'Portuguese', it:'Italian', ko:'Korean', nl:'Dutch', pl:'Polish' };

async function translate(texts, lang) {
  const entries = Object.entries(texts);
  const result = {};
  
  for (let i = 0; i < entries.length; i += 80) {
    const chunk = Object.fromEntries(entries.slice(i, i + 80));
    const payload = JSON.stringify(chunk);
    
    try {
      const resp = await fetch(DEEPSEEK_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${DEEPSEEK_API_KEY}` },
        body: JSON.stringify({
          model: 'deepseek-chat',
          messages: [
            { role: 'system', content: `Translate the following equipment manufacturing JSON to ${LANG_NAMES[lang]}. Keep ALL keys unchanged. Return ONLY valid JSON.` },
            { role: 'user', content: `Translate to ${LANG_NAMES[lang]}:\n${payload}` },
          ],
          temperature: 0.1,
          max_tokens: 16000,
        }),
      });
      if (!resp.ok) { Object.assign(result, chunk); process.stdout.write('!'); continue; }
      const data = await resp.json();
      let txt = data.choices[0].message.content;
      const m = txt.match(/```(?:json)?\s*([\s\S]*?)```/);
      if (m) txt = m[1];
      try { Object.assign(result, JSON.parse(txt)); process.stdout.write('.'); }
      catch { Object.assign(result, chunk); process.stdout.write('x'); }
    } catch { Object.assign(result, chunk); process.stdout.write('?'); }
    await new Promise(r => setTimeout(r, 200));
  }
  return result;
}

console.log('\n\nTranslating to target languages...');
const targetLangs = ['de', 'ja', 'fr', 'es', 'pt', 'it', 'ko', 'nl', 'pl'];

for (const lang of targetLangs) {
  console.log(`\n${LANG_NAMES[lang]} (${lang}):`);
  const fp = path.join(ROOT, 'src/i18n/translations', lang + '.json');
  let content = JSON.parse(fs.readFileSync(fp, 'utf-8'));
  
  const need = {};
  for (const [k, v] of Object.entries(allKeys)) {
    if (!(k in content)) need[k] = v;
  }
  
  const c = Object.keys(need).length;
  if (c === 0) { console.log('  ✓ Nothing to translate'); continue; }
  console.log('  ' + c + ' keys to translate');
  
  const translated = await translate(need, lang);
  let added = 0;
  for (const [k, v] of Object.entries(translated)) {
    if (!(k in content)) { content[k] = v; added++; }
  }
  fs.writeFileSync(fp, JSON.stringify(content, null, 2) + '\n');
  console.log('  → ' + added + ' keys added');
}

console.log('\n✓ Done!');