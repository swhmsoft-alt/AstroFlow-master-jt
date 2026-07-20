/**
 * Apply ALL fixes to the product entity detail template in ONE clean pass.
 * 1. Add spec matching logic
 * 2. Add TOC navigation (when specEntry exists)
 * 3. Conditionally hide duplicate sections (Why Ti, Process, Inspection, Surface, FAQ)
 * 4. Add enhanced blueprint rendering with visual separator
 */
import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const p = join(__dirname, '..', 'src', 'pages', 'products', 'product-entities', '[...slug].astro');
let c = readFileSync(p, 'utf-8');

// Use \r\n consistently
const NL = '\r\n';

// ===================================================================
// FIX 1: Add spec matching logic in frontmatter
// ===================================================================
c = c.replace(
  `// FAQ${NL}const faqData = data.faq || [];${NL}${NL}// JSON-LD`,
  `// FAQ${NL}const faqData = data.faq || [];${NL}${NL}// Load matching product spec for rich blueprint injection${NL}const allSpecs = await getCollection('product-specs');${NL}const specSlug = entry.slug || entry.id?.replace(/\\.(json|md)$/, '').split('/').pop();${NL}const specEntry = allSpecs.find(s => s.slug === specSlug);${NL}let SpecContent;${NL}if (specEntry) {${NL}  const rendered = await specEntry.render();${NL}  SpecContent = rendered.Content;${NL}}${NL}${NL}// JSON-LD`
);

// ===================================================================
// FIX 2: Add TOC navigation after the function description
// ===================================================================
c = c.replace(
  '<p class="text-lg max-w-3xl" style="color: color-mix(in srgb, var(--theme-text) 60%, transparent);">{data.function}</p>',
  `<p class="text-lg max-w-3xl" style="color: color-mix(in srgb, var(--theme-text) 60%, transparent);">{data.function}</p>${NL}${NL}      {specEntry && (${NL}        <div class="mt-6 flex flex-wrap gap-2 text-xs" style="color: color-mix(in srgb, var(--theme-text) 50%, transparent);">${NL}          <span class="font-semibold" style="color: var(--theme-text);">Jump to:</span>${NL}          <a href="#tech-specs" class="px-2.5 py-1 rounded-full border transition-colors" style="border-color: color-mix(in srgb, var(--theme-primary) 15%, transparent);">Specifications</a>${NL}          <a href="#supply-chain" class="px-2.5 py-1 rounded-full border transition-colors" style="border-color: color-mix(in srgb, var(--theme-primary) 15%, transparent);">Compliance</a>${NL}          <a href="#application" class="px-2.5 py-1 rounded-full border transition-colors" style="border-color: color-mix(in srgb, var(--theme-primary) 15%, transparent);">Applications</a>${NL}          <a href="#manufacturing" class="px-2.5 py-1 rounded-full border transition-colors" style="border-color: color-mix(in srgb, var(--theme-primary) 15%, transparent);">Manufacturing</a>${NL}          <a href="#faq-section" class="px-2.5 py-1 rounded-full border transition-colors" style="border-color: color-mix(in srgb, var(--theme-primary) 15%, transparent);">FAQ</a>${NL}          <a href="#knowledge-graph" class="px-2.5 py-1 rounded-full border transition-colors" style="border-color: color-mix(in srgb, var(--theme-primary) 15%, transparent);">Knowledge Graph</a>${NL}        </div>${NL}      )}`
);

// ===================================================================
// FIX 3: Hide duplicate content (Why Ti, Process, Inspection, Surface, FAQ)
// Wrap the ENTIRE section containing these duplicates
// ===================================================================

// Find the section with duplicate content: from the "<section" before "Why Titanium" to the "</section>" after FAQ
const sectionStart = c.indexOf('<!-- ── SECTION 2');
const whyTiSection = c.indexOf('Why Titanium', sectionStart);
// Find the <section> tag that encloses this
const sectionTag = c.lastIndexOf('<section', whyTiSection);
// Find the </section> that closes this - it's before "<!-- ── SECTION 4" 
const section4 = c.indexOf('<!-- ── SECTION 4');
const sectionEnd = c.lastIndexOf('</section>', section4) + 10; // +10 for '</section>'

if (sectionTag === -1 || sectionEnd === -1) {
  console.error('Could not find section boundaries');
  process.exit(1);
}

// Extract and wrap
const before = c.substring(0, sectionTag);
const sectionContent = c.substring(sectionTag, sectionEnd);
const after = c.substring(sectionEnd);

c = before + '{!specEntry && (' + sectionContent + ')}' + after;

// ===================================================================
// FIX 4: Replace the old blueprint injection with enhanced version
// ===================================================================
c = c.replace(
  `  <!-- ── RICH BLUEPRINT SPEC INJECTION ── -->${NL}  {specEntry && SpecContent && (${NL}    <section class="py-12 lg:py-16" style="background: var(--theme-bg); border-top: 1px solid color-mix(in srgb, var(--theme-primary) 8%, transparent);">${NL}      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">${NL}        <article class="prose prose-sm md:prose-base max-w-none" style="color: var(--theme-text);">${NL}          <SpecContent />${NL}        </article>${NL}      </div>${NL}    </section>${NL}  )}`,
  `  <!-- ── RICH BLUEPRINT SPEC INJECTION ── -->${NL}  {specEntry && SpecContent && (${NL}    <section class="py-12 lg:py-16" style="background: var(--theme-surface); border-top: 2px solid color-mix(in srgb, var(--theme-primary) 15%, transparent);">${NL}      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">${NL}        <div class="mb-8 pb-6 border-b" style="border-color: color-mix(in srgb, var(--theme-primary) 10%, transparent);">${NL}          <h2 class="text-xl font-bold" style="color: var(--theme-text);">Complete Engineering Specification</h2>${NL}          <p class="text-sm mt-1" style="color: color-mix(in srgb, var(--theme-text) 50%, transparent);">Detailed technical data for procurement, design, and quality engineering review.</p>${NL}        </div>${NL}        <article class="prose prose-sm md:prose-base max-w-none" style="color: var(--theme-text);">${NL}          <SpecContent />${NL}        </article>${NL}      </div>${NL}    </section>${NL}  )}`
);

writeFileSync(p, c, 'utf-8');
console.log('All fixes applied in one clean pass.');
