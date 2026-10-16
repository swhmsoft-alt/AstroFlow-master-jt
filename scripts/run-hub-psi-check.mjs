#!/usr/bin/env node
/**
 * scripts/run-hub-psi-check.mjs
 *
 * P-DSC (2026-10-16): Hub-page PSI monitoring script.
 *
 * Runs Google PageSpeed Insights API (v5) on ~50 hub pages of the site
 * (mobile strategy, since Core Web Vitals are mobile-weighted) and emits:
 *   - reports/psi-hub-report.json   (full raw data per URL)
 *   - reports/psi-hub-summary.md    (human-readable table with threshold flags)
 *
 * Threshold gates (mobile, per PSI 2026-10-16 reference):
 *   Performance < 80        → flagged
 *   LCP > 2500 ms           → flagged
 *   CLS > 0.1               → flagged
 *   FCP > 1800 ms           → flagged
 *   TBT > 200 ms            → flagged
 *
 * API key:
 *   Read from PSI_API_KEY (set in .env.production). Never logged.
 *   When --dry-run is passed, no API calls are made and the script
 *   just lists the URLs it WOULD check.
 *
 * Rate limiting:
 *   The PSI free tier has burst limits; we sleep 30s between calls
 *   to stay well under quota. A full run on ~50 URLs takes ~25 min.
 *
 * Usage:
 *   PSI_API_KEY=xxx node scripts/run-hub-psi-check.mjs
 *   PSI_API_KEY=xxx node scripts/run-hub-psi-check.mjs --strategy=desktop
 *   node scripts/run-hub-psi-check.mjs --dry-run
 */
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.resolve(__dirname, '..');

const args = new Map();
for (const a of process.argv.slice(2)) {
  const m = a.match(/^--([^=]+)(?:=(.*))?$/);
  if (m) args.set(m[1], m[2] ?? true);
}
const dryRun = args.has('dry-run') || args.has('n');
const strategy = (args.get('strategy') || 'mobile').toLowerCase();
const outDir = path.resolve(root, String(args.get('out') || 'reports'));

const PSI_API_KEY = process.env.PSI_API_KEY;
if (!PSI_API_KEY && !dryRun) {
  console.error('[psi-check] PSI_API_KEY env var required (set in .env.production). Aborting.');
  process.exit(1);
}

const SITE = 'https://cnc.bozemetal.com';

// 50+ hub URLs (root hubs + every Decision-Dimension D1-D5 page from the
// Buyer Search Intelligence SOP). Distilled from src/pages/* and NAVIGATION.
const HUBS = [
  // Tier-1: Top-level hubs
  '/',
  '/materials/',
  '/services/',
  '/capabilities/',
  '/capabilities/compliance/',
  '/capabilities/supplier-evaluation/',
  '/capabilities/lead-time/',
  '/capabilities/logistics/',
  '/rfq/',
  '/blog/',
  '/case-studies/',
  '/about/',
  '/contact/',
  '/cookie-policy/',
  // Materials hub
  '/materials/titanium-alloys/',
  '/materials/titanium-grades/',
  // Services hubs (6 D1 process lines)
  '/services/cnc-machining/',
  '/services/additive-manufacturing/',
  '/services/surface-treatment/',
  '/services/fabrication/',
  '/services/forming/',
  '/services/welding-assembly/',
  // Industries (D1 — vertical hubs)
  '/industries/',
  '/industries/aerospace/',
  '/industries/medical/',
  '/industries/chemical/',
  '/industries/marine/',
  '/industries/automotive/',
  '/industries/energy/',
  // Products
  '/products/',
  '/products/standard-parts/',
  '/products/industries/',
  // Resources
  '/resources/',
  '/resources/titanium-grades-guide/',
  // Blog clusters
  '/blog/materials-grades/',
  '/blog/problems-solutions/',
  '/blog/quality-standards/',
  '/blog/applications-industries/',
  '/blog/procurement-services/',
  '/blog/design-dfm/',
  // Titanium family pages
  '/titanium-cnc-machining-services/',
  '/titanium-additive-manufacturing/',
  '/titanium-surface-treatment/',
  '/titanium-fabrication-services/',
  '/titanium-forming-heavy-manufacturing/',
];

const THRESHOLDS = {
  performance: 80,
  lcp: 2500,
  cls: 0.1,
  fcp: 1800,
  tbt: 200,
};

function fmtMs(ms) {
  if (ms == null) return '—';
  if (ms >= 1000) return `${(ms / 1000).toFixed(1)}s`;
  return `${Math.round(ms)}ms`;
}

async function runPsi(url, strat) {
  const endpoint = new URL('https://www.googleapis.com/pagespeedonline/v5/runPagespeed');
  endpoint.searchParams.set('url', url);
  endpoint.searchParams.set('key', PSI_API_KEY);
  endpoint.searchParams.set('strategy', strat);
  for (const cat of ['performance', 'accessibility', 'best-practices', 'seo']) {
    endpoint.searchParams.append('category', cat);
  }
  const res = await fetch(endpoint.toString(), { method: 'GET' });
  if (!res.ok) {
    const body = await res.text().catch(() => '');
    throw new Error(`PSI ${res.status}: ${body.slice(0, 200)}`);
  }
  const data = await res.json();
  const lh = data.lighthouseResult;
  if (!lh) throw new Error('No lighthouseResult in PSI response');
  const audits = lh.audits ?? {};
  const cats = lh.categories ?? {};
  return {
    url,
    strategy: strat,
    fetchedAt: new Date().toISOString(),
    performance: Math.round((cats.performance?.score ?? 0) * 100),
    accessibility: Math.round((cats.accessibility?.score ?? 0) * 100),
    bestPractices: Math.round((cats['best-practices']?.score ?? 0) * 100),
    seo: Math.round((cats.seo?.score ?? 0) * 100),
    lcp: audits['largest-contentful-paint']?.numericValue ?? null,
    fcp: audits['first-contentful-paint']?.numericValue ?? null,
    cls: audits['cumulative-layout-shift']?.numericValue ?? null,
    tbt: audits['total-blocking-time']?.numericValue ?? null,
    speedIndex: audits['speed-index']?.numericValue ?? null,
  };
}

function evaluate(m) {
  const flags = [];
  if (m.performance < THRESHOLDS.performance) flags.push(`P<${THRESHOLDS.performance}`);
  if (m.lcp > THRESHOLDS.lcp) flags.push(`LCP>${THRESHOLDS.lcp}`);
  if (m.cls > THRESHOLDS.cls) flags.push(`CLS>${THRESHOLDS.cls}`);
  if (m.fcp > THRESHOLDS.fcp) flags.push(`FCP>${THRESHOLDS.fcp}`);
  if (m.tbt > THRESHOLDS.tbt) flags.push(`TBT>${THRESHOLDS.tbt}`);
  return flags;
}

async function main() {
  console.log(`[psi-check] Strategy=${strategy} | ${HUBS.length} hub URLs`);
  console.log(`[psi-check] Thresholds: P≥${THRESHOLDS.performance} LCP≤${fmtMs(THRESHOLDS.lcp)} CLS≤${THRESHOLDS.cls} FCP≤${fmtMs(THRESHOLDS.fcp)} TBT≤${fmtMs(THRESHOLDS.tbt)}`);
  console.log(`[psi-check] Output: ${outDir}/psi-hub-report.json + psi-hub-summary.md`);
  console.log('');

  if (dryRun) {
    console.log('[psi-check] --dry-run: would check the following URLs:');
    HUBS.forEach((u, i) => console.log(`  ${String(i + 1).padStart(2)}. ${SITE}${u}`));
    return;
  }

  await fs.mkdir(outDir, { recursive: true });

  const results = [];
  for (let i = 0; i < HUBS.length; i++) {
    const path = HUBS[i];
    const url = `${SITE}${path}`;
    process.stdout.write(`[${String(i + 1).padStart(2)}/${HUBS.length}] ${path} ... `);
    try {
      const m = await runPsi(url, strategy);
      const flags = evaluate(m);
      results.push(m);
      const flagStr = flags.length ? ` ⚠ ${flags.join(',')}` : ' ✓';
      console.log(`P${m.performance} LCP${fmtMs(m.lcp)} CLS${m.cls.toFixed(3)} FCP${fmtMs(m.fcp)} TBT${fmtMs(m.tbt)}${flagStr}`);
    } catch (e) {
      const msg = String(e.message ?? e).slice(0, 120);
      results.push({ url, strategy, error: msg, fetchedAt: new Date().toISOString() });
      console.log(`ERROR: ${msg}`);
    }
    if (i < HUBS.length - 1) {
      // Rate-limit: 30s between calls
      await new Promise((r) => setTimeout(r, 30000));
    }
  }

  // JSON report
  const jsonPath = path.join(outDir, 'psi-hub-report.json');
  await fs.writeFile(jsonPath, JSON.stringify(results, null, 2), 'utf-8');
  console.log(`[psi-check] Wrote ${jsonPath}`);

  // Markdown summary
  const today = new Date().toISOString().split('T')[0];
  const mdLines = [
    `# Hub PSI Summary — ${today}`,
    '',
    `**Strategy**: ${strategy} | **URLs**: ${HUBS.length} | **Thresholds**: P≥${THRESHOLDS.performance} · LCP≤${fmtMs(THRESHOLDS.lcp)} · CLS≤${THRESHOLDS.cls} · FCP≤${fmtMs(THRESHOLDS.fcp)} · TBT≤${fmtMs(THRESHOLDS.tbt)}`,
    '',
    '| # | Path | Perf | LCP | CLS | FCP | TBT | Flags |',
    '|---|---|---|---|---|---|---|---|',
  ];
  results.forEach((r, i) => {
    const p = r.url.replace(SITE, '');
    if (r.error) {
      mdLines.push(`| ${i + 1} | ${p} | ERR | — | — | — | — | ${r.error.slice(0, 60)} |`);
    } else {
      const flags = evaluate(r);
      mdLines.push(`| ${i + 1} | ${p} | ${r.performance} | ${fmtMs(r.lcp)} | ${r.cls?.toFixed(3) ?? '—'} | ${fmtMs(r.fcp)} | ${fmtMs(r.tbt)} | ${flags.join(' ') || '—'} |`);
    }
  });
  const md = mdLines.join('\n') + '\n';
  const mdPath = path.join(outDir, 'psi-hub-summary.md');
  await fs.writeFile(mdPath, md, 'utf-8');
  console.log(`[psi-check] Wrote ${mdPath}`);

  const flagged = results.filter((r) => !r.error && evaluate(r).length > 0).length;
  const errored = results.filter((r) => r.error).length;
  console.log('');
  console.log(`[psi-check] Summary: ${results.length - flagged - errored} ✓  ${flagged} ⚠  ${errored} ERR`);
}

main().catch((e) => {
  console.error('[psi-check] Fatal:', e);
  process.exit(1);
});