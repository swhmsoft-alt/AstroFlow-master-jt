/**
 * Blog i18n utility functions.
 *
 * Uses two collections:
 *  - 'blog' (English source files in src/content/blog/)
 *  - 'blogTranslations' (translated files in src/content/blog-translations/{lang}-{slug}.md)
 *
 * Translated files have frontmatter fields: lang, originalSlug, plus translated title/description etc.
 * When no translation exists, falls back to the English source.
 */

import { getCollection, type CollectionEntry } from 'astro:content';
import { LANGUAGES, DEFAULT_LANG } from '../i18n/ui';

type BlogPost = CollectionEntry<'blog'>;
type BlogTranslation = CollectionEntry<'blog-translations'>;

const SUPPORTED_LANGS = new Set(Object.keys(LANGUAGES));

/**
 * Extract the original slug from a blog-translations slug (format: "{lang}-{slug}").
 */
function parseTranslationSlug(translationSlug: string): { lang: string; originalSlug: string } {
  // Slugs are like "de-welcome-to-boze-cnc-blog"
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
 * For 'en', returns top-level English posts.
 * For other languages, returns translated posts if available, falling back to English.
 */
export async function getBlogPosts(lang: string): Promise<BlogPost[]> {
  const allEnglish = await getCollection('blog');

  if (lang === DEFAULT_LANG) {
    return allEnglish
      .filter(p => !p.slug.includes('/'))
      .sort((a, b) => new Date(b.data.pubDate).getTime() - new Date(a.data.pubDate).getTime());
  }

  // For non-English: get translations and map them to "virtual" posts
  const allTranslations = await getCollection('blog-translations');
  const langTranslations = allTranslations.filter(t => t.data.lang === lang);

  // Create a map: originalSlug -> translation
  const translationMap = new Map<string, BlogTranslation>();
  for (const t of langTranslations) {
    translationMap.set(t.data.originalSlug, t);
  }

  // For each English post, return translation if available, otherwise English
  const result: BlogPost[] = [];
  for (const eng of allEnglish) {
    if (eng.slug.includes('/')) continue; // Skip nested (non-top-level)
    
    const translation = translationMap.get(eng.slug);
    if (translation) {
      // Create a "virtual" post that uses translation data but keeps English slug
      const virtualPost: BlogPost = {
        ...eng,
        data: {
          ...eng.data,
          title: translation.data.title,
          description: translation.data.description,
          category: translation.data.category || eng.data.category,
          tags: translation.data.tags && translation.data.tags.length > 0
            ? translation.data.tags
            : eng.data.tags,
        },
      };
      result.push(virtualPost);
    } else {
      result.push(eng);
    }
  }

  return result.sort((a, b) => new Date(b.data.pubDate).getTime() - new Date(a.data.pubDate).getTime());
}

/**
 * Get a single blog post for a specific language.
 * Returns the translated post if available, otherwise the English post.
 */
export async function getBlogPost(lang: string, slug: string): Promise<BlogPost | undefined> {
  const allEnglish = await getCollection('blog');
  const engPost = allEnglish.find(p => p.slug === slug && !p.slug.includes('/'));
  if (!engPost) return undefined;

  if (lang === DEFAULT_LANG) return engPost;

  // Try to find a translation
  const allTranslations = await getCollection('blog-translations');
  const translation = allTranslations.find(
    t => t.data.lang === lang && t.data.originalSlug === slug
  );

  if (translation) {
    return {
      ...engPost,
      data: {
        ...engPost.data,
        title: translation.data.title,
        description: translation.data.description,
        category: translation.data.category || engPost.data.category,
        tags: translation.data.tags && translation.data.tags.length > 0
          ? translation.data.tags
          : engPost.data.tags,
      },
    };
  }

  return engPost;
}

/**
 * Get the rendered Content of a translated blog post.
 * Returns the translation's content if available, otherwise English content.
 */
export function getTranslationContent(
  engPost: BlogPost,
  translation?: BlogTranslation
): { Content: BlogPost['render'] extends Promise<infer T> ? T['Content'] : never; headings: any[] } {
  // This function is not async - the Content component comes from post.render()
  // We handle the translation rendering in the route pages
  return null as any;
}

/**
 * Extract the original slug from a potentially language-prefixed slug.
 */
export function getOriginalSlug(prefixedSlug: string): string {
  return prefixedSlug;
}

/**
 * Check if a blog post translation exists for a given language.
 */
export async function hasTranslation(lang: string, slug: string): Promise<boolean> {
  if (lang === DEFAULT_LANG) return true;
  const allTranslations = await getCollection('blog-translations');
  return allTranslations.some(t => t.data.lang === lang && t.data.originalSlug === slug);
}