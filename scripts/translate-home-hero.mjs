/**
 * Translate new Home Hero texts from English to 9 languages using DeepSeek API.
 * Updates home.mainHero.title and home.mainHero.subtitle in each {lang}.json.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const TRANSLATIONS_DIR = path.resolve(__dirname, '../src/i18n/translations');

const DEEPSEEK_API_KEY = 'sk-b187f5cf84c74f9aac8bd04b7fd0d2f8';
const DEEPSEEK_API_URL = 'https://api.deepseek.com/v1/chat/completions';

// New English texts
const EN_H1 = 'End-to-End Titanium Manufacturing Solutions';
const EN_SUBTITLE = 'From titanium additive manufacturing and precision CNC machining to fabrication, finishing, and assembly, we provide complete one-stop solutions for custom titanium parts and components. Built on AS9100-compliant quality systems, we support projects from prototype development to full-scale production.';

// Languages to update (excluding en which is already updated)
const TARGET_LANGS = [
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

// 1. Update en.json first
const enPath = path.join(TRANSLATIONS_DIR, 'en.json');
const en = JSON.parse(fs.readFileSync(enPath, 'utf-8'));
en['home.mainHero.title'] = EN_H1;
en['home.mainHero.titleHighlight'] = ''; // Clear old highlight (now merged into title)
en['home.mainHero.subtitle'] = EN_SUBTITLE;
fs.writeFileSync(enPath, JSON.stringify(en, null, 2) + '\n');
console.log('✅ Updated en.json');

// 2. Translate for each target language
async function translate(text, sourceLang, targetLang) {
  const response = await fetch(DEEPSEEK_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${DEEPSEEK_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'deepseek-chat',
      messages: [
        { role: 'system', content: `You are a professional translator. Translate the following text from ${sourceLang} to ${targetLang}. Return ONLY the translated text, nothing else. No explanations.` },
        { role: 'user', content: text },
      ],
      temperature: 0.3,
    }),
  });
  const data = await response.json();
  return data.choices[0].message.content.trim();
}

async function main() {
  for (const lang of TARGET_LANGS) {
    const filePath = path.join(TRANSLATIONS_DIR, `${lang.code}.json`);
    const json = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    
    console.log(`\n🌐 Translating to ${lang.name} (${lang.code})...`);
    
    // Translate h1
    let h1Translation = await translate(EN_H1, 'English', lang.name);
    console.log(`  h1: "${h1Translation}"`);
    json['home.mainHero.title'] = h1Translation;
    json['home.mainHero.titleHighlight'] = '';
    
    // Translate subtitle
    let subtitleTranslation = await translate(EN_SUBTITLE, 'English', lang.name);
    console.log(`  subtitle: "${subtitleTranslation.substring(0, 60)}..."`);
    json['home.mainHero.subtitle'] = subtitleTranslation;
    
    fs.writeFileSync(filePath, JSON.stringify(json, null, 2) + '\n');
    console.log(`  ✅ Updated ${lang.code}.json`);
  }
  
  console.log('\n🎉 All translations complete!');
}

main().catch(err => {
  console.error('❌ Error:', err.message);
  process.exit(1);
});