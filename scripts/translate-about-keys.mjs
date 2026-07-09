/**
 * translate-about-keys.mjs
 *
 * Translates newly added about.* keys into all 9 non-English languages
 * using DeepSeek API, preserving technical terms per project conventions.
 *
 * Usage: node scripts/translate-about-keys.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const EN_JSON = path.resolve(__dirname, '../src/i18n/translations/en.json');
const LANGS_DIR = path.resolve(__dirname, '../src/i18n/translations');

const DEEPSEEK_API_KEY = 'sk-b187f5cf84c74f9aac8bd04b7fd0d2f8';
const DEEPSEEK_API_URL = 'https://api.deepseek.com/v1/chat/completions';

const TARGET_LANGS = {
  de: { name: 'German', flag: 'DE' },
  fr: { name: 'French', flag: 'FR' },
  es: { name: 'Spanish', flag: 'ES' },
  pt: { name: 'Portuguese', flag: 'PT' },
  it: { name: 'Italian', flag: 'IT' },
  ko: { name: 'Korean', flag: 'KO' },
  nl: { name: 'Dutch', flag: 'NL' },
  pl: { name: 'Polish', flag: 'PL' },
  ja: { name: 'Japanese', flag: 'JA' },
};

const en = JSON.parse(fs.readFileSync(EN_JSON, 'utf-8'));

// Identify all about.* keys
const ABOUT_KEYS = Object.keys(en).filter(k => k.startsWith('about.'));
console.log(`Found ${ABOUT_KEYS.length} about.* keys to translate:`);
ABOUT_KEYS.forEach(k => console.log(`  ${k}`));

const TECH_TERMS_INSTRUCTION = `TECHNICAL TERMS & PROPER NOUNS - DO NOT TRANSLATE:
- Brand names: "BOZE", "BOZE CNC-Ti", "BOZE Metal"
- Material grades: "Grade 2", "Grade 5", "Ti-6Al-4V"
- Standards: "ASTM", "ASME", "ISO", "AMS", "AWS D1.6", "AS9100D", "ISO 9001:2015", "ISO 13485", "MIL-STD-130", "ISTA 2A/3A", "AMS 2488", "AMS 2700", "AMS 2631", "ASTM B265", "ASTM F86", "ASTM A967", "ASTM E8", "ASTM E1409", "ASTM B822", "ASME Y14.5", "AMS 4928", "AMS 4943"
- Processes: "CNC", "DFM", "OEM", "ODM", "CMM", "TIG", "MIG", "PVD", "SLM", "DMLS", "EDM", "MAO", "SPC", "PMI", "NDT", "UID", "RFQ", "Rfq", "BOM", "WPS", "PQR", "NDA", "FOB", "CIF"
- Company address lines: Keep the full Chinese address as-is
- Units: "mm", "µm", "MPa", "HV", "W/m·K", "°C", "bar", "kg", "Ra"
- Certifications: "AS9100D", "ISO 9001:2015", "ISO 13485"`;

async function translateBatch(lang, langInfo, items) {
  const jsonInput = JSON.stringify(Object.fromEntries(items), null, 2);

  const prompt = `You are a professional ${langInfo.name} translator for an industrial titanium manufacturing website.
Translate the following English key-value pairs to natural, professional ${langInfo.name} (${langInfo.flag}).

${TECH_TERMS_INSTRUCTION}

RULES:
- Translate the VALUES only (right side of colon), keep the KEYS (left side of colon) exactly as-is
- Use proper ${langInfo.name} grammar and terminology
- For technical manufacturing terms, use standard ${langInfo.name} industry terminology
- Return ONLY a valid JSON object with the same keys and translated values
- No markdown formatting, no code blocks, no explanations — just raw JSON

Here is the content to translate:

${jsonInput}`;

  const response = await fetch(DEEPSEEK_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${DEEPSEEK_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'deepseek-chat',
      messages: [
        { role: 'system', content: `You are a professional ${langInfo.name} translator for industrial/manufacturing content. Return ONLY valid JSON, no markdown.` },
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
    console.error(`Failed to parse response:`);
    console.error(content.slice(0, 500));
    throw e;
  }
}

async function run() {
  for (const [langCode, langInfo] of Object.entries(TARGET_LANGS)) {
    const langPath = path.join(LANGS_DIR, `${langCode}.json`);
    const langData = JSON.parse(fs.readFileSync(langPath, 'utf-8'));
    
    // Identify about.* keys that don't exist yet (undefined) or still equal English
    const toTranslate = ABOUT_KEYS.filter(k => langData[k] === undefined || langData[k] === en[k]);
    
    if (toTranslate.length === 0) {
      console.log(`\n${langCode} (${langInfo.name}): No about.* keys need translation, skipping.`);
      continue;
    }
    
    console.log(`\n${langCode} (${langInfo.name}): Translating ${toTranslate.length} keys...`);
    
    const entries = toTranslate.map(k => [k, en[k]]);
    let translatedCount = 0;
    
    try {
      const result = await translateBatch(langCode, langInfo, entries);
      for (const [key, value] of Object.entries(result)) {
        if (key in langData && value && typeof value === 'string') {
          langData[key] = value;
          translatedCount++;
        }
      }
      
      // Write updated file with sorted keys
      const sortedData = {};
      for (const k of Object.keys(langData).sort()) {
        sortedData[k] = langData[k];
      }
      
      fs.writeFileSync(langPath, JSON.stringify(sortedData, null, 2), 'utf-8');
      console.log(`  ✓ ${langCode}.json written (${translatedCount} translated)`);
    } catch (err) {
      console.error(`  ✗ ${langCode} failed: ${err.message}`);
    }
    
    // Delay between languages
    await new Promise(r => setTimeout(r, 2000));
  }
  
  console.log('\n=== All languages processed ===');
}

run().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
