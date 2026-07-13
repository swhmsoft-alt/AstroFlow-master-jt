/**
 * insert-seo-langs-v3.mjs
 *
 * Simplest possible approach:
 * 1. Add ru and ar to the SeoEntry interface
 * 2. Find each line starting with "      pl:" and insert ru and ar lines after it
 *
 * Usage: node scripts/insert-seo-langs-v3.mjs
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SEO_FILE = path.resolve(__dirname, '../src/config/seo.ts');

let content = fs.readFileSync(SEO_FILE, 'utf-8');

// Step 1: Update interface
content = content.replace(
  'nl: string; pl: string }',
  'nl: string; pl: string; ru: string; ar: string }'
);

// Step 2: For each line matching "      pl:", find the nearest English text in the same block
// and insert ru: and ar: lines after it
const lines = content.split('\n');
const newLines = [];
let lastPlBlock = ''; // Track the block text for finding English text

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  newLines.push(line);

  // Check if this line starts a title or description block
  if (/^\s+(title|description):\s*\{/.test(line)) {
    lastPlBlock = '';
  }

  // Check if this is a "pl:" value line (with 6 spaces indent followed by pl:)
  if (/^\s{6}pl:\s'/.test(line)) {
    // Find the English text in this block by scanning backwards
    for (let j = i; j >= Math.max(0, i - 30); j--) {
      const enMatch = lines[j].match(/^\s{6}en:\s'((?:[^'\\]|\\.)*)'/);
      if (enMatch) {
        const enText = enMatch[1].replace(/\\'/g, "'");
        const escaped = enText.replace(/\\/g, '\\\\').replace(/'/g, "\\'");
        // Insert ru and ar after this pl: line
        const indent = '      ';
        newLines.push(`${indent}ru: '${escaped}',`);
        newLines.push(`${indent}ar: '${escaped}',`);
        break;
      }
    }
  }
}

content = newLines.join('\n');
fs.writeFileSync(SEO_FILE, content, 'utf-8');

// Count
const ruCount = (content.match(/\n\s+ru:/g) || []).length;
const arCount = (content.match(/\n\s+ar:/g) || []).length;
console.log(`Interface updated, ru: ${ruCount} places, ar: ${arCount} places`);
