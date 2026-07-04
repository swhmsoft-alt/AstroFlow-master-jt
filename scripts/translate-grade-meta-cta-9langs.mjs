/**
 * Translate pageTitle, metaDescription, and CTA keys to all 9 languages.
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

// Get keys to translate: pageTitle, metaDescription, cta.*
const targetKeys = Object.keys(en).filter(k => {
  if (!k.startsWith('materials.')) return false;
  return k.includes('.pageTitle') || k.includes('.metaDescription') || k.includes('.cta.');
});
console.log(`Found ${targetKeys.length} meta+cta keys to translate`);

async function translateLanguage(langInfo) {
  const { code, name } = langInfo;
  const langFile = path.join(TRANS_DIR, `${code}.json`);
  const langData = JSON.parse(fs.readFileSync(langFile, 'utf-8'));
  
  const needTranslate = targetKeys.filter(k => {
    if (!(k in langData)) return true;
    if (langData[k] === en[k]) return true;
    return false;
  });
  
  if (needTranslate.length === 0) {
    console.log(`  ${code}: All translated`);
    return;
  }
  
  console.log(`  ${code}: Translating ${needTranslate.length} keys...`);
  
  const toTranslate = {};
  for (const k of needTranslate) toTranslate[k] = en[k];
  const entries = Object.entries(toTranslate);
  
  // Split into batches
  const BATCH_SIZE = 40;
  const batches = [];
  for (let i = 0; i < entries.length; i += BATCH_SIZE) {
    batches.push(entries.slice(i, i + BATCH_SIZE));
  }
  
  for (let i = 0; i < batches.length; i++) {
    const prompt = `Translate the following English key-value pairs to natural, professional ${name}.

RULES:
- Keep technical terms/acronyms unchanged: CNC, ISO, ASTM, AMS, Grade, Ti-6Al-4V, UNS, MPa, ksi, ELI, RFQ, CP-Ti, EDM, SLM
- Keep material designations unchanged: "Grade 5", "Ti-6Al-4V", "Ti-5Al-2.5Sn", etc.
- Keep UNS numbers unchanged: "UNS R56400", etc.
- Keep measurement units and company names unchanged
- For pageTitle and metaDescription, create natural, SEO-optimized translations
- Translate VALUES only, keep KEYS exactly as-is
- Return ONLY a JSON object

\`\`\`json
${JSON.stringify(Object.fromEntries(batches[i]), null, 2)}
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
      console.error(`  ✗ Batch ${i+1} error: ${response.status}`);
      continue;
    }

    const data = await response.json();
    const content = data.choices[0].message.content.trim();
    const jsonMatch = content.match(/```(?:json)?\s*([\s\S]*?)\s*```/) || content.match(/{[\s\S]*}/);
    const jsonStr = jsonMatch ? jsonMatch[1] || jsonMatch[0] : content;
    
    const result = JSON.parse(jsonStr);
    for (const [key, value] of Object.entries(result)) {
      if (value && typeof value === 'string') langData[key] = value;
    }
    console.log(`    ✓ Batch ${i+1}/${batches.length} done`);
    
    if (i < batches.length - 1) await new Promise(r => setTimeout(r, 300));
  }
  
  const sorted = {};
  for (const k of Object.keys(langData).sort()) sorted[k] = langData[k];
  fs.writeFileSync(langFile, JSON.stringify(sorted, null, 2) + '\n', 'utf-8');
  console.log(`  ✓ ${code}.json written`);
}

async function main() {
  for (const langInfo of LANGUAGES) {
    try { await translateLanguage(langInfo); }
    catch (err) { console.error(`  ✗ ${langInfo.code}: ${err.message}`); }
  }
  console.log('\nDone!');
}
main().catch(console.error);