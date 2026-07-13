/**
 * translate-home-hero.mjs
 * Translate 3 homepage hero keys from English to Russian and Arabic via DeepSeek.
 * Only adds hero.home.* keys, does NOT modify home.hero.* keys.
 *
 * Usage: node scripts/translate-home-hero.mjs
 */
import fs from 'fs';
const API_KEY = 'sk-b187f5cf84c74f9aac8bd04b7fd0d2f8';
const API_URL = 'https://api.deepseek.com/v1/chat/completions';

async function translate(texts, srcLang, tgtLang, tgtName) {
  const src = {};
  texts.forEach((t, i) => { src[`text_${i}`] = t; });
  const resp = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${API_KEY}` },
    body: JSON.stringify({
      model: 'deepseek-chat',
      messages: [
        { role: 'system', content: `Translate from ${srcLang} to ${tgtLang}. Return ONLY valid JSON. No markdown. No extra text.` },
        { role: 'user', content: JSON.stringify(src, null, 2) },
      ],
      temperature: 0.1,
      max_tokens: 4096,
    }),
  });
  const json = await resp.json();
  let txt = json.choices[0].message.content;
  const m = txt.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (m) txt = m[1];
  return JSON.parse(txt.trim());
}

const dir = 'src/i18n/translations';

const HERO_KEYS = {
  'hero.home.h1': 'End-to-End Titanium Manufacturing Solutions',
  'hero.home.subtitle': 'From titanium additive manufacturing and precision CNC machining to fabrication, finishing, and assembly, we provide complete one-stop solutions for custom titanium parts and components. Built on AS9100-compliant quality systems, we support projects from prototype development to full-scale production.',
  'hero.home.badge': 'Industry-Leading Solutions | AS9100D Certified',
};

async function main() {
  const configs = [
    { lang: 'ru', name: 'Russian' },
    { lang: 'ar', name: 'Arabic' },
  ];

  for (const cfg of configs) {
    console.log(`\n--- Translating to ${cfg.name} ---`);
    const filePath = `${dir}/${cfg.lang}.json`;
    const json = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    
    // Skip if already has hero.home.h1
    if (json['hero.home.h1']) {
      console.log(`  hero.home.h1 already exists, skipping ${cfg.lang}`);
      continue;
    }

    const texts = Object.values(HERO_KEYS);
    console.log(`  Translating ${texts.length} texts...`);
    
    const result = await translate(texts, 'English', cfg.name, cfg.name);
    const keys = Object.keys(HERO_KEYS);
    for (let i = 0; i < keys.length; i++) {
      json[keys[i]] = result[`text_${i}`] || texts[i];
    }
    
    fs.writeFileSync(filePath, JSON.stringify(json, null, 2), 'utf-8');
    console.log(`  ✅ ${cfg.lang}.json updated`);
  }
  console.log('\nDone.');
}

main().catch(console.error);
