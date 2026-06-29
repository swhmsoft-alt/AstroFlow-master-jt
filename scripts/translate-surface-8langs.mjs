/**
 * Translate surface treatment keys for all 8 target languages using DeepSeek API.
 * Adapts the existing translate-deepseek.mjs pattern.
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

const LANG_MARKS = {
  de: /[üöäßÜÖÄß]/,
  fr: /[éèêëàâçôùûîï]/,
  es: /[éíóúñ]/,
  pt: /[áàâãçéêíóôõú]/,
  it: /[àèéìòù]/,
  ko: /[\uAC00-\uD7AF]/,
  nl: /[éëïó]/,
  pl: /[ąćęłńóśźż]/
};

const PREFIXES = [
  'services.surfaceprocessspectrum',
  'services.surfacespecsdashboard',
  'services.gallingosseointegrationknowhow',
  'services.anodizingclassifications',
  'services.anodizingspecsdashboard',
  'services.passivationspectrum',
  'services.passivationspecsdashboard',
  'services.texturingprocessspectrum',
  'services.texturingspecsdashboard',
  'services.smearingembeddingcontrolknowhow',
  'services.hydrogenembrittlementacidcontrolknowhow'
];

const en = JSON.parse(fs.readFileSync(EN_JSON, 'utf-8'));
const relevantKeys = Object.keys(en).filter(k => PREFIXES.some(p => k.startsWith(p)));
console.log(`Found ${relevantKeys.length} relevant keys in en.json`);

async function translateForLang(lang) {
  console.log(`\n${'='.repeat(60)}`);
  console.log(`Translating to ${LANG_NAMES[lang]} (${lang})`);
  console.log(`${'='.repeat(60)}`);
  
  const langFile = path.resolve(TRANSLATIONS_DIR, `${lang}.json`);
  const langData = JSON.parse(fs.readFileSync(langFile, 'utf-8'));
  const mark = LANG_MARKS[lang];
  
  // Find untranslated keys
  const untranslated = relevantKeys.filter(k => {
    if (!(k in langData)) return true;
    const val = langData[k];
    if (val === en[k]) return true;
    if (val && val.length > 5 && mark && !mark.test(val)) {
      // Check if it contains any special chars - if not, still English
      if (!/[üöäßéèêëàâçôùûîïáíóúñáàâãçéêíóôõúàèéìòùąćęłńóśźż]/.test(val)) {
        return en[k].length > 5 && val === en[k];
      }
    }
    return false;
  });
  
  console.log(`${untranslated.length} keys need translation`);
  
  if (untranslated.length === 0) {
    console.log('Nothing to translate - all done!');
    return;
  }
  
  // Build batch
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
    
    const prompt = `You are a professional ${LANG_NAMES[lang]} translator for an industrial titanium manufacturing website.
Translate the following English key-value pairs to natural, professional ${LANG_NAMES[lang]}.

RULES:
- Keep technical terms/acronyms unchanged: CNC, ISO, AS9100, AS9102, AS9100D, CAD, CAM, DFM, CMM, EDM, SLM, DMLS, OES, MTR, PMI, NDT, FPI, UT, CAPA, IQC, IPQC, FQC, FAIR, GD&T, Cpk, ASTM, AMS, ELI, UID, RFQ, BOM, WPS, PQR, NDA, FOB, CIF, TLS, TIG, MIG, SDS, EDI, WMS, HACCP, C-TPAT, ITAR, MTRs, MAO, PTFE, PVD, AlTiN, MQL, VFM, HIP, HRC, SEM, EDS, EIS
- Keep proper names unchanged: "BOZE CNC Ti", "BOZE CNC"
- Keep measurement units and values unchanged: "±0.005 mm", "650 × 650 × 500 mm", "24/7", "500+", "50M+", "99.9%", "Cpk ≥ 1.67", "Ra 0.4 µm", etc.
- Keep ALL special characters, symbols, and formatting in the text: "—", "×", "±", "≥", "≤", "≈", "→", "•", "µ", "²", "³", "°", "Ω", "₃", "₂", "₄", "⁷", etc.
- Keep HTML entities like "&mdash;" unchanged
- Keep product names, standard numbers, and alloy names unchanged: "Ti-6Al-4V", "Grade 5", "AMS 2488", "ASTM F86"
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
  
  // Verify
  const remaining = relevantKeys.filter(k => langData[k] === en[k]);
  const withChars = relevantKeys.filter(k => langData[k] && mark && mark.test(langData[k]));
  console.log(`  Remaining English: ${remaining.length}`);
  console.log(`  With ${lang} chars: ${withChars.length}`);
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