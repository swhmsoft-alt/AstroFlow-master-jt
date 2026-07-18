import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const templatePath = join(__dirname, '..', 'src', 'pages', 'products', 'product-entities', '[...slug].astro');
let c = readFileSync(templatePath, 'utf-8');

c = c.replace(
  "entry.slug || entry.id?.replace('.json','') || undefined",
  "entry.slug || entry.id?.replace(/\\.(json|md)$/, '') || undefined"
);

writeFileSync(templatePath, c, 'utf-8');
console.log('getStaticPaths fixed.');
