import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const templatePath = join(__dirname, '..', 'src', 'pages', 'products', 'product-entities', '[...slug].astro');

let c = readFileSync(templatePath, 'utf-8');

// Remove blank lines inside expression blocks
c = c.replace(/\{!isRichSpec && \( \n\n/g, '{!isRichSpec && (\n');

// Also check for the rich spec expression
c = c.replace(/\{isRichSpec && \( \n\n/g, '{isRichSpec && (\n');

writeFileSync(templatePath, c, 'utf-8');
console.log('Whitespace fixed.');
