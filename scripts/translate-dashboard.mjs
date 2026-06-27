/**
 * Translate dashboard metric keys to all non-English/non-German languages.
 *
 * Reads en.json for source text, then for each target language (ja/fr/es/pt/it/ko/nl/pl)
 * translates any key whose value still matches English.
 *
 * Usage: node scripts/translate-dashboard.mjs
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const TRANSLATIONS_DIR = path.resolve(__dirname, '../src/i18n/translations');

const DEEPSEEK_API_KEY = 'sk-b187f5cf84c74f9aac8bd04b7fd0d2f8';
const DEEPSEEK_API_URL = 'https://api.deepseek.com/v1/chat/completions';

// Target languages (en = source, de = already done manually)
const TARGET_LANGS = ['ja', 'fr', 'es', 'pt', 'it', 'ko', 'nl', 'pl'];

const LANG_NAMES = {
  ja: 'Japanese', fr: 'French', es: 'Spanish', pt: 'Portuguese',
  it: 'Italian', ko: 'Korean', nl: 'Dutch', pl: 'Polish',
};

// Keys to translate: all services.*.metricN.label and services.*.metricN.desc
function isDashboardMetricKey(key) {
  return /^services\.(cnctechnicaldashboard|additivespecsdashboard|anodizingspecsdashboard|fiveaxistechspecs|laserspecsdashboard)\.metric\d+\.(label|desc)$/.test(key);
}

async function translateBatch(entries, targetLang) {
  const jsonInput = JSON.stringify(Object.fromEntries(entries), null, 2);

  const prompt = `You are a professional translator for industrial/manufacturing content. Translate from English to ${targetLang}.

RULES:
- Keep technical terms, standards, brands, and abbreviations in English EXACTLY as-is:
  CNC, SLM, DMLS, CMM, EDM, TIG, MIG, CAD, CAM, DFM, ASTM, AMS, ISO, AS9100, AS9100D, ISO 13485, ISO 10993, ISO 4287, AMS 2488D, AMS 2487, ASTM F86, ASTM B311, ASTM F2924, ASTM F3302, ISO 2768-m, AS9102, GD&T, Cpk, Ra, Rz, Rq, Rmax, µm, nm, mm, TiO₂, Ti-6Al-4V, SLM, DMLS, EOS, Renishaw, DMG MORI, Mazak, DC, AC
- Keep measurement values, units, and numbers unchanged: "±0.005", "Ra 0.4", "≥99.5%", "ø 0.07", "50 nm", "20 – 60", etc.
- Translate the VALUES only, keep the KEYS exactly as-is
- Use proper ${targetLang} grammar and terminology
- For manufacturing/engineering terms, use standard industry terminology in ${targetLang}
- Return ONLY a JSON object with the same keys and translated values. No explanations, no markdown.

Here are the entries to translate:

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
        { role: 'system', content: `You are a professional translator from English to ${targetLang} for industrial/manufacturing content. Return ONLY valid JSON.` },
        { role: 'user', content: prompt },
      ],
      temperature: 0.3,
      max_tokens: 16000,
    }),
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`API error ${response.status}: ${errText}`);
  }

  const data = await response.json();
  const content = data.choices[0].message.content.trim();

  // Parse JSON from response
  const jsonMatch = content.match(/```(?:json)?\s*([\s\S]*?)\s*```/) || content.match(/{[\s\S]*}/);
  const jsonStr = jsonMatch ? (jsonMatch[1] || jsonMatch[0]) : content;

  try {
    return JSON.parse(jsonStr);
  } catch (e) {
    console.error(`Failed to parse response:`);
    console.error(content.slice(0, 500));
    throw e;
  }
}

async function main() {
  // Load English source
  const en = JSON.parse(fs.readFileSync(path.join(TRANSLATIONS_DIR, 'en.json'), 'utf-8'));
  const metricKeys = Object.keys(en).filter(isDashboardMetricKey).sort();

  console.log(`Found ${metricKeys.length} dashboard metric keys to translate.\n`);

  for (const lang of TARGET_LANGS) {
    const filePath = path.join(TRANSLATIONS_DIR, `${lang}.json`);
    if (!fs.existsSync(filePath)) {
      console.log(`⏭ ${lang}.json not found, skipping`);
      continue;
    }

    const langData = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    const langName = LANG_NAMES[lang];

    // Find keys that are still in English (same as en value)
    const untranslated = metricKeys.filter(k => {
      if (!(k in langData)) return true; // missing key
      return langData[k] === en[k]; // still English
    });

    if (untranslated.length === 0) {
      console.log(`✓ ${lang} (${langName}): all ${metricKeys.length} keys already translated`);
      continue;
    }

    console.log(`🌐 ${lang} (${langName}): translating ${untranslated.length}/${metricKeys.length} keys...`);

    // Translate in batches of 20
    const BATCH_SIZE = 20;
    let translated = 0;
    let errors = 0;

    for (let i = 0; i < untranslated.length; i += BATCH_SIZE) {
      const batch = untranslated.slice(i, i + BATCH_SIZE);
      const batchEntries = batch.map(k => [k, en[k]]);

      console.log(`   Batch ${Math.floor(i / BATCH_SIZE) + 1}/${Math.ceil(untranslated.length / BATCH_SIZE)}...`);

      try {
        const result = await translateBatch(batchEntries, langName);
        for (const [key, value] of Object.entries(result)) {
          if (value && typeof value === 'string') {
            langData[key] = value;
            translated++;
          }
        }
        console.log(`   ✓ Batch done`);
      } catch (err) {
        console.error(`   ✗ Batch failed: ${err.message}`);
        errors++;
      }

      // Small delay between batches
      if (i + BATCH_SIZE < untranslated.length) {
        await new Promise(r => setTimeout(r, 500));
      }
    }

    // Write back
    fs.writeFileSync(filePath, JSON.stringify(langData, null, 2), 'utf-8');
    console.log(`   ✓ Written to ${lang}.json (${translated} translated, ${errors} errors)\n`);
  }

  console.log('🎉 All languages processed!');
}

main().catch(err => {
  console.error(`\n❌ Error: ${err.message}`);
  process.exit(1);
});