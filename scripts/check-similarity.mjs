/**
 * check-similarity.mjs
 *
 * Reads all product entity JSON files and computes pairwise text similarity
 * to verify uniqueness. Uses Jaccard similarity on word tokens.
 *
 * Usage: node scripts/check-similarity.mjs
 */

import { readFileSync, readdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ENTITIES_DIR = join(__dirname, '..', 'src', 'content', 'product-entities');

function tokenize(text) {
  return (text || '')
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter(t => t.length > 2);
}

function jaccard(a, b) {
  const setA = new Set(a);
  const setB = new Set(b);
  const inter = new Set([...setA].filter(x => setB.has(x)));
  const union = new Set([...setA, ...setB]);
  return union.size === 0 ? 0 : inter.size / union.size;
}

// Fields that contribute to content uniqueness
const WEIGHTED_FIELDS = [
  { key: 'alloyReason', weight: 0.25 },
  { key: 'process', weight: 0.15, isArray: true },
  { key: 'inspection', weight: 0.12, isArray: true },
  { key: 'commonFailures', weight: 0.12, isArray: true },
  { key: 'standards', weight: 0.08, isArray: true },
  { key: 'surfaceTreatment', weight: 0.08, isArray: true },
  { key: 'function', weight: 0.10 },
  { key: 'seoTitle', weight: 0.05 },
  { key: 'seoDescription', weight: 0.05 },
];

console.log('Loading product entities...');
const files = readdirSync(ENTITIES_DIR).filter(f => f.endsWith('.json'));
console.log(`Found ${files.length} product entities.`);

// Load all products
const products = files.map(f => {
  const fp = join(ENTITIES_DIR, f);
  const slug = f.replace('.json', '');
  const data = JSON.parse(readFileSync(fp, 'utf8'));
  return { slug, data };
});

// Compute pairwise similarity for each field
const totalPairs = (products.length * (products.length - 1)) / 2;
console.log(`\nAnalyzing ${totalPairs} product pairs...\n`);

let overallSimilarities = [];
const fieldResults = {};

for (const field of WEIGHTED_FIELDS) {
  fieldResults[field.key] = [];
}

for (let i = 0; i < products.length; i++) {
  for (let j = i + 1; j < products.length; j++) {
    const a = products[i].data;
    const b = products[j].data;

    let weightedSum = 0;
    let weightTotal = 0;

    for (const field of WEIGHTED_FIELDS) {
      let textA, textB;

      if (field.isArray) {
        textA = (a[field.key] || []).join(' ');
        textB = (b[field.key] || []).join(' ');
      } else {
        textA = a[field.key] || '';
        textB = b[field.key] || '';
      }

      const tokensA = tokenize(textA);
      const tokensB = tokenize(textB);
      const sim = jaccard(tokensA, tokensB);

      fieldResults[field.key].push(sim);
      weightedSum += sim * field.weight;
      weightTotal += field.weight;
    }

    const overall = weightTotal > 0 ? weightedSum / weightTotal : 0;
    overallSimilarities.push(overall);
  }
}

// Report
console.log('='.repeat(68));
console.log('  PRODUCT SIMILARITY REPORT');
console.log('='.repeat(68));
console.log(`  Products analyzed: ${products.length}`);
console.log(`  Total pairs:       ${totalPairs}`);
console.log('');

// Sort and compute stats
overallSimilarities.sort((a, b) => a - b);
const avg = overallSimilarities.reduce((s, v) => s + v, 0) / overallSimilarities.length;
const median = overallSimilarities[Math.floor(overallSimilarities.length / 2)];
const p95 = overallSimilarities[Math.floor(overallSimilarities.length * 0.95)];

console.log('  ┌──────────────┬──────────┬──────────┬──────────┬──────────┐');
console.log('  │ Metric       │    Min   │   Avg    │  Median  │   95th   │');
console.log('  ├──────────────┼──────────┼──────────┼──────────┼──────────┤');
console.log(`  │ Overall      │  ${(overallSimilarities[0]*100).toFixed(1)}%   │  ${(avg*100).toFixed(1)}%   │  ${(median*100).toFixed(1)}%   │  ${(p95*100).toFixed(1)}%   │`);
console.log('  └──────────────┴──────────┴──────────┴──────────┴──────────┘');
console.log('');

console.log('  ┌──────────────────────┬──────────┬──────────┬──────────┐');
console.log('  │ Field                │   Avg    │  Worst   │  Weight  │');
console.log('  ├──────────────────────┼──────────┼──────────┼──────────┤');

for (const field of WEIGHTED_FIELDS) {
  const vals = fieldResults[field.key].sort((a, b) => a - b);
  const fAvg = vals.reduce((s, v) => s + v, 0) / vals.length;
  const fMax = vals[vals.length - 1];
  console.log(`  │ ${field.key.padEnd(20)} │ ${(fAvg*100).toFixed(1)}%   │ ${(fMax*100).toFixed(1)}%   │ ${(field.weight*100).toFixed(0)}%    │`);
}

console.log('  └──────────────────────┴──────────┴──────────┴──────────┘');

// Find most similar pair
let maxSim = 0, maxI = 0, maxJ = 0;
for (let i = 0; i < products.length; i++) {
  for (let j = i + 1; j < products.length; j++) {
    const a = products[i].data;
    const b = products[j].data;
    let ws = 0, wt = 0;
    for (const field of WEIGHTED_FIELDS) {
      let ta, tb;
      if (field.isArray) { ta = (a[field.key]||[]).join(' '); tb = (b[field.key]||[]).join(' '); }
      else { ta = a[field.key]||''; tb = b[field.key]||''; }
      const sim = jaccard(tokenize(ta), tokenize(tb));
      ws += sim * field.weight; wt += field.weight;
    }
    const o = wt > 0 ? ws/wt : 0;
    if (o > maxSim) { maxSim = o; maxI = i; maxJ = j; }
  }
}

console.log('');
console.log(`  Most similar pair: ${products[maxI].slug} ↔ ${products[maxJ].slug}`);
console.log(`  Similarity:        ${(maxSim*100).toFixed(1)}%`);
console.log('');

// CLI threshold support: node scripts/check-similarity.mjs --threshold 0.30
const threshold = parseFloat(process.argv[2] === '--threshold' ? process.argv[3] : '') || 0.30;

if (avg < threshold) {
  console.log(`  ✅ PASS: Average similarity (${(avg*100).toFixed(1)}%) is below ${(threshold*100).toFixed(0)}% threshold.`);
  process.exit(0);
} else {
  console.log(`  ❌ FAIL: Average similarity is ${(avg*100).toFixed(1)}% (threshold: ${(threshold*100).toFixed(0)}%).`);
  console.log(`     Most similar pair: ${products[maxI].slug} ↔ ${products[maxJ].slug} at ${(maxSim*100).toFixed(1)}%`);
  console.log('     Run `node scripts/differentiate-products.mjs` to reduce similarity.');
  process.exit(1);
}
