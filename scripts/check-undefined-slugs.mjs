/**
 * scripts/check-undefined-slugs.mjs
 *
 * Pre-build validation: Scans all [...slug].astro pages for the
 * `|| undefined` anti-pattern in getStaticPaths, which produces
 * literal "undefined" strings in generated URLs.
 *
 * Also scans for `<a href={`...${...slug}`}>` without `|| ''` fallback.
 *
 * Usage:
 *   node scripts/check-undefined-slugs.mjs          # checks + reports
 *   node scripts/check-undefined-slugs.mjs --fix     # auto-fix (safe)
 *   node scripts/check-undefined-slugs.mjs --ci      # exit 1 on failure
 */
import { readFileSync, writeFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const ROOT = join(__dirname, '..');
const SRC_PAGES = join(ROOT, 'src', 'pages');

const args = process.argv.slice(2);
const isFix = args.includes('--fix');
const isCi = args.includes('--ci');

// ── Patterns ──────────────────────────────────────────────
const RE_UNDEFINED_FALLBACK = /\|\|\s*undefined\s*\)/;
// Match ${e.slug} | ${entry.slug} | ${p.slug} without || fallback
const RE_SLUG_NO_FALLBACK = /\$\{(e|entry|p)\.slug\}(?!\s*\|\|)/;

let hasError = false;
const results = [];

// ── Recursive file scan ───────────────────────────────────
function findSlugFiles(dir) {
  const files = [];
  try {
    const entries = readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      const full = join(dir, entry.name);
      if (entry.isDirectory()) {
        files.push(...findSlugFiles(full));
      } else if (entry.name === '[...slug].astro' || entry.name.endsWith('.astro')) {
        files.push(full);
      }
    }
  } catch { /* skip unreadable */ }
  return files;
}

const slugFiles = findSlugFiles(SRC_PAGES).filter(f => f.includes('[...slug]'));

for (const file of slugFiles) {
  const relPath = relative(ROOT, file);
  const content = readFileSync(file, 'utf-8');
  const lines = content.split('\n');
  let fileDirty = false;

  // ── Check 1: `|| undefined` in getStaticPaths ──
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (RE_UNDEFINED_FALLBACK.test(line)) {
      hasError = true;
      fileDirty = true;
      results.push(`❌ ${relPath}:${i + 1}  getStaticPaths uses \`|| undefined\` → should be \`|| ''\``);
      if (isFix) {
        lines[i] = line.replace(/\|\|\s*undefined\s*\)/, "|| '' )");
        results.push(`   🔧 Auto-fixed`);
      }
    }
  }

  // ── Check 2: `${e.slug}` / `${p.slug}` / `${entry.slug}` without `||` fallback in href ──
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    // Only check template literal lines that are href attributes
    if (line.includes('href={') && RE_SLUG_NO_FALLBACK.test(line)) {
      hasError = true;
      fileDirty = true;
      results.push(`❌ ${relPath}:${i + 1}  href uses \`\${...slug}\` without fallback → should add \`|| ''\``);
      if (isFix) {
        lines[i] = line.replace(
          /\$\{(e|entry|p)\.slug\}(?!\s*\|\|)/g,
          "${$1.slug || ''}"
        );
        results.push(`   🔧 Auto-fixed`);
      }
    }
  }

  if (fileDirty && isFix) {
    writeFileSync(file, lines.join('\n'), 'utf-8');
  }
}

// ── Summary Report ────────────────────────────────────────
console.log('\n══════════════════════════════════════════════════════════');
console.log('  Undefined Slug Validation Report');
console.log('══════════════════════════════════════════════════════════\n');

if (results.length === 0) {
  console.log('✅ No `|| undefined` anti-patterns found in any [...slug].astro file.');
} else {
  for (const r of results) {
    console.log(r);
  }
}

console.log(`\n📊 Scanned ${slugFiles.length} [...slug].astro files.`);
console.log(`   Issues found: ${results.length}`);

if (isCi && hasError) {
  process.exit(1);
}
