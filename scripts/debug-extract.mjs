import fs from 'fs';
const code = fs.readFileSync('src/data/equipment.ts', 'utf-8');

function extractEntry(code, key) {
  const idx = code.indexOf('"' + key + '"');
  if (idx < 0) return null;
  const colon = code.indexOf(':', idx);
  if (colon < 0) return null;
  let start = colon + 1;
  while (start < code.length && code[start] !== '{') start++;
  if (start >= code.length) return null;
  let depth = 1, inStr = false, esc = false, end = start + 1;
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

const entry = extractEntry(code, '5-axis-machining-center');
console.log('=== First 600 chars ===');
console.log(entry.substring(0, 600));
console.log('=== END ===');

// Now test toJSON from gen-keys-simple
function toJSON(ts) {
  let s = ts
    .replace(/\/\/.*\n?/g, '\n')
    .replace(/:\s*EquipmentSection|:\s*EquipmentSpecSection|:\s*EquipmentData|:\s*EquipmentProperty|:\s*string\[\]|:\s*string|:\s*number|:\s*boolean|:\s*EquipmentMap|:\s*Record<string,\s*EquipmentData>|:\s*EquipmentProperty\[\]/g, '')
    .replace(/'/g, '"')
    .replace(/`([^`]*)`/g, '"$1"')
    .replace(/([{,]\s*)(\w[\w]*)(\s*:)/g, '$1"$2"$3')
    .replace(/,\s*([}\]])/g, '$1')
    .trim();
  return s;
}

console.log('\n=== toJSON output (first 500) ===');
const j = toJSON(entry);
console.log(j.substring(0, 500));
console.log('\n=== try JSON.parse ===');
try {
  JSON.parse(j);
  console.log('✓ PARSE OK');
} catch(e) {
  console.log('✗', e.message);
  // Show around the error position
  const pos = parseInt(e.message.match(/position (\d+)/)?.[1] || '0');
  console.log('Around error:', j.substring(Math.max(0,pos-30), pos+30));
}