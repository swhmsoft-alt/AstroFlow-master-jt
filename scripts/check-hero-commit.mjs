import { execSync } from 'child_process';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');

// Get the committed version of hero.ts
const out = execSync('git show HEAD:src/config/hero.ts', { cwd: root, encoding: 'utf-8' });
let count = 0;
let pos = -1;
while ((pos = out.indexOf("'/products'", pos + 1)) !== -1) count++;
console.log('In committed version (HEAD):', count, 'occurrences');

// Also check total line count
const lines = out.split('\n');
console.log('Total lines:', lines.length);
