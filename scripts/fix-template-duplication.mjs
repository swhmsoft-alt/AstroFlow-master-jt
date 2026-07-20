import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const templatePath = join(__dirname, '..', 'src', 'pages', 'products', 'product-entities', '[...slug].astro');
let c = readFileSync(templatePath, 'utf-8');

// ===================================================================
// 1. Wrap "Why Titanium" + "Engineering Challenges" block — keep
//    Engineering Challenges, hide Why Titanium + Process + Inspection
// ===================================================================

// Find the "Why Titanium" section start
const oldSection1 = c.indexOf('Why Titanium');
const engChallenges = c.indexOf('Engineering Challenges');

if (oldSection1 === -1 || engChallenges === -1) {
  console.error('Could not find Why Titanium or Engineering Challenges markers');
  process.exit(1);
}

// Replace "Why Titanium" paragraph with conditional
c = c.replace(
  '          <!-- Why Titanium (product-specific) -->\r\n          {data.alloyReason',
  '          {!specEntry && (\r\n          <!-- Why Titanium (product-specific, hidden when rich spec exists) -->\r\n          {data.alloyReason'
);

// Close the conditional after the "Why Titanium" paragraph's closing </div>
// The Why Titanium paragraph ends before Engineering Challenges starts
// Pattern: </div>\r\n\r\n          <!-- Engineering Challenges -->
c = c.replace(
  '</div>\r\n\r\n          <!-- Engineering Challenges -->',
  '</div>\r\n          )}\r\n\r\n          <!-- Engineering Challenges -->'
);

// ===================================================================
// 2. Wrap Manufacturing Process + Inspection + Surface Treatment
// ===================================================================

// Find the Manufacturing Process section
c = c.replace(
  '          <!-- Process (product-specific) -->\r\n          {data.process',
  '          {!specEntry && (\r\n          <!-- Process (product-specific, hidden when rich spec exists) -->\r\n          {data.process'
);

// Close after Surface Treatment ends (before the </div> that closes the grid column)
// Pattern: </div>\r\n        </div>\r\n      </div>\r\n    </div>\r\n  </section> for the process section
// The process section ends with </div>\n        </div>\n      </div>\n    </div>\n  </section>\n\n  <!-- ── SECTION 3: FAQ
// Actually, let me find a more precise pattern.

// The process/inspection/surface block ends with: </div>\n        </div>\n      </div>\n    </div>\n  </section>\n\n  <!-- ── SECTION 3: FAQ
// But this is inside the legacy mode, so I need to be careful.

// Let me find the closing of the process section (before FAQ)
const processEnd = c.indexOf('  <!-- ── SECTION 3: FAQ');
if (processEnd === -1) {
  console.error('Could not find FAQ section start');
  process.exit(1);
}

// The process section starts with:
//           {data.process && data.process.length > 0 && (
// After the Why Titanium conditional is added, let me find the right spot.

// Actually, let me use a different approach - find the process section by looking backwards from FAQ
const processSectionStart = c.lastIndexOf('{!specEntry && (', processEnd);
if (processSectionStart === -1) {
  console.error('Could not find process section conditional start');
  process.exit(1);
}

// Close the process conditional before FAQ
// Insert closing }) before the FAQ section
c = c.replace(
  '  <!-- ── SECTION 3: FAQ',
  '          )}\r\n\r\n  <!-- ── SECTION 3: FAQ'
);

// ===================================================================
// 3. Wrap original FAQ — hide when specEntry exists
// ===================================================================

c = c.replace(
  '  <!-- ── SECTION 3: FAQ',
  '  {!specEntry && (\r\n  <!-- ── SECTION 3: FAQ'
);

// Close the FAQ conditional before SECTION 4
c = c.replace(
  '  <!-- ── SECTION 4: Shared Knowledge Links',
  '  )}\r\n\r\n  <!-- ── SECTION 4: Shared Knowledge Links'
);

// ===================================================================
// 4. Add anchor navigation bar in Hero area (when specEntry exists)
// ===================================================================

// Inject TOC after the function description paragraph, before Quick Spec Bar
c = c.replace(
  '      <p class="text-lg max-w-3xl" style="color: color-mix(in srgb, var(--theme-text) 60%, transparent);">{data.function}</p>',
  `      <p class="text-lg max-w-3xl" style="color: color-mix(in srgb, var(--theme-text) 60%, transparent);">{data.function}</p>
      
      {specEntry && (
        <div class="mt-6 flex flex-wrap gap-2 text-xs" style="color: color-mix(in srgb, var(--theme-text) 50%, transparent);">
          <span class="font-semibold" style="color: var(--theme-text);">Quick Navigation:</span>
          <a href="#tech-specs" class="px-2.5 py-1 rounded-full border transition-colors" style="border-color: color-mix(in srgb, var(--theme-primary) 15%, transparent);" onmouseover="this.style.borderColor='var(--theme-primary)'" onmouseout="this.style.borderColor='color-mix(in srgb, var(--theme-primary) 15%, transparent)'">Specifications</a>
          <a href="#supply-chain" class="px-2.5 py-1 rounded-full border transition-colors" style="border-color: color-mix(in srgb, var(--theme-primary) 15%, transparent);" onmouseover="this.style.borderColor='var(--theme-primary)'" onmouseout="this.style.borderColor='color-mix(in srgb, var(--theme-primary) 15%, transparent)'">Compliance</a>
          <a href="#application" class="px-2.5 py-1 rounded-full border transition-colors" style="border-color: color-mix(in srgb, var(--theme-primary) 15%, transparent);" onmouseover="this.style.borderColor='var(--theme-primary)'" onmouseout="this.style.borderColor='color-mix(in srgb, var(--theme-primary) 15%, transparent)'">Applications</a>
          <a href="#manufacturing" class="px-2.5 py-1 rounded-full border transition-colors" style="border-color: color-mix(in srgb, var(--theme-primary) 15%, transparent);" onmouseover="this.style.borderColor='var(--theme-primary)'" onmouseout="this.style.borderColor='color-mix(in srgb, var(--theme-primary) 15%, transparent)'">Manufacturing</a>
          <a href="#faq-section" class="px-2.5 py-1 rounded-full border transition-colors" style="border-color: color-mix(in srgb, var(--theme-primary) 15%, transparent);" onmouseover="this.style.borderColor='var(--theme-primary)'" onmouseout="this.style.borderColor='color-mix(in srgb, var(--theme-primary) 15%, transparent)'">FAQ</a>
          <a href="#knowledge-graph" class="px-2.5 py-1 rounded-full border transition-colors" style="border-color: color-mix(in srgb, var(--theme-primary) 15%, transparent);" onmouseover="this.style.borderColor='var(--theme-primary)'" onmouseout="this.style.borderColor='color-mix(in srgb, var(--theme-primary) 15%, transparent)'">Knowledge Graph</a>
        </div>
      )}`
);

// ===================================================================
// 5. Enhance rich blueprint section with anchor IDs and visual polish
// ===================================================================

c = c.replace(
  `  <!-- ── RICH BLUEPRINT SPEC INJECTION ── -->
  {specEntry && SpecContent && (
    <section class="py-12 lg:py-16" style="background: var(--theme-bg); border-top: 1px solid color-mix(in srgb, var(--theme-primary) 8%, transparent);">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <article class="prose prose-sm md:prose-base max-w-none" style="color: var(--theme-text);">
          <SpecContent />
        </article>
      </div>
    </section>
  )}`,
  `  <!-- ── RICH BLUEPRINT SPEC INJECTION ── -->
  {specEntry && SpecContent && (
    <section class="py-12 lg:py-16" style="background: var(--theme-surface); border-top: 2px solid color-mix(in srgb, var(--theme-primary) 15%, transparent);">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="mb-8 pb-6 border-b" style="border-color: color-mix(in srgb, var(--theme-primary) 10%, transparent);">
          <h2 class="text-xl font-bold" style="color: var(--theme-text);">Complete Engineering Specification</h2>
          <p class="text-sm mt-1" style="color: color-mix(in srgb, var(--theme-text) 50%, transparent);">Detailed technical data for procurement, design, and quality engineering review.</p>
        </div>
        <article class="prose prose-sm md:prose-base max-w-none prose-headings:font-bold prose-headings:tracking-tight prose-a:text-[var(--theme-primary)] prose-strong:text-[var(--theme-text)] prose-code:text-[var(--theme-primary)] prose-pre:bg-transparent prose-pre:p-0 prose-table:border-collapse prose-td:p-2 prose-th:p-2 prose-td:border prose-th:border" style="color: var(--theme-text); --tw-prose-body: var(--theme-text); --tw-prose-headings: var(--theme-text); --tw-prose-links: var(--theme-primary); --tw-prose-bold: var(--theme-text); --tw-prose-quotes: var(--theme-text);">
          <SpecContent />
        </article>
      </div>
    </section>
  )}`
);

// ===================================================================
// 6. Fix heading levels in the .md spec files — change ### to ##
//    and #### to ### for proper hierarchy
// ===================================================================

writeFileSync(templatePath, c, 'utf-8');
console.log('Template duplication fixes applied.');
