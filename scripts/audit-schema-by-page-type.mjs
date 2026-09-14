#!/usr/bin/env node
/**
 * scripts/audit-schema-by-page-type.mjs
 *
 * Audit runtime JSON-LD @type completeness across all detail pages of the
 * production build, distinguishing CORE @type (required for Google rich-result
 * eligibility, varies by pageType) from AUX @type (BreadcrumbList, Organization,
 * WebSite, Brand, ImageObject — always expected but not page-specific).
 *
 * This is the runtime-truth source for schema coverage; source-level regex
 * audits give false negatives because articleType is a runtime value, not a
 * literal @type string in the source.
 *
 * Usage:
 *   node scripts/audit-schema-by-page-type.mjs            # all dirs
 *   node scripts/audit-schema-by-page-type.mjs --dir=dist/blog
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = path.resolve(__dirname, '..');
process.chdir(PROJECT_ROOT);

const CORE_TYPES = {
  'case-studies':              ['Article'],
  'equipment':                 ['Product'],
  'blog':                      ['BlogPosting'],
  'products/product-entities': ['Product'],
  'industries/aerospace':      ['Service'],
  'industries/medical':        ['Service'],
  'industries/chemical':       ['Service'],
  'industries/marine':         ['Service'],
  // Legacy redirects (per astro.config.mjs redirects[]) are NOT real pages
  // and live under /industries/<old-slug>/index.html which Astro generates as
  // a 301-redirect stub. Skip them by only scanning the live industry slugs.
};

const AUX_TYPES = new Set(['Organization', 'Brand', 'WebSite', 'WebPage',
  'BreadcrumbList', 'Breadcrumb', 'ImageObject', 'FAQPage', 'HowTo',
  'CollectionPage', 'ItemList', 'WebApplication']);

function extractTypes(html) {
  const blocks = [...html.matchAll(/<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/g)].map(m => m[1]);
  const all = new Set();
  for (const b of blocks) {
    try {
      const j = JSON.parse(b);
      const arr = Array.isArray(j) ? j : (j['@graph'] || [j]);
      for (const node of arr) {
        if (node && node['@type']) {
          const t = node['@type'];
          if (Array.isArray(t)) t.forEach(x => all.add(x));
          else all.add(t);
        }
      }
    } catch {}
  }
  return all;
}

const argv = process.argv.slice(2);
const onlyDir = (() => { const i = argv.indexOf('--dir'); return i >= 0 ? argv[i + 1] : null; })();

let total = 0, ok = 0, missing = [];
const dirs = onlyDir ? [onlyDir] : Object.keys(CORE_TYPES).map(d => `dist/${d}`);

for (const dir of dirs) {
  let entries;
  try { entries = fs.readdirSync(dir, { withFileTypes: true }); }
  catch { console.warn(`Skip (no dir): ${dir}`); continue; }
  // Look up CORE_TYPES by stripping 'dist/' prefix
  const key = dir.replace(/^dist\//, '');
  const expectedCore = CORE_TYPES[key] || [];
  if (!expectedCore.length) continue;
  for (const e of entries) {
    if (!e.isDirectory()) continue;
    const idx = `${dir}/${e.name}/index.html`;
    total++;
    let html;
    try { html = fs.readFileSync(idx, 'utf8'); }
    catch { missing.push(`${idx.padEnd(72)}  HTML MISSING`); continue; }
    const types = extractTypes(html);
    const lacks = expectedCore.filter(t => !types.has(t));
    const aux = [...types].filter(t => AUX_TYPES.has(t)).sort();
    const core = [...types].filter(t => !AUX_TYPES.has(t)).sort();
    if (lacks.length) missing.push(`${idx.padEnd(72)}  ❌ lacks ${lacks.join(',')} | core=[${core.join(',')}] aux=[${aux.length}]`);
    else ok++;
  }
}

const pct = total > 0 ? Math.round(ok / total * 100) : 0;
console.log(`\n${'='.repeat(80)}`);
console.log(`SCHEMA COVERAGE AUDIT  (dist/ runtime)`);
console.log('='.repeat(80));
console.log(`Total detail pages scanned:  ${total}`);
console.log(`With CORE @type present:     ${ok}  (${pct}%)`);
console.log(`Missing CORE @type:          ${missing.length}`);
if (missing.length) {
  console.log('\nPages MISSING core @type:');
  for (const m of missing) console.log('  ' + m);
}
console.log('');
process.exit(missing.length === 0 ? 0 : 1);
