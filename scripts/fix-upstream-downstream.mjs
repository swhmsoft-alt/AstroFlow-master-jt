import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const TARGET_DIR = path.resolve(__dirname, '../src/content/product-specs');

function extractSemanticArray(body, type) {
  let regex;
  if (type === 'Upstream') {
    regex = /Upstream\s+(?:System\s+)?Integration\s*:\s*([^\n]+)/i;
  } else {
    regex = /Downstream\s+(?:Consumables\s*(?:&\s*Tooling\s*)?)?\s*:\s*([^\n]+)/i;
  }
  const match = body.match(regex);
  if (!match) return null;
  
  return match[1]
    .split(/[;,]/)
    .map(item => item.replace(/^[•\s\-*]+|[•\s\-*]+$/g, '').trim())
    .filter(item => item.length > 0);
}

function processFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const parts = content.split('---');
  if (parts.length < 3) return;

  const frontmatter = parts[1].trim();
  let body = parts.slice(2).join('---');

  // Check if upstream/downstream are empty
  const upMatch = frontmatter.match(/^upstream:\s*\[(.*?)\]/ms);
  const downMatch = frontmatter.match(/^downstream:\s*\[(.*?)\]/ms);
  
  if (!upMatch || !downMatch) return;
  
  const upEmpty = upMatch[1].trim() === '';
  const downEmpty = downMatch[1].trim() === '';
  
  if (!upEmpty && !downEmpty) return; // Both already populated
  
  const upArr = upEmpty ? extractSemanticArray(body, 'Upstream') : null;
  const downArr = downEmpty ? extractSemanticArray(body, 'Downstream') : null;
  
  if (!upArr && !downArr) return; // Nothing to fix
  
  let newFrontmatter = frontmatter;
  if (upArr) {
    newFrontmatter = newFrontmatter.replace(/^upstream:\s*\[\s*\]/m, `upstream: ${JSON.stringify(upArr)}`);
  }
  if (downArr) {
    newFrontmatter = newFrontmatter.replace(/^downstream:\s*\[\s*\]/m, `downstream: ${JSON.stringify(downArr)}`);
  }
  
  // Also strip the old body section 6 since data is now in frontmatter
  body = body.replace(/## System Interconnectivity[\s\S]*?(?=\n\n|\n---|$)/i, '').trim();
  
  const finalPayload = `---\n${newFrontmatter}\n---\n\n${body}\n`;
  fs.writeFileSync(filePath, finalPayload, 'utf8');
  console.log(`  FIXED: ${path.basename(filePath)}`);
}

console.log('Fixing upstream/downstream...');
const files = fs.readdirSync(TARGET_DIR).filter(file => file.endsWith('.md'));
let count = 0;
files.forEach(file => {
  const fp = path.join(TARGET_DIR, file);
  const content = fs.readFileSync(fp, 'utf8');
  const fm = content.split('---')[1] || '';
  if (fm.includes('upstream: []') || fm.includes('downstream: []')) {
    processFile(fp);
    count++;
  }
});
console.log(`Fixed ${count} files.`);
