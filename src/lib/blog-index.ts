/**
 * src/lib/blog-index.ts
 *
 * Build a Map<lang, Set<slug>> from Astro content collections, used by
 * `.astro` components (BaseLayout, LanguageSelector, AudienceHub) so they
 * can ask `isRouteAvailableInLang` whether a `/blog/<slug>/` target is
 * available in the target language.
 *
 * Why this exists separately:
 *   `src/config/route-availability.mjs` must stay browser-safe (no fs / no
 *   astro:content), so it can't build the index itself.  This module is
 *   build-time-only and consumed exclusively by server-rendered Astro code
 *   (or rehype plugins that run inside Astro's transform pipeline).
 *
 * Includes the **EN canonical** set under key 'en', populated from
 * `src/content/blog/*.md` filenames. Without this entry,
 * `isRouteAvailableInLang('/blog/<slug>/', 'en')` would short-circuit on
 * `lang === 'en'` and silently pass — even when the slug is a DE-only
 * translation with no English source. That manifested in the
 * 2026-09-17 dead-link audit as LanguageSelector emitting
 * `href="/blog/<DE-only-slug>/"` from every DE page.
 */
import { getCollection } from 'astro:content';

export async function buildBlogMap(): Promise<Map<string, Set<string>>> {
  const map = new Map<string, Set<string>>();

  // Translations (non-default locales)
  const translations = await getCollection('blog-translations');
  for (const entry of translations) {
    const lang = entry.data.lang as string | undefined;
    if (!lang) continue;
    const slug = entry.slug.startsWith(`${lang}-`)
      ? entry.slug.slice(lang.length + 1)
      : entry.slug;
    let set = map.get(lang);
    if (!set) { set = new Set(); map.set(lang, set); }
    set.add(slug);
  }

  // EN canonicals — the file-name source of truth (matches how some blog pages
  // were originally added).  This Set is intentionally separate from the
  // translation map so a slug can be flagged as "EN canonical only" when the
  // translation files exist under blog-translations/ but no EN source lives
  // under blog/.
  const enBlog = await getCollection('blog');
  map.set('en', new Set(enBlog.map((e) => e.slug)));

  return map;
}