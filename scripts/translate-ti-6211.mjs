/**
 * translate-ti-6211.mjs
 * 
 * Batch-translate all 112 ti-6211 translation keys into 11 languages
 * using DeepSeek API.
 * 
 * Usage: node scripts/translate-ti-6211.mjs
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const TRANS_DIR = path.resolve(__dirname, '../src/i18n/translations');
const API_KEY = 'sk-b187f5cf84c74f9aac8bd04b7fd0d2f8';
const API_URL = 'https://api.deepseek.com/v1/chat/completions';

const en = JSON.parse(fs.readFileSync(path.join(TRANS_DIR, 'en.json'), 'utf-8'));

// All ti-6211 keys from en.json
const allKeys = Object.keys(en).filter(k => k.includes('ti-6211')).sort();
console.log(`📋 Total ti-6211 keys to translate: ${allKeys.length}`);

const source = {};
allKeys.forEach(k => source[k] = en[k]);

// All 11 target languages
const langs = ['de', 'ja', 'fr', 'es', 'pt', 'it', 'ko', 'nl', 'pl', 'ru', 'ar'];
const langNames = {
  de: 'German', ja: 'Japanese', fr: 'French', es: 'Spanish',
  pt: 'Portuguese', it: 'Italian', ko: 'Korean', nl: 'Dutch',
  pl: 'Polish', ru: 'Russian', ar: 'Arabic'
};

// Additional instructions for specific languages
const langHints = {
  ja: 'Use Japanese technical terms (e.g. 応力腐食割れ for SCC, 破壊靭性 for fracture toughness). Keep Ti-6211, Ti-6Al-2Nb-1Ta-0.8Mo, UNS R56210, Grade 5, Nb+Ta, etc. as-is.',
  ko: 'Use Korean technical terms. Keep English alloy designations and standards as-is.',
  ar: 'Use Arabic technical terms. Keep English alloy designations and standards as-is.',
  ru: 'Use Russian technical terms. Keep English alloy designations and standards as-is.',
};

async function translateBatch(lang, batch) {
  const hint = langHints[lang] || '';
  const systemPrompt = `You are a professional ${langNames[lang]} translator for aerospace/metallurgy industrial content. Translate the following JSON values from English to ${langNames[lang]}. 
Keep ALL of these terms EXACTLY as-is (DO NOT translate):
- Ti-6211, Ti-6Al-2Nb-1Ta-0.8Mo, Ti-621/0.8, UNS R56210
- All titanium grade names: Grade 5, Grade 23, Grade 9, Grade 6242
- All alloying elements: Al, Nb, Ta, Mo, V, Sn, Zr, Cr, Fe
- Technical abbreviations: SCC, KIC, KISCC, HIP, HAZ, TIG, EDM, EB, CNC, DFM, CMM, NDT, MTR, NADCAP
- All standard designations: ASTM, AMS, MIL, NACE, ISO, ABS, NAVSEA, AS9100D, AS9102, ISO 9001, EN 10204
- All unit symbols: MPa, ksi, GPa, HRC, W/(m·K), g/cm³, lb/in³, mm, °C, °F
- Company name: BOZE CNC Ti
- Material property labels like "Tensile Strength", "Yield Strength", "Elongation" SHOULD be translated
- Section titles like "Applicable Standards", "Primary Industries" SHOULD be translated

Keep keys unchanged. Return ONLY valid JSON. No markdown. No explanation.${hint ? '\n' + hint : ''}`;

  const body = JSON.stringify({
    model: 'deepseek-chat',
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: JSON.stringify(batch, null, 2) }
    ],
    temperature: 0.1,
  });

  const resp = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${API_KEY}` },
    body,
  });
  const result = await resp.json();
  let content = result.choices[0].message.content;
  if (content.includes('```')) content = content.split('```')[1].replace(/^json\n?/, '');
  return JSON.parse(content.trim());
}

async function translate(lang) {
  const fp = path.join(TRANS_DIR, `${lang}.json`);
  const data = JSON.parse(fs.readFileSync(fp, 'utf-8'));

  // Find keys that need translation (missing or still English)
  const needs = {};
  let countExisting = 0;
  allKeys.forEach(k => {
    if (data[k] === undefined || data[k] === source[k]) {
      needs[k] = source[k];
    } else {
      countExisting++;
    }
  });

  const needKeys = Object.keys(needs);
  if (needKeys.length === 0) {
    console.log(`  ${lang}: ✅ All ${countExisting} keys already translated, skipping.`);
    return;
  }

  console.log(`  ${lang}: ${needKeys.length} keys need translation (${countExisting} existing)...`);

  // Process in batches of 30 to avoid token limits
  const BATCH_SIZE = 30;
  let translated = {};
  for (let i = 0; i < needKeys.length; i += BATCH_SIZE) {
    const batch = {};
    needKeys.slice(i, i + BATCH_SIZE).forEach(k => batch[k] = needs[k]);
    console.log(`    Batch ${Math.floor(i/BATCH_SIZE)+1}/${Math.ceil(needKeys.length/BATCH_SIZE)} (${Object.keys(batch).length} keys)...`);
    const result = await translateBatch(lang, batch);
    Object.assign(translated, result);
    // Small delay between batches
    if (i + BATCH_SIZE < needKeys.length) await new Promise(r => setTimeout(r, 1000));
  }

  // Write back
  Object.keys(translated).forEach(k => {
    if (allKeys.includes(k)) data[k] = translated[k];
  });
  fs.writeFileSync(fp, JSON.stringify(data, null, 2), 'utf-8');
  console.log(`  ${lang}: ✅ Translated ${Object.keys(translated).length} keys. Total ti-6211 keys now: ${Object.keys(data).filter(k => k.includes('ti-6211')).length}`);
}

(async () => {
  console.log('🚀 Batch-translating ti-6211 keys into 11 languages...\n');
  for (const lang of langs) {
    console.log(`\n🌐 ${lang} (${langNames[lang]})`);
    try {
      await translate(lang);
    } catch (e) {
      console.error(`  ❌ ${lang} error:`, e.message);
    }
  }
  console.log('\n🎉 All done! Verifying...');

  // Verify
  const enKeys = Object.keys(en).filter(k => k.includes('ti-6211')).length;
  console.log(`\n📊 Summary:`);
  console.log(`  en.json: ${enKeys} keys`);
  for (const lang of langs) {
    const data = JSON.parse(fs.readFileSync(path.join(TRANS_DIR, `${lang}.json`), 'utf-8'));
    const langKeys = Object.keys(data).filter(k => k.includes('ti-6211'));
    const stillEnglish = langKeys.filter(k => data[k] === en[k]).length;
    console.log(`  ${lang}.json: ${langKeys.length} keys (${stillEnglish} still English)`);
  }
})();
