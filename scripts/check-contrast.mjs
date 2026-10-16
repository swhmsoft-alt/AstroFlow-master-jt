#!/usr/bin/env node
// scripts/check-contrast.mjs
//
// P2-1 / 2026-10-16 — Contrast audit for production HTML (WCAG AA ≥ 4.5:1).
//
// Scans dist/**/*.html for two systemic anti-patterns:
//   1. `opacity: 0.x` on elements whose color is `--theme-text` (final color
//      is blended with the page background, often dropping well below 4.5:1)
//   2. `color: color-mix(in srgb, var(--theme-text) XX%, transparent)` —
//      same root cause: alpha-fade text without contrast guarantee.
//
// Default theme audited: `aerospace-precision` (DARK — `:root` default),
// which is the theme Lighthouse and axe-core see in production. Other
// themes can be audited by extending `THEME_TOKENS` below.
//
// Pure stdlib (node:fs / node:path) — no extra deps required.
//
// Usage:
//   node scripts/check-contrast.mjs                 # exit 1 if any < 4.5:1
//   node scripts/check-contrast.mjs --target 7      # AAA threshold
//   node scripts/check-contrast.mjs --theme light-beige
//
// Exit codes:
//   0 = pass (no offenders or already documented)
//   1 = at least one offender below target

import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const PROJECT_ROOT = resolve(__dirname, '..');
const DIST = join(PROJECT_ROOT, 'dist');

// ── CLI flags ──
const args = process.argv.slice(2);
let target = 4.5;
let themeName = 'pure-bw-orange';   // P2-1: production default (white bg + brand orange)
let showFix = true;
for (let i = 0; i < args.length; i++) {
  if (args[i] === '--target') target = parseFloat(args[++i]);
  if (args[i] === '--theme') themeName = args[++i];
  if (args[i] === '--no-fix') showFix = false;
}

// ── Theme tokens (must mirror src/styles/global.css) ──
const THEME_TOKENS = {
  'aerospace-precision': { bg: '#0F172A', surface: '#1E293B', text: '#F8FAFC' },
  'light-beige':         { bg: '#FAFAFA', surface: '#FFFFFF', text: '#1E293B' },
  'cold-titanium-steel': { bg: '#1B2533', surface: '#2A3441', text: '#E8ECEF' },
  'aerospace-gold':      { bg: '#0A1929', surface: '#14233D', text: '#F5F7FA' },
  'warm-modern-beige':   { bg: '#F5F0E8', surface: '#FAF6EC', text: '#2B2520' },
  'pure-bw-orange':      { bg: '#FFFFFF', surface: '#F5F5F5', text: '#0A0A0A' },
};
if (!THEME_TOKENS[themeName]) {
  console.error(`Unknown theme: ${themeName}. Known: ${Object.keys(THEME_TOKENS).join(', ')}`);
  process.exit(2);
}
const theme = THEME_TOKENS[themeName];
const TEXT_MUTED = {  // P2-1 token values from src/styles/global.css
  'aerospace-precision': '#94A3B8', 'light-beige': '#475569',
  'cold-titanium-steel': '#BCC4CC', 'aerospace-gold': '#B8C5D1',
  'warm-modern-beige':   '#6B5B50', 'pure-bw-orange': '#525252',
};

// ── Color math (sRGB; matches browser compositing for `opacity` & `color-mix(.. transparent)`) ──
function hexToRgb(hex) {
  const x = hex.replace('#', '');
  return [parseInt(x.slice(0, 2), 16), parseInt(x.slice(2, 4), 16), parseInt(x.slice(4, 6), 16)];
}

function relLum([r, g, b]) {
  const f = (c) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  };
  return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
}

function contrastRatio(hexA, hexB) {
  const la = relLum(hexToRgb(hexA));
  const lb = relLum(hexToRgb(hexB));
  const [hi, lo] = la > lb ? [la, lb] : [lb, la];
  return (hi + 0.05) / (lo + 0.05);
}

function alphaBlend(fgHex, alpha, bgHex) {
  const [fr, fg, fb] = hexToRgb(fgHex);
  const [br, bgc, bb] = hexToRgb(bgHex);
  const toHex = (n) => Math.round(n).toString(16).padStart(2, '0');
  return '#' + toHex(fr * alpha + br * (1 - alpha))
              + toHex(fg * alpha + bgc * (1 - alpha))
              + toHex(fb * alpha + bb * (1 - alpha));
}

// ── Walk dist/**/*.html ──
function walk(dir, re) {
  const out = [];
  for (const e of readdirSync(dir)) {
    const p = join(dir, e);
    const s = statSync(p);
    if (s.isDirectory()) out.push(...walk(p, re));
    else if (re.test(p)) out.push(p);
  }
  return out;
}

const htmlFiles = walk(DIST, /\.html$/);

// ── Scan each HTML for the two anti-patterns ──
const offenders = [];
const STATS = {
  opacityOnThemeText: 0,
  colorMixTextPct:    0,
  fixedByToken:       0,
};

for (const filepath of htmlFiles) {
  const text = readFileSync(filepath, 'utf8');

  // Pattern 1: inline `opacity: 0.Xx` on a style that also declares
  //            `color: var(--theme-text)` (alpha-faded theme text).
  // Notes: matches 'opacity: 0.55', 'opacity:0.55', 'opacity: 0.3', etc.
  const opRe = /style="([^"]*(?:color:\s*var\(--theme-text\)|background-color:\s*var\(--theme-(bg|surface)\))[^"]*opacity:\s*0\.(\d+)[^"]*)"/g;
  let m;
  while ((m = opRe.exec(text)) !== null) {
    const styleInline = m[1];
    const bgVar = m[2];  // 'bg' | 'surface' | undefined
    const opacity = parseFloat(`0.${m[3]}`);
    const fg = theme.text;
    const bg = bgVar === 'surface' ? theme.surface : theme.bg;

    // effective fg color after alpha-composite with bg
    const eff = alphaBlend(fg, opacity, bg);
    const ratio = contrastRatio(eff, bg);

    STATS.opacityOnThemeText++;
    if (ratio < target) {
      offenders.push({
        file: relative(PROJECT_ROOT, filepath),
        offset: m.index,
        style: styleInline.trim().slice(0, 200),
        fg, bg, eff, opacity, ratio,
      });
    }
  }

  // Pattern 2: `color-mix(in srgb, var(--theme-text) XX%, transparent)`
  //            — treat XX% as alpha, blend over nearest bg ancestor.
  const mixRe = /style="([^"]*color:\s*color-mix\(in srgb,\s*var\(--theme-text\)\s+(\d+)%,\s*transparent\)[^"]*)"/g;
  while ((m = mixRe.exec(text)) !== null) {
    const styleInline = m[1];
    const pct = parseInt(m[2], 10);
    // heuristic: bg is the section's bg color (--theme-bg by default unless
    // an ancestor style says otherwise). simple parse for now:
    const bg = /\bbackground-color:\s*var\(--theme-surface\)/.test(styleInline) ? theme.surface : theme.bg;

    const eff = alphaBlend(theme.text, pct / 100, bg);
    const ratio = contrastRatio(eff, bg);

    STATS.colorMixTextPct++;
    if (ratio < target) {
      offenders.push({
        file: relative(PROJECT_ROOT, filepath),
        offset: m.index,
        style: styleInline.trim().slice(0, 200),
        fg: theme.text, bg, eff, opacity: pct / 100, ratio,
      });
    }
  }
}

// ── Report ──
const fileCount = htmlFiles.length;
console.log(`\ncontrast check [theme=${themeName}, target=${target}:1]`);
console.log(`  scanned:   ${fileCount} HTML files`);
console.log(`  offenders: ${offenders.length} < ${target}:1 contrast`);
console.log(`  (${STATS.opacityOnThemeText} opacity-faded-text + ${STATS.colorMixTextPct} color-mix-faded-text instances examined)`);

if (offenders.length === 0) {
  console.log('  ✓ all measured elements pass WCAG AA contrast.');
  process.exit(0);
}

// Bucket by file
const byFile = offenders.reduce((m, o) => {
  (m[o.file] = m[o.file] || []).push(o);
  return m;
}, {});

console.log('\nOffenders (sorted by file):');
for (const [f, list] of Object.entries(byFile).sort()) {
  console.log(`\n  ${f}  (${list.length})`);
  for (const o of list.slice(0, 5)) {
    console.log(`    ratio=${o.ratio.toFixed(2)}:1  fg=${o.fg}→${o.eff} on bg=${o.bg}  opacity=${o.opacity}`);
    if (showFix) {
      const fixed = alphaBlend(TEXT_MUTED[themeName], 1, o.bg);
      const fixRatio = contrastRatio(fixed, o.bg);
      console.log(`      fix: replace with color: var(--text-muted) (${TEXT_MUTED[themeName]}) → ${fixRatio.toFixed(2)}:1 ${fixRatio >= target ? '✓' : '✗ (verify token)'}`);
    }
    console.log(`      style: ${o.style.slice(0, 140)}${o.style.length > 140 ? '…' : ''}`);
  }
  if (list.length > 5) console.log(`    …and ${list.length - 5} more`);
}

// ── Apply P2-1 token fix and report synthetic pass count ──
const fixedRatio = contrastRatio(TEXT_MUTED[themeName], theme.bg);
console.log(`\ntoken audit [--text-muted=${TEXT_MUTED[themeName]} on --theme-bg=${theme.bg}]: ${fixedRatio.toFixed(2)}:1 ${fixedRatio >= target ? '✓ pass' : '✗ FAIL — token too dim, pick darker shade'}`);
if (target > 4.5 && fixedRatio < target) {
  console.error(`\nERROR: --text-muted token does not meet AAA (${target}:1) on this theme — adjust in src/styles/global.css`);
  process.exit(1);
}

console.log(`\nexit 1: ${offenders.length} offenders below ${target}:1 — fix by replacing ` +
            `\`color: var(--theme-text); opacity: 0.xx;\` / \`color-mix(... var(--theme-text) XX%, transparent)\` ` +
            `with \`color: var(--text-muted);\` (already done in Footer.astro as of P2-1).\n`);
process.exit(1);
