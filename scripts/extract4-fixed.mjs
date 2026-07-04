import fs from 'fs';

const code = fs.readFileSync('src/data/equipment.ts', 'utf-8');
const keys = ['turn-mill-cnc', 'automatic-tool-magazine', 'tool-presetter', 'automatic-bar-feeder'];

function extractRaw(key) {
  const idx = code.indexOf('"'+key+'"');
  if (idx < 0) return null;
  const colon = code.indexOf(':', idx);
  let start = colon + 1;
  while (start < code.length && ' \n\r\t'.includes(code[start])) start++;
  if (code[start] !== '{') return null;

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
  // Process character by character
  let result = '';
  let instr = false, qc = null, esc = false;
  
  for (let i = 0; i < str.length; i++) {
    const ch = str[i];
    
    if (esc) { result += ch; esc = false; continue; }
    if (ch === '\\' && instr) { result += ch; esc = true; continue; }
    
    // Handle single-line comments
    if (!instr && ch === '/' && i + 1 < str.length && str[i+1] === '/') {
      while (i < str.length && str[i] !== '\n') i++;
      continue;
    }
    
    if ((ch === '"' || ch === "'" || ch === '`') && !esc) {
      if (!instr) {
        instr = true;
        qc = ch;
        result += '"'; // Normalize to double quote
      } else if (ch === qc) {
        instr = false;
        qc = null;
        result += '"'; // Normalize to double quote
      } else {
        // Different quote type inside a string - escape it or convert
        if (ch === "'") {
          result += "'"; // Keep single quotes inside strings as-is
        } else {
          result += ch;
        }
      }
      continue;
    }
    
    if (instr) {
      result += ch;
      continue;
    }
    
    // Outside string
    // Skip TypeScript type annotations
    if (ch === ':') {
      result += ':';
      // Look ahead for type annotations
      let look = i + 1;
      while (look < str.length && ' \n\r\t'.includes(str[look])) look++;
      let word = '';
      while (look < str.length && /[a-zA-Z<>,\[\]]/.test(str[look])) { word += str[look]; look++; }
      if (/^(EquipmentSection|EquipmentSpecSection|EquipmentData|EquipmentProperty|string\[\]|EquipmentMap|Record<string,\s*EquipmentData>|EquipmentProperty\[\]|string|number|boolean)$/.test(word)) {
        // Skip the type annotation
        i = look - 1;
      }
      continue;
    }
    
    result += ch;
  }
  
  // Final cleanup: remove trailing commas before } and ]
  result = result.replace(/,\s*([}\]])/g, '$1');
  // Quote unquoted property names
  result = result.replace(/([{,]\s*)(\w[\w]*)(\s*:)/g, '$1"$2"$3');
  // Remove any remaining type annotation words that weren't caught
  result = result.replace(/\b(EquipmentSection|EquipmentSpecSection|EquipmentData|EquipmentProperty|string\[\]|EquipmentMap|Record<string,EquipmentData>|EquipmentProperty\[\]|string|number|boolean)\b/g, '');
  
  return result;
}

const allKeys = {};

for (const key of keys) {
  const blob = extractRaw(key);
  if (!blob) { console.log('EXTRACT FAILED: ' + key); continue; }
  
  const json = clean(blob);
  try {
    const obj = JSON.parse(json);
    function collect(o, prefix, out) {
      if (typeof o === 'string') out[prefix] = o;
      else if (Array.isArray(o)) o.forEach((v,i) => collect(v, prefix+'.'+i, out));
      else if (o && typeof o === 'object')
        for (const [k,v] of Object.entries(o))
          if (k !== 'key' && k !== 'category') collect(v, prefix+'.'+k, out);
    }
    collect(obj, 'equipment.'+key, allKeys);
    console.log('✓ ' + key + ' (' + Object.keys(allKeys).length + ' total keys so far)');
  } catch(e) {
    console.log('✗ ' + key + ': ' + e.message);
    // Show problematic area
    console.log('  Problem around char ' + e.message.match(/\d+/));
    fs.writeFileSync('output/clean-'+key+'.json', json);
  }
}

console.log('\nTotal keys: ' + Object.keys(allKeys).length);

if (Object.keys(allKeys).length > 0) {
  // Add to all language files
  const langs = ['en','de','ja','fr','es','pt','it','ko','nl','pl'];
  for (const lang of langs) {
    const fp = 'src/i18n/translations/' + lang + '.json';
    let content = JSON.parse(fs.readFileSync(fp, 'utf-8'));
    let added = 0;
    for (const [k, v] of Object.entries(allKeys)) {
      if (!(k in content)) { content[k] = v; added++; }
    }
    if (added > 0) fs.writeFileSync(fp, JSON.stringify(content, null, 2) + '\n');
    console.log(lang + ': +' + added + ' keys');
  }
}