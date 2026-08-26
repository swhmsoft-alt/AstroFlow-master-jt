/**
 * check-keyword-map.mjs — CI gate for internal link integrity.
 *
 * Authoritative source of truth:  dist/sitemap*.xml  (must run `npm run build` first).
 *
 * Audits TWO data sources that inject internal links into rendered HTML:
 *   1. astro.config.mjs  → `keywordMap` (rehype-auto-internal-links at build time)
 *   2. data/keywords/main-db.json → entries with status='mapped'
 *                                (src/lib/auto-inline-links.ts at runtime)
 *
 * Any entry whose targetUrl is NOT present in dist/sitemap*.xml is BROKEN
 * (would 404 on click). Reports the broken set and exits non-zero.
 *
 * Usage:
 *   node scripts/check-keyword-map.mjs              # check + exit code
 *   node scripts/check-keyword-map.mjs --report     # also write JSON to _audit/
 *
 * Exit codes:
 *   0 = clean
 *   1 = broken links found
 *   2 = dist/ not found (run npm run build first)
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const DIST_DIR = path.join(ROOT, 'dist');
const CONFIG_PATH = path.join(ROOT, 'astro.config.mjs');
const MAIN_DB_PATH = path.join(ROOT, 'data', 'keywords', 'main-db.json');
const REPORT_PATH = path.join(ROOT, '_audit', 'keywordmap_broken.json');

const SUPPORTED_LANGS = new Set([
  'de', 'ja', 'fr', 'es', 'pt', 'it', 'ko', 'nl', 'pl', 'ru', 'ar',
]);

// ── 1. Authoritative routes from dist/sitemap*.xml ─────────
function pullSitemapRoutes() {
  if (!fs.existsSync(DIST_DIR)) return null;
  const files = fs.readdirSync(DIST_DIR).filter(f => /^sitemap.*\.xml$/.test(f));
  if (files.length === 0) return null;

  const locRe = /<loc>([^<]+)<\/loc>/g;
  const hostRe = /^https?:\/\/[^/]+/;
  const routes = new Set();
  for (const f of files) {
    const text = fs.readFileSync(path.join(DIST_DIR, f), 'utf-8');
    for (const m of text.matchAll(locRe)) {
      routes.add(m[1].replace(hostRe, ''));
    }
  }
  return routes;
}

// ── 2. Parse astro.config.mjs keywordMap ───────────────────
function parseKeywordMap() {
  const text = fs.readFileSync(CONFIG_PATH, 'utf-8');
  const startRe = /keywordMap:\s*\{/;
  const m = text.match(startRe);
  if (!m) return [];
  const start = m.index + m[0].length;
  let depth = 1;
  let end = start;
  while (end < text.length && depth > 0) {
    if (text[end] === '{') depth++;
    else if (text[end] === '}') depth--;
    end++;
  }
  const body = text.slice(start, end - 1);
  // "keyword": { "href": "/path/" }
  const entryRe = /"((?:[^"\\]|\\.)*)"\s*:\s*\{\s*"href"\s*:\s*"((?:[^"\\]|\\.)*)"\s*\}/g;
  const entries = [];
  for (const em of body.matchAll(entryRe)) {
    entries.push({ keyword: em[1], href: em[2] });
  }
  return entries;
}

// ── 3. Helpers ─────────────────────────────────────────────
function langOf(href) {
  const seg = href.replace(/^\//, '').split('/', 1)[0];
  return SUPPORTED_LANGS.has(seg) ? seg : 'en';
}

function normalize(href) {
  return href.endsWith('/') ? href : href + '/';
}

function isExternal(href) {
  return /^(https?:|mailto:|tel:|#)/.test(href);
}

// ── 4. Audits ──────────────────────────────────────────────
function auditKeywordMap(routes) {
  const entries = parseKeywordMap();
  const broken = [];
  for (const e of entries) {
    if (!e.href || isExternal(e.href)) continue;
    const norm = normalize(e.href);
    if (!routes.has(norm)) {
      broken.push({ keyword: e.keyword, href: e.href, lang: langOf(e.href) });
    }
  }
  return { total: entries.length, broken };
}

function auditMainDb(routes) {
  if (!fs.existsSync(MAIN_DB_PATH)) {
    return { total: 0, broken: [], skipped: 'file missing' };
  }
  const data = JSON.parse(fs.readFileSync(MAIN_DB_PATH, 'utf-8'));
  const mapped = data.filter(e => e && e.status === 'mapped');
  const broken = [];
  for (const e of mapped) {
    const href = e.targetUrl || '';
    if (!href || isExternal(href)) continue;
    const norm = normalize(href);
    if (!routes.has(norm)) {
      broken.push({
        id: e.id || null,
        keyword: e.keyword || null,
        href,
        lang: e.lang || null,
        source: e.source || null,
      });
    }
  }
  return { total: mapped.length, broken };
}

// ── 5. Main ────────────────────────────────────────────────
function main() {
  const args = process.argv.slice(2);
  const reportMode = args.includes('--report');

  const routes = pullSitemapRoutes();
  if (!routes) {
    console.error('✗ dist/ not found or empty. Run `npm run build` first to generate sitemaps.');
    process.exit(2);
  }
  console.log(`✓ Loaded ${routes.size} authoritative routes from dist/sitemap*.xml`);

  const km = auditKeywordMap(routes);
  const db = auditMainDb(routes);

  console.log(`\n── astro.config.mjs keywordMap ──`);
  console.log(`  Total entries: ${km.total}`);
  console.log(`  Broken:        ${km.broken.length}`);

  console.log(`\n── data/keywords/main-db.json (status='mapped') ──`);
  if (db.skipped) {
    console.log(`  Skipped: ${db.skipped}`);
  } else {
    console.log(`  Total mapped: ${db.total}`);
    console.log(`  Broken:       ${db.broken.length}`);
  }

  if (reportMode) {
    fs.mkdirSync(path.dirname(REPORT_PATH), { recursive: true });
    fs.writeFileSync(REPORT_PATH, JSON.stringify({
      generatedAt: new Date().toISOString(),
      routesCount: routes.size,
      keywordMap: km,
      mainDb: db,
    }, null, 2), 'utf-8');
    console.log(`\n→ Report saved to ${REPORT_PATH}`);
  }

  const totalBroken = km.broken.length + db.broken.length;
  if (totalBroken > 0) {
    console.log(`\n✗ Found ${totalBroken} broken internal links`);
    console.log(`    keywordMap: ${km.broken.length}`);
    console.log(`    main-db:    ${db.broken.length}`);
    console.log(`\n  Run scripts/purge-keyword-broken.mjs to remove them,`);
    console.log(`  or scripts/generate-internal-links.mjs (now with purge guard).`);
    // Show first 10 of each for quick triage
    const show = (label, arr) => {
      if (arr.length === 0) return;
      console.log(`\n  First 10 broken in ${label}:`);
      for (const b of arr.slice(0, 10)) {
        const kw = (b.keyword || b.id || '?').slice(0, 55);
        console.log(`    ${kw}  →  ${b.href}`);
      }
    };
    show('keywordMap', km.broken);
    show('main-db', db.broken);
    process.exit(1);
  }

  console.log(`\n✓ All keywordMap and main-db internal links are valid.`);
}

main();