import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const templatePath = join(__dirname, '..', 'src', 'pages', 'products', 'product-entities', '[...slug].astro');
let c = readFileSync(templatePath, 'utf-8');

// Handle CRLF line endings
const target = 'const faqData = data.faq || [];\r\n\r\n// JSON-LD';
const idx = c.indexOf(target);

if (idx === -1) {
  console.error('Target not found');
  process.exit(1);
}

const before = c.substring(0, idx);
const after = c.substring(idx + target.length);

const insert = `const faqData = data.faq || [];\r\n\r\n// Load matching product spec for rich blueprint injection\r\nconst allSpecs = await getCollection('product-specs');\r\nconst specEntry = allSpecs.find(s => s.slug === entry.slug);\r\nlet SpecContent;\r\nif (specEntry) {\r\n  const rendered = await specEntry.render();\r\n  SpecContent = rendered.Content;\r\n}\r\n\r\n// JSON-LD`;

writeFileSync(templatePath, before + insert + after, 'utf-8');
console.log('Spec fetch added successfully (CRLF fix).');
