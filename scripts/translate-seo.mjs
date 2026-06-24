/**
 * translate-seo.mjs
 *
 * Extend SEO_CONFIG from { en, zh } to support all 10 languages.
 * Reads the current seo.ts, extracts en values, translates to target
 * languages via DeepSeek API, then regenerates seo.ts.
 *
 * Usage:
 *   node scripts/translate-seo.mjs
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SEO_TS_PATH = path.resolve(__dirname, '../src/config/seo.ts');

const DEEPSEEK_API_KEY = 'sk-b187f5cf84c74f9aac8bd04b7fd0d2f8';
const DEEPSEEK_API_URL = 'https://api.deepseek.com/v1/chat/completions';

// Target languages (excluding en - source)
// de was missing from original SEO_CONFIG, translating via API too
const TARGET_LANGS = [
  { code: 'de', name: 'German' },
  { code: 'zh', name: 'Chinese' },
  { code: 'ja', name: 'Japanese' },
  { code: 'fr', name: 'French' },
  { code: 'es', name: 'Spanish' },
  { code: 'pt', name: 'Portuguese' },
  { code: 'it', name: 'Italian' },
  { code: 'ko', name: 'Korean' },
  { code: 'nl', name: 'Dutch' },
  { code: 'pl', name: 'Polish' },
];

// ── 1. Extract all SEO entries from current file ────────
// We parse the TypeScript to extract path → { en title, en desc }
// Reading the file line by line, looking for route patterns

let content = fs.readFileSync(SEO_TS_PATH, 'utf-8');

// Extract route entries using regex
const routeRegex = /'([^']+)':\s*\{[\s\S]*?title:\s*\{[\s\S]*?en:\s*'([^']*)'[\s\S]*?zh:\s*'([^']*)'[\s\S]*?\}[\s\S]*?description:\s*\{[\s\S]*?en:\s*'([^']*)'[\s\S]*?zh:\s*'([^']*)'[\s\S]*?\}[\s\S]*?(?:ogImage:\s*'([^']*)')?[\s\S]*?\},/g;

const routes = [];
let match;
while ((match = routeRegex.exec(content)) !== null) {
  routes.push({
    path: match[1],
    enTitle: match[2],
    enDesc: match[4],
    zhTitle: match[3],
    zhDesc: match[5],
    ogImage: match[6] || null,
  });
}

console.log(`Found ${routes.length} routes with SEO data\n`);

// Process each language
const allTranslations = {};

for (const { code, name } of TARGET_LANGS) {
  console.log(`\n===== Translating to ${name} (${code}) =====`);
  allTranslations[code] = { titles: {}, descriptions: {} };

  // Build batch: title + description pairs
  const items = routes.map((r, i) => ({
    id: i,
    path: r.path,
    title: r.enTitle,
    description: r.enDesc,
  }));

  const BATCH_SIZE = 25;
  const batches = [];
  for (let i = 0; i < items.length; i += BATCH_SIZE) {
    batches.push(items.slice(i, i + BATCH_SIZE));
  }

  console.log(`Total items: ${items.length}, batches: ${batches.length}`);

  for (let b = 0; b < batches.length; b++) {
    const batch = batches[b];
    const jsonInput = JSON.stringify(
      Object.fromEntries(batch.map(item => [item.path, { title: item.title, description: item.description }])),
      null, 2
    );

    const prompt = `You are a professional SEO translator for an industrial titanium manufacturing website. 
Translate the following English SEO meta titles and descriptions to natural, professional ${name}.

RULES:
- Keep technical terms/acronyms unchanged: CNC, ISO, AS9100, AS9100D, CAD, CAM, DFM, CMM, EDM, SLM, DMLS, OES, MTR, PMI, NDT, FPI, UT, CAPA, IQC, IPQC, FQC, FAIR, GD&T, Cpk, ASTM, AMS, ELI, UID, RFQ, Rfq, BOM, WPS, PQR, NDA, FOB, CIF, TLS, TIG, MIG, SDS, EDI, WMS, HACCP, C-TPAT, ITAR, AWS, ASME, MAO, VCI, ISTA, UDI, MOQ, SPC, HAZ, TIG, MTRs
- Keep proper names unchanged: "BOZE CNC Ti", "BOZE CNC"
- Keep measurement units and values unchanged: "±0.005 mm", "650 × 650 × 500 mm", "24/7", "500+", "50M+", "99.9%", "Cpk ≥ 1.67", etc
- DO NOT translate the keys (path names) - only translate title and description values
- Use proper ${name} grammar and terminology
- SEO titles should be compelling and include "| BOZE CNC Ti" suffix
- Return ONLY a JSON object with the same structure: { path: { title: "...", description: "..." } }

Batch ${b + 1}/${batches.length}:

\`\`\`json
${jsonInput}
\`\`\``;

    console.log(`  Batch ${b + 1}/${batches.length} (${batch.length} items)...`);

    try {
      const response = await fetch(DEEPSEEK_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${DEEPSEEK_API_KEY}`,
        },
        body: JSON.stringify({
          model: 'deepseek-chat',
          messages: [
            { role: 'system', content: `You are a professional ${name} SEO translator for industrial/manufacturing content. Return ONLY valid JSON.` },
            { role: 'user', content: prompt },
          ],
          temperature: 0.1,
          max_tokens: 16000,
        }),
      });

      if (!response.ok) {
        const errText = await response.text();
        throw new Error(`API error ${response.status}: ${errText}`);
      }

      const data = await response.json();
      const resultContent = data.choices[0].message.content.trim();
      
      const jsonMatch = resultContent.match(/```(?:json)?\s*([\s\S]*?)\s*```/) || resultContent.match(/{[\s\S]*}/);
      const jsonStr = jsonMatch ? jsonMatch[1] || jsonMatch[0] : resultContent;
      const result = JSON.parse(jsonStr);

      for (const [routePath, translations] of Object.entries(result)) {
        if (translations.title) allTranslations[code].titles[routePath] = translations.title;
        if (translations.description) allTranslations[code].descriptions[routePath] = translations.description;
      }
      console.log(`    ✓ Batch ${b + 1} done`);
    } catch (err) {
      console.error(`    ✗ Batch ${b + 1} failed: ${err.message}`);
    }

    if (b < batches.length - 1) {
      await new Promise(r => setTimeout(r, 600));
    }
  }
  
  const titleCount = Object.keys(allTranslations[code].titles).length;
  const descCount = Object.keys(allTranslations[code].descriptions).length;
  console.log(`  ✓ ${code}: ${titleCount} titles, ${descCount} descriptions translated`);
}

// ── 2. Generate new seo.ts ──────────────────────────────

// Build the AllLangs type
const allLangCodes = ['en', 'de', 'zh', 'ja', 'fr', 'es', 'pt', 'it', 'ko', 'nl', 'pl'];

// Generate the file content
let newContent = `/**
 * SEO Configuration — Centralized management for all fixed pages.
 *
 * Usage: SEO_CONFIG is auto-resolved by BaseLayout.astro.
 * Each key is the canonical path (no lang prefix).
 * title/description are defined per language.
 */
export interface SeoEntry {
  title?: { ${allLangCodes.map(c => `${c}: string`).join('; ')} };
  description?: { ${allLangCodes.map(c => `${c}: string`).join('; ')} };
  /** Override OG image for this page (relative to site URL) */
  ogImage?: string;
}

export const SEO_CONFIG: Record<string, SeoEntry> = {\n`;

for (const route of routes) {
  newContent += `  '${route.path}': {\n`;
  
  // Generate title block
  newContent += `    title: {\n`;
  newContent += `      en: '${route.enTitle.replace(/'/g, "\\'")}',\n`;
  // For non-en languages, use translated if available, else fallback to English
  for (const lang of ['de', 'zh', 'ja', 'fr', 'es', 'pt', 'it', 'ko', 'nl', 'pl']) {
    const fallbackTitle = lang === 'zh' ? route.zhTitle : route.enTitle;
    const translated = allTranslations[lang]?.titles[route.path];
    newContent += `      ${lang}: '${(translated || fallbackTitle).replace(/'/g, "\\'")}',\n`;
  }
  newContent += `    },\n`;

  // Generate description block
  newContent += `    description: {\n`;
  newContent += `      en: '${route.enDesc.replace(/'/g, "\\'")}',\n`;
  for (const lang of ['de', 'zh', 'ja', 'fr', 'es', 'pt', 'it', 'ko', 'nl', 'pl']) {
    const fallbackDesc = lang === 'zh' ? route.zhDesc : route.enDesc;
    const translated = allTranslations[lang]?.descriptions[route.path];
    newContent += `      ${lang}: '${(translated || fallbackDesc).replace(/'/g, "\\'")}',\n`;
  }
  newContent += `    },\n`;

  if (route.ogImage) {
    newContent += `    ogImage: '${route.ogImage}',\n`;
  }

  newContent += `  },\n`;
}

newContent += `};\n`;

fs.writeFileSync(SEO_TS_PATH, newContent, 'utf-8');
console.log(`\n✅ seo.ts regenerated with all ${allLangCodes.length} languages for ${routes.length} routes`);
