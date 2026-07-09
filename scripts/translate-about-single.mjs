/**
 * translate-about-single.mjs
 * Translates about.* keys into ONE language.
 * Usage: node scripts/translate-about-single.mjs <langCode>
 * Example: node scripts/translate-about-single.mjs de
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const EN_JSON = path.resolve(__dirname, '../src/i18n/translations/en.json');
const LANGS_DIR = path.resolve(__dirname, '../src/i18n/translations');

const DEEPSEEK_API_KEY = 'sk-b187f5cf84c74f9aac8bd04b7fd0d2f8';
const DEEPSEEK_API_URL = 'https://api.deepseek.com/v1/chat/completions';

const LANG_NAMES = {
  de: 'German', fr: 'French', es: 'Spanish', pt: 'Portuguese',
  it: 'Italian', ko: 'Korean', nl: 'Dutch', pl: 'Polish', ja: 'Japanese',
};

const langCode = process.argv[2];
if (!langCode || !LANG_NAMES[langCode]) {
  console.error('Usage: node scripts/translate-about-single.mjs <langCode>');
  console.error('Supported: ' + Object.keys(LANG_NAMES).join(', '));
  process.exit(1);
}

const langName = LANG_NAMES[langCode];
const en = JSON.parse(fs.readFileSync(EN_JSON, 'utf-8'));
const ABOUT_KEYS = Object.keys(en).filter(k => k.startsWith('about.'));
const langPath = path.join(LANGS_DIR, `${langCode}.json`);
const langData = JSON.parse(fs.readFileSync(langPath, 'utf-8'));
const toTranslate = ABOUT_KEYS.filter(k => langData[k] === undefined || langData[k] === en[k]);

if (toTranslate.length === 0) {
  console.log(`${langCode}: Nothing to translate.`);
  process.exit(0);
}

console.log(`${langCode} (${langName}): Translating ${toTranslate.length} keys...`);

const entries = toTranslate.map(k => [k, en[k]]);
const jsonInput = JSON.stringify(Object.fromEntries(entries), null, 2);

const prompt = `You are a professional ${langName} translator for an industrial titanium manufacturing website.
Translate the following English key-value pairs to natural, professional ${langName}.

TECHNICAL TERMS - DO NOT TRANSLATE:
- Brand names: "BOZE", "BOZE CNC-Ti", "BOZE Metal"
- Material grades: "Grade 2", "Grade 5", "Ti-6Al-4V"
- Standards/certs: "ASTM", "ASME", "ISO", "AS9100D", "ISO 9001:2015"
- Processes: "CNC", "DFM", "OEM", "ODM", "CMM", "SLM", "DMLS", "PVD"
- The full Chinese address line (keep as-is)
- Units: "mm", "µm", "MPa"

RULES:
- Translate VALUES only, keep KEYS exactly as-is
- Use proper ${langName} grammar and terminology
- Return ONLY valid JSON, no markdown, no code blocks

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
      { role: 'system', content: `You are a professional ${langName} translator. Return ONLY valid JSON.` },
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

let count = 0;
for (const [key, value] of Object.entries(result)) {
  if (value && typeof value === 'string') {
    langData[key] = value;
    count++;
  }
}

const sortedData = {};
for (const k of Object.keys(langData).sort()) {
  sortedData[k] = langData[k];
}
fs.writeFileSync(langPath, JSON.stringify(sortedData, null, 2), 'utf-8');
console.log(`✓ ${langCode}.json written (${count} keys translated)`);
