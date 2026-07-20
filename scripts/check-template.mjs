import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const c = readFileSync(join(__dirname, '..', 'src', 'pages', 'products', 'product-entities', '[...slug].astro'), 'utf-8');

console.log('Has product-specs:', c.includes("product-specs"));
console.log('Has specEntry:', c.includes('specEntry'));
console.log('Has SpecContent:', c.includes('SpecContent'));
console.log('Has RICH BLUEPRINT:', c.includes('RICH BLUEPRINT'));
console.log('Has allSpecs:', c.includes('allSpecs'));
