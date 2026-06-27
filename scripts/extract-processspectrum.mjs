/**
 * Extract ProcessSpectrum data and generate en.json keys.
 * Run: node scripts/extract-processspectrum.mjs
 * 
 * This extracts all hardcoded title/subtitle/description/capabilities from
 * ProcessSpectrum components and outputs the en.json keys and component
 * modifications needed.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const COMPONENTS_DIR = path.resolve(__dirname, '../src/components/services');

// Files to process - Batch 2
const files = [
  'AdditiveProcessSpectrum.astro',
  'CncProcessSpectrum.astro',
  'CustomComponentSpectrum.astro',
  'ExtrusionProcessSpectrum.astro',
  'FabProcessSpectrum.astro',
];

// Map file names to key prefixes
const keyPrefixes = {
  'AdditiveProcessSpectrum.astro': 'services.additiveprocessspectrum',
  'CncProcessSpectrum.astro': 'services.cncprocessspectrum',
  'CustomComponentSpectrum.astro': 'services.customcomponentspectrum',
  'ExtrusionProcessSpectrum.astro': 'services.extrusionprocessspectrum',
  'FabProcessSpectrum.astro': 'services.fabprocessspectrum',
};

// Parse array name - what the component calls its data array
const arrayNames = {
  'AdditiveProcessSpectrum.astro': 'processes',
  'CncProcessSpectrum.astro': 'processes',
  'CustomComponentSpectrum.astro': 'categories',
  'ExtrusionProcessSpectrum.astro': 'processes',
  'FabProcessSpectrum.astro': 'processes',
};

function extractData(content) {
  // Find the array definition
  const arraymatch = content.match(/const \w+: \w+\[\] = \[([\s\S]*?)\];\s*\n\s*import/);
  if (!arraymatch) {
    console.error('Could not find data array');
    return null;
  }
  return arraymatch[1];
}

function parseObjects(arrayContent) {
  // Split by closing brace to get individual objects
  const objects = [];
  let depth = 0;
  let current = '';
  let inString = false;
  let char;
  
  for (let i = 0; i < arrayContent.length; i++) {
    char = arrayContent[i];
    
    if (char === '"' || char === "'" || char === '`') {
      const quote = char;
      i++;
      while (i < arrayContent.length && arrayContent[i] !== quote) {
        if (arrayContent[i] === '\\') i++;
        i++;
      }
      current += char;
      continue;
    }
    
    current += char;
    if (char === '{') depth++;
    if (char === '}') {
      depth--;
      if (depth === 0 && current.trim()) {
        // Extract values from this object
        const obj = {};
        const titleMatch = current.match(/title:\s*"([^"]*)"/);
        const subtitleMatch = current.match(/subtitle:\s*"([^"]*)"/);
        const descMatch = current.match(/description:\s*"([^"]*)"/);
        
        // Extract capabilities array
        const capsMatch = current.match(/capabilities:\s*\[([\s\S]*?)\]/);
        const caps = [];
        if (capsMatch) {
          const capRegex = /"([^"]*)"/g;
          let m;
          while ((m = capRegex.exec(capsMatch[1])) !== null) {
            caps.push(m[1]);
          }
        }
        
        if (titleMatch) obj.title = titleMatch[1];
        if (subtitleMatch) obj.subtitle = subtitleMatch[1];
        if (descMatch) obj.description = descMatch[1];
        if (caps.length) obj.capabilities = caps;
        
        if (Object.keys(obj).length > 0) {
          objects.push(obj);
        }
        current = '';
      }
    }
  }
  return objects;
}

function generateEnKeys(filename, objects, prefix) {
  const keys = {};
  objects.forEach((obj, idx) => {
    keys[`${prefix}.proc${idx}.title`] = obj.title;
    if (obj.subtitle) {
      keys[`${prefix}.proc${idx}.subtitle`] = obj.subtitle;
    }
    keys[`${prefix}.proc${idx}.desc`] = obj.description;
    if (obj.capabilities) {
      obj.capabilities.forEach((cap, capIdx) => {
        keys[`${prefix}.proc${idx}.cap${capIdx}`] = cap;
      });
    }
  });
  return keys;
}

// Main
const allKeys = {};

for (const file of files) {
  const content = fs.readFileSync(path.join(COMPONENTS_DIR, file), 'utf-8');
  const arrayContent = extractData(content);
  if (!arrayContent) {
    console.error(`✗ ${file}: Could not extract array`);
    continue;
  }
  
  const objects = parseObjects(arrayContent);
  const prefix = keyPrefixes[file];
  const keys = generateEnKeys(file, objects, prefix);
  allKeys[file] = { objects, keys };
  
  console.log(`\n${file}: ${objects.length} items, ${Object.keys(keys).length} keys`);
}

// Output the en.json keys
console.log('\n\n=== EN.JSON KEYS TO ADD ===\n');
for (const [file, data] of Object.entries(allKeys)) {
  console.log(`// ${file}`);
  for (const [key, value] of Object.entries(data.keys)) {
    console.log(`  "${key}": "${value}",`);
  }
  console.log('');
}

// Output de.json keys (placeholder - use English as base for manual translation)
console.log('\n\n=== DE.JSON KEYS (copy to de.json, translate values) ===\n');
for (const [file, data] of Object.entries(allKeys)) {
  console.log(`// ${file}`);
  for (const [key, value] of Object.entries(data.keys)) {
    console.log(`  "${key}": "${value}",`);
  }
  console.log('');
}

// Output component modifications
console.log('\n\n=== COMPONENT MODIFICATIONS ===\n');
for (const [file, data] of Object.entries(allKeys)) {
  const arrayName = arrayNames[file];
  const prefix = keyPrefixes[file];
  
  console.log(`// ${file}`);
  
  // Interface changes - remove string fields
  console.log(`// Interface: remove title, subtitle, description, capabilities`);
  
  // Data removal
  console.log(`// Data: remove all title/subtitle/description/capabilities fields`);
  
  // Template changes
  data.objects.forEach((obj, idx) => {
    console.log(`// {${arrayName}.title} → {t('${prefix}.proc${idx}.title')}`);
    if (obj.subtitle) {
      console.log(`// {${arrayName}.subtitle} → {t('${prefix}.proc${idx}.subtitle')}`);
    }
    console.log(`// {${arrayName}.description} → {t('${prefix}.proc${idx}.desc')}`);
    console.log(`// {cap} (capabilities) → {t('${prefix}.proc${idx}.cap' + ${arrayName}.indexOf(???) + '.cap' + capsIndex)}`);
  });
  console.log('');
}