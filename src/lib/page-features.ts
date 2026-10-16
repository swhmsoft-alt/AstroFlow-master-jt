/**
 * src/lib/page-features.ts
 *
 * Per-page feature detection (currently: math/KaTeX usage).
 *
 * Used by BaseLayout.astro to gate the KaTeX CSS link — only pages
 * whose source file actually contains math syntax get the KaTeX
 * stylesheet. This eliminates ~24 KB of render-blocking CSS from
 * every page that does not need math (Phase P0-2, 2026-10-16).
 *
 * Implementation:
 *   - Build-time scan of `src/**\/*.{md,astro}` looking for math markers
 *     ($$ ... $$, \( ... \), \[ ... \], \begin{...})
 *   - Result cached at module load — single scan per `astro build`
 *   - Files map to URL prefixes (with i18n mirrors)
 *   - catch-all routes ([...slug]) map to their parent directory,
 *     so all variants of the catch-all get KaTeX (over-inclusion
 *     is bounded; under-inclusion would cause unstyled math → FOUC)
 *
 * False-positive rate is acceptable: the cost of shipping KaTeX
 * to a page that doesn't render math is one ~24 KB non-blocking
 * CSS file; the cost of missing a math page is broken rendering.
 */
import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();

// Match $$ ... $$ (display), \( ... \) (inline), \[ ... \] (display alt),
// or \begin{...} (LaTeX environments). Single-pass regex; no need to
// distinguish context (math vs. code block) because over-inclusion is OK.
const MATH_PATTERN = /\$\$|\\\(|\\\[|\\begin\{(?:equation|align|gather|multline|eqnarray|cases|matrix)\}/;

const I18N_LANGS = ['de', 'ja', 'fr', 'es', 'pt', 'it', 'ko', 'nl', 'pl', 'ru', 'ar'] as const;

let cachedMathPrefixes: Set<string> | null = null;

function filePathToUrlPrefixes(filePath: string): string[] {
  // Normalize to forward slashes
  const norm = filePath.replace(/\\/g, '/');
  const rel = norm.split('/src/').pop() ?? '';
  const out: string[] = [];

  // ── Markdown content collections ──
  // src/content/blog/<id>.md  →  /blog/<id>/ and i18n mirrors
  const blogMatch = rel.match(/^content\/blog\/([^/]+)\.md$/);
  if (blogMatch) {
    out.push(`/blog/${blogMatch[1]}/`);
    for (const lang of I18N_LANGS) out.push(`/${lang}/blog/${blogMatch[1]}/`);
    return out;
  }
  // src/content/blog-translations/<lang>/<id>.md  →  /<lang>/blog/<id>/
  const blogTrMatch = rel.match(/^content\/blog-translations\/([^/]+)\/([^/]+)\.md$/);
  if (blogTrMatch) {
    out.push(`/${blogTrMatch[1]}/blog/${blogTrMatch[2]}/`);
    return out;
  }
  // src/content/case-studies/<id>.md  →  /case-studies/<id>/ and i18n mirrors
  const caseMatch = rel.match(/^content\/case-studies\/([^/]+)\.md$/);
  if (caseMatch) {
    out.push(`/case-studies/${caseMatch[1]}/`);
    for (const lang of I18N_LANGS) out.push(`/${lang}/case-studies/${caseMatch[1]}/`);
    return out;
  }
  // src/content/pages/<id>.md  →  /<id>/ and i18n mirrors
  const pagesMatch = rel.match(/^content\/pages\/([^/]+)\.md$/);
  if (pagesMatch) {
    out.push(`/${pagesMatch[1]}/`);
    for (const lang of I18N_LANGS) out.push(`/${lang}/${pagesMatch[1]}/`);
    return out;
  }

  // ── .astro page files ──
  // src/pages/<path>/<file>.astro  →  /<path>/ (with i18n wrap if [lang]/)
  if (/^pages\/.+\.astro$/.test(rel)) {
    let urlPath = rel
      .replace(/^pages\//, '/')
      .replace(/\.astro$/, '')
      // [...slug] catch-all → use parent dir only
      .replace(/\/\[\.\.\.[^\]]+\]/g, '/')
      // [lang] i18n wrapper → drop it (EN is default, others are at /<lang>/)
      .replace(/\/\[lang\]/g, '')
      .replace(/\/+/g, '/');
    if (urlPath !== '/') urlPath = urlPath.replace(/\/+$/, '') + '/';
    out.push(urlPath);
    // If file lives under [lang]/, also add each i18n mirror at the same path
    if (/^pages\/\[lang\]\//.test(rel) || /\/\[lang\]\//.test(rel)) {
      // (URL already includes the /<lang>/ mirror since the [lang] wrapper
      //  was dropped but the page is reachable at both EN and i18n paths.
      //  Add EN prefix to the same path.)
      const enPath = rel
        .replace(/^pages\//, '/')
        .replace(/\.astro$/, '')
        .replace(/\/\[\.\.\.[^\]]+\]/g, '/')
        .replace(/\/\[lang\]/g, '')
        .replace(/\/+/g, '/')
        .replace(/\/+$/, '') + '/';
      out.push(enPath === '//' ? '/' : enPath);
    }
    return out;
  }

  return out;
}

function scanForMathPrefixes(): Set<string> {
  const set = new Set<string>();
  const skipDirs = new Set(['node_modules', 'dist', '.astro', '.git', '.history', 'derived']);
  function walk(dir: string) {
    let entries: fs.Dirent[];
    try {
      entries = fs.readdirSync(dir, { withFileTypes: true });
    } catch {
      return;
    }
    for (const entry of entries) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        if (skipDirs.has(entry.name)) continue;
        walk(full);
      } else if (/\.(md|astro)$/.test(entry.name)) {
        try {
          const content = fs.readFileSync(full, 'utf-8');
          if (MATH_PATTERN.test(content)) {
            for (const prefix of filePathToUrlPrefixes(full)) {
              if (prefix) set.add(prefix);
            }
          }
        } catch {
          // unreadable file — skip
        }
      }
    }
  }
  walk(path.join(ROOT, 'src'));
  return set;
}

export function getMathPrefixes(): Set<string> {
  if (!cachedMathPrefixes) cachedMathPrefixes = scanForMathPrefixes();
  return cachedMathPrefixes;
}

/**
 * True if the current page's content may render math (KaTeX).
 * Used to gate the KaTeX stylesheet link in BaseLayout.
 *
 * @param urlPath  Astro.url.pathname (already includes /<lang>/ prefix when applicable)
 */
export function pageNeedsMath(urlPath: string): boolean {
  const prefixes = getMathPrefixes();
  const norm = (urlPath || '/').replace(/\/+$/, '') || '/';
  for (const prefix of prefixes) {
    const p = prefix.replace(/\/+$/, '') || '/';
    if (norm === p || norm.startsWith(p + '/')) return true;
  }
  return false;
}
