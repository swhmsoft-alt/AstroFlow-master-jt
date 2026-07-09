/**
 * translate-hero-about.mjs
 * Translates hero.about.* keys into all 9 non-English languages.
 * Usage: node scripts/translate-hero-about.mjs
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
  de: 'German', fr: 'French', es: 'Spanish', pt: 'Portuguese',
  it: 'Italian', ko: 'Korean', nl: 'Dutch', pl: 'Polish', ja: 'Japanese',
};

const en = JSON.parse(fs.readFileSync(EN_JSON, 'utf-8'));
const HERO_KEYS = ['hero.about.h1', 'hero.about.badge', 'hero.about.subtitle'];

async function translate(langCode, langName) {
  const langPath = path.join(LANGS_DIR, `${langCode}.json`);
  const langData = JSON.parse(fs.readFileSync(langPath, 'utf-8'));
  const toTranslate = HERO_KEYS.filter(k => langData[k] === undefined || langData[k] === en[k]);
  if (toTranslate.length === 0) { console.log(`${langCode}: Nothing to translate.`); return; }

  const entries = toTranslate.map(k => [k, en[k]]);
  const jsonInput = JSON.stringify(Object.fromEntries(entries), null, 2);
  const prompt = `Translate the following English hero section texts to natural, professional ${langName}. Keep technical terms (CNC, OEM, ODM) and brand names (BOZE, BOZE CNC-Ti, BOZE Metal) unchanged. Return ONLY valid JSON with same keys. No markdown.\n\n${jsonInput}`;

  const resp = await fetch(DEEPSEEK_API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${DEEPSEEK_API_KEY}` },
    body: JSON.stringify({ model: 'deepseek-chat', messages: [{ role: 'system', content: `Translate to ${langName}. Return ONLY valid JSON.` }, { role: 'user', content: prompt }], temperature: 0.1, max_tokens: 4000 }),
  });
  const data = await resp.json();
  const content = data.choices[0].message.content.trim();
  const m = content.match(/```(?:json)?\s*([\s\S]*?)\s*```/) || content.match(/{[\s\S]*?}/);
  const result = JSON.parse(m ? m[1] || m[0] : content);
  for (const [k, v] of Object.entries(result)) { if (v && typeof v === 'string') langData[k] = v; }
  const sorted = {};
  for (const k of Object.keys(langData).sort()) sorted[k] = langData[k];
  fs.writeFileSync(langPath, JSON.stringify(sorted, null, 2), 'utf-8');
  console.log(`${langCode}: ${Object.keys(result).length} keys translated`);
}

for (const [code, name] of Object.entries(TARGET_LANGS)) {
  try { await translate(code, name); await new Promise(r => setTimeout(r, 1000)); }
  catch (e) { console.error(`${code} failed: ${e.message}`); }
}
console.log('Done');
