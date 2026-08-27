/**
 * rehype-auto-internal-links-i18n
 *
 * Language-aware wrapper around rehype-auto-internal-links.
 *
 * Problem: The original plugin uses a single flat keywordMap. If a Japanese blog
 * contains an English keyword like "CNC machining", it would link to the English URL
 * "/titanium-cnc-machining-services/" instead of the Japanese "/ja/..." URL.
 *
 * Solution: Detect the current page's language from the source file path,
 * then filter the keywordMap to only include URLs matching that language.
 *
 * File path → language mapping:
 *   src/content/blog/xxx.md                     → en  (no lang prefix)
 *   src/content/blog-translations/de-xxx.md     → de  (prefix /de/)
 *   src/content/blog-translations/ja-xxx.md     → ja  (prefix /ja/)
 *   ...etc for all 12 languages
 */

import { rehypeAutoInternalLinks } from 'rehype-auto-internal-links';
import { visit } from 'unist-util-visit';

const LANG_PREFIXES = ['de', 'ja', 'fr', 'es', 'pt', 'it', 'ko', 'nl', 'pl', 'ru', 'ar'];
const DEFAULT_LANG = 'en';

/**
 * Per-language maxLinksPerPage override (G6 = B).
 * When the caller does not pass an explicit maxLinksPerPage, EN pages get 6
 * links (high keyword density, marginal SEO benefit confirmed in §8.3) while
 * other languages stay at 3 (low density; bumping the cap produces no
 * additional links and just enlarges the surface area for risk).
 *
 * Caller-supplied maxLinksPerPage always wins (escape hatch for A/B tests).
 */
const PER_LANG_MAX = Object.freeze({ en: 6 });

function detectLanguage(file) {
  const filePath = String(file.history?.[0] ?? file.path ?? '');
  const normalized = filePath.replace(/\\/g, '/');

  const baseName = normalized.split('/').pop() || '';
  for (const code of LANG_PREFIXES) {
    if (baseName.startsWith(code + '-')) return code;
  }

  const parts = normalized.split('/');
  for (const part of parts) {
    if (LANG_PREFIXES.includes(part)) return part;
  }

  return DEFAULT_LANG;
}

function filterByLanguage(keywordMap, lang) {
  const filtered = {};
  for (const [keyword, meta] of Object.entries(keywordMap)) {
    const href = meta.href;
    if (lang === DEFAULT_LANG) {
      const hasLangPrefix = LANG_PREFIXES.some(pref => href.startsWith(`/${pref}/`));
      if (!hasLangPrefix) filtered[keyword] = meta;
    } else {
      if (href.startsWith(`/${lang}/`)) filtered[keyword] = meta;
    }
  }
  return filtered;
}

/**
 * §7.5 #2 — block auto-linking inside table cells without touching node_modules.
 *
 * rehype-auto-internal-links has a hard-coded BLOCKED_TAGS set (a/code/pre/h1..h6/
 * script/style/button). <td>/<th> are not in the set, so cell text such as
 * "Ti-6Al-4V ELI" gets linked automatically whenever the keyword is registered,
 * polluting comparison tables.
 *
 * Trick: temporarily rename <td>/<th> to <a> (which IS blocked) so the inner
 * plugin returns SKIP for the cell subtree. After the plugin runs, restore the
 * original tag. A unique `data-orig-cell` property on the renamed element
 * guarantees we only restore nodes we touched (and never pre-existing <a>
 * elements).
 *
 * See memory-bank/grade-5-semantic-cluster-audit.md §7.5 #2 / §9.1.
 */
function blockTableCells(tree) {
  visit(tree, (node) => {
    if (node.type === 'element' && (node.tagName === 'td' || node.tagName === 'th')) {
      node.properties = { ...(node.properties || {}), 'data-orig-cell': node.tagName };
      node.tagName = 'a';
    }
  });
}

function restoreTableCells(tree) {
  visit(tree, (node) => {
    if (
      node.type === 'element' &&
      node.tagName === 'a' &&
      node.properties &&
      typeof node.properties['data-orig-cell'] === 'string'
    ) {
      const orig = node.properties['data-orig-cell'];
      const props = { ...node.properties };
      delete props['data-orig-cell'];
      node.tagName = orig;
      node.properties = props;
    }
  });
}

export function rehypeAutoInternalLinksI18n(options = {}) {
  // NOTE: do NOT default maxLinksPerPage here — we need `undefined` to mean
  // "caller did not pass anything" so the per-language override can fire.
  const { keywordMap = {}, maxLinksPerPage } = options;

  return function transformer(tree, file) {
    const lang = detectLanguage(file);
    const langKeywords = filterByLanguage(keywordMap, lang);

    // G6 = B: per-language default. Caller's explicit value (incl. 3) wins.
    const effectiveMax =
      maxLinksPerPage !== undefined
        ? maxLinksPerPage
        : (PER_LANG_MAX[lang] ?? 3);

    blockTableCells(tree);

    const originalPlugin = rehypeAutoInternalLinks({
      keywordMap: langKeywords,
      maxLinksPerPage: effectiveMax,
    });
    originalPlugin(tree, file);

    restoreTableCells(tree);
  };
}
