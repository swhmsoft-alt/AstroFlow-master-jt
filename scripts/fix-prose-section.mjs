import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const templatePath = join(__dirname, '..', 'src', 'pages', 'products', 'product-entities', '[...slug].astro');
let c = readFileSync(templatePath, 'utf-8');

// Find the prose container and add a header section before it
// The line we need: <article class="prose prose-sm md:prose-base max-w-none"...
const proseMatch = '<article class="prose prose-sm md:prose-base max-w-none"';
const proseIdx = c.indexOf(proseMatch);
if (proseIdx === -1) {
  console.error('Could not find prose container');
  process.exit(1);
}

const beforeProse = c.substring(0, proseIdx);
const afterProse = c.substring(proseIdx);

const headerSection = `<div class="mb-8 pb-6 border-b" style="border-color: color-mix(in srgb, var(--theme-primary) 10%, transparent);">
          <h2 class="text-xl font-bold" style="color: var(--theme-text);">Complete Engineering Specification</h2>
          <p class="text-sm mt-1" style="color: color-mix(in srgb, var(--theme-text) 50%, transparent);">Detailed technical data for procurement, design, and quality engineering review.</p>
        </div>
        `;

c = beforeProse + headerSection + afterProse;
writeFileSync(templatePath, c, 'utf-8');
console.log('Prose section header added.');
