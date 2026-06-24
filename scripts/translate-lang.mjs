/**
 * translate-lang.mjs
 *
 * Translate all untranslated entries (still in English) in a target language
 * JSON file using DeepSeek API. Preserves already-translated entries.
 *
 * Usage:
 *   node scripts/translate-lang.mjs <langCode> <languageName>
 *
 * Examples:
 *   node scripts/translate-lang.mjs fr French
 *   node scripts/translate-lang.mjs es Spanish
 *   node scripts/translate-lang.mjs ja Japanese
 *   node scripts/translate-lang.mjs ko Korean
 *   node scripts/translate-lang.mjs pt Portuguese
 *   node scripts/translate-lang.mjs it Italian
 *   node scripts/translate-lang.mjs nl Dutch
 *   node scripts/translate-lang.mjs pl Polish
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const TRANSLATIONS_DIR = path.resolve(__dirname, '../src/i18n/translations');

const DEEPSEEK_API_KEY = 'sk-b187f5cf84c74f9aac8bd04b7fd0d2f8';
const DEEPSEEK_API_URL = 'https://api.deepseek.com/v1/chat/completions';

// ── 1. Parse args ────────────────────────────────────────
const langCode = process.argv[2];
const langName = process.argv[3];

if (!langCode || !langName) {
  console.error('Usage: node scripts/translate-lang.mjs <langCode> <languageName>');
  console.error('Example: node scripts/translate-lang.mjs fr French');
  process.exit(1);
}

const EN_PATH = path.join(TRANSLATIONS_DIR, 'en.json');
const TARGET_PATH = path.join(TRANSLATIONS_DIR, `${langCode}.json`);

if (!fs.existsSync(TARGET_PATH)) {
  console.error(`File not found: ${TARGET_PATH}`);
  process.exit(1);
}

// ── 2. Load files ────────────────────────────────────────
const en = JSON.parse(fs.readFileSync(EN_PATH, 'utf-8'));
const target = JSON.parse(fs.readFileSync(TARGET_PATH, 'utf-8'));

const enKeys = Object.keys(en);
const targetKeys = Object.keys(target);

console.log(`en.json: ${enKeys.length} keys`);
console.log(`${langCode}.json: ${targetKeys.length} keys`);

// ── 3. Identify untranslated entries ─────────────────────
// An entry is "untranslated" if target value === en value
const untranslatedKeys = enKeys.filter(k => {
  if (!(k in target)) return true;  // missing key
  return target[k] === en[k];       // still English placeholder
});

console.log(`\nUntranslated entries (English placeholders): ${untranslatedKeys.length}/${enKeys.length}`);

if (untranslatedKeys.length === 0) {
  console.log('Nothing to translate! All entries are already translated.');
  process.exit(0);
}

// ── 4. Build translation batch ───────────────────────────
const toTranslate = {};
for (const k of untranslatedKeys) {
  toTranslate[k] = en[k];
}

const entries = Object.entries(toTranslate);
console.log(`Sending ${entries.length} entries to DeepSeek API...`);

// ── 5. Call DeepSeek API ─────────────────────────────────
async function translateBatch(items, batchIndex, totalBatches) {
  const jsonInput = JSON.stringify(Object.fromEntries(items), null, 2);

  const prompt = `You are a professional ${langName} translator for an industrial titanium manufacturing website. 
Translate the following English key-value pairs to natural, professional ${langName}.

RULES:
- Keep technical terms/acronyms unchanged: CNC, ISO, AS9100, AS9102, AS9100D, CAD, CAM, DFM, CMM, EDM, SLM, DMLS, OES, MTR, PMI, NDT, FPI, UT, CAPA, IQC, IPQC, FQC, FAIR, GD&T, Cpk, ASTM, AMS, ELI, UID, RFQ, Rfq, BOM, WPS, PQR, NDA, FOB, CIF, TLS, TIG, MIG, SDS, EDI, WMS, HACCP, C-TPAT, ITAR, MTRs
- Keep proper names unchanged: "BOZE CNC Ti", "BOZE CNC", "TechCorp", "Global Manufacturing Inc.", "RetailMax", "Sarah Mitchell", "Robert Johnson", "Emily Williams"
- Keep measurement units and values unchanged: "±0.005 mm", "650 × 650 × 500 mm", "24/7", "500+", "50M+", "99.9%", "Cpk ≥ 1.67", "Ra 0.4 µm", etc.
- Translate the VALUES only (right side of colon), keep the KEYS (left side of colon) exactly as-is
- Use proper ${langName} grammar and terminology
- For technical manufacturing terms, use standard ${langName} industry terminology
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
        { role: 'system', content: `You are a professional ${langName} translator for industrial/manufacturing content. Return ONLY valid JSON.` },
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

// ── 6. Process in batches ────────────────────────────────
const BATCH_SIZE = 30;
const batches = [];
for (let i = 0; i < entries.length; i += BATCH_SIZE) {
  batches.push(entries.slice(i, i + BATCH_SIZE));
}

console.log(`Total batches: ${batches.length}`);
let translatedCount = 0;
let errorCount = 0;

for (let i = 0; i < batches.length; i++) {
  console.log(`\nBatch ${i + 1}/${batches.length} (${batches[i].length} entries)...`);
  try {
    const result = await translateBatch(batches[i], i, batches.length);
    for (const [key, value] of Object.entries(result)) {
      if (key in target && value && typeof value === 'string') {
        target[key] = value;
        translatedCount++;
      }
    }
    console.log(`  ✓ Batch ${i + 1} done`);
  } catch (err) {
    console.error(`  ✗ Batch ${i + 1} failed: ${err.message}`);
    errorCount++;
  }
  
  if (i < batches.length - 1) {
    await new Promise(r => setTimeout(r, 500));
  }
}

console.log(`\nTranslation complete:`);
console.log(`  Translated: ${translatedCount} entries`);
console.log(`  Errors: ${errorCount} batches`);

// ── 7. Write updated file ────────────────────────────────
const sorted = {};
for (const k of Object.keys(target).sort()) {
  sorted[k] = target[k];
}
fs.writeFileSync(TARGET_PATH, JSON.stringify(sorted, null, 2), 'utf-8');
console.log(`\n✓ ${langCode}.json updated (${Object.keys(sorted).length} keys)`);

// ── 8. Final summary ─────────────────────────────────────
const stillUntranslated = enKeys.filter(k => sorted[k] === en[k]);
console.log(`  Still untranslated: ${stillUntranslated.length}/${enKeys.length}`);
if (stillUntranslated.length > 0) {
  console.log(`  Progress: ${Math.round((1 - stillUntranslated.length / enKeys.length) * 100)}% complete`);
} else {
  console.log(`  🎉 100% complete!`);
}
