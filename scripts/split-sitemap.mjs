/**
 * split-sitemap.mjs
 *
 * Post-build script that splits the Astro-generated sitemap-0.xml
 * into per-language sitemap files and rewrites sitemap-index.xml
 * to reference them.
 *
 * Usage:  node scripts/split-sitemap.mjs
 * (Run after `astro build`, or chained: astro build && node scripts/split-sitemap.mjs)
 */

import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DIST = join(__dirname, '..', 'dist');

// Languages (must match src/i18n/ui.ts)
const LANGUAGES = [
  'en', 'de', 'ja', 'fr', 'es', 'pt', 'it', 'ko', 'nl', 'pl', 'ru', 'ar',
];

const SITEMAP_0 = join(DIST, 'sitemap-0.xml');
const SITEMAP_INDEX = join(DIST, 'sitemap-index.xml');
const SITE_URL = 'https://cnc.bozemetal.com';

if (!existsSync(SITEMAP_0)) {
  console.error(`[split-sitemap] ERROR: ${SITEMAP_0} not found. Run astro build first.`);
  process.exit(1);
}

// --- 1. Read all URLs from sitemap-0.xml ---
const raw = readFileSync(SITEMAP_0, 'utf-8');

// Extract <loc> content
const urlRegex = /<loc>([^<]+)<\/loc>/g;
const allUrls = [];
let match;
while ((match = urlRegex.exec(raw)) !== null) {
  allUrls.push(match[1]);
}

console.log(`[split-sitemap] Found ${allUrls.length} URLs total`);

// --- 2. Group URLs by language ---
const grouped = {};
for (const lang of LANGUAGES) {
  grouped[lang] = [];
}

for (const url of allUrls) {
  const path = new URL(url).pathname;
  // Detect language prefix: /en/..., /de/..., etc.
  const firstSegment = path.split('/').filter(Boolean)[0] || '';
  if (LANGUAGES.includes(firstSegment)) {
    grouped[firstSegment].push(url);
  } else {
    // No prefix → default language (en)
    grouped['en'].push(url);
  }
}

console.log('[split-sitemap] URL counts per language:');
for (const lang of LANGUAGES) {
  console.log(`  ${lang}: ${grouped[lang].length}`);
}

// --- 3. Write per-language sitemap files ---
const lastmod = new Date().toISOString();

for (const lang of LANGUAGES) {
  const urls = grouped[lang];
  if (urls.length === 0) continue;

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(u => `  <url>\n    <loc>${u}</loc>\n    <lastmod>${lastmod}</lastmod>\n  </url>`).join('\n')}
</urlset>`;

  const filePath = join(DIST, `sitemap-${lang}.xml`);
  writeFileSync(filePath, xml, 'utf-8');
  console.log(`[split-sitemap] Written ${filePath}`);
}

// --- 4. Rewrite sitemap-index.xml ---
const indexEntries = LANGUAGES
  .filter(lang => grouped[lang].length > 0)
  .map(lang => `  <sitemap>\n    <loc>${SITE_URL}/sitemap-${lang}.xml</loc>\n    <lastmod>${lastmod}</lastmod>\n  </sitemap>`)
  .join('\n');

const indexXml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${indexEntries}
</sitemapindex>`;

writeFileSync(SITEMAP_INDEX, indexXml, 'utf-8');
console.log(`[split-sitemap] Updated ${SITEMAP_INDEX}`);

// --- 5. Clean up the original combined sitemap ---
// Keep sitemap-0.xml as a backup, or delete it:
// unlinkSync(SITEMAP_0);
// console.log(`[split-sitemap] Removed ${SITEMAP_0}`);

console.log('[split-sitemap] Done.');