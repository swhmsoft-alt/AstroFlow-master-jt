import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const c = readFileSync(join(__dirname, '..', 'src', 'config', 'hero.ts'), 'utf-8');
let count = 0;
let pos = -1;
while ((pos = c.indexOf("'/products'", pos + 1)) !== -1) {
  count++;
  console.log('  Occurrence', count, 'at byte', pos);
  console.log('  Context:', c.substring(pos, pos + 60));
  console.log('');
}
console.log('Total:', count, 'occurrences');
