import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

// ===================================================================
// 1. Rewrite RichEntityContent.astro with visual hero + prose body
// ===================================================================
const compPath = join(__dirname, '..', 'src', 'components', 'product', 'RichEntityContent.astro');
const newComp = `---
// Rich Entity Content — visual Hero + TOC + prose-styled blueprint body
// Data from entity JSON + spec frontmatter

export interface Props {
  SpecContent: any;
  data: any;
  specEntry?: any;
}

const { SpecContent, data, specEntry } = Astro.props;

// Extract short material name for badge
const shortMat = data.material?.replace(/\(.*\)/, '').trim() || 'Titanium';

// Pick 3 key metrics for the visual cards, preferring spec frontmatter
const metric1 = specEntry?.data?.titanium_grade || shortMat;
const metric1Label = 'Material';

const metric2 = specEntry?.data?.density || specEntry?.data?.weight_reduction || '4.43 g/cm³';
const metric2Label = 'Density';

const metric3 = specEntry?.data?.strength_type === 'tensile' 
  ? specEntry?.data?.tensile_strength 
  : (specEntry?.data?.tensile_strength || 'Min. 895 MPa');
const metric3Label = 'Tensile Strength';

// Determine category color based on industry
const industryTag = data.industry || data.category || 'Industrial Component';
const categoryBadge = data.category || 'Component';
---

<!-- ═══════════ HERO: Visual Header with Metrics + Image Slot ═══════════ -->
<section class="py-10 lg:py-14" style="background: color-mix(in srgb, var(--theme-primary) 3%, var(--theme-bg)); border-bottom: 1px solid color-mix(in srgb, var(--theme-primary) 10%, transparent);">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="grid lg:grid-cols-12 gap-8 items-start">

      <!-- ──── Left Column: Title + Metrics + CTA (7 cols) ──── -->
      <div class="lg:col-span-7 space-y-5">

        <!-- Breadcrumb-like category chain -->
        <div class="flex flex-wrap items-center gap-2 text-xs">
          <span class="px-2.5 py-1 rounded font-semibold" style="background: color-mix(in srgb, var(--theme-primary) 12%, transparent); color: var(--theme-primary);">
            {industryTag}
          </span>
          <span style="color: color-mix(in srgb, var(--theme-text) 35%, transparent);">/</span>
          <span class="px-2.5 py-1 rounded" style="background: color-mix(in srgb, var(--theme-text) 6%, transparent); color: color-mix(in srgb, var(--theme-text) 50%, transparent);">
            {categoryBadge}
          </span>
        </div>

        <!-- Title -->
        <h1 class="text-3xl md:text-4xl font-bold leading-tight" style="color: var(--theme-text);">
          {data.title}
        </h1>

        <!-- Function / one-liner -->
        <p class="text-base leading-relaxed" style="color: color-mix(in srgb, var(--theme-text) 55%, transparent);">
          {data.function}
        </p>

        <!-- ──── Key Metrics Cards (3-column grid) ──── -->
        <div class="grid grid-cols-3 gap-3 p-4 rounded-xl border" style="background: var(--theme-surface); border-color: color-mix(in srgb, var(--theme-primary) 8%, transparent);">
          <div class="text-center">
            <div class="text-[10px] font-semibold uppercase tracking-wider" style="color: color-mix(in srgb, var(--theme-primary) 50%, transparent);">{metric1Label}</div>
            <div class="text-sm font-bold mt-1 leading-tight" style="color: var(--theme-text);">{metric1}</div>
          </div>
          <div class="text-center border-l" style="border-color: color-mix(in srgb, var(--theme-primary) 8%, transparent);">
            <div class="text-[10px] font-semibold uppercase tracking-wider" style="color: color-mix(in srgb, var(--theme-primary) 50%, transparent);">{metric2Label}</div>
            <div class="text-sm font-bold mt-1 leading-tight" style="color: var(--theme-text);">{metric2}</div>
          </div>
          <div class="text-center border-l" style="border-color: color-mix(in srgb, var(--theme-primary) 8%, transparent);">
            <div class="text-[10px] font-semibold uppercase tracking-wider" style="color: color-mix(in srgb, var(--theme-primary) 50%, transparent);">{metric3Label}</div>
            <div class="text-sm font-bold mt-1 leading-tight" style="color: var(--theme-text);">{metric3}</div>
          </div>
        </div>

        <!-- CTA -->
        <a href="/contact" class="inline-flex items-center justify-center w-full sm:w-auto px-6 py-3 text-sm font-bold rounded-xl transition-all" style="background: var(--theme-primary); color: var(--theme-text);">
          Request Quote for {data.title}
          <svg class="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
        </a>
      </div>

      <!-- ──── Right Column: Image / Visual Placeholder (5 cols) ──── -->
      <div class="lg:col-span-5">
        <div class="rounded-xl border-2 border-dashed flex items-center justify-center min-h-[260px] lg:min-h-[320px]" style="background: var(--theme-bg); border-color: color-mix(in srgb, var(--theme-primary) 8%, transparent);">
          <div class="text-center px-6">
            <svg class="w-12 h-12 mx-auto mb-3" style="color: color-mix(in srgb, var(--theme-primary) 25%, transparent);" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p class="text-xs font-medium" style="color: color-mix(in srgb, var(--theme-text) 35%, transparent);">
              {shortMat} Product Rendering
            </p>
            <p class="text-[10px] mt-1" style="color: color-mix(in srgb, var(--theme-text) 25%, transparent);">
              CAD / 3D Scan — upload to replace this placeholder
            </p>
          </div>
        </div>
      </div>

    </div>

    <!-- ──── TOC Navigation (below hero grid) ──── -->
    <div class="mt-8 pt-6 border-t flex flex-wrap gap-2 text-xs" style="border-color: color-mix(in srgb, var(--theme-primary) 8%, transparent); color: color-mix(in srgb, var(--theme-text) 50%, transparent);">
      <span class="font-semibold" style="color: var(--theme-text);">Jump to:</span>
      <a href="#tech-specs" class="px-2.5 py-1 rounded-full border transition-colors" style="border-color: color-mix(in srgb, var(--theme-primary) 15%, transparent);">Specifications</a>
      <a href="#supply-chain" class="px-2.5 py-1 rounded-full border transition-colors" style="border-color: color-mix(in srgb, var(--theme-primary) 15%, transparent);">Compliance</a>
      <a href="#application" class="px-2.5 py-1 rounded-full border transition-colors" style="border-color: color-mix(in srgb, var(--theme-primary) 15%, transparent);">Applications</a>
      <a href="#manufacturing" class="px-2.5 py-1 rounded-full border transition-colors" style="border-color: color-mix(in srgb, var(--theme-primary) 15%, transparent);">Manufacturing</a>
      <a href="#faq-section" class="px-2.5 py-1 rounded-full border transition-colors" style="border-color: color-mix(in srgb, var(--theme-primary) 15%, transparent);">FAQ</a>
      <a href="#knowledge-graph" class="px-2.5 py-1 rounded-full border transition-colors" style="border-color: color-mix(in srgb, var(--theme-primary) 15%, transparent);">Classification</a>
    </div>

    <!-- ──── Aliases ──── -->
    {data.aliases && data.aliases.length > 0 && (
      <div class="mt-4 flex flex-wrap gap-2 text-xs" style="color: color-mix(in srgb, var(--theme-text) 45%, transparent);">
        <span class="font-semibold" style="color: color-mix(in srgb, var(--theme-text) 55%, transparent);">Also known as:</span>
        {data.aliases.map((a: string) => (
          <span class="px-2 py-0.5 rounded" style="background: color-mix(in srgb, var(--theme-primary) 6%, transparent);">{a}</span>
        ))}
      </div>
    )}
  </div>
</section>

<!-- ═══════════ BLUEPRINT BODY: prose-styled spec content ═══════════ -->
<section class="py-12 lg:py-16" style="background: var(--theme-surface);">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="mb-8 pb-6 border-b" style="border-color: color-mix(in srgb, var(--theme-primary) 10%, transparent);">
      <h2 class="text-xl font-bold" style="color: var(--theme-text);">Complete Engineering Specification</h2>
      <p class="text-sm mt-1" style="color: color-mix(in srgb, var(--theme-text) 50%, transparent);">Detailed technical data for procurement, design, and quality engineering review.</p>
    </div>
    <article class="prose prose-sm md:prose-base max-w-none
      prose-headings:font-bold prose-headings:tracking-tight
      prose-a:text-[var(--theme-primary)]
      prose-strong:text-[var(--theme-text)]
      prose-code:text-[var(--theme-primary)]
      prose-pre:bg-transparent prose-pre:p-0
      prose-table:border-collapse prose-td:p-2 prose-th:p-2 prose-td:border prose-th:border
      prose-h2:text-lg prose-h2:mt-8 prose-h2:mb-4
      prose-h3:text-base prose-h3:mt-6 prose-h3:mb-3
      prose-p:text-sm prose-p:leading-relaxed
      prose-li:text-sm
      prose-th:text-sm prose-th:font-semibold
      prose-td:text-sm" 
      style="color: var(--theme-text); --tw-prose-body: var(--theme-text); --tw-prose-headings: var(--theme-text); --tw-prose-links: var(--theme-primary); --tw-prose-bold: var(--theme-text); --tw-prose-quotes: var(--theme-text);">
      {SpecContent && <SpecContent />}
    </article>
  </div>
</section>
`;

writeFileSync(compPath, newComp, 'utf-8');
console.log('RichEntityContent.astro rewritten with visual hero + prose.');

// ===================================================================
// 2. Update main template to pass specEntry to RichEntityContent
// ===================================================================
const tmplPath = join(__dirname, '..', 'src', 'pages', 'products', 'product-entities', '[...slug].astro');
let tmpl = readFileSync(tmplPath, 'utf-8');

tmpl = tmpl.replace(
  '<RichEntityContent SpecContent={SpecContent} data={data} />',
  '<RichEntityContent SpecContent={SpecContent} data={data} specEntry={specEntry} />'
);

writeFileSync(tmplPath, tmpl, 'utf-8');
console.log('Main template updated to pass specEntry.');

console.log('Done.');
