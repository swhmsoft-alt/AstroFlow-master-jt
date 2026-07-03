/**
 * Product i18n utility functions.
 *
 * Uses two collections:
 *  - 'products' (English source files in src/content/products/)
 *  - 'productTranslations' (translated files in src/content/product-translations/{lang}-{slug}.md)
 *
 * Translated files have frontmatter fields: lang, originalSlug, plus translated title/description etc.
 * When no translation exists, falls back to the English source.
 */

import { getCollection, type CollectionEntry } from 'astro:content';
import { LANGUAGES, DEFAULT_LANG } from '../i18n/ui';

type ProductEntry = CollectionEntry<'products'>;
type ProductTranslation = CollectionEntry<'product-translations'>;

const SUPPORTED_LANGS = new Set(Object.keys(LANGUAGES));

/**
 * Get all products for a specific language.
 * For 'en' (DEFAULT_LANG), returns original English products.
 * For other languages, returns translated data if available, falling back to English.
 */
export async function getProducts(lang: string): Promise<ProductEntry[]> {
  const allEnglish = await getCollection('products');
  const allEnglishSorted = [...allEnglish].sort(
    (a, b) => (a.data.order || 0) - (b.data.order || 0)
  );

  if (lang === DEFAULT_LANG) {
    return allEnglishSorted;
  }

  // For non-English: get translations and map them to "virtual" products
  const allTranslations = await getCollection('product-translations');
  const langTranslations = allTranslations.filter(t => t.data.lang === lang);

  // Create a map: originalSlug -> translation
  const translationMap = new Map<string, ProductTranslation>();
  for (const t of langTranslations) {
    translationMap.set(t.data.originalSlug, t);
  }

  // For each English product, return translation if available, otherwise English
  const result: ProductEntry[] = [];
  for (const eng of allEnglishSorted) {
    const translation = translationMap.get(eng.slug);
    if (translation) {
      // Create a "virtual" product that uses translated data
      const virtualProduct: ProductEntry = {
        ...eng,
        data: {
          ...eng.data,
          title: translation.data.title,
          description: translation.data.description,
          category: translation.data.category,
          gallery: translation.data.gallery,
          specs: translation.data.specs,
          btnText: translation.data.btnText,
          btnLink: translation.data.btnLink,
          seoTitle: translation.data.seoTitle || eng.data.seoTitle,
          seoDescription: translation.data.seoDescription || eng.data.seoDescription,
        },
      };
      result.push(virtualProduct);
    } else {
      result.push(eng);
    }
  }

  return result;
}

/**
 * Get a single product for a specific language.
 * Returns the translated product if available, otherwise the English product.
 */
export async function getProduct(lang: string, slug: string): Promise<{
  product: ProductEntry;
  translationEntry?: ProductTranslation;
} | undefined> {
  const allEnglish = await getCollection('products');
  const engProduct = allEnglish.find(p => p.slug === slug);
  if (!engProduct) return undefined;

  if (lang === DEFAULT_LANG) {
    return { product: engProduct };
  }

  // Try to find a translation
  const allTranslations = await getCollection('product-translations');
  const translation = allTranslations.find(
    t => t.data.lang === lang && t.data.originalSlug === slug
  );

  if (translation) {
    const virtualProduct: ProductEntry = {
      ...engProduct,
      data: {
        ...engProduct.data,
        title: translation.data.title,
        description: translation.data.description,
        category: translation.data.category,
        gallery: translation.data.gallery,
        specs: translation.data.specs,
        btnText: translation.data.btnText,
        btnLink: translation.data.btnLink,
        seoTitle: translation.data.seoTitle || engProduct.data.seoTitle,
        seoDescription: translation.data.seoDescription || engProduct.data.seoDescription,
      },
    };
    return { product: virtualProduct, translationEntry: translation };
  }

  return { product: engProduct };
}

/**
 * Get the rendered Content of a translated product.
 * Returns the translation's render if available, otherwise English render.
 */
export function getRenderEntry(
  engProduct: ProductEntry,
  translation?: ProductTranslation
): ProductEntry | ProductTranslation {
  return translation || engProduct;
}

/**
 * Check if a product translation exists for a given language.
 */
export async function hasProductTranslation(lang: string, slug: string): Promise<boolean> {
  if (lang === DEFAULT_LANG) return true;
  const allTranslations = await getCollection('product-translations');
  return allTranslations.some(t => t.data.lang === lang && t.data.originalSlug === slug);
}