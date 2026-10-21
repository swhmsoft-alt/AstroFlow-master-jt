// scripts/check-hover-classes.mjs — Hover class completeness gate
//
// Purpose: `scripts/cleanup-onmouseover.mjs` rewrites inline
// `onmouseover`/`onmouseout` handlers into `hover-*` utility classes.
// The script performs NO check that the classes it emits actually exist in
// `src/styles/hover-utilities.css`. A gap there silently produces markup
// whose hover effect does nothing — the inline handler is gone AND the CSS
// rule was never written, so the element just stops responding to hover.
//
// This gate closes that loop: it diffs every `hover-*` token referenced in
// `src/**` against every selector defined in hover-utilities.css, and exits
// non-zero when any referenced class has no rule.
//
// Usage:
//   node scripts/check-hover-classes.mjs
//
// Exit codes:
//   0 — every referenced class is defined
//   1 — one or more referenced classes have no CSS rule

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SRC = path.join(ROOT, 'src');
const CSS_FILE = path.join(SRC, 'styles', 'hover-utilities.css');

const SKIP_DIRS = new Set(['node_modules', 'dist', '.astro', '.git', '.kilo']);
const SCAN_EXT = new Set(['.astro', '.tsx', '.ts', '.jsx', '.js']);

// Matches class names such as `hover-bg-5`, `hover-cta-lift-translate`.
// `\w` does not match `-`, so the token must be built from explicit
// character classes or truncated names leak into results.
const CLASS_TOKEN = /hover-[a-z0-9]+(?:-[a-z0-9]+)*/g;

function walk(dir, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (SKIP_DIRS.has(entry.name)) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, out);
    else if (entry.isFile() && SCAN_EXT.has(path.extname(entry.name))) out.push(full);
  }
  return out;
}

function collectUsed() {
  const usage = new Map();
  for (const file of walk(SRC)) {
    const text = fs.readFileSync(file, 'utf-8');
    const seenInFile = new Set();
    for (const match of text.matchAll(CLASS_TOKEN)) {
      const cls = match[0];
      if (seenInFile.has(cls)) continue;
      seenInFile.add(cls);
      if (!usage.has(cls)) usage.set(cls, []);
      usage.get(cls).push(path.relative(ROOT, file));
    }
  }
  return usage;
}

function collectDefined() {
  if (!fs.existsSync(CSS_FILE)) {
    console.error(`FATAL: ${path.relative(ROOT, CSS_FILE)} not found.`);
    process.exit(1);
  }
  const css = fs.readFileSync(CSS_FILE, 'utf-8');
  const defined = new Set();
  // Selectors look like `.hover-card:hover` or `.hover-bar,` — capture the
  // class token that directly follows the dot.
  for (const match of css.matchAll(/\.(hover-[a-z0-9]+(?:-[a-z0-9]+)*)/g)) {
    defined.add(match[1]);
  }
  return defined;
}

const used = collectUsed();
const defined = collectDefined();

const missing = [...used.entries()]
  .filter(([cls]) => !defined.has(cls))
  .sort((a, b) => b[1].length - a[1].length || a[0].localeCompare(b[0]));

// Unused-but-defined is informational only: the migration script may emit a
// class that no page currently renders. Not an error.
const unused = [...defined].filter((cls) => !used.has(cls)).sort();

console.log('Hover class completeness check');
console.log(`  referenced in src : ${used.size}`);
console.log(`  defined in CSS    : ${defined.size}`);
console.log(`  unused in src     : ${unused.length}${unused.length ? ' (informational)' : ''}`);

if (missing.length === 0) {
  console.log('\n  PASS — every referenced hover-* class has a CSS rule.');
  process.exit(0);
}

console.log(`\n  FAIL — ${missing.length} referenced class(es) have no CSS rule:\n`);
for (const [cls, files] of missing) {
  console.log(`    .${cls}  (${files.length} file${files.length === 1 ? '' : 's'})`);
  for (const f of files.slice(0, 3)) console.log(`        ${f}`);
  if (files.length > 3) console.log(`        ... +${files.length - 3} more`);
}
console.log('\n  Add the missing rules to src/styles/hover-utilities.css.');
process.exit(1);