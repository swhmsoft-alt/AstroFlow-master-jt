/**
 * scripts/check-html-shell.mjs
 *
 * Build-time guard: every generated HTML page must be a COMPLETE document.
 *
 * THE BUG THIS PREVENTS (found 2026-11-03)
 * -------------------------------------------
 * `src/pages/[lang]/[...slug].astro` rendered the 7 `resources/*` hub components
 * bare.  Five of them (TitaniumKnowledgeBase, FaqPage, ManufacturingInsights,
 * IndustryApplications, DownloadsPage) own their own <BaseLayout> wrapper, so
 * they were fine.  The two that did NOT — `TitaniumGradesGuide` and
 * `DesignEngineeringGuide` — relied on their EN mount page to supply the
 * wrapper.  Result: 11 locale routes × 2 slugs = 22 pages shipped as bare HTML
 * FRAGMENTS:
 *
 *     <!DOCTYPE html><!-- ===== Resource Sub-Pages ===== --><section …>
 *
 * i.e. no <html>, no <head>, no global CSS (Tailwind), no Header/Footer, and
 * no JSON-LD.  The pages were in the sitemap, so they were indexable and
 * user-visible — they simply rendered unstyled.
 *
 * WHY A SCRIPT AND NOT A REVIEW RULE
 * ---------------------------------
 * The failure mode is silent: the build succeeds, the page count is right, the
 * sitemap is right.  Only the rendered document structure differs.  A
 * deterministic post-build assertion is the only reliable gate.
 *
 * WHAT IT CHECKS
 * --------------
 * For every HTML file under dist:
 *   1. the file contains a `<html` tag          (not a fragment)
 *   2. the file contains a `<style>` block      (global CSS was inlined)
 *   3. the file contains the Tailwind banner    (the real stylesheet landed)
 *
 * Astro's own redirect stubs are EXEMPT: they are intentionally minimal
 * `<meta http-equiv="refresh">` documents with no stylesheet (they redirect
 * before paint).  They are detected by the refresh meta tag, not by a
 * path allow-list, so newly added redirects are covered automatically.
 *
 * Usage:
 *   node scripts/check-html-shell.mjs            # exit 1 on any violation
 *   node scripts/check-html-shell.mjs --quiet    # only print the summary
 */

import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const DIST = join(ROOT, 'dist');
const QUIET = process.argv.includes('--quiet');

/** Tailwind v4 emits this banner at the top of the compiled stylesheet. */
const TAILWIND_BANNER = 'tailwindcss v';

/** Astro redirect stub marker — these pages legitimately carry no CSS. */
const REDIRECT_MARKER = /http-equiv=["']?refresh["']?/i;

/** @returns {string[]} absolute paths of every .html file under `dir` */
function collectHtml(dir) {
  const out = [];
  let entries;
  try {
    entries = readdirSync(dir, { withFileTypes: true });
  } catch {
    return out;
  }
  for (const entry of entries) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      out.push(...collectHtml(full));
    } else if (entry.isFile() && entry.name.endsWith('.html')) {
      out.push(full);
    }
  }
  return out;
}

if (!statSync(DIST, { throwIfNoEntry: false })?.isDirectory?.()) {
  console.error('✗ dist/ not found — run the build first.');
  process.exit(1);
}

const files = collectHtml(DIST);
const violations = [];
let checked = 0;
let skippedRedirects = 0;

for (const file of files) {
  const html = readFileSync(file, 'utf-8');

  // Astro redirect stub — intentionally minimal, no stylesheet.
  if (REDIRECT_MARKER.test(html)) {
    skippedRedirects++;
    continue;
  }

  checked++;

  const problems = [];
  if (!/<html[\s>]/i.test(html)) problems.push('missing <html> tag (page is an HTML fragment)');
  if (!/<style[\s>]/i.test(html)) problems.push('missing <style> block (global CSS not inlined)');
  if (!html.includes(TAILWIND_BANNER)) problems.push('missing Tailwind stylesheet');

  if (problems.length) {
    violations.push({ file: relative(ROOT, file).replace(/\\/g, '/'), problems });
  }
}

console.log('══════════════════════════════════════════════════════════');
console.log('  HTML Shell Integrity Report');
console.log('══════════════════════════════════════════════════════════');
console.log(`📄 HTML files scanned : ${files.length}`);
console.log(`🔀 redirect stubs    : ${skippedRedirects} (exempt — no CSS by design)`);
console.log(`🔍 documents checked : ${checked}`);

if (violations.length === 0) {
  console.log('');
  console.log('✅ Every generated page is a complete HTML document with global CSS.');
  process.exit(0);
}

console.log('');
console.log(`❌ ${violations.length} page(s) are NOT complete HTML documents:`);
console.log('');
for (const v of violations) {
  console.log(`   ${v.file}`);
  for (const p of v.problems) console.log(`       → ${p}`);
}
console.log('');
console.log('   A page rendered WITHOUT its <BaseLayout> wrapper. Check whether the');
console.log('   component is mounted by a route that does not supply the layout.');
console.log('   The fix is to move <BaseLayout> INTO the component (so every route');
console.log('   that mounts it emits a full document), not to add it to one route.');
process.exit(1);
