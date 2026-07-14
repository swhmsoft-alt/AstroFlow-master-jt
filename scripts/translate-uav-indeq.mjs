/**
 * 批量翻译 industries.uav.* 和 industries.indeq.* 键到所有语言
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DIR = path.resolve(__dirname, '../src/i18n/translations');
const API_KEY = 'sk-b187f5cf84c74f9aac8bd04b7fd0d2f8';
const API_URL = 'https://api.deepseek.com/v1/chat/completions';

const TARGET_LANGS = {
  de: 'German (DIN standards, formal "Sie")',
  fr: 'French (AFNOR standards, formal "Vous")',
  es: 'Spanish (UNE/ISO standards, professional B2B)',
  pt: 'Portuguese (ABNT/ISO standards, professional B2B)',
  it: 'Italian (UNI standards, high-precision engineering)',
  ko: 'Korean (KS standards, formal business 존댓말)',
  nl: 'Dutch (NEN standards, corporate B2B)',
  pl: 'Polish (PN standards, corporate B2B)',
  ru: 'Russian (GOST standards, formal technical)',
  ar: 'Arabic (SASO standards, formal MSA فصحى, RTL)',
};

const STANDARD_NAMES = new Set([
  'AS9100D','NADCAP','AMS 2631','AMS 2645','ISO 13485','FDA 21 CFR 820','ASTM F136','ASTM F2066',
  'ISO 9001:2015','SEMI F57','RoHS','REACH','AS9100','ASTM','ISO','EN 10204','Nadcap',
  'ASME Y14.5','ASME B46.1','MIL-STD-45662','ISO 10012','AMS','AWS D17.1','MIL-STD-188',
  'IATF 16949','NACE','API','SAE','AWS','ISO 14001','OHSAS 18001',
  'Grade 5','Grade 7','Grade 2','Grade 23','Ti-6Al-4V','Ti-0.12Pd','Ti-6Al-7Nb',
  'Grade 5 Ti','Grade 7 Ti','Grade 2 Ti','Grade 23 Ti',
  '5-Axis','5-axis','CNC','FEA','CMM','EDM','SLM','DMLS','MTR','GD&T','DFM','VTOL','LiDAR',
  'ISO 1940 G2.5','AMS 2801','ASTM E112','ASTM B367','ASTM B348','ASTM B265',
  'Ra','µm','MPa','kHz','RPM','bar','kVA','mm','°C',
  'EN 10204 3.1','ASME Y14.5','H₂SO₄','HCl','Ti-0.12Pd','Ti-6Al-4V',
  'CD','CAD','STEP','IGES','STL','OEM','ODM','PVD',
]);

async function translateBatch(texts, langCode, langDesc) {
  if (texts.length === 0) return {};
  const sourceJson = JSON.stringify(texts, null, 2);

  const systemPrompt = `You are a professional ${langDesc} translator for industrial titanium manufacturing content. 
Rules:
- Keep ALL technical terms exactly as-is: alloy grades (Grade 5, Ti-6Al-4V, Grade 7 Ti-0.12Pd), process names (CNC, FEA, CMM), certifications (AS9100, EN 10204, AMS 2801, ASTM E112), units (mm, µm, MPa, kHz, bar, °C)
- Keep ALL parenthetical abbreviations and acronyms exactly as-is
- Translate naturally to native ${langCode} — NOT word-for-word translation
- For German: use compound nouns, formal "Sie"
- For French: formal "Vous"
- For Korean: formal 존댓말
- For Arabic: formal MSA (فصحى), RTL compatible phrasing
- Return ONLY a valid JSON object with the exact same keys
- No markdown, no explanation, NO backticks`;

  const userPrompt = `Translate the following English JSON values to ${langCode}. Keep all keys exactly the same. Return ONLY the translated JSON object:\n\n${sourceJson}`;

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.1,
        max_tokens: 8192
      })
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`HTTP ${response.status}: ${errText}`);
    }

    const data = await response.json();
    const resultText = data.choices?.[0]?.message?.content?.trim() || '';
    const cleaned = resultText.replace(/```json\s*/gi, '').replace(/```\s*$/g, '').trim();
    return JSON.parse(cleaned);
  } catch (err) {
    console.error(`  ❌ DeepSeek error: ${err.message}`);
    return {};
  }
}

async function main() {
  console.log('='.repeat(60));
  console.log('  Batch translate industries.uav.* & industries.indeq.*');
  console.log('='.repeat(60));

  const en = JSON.parse(fs.readFileSync(path.join(DIR, 'en.json'), 'utf8'));

  // Collect all source keys
  const sourceKeys = Object.keys(en).filter(k =>
    k.startsWith('industries.uav.') || k.startsWith('industries.indeq.')
  ).sort();

  console.log(`\n📖 English source keys: ${sourceKeys.length}`);

  for (const [langCode, langDesc] of Object.entries(TARGET_LANGS)) {
    console.log(`\n🌐 [${langCode}] ${langDesc.split('(')[0].trim()}...`);
    const targetFile = path.join(DIR, `${langCode}.json`);
    let target;
    try {
      target = JSON.parse(fs.readFileSync(targetFile, 'utf8'));
    } catch {
      target = {};
    }

    // Find missing keys
    const needsTranslation = {};
    for (const key of sourceKeys) {
      const val = en[key];
      if (!val || val.length < 3) continue;
      const existing = target[key];
      if (!existing || existing === val) {
        needsTranslation[key] = val;
      }
    }

    const keysList = Object.keys(needsTranslation);
    if (keysList.length === 0) {
      console.log(`  ✅ All translated`);
      continue;
    }

    console.log(`  Need translation: ${keysList.length} keys`);

    const batchSize = 10;
    let translated = 0;
    let failed = 0;

    for (let i = 0; i < keysList.length; i += batchSize) {
      const batch = keysList.slice(i, i + batchSize);
      const batchObj = {};
      for (const k of batch) batchObj[k] = needsTranslation[k];

      console.log(`  Batch ${Math.floor(i/batchSize)+1}/${Math.ceil(keysList.length/batchSize)}...`);
      const result = await translateBatch(batchObj, langCode, langDesc);

      for (const [key, val] of Object.entries(result)) {
        if (val && typeof val === 'string' && val.length > 0) {
          target[key] = val;
          translated++;
        } else {
          failed++;
        }
      }

      if (i + batchSize < keysList.length) {
        await new Promise(r => setTimeout(r, 1500));
      }
    }

    const sorted = {};
    for (const k of Object.keys(target).sort()) sorted[k] = target[k];
    fs.writeFileSync(targetFile, JSON.stringify(sorted, null, 2) + '\n', 'utf8');
    console.log(`  ✅ Done: ${translated} translated, ${failed} failed`);
  }

  console.log('\n' + '='.repeat(60));
  console.log('  🎉 All languages completed!');
  console.log('='.repeat(60));
}

main().catch(console.error);
