/**
 * Check for orphan pages in src/content/ that have no internal links pointing to them.
 *
 * Workflow:
 * 1. Load the keywordMap from astro.config.mjs (configured internal links)
 * 2. Scan all Markdown files in src/content/ for manual internal links like [text](/path) and <a href="/path">
 * 3. Scan all .astro component pages in src/pages/ for internal links
 * 4. Cross-reference: which pages have 0 incoming links?
 * 5. Generate a report (console + optional JSON output)
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { glob } from 'glob';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

// ── 1. Read keywordMap from astro.config.mjs ─────────────
function readKeywordMap() {
  const configPath = path.resolve(ROOT, 'astro.config.mjs');
  const configContent = fs.readFileSync(configPath, 'utf-8');

  const existing = {};
  const regex = /"([^"]+)"\s*:\s*(?:\{[^}]*href:\s*"([^"]+)"[^}]*\}|"([^"]+)")/g;
  let match;
  while ((match = regex.exec(configContent)) !== null) {
    const href = match[2] || match[3];
    if (href) existing[href] = (existing[href] || 0) + 1;
  }
  return existing;
}

// ── 2. Scan content files for internal links ────────────
async function scanInternalLinks(dirPatterns) {
  const files = [];
  for (const pattern of dirPatterns) {
    const matches = await glob(pattern, { cwd: ROOT, nodir: true });
    for (const match of matches) {
      files.push(path.resolve(ROOT, match));
    }
  }

  // Extract all internal links from Markdown and MDX files
  const internalLinks = {}; // URL → count

  for (const file of files) {
    const content = fs.readFileSync(file, 'utf-8');
    const relativePath = path.relative(ROOT, file).replace(/\\/g, '/');

    // Markdown links: [text](/path)
    const mdLinks = content.matchAll(/\]\((\/[^)\s]+)\)/g);
    for (const m of mdLinks) {
      const url = m[1].replace(/\/$/, ''); // normalize trailing slash
      internalLinks[url] = (internalLinks[url] || 0) + 1;
    }

    // Markdown references: [text]: /path
    const mdRefs = content.matchAll(/^\[.*?\]:\s*(\/[^\s]+)/gm);
    for (const m of mdRefs) {
      const url = m[1].replace(/\/$/, '');
      internalLinks[url] = (internalLinks[url] || 0) + 1;
    }

    // HTML <a href="/path">
    const htmlLinks = content.matchAll(/<a[^>]*href="(\/[^"]+)"/g);
    for (const m of htmlLinks) {
      const url = m[1].replace(/\/$/, '').replace(/\/index\.html$/, '');
      if (!url.startsWith('//') && !url.startsWith('http')) {
        internalLinks[url] = (internalLinks[url] || 0) + 1;
      }
    }
  }

  return internalLinks;
}

// ── 3. Build the set of known content URLs ──────────────
async function buildContentUrlMap() {
  const urlToFile = {};

  // Scan src/content/ for all Markdown files
  const contentFiles = await glob('src/content/**/*.md', { cwd: ROOT, nodir: true });
  for (const file of contentFiles) {
    const content = fs.readFileSync(path.resolve(ROOT, file), 'utf-8');

    // Extract slug from frontmatter
    const slugMatch = content.match(/^---\n[\s\S]*?slug:\s*["']?([^\s"']+)["']?/m);
    const baseName = path.basename(file, '.md');

    const relDir = path.dirname(file).replace(/\\/g, '/');
    let urlPath = '';

    if (relDir.includes('/blog')) {
      urlPath = `/blog/${slugMatch ? slugMatch[1] : baseName}`;
    } else if (relDir.includes('/products')) {
      urlPath = `/products/${slugMatch ? slugMatch[1] : baseName}`;
    } else if (relDir.includes('/pages')) {
      urlPath = baseName === 'home' ? '/' : `/${slugMatch ? slugMatch[1] : baseName}`;
    }

    if (urlPath) {
      urlToFile[urlPath] = file;
    }
  }

  return urlToFile;
}

// ── 4. Whitelist rules (URLs that are NOT real orphans) ───
// Rationale: dynamic route placeholders, system pages, and legal
// boilerplate do not need incoming links by design.
// Each rule: { pattern: RegExp, reason: string }
const WHITELIST_RULES = [
  // Dynamic route placeholders (Astro [param] segments — these are
  // route templates, not real URLs; they only resolve at build time)
  { pattern: /\[\s*(lang|slug|page|id)\s*\]/i, reason: 'dynamic-route' },

  // System / utility pages (no SEO value from inbound links)
  { pattern: /^\/404\/$/, reason: 'system-404' },
  { pattern: /^\/thank-you\/$/, reason: 'system-thank-you' },
  { pattern: /^\/theme-demo\/$/, reason: 'system-theme-demo' },

  // Legal boilerplate (footer-linked, no orphan concern)
  { pattern: /^\/(cookie-policy|privacy-policy|terms-of-service)\/$/,
    reason: 'legal-boilerplate' },
];

function getWhitelistReason(url) {
  for (const rule of WHITELIST_RULES) {
    if (rule.pattern.test(url)) return rule.reason;
  }
  return null;
}

// ── 5. Policy violations (URLs that VIOLATE content policy) ─
// These are NOT orphans (don't need inbound links) AND NOT
// whitelisted (should NOT exist). They must be deleted or
// translated to a supported language. The project ships in
// de/fr/es/pt/it/ko/nl/pl/ja + English (no zh support).
//
// Detection: content files with significant CJK character ratio
// (Chinese / Japanese kanji) are flagged as forbidden-language-zh.
const ZH_REGEX = /[\u4e00-\u9fff\u3000-\u303f\uff00-\uffef]/g;
// Hiragana (U+3040–309F) + Katakana (U+30A0–30FF) — Japanese-only
// kana. Their presence proves the text is Japanese, not Chinese.
const JA_KANA_REGEX = /[\u3040-\u309f\u30a0-\u30ff]/;

// Heuristic thresholds:
//   - JA_KANA presence = file is Japanese (legitimate, never a
//     violation, regardless of kanji count).
//   - Need > 50 CJK chars to ignore single accidental terms
//     (e.g. technical references like "ISO 9001", Chinese brand
//     names that are intentional quotes).
//   - CJK ratio > 5% of non-whitespace chars = content is
//     predominantly Chinese, not just sprinkled quotes.
//   - HARD threshold: > 200 CJK chars regardless of ratio —
//     catches short but severely polluted files (e.g. JSON with
//     a Chinese title repeated in 10+ fields).
const CJK_MIN_CHARS = 50;
const CJK_MIN_RATIO = 0.05;
const CJK_HARD_MIN = 50;

function detectChineseContent(filePath) {
  try {
    const raw = fs.readFileSync(filePath, 'utf8');
    // Japanese kana present → legitimate Japanese translation,
    // not a policy violation.
    if (JA_KANA_REGEX.test(raw)) return null;
    const cjk = raw.match(ZH_REGEX);
    if (!cjk || cjk.length < CJK_MIN_CHARS) return null;
    const nonWsLen = raw.replace(/\s/g, '').length;
    const ratio = cjk.length / Math.max(nonWsLen, 1);
    // Pass either ratio-threshold OR absolute hard threshold
    if (ratio < CJK_MIN_RATIO && cjk.length < CJK_HARD_MIN) return null;
    return { cjkChars: cjk.length, ratio };
  } catch {
    return null;
  }
}

// ── 6. Build known page URLs from src/pages/ ────────────
async function buildPageUrlMap() {
  const pageUrls = new Set();

  // Scan src/pages/ for .astro files
  const pageFiles = await glob('src/pages/**/*.astro', { cwd: ROOT, nodir: true });
  for (const file of pageFiles) {
    // Convert file path to URL
    let url = path.dirname(file).replace(/\\/g, '/').replace(/^src\/pages/, '');
    const baseName = path.basename(file, '.astro');
    if (baseName === 'index') {
      // /path/index.astro → /path/
      if (url === '') url = '/';
      else url = url + '/';
    } else if (baseName === '[...slug]') {
      // Dynamic route, skip
      continue;
    } else {
      // /path/file.astro → /path/file/
      url = url + '/' + baseName + '/';
    }
    pageUrls.add(url.replace(/\/\/+/g, '/'));
  }

  return pageUrls;
}

// ── Main ─────────────────────────────────────────────────
async function main() {
  try {
    console.log('=== Orphan Page Detection ===\n');

    // 1. keywordMap links
    const keywordMap = readKeywordMap();
    console.log(`keywordMap entries: ${Object.entries(keywordMap).reduce((a, [, c]) => a + c, 0)}`);
    console.log(`Unique URLs in keywordMap: ${Object.keys(keywordMap).length}\n`);

    // 2. Internal links from content files
    const contentLinks = await scanInternalLinks([
      'src/content/**/*.md',
      'src/content/**/*.mdx',
    ]);

    // 3. Internal links from page components
    const pageLinks = await scanInternalLinks([
      'src/pages/**/*.astro',
    ]);

    // Merge all link sources
    const allIncomingLinks = { ...keywordMap };
    for (const [url, count] of Object.entries(contentLinks)) {
      allIncomingLinks[url] = (allIncomingLinks[url] || 0) + count;
    }
    for (const [url, count] of Object.entries(pageLinks)) {
      allIncomingLinks[url] = (allIncomingLinks[url] || 0) + count;
    }

    // 4. Build all known URLs on the site
    const contentUrlMap = await buildContentUrlMap();
    const pageUrls = await buildPageUrlMap();

    console.log(`Content pages (src/content/): ${Object.keys(contentUrlMap).length}`);
    console.log(`Component pages (src/pages/): ${pageUrls.size}\n`);

    // 5. Find orphans
    const allKnownUrls = new Set([
      ...Object.keys(contentUrlMap),
      ...pageUrls,
    ]);

    const orphans = [];
    const withIncoming = [];
    const whitelisted = []; // { url, reason }
    const policyViolations = []; // { url, rule, cjkChars, ratio }

    for (const url of allKnownUrls) {
      // 1. Whitelist check first: dynamic route placeholders, system
      //    pages, legal boilerplate are NOT real orphans.
      const reason = getWhitelistReason(url);
      if (reason) {
        whitelisted.push({ url, reason });
        continue;
      }

      // 2. Policy violation check: forbidden-language content (e.g.
      //    Chinese) must be deleted/removed, NOT link-repaired. Skip
      //    all further classification for hits.
      if (contentUrlMap[url]) {
        const hit = detectChineseContent(contentUrlMap[url]);
        if (hit) {
          policyViolations.push({
            url,
            rule: 'forbidden-language-zh',
            file: path.relative(ROOT, contentUrlMap[url]).replace(/\\/g, '/'),
            cjkChars: hit.cjkChars,
            ratio: hit.ratio,
          });
          continue;
        }
      }

      // 3. Classify by incoming link count
      const normalizedUrl = url.endsWith('/') ? url : url + '/';
      const incomingCount = allIncomingLinks[url] || allIncomingLinks[url.replace(/\/$/, '')] || 0;

      if (incomingCount === 0) {
        orphans.push(url);
      } else {
        withIncoming.push({ url, count: incomingCount });
      }
    }

    // Sort for consistent output
    orphans.sort();
    withIncoming.sort((a, b) => b.count - a.count);
    whitelisted.sort((a, b) => a.reason.localeCompare(b.reason) || a.url.localeCompare(b.url));
    policyViolations.sort((a, b) => b.cjkChars - a.cjkChars); // worst first

    // Group whitelist by reason for compact reporting
    const whitelistByReason = {};
    for (const { url, reason } of whitelisted) {
      (whitelistByReason[reason] = whitelistByReason[reason] || []).push(url);
    }

    // 6. Report
    console.log('═══════════════════════════════════════');
    console.log('          ORPHAN PAGE REPORT          ');
    console.log('═══════════════════════════════════════\n');

    // Whitelist summary (shown first so the orphan count below is focused)
    if (whitelisted.length > 0) {
      console.log(`🟡 ${whitelisted.length} URL(s) filtered by whitelist (not real orphans):\n`);
      for (const [reason, urls] of Object.entries(whitelistByReason)) {
        console.log(`  • ${reason}: ${urls.length}`);
      }
      console.log('');
    }

    // Policy violations (P0 — content policy breach, must be removed)
    if (policyViolations.length > 0) {
      console.log(`⚠️  ${policyViolations.length} URL(s) violate content policy (forbidden language — should be DELETED, NOT link-repaired):\n`);
      for (const v of policyViolations) {
        console.log(`  • ${v.url}  (${v.cjkChars} CJK chars, ${(v.ratio * 100).toFixed(1)}%)  →  ${v.file}`);
      }
      console.log('');
    }

    if (orphans.length === 0) {
      console.log('🎉 No orphan pages found! All non-whitelisted pages have at least one incoming link.\n');
    } else {
      console.log(`🔴 ${orphans.length} real orphan page(s) found with 0 incoming links:\n`);
      for (const url of orphans) {
        console.log(`  - ${url}`);
      }
      console.log('');
    }

    const topLinked = withIncoming.slice(0, 5);
    if (topLinked.length > 0) {
      console.log('Top 5 most-linked pages:\n');
      for (const { url, count } of topLinked) {
        console.log(`  🟢 ${url} (${count} incoming links)`);
      }
      console.log('');
    }

    // Summary
    const totalPages = allKnownUrls.size;
    const linkedCount = withIncoming.length;
    const orphanCount = orphans.length;
    const whitelistedCount = whitelisted.length;
    const policyViolationCount = policyViolations.length;
    const coverage = totalPages > 0 ? ((linkedCount / totalPages) * 100).toFixed(1) : 'N/A';
    const effectiveCoverage = totalPages > 0
      ? (((linkedCount + whitelistedCount) / totalPages) * 100).toFixed(1)
      : 'N/A';

    console.log('─────────────────────────────────────');
    console.log(`  Total pages:        ${totalPages}`);
    console.log(`  With links:         ${linkedCount}`);
    console.log(`  Whitelisted:        ${whitelistedCount}`);
    console.log(`  Policy violations:  ${policyViolationCount}  ⚠️  (forbidden language)`);
    console.log(`  Real orphans:       ${orphanCount}`);
    console.log(`  Coverage:           ${coverage}%`);
    console.log(`  Effective coverage: ${effectiveCoverage}%  (linked + whitelisted)`);
    console.log('─────────────────────────────────────\n');

    // Save report to file
    const reportPath = path.resolve(ROOT, 'output/orphan-pages-report.json');
    if (!fs.existsSync(path.resolve(ROOT, 'output'))) {
      fs.mkdirSync(path.resolve(ROOT, 'output'));
    }
    fs.writeFileSync(reportPath, JSON.stringify({
      generatedAt: new Date().toISOString(),
      totalPages,
      linkedCount,
      whitelistedCount,
      policyViolationCount,
      orphanCount,
      coverage: `${coverage}%`,
      effectiveCoverage: `${effectiveCoverage}%`,
      orphans,
      whitelisted: whitelistByReason,
      whitelistedFlat: whitelisted,
      policyViolations,
      topLinked: topLinked.slice(0, 10),
    }, null, 2), 'utf-8');
    console.log(`📄 Full report saved to: ${reportPath}`);

  } catch (err) {
    console.error('\n✗ ERROR:', err.message);
    process.exit(1);
  }
}

main();