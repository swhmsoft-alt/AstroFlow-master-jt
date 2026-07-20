import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const p = join(__dirname, '..', 'src', 'pages', 'products', 'product-entities', '[...slug].astro');
let c = readFileSync(p, 'utf-8');

// Remove the old RICH BLUEPRINT SPEC INJECTION section (now handled by RichEntityContent)
const oldInjectionStart = c.indexOf('<!-- ── RICH BLUEPRINT SPEC INJECTION');
const section6Start = c.indexOf('<!-- ── SECTION 6: CTA');

if (oldInjectionStart === -1) {
  console.error('Could not find old blueprint injection');
  process.exit(1);
}

const before = c.substring(0, oldInjectionStart);
const after = c.substring(section6Start);

c = before + after;

writeFileSync(p, c, 'utf-8');
console.log('Double render removed. Old blueprint injection section deleted.');
