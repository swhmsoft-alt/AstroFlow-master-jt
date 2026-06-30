/**
 * Translate MaterialGradeMatrix + AlloyComparisonTable keys for all target languages using DeepSeek API.
 * Japanese (ja) is translated first as the priority, then 8 other languages.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const TRANSLATIONS_DIR = path.resolve(__dirname, '../src/i18n/translations');
const EN_JSON = path.resolve(TRANSLATIONS_DIR, 'en.json');

const DEEPSEEK_API_KEY = 'sk-b187f5cf84c74f9aac8bd04b7fd0d2f8';
const DEEPSEEK_API_URL = 'https://api.deepseek.com/v1/chat/completions';

const PREFIXES = ['materials.materialgradematrix.', 'materials.alloycomparisontable.', 'materials.machiningknowhow.', 'materials.materialtraceability.', 'industries.industryverticalsgrid.'];

const en = JSON.parse(fs.readFileSync(EN_JSON, 'utf-8'));

const relevantKeys = Object.keys(en).filter(k => PREFIXES.some(p => k.startsWith(p)));

console.log(`Found ${relevantKeys.length} keys to translate (materialgradematrix + alloycomparisontable)`);

/**
 * Translate for a single target language
 */
async function translateForLang(lang, langName) {
  console.log(`\n${'='.repeat(60)}`);
  console.log(`Translating to ${langName} (${lang})`);
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

  const BATCH_SIZE = 30;
  const batches = [];
  for (let i = 0; i < entries.length; i += BATCH_SIZE) {
    batches.push(entries.slice(i, i + BATCH_SIZE));
  }

  console.log(`Total batches: ${batches.length}`);

  let translated = 0;
  let errors = 0;

  for (let i = 0; i < batches.length; i++) {
    const jsonInput = JSON.stringify(Object.fromEntries(batches[i]), null, 2);

    const isJapanese = lang === 'ja';
    const targetLangDesc = isJapanese ? 'Japanese' : langName;

    const prompt = `You are a professional ${targetLangDesc} translator for an industrial titanium manufacturing website.
Translate the following English key-value pairs to natural, professional ${targetLangDesc}.

RULES:
- Keep technical terms/acronyms unchanged: CP-Ti, ELI, Ti-6Al-4V, Ti-3Al-2.5V, Ti-0.3Mo-0.8Ni
- Keep material grades and specifications unchanged: "Grade 1", "Grade 5", "ASTM", "ISO", "AMS", "MPa", "HV"
- Keep measurement units and numeric values unchanged: "99.9%", "1,200 MPa", "±0.005 mm", "Ra 0.4 µm"
- Keep ALL special characters, symbols: "—", "×", "±", "≥", "≤", "°", "&", "<", ">", "Ø", "®", "™", "~"
- Translate the VALUES only (right side of colon), keep the KEYS (left side of colon) exactly as-is
- Use proper ${targetLangDesc} grammar and industry terminology
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
            { role: 'system', content: `You are a professional ${targetLangDesc} translator for industrial/manufacturing content. Return ONLY valid JSON.` },
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
  console.log(`\n${langName} translation complete:`);
  console.log(`  Added/Updated: ${translated} entries`);
  console.log(`  Errors: ${errors} batches`);
  console.log(`  Still missing: ${stillMissing.length}`);
}

const LANG_NAMES = {
  ja: 'Japanese',
  de: 'German', fr: 'French', es: 'Spanish', pt: 'Portuguese',
  it: 'Italian', ko: 'Korean', nl: 'Dutch', pl: 'Polish'
};

// Priority order: ja first, then 8 other languages
const ALL_TARGET_LANGS = ['ja', 'de', 'fr', 'es', 'pt', 'it', 'ko', 'nl', 'pl'];

async function main() {
  for (const lang of ALL_TARGET_LANGS) {
    await translateForLang(lang, LANG_NAMES[lang]);
  }
  console.log('\n' + '='.repeat(60));
  console.log('ALL LANGUAGES COMPLETE!');
  console.log('='.repeat(60));
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});