/**
 * Add ProcessSpectrum keys to en.json and de.json programmatically.
 * Run: node scripts/add-processspectrum-keys.mjs
 * 
 * Only adds keys that don't already exist.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const TRANSLATIONS_DIR = path.resolve(__dirname, '../src/i18n/translations');
const COMPONENTS_DIR = path.resolve(__dirname, '../src/components/services');

const files = [
  'AdditiveProcessSpectrum.astro',
  'CncProcessSpectrum.astro',
  'CustomComponentSpectrum.astro',
  'ExtrusionProcessSpectrum.astro',
  'FabProcessSpectrum.astro',
];

const keyPrefixes = {
  'AdditiveProcessSpectrum.astro': 'services.additiveprocessspectrum',
  'CncProcessSpectrum.astro': 'services.cncprocessspectrum',
  'CustomComponentSpectrum.astro': 'services.customcomponentspectrum',
  'ExtrusionProcessSpectrum.astro': 'services.extrusionprocessspectrum',
  'FabProcessSpectrum.astro': 'services.fabprocessspectrum',
};

// All fields we want to extract from each component
// Format: { sourceField: targetSuffix }
function extractComponentData(filepath) {
  const content = fs.readFileSync(filepath, 'utf-8');
  
  // Split into objects by finding "{" and tracking depth
  const objects = [];
  let i = 0;
  
  // Find the array
  const arrayStart = content.indexOf('const ');
  if (arrayStart < 0) return objects;
  const arrayDefEnd = content.indexOf('= [', arrayStart);
  if (arrayDefEnd < 0) return objects;
  
  i = content.indexOf('[', arrayDefEnd);
  if (i < 0) return objects;
  
  let depth = 0;
  let currentObj = '';
  let inString = false;
  let stringChar = '';
  
  while (i < content.length) {
    const ch = content[i];
    
    if (inString) {
      currentObj += ch;
      if (ch === '\\') { i += 2; continue; }
      if (ch === stringChar) inString = false;
      i++;
      continue;
    }
    
    if (ch === '"' || ch === "'" || ch === '`') {
      inString = true;
      stringChar = ch;
      currentObj += ch;
      i++;
      continue;
    }
    
    if (ch === '{') {
      depth++;
      if (depth === 1) currentObj = '';
      currentObj += ch;
      i++;
      continue;
    }
    
    if (ch === '}') {
      currentObj += ch;
      depth--;
      if (depth === 0) {
        objects.push(currentObj);
        currentObj = '';
      }
      i++;
      continue;
    }
    
    if (depth >= 1) {
      currentObj += ch;
    }
    
    i++;
    
    // Break when we hit ]; after the array
    if (depth === 0 && ch === ']') break;
  }
  
  return objects;
}

function extractField(objStr, fieldName) {
  const regex = new RegExp(`${fieldName}:\\s*"((?:[^"\\\\]|\\\\.)*)"`);
  const match = objStr.match(regex);
  return match ? match[1] : null;
}

function extractArray(objStr, arrayName) {
  const regex = new RegExp(`${arrayName}:\\s*\\[([\\s\\S]*?)\\]`);
  const match = objStr.match(regex);
  if (!match) return [];
  
  const items = [];
  const itemRegex = /"((?:[^"\\\\]|\\\\.)*)"/g;
  let m;
  while ((m = itemRegex.exec(match[1])) !== null) {
    items.push(m[1]);
  }
  return items;
}

function toSafeString(str) {
  return str.replace(/"/g, '\\"');
}

// Main
const allKeys = {};

for (const file of files) {
  const filepath = path.join(COMPONENTS_DIR, file);
  const objects = extractComponentData(filepath);
  const prefix = keyPrefixes[file];
  const keys = {};
  
  objects.forEach((objStr, idx) => {
    const title = extractField(objStr, 'title');
    const subtitle = extractField(objStr, 'subtitle');
    const desc = extractField(objStr, 'description');
    const caps = extractArray(objStr, 'capabilities');
    
    if (title) keys[`${prefix}.proc${idx}.title`] = title;
    if (subtitle) keys[`${prefix}.proc${idx}.subtitle`] = subtitle;
    if (desc) keys[`${prefix}.proc${idx}.desc`] = desc;
    caps.forEach((cap, capIdx) => {
      keys[`${prefix}.proc${idx}.cap${capIdx}`] = cap;
    });
  });
  
  allKeys[file] = keys;
  console.log(`${file}: ${objects.length} items, ${Object.keys(keys).length} keys extracted`);
}

// --- Write to en.json ---
const enPath = path.join(TRANSLATIONS_DIR, 'en.json');
const en = JSON.parse(fs.readFileSync(enPath, 'utf-8'));

let enAdded = 0;
for (const [file, keys] of Object.entries(allKeys)) {
  for (const [key, value] of Object.entries(keys)) {
    if (!(key in en)) {
      en[key] = value;
      enAdded++;
    }
  }
}
fs.writeFileSync(enPath, JSON.stringify(en, null, 2), 'utf-8');
console.log(`\n✓ en.json: ${enAdded} keys added`);

// --- Write to de.json (use English as placeholder for now) ---
const dePath = path.join(TRANSLATIONS_DIR, 'de.json');
const de = JSON.parse(fs.readFileSync(dePath, 'utf-8'));

let deAdded = 0;
for (const [file, keys] of Object.entries(allKeys)) {
  for (const [key, value] of Object.entries(keys)) {
    if (!(key in de)) {
      de[key] = value; // Placeholder - will translate manually next
      deAdded++;
    }
  }
}
fs.writeFileSync(dePath, JSON.stringify(de, null, 2), 'utf-8');
console.log(`✓ de.json: ${deAdded} keys added (placeholders)`);

// Print German keys to translate
console.log('\n=== NEEDS GERMAN TRANSLATION ===');
for (const [file, keys] of Object.entries(allKeys)) {
  console.log(`\n// ${file}`);
  for (const [key, value] of Object.entries(keys)) {
    const idx = key.match(/proc(\d+)/)?.[1];
    const field = key.split('.').pop();
    console.log(`  "${key}": "<GERMAN: ${field} #${idx}>", // EN: ${value}`);
  }
}

console.log('\nDone. Now update de.json with German translations.');