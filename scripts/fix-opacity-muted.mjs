#!/usr/bin/env node
// scripts/fix-opacity-muted.mjs
//
// P2-1-R4 / 2026-10-16 — Bulk-fix `style="...; opacity: 0.X; ..."` on
// elements whose color is `var(--theme-text)` or `var(--theme-nav-text)`.
//
// The opacity-blend with bg drops contrast below 4.5:1 (AA). Strategy:
//   - Replace color: var(--theme-(text|nav-text)) → var(--text-muted)
//   - Remove the opacity: 0.X declaration (since --text-muted is already pre-tuned
//     to clear AA, opacity would re-degrade it).
//
// React TSX support: same regex extended to capture `style={{ color: 'var(--theme-text)',
// opacity: 0.5 }}` JSX literal.
//
// Usage:
//   node scripts/fix-opacity-muted.mjs --files file1 file2 ...
//   (no args = top-5 most-frequent opacity files)

import { readFileSync, writeFileSync } from 'node:fs';

const TOP = [
  'src/components/about/AboutPage.astro',
  'src/components/legal/PrivacyPolicy.astro',
  'src/components/legal/TermsOfService.astro',
  'src/components/legal/CookiePolicy.astro',
  'src/pages/author/garrett-liu.astro',
];

const args = process.argv.slice(2);
const files = (args.length ? args.slice(1) : TOP).filter(a => !a.startsWith('--'));

let totalFixed = 0;
const perFile = [];

// Pattern A: Astro inline style="...color: var(--theme-text); opacity: 0.X..."
//            Color appears BEFORE opacity, in `style="..."` double-quoted string.
//            CRITICAL: `[^"]*?` (not `[\s\S]*?`) prevents the regex from
//            spanning across HTML elements.  Many astro/svg blocks contain
//            nested attrs with their own quotes that can swallow subsequent
//            lines; `[^"]*?` enforces stay-within-one-`style="..."` attribute.
const PAT_ASTRO = /style="([^"]*?color:\s*var\(--theme-(?:text|nav-text)\)\s*;?)([^"]*?opacity:\s*0\.\d+\s*;?)([^"]*?)"/g;

// Pattern B: React JSX object — style={{ color: 'var(--theme-text)', opacity: 0.X, ... }}
//            `[^}{]*?` instead of `[^{}]*?` for the same safety reason.
//            Crucially, group 1 includes the trailing `,` after the color
//            string so we don't lose property separation.
const PAT_REACT = /(\{[^}{]*?color:\s*['"]var\(--theme-(?:text|nav-text)\)['"],)([^}{]*?opacity:\s*0\.\d+,?\s*)([^}{]*?)(\})/g;

for (const f of files) {
  const text = readFileSync(f, 'utf8');
  let fileFixed = 0;
  let out = text;

  // ── Astro: replace color + remove opacity in a single pass.
  //    Use lookahead `(?=\s|;|$)` so the trailing `;` stays intact (we drop
  //    opacity but keep the style boundary semicolon).
  out = out.replace(PAT_ASTRO, (m, prefix, _opacityFull, suffix) => {
    const cleanedPrefix = prefix.replace(
      /color:\s*var\(--theme-(?:text|nav-text)\)(?=\s*[;,]|\s*$)/,
      'color: var(--text-muted)'
    );
    fileFixed++;
    return `style="${cleanedPrefix}${suffix}"`;
  });

  // ── React JSX with explicit color: replace quoted color value, drop opacity.
  //    Group 1 already contains the trailing `,`, so we don't need to add one.
  out = out.replace(PAT_REACT, (m, colorPart, _opacityFull, mid, end) => {
    const cleanedColor = colorPart.replace(
      /var\(--theme-(?:text|nav-text)\)/,
      'var(--text-muted)'
    );
    fileFixed++;
    return `${cleanedColor}${mid}${end}`;
  });

  // ── React JSX with opacity only (inherits theme-text). Strip opacity AND
  //    add explicit color: 'var(--text-muted)' override.
  //    Regex anchors: `[^}{]*?` keeps match within a single {…} expression.
  out = out.replace(/style=\{\{([^}{]*?)opacity:\s*0\.\d+,?\s*([^}{]*?)\}\}/g, (m, before, after) => {
    fileFixed++;
    const b = before.trim().replace(/,\s*$/, '');
    const a = after.trim().replace(/^\s*,\s*/, '').replace(/,\s*$/, '');
    const inner = ['color: \'var(--text-muted)\'', b, a].filter(Boolean).join(', ');
    return `style={{${inner}}}`;
  });

  if (out !== text) writeFileSync(f, out, 'utf8');
  perFile.push({ file: f, fixed: fileFixed });
  totalFixed += fileFixed;
}

for (const { file, fixed } of perFile) {
  console.log(`  ${file}: ${fixed} fixed`);
}
console.log(`\n  total: ${totalFixed}`);
if (totalFixed === 0) process.exit(1);
