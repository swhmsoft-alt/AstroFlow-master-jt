// cleanup-specs.mjs
// Remove unnecessary frontmatter fields from all 260 product-specs files
import { readFileSync, writeFileSync, readdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DIR = join(__dirname, '..', 'src', 'content', 'product-specs');

// Fields to remove — these are material properties, not product-specific
const REMOVE = [
  'titanium_type',
  'uns_number',
  'werkstoff_number',
  'density',
  'tensile_strength',
  'yield_strength',
  'elongation',
  'hardness',
  'modulus',
  'thermal_conductivity',
  'max_service_temp',
  'supply_availability',
  'pubDate',
  'order',
  'incoterms',
  'sampleLeadTime',
  'bulkLeadTime',
];

const files = readdirSync(DIR).filter(f => f.endsWith('.md'));
let count = 0;

for (const file of files) {
  try {
    const fp = join(DIR, file);
    let c = readFileSync(fp, 'utf8');
    const m = c.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
    if (!m) continue;
    let fm = m[1];

    for (const key of REMOVE) {
      // Remove field lines: key: value  or key: [value]
      const re = new RegExp('^' + key + ':.*\n?', 'gm');
      fm = fm.replace(re, '');
    }

    // Clean up empty lines at start and multiple blank lines
    fm = fm.replace(/^\s*\n/, '');
    fm = fm.replace(/\n{3,}/g, '\n\n');

    const output = '---\n' + fm + '\n---\n' + m[2];
    writeFileSync(fp, output, 'utf8');
    count++;
  } catch (e) {
    console.error(file, e.message);
  }
}

console.log('Cleaned ' + count + ' files');
