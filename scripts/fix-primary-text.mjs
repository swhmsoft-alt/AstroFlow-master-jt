#!/usr/bin/env node
// scripts/fix-primary-text.mjs
//
// P2-1-R6 / 2026-10-16 — Bulk-fix text uses of `var(--theme-primary)`.
//
// Three light themes (light-beige, warm-modern-beige, pure-bw-orange) have
// --theme-primary colors that fail WCAG AA on white-ish backgrounds:
//   light-beige:           #38BDF8 on #FAFAFA = 1.95:1 (FAIL)
//   warm-modern-beige:     #B87333 on #F5F0E8 = 3.4:1  (FAIL)
//   pure-bw-orange:        #FF5A00 on #FFFFFF = 3.4:1  (FAIL)
//
// R6 added `--primary-strong` token to each theme (≥4.5:1 vs bg/surface).
// This script swaps inline `color: var(--theme-primary)` → `color: var(--primary-strong)`
// in top offender files, while leaving background-color / border / fill uses
// untouched (those don't have text-contrast concerns).
//
// React TSX support: same regex extended to capture `color: 'var(--theme-primary)'`
// JSX literal.
//
// Usage:
//   node scripts/fix-primary-text.mjs --files file1 file2 ...

import { readFileSync, writeFileSync } from 'node:fs';

const args = process.argv.slice(2);
const files = (args.length ? args.slice(1) : []).filter(a => !a.startsWith('--'));

// Pattern A: Astro inline style="... color: var(--theme-primary);..."
//            `color:` must be the property being set, not part of another property.
const PAT_ASTRO_COLOR = /\bcolor:\s*var\(--theme-primary\)/g;

// Pattern B: React JSX — `color: 'var(--theme-primary)'`
const PAT_REACT_COLOR = /\bcolor:\s*['"]var\(--theme-primary\)['"]/g;

let totalFixed = 0;
const perFile = [];

for (const f of files) {
  const text = readFileSync(f, 'utf8');
  let fileFixed = 0;
  let out = text;

  // Astro style="..."
  out = out.replace(PAT_ASTRO_COLOR, () => {
    fileFixed++;
    return 'color: var(--primary-strong)';
  });

  // React JSX style={{...}}
  out = out.replace(PAT_REACT_COLOR, (m) => {
    fileFixed++;
    // Preserve ' or " quoting style — infer from match
    const quote = m.includes(`'`) ? `'` : `"`;
    return `color: ${quote}var(--primary-strong)${quote}`;
  });

  if (out !== text) writeFileSync(f, out, 'utf8');
  perFile.push({ file: f, fixed: fileFixed });
  totalFixed += fileFixed;
}

for (const { file, fixed } of perFile) {
  console.log(`  ${file}: ${fixed} replaced`);
}
console.log(`\n  total: ${totalFixed}`);
if (totalFixed === 0) process.exit(1);
