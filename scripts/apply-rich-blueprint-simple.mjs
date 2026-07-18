import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const templatePath = join(__dirname, '..', 'src', 'pages', 'products', 'product-entities', '[...slug].astro');
let c = readFileSync(templatePath, 'utf-8');

// 1. Add entry.render() for Content
c = c.replace(
  'const { entry } = Astro.props;\nconst { data } = entry;',
  `const { entry } = Astro.props;
const { data } = entry;

// Pre-render markdown body for rich blueprint spec pages
let BlueprintContent;
if (data.sku) {
  const rendered = await entry.render();
  BlueprintContent = rendered.Content;
}`
);

// 2. Insert rich blueprint section BEFORE the CTA section
// Find the CTA section marker and insert before it
c = c.replace(
  '  <!-- ── SECTION 6: CTA ── -->',
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

  <!-- ── SECTION 6: CTA ── -->`
);

writeFileSync(templatePath, c, 'utf-8');
console.log('Rich blueprint body injected successfully.');
