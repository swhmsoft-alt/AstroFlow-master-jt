/**
 * Translate hero keys (materials.*.hero.*) from en.json to all 9 languages
 * using DeepSeek API.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const TRANS_DIR = path.resolve(__dirname, '../src/i18n/translations');
const EN_JSON = path.join(TRANS_DIR, 'en.json');

const DEEPSEEK_API_KEY = 'sk-b187f5cf84c74f9aac8bd04b7fd0d2f8';
const DEEPSEEK_API_URL = 'https://api.deepseek.com/v1/chat/completions';

const LANGUAGES = [
  { code: 'de', name: 'German' },
  { code: 'ja', name: 'Japanese' },
  { code: 'fr', name: 'French' },
  { code: 'es', name: 'Spanish' },
  { code: 'pt', name: 'Portuguese' },
  { code: 'it', name: 'Italian' },
  { code: 'ko', name: 'Korean' },
  { code: 'nl', name: 'Dutch' },
  { code: 'pl', name: 'Polish' },
];

const en = JSON.parse(fs.readFileSync(EN_JSON, 'utf-8'));

// Get only hero keys
const heroKeys = Object.keys(en).filter(k => k.includes('.hero.'));
console.log(`Found ${heroKeys.length} hero keys`);

async function translateLanguage(langInfo) {
  const { code, name } = langInfo;
  const langFile = path.join(TRANS_DIR, `${code}.json`);
  const langData = JSON.parse(fs.readFileSync(langFile, 'utf-8'));
  
  // Find untranslated hero keys
  const needTranslate = heroKeys.filter(k => {
    if (!(k in langData)) return true;
    if (langData[k] === en[k]) return true;
    return false;
  });
  
  if (needTranslate.length === 0) {
    console.log(`  ${code}: All hero keys already translated`);
    return;
  }
  
  console.log(`  ${code}: Translating ${needTranslate.length} hero keys...`);
  
  const toTranslate = {};
  for (const k of needTranslate) {
    toTranslate[k] = en[k];
  }
  
  const entries = Object.entries(toTranslate);
  const prompt = `Translate the following English key-value pairs to natural, professional ${name}.

RULES:
- Keep technical terms/acronyms unchanged: CNC, ISO, ASTM, AMS, CAD, CAM, Grade, Ti-6Al-4V, UNS, MPa, ksi, ELI
- Keep material designations unchanged: "Grade 5", "Ti-6Al-4V", "Ti-5Al-2.5Sn", "Ti-3Al-2.5V", etc.
- Keep UNS numbers unchanged: "UNS R56400", etc.
- Keep measurement units unchanged: "MPa", "ksi", "°C", "°F", "g/cm³", etc.
- Translate the VALUES only, keep the KEYS exactly as-is
- Return ONLY a JSON object with the same keys and translated values

\`\`\`json
${JSON.stringify(Object.fromEntries(entries), null, 2)}
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
        { role: 'system', content: `You are a professional ${name} translator for industrial content. Return ONLY valid JSON.` },
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
  
  const sorted = {};
  for (const k of Object.keys(langData).sort()) {
    sorted[k] = langData[k];
  }
  fs.writeFileSync(langFile, JSON.stringify(sorted, null, 2) + '\n', 'utf-8');
  console.log(`  ✓ ${code}: Translated ${count} keys, file written`);
}

async function main() {
  for (const langInfo of LANGUAGES) {
    try {
      await translateLanguage(langInfo);
    } catch (err) {
      console.error(`  ✗ ${langInfo.code}: ${err.message}`);
    }
  }
  console.log('\nDone!');
}

main().catch(console.error);