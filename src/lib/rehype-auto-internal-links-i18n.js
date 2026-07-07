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
 *   ...etc for all 10 languages
 */

import { rehypeAutoInternalLinks } from 'rehype-auto-internal-links';

const LANG_PREFIXES = ['de', 'ja', 'fr', 'es', 'pt', 'it', 'ko', 'nl', 'pl'];
const DEFAULT_LANG = 'en';

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

export function rehypeAutoInternalLinksI18n(options = {}) {
  const { keywordMap = {}, maxLinksPerPage = 3 } = options;

  return function transformer(tree, file) {
    const lang = detectLanguage(file);
    const langKeywords = filterByLanguage(keywordMap, lang);
    const originalPlugin = rehypeAutoInternalLinks({
      keywordMap: langKeywords,
      maxLinksPerPage,
    });
    originalPlugin(tree, file);
  };
}
