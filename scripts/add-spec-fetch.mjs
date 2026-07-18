import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const templatePath = join(__dirname, '..', 'src', 'pages', 'products', 'product-entities', '[...slug].astro');
let c = readFileSync(templatePath, 'utf-8');

// Add spec loading after the faqData line
c = c.replace(
  'const faqData = data.faq || [];\n\n// JSON-LD',
  `const faqData = data.faq || [];

// Load matching product spec for rich blueprint injection
const allSpecs = await getCollection('product-specs');
const specEntry = allSpecs.find(s => s.slug === entry.slug);
let SpecContent;
if (specEntry) {
  const rendered = await specEntry.render();
  SpecContent = rendered.Content;
}

// JSON-LD`
);

writeFileSync(templatePath, c, 'utf-8');
console.log('Spec fetch added successfully.');
console.log('File size:', c.length, 'bytes');
