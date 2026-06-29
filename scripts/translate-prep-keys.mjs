/**
 * Translate newly added prep-process keys in en.json to 9 target languages
 * using DeepSeek API.
 *
 * New keys:
 *   services.prepprocessspectrum.*
 *   services.prepspecsdashboard.*
 *   (excluding already-existing keys: services.prepprocessspectrum.preparation_spectrum
 *    and services.prepspecsdashboard.capacity_dashboard_5)
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const TRANSLATIONS_DIR = path.resolve(__dirname, '../src/i18n/translations');

const DEEPSEEK_API_KEY = 'sk-b187f5cf84c74f9aac8bd04b7fd0d2f8';
const DEEPSEEK_API_URL = 'https://api.deepseek.com/v1/chat/completions';

// Target languages (excluding English which is the source)
const TARGET_LANGS = ['ja', 'de', 'fr', 'es', 'pt', 'it', 'ko', 'nl', 'pl'];

const LANG_NAMES = {
  ja: 'Japanese',
  de: 'German',
  fr: 'French',
  es: 'Spanish',
  pt: 'Portuguese',
  it: 'Italian',
  ko: 'Korean',
  nl: 'Dutch',
  pl: 'Polish'
};

// Keys to translate (the new ones we added)
const NEW_PREFIXES = ['services.prepprocessspectrum.', 'services.prepspecsdashboard.'];

// Keys that already existed and should NOT be re-translated
const EXISTING_KEYS = new Set([
  'services.prepprocessspectrum.preparation_spectrum',
  'services.prepspecsdashboard.capacity_dashboard_5'
]);

async function translateBatch(entries, targetLang, langName, batchIndex, totalBatches) {
  const jsonInput = JSON.stringify(Object.fromEntries(entries), null, 2);

  const prompt = `You are a professional translator for an industrial titanium manufacturing website.
Translate the following English key-value pairs to ${langName} (${targetLang}).

RULES:
- Keep technical terms/acronyms unchanged: CNC, ISO, AS9100, AS9100D, CAD, CAM, CMM, EDM, NDT, PMI, XRF, ASTM, AMS, ELI, Ra, HRC, HF, HNO₃, HAZ, NDT, MPa, GPa, UTS
- Keep measurement units and values unchanged: "ø 800", "±0.5", "0.5 – 3.0", "100%", "mm", "PMI Validated", "Ra 1.6-3.2 µm", etc.
- Keep proper names unchanged: "BOZE CNC Ti", "BOZE CNC", "Olympus"
- Keep chemical formulas unchanged: "HF/HNO₃", "TiO₂", "AlTiN", etc.
- Translate the VALUES only (right side of colon), keep the KEYS (left side of colon) exactly as-is
- Use natural, professional technical language in ${langName}
- For ${targetLang === 'ja' ? 'Japanese' : targetLang === 'ko' ? 'Korean' : langName}, use proper industry terminology
- Return ONLY a valid JSON object with the same keys and translated values

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

async function translateLanguage(targetLang) {
  const langName = LANG_NAMES[targetLang];
  console.log(`\n=== Translating to ${langName} (${targetLang}) ===`);

  // Load English source
  const enPath = path.join(TRANSLATIONS_DIR, 'en.json');
  const en = JSON.parse(fs.readFileSync(enPath, 'utf-8'));

  // Load target language file (or create empty)
  const targetPath = path.join(TRANSLATIONS_DIR, `${targetLang}.json`);
  let target = {};
  if (fs.existsSync(targetPath)) {
    target = JSON.parse(fs.readFileSync(targetPath, 'utf-8'));
  }

  // Collect new keys that need translation
  const newEntries = [];
  for (const [key, value] of Object.entries(en)) {
    // Check if it's one of our new keys
    const isNew = NEW_PREFIXES.some(prefix => key.startsWith(prefix)) && !EXISTING_KEYS.has(key);
    if (isNew) {
      // Check if already translated (value differs from English)
      const existing = target[key];
      if (!existing || existing === value) {
        newEntries.push([key, value]);
      }
    }
  }

  console.log(`  New keys needing translation: ${newEntries.length}`);

  if (newEntries.length === 0) {
    console.log('  No new keys to translate.');
    return;
  }

  // Process in batches of 15
  const BATCH_SIZE = 15;
  const batches = [];
  for (let i = 0; i < newEntries.length; i += BATCH_SIZE) {
    batches.push(newEntries.slice(i, i + BATCH_SIZE));
  }

  console.log(`  Batches: ${batches.length}`);

  let translatedCount = 0;
  let errorCount = 0;

  for (let i = 0; i < batches.length; i++) {
    console.log(`  Batch ${i + 1}/${batches.length} (${batches[i].length} entries)...`);
    try {
      const result = await translateBatch(batches[i], targetLang, langName, i, batches.length);
      for (const [key, value] of Object.entries(result)) {
        if (value && typeof value === 'string') {
          target[key] = value;
          translatedCount++;
        }
      }
      console.log(`    ✓ Batch ${i + 1} done`);
    } catch (err) {
      console.error(`    ✗ Batch ${i + 1} failed: ${err.message}`);
      errorCount++;
    }

    // Small delay between batches
    if (i < batches.length - 1) {
      await new Promise(r => setTimeout(r, 500));
    }
  }

  // Write updated file with sorted keys
  const sortedTarget = {};
  for (const k of Object.keys(target).sort()) {
    sortedTarget[k] = target[k];
  }
  fs.writeFileSync(targetPath, JSON.stringify(sortedTarget, null, 2), 'utf-8');
  console.log(`  ✓ ${targetLang}.json written (${Object.keys(sortedTarget).length} keys)`);
  console.log(`  Translated: ${translatedCount}, Errors: ${errorCount}`);
}

async function main() {
  console.log('Starting translation of prep-process keys...\n');
  console.log(`New key prefixes: ${NEW_PREFIXES.join(', ')}`);
  console.log(`Target languages: ${TARGET_LANGS.join(', ')}`);

  for (const lang of TARGET_LANGS) {
    try {
      await translateLanguage(lang);
    } catch (err) {
      console.error(`Failed to process ${lang}: ${err.message}`);
    }
  }

  console.log('\n=== Translation Complete ===');
}

main().catch(console.error);