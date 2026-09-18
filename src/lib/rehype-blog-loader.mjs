/**
 * src/lib/rehype-blog-loader.mjs
 *
 * Node.js-only filesystem indexer for blog translations.
 *
 * Why this is split from `src/config/route-availability.mjs`:
 *   Vite's client build analyzes every imported module's transitive
 *   dependencies.  When `route-availability.mjs` used `node:fs` and
 *   `node:path` for `loadBlogTranslations()`, Vite's client build
 *   threw:
 *     "existsSync" is not exported by "__vite-browser-external",
 *     imported by "src/config/route-availability.mjs"
 *   because the client bundle can't ship node builtins.
 *
 *   Solution: split the fs/path-touching code into THIS file, which is
 *   only ever required by `src/lib/rehype-i18n-link.mjs` — a build-time
 *   plugin that runs in Node, never in the browser.  `route-availability.mjs`
 *   stays pure (no fs/path) and is therefore safe to import from
 *   .astro pages that ship to the browser.
 *
 * Build-time callers:
 *   - `rehype-i18n-link.mjs` → calls `loadBlogTranslations()` once at
 *     config-load time to build a lang→Set<slug> map.
 */
import { readdirSync, readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

/**
 * Build a Map<lang, Set<slug>> from the blog-translations/ filesystem tree.
 * Reads frontmatter's `lang:` field to determine the language; the slug is
 * the filename minus its `<lang>-` prefix.
 *
 * Pure read: no caching. The rehype plugin should call this ONCE at config
 * load and reuse the returned Map across all markdown transforms.
 */
export function loadBlogTranslations(translationsDir) {
  const map = new Map();
  if (!translationsDir || !existsSync(translationsDir)) return map;
  for (const file of readdirSync(translationsDir)) {
    if (!file.endsWith('.md') && !file.endsWith('.mdx')) continue;
    const content = readFileSync(join(translationsDir, file), 'utf8');
    const parts = content.split('---');
    if (parts.length < 3) continue;
    const fm = parts[1];
    const m = fm.match(/^\s*lang\s*:\s*['"]?([a-z]{2})['"]?\s*$/m);
    if (!m) continue;
    const lang = m[1];
    const slug = file.replace(/\.mdx?$/i, '').replace(new RegExp(`^${lang}-`), '');
    let set = map.get(lang);
    if (!set) {
      set = new Set();
      map.set(lang, set);
    }
    set.add(slug);
  }
  return map;
}

/**
 * Build a full blog translation map, including the **EN canonical** set under
 * key `'en'` (populated from `src/content/blog/*.md` filenames).
 *
 * Without this entry, `isRouteAvailableInLang('/blog/<slug>/', 'en')` short-
 * circuits on `lang === 'en'` and silently passes even when `<slug>` is a
 * DE-only translation with no English original — which manifested in the
 * 2026-09-17 dead-link audit as LanguageSelector emitting
 * `href="/blog/<DE-only-slug>/"` from every DE page.
 *
 * @param {string} translationsDir  Directory holding `<lang>-<slug>.md`
 *                                files (defaults to
 *                                  `./src/content/blog-translations`).
 * @param {string} blogDir         Directory holding the EN canonical
 *                                 markdown files (defaults to
 *                                   `./src/content/blog`).
 */
export function loadBlogMap(translationsDir = './src/content/blog-translations', blogDir = './src/content/blog') {
  const map = loadBlogTranslations(translationsDir);
  if (blogDir && existsSync(blogDir)) {
    const enSet = new Set();
    for (const file of readdirSync(blogDir)) {
      if (!file.endsWith('.md') && !file.endsWith('.mdx')) continue;
      enSet.add(file.replace(/\.mdx?$/i, ''));
    }
    map.set('en', enSet);
  }
  return map;
}