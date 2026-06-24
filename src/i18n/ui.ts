/**
 * i18n UI Translation Dictionary
 *
 * en – English (default)
 * de – Deutsch
 *
 * Translations are loaded from JSON files in src/i18n/translations/
 * to keep this file small and avoid TypeScript type-inference issues
 * with large inline objects.
 */

import en from './translations/en.json';
import de from './translations/de.json';
import ja from './translations/ja.json';
import fr from './translations/fr.json';
import es from './translations/es.json';
import pt from './translations/pt.json';
import it from './translations/it.json';
import ko from './translations/ko.json';
import nl from './translations/nl.json';
import pl from './translations/pl.json';
import zh from './translations/zh.json';

export const LANGUAGES: Record<string, string> = {
  en: 'English',
  de: 'Deutsch',
  ja: '日本語',
  fr: 'Français',
  es: 'Español',
  pt: 'Português',
  it: 'Italiano',
  ko: '한국어',
  nl: 'Nederlands',
  pl: 'Polski',
  zh: '中文',
};

export const DEFAULT_LANG = 'en';

export type Lang = keyof typeof LANGUAGES;

export const UI: Record<Lang, Record<string, string>> = { en, de, ja, fr, es, pt, it, ko, nl, pl };
