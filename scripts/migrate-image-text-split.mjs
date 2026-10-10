#!/usr/bin/env node
/**
 * migrate-image-text-split.mjs
 *
 * One-shot migration: replace `imageSrc="..."` + `imageAlt="..."` on the 23
 * service-page <ImageTextSplit> calls with a single `catalogId="..."` that
 * resolves through src/content/image-catalog.json.
 *
 * Idempotent: re-running on already-migrated files is a no-op.
 *
 * Usage:  node scripts/migrate-image-text-split.mjs
 * Verify: git diff src/pages  (should show only imageSrc/imageAlt removed and
 *         catalogId="..." added on the 23 listed pages)
 */
import { readFileSync, writeFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

// Map of page file path (relative to src/pages/) -> catalogId
const MAPPING = {
  'branded-custom-packaging-services.astro': 'branded-custom-packaging-services.hub',
  'laser-marking-custom-logo.astro': 'laser-marking-custom-logo.hub',
  'titanium-additive-manufacturing.astro': 'titanium-additive-manufacturing.hub',
  'titanium-additive-manufacturing/3d-printing-slm.astro': 'titanium-additive-manufacturing.3d-printing-slm',
  'titanium-additive-manufacturing/low-volume-production.astro': 'titanium-additive-manufacturing.low-volume-production',
  'titanium-additive-manufacturing/rapid-prototyping.astro': 'titanium-additive-manufacturing.rapid-prototyping',
  'titanium-cnc-machining-services.astro': 'titanium-cnc-machining-services.hub',
  'titanium-cnc-machining-services/3-5-axis-cnc-machining.astro': 'titanium-cnc-machining-services.3-5-axis-cnc-machining',
  'titanium-cnc-machining-services/cnc-milling-turning.astro': 'titanium-cnc-machining-services.cnc-milling-turning',
  'titanium-cnc-machining-services/custom-industrial-components.astro': 'titanium-cnc-machining-services.custom-industrial-components',
  'titanium-cnc-machining-services/wire-edm-machining.astro': 'titanium-cnc-machining-services.wire-edm-machining',
  'titanium-fabrication-services.astro': 'titanium-fabrication-services.hub',
  'titanium-fabrication-services/laser-cutting.astro': 'titanium-fabrication-services.laser-cutting',
  'titanium-fabrication-services/titanium-welding-assembly.astro': 'titanium-fabrication-services.titanium-welding-assembly',
  'titanium-fabrication-services/waterjet-cutting.astro': 'titanium-fabrication-services.waterjet-cutting',
  'titanium-forming-heavy-manufacturing.astro': 'titanium-forming-heavy-manufacturing.hub',
  'titanium-forming-heavy-manufacturing/raw-material-preparation-sizing.astro': 'titanium-forming-heavy-manufacturing.raw-material-preparation-sizing',
  'titanium-forming-heavy-manufacturing/titanium-extrusion.astro': 'titanium-forming-heavy-manufacturing.titanium-extrusion',
  'titanium-forming-heavy-manufacturing/titanium-forging.astro': 'titanium-forming-heavy-manufacturing.titanium-forging',
  'titanium-surface-treatment.astro': 'titanium-surface-treatment.hub',
  'titanium-surface-treatment/anodizing.astro': 'titanium-surface-treatment.anodizing',
  'titanium-surface-treatment/chemical-passivation.astro': 'titanium-surface-treatment.chemical-passivation',
  'titanium-surface-treatment/polishing-sandblasting.astro': 'titanium-surface-treatment.polishing-sandblasting',
};

const PAGES_ROOT = 'src/pages';

function walk(dir) {
  const out = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    const st = statSync(full);
    if (st.isDirectory()) {
      if (entry.startsWith('.')) continue;
      out.push(...walk(full));
    } else if (entry.endsWith('.astro')) {
      out.push(full);
    }
  }
  return out;
}

let migrated = 0;
let skipped = 0;
let failed = 0;

for (const full of walk(PAGES_ROOT)) {
  const rel = relative(PAGES_ROOT, full).replace(/\\/g, '/');
  const catalogId = MAPPING[rel];
  if (!catalogId) continue;

  let src = readFileSync(full, 'utf-8');

  // Idempotency check: if catalogId already present on the ImageTextSplit call
  // and imageSrc/imageAlt are gone, skip silently.
  const hasCatalogId = /catalogId\s*=\s*"/.test(src);
  const hasImageSrc = /imageSrc\s*=\s*"/.test(src);
  const hasImageAlt = /imageAlt\s*=\s*"/.test(src);
  if (hasCatalogId && !hasImageSrc && !hasImageAlt) {
    skipped++;
    console.log(`  skip (already migrated): ${rel}`);
    continue;
  }
  if (!hasImageSrc && !hasImageAlt) {
    skipped++;
    console.log(`  skip (no ImageTextSplit image props): ${rel}`);
    continue;
  }

  const orig = src;

  // 1. Remove imageSrc="..." line (any leading whitespace; whole line)
  src = src.replace(/^[ \t]*imageSrc="[^"]*"\s*\r?\n/m, '');
  // 2. Remove imageAlt="..." line
  src = src.replace(/^[ \t]*imageAlt="[^"]*"\s*\r?\n/m, '');
  // 3. Insert catalogId="..." on its own line just before the first imagePosition
  //    in the file. (Each page has exactly one <ImageTextSplit> call.)
  src = src.replace(
    /^([ \t]*imagePosition\s*=)/m,
    `    catalogId="${catalogId}"\n$1`,
  );

  if (src === orig) {
    failed++;
    console.error(`  FAIL (no change applied): ${rel}`);
    continue;
  }

  writeFileSync(full, src, 'utf-8');
  migrated++;
  console.log(`  migrated: ${rel}  ->  catalogId="${catalogId}"`);
}

console.log(`\nDone. migrated=${migrated} skipped=${skipped} failed=${failed}`);
process.exit(failed > 0 ? 1 : 0);
