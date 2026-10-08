/**
 * strip-html.ts
 *
 * Pure utility — strips HTML tags + decodes the most common entities, then
 * collapses whitespace. Used to convert a rich-text FAQ answer (which may
 * contain `<strong>`, `<code>`, `<br>`) into the plain-text payload that
 * schema.org FAQPage.Answer expects (Google structured-data spec, 2024+).
 *
 * Why a hand-rolled stripper (not `DOMPurify` / `cheerio` / etc.):
 *   - Avoids pulling a 50 KB runtime into the SSR/Astro bundle
 *   - The FAQ answerHtml values are authored in-repo — we are NOT rendering
 *     arbitrary user-supplied HTML, so the threat surface is minimal
 *   - The schema payload is plain text; even partial matching (e.g. leftover
 *     `&nbsp;`) is acceptable to Google — see SPEC.md §3
 *
 * If you ever wire this to user-generated content (forum, comments), REPLACE
 * with a vetted sanitizer. This util is for trusted authored strings only.
 */
const HTML_TAG_RE = /<\/?[a-zA-Z][^>]*>/g;
const HTML_ENTITY_MAP: Readonly<Record<string, string>> = {
  '&amp;': '&',
  '&lt;': '<',
  '&gt;': '>',
  '&quot;': '"',
  '&apos;': "'",
  '&nbsp;': ' ',
  '&ndash;': '–',
  '&mdash;': '—',
  '&hellip;': '…',
  '&rsquo;': '\u2019',
  '&lsquo;': '\u2018',
  '&rdquo;': '\u201D',
  '&ldquo;': '\u201C',
  '&deg;': '°',
  '&micro;': 'µ',
  '&plusmn;': '±',
  '&times;': '×',
  '&sup2;': '2',
  '&sup3;': '3',
  '&frac14;': '¼',
  '&frac12;': '½',
  '&frac34;': '¾',
  '&reg;': '®',
  '&copy;': '©',
  '&trade;': '™',
};
const ENTITY_RE = /&(?:[a-zA-Z]+|#\d+|#x[0-9a-fA-F]+);/g;

function decodeEntity(entity: string): string {
  if (entity.startsWith('&#x')) {
    const code = parseInt(entity.slice(3, -1), 16);
    return Number.isFinite(code) ? String.fromCodePoint(code) : '';
  }
  if (entity.startsWith('&#')) {
    const code = parseInt(entity.slice(2, -1), 10);
    return Number.isFinite(code) ? String.fromCodePoint(code) : '';
  }
  return HTML_ENTITY_MAP[entity] ?? entity;
}

export function stripHtml(input: string): string {
  if (!input) return '';
  const noEntities = input.replace(ENTITY_RE, decodeEntity);
  const noMarkup = noEntities.replace(HTML_TAG_RE, ' ');
  return noMarkup.replace(/\s+/g, ' ').trim();
}

/**
 * Escape user-supplied search terms so the `RegExp` constructor never
 * receives a raw pattern. Always pass the search field through this util
 * before building a regex.
 */
export function escapeRegExp(input: string): string {
  return input.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Split a plain string into an array of segments where matches are flagged.
 * Use for safe `<mark>` wrapping in question text (no HTML in question —
 * safe to render).
 */
export interface HighlightSegment {
  text: string;
  match: boolean;
}

export function highlightSegments(
  text: string,
  query: string,
): readonly HighlightSegment[] {
  const trimmed = query.trim();
  if (!trimmed) return [{ text: text, match: false }];
  // Split with a capture group so matches are interleaved as odd-indexed entries.
  const re = new RegExp(`(${escapeRegExp(trimmed)})`, 'gi');
  const lowerNeedle = trimmed.toLowerCase();
  const parts = text.split(re);
  return parts
    .filter((p) => p.length > 0)
    .map((p) => ({ text: p, match: p.toLowerCase() === lowerNeedle }));
}