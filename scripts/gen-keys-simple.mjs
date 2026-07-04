/**
 * Generate equipment i18n keys by directly reading equipment.ts,
 * converting to JSON, extracting keys, and writing to all languages.
 * 
 * Usage: node scripts/gen-keys-simple.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const DEEPSEEK_API_KEY = 'sk-b187f5cf84c74f9aac8bd04b7fd0d2f8';
const DEEPSEEK_API_URL = 'https://api.deepseek.com/v1/chat/completions';
const LANG_NAMES = { de:'German', ja:'Japanese', fr:'French', es:'Spanish', pt:'Portuguese', it:'Italian', ko:'Korean', nl:'Dutch', pl:'Polish' };
const i18nDir = path.join(ROOT, 'src', 'i18n', 'translations');

// Read the TypeScript file
const code = fs.readFileSync(path.join(ROOT, 'src/data/equipment.ts'), 'utf-8');

// Find all equipment key names and their objects
const equipKeys = ['5-axis-machining-center','turn-mill-cnc','high-pressure-coolant','automatic-tool-magazine','tool-presetter','chip-management-fire-suppression','vacuum-heat-treat-furnace','cmm','laser-tracker-3d-scanner','anodizing-surface-treatment','wire-edm','automatic-bar-feeder','robotic-pallet-system'];

// Pre-parse approach: find each equipment entry and extract it
function extractEntry(code, key) {
  const idx = code.indexOf(`"${key}"`);
  if (idx < 0) return null;
  const colon = code.indexOf(':', idx);
  if (colon < 0) return null;
  
  // Start after colon, find the opening brace
  let start = colon + 1;
  while (start < code.length && code[start] !== '{') start++;
  if (start >= code.length) return null;
  
  // Count braces to find end
  let depth = 1;
  let inStr = false;
  let esc = false;
  let end = start + 1;
  for (let i = end; i < code.length; i++) {
    const ch = code[i];
    if (esc) { esc = false; continue; }
    if (ch === '\\' && inStr) { esc = true; continue; }
    if ((ch === '"' || ch === "'" || ch === '`') && !esc) {
      if (!inStr) inStr = ch;
      else if (inStr === ch) inStr = false;
      continue;
    }
    if (inStr) continue;
    if (ch === '{') depth++;
    if (ch === '}') { depth--; if (depth === 0) { end = i + 1; break; } }
  }
  
  return code.slice(start, end);
}

// Quick TypeScript → JSON converter
function toJSON(ts) {
  let s = ts
    .replace(/\/\/.*\n?/g, '\n')                    // Remove comments
    .replace(/:\s*EquipmentSection|:\s*EquipmentSpecSection|:\s*EquipmentData|:\s*EquipmentProperty|:\s*string\[\]|:\s*string|:\s*number|:\s*boolean|:\s*EquipmentMap|:\s*Record<string,\s*EquipmentData>|:\s*EquipmentProperty\[\]/g, '')
    .replace(/'/g, '"')                               // Single to double quotes
    .replace(/`([^`]*)`/g, '"$1"')                    // Template strings to quoted
    .replace(/([{,]\s*)(\w[\w]*)(\s*:)/g, '$1"$2"$3') // Quote property names
    .replace(/,\s*([}\]])/g, '$1')                     // Remove trailing commas
    .trim();
  return s;
}

// Build the full data by extracting each entry
const data = {};
for (const ek of equipKeys) {
  const entry = extractEntry(code, ek);
  if (!entry) { console.log(`  ✗ Could not extract ${ek}`); continue; }
  const json = toJSON(entry);
  try {
    const parsed = JSON.parse(json);
    data[ek] = parsed;
    console.log(`  ✓ ${ek}`);
  } catch (e) {
    console.log(`  ✗ ${ek}: ${e.message}`);
  }
}

// Collect all leaf keys
function collect(obj, prefix, out) {
  if (typeof obj === 'string') { out[prefix] = obj; }
  else if (Array.isArray(obj)) { obj.forEach((v, i) => collect(v, `${prefix}.${i}`, out)); }
  else if (obj && typeof obj === 'object') {
    for (const [k, v] of Object.entries(obj)) {
      if (k === 'key' || k === 'category') continue;
      collect(v, `${prefix}.${k}`, out);
    }
  }
}

const allKeys = {};
for (const [ek, eq] of Object.entries(data)) {
  collect(eq, `equipment.${ek}`, allKeys);
}

console.log(`\nTotal: ${Object.keys(data).length} equipment items, ${Object.keys(allKeys).length} translation keys`);

// Save keys for reference
fs.writeFileSync(path.join(ROOT, 'output', 'all-keys.json'), JSON.stringify(allKeys, null, 2));

// Add to en.json
const enPath = path.join(i18nDir, 'en.json');
let en = JSON.parse(fs.readFileSync(enPath, 'utf-8'));
let added = 0;
for (const [k, v] of Object.entries(allKeys)) {
  if (!(k in en)) { en[k] = v; added++; }
}
fs.writeFileSync(enPath, JSON.stringify(en, null, 2) + '\n');
console.log(`Added ${added} new keys to en.json`);

// Translate to other languages
async function translate(texts, lang) {
  const langName = LANG_NAMES[lang];
  const entries = Object.entries(texts);
  const result = {};
  const chunkSize = 100;
  
  for (let i = 0; i < entries.length; i += chunkSize) {
    const chunk = Object.fromEntries(entries.slice(i, i + chunkSize));
    const payload = JSON.stringify(chunk);
    
    try {
      const resp = await fetch(DEEPSEEK_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${DEEPSEEK_API_KEY}` },
        body: JSON.stringify({
          model: 'deepseek-chat',
          messages: [
            { role: 'system', content: `You are a translator for industrial manufacturing terms. Translate the following English JSON to ${langName}. Keep all keys unchanged. Return ONLY valid JSON.` },
            { role: 'user', content: `Translate to ${langName}:\n${payload}` },
          ],
          temperature: 0.1,
          max_tokens: 16000,
        }),
      });
      if (!resp.ok) { Object.assign(result, chunk); continue; }
      const d = await resp.json();
      let t = d.choices[0].message.content;
      const m = t.match(/```(?:json)?\s*([\s\S]*?)```/);
      if (m) t = m[1];
      try { Object.assign(result, JSON.parse(t)); } catch { Object.assign(result, chunk); }
      process.stdout.write('.');
    } catch { Object.assign(result, chunk); }
    await new Promise(r => setTimeout(r, 200));
  }
  return result;
}

const langs = ['de', 'ja', 'fr', 'es', 'pt', 'it', 'ko', 'nl', 'pl'];
for (const lang of langs) {
  console.log(`\n${LANG_NAMES[lang]} (${lang}):`);
  const fp = path.join(i18nDir, `${lang}.json`);
  let content = JSON.parse(fs.readFileSync(fp, 'utf-8'));
  const need = {};
  for (const [k, v] of Object.entries(allKeys)) {
    if (!(k in content)) need[k] = v;
  }
  const c = Object.keys(need).length;
  if (c === 0) { console.log('  ✓ All done'); continue; }
  console.log(`  ${c} to translate`);
  const translated = await translate(need, lang);
  let a = 0;
  for (const [k, v] of Object.entries(translated)) {
    if (!(k in content)) { content[k] = v; a++; }
  }
  fs.writeFileSync(fp, JSON.stringify(content, null, 2) + '\n');
  console.log(`  → ${a} added`);
}

console.log('\n✓ Complete!');