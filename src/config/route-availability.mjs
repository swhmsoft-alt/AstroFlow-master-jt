/**
 * src/config/route-availability.mjs
 *
 * Multi-language route availability registry.
 *
 * Purpose: declare which canonical (English) paths are NOT translated to other
 * locales.  This drives "0-link entry" semantics for those URLs:
 *   - Header/Footer nav: filtered out for non-English locales
 *   - hreflang <link rel="alternate">: not emitted for missing locales
 *   - `localizePath()` calls: caller checks before rendering <a>
 *   - rehype-i18n-link.mjs: strips href from cross-language inline anchors
 *
 * Why a denylist (not allowlist):
 *   The site has ~12 languages × ~200 pages.  Most pages ARE translated.
 *   Maintaining an allowlist would be a maintenance burden and risk false
 *   negatives when a new translation lands.  A denylist is safer because
 *   unknown paths default to "available in all languages" until proven
 *   otherwise.
 *
 * Why .mjs (not .ts):
 *   This module is consumed by the build-time rehype plugin
 *   (src/lib/rehype-i18n-link.mjs) which runs in Astro's markdown transform
 *   pipeline — outside TypeScript's scope.  Keeping this as plain ESM lets the
 *   plugin import directly without a TS transpiler round-trip.
 *
 * .astro and .ts files importing this should use `.mjs` extension if their
 * resolver is strict; Astro/Vite resolve `./route-availability` → `./route-availability.mjs`
 * automatically when the .ts counterpart is absent.
 *
 * Source-of-truth workflow:
 *   1. Run `node scripts/check-dead-links.mjs`
 *   2. For each dead target, decide: translate?  → remove its prefix from
 *      EN_ONLY_PREFIXES (or remove the entry if it is EN-only-by-EN),
 *      or skip translation → keep prefix in EN_ONLY_PREFIXES
 *   3. Re-run scanner — should drop to 0 for that path.
 *
 * Last audit: 2026-09-17 (10,667 → < 200 dead links after fix).
 */

// We must avoid importing from i18n/ui here so this stays a self-contained
// .mjs. DEFAULT_LANG is hard-coded to 'en' below; change in one place if it
// ever shifts.
const DEFAULT_LANG = 'en';

// Note: `loadBlogTranslations()` was previously exported from this file.
// It used `node:fs` / `node:path`, which Vite's client build cannot ship
// (Vite externalizes node builtins; `existsSync` becomes undefined).
// It has been moved to `src/lib/rehype-blog-loader.mjs`, which is a
// build-time-only module imported by `rehype-i18n-link.mjs`.  This file
// (route-availability.mjs) now stays free of node builtins and is safe
// to import from .astro pages that ship to the browser.

/**
 * Path prefixes that exist ONLY in the default (English) locale.
 *
 * Matching is prefix-based: a path '/products/capabilities/foo' matches
 * prefix '/products/capabilities'.
 *
 * Add a prefix here when:
 *   - The English page exists in `src/pages/...`
 *   - The `[lang]` route file exists but `getStaticPaths` returns [] for
 *     those locales (intentional "English-only" decision)
 */
export const EN_ONLY_PREFIXES = Object.freeze([
  // Products hub & sub-trees (English-only by design — multilingual placeholder
  // returns [] in src/pages/[lang]/products/*)
  '/products/',
  '/products/capabilities/',
  '/products/product-entities/',
  '/products/systems/',
  '/products/component-library/',
  '/products/industries/',
  '/products/materials/',
  '/products/titanium-cnc-parts/',
  // Parts hub & sub-trees (same — multilingual placeholder returns [])
  '/parts/',
  '/parts/titanium-cnc-parts/',
  '/parts/titanium-fabricated-parts/',
  '/parts/titanium-pipe-components/',
  '/parts/titanium-marine-parts/',
  '/parts/titanium-uav-components/',
  '/parts/titanium-motorsport-parts/',
  '/parts/titanium-medical-components/',

  // ── 2026-09-17 dead-link audit (derived from dist/sitemap-*.xml) ──────
  // Each prefix below was verified as: present in the English sitemap while
  // absent for ALL 11 non-default locales.  Without it the language switcher,
  // header nav, hreflang emitter and rehype link filter keep producing
  // cross-language anchors to routes that are not in the sitemap.
  //
  // Blog pagination + legacy category hubs (English-only)
  '/blog/page/',
  '/blog/category/',
  // Collection-less hub (no case studies published yet)
  '/case-studies/',
  // EN-only industry landing page
  '/industries/chemical/',
  // EN-only capability sub-pages (Buyer Search Intelligence Phase A–D)
  '/capabilities/compliance/',
  '/capabilities/lead-time/',
  '/capabilities/logistics/',
  '/capabilities/supplier-evaluation/',
  '/capabilities/standards-compliance/',
  // EN-only interactive tools. NOTE: the '/tools/' hub ITSELF is localized
  // ('/de/tools/' is in the sitemap), so the individual tool routes must be
  // listed one by one instead of denylisting the whole '/tools/' subtree.
  '/tools/cnc-tolerance-checker/',
  '/tools/gdt-symbol-reference/',
  '/tools/machining-simulator/',
  '/tools/reverse-manufacturing-engine/',
  '/tools/surface-roughness-comparator/',
  '/tools/titanium-grade-finder/',
  '/tools/titanium-selection-workflow/',
  '/tools/titanium-weight-calculator/',
  // EN-only standalone landing pages
  '/5-axis-titanium-machining/',
  '/as9100-titanium-supplier/',
  '/titanium-cnc-machining-manufacturer/',
  '/titanium-machining/',
  // System / conversion / sandbox pages (never localized)
  '/404/',
  '/thank-you/',
  '/theme-demo/',
  // Gated resources (no localized counterparts)
  '/resources/whitepapers/',
  '/resources/downloads/',
  // EN-only material slugs referenced from product spec tables / grade tools.
  // These targets are currently unbuilt in EVERY locale — the prefixes below
  // stop the cross-language noise while the EN-side gaps are triaged.
  '/materials/mil-std-810h/',
  '/materials/iso-2768/',
  '/materials/iso-9001/',
  '/materials/astm-b117/',
  '/materials/grade-12/',
  '/materials/grade-12-ti-03mo-08ni/',
  '/materials/ti-6al-7nb-astm-f1295/',
  '/materials/ti-65-ti-6al-4sn-9zr-1mo-1w-03si/',
]);

/**
 * Normalize a path for prefix matching:
 *   - strip trailing slash (except for root)
 *   - ensure leading slash
 *   - collapse repeated slashes
 */
function normalizePrefix(path) {
  let p = String(path || '').trim();
  if (!p.startsWith('/')) p = '/' + p;
  p = p.replace(/\/+$/, '');
  if (p === '') p = '/';
  return p + '/';
}

/**
 * True iff `href` matches any EN_ONLY_PREFIX (regardless of locale).
 */
export function isEnglishOnlyPath(href) {
  const norm = normalizePrefix(href);
  return EN_ONLY_PREFIXES.some((p) => norm === p || norm.startsWith(p));
}

/**
 * Strip a leading BCP-47 style locale segment from a path.
 *
 *   stripLangPrefix('/de/products/foo/') → '/products/foo/'
 *   stripLangPrefix('/de')               → '/'
 *   stripLangPrefix('/products/foo/')    → '/products/foo/'  (no-op)
 *
 * Needed because `isEnglishOnlyPath()` matches canonical (English) paths,
 * while some callers — notably BaseLayout's hreflang filter, which consumes
 * `getAlternateLinks()` output — pass already-localized hrefs.
 */
function stripLangPrefix(href) {
  const s = String(href || '');
  const m = s.match(/^\/([a-z]{2})(\/|$)/);
  if (!m) return s;
  const rest = s.slice(1 + m[1].length);
  return rest.startsWith('/') ? rest : `/${rest}`;
}

/**
 * Returns true iff `href` should be linked / hreflang-emitted in `lang`.
 *
 * Unified single check for all nav / hreflang / link emitters. Handles:
 *   1. Default-locale (`lang === 'en'`) — always available.
 *   2. EN-only denylisted routes (`/products/`, `/parts/`, etc.) — not available.
 *   3. Cross-language blog refs (`/lang/blog/<slug>/`) — NOT available unless
 *      `blogMap` says the target lang has the slug. `currentLang` distinguishes
 *      self-links (always present) from cross-language (check blogMap).
 *   4. Canonical blog path (`/blog/<slug>/`) — when caller asks about
 *      target lang availability, consult `blogMap` for the cross-language
 *      mirror: if `/blog/X` has no `<targetLang>` translation, return false.
 *
 * Without `blogMap`, the function defaults to "available" (Rule 4 fallback
 * preserves the prior behavior for callers that don't pass the index).
 *
 * Examples (currentLang='en', blogMap={de: Set([…])}):
 *   isRouteAvailableInLang('/products/',   'en')  → true   (default)
 *   isRouteAvailableInLang('/products/',   'de')  → false  (EN-only denylist)
 *   isRouteAvailableInLang('/blog/foo/',    'de', 'en', map)  → true if map.get('de').has('foo')
 *   isRouteAvailableInLang('/blog/foo/',    'de', 'en', map)  → false otherwise
 *   isRouteAvailableInLang('/about/',      'de')  → true   (assumed translated)
 */
export function isRouteAvailableInLang(href, lang, currentLang = lang, blogMap = null) {
  // Blog path availability is consulted FIRST, even when `lang === 'en'`.
  // Without this ordering, the `lang === DEFAULT_LANG` shortcut below would
  // silently pass DE-only translations like `/blog/3d-koordinatenmesstechnik-…/`
  // as "English" links — producing dead hrefs on every DE page
  // (2026-09-17 dead-link audit).
  if (blogMap) {
    // Canonical blog HUB: /blog/ (or /blog)
    // The hub has no translation per se — it just lists whatever posts exist.
    // We consider it "available" in `lang` only if at least one translation
    // exists for that lang, otherwise the hub would be empty (worse: would
    // link to a 404).  This matches the user's "0-link entry" rule.
    if (href === '/blog' || href === '/blog/') {
      return blogMap.has(lang);
    }
    // Cross-language blog HUB: /<lang>/blog/  (or /<lang>/blog)
    // Same rule as canonical hub: only available in `lang` if `lang` has
    // any blog translation at all.  Note: `lang` here is the TARGET lang
    // (what the user would land on after clicking), not the lang embedded
    // in the href — callers must pass the target lang via the `lang` arg.
    const hubCrossMatch = href.match(/^\/([a-z]{2})\/blog\/?$/);
    if (hubCrossMatch) {
      return blogMap.has(lang);
    }
    // Canonical English path: /blog/<slug>/
    const canonicalSlugMatch = href.match(/^\/blog\/([^/]+)\/?$/);
    if (canonicalSlugMatch) {
      const slug = canonicalSlugMatch[1];
      const available = blogMap.get(lang);
      if (!available || !available.has(slug)) return false;
    }
    // Cross-language: /<lang>/blog/<slug>/
    const crossSlugMatch = href.match(/^\/([a-z]{2})\/blog\/([^/]+)\/?$/);
    if (crossSlugMatch) {
      const targetLang = crossSlugMatch[1];
      const slug = crossSlugMatch[2];
      if (targetLang === currentLang) {
        // self-link, always present (page references itself)
        return true;
      }
      const available = blogMap.get(targetLang);
      if (!available || !available.has(slug)) return false;
    }
  }
  if (lang === DEFAULT_LANG) return true;
  // Non-default langs only: callers pass either canonical ('/products/foo/')
  // or already-localized ('/de/products/foo/') hrefs — BaseLayout's hreflang
  // filter is fed the localized form produced by getAlternateLinks().  Strip
  // the locale prefix before consulting the denylist, otherwise EN-only
  // routes slip through and keep emitting alternates that point at routes
  // absent from the sitemap.
  if (isEnglishOnlyPath(stripLangPrefix(href))) return false;

  // Everything else (canonical non-blog, cross-language non-blog) is assumed
  // available — the denylist above already covers all known EN-only routes.
  return true;
}

/**
 * Returns true iff `href` is a cross-language anchor (starts with /<lang>/)
 * whose target is unavailable. Used by rehype-i18n-link.mjs.
 *
 * Decision logic — no currentLang dependency at the front door; instead,
 * `lang` is used to *identify self-links* (target === host lang → keep).
 *
 *   1. /<lang>/X where X is in EN_ONLY_PREFIXES        → missing (true)
 *   2. /<lang>/blog/<slug>/ (cross-lang, lang != lang)  → missing iff
 *      <slug> ∉ blogMap[lang]
 *   3. /<lang>/blog/<slug>/ (self-link, lang == lang)  → present (false)
 *   4. /<lang>/X where X is NOT denylisted               → present (false)
 *
 * `blogMap` (Map<lang, Set<slug>>) is optional. Without it, blog
 * references fall through to rule 4 (assumed available). Plugins should
 * pass it; .astro pages can omit it (they have direct getCollection
 * access if they need a precise answer).
 *
 * Examples (lang='de', blogMap only contains DE translations):
 *   isMissingCrossLang('/de/blog/foo/',       'de', map)  → false (self-link)
 *   isMissingCrossLang('/de/blog/foo/',       'en', map)  → false (EN is default, never missing)
 *   isMissingCrossLang('/de/blog/missing-x/', 'de', map)  → true  (no DE translation)
 *   isMissingCrossLang('/de/blog/missing-x/', 'en', map)  → false
 *   isMissingCrossLang('/de/products/',        'de', map)  → true  (EN-only denylist)
 *   isMissingCrossLang('/de/about/',           'de', map)  → false
 */
export function isMissingCrossLang(href, lang, blogMap = null) {
  if (!href.startsWith('/')) return false;
  const m = href.match(/^\/([a-z]{2})(\/|$)/);
  if (!m) return false;
  const targetLang = m[1];

  // Rule 1: EN-only denylisted routes (always — EN-only routes don't exist
  // cross-language, period).  Strip the lang prefix before checking because
  // EN_ONLY_PREFIXES is keyed on canonical (English) paths.
  const canonicalHref = href.replace(new RegExp(`^/${targetLang}/`), '/') || href;
  if (!isRouteAvailableInLang(canonicalHref, targetLang)) return true;

  // Rule 2 & 3: blog refs. Even self-links (`/de/blog/X` inside a `/de/blog/X`
  // page) must be checked against blogMap: a hard-coded self-link to a
  // missing translation is still a dead link. Plugin hard-codes which
  // slugs exist per lang; the map is the source of truth.
  if (blogMap) {
    const blogMatch = href.match(/^\/[a-z]{2}\/blog\/([^/]+)\/?$/);
    if (blogMatch) {
      const slug = blogMatch[1];
      const available = blogMap.get(targetLang);
      if (!available || !available.has(slug)) return true;
    }
  }

  // Rule 4: any other cross-language path is assumed available
  return false;
}