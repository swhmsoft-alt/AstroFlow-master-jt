/**
 * Translate ALL 13 equipment items to 9 languages.
 * Uses a robust approach: directly reads the TS file but handles edge cases.
 * 
 * Usage: node scripts/translate-all-equipment.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const DEEPSEEK_API_KEY = 'sk-b187f5cf84c74f9aac8bd04b7fd0d2f8';
const DEEPSEEK_API_URL = 'https://api.deepseek.com/v1/chat/completions';
const LANG_NAMES = { de:'German', ja:'Japanese', fr:'French', es:'Spanish', pt:'Portuguese', it:'Italian', ko:'Korean', nl:'Dutch', pl:'Polish' };
const i18nDir = path.resolve(ROOT, 'src/i18n/translations');

// All 13 equipment keys in order
const EQUIP_KEYS = [
  '5-axis-machining-center', 'turn-mill-cnc', 'high-pressure-coolant',
  'automatic-tool-magazine', 'tool-presetter', 'chip-management-fire-suppression',
  'vacuum-heat-treat-furnace', 'cmm', 'laser-tracker-3d-scanner',
  'anodizing-surface-treatment', 'wire-edm', 'automatic-bar-feeder',
  'robotic-pallet-system'
];

// Read the TypeScript file
const tsCode = fs.readFileSync(path.resolve(ROOT, 'src/data/equipment.ts'), 'utf-8');

/**
 * Extract a complete equipment object from TypeScript.
 * Returns valid JSON string, or null if failed.
 */
function extractEquipmentAsJSON(key) {
  // Find the entry
  const idx = tsCode.indexOf(`"${key}"`);
  if (idx < 0) return null;
  
  // Find the opening brace after colon
  const colon = tsCode.indexOf(':', idx);
  let braceStart = colon + 1;
  while (braceStart < tsCode.length && tsCode[braceStart] !== '{') braceStart++;
  if (braceStart >= tsCode.length) return null;
  
  // Extract the object by counting braces
  let depth = 1;
  let inStr = false;
  let esc = false;
  let result = '{';
  
  for (let i = braceStart + 1; i < tsCode.length; i++) {
    const ch = tsCode[i];
    
    if (esc) { result += ch; esc = false; continue; }
    if (ch === '\\' && inStr) { result += ch; esc = true; continue; }
    
    if ((ch === '"' || ch === "'" || ch === '`') && !inStr) {
      inStr = ch;
      result += '"'; // Normalize to double quote
      continue;
    }
    if (inStr && ch === inStr) {
      inStr = false;
      result += '"';
      continue;
    }
    if (inStr) {
      result += ch;
      continue;
    }
    
    // Not in string
    if (ch === '{') depth++;
    if (ch === '}') { depth--; if (depth === 0) { result += '}'; break; } }
    
    // Normalize characters outside strings
    if (/\s/.test(ch)) continue; // Skip whitespace outside strings
    if (ch === ':') { result += ':'; continue; }
    if (ch === ',') { result += ','; continue; }
    if (ch === '[' || ch === ']') { result += ch; continue; }
    
    // Property name outside string - strip it and just add as bare string
    // Since we already know the structure, let's just skip property names
    // and only capture values
  }
  
  return result;
}

// Convert a fragment to clean JSON
function cleanJSON(raw) {
  // Remove TypeScript type annotations
  let s = raw
    .replace(/:\s*(EquipmentSection|EquipmentSpecSection|EquipmentData|EquipmentProperty|string\[\]|EquipmentMap|Record<string,\s*EquipmentData>|EquipmentProperty\[\])\s*/g, ': ')
    .replace(/:\s*(string|number|boolean)\s*/g, ': ')
    .replace(/\/\/.*$/gm, '')  // Remove comments
    .replace(/'/g, '"')        // Single quotes to double
    .replace(/`([^`]*)`/g, '"$1"')  // Template literals to quoted
    .replace(/,(\s*[}\]])/g, '$1')  // Trailing commas
    .trim();
  
  // Quote property names
  s = s.replace(/([{,])\s*(\w[\w]*)\s*(:)/g, '$1"$2"$3');
  
  return s;
}

// Collect leaf key-value pairs from parsed object
function collectKeys(obj, prefix, out) {
  if (typeof obj === 'string') {
    out[prefix] = obj;
  } else if (Array.isArray(obj)) {
    obj.forEach((v, i) => collectKeys(v, `${prefix}.${i}`, out));
  } else if (obj && typeof obj === 'object') {
    for (const [k, v] of Object.entries(obj)) {
      if (k === 'key' || k === 'category') continue;
      collectKeys(v, `${prefix}.${k}`, out);
    }
  }
}

// Parse all equipment items
console.log('Extracting equipment data...');
const allKeys = {};
let successCount = 0;

for (const ek of EQUIP_KEYS) {
  const raw = extractEquipmentAsJSON(ek);
  if (!raw) { console.log(`  ✗ ${ek}: extraction failed`); continue; }
  
  try {
    // Try parsing directly first
    const json = cleanJSON(raw);
    const obj = JSON.parse(json);
    collectKeys(obj, `equipment.${ek}`, allKeys);
    successCount++;
  } catch (e) {
    console.log(`  ✗ ${ek}: ${e.message}`);
  }
}

console.log(`\n✓ ${successCount}/${EQUIP_KEYS.length} items parsed`);
console.log(`✓ ${Object.keys(allKeys).length} total keys`);

// Save for reference
fs.writeFileSync(path.resolve(ROOT, 'output', 'all-keys-full.json'), JSON.stringify(allKeys, null, 2));

async function translate(texts, lang) {
  const langName = LANG_NAMES[lang];
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
            { role: 'system', content: `You are a translator for industrial manufacturing and CNC machining terms. Translate the following English JSON to ${langName}. Keep ALL keys unchanged. Return ONLY valid JSON.` },
            { role: 'user', content: `Translate to ${langName}:\n${payload}` },
          ],
          temperature: 0.1,
          max_tokens: 16000,
        }),
      });
      if (!resp.ok) { Object.assign(result, chunk); continue; }
      const data = await resp.json();
      let txt = data.choices[0].message.content;
      const m = txt.match(/```(?:json)?\s*([\s\S]*?)```/);
      if (m) txt = m[1];
      try { Object.assign(result, JSON.parse(txt)); process.stdout.write('.'); }
      catch { Object.assign(result, chunk); process.stdout.write('x'); }
    } catch { Object.assign(result, chunk); process.stdout.write('!'); }
    await new Promise(r => setTimeout(r, 200));
  }
  return result;
}

// Add to en.json first
console.log('\n\nUpdating en.json...');
const enPath = path.join(i18nDir, 'en.json');
let en = JSON.parse(fs.readFileSync(enPath, 'utf-8'));
let enAdded = 0;
for (const [k, v] of Object.entries(allKeys)) {
  if (!(k in en)) { en[k] = v; enAdded++; }
}
fs.writeFileSync(enPath, JSON.stringify(en, null, 2) + '\n');
console.log(`Added ${enAdded} new keys to en.json`);

// Translate to all languages
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
  console.log(`  ${c} keys to translate`);
  
  const translated = await translate(need, lang);
  let added = 0;
  for (const [k, v] of Object.entries(translated)) {
    if (!(k in content)) { content[k] = v; added++; }
  }
  fs.writeFileSync(fp, JSON.stringify(content, null, 2) + '\n');
  console.log(`  → ${added} added`);
}

console.log('\n✓ Complete!');