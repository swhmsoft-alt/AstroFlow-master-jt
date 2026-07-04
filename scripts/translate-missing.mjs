import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

const DEEPSEEK_API_KEY = 'sk-b187f5cf84c74f9aac8bd04b7fd0d2f8';
const DEEPSEEK_API_URL = 'https://api.deepseek.com/v1/chat/completions';
const LANG_NAMES = { de:'German', ja:'Japanese', fr:'French', es:'Spanish', pt:'Portuguese', it:'Italian', ko:'Korean', nl:'Dutch', pl:'Polish' };
const i18nDir = path.resolve(ROOT, 'src/i18n/translations');
const MISSING = ['turn-mill-cnc', 'automatic-tool-magazine', 'tool-presetter', 'automatic-bar-feeder'];

const code = fs.readFileSync(path.join(ROOT, 'src/data/equipment.ts'), 'utf-8');

// Extract the 4 items using the previously proven approach
function extractRaw(key) {
  const idx = code.indexOf('"'+key+'"');
  if (idx < 0) return null;
  const colon = code.indexOf(':', idx);
  let start = colon + 1;
  while (start < code.length && ' \n\r\t'.includes(code[start])) start++;
  let depth = 0, instr = false, esc = false, qc = null;
  for (let i = start; i < code.length; i++) {
    const ch = code[i];
    if (esc) { esc = false; continue; }
    if (ch === '\\' && instr) { esc = true; continue; }
    if ((ch === '"' || ch === "'" || ch === '`') && !esc) {
      if (!instr) { instr = true; qc = ch; }
      else if (ch === qc) { instr = false; qc = null; }
      continue;
    }
    if (instr) continue;
    if (ch === '{') depth++;
    if (ch === '}') { depth--; if (depth === 0) return code.slice(start, i+1); }
  }
  return null;
}

function clean(str) {
  let result = '';
  let instr = false, qc = null, esc = false;
  for (let i = 0; i < str.length; i++) {
    const ch = str[i];
    if (esc) { result += ch; esc = false; continue; }
    if (ch === '\\' && instr) { result += ch; esc = true; continue; }
    if (!instr && ch === '/' && i + 1 < str.length && str[i+1] === '/') {
      while (i < str.length && str[i] !== '\n') i++;
      continue;
    }
    if ((ch === '"' || ch === "'" || ch === '`') && !esc) {
      if (!instr) { instr = true; qc = ch; result += '"'; }
      else if (ch === qc) { instr = false; qc = null; result += '"'; }
      else { result += ch; }
      continue;
    }
    if (instr) { result += ch; continue; }
    if (ch === ':') {
      result += ':';
      let look = i + 1;
      while (look < str.length && ' \n\r\t'.includes(str[look])) look++;
      let word = '';
      while (look < str.length && /[a-zA-Z<>,\[\]]/.test(str[look])) { word += str[look]; look++; }
      if (/^(EquipmentSection|EquipmentSpecSection|EquipmentData|EquipmentProperty|string\[\]|EquipmentMap|Record|string|number|boolean)$/.test(word)) {
        i = look - 1;
      }
      continue;
    }
    result += ch;
  }
  result = result.replace(/,\s*([}\]])/g, '$1');
  result = result.replace(/([{,]\s*)(\w[\w]*)(\s*:)/g, '$1"$2"$3');
  return result;
}

function collect(o, prefix, out) {
  if (typeof o === 'string') out[prefix] = o;
  else if (Array.isArray(o)) o.forEach((v,i) => collect(v, prefix+'.'+i, out));
  else if (o && typeof o === 'object')
    for (const [k,v] of Object.entries(o))
      if (k !== 'key' && k !== 'category') collect(v, prefix+'.'+k, out);
}

const allKeys = {};
for (const key of MISSING) {
  const blob = extractRaw(key);
  const json = clean(blob);
  const obj = JSON.parse(json);
  collect(obj, 'equipment.'+key, allKeys);
}

console.log('Total keys from 4 missing items: ' + Object.keys(allKeys).length);

// Find items that need translation in each language
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
            { role: 'system', content: `Translate equipment manufacturing terms from English to ${LANG_NAMES[lang]}. Keep ALL keys unchanged. Return ONLY valid JSON.` },
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

const targetLangs = ['de', 'ja', 'fr', 'es', 'pt', 'it', 'ko', 'nl', 'pl'];
for (const lang of targetLangs) {
  console.log(`\n${LANG_NAMES[lang]} (${lang}):`);
  const fp = path.join(i18nDir, lang + '.json');
  let content = JSON.parse(fs.readFileSync(fp, 'utf-8'));
  
  // Find keys that still have English text (just added)
  const need = {};
  for (const [k, v] of Object.entries(allKeys)) {
    // Check if the value is still English (the value we just added)
    if (content[k] === v) {
      need[k] = v;
    }
  }
  
  const c = Object.keys(need).length;
  if (c === 0) { console.log('  ✓ Already translated'); continue; }
  console.log('  ' + c + ' keys to translate');
  
  const translated = await translate(need, lang);
  let added = 0;
  for (const [k, v] of Object.entries(translated)) {
    if (content[k] === allKeys[k]) { content[k] = v; added++; }
  }
  fs.writeFileSync(fp, JSON.stringify(content, null, 2) + '\n');
  console.log('  → ' + added + ' keys translated');
}

console.log('\n✓ Complete!');