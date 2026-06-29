/**
 * translate-new-keys.mjs
 *
 * Translates the 31 newly added keys (ProductionVolumeDashboard + InterBatchRepeatability)
 * into all 9 non-English languages using DeepSeek API.
 *
 * Usage: node scripts/translate-new-keys.mjs
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const EN_JSON = path.resolve(__dirname, '../src/i18n/translations/en.json');
const LANGS_DIR = path.resolve(__dirname, '../src/i18n/translations');

const DEEPSEEK_API_KEY = 'sk-b187f5cf84c74f9aac8bd04b7fd0d2f8';
const DEEPSEEK_API_URL = 'https://api.deepseek.com/v1/chat/completions';

// Target languages and their identifiers
const TARGET_LANGS = {
  de: { name: 'German', flag: 'DE' },
  fr: { name: 'French', flag: 'FR' },
  es: { name: 'Spanish', flag: 'ES' },
  pt: { name: 'Portuguese', flag: 'PT' },
  it: { name: 'Italian', flag: 'IT' },
  ko: { name: 'Korean', flag: 'KO' },
  nl: { name: 'Dutch', flag: 'NL' },
  pl: { name: 'Polish', flag: 'PL' },
  ja: { name: 'Japanese', flag: 'JA' },
};

const en = JSON.parse(fs.readFileSync(EN_JSON, 'utf-8'));

// Identify the 31 newly added keys (keep pre-existing ones as reference)
const NEW_KEY_PREFIXES = [
  'services.productionvolumedashboard.badge',
  'services.productionvolumedashboard.subtitle',
  'services.productionvolumedashboard.footnote',
  'services.productionvolumedashboard.0.',
  'services.productionvolumedashboard.1.',
  'services.productionvolumedashboard.2.',
  'services.productionvolumedashboard.3.',
  'services.interbatchrepeatability.badge',
  'services.interbatchrepeatability.subtitle',
  'services.interbatchrepeatability.0.',
  'services.interbatchrepeatability.1.',
];

const NEW_KEYS = Object.keys(en).filter(k => 
  NEW_KEY_PREFIXES.some(prefix => k.startsWith(prefix))
);

console.log(`Found ${NEW_KEYS.length} new keys to translate:`);
NEW_KEYS.forEach(k => console.log(`  ${k}`));

// ── Translation function ──────────────────────────────────
async function translateBatch(lang, langInfo, items, batchIndex, totalBatches) {
  const jsonInput = JSON.stringify(Object.fromEntries(items), null, 2);

  const prompt = `You are a professional ${langInfo.name} translator for an industrial titanium manufacturing website.
Translate the following English key-value pairs to natural, professional ${langInfo.name} (${langInfo.flag}).

RULES:
- Keep technical terms/acronyms unchanged: CNC, ISO, AS9100, AS9102, AS9100D, CAD, CAM, DFM, CMM, EDM, SLM, DMLS, SPC, OES, MTR, PMI, NDT, UCL, LCL, ASTM, AMS, ELI, UID, RFQ, Rfq, BOM, WPS, PQR, NDA, FOB, CIF
- Keep measurement units and values unchanged: "±0.1 mm", "10 – 1,000+", "400W x 4", "≥95%", "250 x 250 mm", "20 µm", "15-45 µm", "45-90 µm", "±5%", "O₂ ≤0.20%", "N₂ ≤0.05%", "±3σ", "X-bar and R charts", etc.
- Keep material grades and part numbers unchanged: "Ti-6Al-4V", "Grade 23", "ASTM F2924", "ASTM E8", "ASTM B822", "ASTM E1409", "ASME Y14.5"
- Keep proper names unchanged: "LECO"
- Translate the VALUES only (right side of colon), keep the KEYS (left side of colon) exactly as-is
- Use proper ${langInfo.name} grammar and terminology
- For technical manufacturing terms, use standard ${langInfo.name} industry terminology
- Return ONLY a JSON object with the same keys and translated values

Here is the batch ${batchIndex + 1}/${totalBatches}:

\`\`\`json
${jsonInput}
\`\`\``;

  const response = await fetch(DEEPSEEK_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${DEEPSEEK_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'deepseek-chat',
      messages: [
        { role: 'system', content: `You are a professional ${langInfo.name} translator for industrial/manufacturing content. Return ONLY valid JSON.` },
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
  const content = data.choices[0].message.content.trim();
  
  // Parse JSON from response (handle potential markdown wrapping)
  const jsonMatch = content.match(/```(?:json)?\s*([\s\S]*?)\s*```/) || content.match(/{[\s\S]*}/);
  const jsonStr = jsonMatch ? jsonMatch[1] || jsonMatch[0] : content;
  
  try {
    return JSON.parse(jsonStr);
  } catch (e) {
    console.error(`Failed to parse response for batch ${batchIndex + 1}:`);
    console.error(content.slice(0, 500));
    throw e;
  }
}

// ── Process each language ─────────────────────────────────
async function run() {
  const BATCH_SIZE = 31; // All 31 keys in one batch since they're short

  for (const [langCode, langInfo] of Object.entries(TARGET_LANGS)) {
    const langPath = path.join(LANGS_DIR, `${langCode}.json`);
    const langData = JSON.parse(fs.readFileSync(langPath, 'utf-8'));
    
    // Identify only the NEW keys that need translation (currently English)
    const toTranslate = NEW_KEYS.filter(k => langData[k] === en[k]);
    
    if (toTranslate.length === 0) {
      console.log(`\n${langCode} (${langInfo.name}): No new keys to translate, skipping.`);
      continue;
    }
    
    console.log(`\n${langCode} (${langInfo.name}): ${toTranslate.length} keys to translate...`);
    
    const entries = toTranslate.map(k => [k, en[k]]);
    let translatedCount = 0;
    let errorCount = 0;
    
    for (let i = 0; i < entries.length; i += BATCH_SIZE) {
      const batch = entries.slice(i, i + BATCH_SIZE);
      const batchNum = Math.floor(i / BATCH_SIZE) + 1;
      const totalBatches = Math.ceil(entries.length / BATCH_SIZE);
      
      console.log(`  Batch ${batchNum}/${totalBatches} (${batch.length} entries)...`);
      try {
        const result = await translateBatch(langCode, langInfo, batch, batchNum, totalBatches);
        for (const [key, value] of Object.entries(result)) {
          if (key in langData && value && typeof value === 'string') {
            langData[key] = value;
            translatedCount++;
          }
        }
        console.log(`  ✓ Batch ${batchNum} done`);
      } catch (err) {
        console.error(`  ✗ Batch ${batchNum} failed: ${err.message}`);
        errorCount++;
      }
      
      if (i + BATCH_SIZE < entries.length) {
        await new Promise(r => setTimeout(r, 1000));
      }
    }
    
    // Write updated file with sorted keys
    const sortedData = {};
    for (const k of Object.keys(langData).sort()) {
      sortedData[k] = langData[k];
    }
    
    fs.writeFileSync(langPath, JSON.stringify(sortedData, null, 2), 'utf-8');
    console.log(`  ✓ ${langCode}.json written (${translatedCount} translated, ${errorCount} errors)`);
    
    // Small delay between languages
    await new Promise(r => setTimeout(r, 2000));
  }
  
  console.log('\n=== All languages processed ===');
}

run().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});