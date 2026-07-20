import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const p = join(__dirname, '..', 'src', 'pages', 'products', 'product-entities', '[...slug].astro');
let c = readFileSync(p, 'utf-8');

const NL = '\r\n';

// 1. Add import for LegacyEntityContent
c = c.replace(
  "import BaseLayout from '../../../layouts/BaseLayout.astro';",
  "import BaseLayout from '../../../layouts/BaseLayout.astro';\nimport LegacyEntityContent from '../../../components/product/LegacyEntityContent.astro';"
);

// 2. Add spec matching logic in frontmatter
c = c.replace(
  `// FAQ${NL}const faqData = data.faq || [];${NL}${NL}// JSON-LD`,
  `// FAQ${NL}const faqData = data.faq || [];${NL}${NL}// Load matching product spec for rich blueprint injection${NL}const allSpecs = await getCollection('product-specs');${NL}const specSlug = entry.slug || entry.id?.replace(/\\.(json|md)$/, '').split('/').pop();${NL}const specEntry = allSpecs.find(s => s.slug === specSlug);${NL}let SpecContent;${NL}if (specEntry) {${NL}  const rendered = await specEntry.render();${NL}  SpecContent = rendered.Content;${NL}}${NL}${NL}// JSON-LD`
);

// 3. Replace SECTION 1 (hero) with enhanced version that includes TOC nav
c = c.replace(
  '<p class="text-lg max-w-3xl" style="color: color-mix(in srgb, var(--theme-text) 60%, transparent);">{data.function}</p>',
  `<p class="text-lg max-w-3xl" style="color: color-mix(in srgb, var(--theme-text) 60%, transparent);">{data.function}</p>${NL}${NL}      {specEntry && (${NL}        <div class="mt-6 flex flex-wrap gap-2 text-xs" style="color: color-mix(in srgb, var(--theme-text) 50%, transparent);">${NL}          <span class="font-semibold" style="color: var(--theme-text);">Jump to:</span>${NL}          <a href="#tech-specs" class="px-2.5 py-1 rounded-full border transition-colors" style="border-color: color-mix(in srgb, var(--theme-primary) 15%, transparent);">Specifications</a>${NL}          <a href="#supply-chain" class="px-2.5 py-1 rounded-full border transition-colors" style="border-color: color-mix(in srgb, var(--theme-primary) 15%, transparent);">Compliance</a>${NL}          <a href="#application" class="px-2.5 py-1 rounded-full border transition-colors" style="border-color: color-mix(in srgb, var(--theme-primary) 15%, transparent);">Applications</a>${NL}          <a href="#manufacturing" class="px-2.5 py-1 rounded-full border transition-colors" style="border-color: color-mix(in srgb, var(--theme-primary) 15%, transparent);">Manufacturing</a>${NL}          <a href="#faq-section" class="px-2.5 py-1 rounded-full border transition-colors" style="border-color: color-mix(in srgb, var(--theme-primary) 15%, transparent);">FAQ</a>${NL}          <a href="#knowledge-graph" class="px-2.5 py-1 rounded-full border transition-colors" style="border-color: color-mix(in srgb, var(--theme-primary) 15%, transparent);">Knowledge Graph</a>${NL}        </div>${NL}      )}`
);

// 4. Replace SECTIONS 1-3 (hero + process + FAQ) with conditional rendering
// Find:  <!-- ── SECTION 1: Quick Spec Bar ... CTA -->
// Replace with: conditional sections
const section1Start = c.indexOf('<!-- ── SECTION 1: Quick Spec Bar');
const section3End = c.indexOf('<!-- ── SECTION 4: Shared Knowledge Links');

if (section1Start === -1 || section3End === -1) {
  console.error('Could not find section markers');
  process.exit(1);
}

const beforeSections = c.substring(0, section1Start);
const afterSections = c.substring(section3End);

c = beforeSections + `{specEntry ? (` + NL +
  `    <!-- RICH MODE: Show enhanced hero with TOC + blueprint body -->` + NL +
  `    <section class="py-10 lg:py-12" style="background: var(--theme-surface);">` + NL +
  `      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">` + NL +
  `        <div class="flex flex-wrap items-start gap-2 mb-3">` + NL +
  `          {system && (` + NL +
  `            <a href={('/products/systems/' + (system?.slug || system?.id?.replace(/\\.json$/, '') || '') + '/')} class="text-xs font-semibold px-3 py-1 rounded-full" style="background: color-mix(in srgb, var(--theme-primary) 12%, transparent); color: var(--theme-primary);">` + NL +
  `              {data.industry} &rarr; {system.data.title}` + NL +
  `            </a>` + NL +
  `          )}` + NL +
  `          <span class="text-xs px-3 py-1 rounded-full" style="background: color-mix(in srgb, var(--theme-text) 8%, transparent); color: color-mix(in srgb, var(--theme-text) 50%, transparent);">` + NL +
  `            {data.category}` + NL +
  `          </span>` + NL +
  `        </div>` + NL +
  `        <h1 class="text-3xl md:text-4xl font-bold mb-3" style="color: var(--theme-text);">{data.title}</h1>` + NL +
  `        <p class="text-lg max-w-3xl" style="color: color-mix(in srgb, var(--theme-text) 60%, transparent);">{data.function}</p>` + NL +
  `        {specEntry && (` + NL +
  `          <div class="mt-6 flex flex-wrap gap-2 text-xs" style="color: color-mix(in srgb, var(--theme-text) 50%, transparent);">` + NL +
  `            <span class="font-semibold" style="color: var(--theme-text);">Jump to:</span>` + NL +
  `            <a href="#tech-specs" class="px-2.5 py-1 rounded-full border transition-colors" style="border-color: color-mix(in srgb, var(--theme-primary) 15%, transparent);">Specifications</a>` + NL +
  `            <a href="#supply-chain" class="px-2.5 py-1 rounded-full border transition-colors" style="border-color: color-mix(in srgb, var(--theme-primary) 15%, transparent);">Compliance</a>` + NL +
  `            <a href="#application" class="px-2.5 py-1 rounded-full border transition-colors" style="border-color: color-mix(in srgb, var(--theme-primary) 15%, transparent);">Applications</a>` + NL +
  `            <a href="#manufacturing" class="px-2.5 py-1 rounded-full border transition-colors" style="border-color: color-mix(in srgb, var(--theme-primary) 15%, transparent);">Manufacturing</a>` + NL +
  `            <a href="#faq-section" class="px-2.5 py-1 rounded-full border transition-colors" style="border-color: color-mix(in srgb, var(--theme-primary) 15%, transparent);">FAQ</a>` + NL +
  `            <a href="#knowledge-graph" class="px-2.5 py-1 rounded-full border transition-colors" style="border-color: color-mix(in srgb, var(--theme-primary) 15%, transparent);">Knowledge Graph</a>` + NL +
  `          </div>` + NL +
  `        }` + NL +
  `      </div>` + NL +
  `    </section>` + NL +
  `  ) : (` + NL +
  `    <!-- LEGACY MODE: Show original thin content -->` + NL +
  `    <LegacyEntityContent data={data} system={system} material={material} allCaps={allCaps} faqData={faqData} />` + NL +
  `  )}` + NL + NL +
  `  <!-- ── SECTION 4: Shared Knowledge Links`;

writeFileSync(p, c, 'utf-8');
console.log('Final fix applied successfully.');
