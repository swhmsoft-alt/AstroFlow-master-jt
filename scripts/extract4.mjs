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

// Line-by-line approach: collect all key-value pairs from each entry
function parseEntryBlob(blob, eqkey, out) {
  const lines = blob.split('\n');
  const path = ['equipment', eqkey];
  const stack = [{obj: {}, key: null}];
  let inStr = false, qc = null;

  for (let line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed === '{' || trimmed === '}') continue;

    // Find key-value pairs using regex on each line
    // propertyName: "value"
    let m = trimmed.match(/^"(\w+)"\s*:\s*"((?:[^"\\]|\\.)*)"/);
    if (m) {
      const pkey = m[1], val = m[2];
      if (pkey === 'key' || pkey === 'category') continue;
      out[`equipment.${eqkey}.${pkey}`] = val;
      continue;
    }

    // propertyName: [...] (array)
    m = trimmed.match(/^"(\w+)"\s*:\s*\[/);
    if (m) {
      const pkey = m[1];
      if (pkey === 'key' || pkey === 'category') continue;
      // We'll handle arrays separately
      continue;
    }

    // propertyName: { ... } (nested object)
    m = trimmed.match(/^"(\w+)"\s*:\s*\{/);
    if (m) {
      const pkey = m[1];
      if (pkey === 'key' || pkey === 'category') continue;
      // Will be handled by recursive extraction
      continue;
    }

    // propertyName: (type annotation) rest
    m = trimmed.match(/^"(\w+)"\s*:/);
    if (m) {
      const pkey = m[1];
      if (pkey === 'key' || pkey === 'category') continue;
      continue;
    }
  }

  // Now handle nested objects and arrays using the full blob
  // Extract entityDefinition
  let edMatch = blob.match(/"entityDefinition"\s*:\s*\{([^]+?)\}\s*\}/);
  if (edMatch) {
    const edBlob = edMatch[1];
    // title, description, classification
    ['title','description','classification'].forEach(f => {
      const m2 = edBlob.match(new RegExp(`"${f}"\\s*:\\s*"((?:[^"\\\\]|\\\\.)*)"`));
      if (m2) out[`equipment.${eqkey}.entityDefinition.${f}`] = m2[1];
    });
    // commonNames array
    const cnMatch = edBlob.match(/"commonNames"\s*:\s*\[([^\]]+)\]/);
    if (cnMatch) {
      cnMatch[1].split(',').forEach((item, i) => {
        const c = item.trim().replace(/^"|"$/g, '');
        if (c) out[`equipment.${eqkey}.entityDefinition.commonNames.${i}`] = c;
      });
    }
    // keyCharacteristics array
    const kcMatch = edBlob.match(/"keyCharacteristics"\s*:\s*\[([^\]]+)\]/);
    if (kcMatch) {
      let items = [];
      let current = '';
      let inStr2 = false, qc2 = null;
      for (const ch of kcMatch[1]) {
        if ((ch === '"' || ch === "'" || ch === '`') && !inStr2) { inStr2 = true; qc2 = ch; continue; }
        if (inStr2 && ch === qc2) { inStr2 = false; items.push(current.replace(/^"|"$/g,'')); current = ''; continue; }
        if (inStr2) { current += ch; continue; }
      }
      items.forEach((val, i) => {
        if (val) out[`equipment.${eqkey}.entityDefinition.keyCharacteristics.${i}`] = val.replace(/^"|"$/g,'');
      });
    }
  }

  // Extract conformsTo
  const ctMatch = blob.match(/"conformsTo"\s*:\s*\{([^]+?)\}\s*\}/);
  if (ctMatch) {
    const ctBlob = ctMatch[1];
    ['title','description'].forEach(f => {
      const m2 = ctBlob.match(new RegExp(`"${f}"\\s*:\\s*"((?:[^"\\\\]|\\\\.)*)"`));
      if (m2) out[`equipment.${eqkey}.conformsTo.${f}`] = m2[1];
    });
    const itemsMatch = ctBlob.match(/"items"\s*:\s*\[([^\]]+)\]/);
    if (itemsMatch) {
      let items = itemsMatch[1].split('\n').map(l => l.trim().replace(/^"|"$/g,'').replace(/^"|"$/g,'')).filter(Boolean);
      let cleanItems = [];
      let cur = '';
      for (const item of items) {
        if (item.endsWith('"')) { cur += (cur ? '\n' : '') + item; cleanItems.push(cur); cur = ''; }
        else if (item) cur += (cur ? '\n' : '') + item;
      }
      cleanItems.forEach((v, i) => {
        const clean = v.replace(/^,?\s*/,'').replace(/\s*$/,'');
        if (clean) out[`equipment.${eqkey}.conformsTo.items.${i}`] = clean;
      });
    }
  }

  // Extract hasProperty
  const hpMatch = blob.match(/"hasProperty"\s*:\s*\{([^]+?)\}\s*\}/);
  if (hpMatch) {
    const hpBlob = hpMatch[1];
    ['title','description'].forEach(f => {
      const m2 = hpBlob.match(new RegExp(`"${f}"\\s*:\\s*"((?:[^"\\\\]|\\\\.)*)"`));
      if (m2) out[`equipment.${eqkey}.hasProperty.${f}`] = m2[1];
    });
    // properties array: each item is {label, value}
    const propsMatch = hpBlob.match(/"properties"\s*:\s*\[([^\]]+)\]/);
    if (propsMatch) {
      // Extract all {label, value} pairs
      const propBlocks = propsMatch[1].match(/\{[^}]+\}/g);
      if (propBlocks) {
        propBlocks.forEach((block, i) => {
          const lMatch = block.match(/"label"\s*:\s*"((?:[^"\\\\]|\\\\.)*)"/);
          const vMatch = block.match(/"value"\s*:\s*"((?:[^"\\\\]|\\\\.)*)"/);
          if (lMatch) out[`equipment.${eqkey}.hasProperty.properties.${i}.label`] = lMatch[1];
          if (vMatch) out[`equipment.${eqkey}.hasProperty.properties.${i}.value`] = vMatch[1];
        });
      }
    }
  }

  // Process other sections using similar patterns
  for (const section of ['processedBy', 'manufacturedFrom', 'usedIn', 'alternativeTo']) {
    const secMatch = blob.match(new RegExp(`"${section}"\\s*:\\s*\\{([^]+?)\\}\\s*\\}`));
    if (secMatch) {
      const secBlob = secMatch[1];
      ['title','description'].forEach(f => {
        const m2 = secBlob.match(new RegExp(`"${f}"\\s*:\\s*"((?:[^"\\\\]|\\\\.)*)"`));
        if (m2) out[`equipment.${eqkey}.${section}.${f}`] = m2[1];
      });
      const itemsMatch = secBlob.match(/"items"\s*:\s*\[([^\]]+)\]/);
      if (itemsMatch) {
        let items = [];
        let cur = '';
        let instr = false, qc = null;
        for (const ch of itemsMatch[1]) {
          if ((ch === '"' || ch === "'" || ch === '`') && !instr) { instr = true; qc = ch; continue; }
          if (instr && ch === qc) { instr = false; items.push(cur); cur = ''; continue; }
          if (instr) cur += ch;
        }
        items.forEach((v, i) => {
          if (v) out[`equipment.${eqkey}.${section}.items.${i}`] = v;
        });
      }
    }
  }
}

// Build all keys
const allKeys = {};
for (const key of keys) {
  const blob = extractRaw(key);
  if (!blob) { console.log('FAIL: ' + key); continue; }
  parseEntryBlob(blob, key, allKeys);
  console.log('OK: ' + key + ' -> ' + Object.values(allKeys).filter(v => v.includes(key)).length + ' partial keys');
}

// Write the collection approach - since complex parsing may miss some,
// let's try a different strategy: direct JSON eval after TS cleanup
for (const key of keys) {
  const blob = extractRaw(key);
  if (!blob) continue;
  // Clean: remove type annotations, normalize quotes, remove comments
  let cleaned = blob
    .replace(/`[^`]*`/g, m => m.replace(/`/g, '"'))
    .replace(/'/g, '"')
    .replace(/\/\/.*/g, '')
    .replace(/\b(EquipmentSection|EquipmentSpecSection|EquipmentData|EquipmentProperty|string\[\]|EquipmentMap|Record<string,\s*EquipmentData>|EquipmentProperty\[\])\s*/g, '')
    .replace(/\b(string|number|boolean)\s*/g, '')
    .replace(/([{,]\s*)(\w[\w]*)(\s*:)/g, '$1"$2"$3')
    .replace(/,\s*([}\]])/g, '$1');

  // Fix specific issues with these 4 items - they have 'inside strings like 'done-in-one'
  // After cleaning, we need to make sure internal quotes are handled
  // Let's try to use Function constructor as a last resort
  try {
    const obj = JSON.parse(cleaned);
    // Recursively collect all keys
    function collect(o, prefix, out) {
      if (typeof o === 'string') out[prefix] = o;
      else if (Array.isArray(o)) o.forEach((v,i) => collect(v, prefix+'.'+i, out));
      else if (o && typeof o === 'object')
        for (const [k,v] of Object.entries(o))
          if (k !== 'key' && k !== 'category') collect(v, prefix+'.'+k, out);
    }
    collect(obj, 'equipment.'+key, allKeys);
    console.log('PARSED: ' + key);
  } catch(e) {
    console.log('FAILED: ' + key + ' - ' + e.message);
    // Debug: find the problematic character
     for (let i = 0; i < Math.min(cleaned.length, 500); i++) {
       try { JSON.parse(cleaned.slice(0, i+1)); } catch {}
     }
  }
}

// Write output
const total = Object.keys(allKeys).length;
console.log('\nTotal keys from all 4 items: ' + total);

if (total > 0) {
  fs.writeFileSync('output/4-missing-keys.json', JSON.stringify(allKeys, null, 2));
  console.log('Saved to output/4-missing-keys.json');
  
  // Show first 10 keys as sample
  const entries = Object.entries(allKeys).slice(0, 10);
  for (const [k, v] of entries) {
    console.log('  ' + k + ' = ' + v);
  }
}