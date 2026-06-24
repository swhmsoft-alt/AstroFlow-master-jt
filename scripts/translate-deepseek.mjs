/**
 * Translate untranslated German entries in de.json using DeepSeek API.
 *
 * Workflow:
 * 1. Load en.json and de.json
 * 2. Identify entries where de value == en value (untranslated)
 * 3. Batch translate via DeepSeek API
 * 4. Preserve already-translated German entries
 * 5. Write updated de.json
 * 6. Verify build
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const EN_JSON = path.resolve(__dirname, '../src/i18n/translations/en.json');
const DE_JSON = path.resolve(__dirname, '../src/i18n/translations/de.json');

const DEEPSEEK_API_KEY = 'sk-b187f5cf84c74f9aac8bd04b7fd0d2f8';
const DEEPSEEK_API_URL = 'https://api.deepseek.com/v1/chat/completions';

// ── 1. Load files ───────────────────────────────────────
const en = JSON.parse(fs.readFileSync(EN_JSON, 'utf-8'));
const de = JSON.parse(fs.readFileSync(DE_JSON, 'utf-8'));

const enKeys = Object.keys(en);
const deKeys = Object.keys(de);

console.log(`en.json: ${enKeys.length} keys`);
console.log(`de.json: ${deKeys.length} keys`);

// ── 2. Identify untranslated entries ────────────────────
// An entry is "untranslated" if the de value exactly matches the en value
// or if it contains no German-specific characters (ü, ö, ä, ß, etc.)
const GERMAN_CHARS = /[üöäßÜÖÄß]/;

function isProbablyGerman(text) {
  return GERMAN_CHARS.test(text);
}

const untranslatedKeys = enKeys.filter(k => {
  if (!(k in de)) return true;  // missing
  const deVal = de[k];
  const enVal = en[k];
  if (deVal === enVal) return true;  // exactly same = untranslated
  if (!isProbablyGerman(deVal)) return true;  // no German chars = probably English
  return false;
});

// Categorize
const exactMatch = enKeys.filter(k => k in de && de[k] === en[k]);
const mixedOrEnglish = enKeys.filter(k => {
  if (!(k in de)) return false;
  return de[k] !== en[k] && !isProbablyGerman(de[k]);
});

console.log(`\nUntranslated analysis:`);
console.log(`  Exact English match: ${exactMatch.length}`);
console.log(`  Mixed/English (no German chars): ${mixedOrEnglish.length}`);
console.log(`  Already German: ${enKeys.length - exactMatch.length - mixedOrEnglish.length}`);
console.log(`  Total needing translation: ${exactMatch.length + mixedOrEnglish.length}`);

// ── 3. Build translation batch ──────────────────────────
const toTranslate = {};
for (const k of exactMatch) {
  toTranslate[k] = en[k];
}
for (const k of mixedOrEnglish) {
  toTranslate[k] = en[k];
}

const entries = Object.entries(toTranslate);
console.log(`\nSending ${entries.length} entries to DeepSeek API...`);

// ── 4. Call DeepSeek API ────────────────────────────────
async function translateBatch(items, batchIndex, totalBatches) {
  const jsonInput = JSON.stringify(Object.fromEntries(items), null, 2);

  const prompt = `You are a professional German translator for an industrial titanium manufacturing website. 
Translate the following English key-value pairs to natural, professional German.

RULES:
- Keep technical terms/acronyms unchanged: CNC, ISO, AS9100, AS9102, AS9100D, CAD, CAM, DFM, CMM, EDM, SLM, DMLS, OES, MTR, PMI, NDT, FPI, UT, CAPA, IQC, IPQC, FQC, FAIR, GD&T, Cpk, ASTM, AMS, ELI, UID, RFQ, Rfq, BOM, WPS, PQR, NDA, FOB, CIF, TLS, TIG, MIG, SDS, EDI, WMS, HACCP, C-TPAT, ITAR, MTRs
- Keep proper names unchanged: "BOZE CNC Ti", "BOZE CNC", "TechCorp", "Global Manufacturing Inc.", "RetailMax", "Sarah Mitchell", "Robert Johnson", "Emily Williams"
- Keep measurement units and values unchanged: "±0.005 mm", "650 × 650 × 500 mm", "24/7", "500+", "50M+", "99.9%", "Cpk ≥ 1.67", "Ra 0.4 µm", etc.
- Translate the VALUES only (right side of colon), keep the KEYS (left side of colon) exactly as-is
- Use proper German grammar and terminology
- For technical manufacturing terms, use standard German industry terminology
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
        { role: 'system', content: 'You are a professional German translator for industrial/manufacturing content. Return ONLY valid JSON.' },
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

// ── 5. Process in batches ───────────────────────────────
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
      if (key in de && value && typeof value === 'string') {
        de[key] = value;
        translatedCount++;
      }
    }
    console.log(`  ✓ Batch ${i + 1} done`);
  } catch (err) {
    console.error(`  ✗ Batch ${i + 1} failed: ${err.message}`);
    errorCount++;
  }
  
  // Small delay between batches to avoid rate limiting
  if (i < batches.length - 1) {
    await new Promise(r => setTimeout(r, 500));
  }
}

console.log(`\nTranslation complete:`);
console.log(`  Translated: ${translatedCount} entries`);
console.log(`  Errors: ${errorCount} batches`);

// ── 6. Write updated de.json ────────────────────────────
// Sort keys alphabetically for consistency
const sortedDe = {};
for (const k of Object.keys(de).sort()) {
  sortedDe[k] = de[k];
}

fs.writeFileSync(DE_JSON, JSON.stringify(sortedDe, null, 2), 'utf-8');
console.log(`\n✓ Updated de.json written (${Object.keys(sortedDe).length} keys)`);

// ── 7. Final summary ────────────────────────────────────
const finalGermanCount = Object.values(sortedDe).filter(v => isProbablyGerman(v)).length;
console.log(`  Entries with German characters: ${finalGermanCount}/${Object.keys(sortedDe).length}`);