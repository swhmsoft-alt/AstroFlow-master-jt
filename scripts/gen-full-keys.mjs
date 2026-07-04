/**
 * Extract all equipment keys from the TypeScript data file.
 * Converts TypeScript object to JSON, extracts all key-value pairs.
 * Then merges into en.json and translates to all 9 languages via DeepSeek.
 * 
 * Usage: node scripts/gen-full-keys.mjs [--export-only]
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

const DEEPSEEK_API_KEY = 'sk-b187f5cf84c74f9aac8bd04b7fd0d2f8';
const DEEPSEEK_API_URL = 'https://api.deepseek.com/v1/chat/completions';

const LANG_NAMES = { de:'German', ja:'Japanese', fr:'French', es:'Spanish', pt:'Portuguese', it:'Italian', ko:'Korean', nl:'Dutch', pl:'Polish' };

const onlyExport = process.argv.includes('--export-only');

// Read the TypeScript file
const code = fs.readFileSync(path.join(ROOT, 'src/data/equipment.ts'), 'utf-8');

// Step 1: Extract the EQUIPMENT_DATA object  
const startMarker = 'export const EQUIPMENT_DATA: EquipmentMap = {';
const start = code.indexOf(startMarker) + startMarker.length - 1; // Include the opening brace

// Find the final closing brace
let depth = 0, inStr = false, esc = false;
let objEnd = -1;
for (let i = start; i < code.length; i++) {
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
  if (ch === '}') { depth--; if (depth === 0) { objEnd = i + 1; break; } }
}

const objStr = code.slice(start, objEnd || code.length);

// Step 2: Convert to JSON by normalizing TypeScript syntax
let json = objStr
  .replace(/\/\/.*\n?/g, '\n')               // Remove comments
  .replace(/:\s*(EquipmentSection|EquipmentSpecSection|EquipmentData|EquipmentProperty|string\[\]|EquipmentMap|Record<string,\s*EquipmentData>|EquipmentProperty\[\])\s*$/gm, '')
  .replace(/:\s*(string|number|boolean)\s*$/gm, '')
  .replace(/([{,]\s*)(\w+)(\s*:)/g, '$1"$2"$3')  // Quote unquoted keys
  .replace(/'/g, '"')                            // Single to double quotes
  .replace(/,\s*([}\]])/g, '$1')                 // Remove trailing commas
  .replace(/,\s*$/gm, '')                        // Remove trailing commas at line ends
  .trim();

// Write debug version
fs.writeFileSync(path.join(ROOT, 'output', 'clean-json.json'), json);

// Parse
let equipmentData;
try {
  equipmentData = JSON.parse(json);
  console.log('✓ Parsed EQUIPMENT_DATA successfully');
} catch (e) {
  console.error('Parse error:', e.message);
  process.exit(1);
}

// Step 3: Collect all leaf key-value pairs
function collectKeys(obj, prefix, out) {
  if (typeof obj === 'string') {
    out[prefix] = obj;
  } else if (Array.isArray(obj)) {
    for (let i = 0; i < obj.length; i++) {
      collectKeys(obj[i], `${prefix}.${i}`, out);
    }
  } else if (obj && typeof obj === 'object') {
    for (const [k, v] of Object.entries(obj)) {
      if (k === 'key' || k === 'category') continue;
      collectKeys(v, `${prefix}.${k}`, out);
    }
  }
}

const allKeys = {};
for (const [ek, eq] of Object.entries(equipmentData)) {
  collectKeys(eq, `equipment.${ek}`, allKeys);
}

console.log(`\n=== Equipment Summary ===`);
console.log(`Equipment items: ${Object.keys(equipmentData).length}`);
console.log(`Total translation keys: ${Object.keys(allKeys).length}`);

// Save the keys
const keysPath = path.join(ROOT, 'output', 'equipment-i18n-keys.json');
fs.writeFileSync(keysPath, JSON.stringify(allKeys, null, 2));
console.log(`Saved keys to ${keysPath}`);

if (onlyExport) {
  console.log('Export-only mode. Done.');
  process.exit(0);
}

// Step 4: Merge into en.json
const i18nDir = path.join(ROOT, 'src', 'i18n', 'translations');
const enPath = path.join(i18nDir, 'en.json');
let enData = JSON.parse(fs.readFileSync(enPath, 'utf-8'));
let enAdded = 0;
for (const [k, v] of Object.entries(allKeys)) {
  if (!(k in enData)) { enData[k] = v; enAdded++; }
}
fs.writeFileSync(enPath, JSON.stringify(enData, null, 2) + '\n');
console.log(`\nAdded ${enAdded} new keys to en.json`);

// Step 5: Translate to other languages
async function translateBatch(texts, lang) {
  const langName = LANG_NAMES[lang];
  const keys = Object.entries(texts);
  const result = {};
  
  for (let i = 0; i < keys.length; i += 80) {
    const chunk = Object.fromEntries(keys.slice(i, i + 80));
    const chunkPayload = JSON.stringify(chunk, null, 2);
    
    try {
      const resp = await fetch(DEEPSEEK_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${DEEPSEEK_API_KEY}` },
        body: JSON.stringify({
          model: 'deepseek-chat',
          messages: [
            { role: 'system', content: `You are a professional translator specializing in industrial manufacturing, CNC machining, and metallurgy. Translate the following English JSON to ${langName}. Preserve all keys exactly - only translate values. Return ONLY valid JSON.` },
            { role: 'user', content: `Translate these equipment manufacturing terms to ${langName}. Return ONLY valid JSON:\n\n${chunkPayload}` },
          ],
          temperature: 0.2,
          max_tokens: 16000,
        }),
      });
      
      if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
      const data = await resp.json();
      let txt = data.choices[0].message.content;
      const jm = txt.match(/```(?:json)?\s*([\s\S]*?)```/);
      if (jm) txt = jm[1];
      const parsed = JSON.parse(txt);
      Object.assign(result, parsed);
      process.stdout.write('.');
    } catch (err) {
      console.log(`\n  Chunk ${i/80 + 1} error: ${err.message}`);
      Object.assign(result, chunk);
    }
    await new Promise(r => setTimeout(r, 200));
  }
  return result;
}

const langs = ['de', 'ja', 'fr', 'es', 'pt', 'it', 'ko', 'nl', 'pl'];
for (const lang of langs) {
  console.log(`\nTranslating to ${LANG_NAMES[lang]} (${lang})...`);
  const fp = path.join(i18nDir, `${lang}.json`);
  let content = JSON.parse(fs.readFileSync(fp, 'utf-8'));
  
  const toTranslate = {};
  for (const [k, v] of Object.entries(allKeys)) {
    if (!(k in content)) toTranslate[k] = v;
  }
  
  if (Object.keys(toTranslate).length === 0) {
    console.log('  ✓ All keys already present.');
    continue;
  }
  
  console.log(`  ${Object.keys(toTranslate).length} keys to translate...`);
  const translated = await translateBatch(toTranslate, lang);
  
  let added = 0;
  for (const [k, v] of Object.entries(translated)) {
    if (!(k in content)) { content[k] = v; added++; }
  }
  fs.writeFileSync(fp, JSON.stringify(content, null, 2) + '\n');
  console.log(`  → Added ${added} keys`);
}

console.log(`\n✓ Done!`);