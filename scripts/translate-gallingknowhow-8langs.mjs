/**
 * Translate GallingColorVariationKnowHow keys for all 8 target languages using DeepSeek API.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const TRANSLATIONS_DIR = path.resolve(__dirname, '../src/i18n/translations');
const EN_JSON = path.resolve(TRANSLATIONS_DIR, 'en.json');

const DEEPSEEK_API_KEY = 'sk-b187f5cf84c74f9aac8bd04b7fd0d2f8';
const DEEPSEEK_API_URL = 'https://api.deepseek.com/v1/chat/completions';

const TARGET_LANGS = ['de', 'fr', 'es', 'pt', 'it', 'ko', 'nl', 'pl'];

const LANG_NAMES = {
  de: 'German', fr: 'French', es: 'Spanish', pt: 'Portuguese',
  it: 'Italian', ko: 'Korean', nl: 'Dutch', pl: 'Polish'
};

const PREFIX = 'services.gallingcolorvariationknowhow.';

// Keys that already have proper translations (not auto-sync)
const ALREADY_DONE = [
  'challenge_6', 'color_variation_control',
  'precision_voltage_engineering_meets_repeatable',
  'solution_6', 'engineering_know_how'
];

const en = JSON.parse(fs.readFileSync(EN_JSON, 'utf-8'));

// Get only the new keys that need translation
const relevantKeys = Object.keys(en).filter(k =>
  k.startsWith(PREFIX) && !ALREADY_DONE.some(d => k === PREFIX + d)
);

console.log(`Found ${relevantKeys.length} keys needing translation for gallingcolorvariationknowhow`);

async function translateForLang(lang) {
  console.log(`\n${'='.repeat(60)}`);
  console.log(`Translating to ${LANG_NAMES[lang]} (${lang})`);
  console.log(`${'='.repeat(60)}`);

  const langFile = path.resolve(TRANSLATIONS_DIR, `${lang}.json`);
  const langData = JSON.parse(fs.readFileSync(langFile, 'utf-8'));

  // Find which of our keys are still English (not yet translated)
  const untranslated = relevantKeys.filter(k => {
    if (!(k in langData)) return true;
    return langData[k] === en[k];
  });

  console.log(`${untranslated.length} keys need translation`);

  if (untranslated.length === 0) {
    console.log('Nothing to translate - all done!');
    return;
  }

  const toTranslate = {};
  for (const k of untranslated) {
    toTranslate[k] = en[k];
  }
  const entries = Object.entries(toTranslate);

  const BATCH_SIZE = 25;
  const batches = [];
  for (let i = 0; i < entries.length; i += BATCH_SIZE) {
    batches.push(entries.slice(i, i + BATCH_SIZE));
  }

  console.log(`Total batches: ${batches.length}`);

  let translated = 0;
  let errors = 0;

  for (let i = 0; i < batches.length; i++) {
    const jsonInput = JSON.stringify(Object.fromEntries(batches[i]), null, 2);

    const prompt = `You are a professional ${LANG_NAMES[lang]} translator for an industrial titanium surface engineering website.
Translate the following English key-value pairs to natural, professional ${LANG_NAMES[lang]}.

RULES:
- Keep technical terms/acronyms unchanged: DC, V, pH, DC, TiO₂, MoS₂, PTFE, MIL-DLT-8937, MIL-STD-130, Grade 5, Grade 23, Grade 2, Ti-6Al-4V, Ti-6Al-4V ELI, µ, ΔE, nm, µm
- Keep measurement units and values unchanged: "±0.1 V", "±1°C", "5 V", "25 V", "45 V", "65 V", "85 V", "pH 10–12", "10–50 V", "20–100 nm", "> 5×", "µ < 0.2", "ΔE < 2.0", "±2–5 V", "±5°C", "15–25°C"
- Keep ALL special characters, symbols, and formatting: "—", "×", "±", "≥", "≤", "≈", "µ", "₂", "₃", "₄", "°", "Ω", "→"
- Translate the VALUES only (right side of colon), keep the KEYS (left side of colon) exactly as-is
- Use proper ${LANG_NAMES[lang]} grammar and terminology
- For technical manufacturing terms, use standard ${LANG_NAMES[lang]} industry terminology
- Return ONLY a valid JSON object with the same keys and translated values

Here is the batch ${i + 1}/${batches.length}:

\`\`\`json
${jsonInput}
\`\`\``;

    console.log(`  Batch ${i + 1}/${batches.length} (${batches[i].length} entries)...`);

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
            { role: 'system', content: `You are a professional ${LANG_NAMES[lang]} translator for industrial/manufacturing content. Return ONLY valid JSON.` },
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

      const jsonMatch = content.match(/```(?:json)?\s*([\s\S]*?)\s*```/) || content.match(/{[\s\S]*}/);
      const jsonStr = jsonMatch ? jsonMatch[1] || jsonMatch[0] : content;

      const result = JSON.parse(jsonStr);
      for (const [key, value] of Object.entries(result)) {
        if (key in langData && value && typeof value === 'string') {
          langData[key] = value;
          translated++;
        }
      }
      console.log(`    ✓ Batch ${i + 1} done`);
    } catch (err) {
      console.error(`    ✗ Batch ${i + 1} failed: ${err.message}`);
      errors++;
    }

    if (i < batches.length - 1) {
      await new Promise(r => setTimeout(r, 500));
    }
  }

  // Write updated file
  const sorted = {};
  for (const k of Object.keys(langData).sort()) {
    sorted[k] = langData[k];
  }
  fs.writeFileSync(langFile, JSON.stringify(sorted, null, 2), 'utf-8');

  console.log(`\n${LANG_NAMES[lang]} translation complete:`);
  console.log(`  Translated: ${translated} entries`);
  console.log(`  Errors: ${errors} batches`);

  const remaining = relevantKeys.filter(k => langData[k] === en[k]);
  console.log(`  Remaining English: ${remaining.length}`);
}

// Process all languages
async function main() {
  for (const lang of TARGET_LANGS) {
    await translateForLang(lang);
  }
  console.log('\n' + '='.repeat(60));
  console.log('ALL LANGUAGES COMPLETE!');
  console.log('='.repeat(60));
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});