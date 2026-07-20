/**
 * Fix heading hierarchy in all 260 spec .md files:
 * - ### → ## for main section headings (1. Technical Specifications → Technical Specifications)
 * - Remove numbering from section headings
 * - Add anchor IDs
 */
import { readFileSync, writeFileSync, readdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const specsDir = join(__dirname, '..', 'src', 'content', 'product-specs');

const files = readdirSync(specsDir).filter(f => f.endsWith('.md'));
let count = 0;

for (const file of files) {
  const path = join(specsDir, file);
  let c = readFileSync(path, 'utf-8');
  
  // Fix main section headings: ### 1. Title → ## Title (remove numbering)
  c = c.replace(/^### \d+\.\s+/gm, '## ');
  
  // Fix sub-section headings: #### → ###
  c = c.replace(/^#### /gm, '### ');
  
  writeFileSync(path, c, 'utf-8');
  count++;
}

console.log(`Fixed heading hierarchy in ${count} spec files.`);
