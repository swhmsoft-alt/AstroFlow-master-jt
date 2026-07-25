/**
 * check_cap_similarity.mjs
 * Check similarity between capability pages to verify differentiation.
 * Uses same Jaccard algorithm as check-similarity.mjs
 */
import { readFileSync, readdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const CAP_DIR = join(__dirname, '..', '..', 'src', 'content', 'capabilities');

function tokenize(text) {
  return (text || '')
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter(t => t.length > 2 && !['the','and','for','are','that','this','with','from','your','all','can','not'].includes(t));
}

function jaccard(a, b) {
  const setA = new Set(a);
  const setB = new Set(b);
  const inter = new Set([...setA].filter(x => setB.has(x)));
  const union = new Set([...setA, ...setB]);
  return union.size === 0 ? 0 : inter.size / union.size;
}

const files = readdirSync(CAP_DIR).filter(f => f.endsWith('.json'));
console.log(`\n=== CAPABILITY SIMILARITY CHECK ===`);
console.log(`Files: ${files.length}`);

// Load all capabilities
const caps = files.map(f => {
  const data = JSON.parse(readFileSync(join(CAP_DIR, f), 'utf8'));
  return { slug: f.replace('.json', ''), title: data.title || f, data };
});

// Check specific comparisons first: blade vs waterjet
const bladeIdx = caps.findIndex(c => c.slug.includes('5-axis-cnc-machining-of-blades'));
const waterjetIdx = caps.findIndex(c => c.slug.includes('waterjet-cutting'));
const vacuumIdx = caps.findIndex(c => c.slug.includes('vacuum-annealing'));
const anodizeIdx = caps.findIndex(c => c.slug.includes('anodizing-ams'));
const laserMarkIdx = caps.findIndex(c => c.slug.includes('laser-marking-udi'));
const charpyIdx = caps.findIndex(c => c.slug.includes('charpy-impact'));

if (bladeIdx >= 0 && waterjetIdx >= 0) {
  const blade = caps[blazeIdx];
  const waterjet = caps[waterjetIdx];
  
  const fields = ['processDescription', 'heatControl', 'flatnessControl', 'capabilitiesDescription'];
  let totalSim = 0;
  console.log(`\n--- Page A: ${blade.title}`);
  console.log(`--- Page B: ${waterjet.title}`);
  for (const field of fields) {
    const a = tokenize(blade.data[field] || '');
    const b = tokenize(waterjet.data[field] || '');
    const sim = jaccard(a, b);
    totalSim += sim;
    console.log(`  ${field}: similarity=${(sim * 100).toFixed(1)}% [tokens: ${a.length} vs ${b.length}]`);
  }
  console.log(`  AVERAGE SIMILARITY: ${(totalSim / fields.length * 100).toFixed(1)}%`);
}

// Full pairwise analysis on processDescription
console.log(`\n--- PAIRWISE ANALYSIS (processDescription) ---`);
const pdFields = ['processDescription', 'heatControl', 'flatnessControl'];
let totalPairs = 0;
let highSimPairs = 0;
const threshold = 0.50;

for (let i = 0; i < caps.length && i < 50; i++) {
  for (let j = i + 1; j < caps.length && j < 50; j++) {
    let avgSim = 0;
    for (const field of pdFields) {
      const a = tokenize(caps[i].data[field] || '');
      const b = tokenize(caps[j].data[field] || '');
      avgSim += jaccard(a, b);
    }
    avgSim /= pdFields.length;
    totalPairs++;
    if (avgSim > threshold) {
      highSimPairs++;
      if (highSimPairs <= 3) {
        console.log(`  HIGH SIM: ${(avgSim*100).toFixed(0)}% between "${caps[i].title.substring(0,40)}" and "${caps[j].title.substring(0,40)}"`);
      }
    }
  }
}

console.log(`\n=== RESULTS ===`);
console.log(`Pairs analyzed: ${totalPairs}`);
console.log(`Pairs above ${(threshold*100).toFixed(0)}% similarity: ${highSimPairs} (${(highSimPairs/totalPairs*100).toFixed(1)}%)`);
console.log(`Average similarity across ALL pairs: ${(await computeAllAverage(caps, pdFields, 200)).toFixed(1)}%`);

async function computeAllAverage(caps, fields, limit) {
  let total = 0, count = 0;
  for (let i = 0; i < caps.length && i < limit; i++) {
    for (let j = i + 1; j < caps.length && j < limit; j++) {
      let sim = 0;
      for (const field of fields) {
        const a = tokenize(caps[i].data[field] || '');
        const b = tokenize(caps[j].data[field] || '');
        sim += jaccard(a, b);
      }
      total += sim / fields.length;
      count++;
    }
  }
  return count > 0 ? (total / count * 100) : 0;
}
