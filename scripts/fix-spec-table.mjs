import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const fp = join(__dirname, '..', 'src', 'components', 'products', 'SpecificationTable.astro');
let c = readFileSync(fp, 'utf-8');

// Fix the broken style expression
c = c.replace(
  '<tr style="{{ background: i % 2 === 0 ? \'transparent\' : \'color-mix(in srgb, var(--theme-bg) 50%, var(--theme-surface))\' }}">',
  '<tr class:list={i % 2 === 0 ? [] : ["even-bg"]}>'
);

// Add a style tag for the alternating row
c = c.replace(
  '</section>',
  `<style>
  .even-bg { background: color-mix(in srgb, var(--theme-bg) 50%, var(--theme-surface)); }
</style>
</section>`
);

writeFileSync(fp, c, 'utf-8');
console.log('Fixed.');
