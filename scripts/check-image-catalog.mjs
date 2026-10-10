#!/usr/bin/env node
/**
 * check-image-catalog.mjs
 *
 * Three-way consistency check for the image-catalog placeholder system.
 *
 *   1. catalog  ↔  filesystem
 *        For every entry in src/content/image-catalog.json, verify that
 *        public/images/hubs/{category}/{filename}.{webp,png,svg} exists.
 *
 *   2. catalog  ↔  page references
 *        For every <ImageTextSplit catalogId="..."> in src/pages/**.astro,
 *        verify the catalogId exists in the catalog.  Flag any catalog
 *        entries that no page references (orphans).
 *
 *   3. page refs  ↔  legacy imageSrc
 *        Legacy `imageSrc="/uploads/..."` and `imageAlt="..."` on
 *        <ImageTextSplit> should be fully replaced by `catalogId`.  Any
 *        remaining ones are reported as migration debt.
 *
 * Exit codes:
 *   0 — clean
 *   1 — at least one real image missing  (build should fail)
 *   2 — only structural drift (orphan catalog / dangling page ref /
 *       legacy imageSrc still present) — informational, not blocking.
 */
import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join, relative, sep } from 'node:path';

const ROOT = process.cwd();
const CATALOG_PATH = join(ROOT, 'src', 'content', 'image-catalog.json');
const PAGES_ROOT = join(ROOT, 'src', 'pages');
const PUBLIC_ROOT = join(ROOT, 'public');

// ---------- 1. Load catalog ----------
const catalog = JSON.parse(readFileSync(CATALOG_PATH, 'utf-8'));
const catalogIds = new Set(catalog.images.map((e) => e.id));
const catalogById = Object.fromEntries(catalog.images.map((e) => [e.id, e]));

// ---------- 2. Walk pages and collect ImageTextSplit references ----------
function walk(dir) {
  const out = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    const st = statSync(full);
    if (st.isDirectory()) {
      if (entry.startsWith('.')) continue;
      out.push(...walk(full));
    } else if (entry.endsWith('.astro')) {
      out.push(full);
    }
  }
  return out;
}

const pageRefCount = new Map();     // catalogId -> number of page references
const legacyRefs = [];              // [{ file, kind, value }]
const unknownCatalogIds = new Set();

const CATALOG_ID_RE = /catalogId\s*=\s*"([^"]+)"/g;
const IMAGE_SRC_RE = /imageSrc\s*=\s*"([^"]+)"/g;
const IMAGE_ALT_RE = /imageAlt\s*=\s*"([^"]+)"/g;

for (const file of walk(PAGES_ROOT)) {
  const src = readFileSync(file, 'utf-8');
  let m;
  while ((m = CATALOG_ID_RE.exec(src))) {
    const id = m[1];
    pageRefCount.set(id, (pageRefCount.get(id) ?? 0) + 1);
    if (!catalogIds.has(id)) unknownCatalogIds.add(id);
  }
  while ((m = IMAGE_SRC_RE.exec(src))) {
    legacyRefs.push({ file: relative(ROOT, file), kind: 'imageSrc', value: m[1] });
  }
  while ((m = IMAGE_ALT_RE.exec(src))) {
    legacyRefs.push({ file: relative(ROOT, file), kind: 'imageAlt', value: m[1] });
  }
}

// ---------- 3. Check filesystem for each catalog entry ----------
function probe(publicPath) {
  const p = join(PUBLIC_ROOT, publicPath.replace(/^\//, ''));
  if (!existsSync(p)) return { exists: false, bytes: null };
  return { exists: true, bytes: statSync(p).size };
}

const fileIssues = [];   // entries that should exist on disk but don't
for (const e of catalog.images) {
  for (const ext of ['webp', 'png', 'svg']) {
    const path = e[ext];
    const r = probe(path);
    if (!r.exists) {
      fileIssues.push({ id: e.id, ext, path, status: e.status });
    }
  }
}

// ---------- 4. Orphan catalog entries (in catalog but no page uses them) ----------
const orphanCatalog = [...catalogIds].filter((id) => !pageRefCount.has(id));

// ---------- 5. Dangling page refs (referenced by page but not in catalog) ----------
const danglingPageRefs = [...unknownCatalogIds];

// ---------- 6. Format report ----------
const lines = [];
const push = (s) => lines.push(s);

push(`# Image Catalog Diagnostic Report`);
push(``);
push(`**Generated**: ${new Date().toISOString()}`);
push(`**Catalog**: \`${relative(ROOT, CATALOG_PATH)}\` v${catalog.version}`);
push(``);
push(`## Summary`);
push(``);
push(`| Bucket | Count |`);
push(`| --- | --- |`);
push(`| Catalog entries | ${catalog.images.length} |`);
push(`| Unique catalogIds referenced from pages | ${pageRefCount.size} |`);
push(`| Page references total | ${[...pageRefCount.values()].reduce((a, b) => a + b, 0)} |`);
push(`| Orphan catalog entries (in catalog, no page ref) | ${orphanCatalog.length} |`);
push(`| Dangling page refs (refers to non-existent id) | ${danglingPageRefs.length} |`);
push(`| Legacy \`imageSrc\` / \`imageAlt\` on ImageTextSplit | ${legacyRefs.length} |`);
push(`| Catalog entries with missing file on disk | ${fileIssues.length} |`);
push(``);

let exitCode = 0;

// ---------- 7. Real-vs-placeholder breakdown ----------
push(`## Catalog State Breakdown`);
push(``);
push(`| ID | Page | webp | png | svg | State |`);
push(`| --- | --- | --- | --- | --- | --- |`);
for (const e of catalog.images) {
  const w = probe(e.webp);
  const p = probe(e.png);
  const s = probe(e.svg);
  const ok = (x) => (x.exists ? `✅ ${x.bytes}B` : `❌`);
  const all = w.exists && p.exists && s.exists;
  const any = w.exists || p.exists || s.exists;
  const state = all ? 'real' : any ? 'partial' : 'placeholder';
  push(`| \`${e.id}\` | ${e.page} | ${ok(w)} | ${ok(p)} | ${ok(s)} | ${state} |`);
}
push(``);

// ---------- 8. Real images that should exist but are missing on disk ----------
if (fileIssues.length > 0) {
  push(`## ❌ Files Missing on Disk`);
  push(``);
  push(`These entries in \`image-catalog.json\` reference files that do not exist.  ` +
       `Marketing should drop the asset at the listed path before the next build.`);
  push(``);
  for (const f of fileIssues) {
    push(`- \`${f.path}\`  (catalog \`${f.id}\`, \`${f.ext}\`, status: \`${f.status}\`)`);
  }
  push(``);
  exitCode = 1;
}

// ---------- 9. Orphan catalog entries (informational) ----------
if (orphanCatalog.length > 0) {
  push(`## 🟡 Orphan Catalog Entries (no page uses them)`);
  push(``);
  for (const id of orphanCatalog) {
    const e = catalogById[id];
    push(`- \`${id}\` → ${e.page}  (${e.pageName})`);
  }
  push(``);
  if (exitCode === 0) exitCode = 2;
}

// ---------- 10. Dangling page refs (real bug) ----------
if (danglingPageRefs.length > 0) {
  push(`## ❌ Dangling Page References (page uses an id that is not in the catalog)`);
  push(``);
  for (const id of danglingPageRefs) {
    push(`- \`catalogId="${id}"\``);
  }
  push(``);
  exitCode = 1;
}

// ---------- 11. Legacy imageSrc/imageAlt (informational) ----------
if (legacyRefs.length > 0) {
  push(`## 🟡 Legacy \`imageSrc\` / \`imageAlt\` Still Present on ImageTextSplit`);
  push(``);
  push(`These should be replaced with a single \`catalogId\` reference.`);
  push(``);
  for (const r of legacyRefs) {
    push(`- \`${r.file}\` — ${r.kind} = \`${r.value}\``);
  }
  push(``);
  if (exitCode === 0) exitCode = 2;
}

const report = lines.join('\n');
console.log(report);

// Also write to memory-bank for visibility
try {
  const MEMO = join(ROOT, 'memory-bank');
  if (existsSync(MEMO)) {
    writeFileSync(join(MEMO, 'image-catalog-status.md'), report + '\n', 'utf-8');
  }
} catch {
  /* memory-bank is optional */
}

import { writeFileSync } from 'node:fs';
process.exit(exitCode);
