/**
 * purge-keyword-map.mjs — Remove entries from astro.config.mjs keywordMap
 * whose href is not in dist/sitemap*.xml.
 *
 * Why a dedicated script?
 *   - scripts/check-keyword-map.mjs is the CI gate (read-only).
 *   - scripts/purge-main-db-broken.mjs handles data/keywords/main-db.json.
 *   - This script handles astro.config.mjs keywordMap (the inline rehype source).
 *
 * When to run:
 *   - Once after the first fix, to bring astro.config.mjs back to clean state.
 *   - After any minimax/AI-driven regen that re-introduces broken targets.
 *   - The mergeKeywords() purge guard in generate-internal-links.mjs should
 *     prevent re-introduction, but this script is the belt-and-suspenders
 *     cleanup tool for inline configs.
 *
 * Safety:
 *   - Creates a timestamped backup (.bak-<date>) before any write.
 *   - Uses the same brace-depth parser as check-keyword-map.mjs so formatting
 *     is preserved (only the keywordMap body is rewritten).
 *   - Reports purged count + writes _audit/keywordmap-purge-report.json.
 *
 * Usage:
 *   node scripts/purge-keyword-map.mjs
 *   node scripts/purge-keyword-map.mjs --dry-run
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const DIST_DIR = path.join(ROOT, 'dist');
const CONFIG_PATH = path.join(ROOT, 'astro.config.mjs');
const REPORT_PATH = path.join(ROOT, '_audit', 'keywordmap-purge-report.json');

const SUPPORTED_LANGS = new Set([
  'de', 'ja', 'fr', 'es', 'pt', 'it', 'ko', 'nl', 'pl', 'ru', 'ar',
]);

function pullSitemapRoutes() {
  if (!fs.existsSync(DIST_DIR)) {
    throw new Error('dist/ not found. Run `npm run build` first.');
  }
  const files = fs.readdirSync(DIST_DIR).filter(f => /^sitemap.*\.xml$/.test(f));
  if (files.length === 0) {
    throw new Error('No sitemap*.xml found under dist/. Run `npm run build` first.');
  }
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

function isExternal(href) {
  return /^(https?:|mailto:|tel:|#)/.test(href);
}

function langOf(href) {
  const seg = href.replace(/^\//, '').split('/', 1)[0];
  return SUPPORTED_LANGS.has(seg) ? seg : 'en';
}

// Locate the keywordMap { ... } block in astro.config.mjs and return
// { start, end, body, fullText } where body is the inner text (between braces).
function locateKeywordMap(text) {
  const startRe = /keywordMap:\s*\{/;
  const m = text.match(startRe);
  if (!m) throw new Error('Could not find "keywordMap: {" in astro.config.mjs');
  const start = m.index + m[0].length;
  let depth = 1;
  let end = start;
  while (end < text.length && depth > 0) {
    if (text[end] === '{') depth++;
    else if (text[end] === '}') depth--;
    end++;
  }
  return {
    start,
    end,                // points just AFTER the closing '}'
    bodyStart: start,
    bodyEnd: end - 1,
    body: text.slice(start, end - 1),
    fullText: text,
  };
}

// Parse keywordMap body into [{ keyword, href }] preserving source order.
function parseEntries(body) {
  // Match: "keyword": { "href": "..." }  with optional inner whitespace
  const re = /"((?:[^"\\]|\\.)*)"\s*:\s*\{\s*"href"\s*:\s*"((?:[^"\\]|\\.)*)"\s*\}/g;
  const out = [];
  for (const m of body.matchAll(re)) {
    out.push({ keyword: m[1], href: m[2] });
  }
  return out;
}

// Re-indent an entry line to match the 8-space indent of the keywordMap block
// (8 because keywordMap sits inside rehypePlugins inside markdown inside astro).
function reindentEntryLine(line, baseIndent = '        ') {
  return baseIndent + line.replace(/^\s*/, '');
}

function main() {
  const dryRun = process.argv.includes('--dry-run');

  const routes = pullSitemapRoutes();
  console.log(`✓ Loaded ${routes.size} authoritative routes from dist/sitemap*.xml`);

  const text = fs.readFileSync(CONFIG_PATH, 'utf-8');
  const { start, end, body, fullText } = locateKeywordMap(text);
  const entries = parseEntries(body);
  console.log(`✓ Parsed ${entries.length} entries from keywordMap`);

  // Detect base indentation of the first entry to preserve alignment.
  // First entry's line begins with whitespace + "..."
  const firstLine = body.split('\n').find(l => l.trim().startsWith('"'));
  const baseIndent = firstLine ? firstLine.match(/^\s*/)[0] : '        ';

  const kept = [];
  const purged = [];
  for (const e of entries) {
    if (!e.href || isExternal(e.href)) {
      kept.push(e);
      continue;
    }
    const normalized = e.href.endsWith('/') ? e.href : e.href + '/';
    if (routes.has(normalized)) {
      kept.push(e);
    } else {
      purged.push({
        keyword: e.keyword,
        href: e.href,
        lang: langOf(e.href),
      });
    }
  }

  console.log(`\n── Purged ${purged.length} broken entries from keywordMap ──`);
  for (const p of purged.slice(0, 15)) {
    console.log(`  [${p.lang}] ${p.keyword.slice(0, 50)}  →  ${p.href}`);
  }
  if (purged.length > 15) {
    console.log(`  ... and ${purged.length - 15} more`);
  }

  // Always write the report
  fs.mkdirSync(path.dirname(REPORT_PATH), { recursive: true });
  fs.writeFileSync(REPORT_PATH, JSON.stringify({
    generatedAt: new Date().toISOString(),
    dryRun,
    routesCount: routes.size,
    beforeCount: entries.length,
    afterCount: kept.length,
    purgedCount: purged.length,
    purged,
  }, null, 2), 'utf-8');
  console.log(`\n→ Report: ${REPORT_PATH}`);

  if (dryRun) {
    console.log('\n(--dry-run: no files were modified.)');
    return;
  }

  if (purged.length === 0) {
    console.log('\n✓ No broken entries to purge.');
    return;
  }

  // Rebuild the keywordMap body.
//   start      = position just AFTER the opening '{' of "keywordMap: { ... }"
//   end        = position just AFTER the closing '}' of keywordMap
//   end - 1    = position OF the keywordMap closing '}'  (must be kept)
//
// The replacement sits BETWEEN start and (end - 1):
//   fullText.slice(0, start)    -> up to and including opening '{'
//   newBody                     -> just the inner entries (re-indented)
//   fullText.slice(end - 1)     -> from closing '}' onwards (outer brackets etc.)
//
// Match original format (multiline, with quoted "href"):
//   "keyword": {
//     "href": "/path/"
//   }
  const innerIndent = baseIndent + '  ';  // 2 extra spaces inside the entry object
  const newBody = kept.length === 0
    ? '\n      '
    : '\n' + kept.map(e =>
        `${baseIndent}"${e.keyword}": {\n${innerIndent}"href": "${e.href}"\n${baseIndent}}`
      ).join(',\n') + '\n      ';
  const newText = fullText.slice(0, start) + newBody + fullText.slice(end - 1);

  // Backup
  const date = new Date().toISOString().slice(0, 10);
  const backupPath = `${CONFIG_PATH}.bak-${date}`;
  fs.writeFileSync(backupPath, fullText, 'utf-8');
  console.log(`✓ Backup: ${backupPath}`);

  // Write
  fs.writeFileSync(CONFIG_PATH, newText, 'utf-8');
  console.log(`✓ Wrote ${kept.length} entries (was ${entries.length}) to astro.config.mjs`);
}

try {
  main();
} catch (err) {
  console.error(`\n✗ ERROR: ${err.message}`);
  process.exit(1);
}