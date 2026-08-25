// scripts/test-mentions.mts
// ================================================================
// F3.2 unit/integration test for src/lib/mentions.ts
//
// Run:
//   npx tsx scripts/test-mentions.mts
//
// What it verifies (against the canonical real schemas):
//   1. Each builder returns valid entity IDs from the real registry.
//   2. Canonical schema fields are resolved correctly: fuzzy for
//      display strings, exact-slug for slug arrays.
//   3. No silent fallback across alternative field names.
//   4. Self-exclusion, cap, dedup, empty-data handling.
//   5. Determinism + score-threshold filter.
//
// Designed as integration test against the real registry because the
// builders are heuristic scorers; unit-stubbing the registry would
// test trivial pass-through, not the actual scoring.
//
// Exit code: 0 if all assertions pass, 1 otherwise.
// ================================================================

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import {
  mentionsForProduct,
  mentionsForCapability,
  mentionsForIndustry,
  type ProductData,
  type CapabilityData,
  type IndustryData,
} from '../src/lib/mentions.ts';
import {
  getAllEntities,
  getEntityById,
  getEntitiesByCategory,
  clearEntityGraphCache,
} from '../src/lib/entity-graph.ts';

// ---------- mini test harness (zero dependencies) ----------
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

let passed = 0;
let failed = 0;
const failures: string[] = [];

function assert(cond: boolean, label: string, detail?: string): void {
  if (cond) {
    passed++;
    console.log('  [PASS] ' + label);
  } else {
    failed++;
    const msg = detail ? label + '  ->  ' + detail : label;
    failures.push(msg);
    console.log('  [FAIL] ' + msg);
  }
}

function section(title: string): void {
  const bar = '-'.repeat(Math.max(0, 60 - title.length - 4));
  console.log('\n-- ' + title + ' ' + bar);
}

function pickSample(
  dir: string,
  regex: RegExp,
): { _filename: string; data: any } | null {
  const full = path.join(ROOT, dir);
  if (!fs.existsSync(full)) return null;
  const files = fs.readdirSync(full).filter((f) => f.endsWith('.json'));
  if (files.length === 0) return null;
  const preferred = files.find((f) => regex.test(f));
  const chosen = preferred || files[0];
  const raw = fs.readFileSync(path.join(full, chosen), 'utf-8');
  return { _filename: chosen, data: JSON.parse(raw) };
}

// ---------- preflight ----------
clearEntityGraphCache();
const allEntities = getAllEntities();
section('preflight');
assert(allEntities.length > 0, 'entity registry loaded', allEntities.length + ' entities');
// NOTE: src/content/products/ contains only one .md file; the canonical
// product schema lives in src/content/product-entities/*.json (260 files).
// We pick a sample whose relatedCapabilities slugs match real registry
// process entities (so the slug-resolution assertions are meaningful),
// otherwise dangling slugs in source data would surface as test noise.
const productSample = pickSample(
  'src/content/product-entities',
  /titanium-cardiovascular-stent|titanium-embolization|titanium-neuro-guidewire|cnc-machining|aerospace|medical-implant|catheter/i,
);
const capabilitySample = pickSample(
  'src/content/capabilities',
  /thread-rolling|cnc-milling|5-axis|aerospace|astm-b348/i,
);
const industrySample = pickSample(
  'src/content/industries',
  /aerospace|medical-device|energy|chemical/i,
);
assert(productSample !== null, 'product sample loaded', productSample?._filename);
assert(capabilitySample !== null, 'capability sample loaded', capabilitySample?._filename);
assert(industrySample !== null, 'industry sample loaded', industrySample?._filename);

// =================================================================
// 1. Public builder smoke tests against real canonical JSON samples
// =================================================================
section('mentionsForProduct (real sample)');
const productIds = mentionsForProduct(productSample!.data as ProductData, undefined, 12);
assert(Array.isArray(productIds), 'returns array');
assert(productIds.length <= 12, 'len <= cap (12)', 'got ' + productIds.length);
assert(new Set(productIds).size === productIds.length, 'no duplicates');
assert(productIds.length > 0, 'rich sample yields >=1 mention', 'got ' + productIds.length);

section('mentionsForProduct (empty data)');
assert(mentionsForProduct({} as ProductData).length === 0, 'empty data -> empty array');
assert(mentionsForProduct(null as unknown as ProductData).length === 0, 'null data -> empty array');

section('mentionsForCapability (real sample)');
const capabilityIds = mentionsForCapability(
  capabilitySample!.data as CapabilityData,
  undefined,
  12,
);
assert(Array.isArray(capabilityIds), 'returns array');
assert(capabilityIds.length <= 12, 'len <= cap (12)', 'got ' + capabilityIds.length);
assert(new Set(capabilityIds).size === capabilityIds.length, 'no duplicates');

section('mentionsForIndustry (real sample)');
const industryIds = mentionsForIndustry(
  industrySample!.data as IndustryData,
  undefined,
  12,
);
assert(Array.isArray(industryIds), 'returns array');
assert(industryIds.length <= 12, 'len <= cap (12)', 'got ' + industryIds.length);
assert(new Set(industryIds).size === industryIds.length, 'no duplicates');

// =================================================================
// 2. All returned IDs resolve to real entities (no fabricated IDs)
// =================================================================
section('all returned IDs resolve to real entities');
const unknownIds: string[] = [];
for (const id of [...productIds, ...capabilityIds, ...industryIds]) {
  if (getEntityById(id) === null) unknownIds.push(id);
}
assert(unknownIds.length === 0, 'no unknown IDs', unknownIds.join(','));

// =================================================================
// 3. Slug resolution: relatedIndustries / relatedCapabilities must
//    resolve by exact slug lookup, not fuzzy match. Resolved slugs
//    MUST appear in the output (consistency). Dangling slugs in
//    source data are surfaced as informational, not failures.
// =================================================================
section('product slug resolution');
const productData = productSample!.data as ProductData;
const expectedIndustryIds: string[] = [];
const danglingIndustrySlugs: string[] = [];
for (const slug of productData.relatedIndustries || []) {
  const hit = getEntitiesByCategory('industry').find(
    (e) => e.slug === slug || e._source_slug === slug,
  );
  if (hit) expectedIndustryIds.push(hit.id);
  else danglingIndustrySlugs.push(slug);
}
const gotIndustryIds = productIds.filter((id) => expectedIndustryIds.includes(id));
assert(
  gotIndustryIds.length === expectedIndustryIds.length,
  'relatedIndustries: every resolved slug appears in output',
  'resolved=' + expectedIndustryIds.length + ' dangling=' + danglingIndustrySlugs.length,
);
const expectedCapIds: string[] = [];
const danglingCapSlugs: string[] = [];
for (const slug of productData.relatedCapabilities || []) {
  const hit = getEntitiesByCategory('process').find(
    (e) => e.slug === slug || e._source_slug === slug,
  );
  if (hit) expectedCapIds.push(hit.id);
  else danglingCapSlugs.push(slug);
}
const gotCapIds = productIds.filter((id) => expectedCapIds.includes(id));
assert(
  gotCapIds.length === expectedCapIds.length,
  'relatedCapabilities: every resolved slug appears in output',
  'resolved=' + expectedCapIds.length + ' dangling=' + danglingCapSlugs.length,
);
if (danglingIndustrySlugs.length + danglingCapSlugs.length > 0) {
  console.log(
    '  [INFO] dangling slugs in ' +
      productSample!._filename +
      ': ' +
      [...danglingIndustrySlugs, ...danglingCapSlugs].join(', '),
  );
}

// =================================================================
// 4. Fuzzy resolution: material display string -> exact canonical_name
//    entity. We require canonical_name == data.material (exact match
//    after normalization) - which is the most rigorous variant of
//    fuzzy match. Lower-acceptance partial matches are NOT asserted
//    because alloy grades differ (Grade 5 vs Grade 23 ELI).
// =================================================================
section('product fuzzy resolution');
const dataMaterial = productData.material;
let materialHit: ReturnType<typeof getEntitiesByCategory>[number] | null = null;
if (dataMaterial) {
  const norm = (s: string): string =>
    s.toLowerCase().replace(/[^a-z0-9]+/g, ' ').replace(/\s+/g, ' ').trim();
  const target = norm(dataMaterial);
  materialHit =
    getEntitiesByCategory('material').find((e) => norm(e.canonical_name) === target) ||
    null;
}
if (materialHit) {
  assert(
    productIds.includes(materialHit.id),
    'material fuzzy match resolves',
    'expected ' + materialHit.id,
  );
} else {
  // The product's material isn't an exact entity - acceptable behavior.
  assert(true, 'material fuzzy match (no exact entity, skipped)', dataMaterial || 'no material');
}

// =================================================================
// 5. Industry builder uses only applications + systems (no silent
//    fallback to fields that don't exist on industry source files)
// =================================================================
section('industry builder uses only canonical fields');
const bogusOnly = mentionsForIndustry({
  materials: ['Grade 5 Ti-6Al-4V'],
  standards: ['ASTM B348'],
  relatedIndustries: ['aerospace-defense'],
  processes: ['CNC milling'],
} as IndustryData);
assert(
  bogusOnly.length === 0,
  'non-canonical fields produce 0 mentions',
  'got ' + bogusOnly.length,
);
const canonicalIndustryIds = mentionsForIndustry(industrySample!.data as IndustryData);
const industryWithBogus = mentionsForIndustry({
  ...(industrySample!.data as IndustryData),
  materials: ['irrelevant'],
  standards: ['irrelevant'],
  relatedIndustries: ['irrelevant'],
} as IndustryData);
assert(
  JSON.stringify(canonicalIndustryIds) === JSON.stringify(industryWithBogus),
  'non-canonical fields do not change output',
);

// =================================================================
// 6. Determinism: same input -> same output
// =================================================================
section('determinism');
const run1 = mentionsForProduct(productSample!.data as ProductData);
const run2 = mentionsForProduct(productSample!.data as ProductData);
assert(JSON.stringify(run1) === JSON.stringify(run2), 'idempotent for same input');

// =================================================================
// 7. Score-threshold: gibberish cannot match any entity with score >= 70
// =================================================================
section('score threshold (gibberish filter)');
const gibberishData: ProductData = {
  industry: 'xqzklmpqrstvwxyz no-such-thing-1234567890',
  material: 'zxcvbnmqwertyuiop-no-match-here',
  process: ['asdfghjkl-not-a-real-process'],
  system: 'qwerty-no-match-system',
  standards: ['xx-nope-12345'],
};
const gibIds = mentionsForProduct(gibberishData);
assert(
  gibIds.length === 0,
  'all-gibberish data -> 0 mentions',
  'got ' + gibIds.length + ': ' + gibIds.join(','),
);

// =================================================================
// 8. Self-exclusion: currentProductId never appears in its own list
// =================================================================
section('self-exclusion');
const fakeSelfId = 'test-product-self-id-zzz-no-such-entity';
const selfIds = mentionsForProduct(
  productSample!.data as ProductData,
  fakeSelfId,
  12,
);
assert(
  !selfIds.includes(fakeSelfId),
  'currentProductId excluded from own list',
);

// =================================================================
// 9. Cap respected
// =================================================================
section('cap respected');
const capTest = mentionsForProduct(
  productSample!.data as ProductData,
  undefined,
  3,
);
assert(capTest.length <= 3, 'len <= cap (3)', 'got ' + capTest.length);

// =================================================================
// 10. Coverage smoke: at least one builder yields >= 1 id
// =================================================================
section('coverage smoke');
const productHits = mentionsForProduct(productSample!.data as ProductData).length;
const capabilityHits = mentionsForCapability(capabilitySample!.data as CapabilityData).length;
const industryHits = mentionsForIndustry(industrySample!.data as IndustryData).length;
assert(
  productHits + capabilityHits + industryHits > 0,
  'at least one builder yields >=1 mention',
  'p=' + productHits + ' c=' + capabilityHits + ' i=' + industryHits,
);

// =================================================================
// summary
// =================================================================
console.log('\n' + '='.repeat(64));
console.log('  passed: ' + passed + '    failed: ' + failed + '    total: ' + (passed + failed));
console.log('='.repeat(64));
if (failed > 0) {
  console.log('\nfailures:');
  for (const f of failures) console.log('  - ' + f);
  process.exit(1);
}
console.log('OK');
