/**
 * FULL PAGE similarity check - ALL 7 modules
 * Compares every data field that feeds into the rendered page.
 */
import { readFileSync, readdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const CAP_DIR = join(__dirname, '..', '..', 'src', 'content', 'capabilities');

const STOP = new Set([
  'the','and','for','are','that','this','with','from','your','all','can',
  'not','was','been','have','has','had','but','its','their','our','you',
  'each','also','per','use','used','via','than'
]);

function tok(t) {
  return (t || '').toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter(w => w.length > 2 && !STOP.has(w));
}

function jac(a, b) {
  const sA = new Set(a), sB = new Set(b);
  const inter = new Set([...sA].filter(x => sB.has(x)));
  const union = new Set([...sA, ...sB]);
  return union.size === 0 ? 0 : inter.size / union.size;
}

// Extract ALL text from a capability that feeds into the 7 rendered modules
function fullPageText(d) {
  const parts = [];

  // Title + description (Module 1, 1b)
  parts.push(d.title, d.description);

  // Process description (Module 2)
  parts.push(d.processDescription);

  // Comparison table data (Module 2 table)
  if (d.processComparison) {
    for (const row of d.processComparison) {
      parts.push(row.dimension, row.laser, row.waterjet);
    }
  }

  // Engineering capabilities (Module 3)
  parts.push(d.capabilitiesDescription);
  if (d.holeTypes) parts.push(d.holeTypes.join(' '));
  parts.push(d.heatControl, d.flatnessControl);
  if (d.materials) parts.push(d.materials.join(' '));
  if (d.titaniumGrades) parts.push(d.titaniumGrades.join(' '));

  // Applications (Module 4)
  if (d.typicalApplications) parts.push(d.typicalApplications.join(' '));
  if (d.relatedEntities) parts.push(d.relatedEntities.join(' '));

  // Downstream (Module 5)
  if (d.downstreamProcesses) {
    for (const ds of d.downstreamProcesses) {
      parts.push(ds.name, ds.description);
    }
  }

  // Quality (Module 6)
  if (d.inspectionItems) parts.push(d.inspectionItems.join(' '));
  if (d.qualityStandards) parts.push(d.qualityStandards.join(' '));

  // FAQ (Module 7a - auto-generated based on title)
  // We don't include faq content as it's auto-generated per page

  // SEO
  parts.push(d.seoTitle, d.seoDescription);

  return parts.filter(Boolean).join(' ');
}

const files = readdirSync(CAP_DIR).filter(f => f.endsWith('.json'));
console.log('Loading ' + files.length + ' capabilities...');
const caps = files.map(f => {
  const d = JSON.parse(readFileSync(join(CAP_DIR, f), 'utf8'));
  return { slug: f.replace('.json', ''), title: d.title || f, data: d };
});

// 1. Specific cross-category pairs
const pairs = [
  ['5-axis-cnc-machining-of-blades', 'waterjet-cutting'],
  ['5-axis-cnc-machining-of-blades', 'vacuum-annealing'],
  ['vacuum-annealing', 'anodizing-ams-2488'],
  ['laser-marking-udi-code', 'waterjet-cutting'],
  ['anodizing-ams-2488', 'vacuum-annealing'],
  ['swiss-turning-of-watch-pinions', 'laser-marking-udi-code'],
  ['tig-welding-of-frame-assemblies', 'ultrasonic-cleaning'],
];
console.log('\n=== FULL PAGE SIMILARITY (all 7 modules) ===');
for (const [a, b] of pairs) {
  const ca = caps.find(c => c.slug.includes(a));
  const cb = caps.find(c => c.slug.includes(b));
  if (!ca || !cb) { console.log('  SKIP: ' + a + ' or ' + b); continue; }
  const s = jac(tok(fullPageText(ca.data)), tok(fullPageText(cb.data)));
  const la = ca.title.substring(0, 35).padEnd(37);
  const lb = cb.title.substring(0, 35);
  console.log('  ' + (s*100).toFixed(1) + '%  ' + la + '| ' + lb);
}

// 2. Pairwise sample
console.log('\n=== PAIRWISE SAMPLE (first 30 capabilities) ===');
const SAMPLE = 30;
let hi = 0, tot = 0, sum = 0;
for (let i = 0; i < SAMPLE; i++) {
  for (let j = i + 1; j < SAMPLE; j++) {
    const s = jac(tok(fullPageText(caps[i].data)), tok(fullPageText(caps[j].data)));
    tot++;
    sum += s;
    if (s > 0.50) {
      hi++;
      if (hi <= 3) {
        console.log('  ' + (s*100).toFixed(0) + '%  ' + caps[i].title.substring(0,32).padEnd(34) + '| ' + caps[j].title.substring(0,32));
      }
    }
  }
}
console.log('  Total pairs: ' + tot + ', High (>50%): ' + hi + ', Average: ' + (sum/tot*100).toFixed(1) + '%');
console.log('  Pages with generic fallback: TBD');
