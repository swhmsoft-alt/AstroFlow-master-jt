/**
 * Translate all 943 materials.* keys from en.json to 9 target languages
 * using DeepSeek API. Follows the existing translate-deepseek.mjs pattern.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const TRANS_DIR = path.resolve(__dirname, '../src/i18n/translations');
const EN_JSON = path.join(TRANS_DIR, 'en.json');

const DEEPSEEK_API_KEY = 'sk-b187f5cf84c74f9aac8bd04b7fd0d2f8';
const DEEPSEEK_API_URL = 'https://api.deepseek.com/v1/chat/completions';
const BATCH_SIZE = 25;

// Languages to translate (excluding 'en' which is source)
const LANGUAGES = [
  { code: 'de', name: 'German', label: 'Deutsch' },
  { code: 'ja', name: 'Japanese', label: '日本語' },
  { code: 'fr', name: 'French', label: 'Français' },
  { code: 'es', name: 'Spanish', label: 'Español' },
  { code: 'pt', name: 'Portuguese', label: 'Português' },
  { code: 'it', name: 'Italian', label: 'Italiano' },
  { code: 'ko', name: 'Korean', label: '한국어' },
  { code: 'nl', name: 'Dutch', label: 'Nederlands' },
  { code: 'pl', name: 'Polish', label: 'Polski' },
];

// Load English source
const en = JSON.parse(fs.readFileSync(EN_JSON, 'utf-8'));

// Extract only materials.* keys
const materialKeys = Object.keys(en).filter(k => k.startsWith('materials.'));
console.log(`Found ${materialKeys.length} materials.* keys in en.json`);

// Helper: build SYSTEM_PROMPT per language
function getSystemPrompt(langName) {
  return `You are a professional ${langName} translator for an industrial titanium engineering website.
Return ONLY valid JSON. Translate the VALUES only, keep the KEYS exactly as-is.`;
}

// Helper: build user prompt
function getUserPrompt(langName, items) {
  const jsonInput = JSON.stringify(Object.fromEntries(items), null, 2);
  return `Translate the following English key-value pairs to natural, professional ${langName}.

RULES:
- Keep technical terms/acronyms unchanged: CNC, ISO, AS9100, AS9102, ASTM, AMS, CAD, CAM, DFM, CMM, EDM, SLM, TIG, MIG, MPa, ksi, HRC, HRB, HV, KIC, UNS, HIP
- Keep measurement units and numerical values unchanged: "240 MPa", "4.51 g/cm³", "1,668°C", "±0.005 mm", etc.
- Keep material specifications/standards unchanged: "ASTM B265", "UNS R56400", "Grade 5", "Ti-6Al-4V", etc.
- Translate the VALUES only (right side of colon), keep the KEYS (left side of colon) exactly as-is
- Use proper ${langName} grammar and terminology
- For technical manufacturing terms, use standard ${langName} industry terminology
- Return ONLY a JSON object with the same keys and translated values

\`\`\`json
${jsonInput}
\`\`\``;
}

// Call DeepSeek API for a batch
async function translateBatch(langName, items, batchIndex, totalBatches) {
  const prompt = getUserPrompt(langName, items);

  const response = await fetch(DEEPSEEK_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${DEEPSEEK_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'deepseek-chat',
      messages: [
        { role: 'system', content: getSystemPrompt(langName) },
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
    console.error(`Failed to parse response for batch ${batchIndex + 1}:`);
    console.error(content.slice(0, 300));
    throw e;
  }
}

// Process a single language
async function translateLanguage(langInfo) {
  const { code, name } = langInfo;
  const langFile = path.join(TRANS_DIR, `${code}.json`);
  
  console.log(`\n========== Translating to ${name} (${code}) ==========`);
  
  // Load existing translations
  const langData = JSON.parse(fs.readFileSync(langFile, 'utf-8'));
  
  // Find materials.* keys that need translation
  const needTranslate = materialKeys.filter(k => {
    if (!(k in langData)) return true;
    if (langData[k] === en[k]) return true;
    return false;
  });
  
  if (needTranslate.length === 0) {
    console.log(`  All ${materialKeys.length} materials.* keys already translated.`);
    return;
  }
  
  console.log(`  Need translation: ${needTranslate.length}/${materialKeys.length} keys`);
  
  // Build translation pairs
  const toTranslate = {};
  for (const k of needTranslate) {
    toTranslate[k] = en[k];
  }
  
  const entries = Object.entries(toTranslate);
  
  // Split into batches
  const batches = [];
  for (let i = 0; i < entries.length; i += BATCH_SIZE) {
    batches.push(entries.slice(i, i + BATCH_SIZE));
  }
  
  console.log(`  Batches: ${batches.length}`);
  
  let translated = 0;
  let errors = 0;
  
  for (let i = 0; i < batches.length; i++) {
    console.log(`  Batch ${i + 1}/${batches.length} (${batches[i].length} entries)...`);
    try {
      const result = await translateBatch(name, batches[i], i, batches.length);
      for (const [key, value] of Object.entries(result)) {
        if (value && typeof value === 'string') {
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
      await new Promise(r => setTimeout(r, 300));
    }
  }
  
  // Write updated file
  const sorted = {};
  for (const k of Object.keys(langData).sort()) {
    sorted[k] = langData[k];
  }
  fs.writeFileSync(langFile, JSON.stringify(sorted, null, 2) + '\n', 'utf-8');
  
  console.log(`  ✓ ${code}.json written (${Object.keys(sorted).length} keys)`);
  console.log(`  Translated: ${translated}, Errors: ${errors} batches`);
}

// Main
async function main() {
  console.log(`Materials keys to translate: ${materialKeys.length}`);
  console.log(`Target languages: ${LANGUAGES.map(l => l.code).join(', ')}`);
  
  for (const langInfo of LANGUAGES) {
    try {
      await translateLanguage(langInfo);
    } catch (err) {
      console.error(`Fatal error for ${langInfo.code}: ${err.message}`);
    }
  }
  
  console.log('\n========== ALL DONE ==========');
}

main().catch(console.error);