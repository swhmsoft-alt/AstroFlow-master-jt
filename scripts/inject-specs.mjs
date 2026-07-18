import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const templatePath = join(__dirname, '..', 'src', 'pages', 'products', 'product-entities', '[...slug].astro');
let c = readFileSync(templatePath, 'utf-8');

// 1. Remove old BlueprintContent from frontmatter (if present)
c = c.replace(
  `// Pre-render markdown body for rich blueprint spec pages
let BlueprintContent;
if (data.sku) {
  const rendered = await entry.render();
  BlueprintContent = rendered.Content;
}

`,
  ''
);

// 2. Add spec matching logic after // FAQ line
c = c.replace(
`// FAQ
const faqData = data.faq || [];

// JSON-LD`,
`// FAQ
const faqData = data.faq || [];

// Load matching product spec for rich blueprint content injection
const allSpecs = await getCollection('product-specs');
const specEntry = allSpecs.find(s => s.slug === entry.slug);
let SpecContent;
if (specEntry) {
  const rendered = await specEntry.render();
  SpecContent = rendered.Content;
}

// JSON-LD`
);

// 3. Replace old BlueprintContent rendering section
c = c.replace(
`  <!-- ── RICH BLUEPRINT BODY (only shown for migrated spec pages) ── -->
  {data.sku && BlueprintContent && (
    <section class="py-12 lg:py-16" style="background: var(--theme-bg); border-top: 1px solid color-mix(in srgb, var(--theme-primary) 8%, transparent);">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <article class="prose prose-sm md:prose-base max-w-none" style="color: var(--theme-text);">
          <BlueprintContent />
        </article>
      </div>
    </section>
  )}

  <!-- ── SECTION 6: CTA ── -->`,
  `  <!-- ── RICH BLUEPRINT SPEC INJECTION ── -->
  {specEntry && SpecContent && (
    <section class="py-12 lg:py-16" style="background: var(--theme-bg); border-top: 1px solid color-mix(in srgb, var(--theme-primary) 8%, transparent);">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <article class="prose prose-sm md:prose-base max-w-none" style="color: var(--theme-text);">
          <SpecContent />
        </article>
      </div>
    </section>
  )}

  <!-- ── SECTION 6: CTA ── -->`
);

writeFileSync(templatePath, c, 'utf-8');
console.log('Spec injection applied successfully.');
