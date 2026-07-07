/**
 * diagnose-links.mjs
 * 
 * Simple script to extract ALL root-relative hrefs from a built HTML file
 * and classify them by category, without any limit on display count.
 * 
 * Usage:
 *   node scripts/diagnose-links.mjs dist/ja/blog/titanium-cnc-machining-services/index.html
 */

import { readFileSync } from 'fs';

// All known global path prefixes that don't depend on language
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
  '/robots.txt',
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

// All known language prefixes
const LANG_PREFIXES = ['/ja/', '/de/', '/fr/', '/es/', '/pt/', '/it/', '/ko/', '/nl/', '/pl/'];

function detectLangPrefix(filePath) {
  const normalized = filePath.replace(/\\/g, '/');
  const match = normalized.match(/^dist\/([a-z]{2})\//);
  if (match) return '/' + match[1] + '/';
  return '/';
}

function classifyHref(href, langPrefix) {
  // Skip external, anchors, mailto, etc.
  if (!href.startsWith('/')) return 'external';

  // Check global prefixes
  for (const p of GLOBAL_PREFIXES) {
    if (href.startsWith(p)) return 'global';
  }

  // Check if it's a cross-language link (for non-English pages)
  for (const lp of LANG_PREFIXES) {
    if (lp !== langPrefix && href.startsWith(lp)) return 'lang-switcher';
  }

  // Check if it's valid for the expected language
  if (href.startsWith(langPrefix)) return 'valid';

  // Check if it starts with a language prefix (some other lang)
  const langPattern = /^\/[a-z]{2}\//;
  if (langPattern.test(href)) return 'other-lang';

  // Everything else is suspicious
  return 'suspicious';
}

function main() {
  const filePath = process.argv[2];
  if (!filePath) {
    console.error('Usage: node scripts/diagnose-links.mjs <path-to-built-html>');
    process.exit(1);
  }

  const html = readFileSync(filePath, 'utf-8');
  const langPrefix = detectLangPrefix(filePath);
  
  // Extract ALL href values from <a> tags
  const hrefRegex = /<a\s+(?:[^>]*?\s+)?href=["'](\/[^"']*?)["']/gi;
  const matches = [];
  let match;
  while ((match = hrefRegex.exec(html)) !== null) {
    matches.push(match[1]);
  }

  // Also extract from <link> tags (e.g. canonical, alternate)
  const linkRegex = /<link\s+(?:[^>]*?\s+)?href=["'](\/[^"']*?)["']/gi;
  while ((match = linkRegex.exec(html)) !== null) {
    matches.push(match[1]);
  }

  // Remove duplicates
  const uniq = [...new Set(matches)];
  uniq.sort();

  console.log(`\n🔍 Diagnosing: ${filePath}`);
  console.log(`   Language prefix: ${langPrefix || '(English)'}`);
  console.log(`   Total unique hrefs: ${uniq.length}\n`);

  // Classify each
  const classified = {
    valid: [],
    global: [],
    'lang-switcher': [],
    'other-lang': [],
    suspicious: [],
    external: [],
  };

  for (const href of uniq) {
    const cat = classifyHref(href, langPrefix);
    classified[cat].push(href);
  }

  // Print summary
  console.log('=== SUMMARY ===');
  console.log(`  ✅ Valid (/{lang}/...):         ${classified.valid.length}`);
  console.log(`   🌐 Global (shared paths):      ${classified.global.length}`);
  console.log(`   🔀 Lang-switcher links:        ${classified['lang-switcher'].length}`);
  console.log(`   ⚠️  Other language:             ${classified['other-lang'].length}`);
  console.log(`   ❌ Suspicious (no match):       ${classified.suspicious.length}`);
  console.log(`   🔗 External/skip:              ${classified.external.length}`);
  console.log();

  // Print details for each non-valid category
  for (const [cat, label] of [['global', '🌐 GLOBAL PATHS'], ['lang-switcher', '🔀 LANG-SWITCHER'], ['other-lang', '⚠️  OTHER LANGUAGE'], ['suspicious', '❌ SUSPICIOUS']]) {
    if (classified[cat].length > 0) {
      console.log(`--- ${label} (${classified[cat].length}) ---`);
      for (const link of classified[cat]) {
        console.log(`   ${link}`);
      }
      console.log();
    }
  }
}

main();