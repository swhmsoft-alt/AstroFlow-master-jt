/**
 * insert-seo-langs-v2.mjs
 *
 * Simply appends `ru:` and `ar:` after every `pl:` line in title/description blocks.
 * Uses English text as placeholder values.
 * Does NOT restructure the file — just pure text insertion.
 *
 * Usage: node scripts/insert-seo-langs-v2.mjs
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SEO_FILE = path.resolve(__dirname, '../src/config/seo.ts');

const LANG_CODES = ['ru', 'ar'];

let content = fs.readFileSync(SEO_FILE, 'utf-8');

for (const lang of LANG_CODES) {
  // Skip if already has this language
  if (content.includes(`\n      ${lang}: '`)) {
    console.log(`${lang}: already exists, skipping`);
    continue;
  }

  // Find each pl: '...' line and insert the new language after it
  // Using a regex that matches the entire pl: line including its comma
  const plRegex = /(      pl: '(?:[^'\\]|\\.)*')(,\n)/g;
  let match;
  let result = '';
  let lastIndex = 0;
  let count = 0;

  while ((match = plRegex.exec(content)) !== null) {
    // Get the English text from this block
    // Scan backwards from the match position to find the last `title: {` or `description: {`
    const blockStart = content.lastIndexOf('\n    title:', match.index) > -1 
      ? content.lastIndexOf('\n    title:', match.index) 
      : content.lastIndexOf('\n    description:', match.index);
    const blockEnd = Math.min(match.index + 500, content.length);
    const block = content.substring(Math.max(0, blockStart), blockEnd);
    
    // Extract English text from the block
    const enMatch = block.match(/\n\s+en:\s*'((?:[^'\\]|\\.)*)'/);
    const enText = enMatch ? enMatch[1] : '';
    
    // Replace single quotes and backslashes for JavaScript string safety
    const escapedText = enText.replace(/\\/g, '\\\\').replace(/'/g, "\\'");
    
    // Build the replacement
    const plLine = match[1];   // e.g., `      pl: '...'`
    const afterComma = match[2]; // the `,\n`
    
    const newLine = `${plLine},${afterComma}      ${lang}: '${escapedText}',${afterComma}`;
    
    result += content.substring(lastIndex, match.index) + newLine;
    lastIndex = match.index + match[0].length;
    count++;
  }

  if (lastIndex > 0) {
    result += content.substring(lastIndex);
    content = result;
    console.log(`${lang}: inserted in ${count} places`);
  } else {
    console.log(`${lang}: no pl: lines found`);
  }
}

fs.writeFileSync(SEO_FILE, content, 'utf-8');
console.log('Done.');
