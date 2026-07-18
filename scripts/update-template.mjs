import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const templatePath = join(__dirname, '..', 'src', 'pages', 'products', 'product-entities', '[...slug].astro');

const content = readFileSync(templatePath, 'utf-8');

// Replace the hero + process + inspection + surface treatment + FAQ sections with conditional rendering
// Find the markers
const startMarker = '  <!-- ── SECTION 1: Quick Spec Bar';
const endMarker = '  <!-- ── SECTION 4: Shared Knowledge Links';

const startIdx = content.indexOf(startMarker);
const endIdx = content.indexOf(endMarker);

if (startIdx === -1 || endIdx === -1) {
  console.error('Could not find section markers');
  process.exit(1);
}

const header = content.substring(0, startIdx);
const footer = content.substring(endIdx);

const replacement = `  <!-- ── RICH BLUEPRINT BODY (Section 1-3) ── -->
  {data.sku ? (
    <!-- RICH MODE: Render the full 6-section markdown body from the blueprint -->
    <section class="py-10 lg:py-16" style="background: var(--theme-surface);">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex flex-wrap items-start gap-2 mb-3">
          {system && (
            <a href={\`/products/systems/\${system?.slug || system?.id?.replace('.json','') || ''}/\`} class="text-xs font-semibold px-3 py-1 rounded-full" style="background: color-mix(in srgb, var(--theme-primary) 12%, transparent); color: var(--theme-primary);">
              {data.industry} &rarr; {system.data.title}
            </a>
          )}
          <span class="text-xs px-3 py-1 rounded-full" style="background: color-mix(in srgb, var(--theme-text) 8%, transparent); color: color-mix(in srgb, var(--theme-text) 50%, transparent);">
            {data.category}
          </span>
        </div>
        {data.sku && (
          <div class="mb-4">
            <span class="text-xs font-mono px-3 py-1 rounded" style="background: color-mix(in srgb, var(--theme-primary) 8%, transparent); color: color-mix(in srgb, var(--theme-text) 50%, transparent);">
              SKU: {data.sku}
            </span>
          </div>
        )}
        <!-- Render the full blueprint markdown body -->
        <article class="prose prose-sm md:prose-base max-w-none" style="color: var(--theme-text);">
          <entry.Content />
        </article>
      </div>
    </section>
  ) : (
    <!-- LEGACY MODE: Render thin content as before -->
    <section class="py-10 lg:py-12" style="background: var(--theme-surface);">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex flex-wrap items-start gap-2 mb-3">
          {system && (
            <a href={\`/products/systems/\${system?.slug || system?.id?.replace('.json','') || ''}/\`} class="text-xs font-semibold px-3 py-1 rounded-full" style="background: color-mix(in srgb, var(--theme-primary) 12%, transparent); color: var(--theme-primary);">
              {data.industry} &rarr; {system.data.title}
            </a>
          )}
          <span class="text-xs px-3 py-1 rounded-full" style="background: color-mix(in srgb, var(--theme-text) 8%, transparent); color: color-mix(in srgb, var(--theme-text) 50%, transparent);">
            {data.category}
          </span>
        </div>
        <h1 class="text-3xl md:text-4xl font-bold mb-3" style="color: var(--theme-text);">{data.title}</h1>
        <p class="text-lg max-w-3xl" style="color: color-mix(in srgb, var(--theme-text) 60%, transparent);">{data.function}</p>

        <div class="mt-6 flex flex-wrap gap-4 text-sm">
          {data.material && (
            <div class="flex items-center gap-2 px-4 py-2 rounded-lg border" style="background: var(--theme-bg); border-color: color-mix(in srgb, var(--theme-primary) 8%, transparent);">
              <span style="color: color-mix(in srgb, var(--theme-text) 40%, transparent);">Material</span>
              <a href={material ? \`/products/materials/\${material?.slug || material?.id?.replace(".json","") || ""}/\` : '#'} class="font-semibold" style="color: var(--theme-primary);">{data.material.replace(/\\(.*\\)/, '').trim()}</a>
            </div>
          )}
          {data.industry && (
            <div class="flex items-center gap-2 px-4 py-2 rounded-lg border" style="background: var(--theme-bg); border-color: color-mix(in srgb, var(--theme-primary) 8%, transparent);">
              <span style="color: color-mix(in srgb, var(--theme-text) 40%, transparent);">Industry</span>
              <span class="font-semibold" style="color: var(--theme-text);">{data.industry}</span>
            </div>
          )}
          {data.standards && data.standards.length > 0 && (
            <div class="flex items-center gap-2 px-4 py-2 rounded-lg border" style="background: var(--theme-bg); border-color: color-mix(in srgb, var(--theme-primary) 8%, transparent);">
              <span style="color: color-mix(in srgb, var(--theme-text) 40%, transparent);">Standards</span>
              <span class="font-semibold" style="color: var(--theme-text);">{data.standards.slice(0, 2).join(', ')}</span>
            </div>
          )}
        </div>
      </div>
    </section>

    <section class="py-12 lg:py-16" style="background: var(--theme-bg); border-top: 1px solid color-mix(in srgb, var(--theme-primary) 8%, transparent); border-bottom: 1px solid color-mix(in srgb, var(--theme-primary) 8%, transparent);">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid md:grid-cols-2 gap-12">
          <div>
            {data.process && data.process.length > 0 && (
              <div>
                <h2 class="text-xl font-bold mb-4" style="color: var(--theme-text);">Manufacturing Process</h2>
                <ol class="space-y-3">
                  {data.process.slice(0, 4).map((p, i) => {
                    const cap = allCaps.find(c => c?.slug && p?.replace(/[^a-z0-9-]/g, '').toLowerCase().includes(c.slug.substring(0, 15)));
                    return (
                      <li class="flex items-start gap-3">
                        <span class="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold" style="background: color-mix(in srgb, var(--theme-primary) 15%, transparent); color: var(--theme-primary);">{i + 1}</span>
                        <div>
                          <p class="text-sm font-semibold" style="color: var(--theme-text);">{p}</p>
                          {cap && (
                            <a href={\`/products/capabilities/\${cap?.slug || cap?.id?.replace(".json","") || ""}/\`} class="text-xs" style="color: color-mix(in srgb, var(--theme-primary) 60%, transparent);">Learn about {cap.data.title} &rarr;</a>
                          )}
                        </div>
                      </li>
                    );
                  })}
                </ol>
              </div>
            )}
            {data.inspection && data.inspection.length > 0 && (
              <div class="mt-8">
                <h2 class="text-xl font-bold mb-4" style="color: var(--theme-text);">Inspection &amp; Quality</h2>
                <ul class="space-y-2">
                  {data.inspection.slice(0, 4).map((i) => (
                    <li class="flex items-start gap-2 text-sm" style="color: color-mix(in srgb, var(--theme-text) 65%, transparent);">
                      <span style="color: var(--theme-primary);">&check;</span> {i}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {data.surfaceTreatment && data.surfaceTreatment.length > 0 && (
              <div class="mt-8">
                <h2 class="text-xl font-bold mb-4" style="color: var(--theme-text);">Surface Treatment</h2>
                <ul class="space-y-2">
                  {data.surfaceTreatment.slice(0, 3).map((s) => (
                    <li class="flex items-start gap-2 text-sm" style="color: color-mix(in srgb, var(--theme-text) 65%, transparent);">
                      <span style="color: var(--theme-primary);">&triangleright;</span> {s}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>

    {faqData.length > 0 && (
      <section class="py-12 lg:py-16" style="background: var(--theme-surface);">
        <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 class="text-xl font-bold mb-8" style="color: var(--theme-text);">FAQ &mdash; {data.title}</h2>
          <div class="space-y-3">
            {faqData.map((item) => (
              <details class="p-4 rounded-xl border" style="background: var(--theme-bg); border-color: color-mix(in srgb, var(--theme-primary) 8%, transparent);">
                <summary class="font-semibold cursor-pointer text-sm" style="color: var(--theme-text);">{item.q}</summary>
                <p class="mt-3 text-sm leading-relaxed" style="color: color-mix(in srgb, var(--theme-text) 60%, transparent);">{item.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
    )}
  )}

`;

const newContent = header + replacement + footer;
writeFileSync(templatePath, newContent, 'utf-8');
console.log('Template updated successfully.');
