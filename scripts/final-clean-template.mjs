import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const p = join(__dirname, '..', 'src', 'pages', 'products', 'product-entities', '[...slug].astro');
let c = readFileSync(p, 'utf-8');

const NL = '\r\n';

// 1. Add imports
c = c.replace(
  "import BaseLayout from '../../../layouts/BaseLayout.astro';",
  "import BaseLayout from '../../../layouts/BaseLayout.astro';" + NL +
  "import LegacyEntityContent from '../../../components/product/LegacyEntityContent.astro';" + NL +
  "import RichEntityContent from '../../../components/product/RichEntityContent.astro';"
);

// 2. Fix getStaticPaths
c = c.replace(
  "entry.slug || entry.id?.replace('.json','') || undefined",
  "entry.slug || entry.id?.replace(/\\.(json|md)$/, '') || undefined"
);

// 3. Add spec matching logic
c = c.replace(
  `// FAQ${NL}const faqData = data.faq || [];${NL}${NL}// JSON-LD`,
  `// FAQ${NL}const faqData = data.faq || [];${NL}${NL}// Load matching product spec for rich blueprint injection${NL}const allSpecs = await getCollection('product-specs');${NL}const specSlug = entry.slug || entry.id?.replace(/\\.(json|md)$/, '').split('/').pop();${NL}const specEntry = allSpecs.find(s => s.slug === specSlug);${NL}let SpecContent;${NL}if (specEntry) {${NL}  const rendered = await specEntry.render();${NL}  SpecContent = rendered.Content;${NL}}${NL}${NL}// JSON-LD`
);

// 4. Replace all of sections 1-3 with conditional component rendering
const section1Start = c.indexOf('<!-- ── SECTION 1: Quick Spec Bar');
const section4Start = c.indexOf('<!-- ── SECTION 4: Shared Knowledge Links');

if (section1Start === -1 || section4Start === -1) {
  console.error('Could not find section markers');
  process.exit(1);
}

const beforeSections = c.substring(0, section1Start);
const afterSections = c.substring(section4Start);

c = beforeSections + 
  '{specEntry && <RichEntityContent data={data} system={system} SpecContent={SpecContent} />}' + NL + NL +
  '{!specEntry && <LegacyEntityContent data={data} system={system} material={material} allCaps={allCaps} faqData={faqData} />}' + NL + NL +
  '  <!-- ── SECTION 4: Shared Knowledge Links' +
  afterSections;

writeFileSync(p, c, 'utf-8');
console.log('Clean template written successfully.');
