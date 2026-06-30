/**
 * Translate industries.industryctasection.* keys for all 9 target languages using DeepSeek API.
 * Priority: ja first, then de, fr, es, pt, it, ko, nl, pl.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const TRANSLATIONS_DIR = path.resolve(__dirname, '../src/i18n/translations');
const EN_JSON = path.resolve(TRANSLATIONS_DIR, 'en.json');

const DEEPSEEK_API_KEY = 'sk-b187f5cf84c74f9aac8bd04b7fd0d2f8';
const DEEPSEEK_API_URL = 'https://api.deepseek.com/v1/chat/completions';

// ja FIRST, then the rest
const TARGET_LANGS = ['ja', 'de', 'fr', 'es', 'pt', 'it', 'ko', 'nl', 'pl'];

const LANG_NAMES = {
  ja: 'Japanese', de: 'German', fr: 'French', es: 'Spanish', pt: 'Portuguese',
  it: 'Italian', ko: 'Korean', nl: 'Dutch', pl: 'Polish'
};

const PREFIX = 'industries.industryctasection.';

const en = JSON.parse(fs.readFileSync(EN_JSON, 'utf-8'));

const relevantKeys = Object.keys(en).filter(k => k.startsWith(PREFIX));

console.log(`Found ${relevantKeys.length} industryctasection keys in en.json:`);
for (const k of relevantKeys) {
  console.log(`  ${k}: ${en[k]}`);
}

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

  // Since it's only 9 keys, one batch is enough
  const jsonInput = JSON.stringify(Object.fromEntries(entries), null, 2);

  const prompt = `You are a professional ${LANG_NAMES[lang]} translator for an industrial titanium fabrication website.
Translate the following English key-value pairs to natural, professional ${LANG_NAMES[lang]}.

RULES:
- Keep technical terms/acronyms unchanged: DFM, TIG, CNC, LPM, O₂
- Keep measurement units and values unchanged: "±0.005mm", "24 hours", "<50 ppm"
- Keep ALL special characters, symbols: "—", "×", "±", "≥", "≤", "°", "&", "<", ">", "Ø"
- Translate the VALUES only (right side of colon), keep the KEYS (left side of colon) exactly as-is
- Use proper ${LANG_NAMES[lang]} grammar and industry terminology
- Return ONLY a valid JSON object with the same keys and translated values

Here is the content to translate:

\`\`\`json
${jsonInput}
\`\`\``;

  console.log(`Translating ${entries.length} entries...`);

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
        max_tokens: 4000,
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

    let translated = 0;
    // Add/update keys in langData
    for (const [key, value] of Object.entries(result)) {
      if (value && typeof value === 'string') {
        langData[key] = value;
        translated++;
      }
    }
    console.log(`  ✓ Translated ${translated} entries`);

    // Write updated file
    const sorted = {};
    for (const k of Object.keys(langData).sort()) {
      sorted[k] = langData[k];
    }
    fs.writeFileSync(langFile, JSON.stringify(sorted, null, 2), 'utf-8');
    console.log(`  ✓ Saved to ${lang}.json`);

    // Verify
    const stillMissing = relevantKeys.filter(k => !(k in sorted));
    if (stillMissing.length === 0) {
      console.log(`  ✓ All ${LANG_NAMES[lang]} keys present!`);
    } else {
      console.log(`  ✗ Still missing: ${stillMissing.length} keys`);
    }
  } catch (err) {
    console.error(`  ✗ Translation failed: ${err.message}`);
  }
}

async function main() {
  console.log('='.repeat(60));
  console.log('TRANSLATING industries.industryctasection.* KEYS');
  console.log('Priority: ja first, then de, fr, es, pt, it, ko, nl, pl');
  console.log('='.repeat(60));

  for (const lang of TARGET_LANGS) {
    await translateForLang(lang);
    if (lang !== TARGET_LANGS[TARGET_LANGS.length - 1]) {
      await new Promise(r => setTimeout(r, 1000));
    }
  }

  console.log('\n' + '='.repeat(60));
  console.log('ALL LANGUAGES COMPLETE!');
  console.log('='.repeat(60));
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});