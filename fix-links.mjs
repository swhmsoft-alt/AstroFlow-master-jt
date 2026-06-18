import { readFileSync, writeFileSync, existsSync, readdirSync } from 'fs';

const newUrl = 'https://www.bozemetal.com/contact';
const targetAttrs = 'target="_blank" rel="noopener noreferrer"';

let totalChanges = 0;

// 1. Process all service CTA files
console.log('=== Processing /get-a-quote files ===');
const servicesDir = 'src/components/services/';
const allFiles = readdirSync(servicesDir);
const serviceFiles = allFiles.filter(f => f.endsWith('Cta.astro') && f !== 'EngineeringWorkflow.astro');

for (const file of serviceFiles) {
  const filePath = servicesDir + file;
  let content = readFileSync(filePath, 'utf-8');
  const original = content;
  
  content = content.replace(
    /href="\/get-a-quote"/g,
    `href="${newUrl}" ${targetAttrs}`
  );
  
  if (content !== original) {
    writeFileSync(filePath, content);
    totalChanges++;
    console.log(`  ✓ ${file}`);
  }
}

// 2. Process rfq files
console.log('\n=== Processing /rfq files ===');
const rfqFiles = [
  'src/components/Footer.astro',
  'src/components/Header.astro',
  'src/components/home/Hero.astro',
  'src/components/home/CTA.astro',
  'src/components/home/PremiumCTA.astro',
  'src/components/react/MobileMenu.tsx',
  'src/components/services/EngineeringWorkflow.astro',
  'src/components/materials/MaterialTraceability.astro',
  'src/components/capabilities/TraceabilityFoundation.astro',
  'src/components/industries/IndustryCtaSection.astro',
  'src/components/resources/TechnicalFaqAccordion.astro',
  'src/pages/index.astro',
  'src/pages/facilities.astro',
  'src/pages/documentation.astro',
  'src/pages/products/index.astro',
  'src/pages/blog/[...slug].astro',
  'src/pages/blog/index.astro',
  'src/pages/use-cases.astro',
  'src/pages/theme-demo.astro',
  'src/pages/zh/products/index.astro',
  'src/pages/zh/blog/index.astro',
  'src/pages/zh/blog/[...slug].astro',
  'src/pages/[lang]/index.astro',
  'src/pages/zh/index.astro',
];

for (const filePath of rfqFiles) {
  if (!existsSync(filePath)) continue;
  let content = readFileSync(filePath, 'utf-8');
  const original = content;
  
  // Replace href={localizePath('/rfq', currentLang)} or href={localizePath('/rfq', lang)}
  content = content.replace(
    /href=\{localizePath\('\/rfq',\s*(currentLang|lang)\)\}/g,
    `href="${newUrl}" ${targetAttrs}`
  );
  
  // Replace href="/rfq"
  content = content.replace(
    /href="\/rfq"/g,
    `href="${newUrl}" ${targetAttrs}`
  );
  
  // Replace href="/zh/rfq"
  content = content.replace(
    /href="\/zh\/rfq"/g,
    `href="${newUrl}" ${targetAttrs}`
  );
  
  // Replace pageData.primaryCtaLink || '/rfq'
  content = content.replace(
    /pageData\.primaryCtaLink \|\| '\/rfq'/g,
    `pageData.primaryCtaLink || '${newUrl}'`
  );
  
  // Replace primaryCtaLink: '/rfq'
  content = content.replace(
    /primaryCtaLink:\s*'\/rfq'/g,
    `primaryCtaLink: '${newUrl}'`
  );
  
  if (content !== original) {
    writeFileSync(filePath, content);
    totalChanges++;
    console.log(`  ✓ ${filePath}`);
  }
}

// 3. Process content files
console.log('\n=== Processing content files ===');
const contentFiles = [
  'src/content/pages/home.md',
  'src/content/products/aluminum-cnc-parts.md',
];
for (const filePath of contentFiles) {
  if (!existsSync(filePath)) continue;
  let content = readFileSync(filePath, 'utf-8');
  const original = content;
  
  content = content.replace(
    /primaryCtaLink:\s*\/rfq/g,
    `primaryCtaLink: ${newUrl}`
  );
  content = content.replace(
    /btnLink:\s*\/rfq/g,
    `btnLink: ${newUrl}`
  );
  
  if (content !== original) {
    writeFileSync(filePath, content);
    totalChanges++;
    console.log(`  ✓ ${filePath}`);
  }
}

// 4. Process config.ts
console.log('\n=== Processing config.ts ===');
const configFile = 'src/content/config.ts';
if (existsSync(configFile)) {
  let content = readFileSync(configFile, 'utf-8');
  const original = content;
  content = content.replace(
    /z\.string\(\)\.default\('\/rfq'\)/g,
    `z.string().default('${newUrl}')`
  );
  if (content !== original) {
    writeFileSync(configFile, content);
    totalChanges++;
    console.log(`  ✓ config.ts`);
  }
}

console.log(`\n✅ Done! Total files modified: ${totalChanges}`);