#!/usr/bin/env node
// scripts/fix-color-mix-muted.mjs
//
// P2-1-R2 / 2026-10-16 — Bulk-replace `color: color-mix(in srgb, var(--theme-text) PCT%, transparent)`
// with `color: var(--text-muted)` for PCT < 70.  Patterns with PCT >= 70 retain
// enough contrast (>10:1 on white) to be left untouched.
//
// Safety: regex anchors on `color:\s*color-mix(...)` so it does NOT touch
//   - background-image / background-color (decorative uses of color-mix)
//   - border-color (borders are a different contrast concern)
//   - linear-gradient() values
//
// Usage:
//   node scripts/fix-color-mix-muted.mjs --files src/.../a.astro src/.../b.astro ...
//   # (no args = process Plan-B top-5 list declared below)
//
// Exit codes: 0 = changes applied (or none needed), 1 = nothing to do

import { readFileSync, writeFileSync } from 'node:fs';

const TOP5 = [
  'src/components/capabilities/ManufacturingPage.astro',
  'src/pages/titanium-cnc-machining-services/grade-2-titanium-cnc-machining.astro',
  'src/pages/titanium-cnc-machining-services/grade-5-titanium-cnc-machining.astro',
  'src/pages/standard-parts/index.astro',
  'src/components/capabilities/QualityPage.astro',
];

const args = process.argv.slice(2);
const files = (args.length ? args.slice(1) : TOP5).filter(a => !a.startsWith('--'));

const RE = /color:\s*color-mix\(\s*in srgb,\s*var\(--theme-text\)\s+(\d+)%\s*,\s*transparent\s*\)/g;

let totalReplaced = 0;
let totalKept = 0;
const perFile = [];

for (const f of files) {
  const text = readFileSync(f, 'utf8');
  let replaced = 0;
  let kept = 0;
  const out = text.replace(RE, (match, pctStr) => {
    const pct = parseInt(pctStr, 10);
    if (pct >= 70) {
      kept++;
      return match;
    }
    replaced++;
    return 'color: var(--text-muted)';
  });
  if (out !== text) writeFileSync(f, out, 'utf8');
  perFile.push({ file: f, replaced, kept });
  totalReplaced += replaced;
  totalKept += kept;
}

for (const { file, replaced, kept } of perFile) {
  console.log(`  ${file}: ${replaced} replaced, ${kept} kept (≥70%)`);
}
console.log(`\n  total: ${totalReplaced} replaced, ${totalKept} kept`);
if (totalReplaced === 0) process.exit(1);
