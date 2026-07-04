import fs from 'fs';

const code = fs.readFileSync('src/data/equipment.ts', 'utf-8');

// Find all equipment key names
const keyRegex = /^\s+"([a-z0-9-]+)":\s*\{/gm;
const equipmentKeys = [];
let match;
while ((match = keyRegex.exec(code)) !== null) {
  equipmentKeys.push(match[1]);
}
console.log('Found equipment keys:', equipmentKeys);

// Find the complete object for each key by counting braces
function extractObject(text, startPos) {
  let depth = 0;
  let inStr = false;
  let esc = false;
  let objStart = -1;
  let objEnd = -1;
  for (let i = startPos; i < text.length; i++) {
    const ch = text[i];
    if (esc) { esc = false; continue; }
    if (ch === '\\' && inStr) { esc = true; continue; }
    if (ch === '"' && !esc) { inStr = !inStr; continue; }
    if (inStr) continue;
    if (ch === '{') {
      depth++;
      if (depth === 1) objStart = i;
    }
    if (ch === '}') {
      depth--;
      if (depth === 0 && objStart >= 0) {
        objEnd = i + 1;
        break;
      }
    }
  }
  if (objStart < 0 || objEnd < 0) return null;
  return { text: text.slice(objStart, objEnd), end: objEnd };
}

// Try to convert TypeScript object to JSON
function tsToJson(ts) {
  let s = ts;
  // Remove TypeScript interface type annotations
  s = s.replace(/: (EquipmentSection|EquipmentSpecSection|EquipmentData|EquipmentProperty|string\[\]|EquipmentMap|Record<string, EquipmentData>|EquipmentProperty\[\])/g, '');
  s = s.replace(/: string/g, '');
  s = s.replace(/: number/g, '');
  s = s.replace(/: boolean/g, '');
  s = s.replace(/,\s*([}\]])/g, '$1');
  // Remove comments
  s = s.replace(/\/\/ .*/g, '');
  // Remove trailing comma before closing
  s = s.replace(/,\s*}/g, '}');
  s = s.replace(/,\s*\]/g, ']');
  return s;
}

function collectKeys(obj, prefix) {
  const result = {};
  if (typeof obj === 'string') {
    if (prefix && !prefix.includes('.key') && !prefix.includes('.category')) {
      result[`equipment.${prefix}`] = obj;
    }
  } else if (Array.isArray(obj)) {
    for (let i = 0; i < obj.length; i++) {
      Object.assign(result, collectKeys(obj[i], `${prefix}.${i}`));
    }
  } else if (obj && typeof obj === 'object') {
    for (const [k, v] of Object.entries(obj)) {
      if (k === 'key' || k === 'category') continue;
      const newPrefix = prefix ? `${prefix}.${k}` : k;
      if (typeof v === 'string') {
        result[newPrefix] = v;
      } else {
        Object.assign(result, collectKeys(v, newPrefix));
      }
    }
  }
  return result;
}

const allKeys = {};
for (const ek of equipmentKeys) {
  const idx = code.indexOf(`"${ek}"`);
  if (idx < 0) continue;
  const afterColon = code.indexOf(':', idx);
  if (afterColon < 0) continue;
  const obj = extractObject(code, afterColon + 1);
  if (!obj) {
    console.log(`Could not extract object for ${ek}`);
    continue;
  }
  const jsonStr = tsToJson(obj.text);
  try {
    const parsed = JSON.parse(jsonStr);
    const keys = collectKeys(parsed, ek);
    Object.assign(allKeys, keys);
    console.log(`${ek}: ${Object.keys(keys).length} keys`);
  } catch(e) {
    // Try to fix common issues
    console.log(`Error parsing ${ek}: ${e.message}`);
  }
}

console.log(`\nTotal keys: ${Object.keys(allKeys).length}`);
fs.writeFileSync('output/all-equipment-keys.json', JSON.stringify(allKeys, null, 2));
console.log('Saved to output/all-equipment-keys.json');