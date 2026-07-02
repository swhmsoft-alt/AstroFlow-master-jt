import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DIR = path.resolve(__dirname, '../src/content/blog-translations');

function buildFrontmatter(fm) {
  const lines = [];
  for (const [key, value] of Object.entries(fm)) {
    if (key === 'tags' && Array.isArray(value) && value.length > 0)
      lines.push(`tags: [${value.map(t => `"${t}"`).join(', ')}]`);
    else if (key === 'tags' && Array.isArray(value))
      lines.push('tags: []');
    else if (key === 'featured')
      lines.push(`featured: ${value === true || value === 'true' ? 'true' : 'false'}`);
    else if (key === 'pubDate')
      lines.push(`pubDate: ${value}`);
    else if (typeof value === 'string')
      lines.push(`${key}: "${value.replace(/"/g, '\\"')}"`);
    else
      lines.push(`${key}: ${value}`);
  }
  return lines.join('\n');
}

const files = fs.readdirSync(DIR).filter(f => f.endsWith('.md'));
let count = 0;

for (const file of files) {
  const content = fs.readFileSync(path.join(DIR, file), 'utf-8');
  
  // Split on the SECOND frontmatter boundary
  // Pattern: find the second occurrence of --- that starts a new frontmatter block
  const lines = content.replace(/\r\n/g, '\n').split('\n');
  
  // Find the first closing ---
  let firstFmEnd = -1;
  for (let i = 1; i < lines.length; i++) {
    if (lines[i].trim() === '---') {
      firstFmEnd = i;
      break;
    }
  }
  if (firstFmEnd < 0) continue;
  
  // Check if the line AFTER the first closing --- is another --- (double FM)
  // Pattern: line[0] = ---, line[1..firstFmEnd-1] = FM, line[firstFmEnd] = ---, line[firstFmEnd+1] = --- (start of second FM)
  if (firstFmEnd + 1 >= lines.length || lines[firstFmEnd + 1].trim() !== '---') continue;
  
  // Find the second frontmatter closing ---
  let secondFmEnd = -1;
  for (let i = firstFmEnd + 2; i < lines.length; i++) {
    if (lines[i].trim() === '---') {
      secondFmEnd = i;
      break;
    }
  }
  if (secondFmEnd < 0) continue;
  
  // Extract second frontmatter lines (between the two --- markers) and body
  const secondFmLines = lines.slice(firstFmEnd + 2, secondFmEnd);
  const bodyLines = lines.slice(secondFmEnd + 1);
  
  // Parse second frontmatter
  const fm = {};
  for (const line of secondFmLines) {
    const kv = line.match(/^(\w+):\s*(.*)$/);
    if (kv) {
      let value = kv[2].trim();
      if (value.startsWith('[') && value.endsWith(']')) {
        try { value = JSON.parse(value.replace(/'/g, '"')); }
        catch { value = value.slice(1, -1).split(',').map(s => s.trim().replace(/"/g, '')); }
      } else {
        value = value.replace(/^["']|["']$/g, '');
      }
      fm[kv[1]] = value;
    }
  }
  
  // Add lang and originalSlug for routing
  fm.lang = file.split('-')[0];
  fm.originalSlug = file.split('-').slice(1).join('-').replace('.md', '');
  
  // Build output
  const fmStr = buildFrontmatter(fm);
  const bodyStr = bodyLines.join('\n').trim();
  const newContent = `---\n${fmStr}\n---\n${bodyStr}`;
  
  fs.writeFileSync(path.join(DIR, file), newContent, 'utf-8');
  console.log(`✓ Fixed: ${file}`);
  console.log(`  Title: ${fm.title || '(empty)'}`);
  count++;
}

console.log(`\nFixed ${count} files.`);