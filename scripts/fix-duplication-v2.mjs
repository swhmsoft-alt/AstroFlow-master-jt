import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const templatePath = join(__dirname, '..', 'src', 'pages', 'products', 'product-entities', '[...slug].astro');
let c = readFileSync(templatePath, 'utf-8');

// Add TOC nav bar in hero area (after the function description)
c = c.replace(
  '<p class="text-lg max-w-3xl" style="color: color-mix(in srgb, var(--theme-text) 60%, transparent);">{data.function}</p>',
  '<p class="text-lg max-w-3xl" style="color: color-mix(in srgb, var(--theme-text) 60%, transparent);">{data.function}</p>\r\n\r\n      {specEntry && (\r\n        <div class="mt-6 flex flex-wrap gap-2 text-xs" style="color: color-mix(in srgb, var(--theme-text) 50%, transparent);">\r\n          <span class="font-semibold" style="color: var(--theme-text);">Jump to:</span>\r\n          <a href="#tech-specs" class="px-2.5 py-1 rounded-full border transition-colors" style="border-color: color-mix(in srgb, var(--theme-primary) 15%, transparent);">Specifications</a>\r\n          <a href="#supply-chain" class="px-2.5 py-1 rounded-full border transition-colors" style="border-color: color-mix(in srgb, var(--theme-primary) 15%, transparent);">Compliance</a>\r\n          <a href="#application" class="px-2.5 py-1 rounded-full border transition-colors" style="border-color: color-mix(in srgb, var(--theme-primary) 15%, transparent);">Applications</a>\r\n          <a href="#manufacturing" class="px-2.5 py-1 rounded-full border transition-colors" style="border-color: color-mix(in srgb, var(--theme-primary) 15%, transparent);">Manufacturing</a>\r\n          <a href="#faq-section" class="px-2.5 py-1 rounded-full border transition-colors" style="border-color: color-mix(in srgb, var(--theme-primary) 15%, transparent);">FAQ</a>\r\n          <a href="#knowledge-graph" class="px-2.5 py-1 rounded-full border transition-colors" style="border-color: color-mix(in srgb, var(--theme-primary) 15%, transparent);">Knowledge Graph</a>\r\n        </div>\r\n      )}'
);

// Find the section containing Why Titanium + Eng Challenges + Process + Inspection + Surface Treatment
// This is SECTION 2 in the template
const section2Start = c.indexOf('<!-- SECTION 2');
if (section2Start === -1) {
  // Try different comment format
  const altStart = c.indexOf('Why Titanium');
  // Go back to find the section boundary
  const preceding = c.lastIndexOf('<section', altStart);
  // Go forward to find the section end
  const faqSection = c.indexOf('<!-- ── SECTION 3: FAQ');
  
  if (preceding === -1 || faqSection === -1) {
    console.error('Could not find section boundaries');
    process.exit(1);
  }
  
  // Wrap the entire <section> ... </section> in {!specEntry && (...)}
  const sectionOpen = c.indexOf('>', preceding) + 1;
  
  const beforeSection = c.substring(0, preceding);
  const sectionContent = c.substring(preceding, faqSection);
  const afterSection = c.substring(faqSection);
  
  c = beforeSection + '{!specEntry && (' + sectionContent + ')}' + afterSection;
}

// Find and enhance the rich blueprint section
const blueprintSection = c.indexOf('RICH BLUEPRINT SPEC INJECTION');
if (blueprintSection === -1) {
  console.error('Could not find blueprint section');
  process.exit(1);
}

// Enhance the blueprint wrapper
c = c.replace(
  '<section class="py-12 lg:py-16" style="background: var(--theme-bg); border-top: 1px solid color-mix(in srgb, var(--theme-primary) 8%, transparent);">',
  '<section class="py-12 lg:py-16" style="background: var(--theme-surface); border-top: 2px solid color-mix(in srgb, var(--theme-primary) 15%, transparent);">'
);

// Add section header before the SpecContent
c = c.replace(
  '<article class="prose prose-sm md:prose-base max-w-none" style="color: var(--theme-text);">\r\n          <SpecContent />',
  '<div class="mb-8 pb-6 border-b" style="border-color: color-mix(in srgb, var(--theme-primary) 10%, transparent);">\r\n          <h2 class="text-xl font-bold" style="color: var(--theme-text);">Complete Engineering Specification</h2>\r\n          <p class="text-sm mt-1" style="color: color-mix(in srgb, var(--theme-text) 50%, transparent);">Detailed technical data for procurement, design, and quality engineering review.</p>\r\n        </div>\r\n        <article class="prose prose-sm md:prose-base max-w-none prose-headings:font-bold prose-headings:tracking-tight prose-a:text-[var(--theme-primary)] prose-strong:text-[var(--theme-text)] prose-code:text-[var(--theme-primary)] prose-pre:bg-transparent prose-pre:p-0 prose-table:border-collapse prose-td:p-2 prose-th:p-2 prose-td:border prose-th:border" style="color: var(--theme-text); --tw-prose-body: var(--theme-text); --tw-prose-headings: var(--theme-text); --tw-prose-links: var(--theme-primary); --tw-prose-bold: var(--theme-text); --tw-prose-quotes: var(--theme-text);">\r\n          <SpecContent />'
);

// Also wrap the original FAQ section (SECTION 3)
c = c.replace(
  '{!specEntry && (<section class="py-10 lg:py-12" style="background: var(--theme-surface);">',
  // This pattern won't work because we haven't found the exact section structure yet.
  // Let me use a simpler approach.
  ''
);

// Simpler approach: find the original FAQ section and wrap it
const originalFaq = c.indexOf('FAQ &mdash;');
if (originalFaq !== -1) {
  // Find section start (the <section> tag before the FAQ heading)
  const faqSectionStart = c.lastIndexOf('<section', originalFaq);
  // Find section end (the </section> after the FAQ content, before Shared Knowledge)
  const sharedKnowledge = c.indexOf('Shared Knowledge');
  const faqSectionEnd = c.lastIndexOf('</section>', sharedKnowledge);
  
  if (faqSectionStart !== -1 && faqSectionEnd !== -1) {
    const endTag = faqSectionEnd + 10; // length of '</section>'
    const before = c.substring(0, faqSectionStart);
    const content = c.substring(faqSectionStart, endTag);
    const after = c.substring(endTag);
    c = before + '{!specEntry && (' + content + ')}' + after;
  }
}

writeFileSync(templatePath, c, 'utf-8');
console.log('Template duplication fixes applied v2.');
