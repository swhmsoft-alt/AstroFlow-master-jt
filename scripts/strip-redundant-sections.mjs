import { readFileSync, writeFileSync, readdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const TARGET_DIR = join(__dirname, '..', 'src', 'content', 'product-specs');
const files = readdirSync(TARGET_DIR).filter(f => f.endsWith('.md'));

let count = 0;
for (const file of files) {
  const fp = join(TARGET_DIR, file);
  let c = readFileSync(fp, 'utf-8');
  const parts = c.split('---');
  if (parts.length < 3) continue;
  
  let fm = parts[1].trim();
  let body = parts.slice(2).join('---');

  // Check if already stripped (body no longer has Technical Specifications Matrix header)
  if (!body.includes('## Technical Specifications Matrix')) {
    count++;
    continue;
  }

  // 1. Remove ## Technical Specifications Matrix section (from heading to next ## or end)
  body = body.replace(/## Technical Specifications Matrix[\s\S]*?(?=\n## |$)/, '');

  // 2. Remove ## Technical FAQ section (from heading to next ## or end)
  body = body.replace(/## Technical FAQ[\s\S]*?(?=\n## |$)/, '');

  // 3. Remove Primary Industrial Entity / Topology section (from **Primary to end)
  body = body.replace(/\n\*\*Primary Industrial Entity[\s\S]*$/, '');

  // 4. Remove the first paragraph of Supply Chain (the cert/standards intro line)
  //    Leave the detailed traceable text intact
  //    (Keep the section heading and body)

  // Clean up excessive blank lines
  body = body.replace(/\n{3,}/g, '\n\n').trim();

  const final = `---\n${fm}\n---\n\n${body}\n`;
  writeFileSync(fp, final, 'utf-8');
  count++;
}

console.log(`Stripped redundant sections from ${files.length} files (${count} modified).`);
