/**
 * Robust equipment i18n key generator — character-by-character TS→JSON parser.
 * 
 * Usage: node scripts/gen-keys-robust.mjs
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

const equipKeys = [
  '5-axis-machining-center','turn-mill-cnc','high-pressure-coolant',
  'automatic-tool-magazine','tool-presetter','chip-management-fire-suppression',
  'vacuum-heat-treat-furnace','cmm','laser-tracker-3d-scanner',
  'anodizing-surface-treatment','wire-edm','automatic-bar-feeder','robotic-pallet-system'
];

// ── extractEntry: finds the object literal for a given key ──
// Uses '"key-name":' to avoid matching comment text occurrences
function extractEntry(code, key) {
  const search = `"${key}":`;
  // Try to find it by searching for the key followed by colon
  // Handle different possible positions
  let startIdx = 0;
  let found = false;
  let colonPos = -1;
  while (!found) {
    const idx = code.indexOf(search, startIdx);
    if (idx < 0) break;
    // Check it's not in a comment - look at preceding non-whitespace chars on this line
    const lineStart = code.lastIndexOf('\n', idx);
    const prevLine = code.substring(lineStart >= 0 ? lineStart : 0, idx);
    // Skip if line contains // and the search string is after //
    const commentIdx = prevLine.indexOf('//');
    if (commentIdx < 0) {
      // Also verify there really is a colon right after
      const afterSearch = idx + search.length;
      if (afterSearch <= code.length) {
        colonPos = idx + search.length - 1; // position of ':'
        found = true;
        break;
      }
    }
    startIdx = idx + 1;
  }
  if (!found) return null;
  
  // Now search for opening brace after the colon
  let start = colonPos + 1;
  while (start < code.length && code[start] !== '{') start++;
  if (start >= code.length) return null;
  
  // Count braces to find end
  let depth = 1, inStr = false, esc = false;
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

// ── tsToJson: character-by-character TS object literal → JSON string ──
function tsToJson(ts) {
  const out = [];
  let i = 0;
  
  function peek() { return i < ts.length ? ts[i] : null; }
  function eat() { const ch = ts[i]; i++; return ch; }
  
  function skipWhitespace() {
    while (i < ts.length && /\s/.test(ts[i])) eat();
  }
  
  function parseString(quote) {
    out.push('"');
    eat(); // consume opening quote
    while (i < ts.length) {
      const ch = eat();
      if (ch === '\\') { out.push(ch); if (i < ts.length) out.push(eat()); }
      else if (ch === quote) { break; }
      else { out.push(ch); }
    }
    out.push('"');
  }
  
  function parseValue() {
    skipWhitespace();
    const ch = peek();
    if (ch === '{') parseObject();
    else if (ch === '[') parseArray();
    else if (ch === '"' || ch === "'" || ch === '`') parseString(ch);
    else parsePrimitive();
  }
  
  function skipTypeAnnotation() {
    skipWhitespace();
    if (peek() !== ':') return;
    eat(); // consume ':'
    skipWhitespace();
    let depth = 0;
    while (i < ts.length) {
      const ch = peek();
      if (ch === '<') depth++;
      else if (ch === '>') depth = Math.max(0, depth - 1);
      else if (depth === 0 && (ch === ',' || ch === '}' || ch === ']' || ch === '\n' || ch === '\r')) break;
      eat();
    }
  }
  
  function parseObject() {
    out.push('{');
    eat(); // consume '{'
    
    while (i < ts.length) {
      skipWhitespace();
      const ch = peek();
      if (ch === '}') { out.push('}'); eat(); return; }
      
      // Read property name
      skipWhitespace();
      let propName;
      let pch = peek();
      
      if (pch === '"' || pch === "'" || pch === '`') {
        const q = pch;
        out.push('"');
        eat(); // consume opening quote
        while (i < ts.length) {
          const c = eat();
          if (c === '\\') { out.push(c); if (i < ts.length) out.push(eat()); }
          else if (c === q) break;
          else out.push(c);
        }
        out.push('"');
      } else if (pch === '}') {
        out.push('}'); eat(); return;
      } else if (pch === ',') {
        out.push(','); eat(); continue;
      } else {
        // unquoted property name (identifier)
        let name = '';
        while (i < ts.length && /[\w$]/.test(peek())) name += eat();
        if (name) {
          out.push('"' + name + '"');
        } else {
          // skip unexpected char
          eat(); continue;
        }
      }
      
      skipWhitespace();
      
      // Skip '?' optional marker
      if (peek() === '?') { eat(); skipWhitespace(); }
      
      if (peek() === ':') {
        out.push(':');
        eat(); // consume ':'
        skipWhitespace();
        parseValue();
        skipWhitespace();
        // After value, if we see a comma, output it
        if (peek() === ',') {
          out.push(',');
          eat();
          skipWhitespace();
        }
        // Skip type annotations after value (like `as string`)
        skipWhitespace();
        // Check for stray ':' annotation
        if (peek() === ':') {
          skipTypeAnnotation();
          skipWhitespace();
          if (peek() === ',') { out.push(','); eat(); }
        }
      } else {
        // No colon means this is a type-only property or syntax error
        // Skip to next comma or brace
        while (i < ts.length && peek() !== ',' && peek() !== '}' && peek() !== '\n') eat();
        if (peek() === ',') { out.push(','); eat(); }
      }
    }
    out.push('}');
  }
  
  function parseArray() {
    out.push('[');
    eat();
    while (i < ts.length) {
      skipWhitespace();
      const ch = peek();
      if (ch === ']') { out.push(']'); eat(); return; }
      if (ch === ',') { out.push(','); eat(); continue; }
      parseValue();
      skipWhitespace();
      if (peek() === ',') { out.push(','); eat(); }
    }
    out.push(']');
  }
  
  function parsePrimitive() {
    let val = '';
    while (i < ts.length) {
      const ch = peek();
      if (ch === ',' || ch === '}' || ch === ']' || ch === '\n' || ch === '\r') break;
      if (ch === ':' && val.trim().length > 0) break;
      val += eat();
    }
    const trimmed = val.trim();
    // Remove trailing type annotations
    let cleaned = trimmed.replace(/\s+(as\s+)?(string|number|boolean|EquipmentSection|EquipmentSpecSection|EquipmentData|EquipmentProperty)\s*$/gi, '').trim();
    if (cleaned === '') cleaned = '""';
    out.push(cleaned);
  }
  
  // Main parse
  ts = ts.trim();
  parseValue();
  
  let result = out.join('');
  // Clean up trailing commas
  result = result.replace(/,(\s*[}\]])/g, '$1');
  return result;
}

// ── Main extraction ──
const data = {};
for (const ek of equipKeys) {
  const entry = extractEntry(code, ek);
  if (!entry) { console.log(`  ✗ Could not extract ${ek}`); continue; }
  try {
    const json = tsToJson(entry);
    const parsed = JSON.parse(json);
    data[ek] = parsed;
    console.log(`  ✓ ${ek}`);
  } catch (e) {
    console.log(`  ✗ ${ek}: ${e.message}`);
    // Show context around error in generated json
    const pos = parseInt(e.message.match(/position (\d+)/)?.[1] || '0');
    const json = tsToJson(entry);
    console.log(`    Context: ...${json.substring(Math.max(0,pos-40), pos+40)}...`);
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