import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const templatePath = join(__dirname, '..', 'src', 'pages', 'products', 'product-entities', '[...slug].astro');
let c = readFileSync(templatePath, 'utf-8');

const target = 'const faqData = data.faq || [];\n\n// JSON-LD';
const idx = c.indexOf(target);

if (idx === -1) {
  console.error('Target text not found!');
  process.exit(1);
}

const before = c.substring(0, idx);
const after = c.substring(idx + target.length);

const insert = `const faqData = data.faq || [];

// Load matching product spec for rich blueprint injection
const allSpecs = await getCollection('product-specs');
const specEntry = allSpecs.find(s => s.slug === entry.slug);
let SpecContent;
if (specEntry) {
  const rendered = await specEntry.render();
  SpecContent = rendered.Content;
}

// JSON-LD`;

writeFileSync(templatePath, before + insert + after, 'utf-8');
console.log('Spec fetch added successfully.');
