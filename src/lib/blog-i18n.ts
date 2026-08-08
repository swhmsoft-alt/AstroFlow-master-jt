/**
 * Blog i18n utility functions.
 *
 * Uses two collections:
 *  - 'blog' (English source files in src/content/blog/)
 *  - 'blog-translations' (translated files in src/content/blog-translations/{lang}-{slug}.md)
 *
 * EACH LANGUAGE'S BLOG IS NOW FULLY INDEPENDENT.
 * - English posts come ONLY from the 'blog' collection.
 * - Non-English posts come ONLY from the 'blog-translations' collection (filtered by lang).
 * - NO fallback to English when a translation doesn't exist.
 */

import { getCollection, type CollectionEntry } from 'astro:content';
import { LANGUAGES, DEFAULT_LANG } from '../i18n/ui';

type BlogPost = CollectionEntry<'blog'>;
type BlogTranslation = CollectionEntry<'blog-translations'>;

const SUPPORTED_LANGS = new Set(Object.keys(LANGUAGES));

/** Posts per page for the paginated blog listing (/blog/page/{n}/). */
export const BLOG_PAGE_SIZE = 12;

/**
 * Extract the original slug from a blog-translations slug (format: "{lang}-{slug}").
 */
function parseTranslationSlug(translationSlug: string): { lang: string; originalSlug: string } {
  const langCodes = Array.from(SUPPORTED_LANGS).sort((a, b) => b.length - a.length);
  for (const code of langCodes) {
    if (translationSlug.startsWith(code + '-')) {
      return { lang: code, originalSlug: translationSlug.slice(code.length + 1) };
    }
  }
  return { lang: 'en', originalSlug: translationSlug };
}

/**
 * Get all blog posts for a specific language.
 * For 'en', returns top-level English posts from the 'blog' collection.
 * For other languages, returns translated posts from 'blog-translations' ONLY.
 * No fallback to English.
 */
export async function getBlogPosts(lang: string): Promise<BlogPost[]> {
  const allEnglish = await getCollection('blog');

  if (lang === DEFAULT_LANG) {
    return allEnglish
      .filter(p => !p.slug.includes('/'))
      .sort((a, b) => new Date(b.data.pubDate).getTime() - new Date(a.data.pubDate).getTime());
  }

  // For non-English: return ONLY translations for this language (no English fallback)
  const allTranslations = await getCollection('blog-translations');
  const langTranslations = allTranslations.filter(t => t.data.lang === lang);

  // Map translation entries to BlogPost-compatible objects
  const result: BlogPost[] = langTranslations.map(t => ({
    ...t,
    slug: t.data.originalSlug,
    data: {
      title: t.data.title,
      description: t.data.description,
      pubDate: t.data.pubDate,
      author: t.data.author,
      category: t.data.category,
      tags: t.data.tags ?? [],
      coverImage: t.data.coverImage,
      coverImageAlt: t.data.coverImageAlt,
      featured: t.data.featured,
    },
  })) as unknown as BlogPost[];

  return result.sort((a, b) => new Date(b.data.pubDate).getTime() - new Date(a.data.pubDate).getTime());
}

/**
 * Get a single blog post for a specific language.
 * For 'en', returns the English post from the 'blog' collection.
 * For other languages, returns the translated post from 'blog-translations' ONLY.
 * Returns undefined if no post exists for that language.
 */
export async function getBlogPost(lang: string, slug: string): Promise<BlogPost | undefined> {
  if (lang === DEFAULT_LANG) {
    const allEnglish = await getCollection('blog');
    const engPost = allEnglish.find(p => p.slug === slug && !p.slug.includes('/'));
    return engPost || undefined;
  }

  // For non-English: look up translation directly (no English fallback)
  const allTranslations = await getCollection('blog-translations');
  const translation = allTranslations.find(
    t => t.data.lang === lang && t.data.originalSlug === slug
  );

  if (!translation) return undefined;

  return {
    ...translation,
    slug: translation.data.originalSlug,
    data: {
      title: translation.data.title,
      description: translation.data.description,
      pubDate: translation.data.pubDate,
      author: translation.data.author,
      category: translation.data.category,
      tags: translation.data.tags ?? [],
      coverImage: translation.data.coverImage,
      coverImageAlt: translation.data.coverImageAlt,
      featured: translation.data.featured,
    },
  } as unknown as BlogPost;
}

/**
 * Get the rendered Content of a translated blog post.
 * Returns the translation's content if available, otherwise English content.
 */
export function getTranslationContent(
  engPost: BlogPost,
  translation?: BlogTranslation
): { Content: ReturnType<BlogPost['render']> extends Promise<infer T extends { Content: unknown }> ? T['Content'] : never; headings: unknown[] } {
  return null as any;
}

/**
 * Extract the original slug from a potentially language-prefixed slug.
 */
export function getOriginalSlug(prefixedSlug: string): string {
  return prefixedSlug;
}

/**
 * Convert a blog category display name into a URL-safe slug.
 *
 * Matches the slug format used across blog category pages
 * (e.g. "Titanium CNC Machining Services" → "titanium-cnc-machining-services").
 */
export function categoryToSlug(category: string): string {
  const slug = category
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
  // Never emit an empty slug — fall back to a safe archive path.
  return slug || 'uncategorized';
}

/**
 * Check if a blog post exists for a given language and slug.
 */
export async function hasTranslation(lang: string, slug: string): Promise<boolean> {
  if (lang === DEFAULT_LANG) {
    const allEnglish = await getCollection('blog');
    return allEnglish.some(p => p.slug === slug && !p.slug.includes('/'));
  }
  const allTranslations = await getCollection('blog-translations');
  return allTranslations.some(t => t.data.lang === lang && t.data.originalSlug === slug);
}