/**
 * audit-i18n-links.mjs
 *
 * Audits a built HTML file for internationalized internal links.
 * 
 * Usage:
 *   node scripts/audit-i18n-links.mjs dist/ja/blog/some-post/index.html
 *
 * What it does:
 *   1. Reads the built HTML file
 *   2. Extracts all root-relative href values (starting with '/')
 *   3. For a given expected language prefix (e.g., '/ja/'), flags any link
 *      that does NOT start with the expected language prefix
 *      (except for known global paths and language-switcher links)
 *
 * Global paths (shared across all languages): /blog/, /equipment/, /materials/,
 * /resources/, /products/, /images/, /uploads/, /_astro/, /favicon, /capabilities/,
 * /services/, /documentation/, /rfq/, /use-cases/, /facilities/, 
 * /branded-custom-packaging-services/, /laser-marking-custom-logo/, /titanium-
 *
 * Language-switcher links (e.g. /de/..., /fr/... on a /ja/ page) are also allowed
 * as they are part of the language selector widget, not rehype-generated content.
 */

import { readFileSync } from 'fs';

// ── Config ──────────────────────────────────────────────────────────

// All known language prefixes
const LANG_PREFIXES = ['/de/', '/fr/', '/es/', '/pt/', '/it/', '/ko/', '/nl/', '/pl/', '/ja/'];

// Paths that are global (not language-specific) and thus allowed in any language page
const GLOBAL_PREFIXES = [
  '/blog/',
  '/equipment/',
  '/materials/',
  '/resources/',
  '/products/',
  '/images/',
  '/uploads/',
  '/_astro/',
  '/favicon',
  '/capabilities/',
  '/services/',
  '/documentation/',
  '/rfq/',
  '/use-cases/',
  '/facilities/',
  '/branded-custom-packaging-services/',
  '/laser-marking-custom-logo/',
  '/titanium-',
];

// ── Helpers ─────────────────────────────────────────────────────────

/**
 * Determine the expected language prefix from the file path.
 * e.g., "dist/ja/blog/..." → "/ja/"
 *       "dist/de/blog/..." → "/de/"
 *       "dist/blog/..."    → "/" (English, no prefix)
 */
function detectLangPrefix(filePath) {
  // Normalize path separators
  const normalized = filePath.replace(/\\/g, '/');
  // Check for language prefix after 'dist/'
  const match = normalized.match(/^dist\/([a-z]{2})\//);
  if (match) {
    return '/' + match[1] + '/';
  }
  return '/'; // English, no prefix
}

/**
 * Check if a link is valid for the given language prefix.
 * Returns true if the link is OK, false if it's a cross-language link.
 */
function isValidLink(href, langPrefix) {
  // Skip external links, anchors, mailto, etc.
  if (!href.startsWith('/')) return true;

  // Check if it's a global path (allowed in any language)
  if (GLOBAL_PREFIXES.some(p => href.startsWith(p))) return true;

  // For English (prefix = '/'), links must NOT start with a language prefix
  if (langPrefix === '/') {
    const langPattern = /^\/[a-z]{2}\//;
    return !langPattern.test(href);
  }

  // Check if it's another language link (language switcher) - these are intentional
  if (LANG_PREFIXES.some(p => href.startsWith(p))) return true;

  // For non-English, links MUST start with the expected language prefix
  return href.startsWith(langPrefix);
}

// ── Main ────────────────────────────────────────────────────────────

function main() {
  const filePath = process.argv[2];
  if (!filePath) {
    console.error('Usage: node scripts/audit-i18n-links.mjs <path-to-built-html>');
    process.exit(1);
  }

  let html;
  try {
    html = readFileSync(filePath, 'utf-8');
  } catch (err) {
    console.error(`Error reading file: ${err.message}`);
    process.exit(1);
  }

  const langPrefix = detectLangPrefix(filePath);
  console.log(`\n🔍 Auditing: ${filePath}`);
  console.log(`   Expected language prefix: ${langPrefix || '(none, English)'}\n`);

  // Extract all href values — matches both double and single quotes
  const hrefRegex = /<a\s+(?:[^>]*?\s+)?href=["'](\/[^"']*?)["']/gi;
  const matches = [];
  let match;
  while ((match = hrefRegex.exec(html)) !== null) {
    matches.push(match[1]);
  }

  if (matches.length === 0) {
    console.log('✅ No internal links found.');
    process.exit(0);
  }

  // Classify links
  const valid = [];
  const invalid = [];

  for (const href of matches) {
    if (isValidLink(href, langPrefix)) {
      valid.push(href);
    } else {
      invalid.push(href);
    }
  }

  console.log(`📊 Total internal links: ${matches.length}`);
  console.log(`   ✅ Valid (language-correct): ${valid.length}`);
  console.log(`   ❌ Cross-language (WRONG):   ${invalid.length}\n`);

  if (invalid.length > 0) {
    console.log('--- ❌ Cross-language links (max 10 shown) ---');
    for (const link of invalid.slice(0, 10)) {
      console.log(`   ${link}`);
    }
    if (invalid.length > 10) {
      console.log(`   ... and ${invalid.length - 10} more`);
    }
    console.log();
  }

  if (valid.length > 0) {
    console.log('--- ✅ Sample of valid links (max 5 shown) ---');
    for (const link of valid.slice(0, 5)) {
      console.log(`   ${link}`);
    }
    if (valid.length > 5) {
      console.log(`   ... and ${valid.length - 5} more`);
    }
    console.log();
  }

  // Exit with error code if any cross-language links found
  if (invalid.length > 0) {
    console.log('❌ AUDIT FAILED: Cross-language links detected!');
    process.exit(1);
  } else {
    console.log('✅ AUDIT PASSED: All links are language-correct.');
    process.exit(0);
  }
}

main();