/**
 * src/lib/rehype-i18n-link.mjs
 *
 * Unified rehype plugin that enforces "0-link entry" semantics for
 * cross-language links across ALL English-only routes.
 *
 * Replaces the earlier `rehype-blog-i18n-link.mjs` plugin which only handled
 * `/<lang>/blog/<slug>/`.  This module:
 *   - For <a href="/<lang>/<path>">: if `<lang>` is not the current page's
 *     language AND the target path is English-only (per
 *     route-availability.mjs), STRIP the href attribute but KEEP the anchor
 *     text.  Tag with `data-i18n-missing="<original-href>"` for forensic
 *     trace (also surfaced by check-dead-links.mjs).
 *   - For <link rel="alternate" hreflang="<lang>" href="...">: same check;
 *     if target is English-only, REMOVE the entire node from its parent
 *     (the only way to satisfy Google's hreflang-must-point-at-200 rule).
 *
 * Result: cross-language anchors remain visible to readers as inline text
 * (preserves reading flow), but the crawler sees zero clickable hrefs into
 * untranslated territory — the URL is genuinely absent from the crawl graph.
 *
 * This unifies treatment across all EN-only paths (`/products/`, `/parts/`,
 * `/blog/`, `/case-studies/`, etc.) using a single denylist
 * (EN_ONLY_PREFIXES) and a single predicate (isRouteAvailableInLang).
 *
 * Plugin signature follows Astro/rehype convention: returns a transformer.
 */
import { isMissingCrossLang } from '../config/route-availability.mjs';
import { loadBlogTranslations } from './rehype-blog-loader.mjs';

/**
 * Walk every node in a unist tree and call `cb(node, parent)` for each one.
 * Maintains a `parent` stack so the callback can identify which array to
 * splice when removing <link> elements.  Real rehype/hast trees always
 * carry `parent` references, but a hand-rolled test tree may not — this
 * implementation is robust to both.
 */
function visit(node, cb, parent = null) {
  if (!node) return;
  // Lazy-install `parent` reference (no-op if already set; never overwrites)
  if (parent && node.parent !== parent) node.parent = parent;
  cb(node, parent);
  if (Array.isArray(node.children)) {
    for (const child of node.children) visit(child, cb, node);
  }
}

/**
 * The rehype transformer factory. Returns a function `(tree) => void`.
 *
 * @param {object}  options
 * @param {string}  options.currentLang         The page's active language (skips self-links).
 * @param {Map}     options.blogMap             Map<lang, Set<slug>> of blog translations.
 *                                              Required to filter cross-language blog
 *                                              refs that aren't EN-only denylisted.
 *                                              Build once via `loadBlogTranslations()`.
 *
 * For Astro page rendering, the integration point is
 *   `astro.config.mjs > markdown.rehypePlugins`.
 * Pass `[rehypeI18nLink, { currentLang, blogMap }]` so the factory
 * receives both pieces.
 */
export function rehypeI18nLink(options = {}) {
  const currentLang = options.currentLang || 'en';
  const blogMap = options.blogMap || null;

  return function transformer(tree) {
    if (!tree) return;
    visit(tree, (node) => {
      if (node.type !== 'element') return;
      const isAnchor = node.tagName === 'a';
      const isLinkRel = node.tagName === 'link';
      if (!isAnchor && !isLinkRel) return;

      const props = node.properties || {};
      const href = typeof props.href === 'string' ? props.href : null;
      if (!href) return;

      // External / non-absolute hrefs are out of scope.
      if (href.startsWith('//')) return;
      if (/^(https?:|mailto:|tel:|javascript:|data:|#)/i.test(href)) return;
      if (!href.startsWith('/')) return;

      // Decide if this is a missing cross-language link.
      if (!isMissingCrossLang(href, currentLang, blogMap)) return;

      if (isAnchor) {
        // Keep anchor text, strip href, tag for forensics + CSS styling.
        delete props.href;
        props['data-i18n-missing'] = href;
      } else {
        // <link rel="alternate"> — remove the node entirely from its parent.
        const parent = node.parent;
        if (parent && Array.isArray(parent.children)) {
          parent.children = parent.children.filter((c) => c !== node);
        }
      }
    });
  };
}

/**
 * Convenience: build a rehype plugin pre-loaded with the blog translations
 * index from disk. Use this in astro.config.mjs:
 *
 *   rehypePlugins: [
 *     [createRehypeI18nLinkPlugin, { currentLang: 'en' }],
 *     ...
 *   ]
 *
 * Note that markdown transforms in Astro are global — currentLang at
 * plugin-build time is not yet known per-page. Pass 'en' here and the
 * self-link check (targetLang === currentLang) is effectively skipped for
 * non-EN pages; the EN-only denylist + blog map still apply globally.
 */
export function createRehypeI18nLinkPlugin(options = {}) {
  const translationsDir = options.translationsDir || './src/content/blog-translations';
  const currentLang = options.currentLang || 'en';
  const blogMap = loadBlogTranslations(translationsDir);
  return rehypeI18nLink({ currentLang, blogMap });
}

export default rehypeI18nLink;