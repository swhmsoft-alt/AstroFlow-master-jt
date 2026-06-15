/**
 * i18n Utility Functions
 *
 * Server-side helpers for Astro pages and components:
 *  - getLangFromUrl(Astro.url)    → extract current lang code
 *  - useTranslations(lang)        → returns t() function for that lang
 *  - localizePath(path, lang)     → prepend lang prefix if not default
 *  - removeLangPrefix(path)       → strip lang prefix to get canonical path
 */

import { UI, DEFAULT_LANG, type Lang } from './ui';

const SUPPORTED_LANGS = new Set(Object.keys(UI));

/**
 * Extract the language code from an Astro URL.
 *
 * Examples:
 *   /en/services  → 'en'
 *   /zh/services  → 'zh'
 *   /services     → 'en'   (default because prefixDefaultLocale=false)
 */
export function getLangFromUrl(url: URL): Lang {
  const parts = url.pathname.split('/').filter(Boolean);
  if (parts.length > 0 && SUPPORTED_LANGS.has(parts[0])) {
    return parts[0] as Lang;
  }
  return DEFAULT_LANG;
}

/**
 * Return a t(key) translation function for the given locale.
 *
 * Usage in Astro frontmatter:
 *   const t = useTranslations(lang);
 *   t('nav.home')   → "Home" / "首页" / "Startseite"
 */
export function useTranslations(lang: Lang): (key: string) => string {
  return function t(key: string): string {
    return UI[lang]?.[key] ?? UI[DEFAULT_LANG]?.[key] ?? key;
  };
}

/**
 * Prepend the language prefix to a canonical path.
 *
 * For default language (en with prefixDefaultLocale=false), returns path as-is.
 * For other languages, prepends /zh or /de.
 *
 * Examples:
 *   localizePath('/services', 'en')  → '/services'
 *   localizePath('/services', 'zh')  → '/zh/services'
 *   localizePath('/', 'de')          → '/de/'
 */
export function localizePath(path: string, lang: Lang): string {
  if (lang === DEFAULT_LANG) return path;
  const normalized = path.startsWith('/') ? path : `/${path}`;
  return `/${lang}${normalized}`;
}

/**
 * Strip the language prefix from a localized URL path.
 *
 *   removeLangPrefix('/zh/services')  → '/services'
 *   removeLangPrefix('/en/services')  → '/services'
 *   removeLangPrefix('/services')     → '/services'
 */
export function removeLangPrefix(pathname: string): string {
  const parts = pathname.split('/').filter(Boolean);
  if (parts.length > 0 && SUPPORTED_LANGS.has(parts[0])) {
    return '/' + parts.slice(1).join('/');
  }
  return pathname;
}

/**
 * Get all alternate language URLs for the current path.
 * Used for <link rel="alternate" hreflang="..." /> in SEO head.
 */
export function getAlternateLinks(currentPathname: string): Array<{ lang: string; href: string }> {
  const canonical = removeLangPrefix(currentPathname);
  return (Object.keys(UI) as Lang[]).map((lang) => ({
    lang,
    href: lang === DEFAULT_LANG ? canonical : `/${lang}${canonical === '/' ? '' : canonical}`,
  }));
}
