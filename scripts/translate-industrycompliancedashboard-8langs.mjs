/**
 * Translate IndustryComplianceDashboard keys for all 8 target languages using DeepSeek API.
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

const PREFIX = 'industries.industrycompliancedashboard.';

const en = JSON.parse(fs.readFileSync(EN_JSON, 'utf-8'));

const relevantKeys = Object.keys(en).filter(k => k.startsWith(PREFIX));

console.log(`Found ${relevantKeys.length} industrycompliancedashboard keys in en.json`);

async function translateForLang(lang) {
  console.log(`\n${'='.repeat(60)}`);
  console.log(`Translating to ${LANG_NAMES[lang]} (${lang})`);
  console.log(`${'='.repeat(60)}`);

  const langFile = path.resolve(TRANSLATIONS_DIR, `${lang}.json`);
  const langData = JSON.parse(fs.readFileSync(langFile, 'utf-8'));

  // Find keys that are missing or still English
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

  const BATCH_SIZE = 27;
  const batches = [];
  for (let i = 0; i < entries.length; i += BATCH_SIZE) {
    batches.push(entries.slice(i, i + BATCH_SIZE));
  }

  console.log(`Total batches: ${batches.length}`);

  let translated = 0;
  let errors = 0;

  for (let i = 0; i < batches.length; i++) {
    const jsonInput = JSON.stringify(Object.fromEntries(batches[i]), null, 2);

    const prompt = `You are a professional ${LANG_NAMES[lang]} translator for an industrial titanium manufacturing website.
Translate the following English key-value pairs to natural, professional ${LANG_NAMES[lang]}.

RULES:
- Keep technical terms/acronyms unchanged: AS9100D, Nadcap, NDT, UHV, RoHS, REACH, ASTM, ISO, EN, FAIR, MTR, UDI, DHR
- Keep measurement units and values unchanged: "Ra 0.4 µm", "1×10⁻⁹ Torr", "TML < 1.0%", "CVCM < 0.1%"
- Keep ALL special characters, symbols: "—", "×", "±", "≥", "≤", "°", "&", "<", ">", "Ø"
- Keep standard names and certifications unchanged: SEMI F57, FDA 21 CFR 820, ASTM F2066, etc.
- Translate the VALUES only (right side of colon), keep the KEYS (left side of colon) exactly as-is
- Use proper ${LANG_NAMES[lang]} grammar and industry terminology
- Return ONLY a valid JSON object with the same keys and translated values

Here is the batch:

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
            { role: 'system', content: `You are a professional ${LANG_NAMES[lang]} translator for industrial manufacturing content. Return ONLY valid JSON.` },
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

      // Add/update keys in langData
      for (const [key, value] of Object.entries(result)) {
        if (value && typeof value === 'string') {
          langData[key] = value;
          translated++;
        }
      }
      console.log(`    ✓ Batch ${i + 1} done (${translated} total so far)`);
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

  // Verify
  const stillMissing = relevantKeys.filter(k => !(k in sorted));
  console.log(`\n${LANG_NAMES[lang]} translation complete:`);
  console.log(`  Added/Updated: ${translated} entries`);
  console.log(`  Errors: ${errors} batches`);
  console.log(`  Still missing: ${stillMissing.length}`);
}

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