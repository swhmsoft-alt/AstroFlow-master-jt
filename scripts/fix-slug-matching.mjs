import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const templatePath = join(__dirname, '..', 'src', 'pages', 'products', 'product-entities', '[...slug].astro');
let c = readFileSync(templatePath, 'utf-8');

// Fix: entry.slug may be undefined for JSON entities; fallback to id-derived slug
c = c.replace(
  'const specEntry = allSpecs.find(s => s.slug === entry.slug);',
  `const specSlug = entry.slug || entry.id?.replace(/\\.(json|md)$/, '').split('/').pop();
const specEntry = allSpecs.find(s => s.slug === specSlug);`
);

writeFileSync(templatePath, c, 'utf-8');
console.log('Slug matching fixed.');
