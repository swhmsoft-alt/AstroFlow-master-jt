/**
 * Fix the "Semantic Graph & Component Topology (The AI Search Optimization)" heading
 * across all 260 spec files.
 * 
 * Strategy A: Replace with professional, human-facing heading
 * Strategy B: Keep semantic data but also push to JSON-LD
 */
import { readFileSync, writeFileSync, readdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const specsDir = join(__dirname, '..', 'src', 'content', 'product-specs');

const files = readdirSync(specsDir).filter(f => f.endsWith('.md'));

const oldHeading = '## Semantic Graph & Component Topology (The AI Search Optimization)';
const newHeading = '## System Interconnectivity & Component Classification';

let count = 0;
for (const file of files) {
  const fp = join(specsDir, file);
  let c = readFileSync(fp, 'utf-8');
  
  if (c.includes(oldHeading)) {
    c = c.replace(oldHeading, newHeading);
    writeFileSync(fp, c, 'utf-8');
    count++;
  }
}

console.log(`Updated heading in ${count} / ${files.length} spec files`);

// Also update the TOC anchor map to recognize the new heading
const anchorScriptPath = join(__dirname, '..', 'src', 'pages', 'products', 'product-entities', '[...slug].astro');
let tmpl = readFileSync(anchorScriptPath, 'utf-8');

// The anchor script already handles 'graph' -> 'knowledge-graph' which will still work
// because the new heading starts with "System Interconnectivity..." which doesn't match 'graph'
// Let me update the anchor mapping

if (tmpl.includes("'graph': 'knowledge-graph'")) {
  // Add 'classification' as an additional trigger
  tmpl = tmpl.replace(
    "'graph': 'knowledge-graph'",
    "'graph': 'knowledge-graph',\n    'classification': 'knowledge-graph'"
  );
  writeFileSync(anchorScriptPath, tmpl, 'utf-8');
  console.log('Updated anchor script mapping');
}

console.log('Done.');
