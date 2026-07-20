import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const NL = '\r\n';

// ============================================================
// FIX 1: Add aliases + anchor script to RichEntityContent.astro
// ============================================================
const richPath = join(__dirname, '..', 'src', 'components', 'product', 'RichEntityContent.astro');
let rich = readFileSync(richPath, 'utf-8');

// Add props for data and aliases
rich = rich.replace(
  'export interface Props {\n  SpecContent: any;\n}',
  'export interface Props {\n  SpecContent: any;\n  data: any;\n}'
);

rich = rich.replace(
  "const { SpecContent } = Astro.props;",
  "const { SpecContent, data } = Astro.props;"
);

// Add aliases section after TOC nav, before blueprint wrapper
rich = rich.replace(
  '<!-- Blueprint Body Wrapper -->',
  `<!-- Also known as (aliases for SEO) -->
{data.aliases && data.aliases.length > 0 && (
  <div class="mt-4 flex flex-wrap gap-2 text-xs" style="color: color-mix(in srgb, var(--theme-text) 45%, transparent);">
    <span class="font-semibold" style="color: color-mix(in srgb, var(--theme-text) 55%, transparent);">Also known as:</span>
    {data.aliases.map((a: string) => (
      <span class="px-2 py-0.5 rounded" style="background: color-mix(in srgb, var(--theme-primary) 6%, transparent);">{a}</span>
    ))}
  </div>
)}

<!-- Blueprint Body Wrapper -->`
);

// Add anchor injection script at the end
rich = rich.replace(
  '</section>',
  `</section>

<script>
  // Inject anchor IDs into blueprint section headings for TOC navigation
  (function() {
    const section = document.currentScript?.parentElement;
    if (!section) return;
    const headings = section.querySelectorAll('h2, h3');
    const map = {
      'technical specifications': 'tech-specs',
      'supply chain': 'supply-chain',
      'application dynamics': 'application',
      'advanced manufacturing': 'manufacturing',
      'technical faq': 'faq-section',
      'semantic graph': 'knowledge-graph',
      'knowledge graph': 'knowledge-graph'
    };
    headings.forEach(function(h) {
      var text = h.textContent.toLowerCase().trim();
      for (var key in map) {
        if (text.startsWith(key)) {
          h.id = map[key];
          break;
        }
      }
    });
  })();
</script>`
);

writeFileSync(richPath, rich, 'utf-8');
console.log('RichEntityContent updated with aliases + anchor script.');

// ============================================================
// FIX 2: Update main template call to pass data to RichEntityContent
// ============================================================
const templatePath = join(__dirname, '..', 'src', 'pages', 'products', 'product-entities', '[...slug].astro');
let tmpl = readFileSync(templatePath, 'utf-8');

tmpl = tmpl.replace(
  '<RichEntityContent SpecContent={SpecContent} />',
  '<RichEntityContent SpecContent={SpecContent} data={data} />'
);

// ============================================================
// FIX 3: Enrich JSON-LD with spec frontmatter data when available
// ============================================================
tmpl = tmpl.replace(
  `    const schemaProduct = {${NL}    "@context": "https://schema.org",`,
  `    const schemaProduct = {${NL}    "@context": "https://schema.org",${NL}    ...(specEntry?.data ? {${NL}      "additionalProperty": [${NL}        { "@type": "PropertyValue", "name": "SKU", "value": specEntry.data.sku },${NL}        { "@type": "PropertyValue", "name": "UNS Number", "value": specEntry.data.uns_number },${NL}        { "@type": "PropertyValue", "name": "Werkstoff Number", "value": specEntry.data.werkstoff_number },${NL}        { "@type": "PropertyValue", "name": "Tensile Strength", "value": specEntry.data.tensile_strength },${NL}        { "@type": "PropertyValue", "name": "Yield Strength", "value": specEntry.data.yield_strength },${NL}        { "@type": "PropertyValue", "name": "Density", "value": specEntry.data.density },${NL}        { "@type": "PropertyValue", "name": "Hardness", "value": specEntry.data.hardness },${NL}        { "@type": "PropertyValue", "name": "Compliance", "value": specEntry.data.compliance?.join(', ') }${NL}      ].filter(Boolean)${NL}    } : {})`
);

writeFileSync(templatePath, tmpl, 'utf-8');
console.log('Template updated with enriched JSON-LD + data passing.');

// ============================================================
// FIX 4: Update JSON-LD HowTo to use spec data when available
// ============================================================
// Replace the HowTo step to use spec's manufacturing_process when available
tmpl = readFileSync(templatePath, 'utf-8');
tmpl = tmpl.replace(
  `"step": (data.process || []).map((p: string, i: number) => ({${NL}        "@type": "HowToStep", "position": i + 1, "text": p${NL}      }))`,
  `"step": ((specEntry?.data?.manufacturing_process ? specEntry.data.manufacturing_process.split(', ') : (data.process || [])).map((p: string, i: number) => ({${NL}        "@type": "HowToStep", "position": i + 1, "text": p.trim()${NL}      })))`
);

// Update FAQPage to use spec FAQ when available
tmpl = tmpl.replace(
  `if (faqData.length > 0) {${NL}  schemaProduct["@graph"].push({${NL}    "@type": "FAQPage",${NL}    "mainEntity": faqData.map((f: any) => ({${NL}      "@type": "Question", "name": f.q,${NL}      "acceptedAnswer": { "@type": "Answer", "text": f.a }${NL}    }))${NL}  });${NL}}`,
  `// Use spec FAQ when available, fall back to JSON FAQ
const schemaFaqData = specEntry?.data?.faq || faqData;
if (schemaFaqData.length > 0) {
  schemaProduct["@graph"].push({
    "@type": "FAQPage",
    "mainEntity": schemaFaqData.map((f: any) => ({
      "@type": "Question", "name": f.q,
      "acceptedAnswer": { "@type": "Answer", "text": f.a }
    }))
  });
}`);

writeFileSync(templatePath, tmpl, 'utf-8');
console.log('JSON-LD FAQ updated to use spec data.');
console.log('All remaining issues fixed.');
