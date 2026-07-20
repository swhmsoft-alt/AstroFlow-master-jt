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

  if (fm.includes('supply_availability:')) continue; // already done

  // Extract Supply Availability from body
  const supplyMatch = body.match(/\*\*Supply Availability:\*\*\s*([^\n]+)/);
  let supplyLine = '';
  if (supplyMatch) {
    supplyLine = `supply_availability: "${supplyMatch[1].trim()}"`;
  } else {
    supplyLine = `supply_availability: "In-Stock / Custom OEM Blueprint Fabrication (MOQ: 1 pc)"`;
  }

  // Extract FAQ pairs from body
  const faqs = [];
  const qaRegex = /Q\d+:?\s*([^\n]+)\s*A\d+:?\s*([^\n]+(?:[^\n]*)*?)(?=\n\nQ|\n##|$)/gs;
  let match;
  while ((match = qaRegex.exec(body)) !== null) {
    faqs.push({ q: match[1].trim(), a: match[2].trim() });
  }

  let faqLine = '';
  if (faqs.length > 0) {
    faqLine = `faqs:\n${faqs.map(f => `  - q: "${f.q.replace(/"/g, '\\"')}"\n    a: "${f.a.replace(/"/g, '\\"')}"`).join('\n')}`;
  }

  // Inject into frontmatter
  const newFm = `${fm}\n${supplyLine}\n${faqLine ? `\n${faqLine}` : ''}`;
  const newContent = `---\n${newFm}\n---\n\n${body}`;
  writeFileSync(fp, newContent, 'utf-8');
  count++;
}

console.log(`Injected supply_availability + faqs into ${count} files.`);
