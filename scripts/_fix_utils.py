with open('src/i18n/utils.ts','r',encoding='utf-8') as f:
    content = f.read()

old_func = '''export function useTranslations(lang: Lang): (key: string) => string {
  return function t(key: string): string {
    return UI[lang]?.[key] ?? UI[DEFAULT_LANG]?.[key] ?? key;
  };
}'''

new_txt = '''export function useTranslations(lang: Lang): (key: string) => string {
  return function t(key: string): string {
    return UI[lang]?.[key] ?? UI[DEFAULT_LANG]?.[key] ?? key;
  };
}

/**
 * Like useTranslations, but returns null (instead of the raw key)
 * when the key is missing in both the current language and the default.
 *
 * This is useful for conditional fallback logic in page frontmatter:
 *
 *   const tOrNull = useTOrNull(lang);
 *   const h1 = tOrNull('hero.home.h1')
 *     ?? FALLBACK_TEMPLATES[lang]?.h1
 *     ?? heroEntry?.h1;
 */
export function useTOrNull(lang: Lang): (key: string) => string | null {
  return function tOrNull(key: string): string | null {
    const val = UI[lang]?.[key];
    if (val !== undefined) return val;
    const fallback = UI[DEFAULT_LANG]?.[key];
    if (fallback !== undefined) return fallback;
    return null;
  };
}'''

count = content.count(old_func)
if count == 1:
    content = content.replace(old_func, new_txt, 1)
    with open('src/i18n/utils.ts','w',encoding='utf-8') as f:
        f.write(content)
    print('SUCCESS: useTOrNull added')
else:
    print(f'FAIL: found {count} occurrences')
