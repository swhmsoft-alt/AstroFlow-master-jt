/**
 * Generate equipment i18n keys and append to all language files.
 * Usage: node scripts/gen-equipment-i18n.mjs
 */
import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');

// Read the equipment data file and evaluate it
const equimpentCode = readFileSync(join(root, 'src', 'data', 'equipment.ts'), 'utf-8');

// Extract just the object literal parts using simple splitting
// We only need the key/value pairs from the EQUIPMENT_DATA object
const startMarker = 'export const EQUIPMENT_DATA: EquipmentMap = {';
const startIdx = equimpentCode.indexOf(startMarker);
const objStr = equimpentCode.slice(startIdx + startMarker.length);

// Use Function constructor to parse the object
// But first we need to strip TypeScript types
// Simple approach: use a regex to get the JSON structure
const keys = [];

// Scan through the equipment data - we know the structure
// Each equipment key is at the top level of EQUIPMENT_DATA
const equipKeys = [
  '5-axis-machining-center', 'turn-mill-cnc', 'high-pressure-coolant',
  'automatic-tool-magazine', 'tool-presetter', 'chip-management-fire-suppression',
  'vacuum-heat-treat-furnace', 'cmm', 'laser-tracker-3d-scanner',
  'anodizing-surface-treatment', 'wire-edm', 'automatic-bar-feeder',
  'robotic-pallet-system'
];

// Define the section structure we need to traverse
function buildKeysRecursive(value, prefix, out) {
  if (typeof value === 'string') {
    out.push(`"${prefix}": ${JSON.stringify(value)}`);
  } else if (typeof value === 'number') {
    out.push(`"${prefix}": ${JSON.stringify(String(value))}`);
  } else if (Array.isArray(value)) {
    value.forEach((item, i) => {
      buildKeysRecursive(item, `${prefix}.${i}`, out);
    });
  } else if (typeof value === 'object' && value !== null) {
    for (const [k, v] of Object.entries(value)) {
      buildKeysRecursive(v, `${prefix}.${k}`, out);
    }
  }
}

// Build the translation entries
const allEntries = [];

for (const ek of equipKeys) {
  buildKeysRecursive({
    name: '',
    category: '',
    badge: '',
    highlight: '',
    subtitle: '',
    pageTitle: '',
    metaDescription: '',
    entityDefinition: {
      title: '', description: '', classification: '',
      commonNames: [], keyCharacteristics: []
    },
    conformsTo: { title: '', description: '', items: [] },
    hasProperty: { title: '', description: '', properties: [] },
    processedBy: { title: '', description: '', items: [] },
    manufacturedFrom: { title: '', description: '', items: [] },
    usedIn: { title: '', description: '', items: [] },
    alternativeTo: { title: '', description: '', items: [] }
  }, `equipment.${ek}`, allEntries);
}

// Number of placeholder entries we should have
console.log(`Creating ${allEntries.length} placeholder paths for ${equipKeys.length} equipment items.`);

// Now we need the actual values - let's build them from the data file
// Read the full file and extract values based on known paths
const LANGS = ['en', 'de', 'ja', 'fr', 'es', 'pt', 'it', 'ko', 'nl', 'pl'];
const translationsDir = join(root, 'src', 'i18n', 'translations');

// Build the full key-value map by reading the data
// We need to parse the TypeScript object. Let's use a simpler approach:
// eval() the TypeScript with replacements
let cleanCode = equimpmentCode
  .replace(/export (interface|type) \w+[^{]*\{[^}]*\}/gs, '')  // Remove interfaces
  .replace(/import .+$/gm, '')  // Remove imports
  .replace(/export /g, '')  // Remove export
  .replace(/: \w+(?:\[\])?/g, '')  // Remove type annotations
  .replace(/: \w+(?:<\w+>)?/g, '')  // Remove generic type annotations
  .replace(/readonly /g, '');  // Remove readonly

// Actually this is getting too complex. Let me use a different strategy.
// Since all equipment data is English, just add ALL of it to en.json first.
// Other languages will fall back to en.json automatically.

console.log('Processing equipment data...');

// Read all existing language files
const files = Object.fromEntries(
  LANGS.map(l => [l, JSON.parse(readFileSync(join(translationsDir, `${l}.json`), 'utf-8'))])
);

// Count equipment keys from 5-axis as reference (they all have same structure)
// We'll just add all equipment data to en.json
const firstKey = equipKeys[0];
const firstEntry = extractEquipmentPart(equipKeys[0], equimpentCode);

// Dynamic generation of entries based on string parsing
function extractEquipmentPart(key, code) {
  // Find the equipment entry
  const keyPattern = `"${key}"`;
  const idx = code.indexOf(keyPattern);
  if (idx < 0) return null;
  
  // Find the matching closing brace
  let depth = 0;
  let start = idx;
  let inStr = false;
  let esc = false;
  for (let i = idx; i < code.length; i++) {
    const ch = code[i];
    if (esc) { esc = false; continue; }
    if (ch === '\\' && inStr) { esc = true; continue; }
    if (ch === '"' && !esc) { inStr = !inStr; continue; }
    if (inStr) continue;
    if (ch === '{') depth++;
    if (ch === '}') {
      depth--;
      if (depth === 0) {
        // Found the closing brace of this entry
        const segment = code.slice(idx, i + 1);
        // This should be like: "5-axis-machining-center": { ... }
        return segment;
      }
    }
  }
  return null;
}

// Try a different approach - build translations dynamically
// Since we're just using the English data, and `_t()` already falls back to equipment.ts,
// we only need to add keys to en.json so the standard i18n path works on EN pages.
// For other languages, `_t()` will fall back to equipment.ts English data when no translation exists.

// The simplest fix: just add equipment keys to en.json
// We can extract them by evaluating the code safely

console.log('Generating equipment translation keys...');

// Extract each equipment entry by parsing the TypeScript
const allEquipmentKeys = {};

for (const ek of equipKeys) {
  const segment = extractEquipmentPart(ek, equimpentCode);
  if (!segment) {
    console.warn(`Could not extract ${ek}`);
    continue;
  }
  
  // Replace TypeScript annotations to get valid JSON
  let jsonStr = segment
    .replace(/\/\/ .*$/gm, '')  // Remove line comments
    .replace(/,\s*([}\]])/g, '$1')  // Remove trailing commas
    .replace(/([{,])\s*(\w+)\s*:/g, '$1"$2":')  // Quote property names
    .replace(/:\s*'([^']*?)'/g, ':"$1"')  // Replace single quotes
    .replace(/:\s*"([^"]*?)"/g, (m) => m);  // Keep double quotes
  
  try {
    const obj = JSON.parse(jsonStr);
    // Now extract all key-value pairs recursively
    const entries = [];
    buildKeysRecursive(obj, `equipment.${ek}`, entries);
    
    for (const entry of entries) {
      const eqIdx = entry.indexOf(': ');
      const k = entry.slice(1, entry.indexOf('":'));
      const v = JSON.parse(entry.slice(eqIdx + 1));
      allEquipmentKeys[k] = v;
    }
  } catch(e) {
    console.warn(`Could not parse ${ek}: ${e.message}`);
  }
}

console.log(`Generated ${Object.keys(allEquipmentKeys).length} equipment keys`);

// Add to en.json only (other languages use en as fallback)
const enFile = join(translationsDir, 'en.json');
const enContent = JSON.parse(readFileSync(enFile, 'utf-8'));
let added = 0;
let skipped = 0;
for (const [k, v] of Object.entries(allEquipmentKeys)) {
  if (!(k in enContent)) {
    enContent[k] = v;
    added++;
  } else {
    skipped++;
  }
}
writeFileSync(enFile, JSON.stringify(enContent, null, 2) + '\n');
console.log(`Added ${added} new keys to en.json, skipped ${skipped} existing keys`);