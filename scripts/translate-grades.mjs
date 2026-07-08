import fs from 'fs';
import path from 'path';

const TRANS_DIR = 'src/i18n/translations';
const API_KEY = 'sk-b187f5cf84c74f9aac8bd04b7fd0d2f8';

const en = JSON.parse(fs.readFileSync(path.join(TRANS_DIR, 'en.json'), 'utf-8'));
const keys = Object.keys(en).filter(k => k.startsWith('materials.grades.') && k.endsWith('whyChooseUs'));
const source = {};
keys.forEach(k => source[k] = en[k]);

const langs = ['de','ja','fr','es','pt','it','ko','nl','pl'];
const langNames = {de:'German',ja:'Japanese',fr:'French',es:'Spanish',pt:'Portuguese',it:'Italian',ko:'Korean',nl:'Dutch',pl:'Polish'};

async function translate(lang) {
  const fp = path.join(TRANS_DIR, `${lang}.json`);
  const data = JSON.parse(fs.readFileSync(fp, 'utf-8'));
  const needs = {};
  keys.forEach(k => { if (data[k] === source[k]) needs[k] = source[k]; });
  if (Object.keys(needs).length === 0) { console.log(`${lang}: already translated`); return; }
  const body = JSON.stringify({
    model: 'deepseek-chat',
    messages: [
      { role: 'system', content: `You are a professional ${langNames[lang]} translator for industrial manufacturing content. Translate the following JSON values from English to ${langNames[lang]}. Keep keys unchanged. Return ONLY valid JSON.` },
      { role: 'user', content: JSON.stringify(needs, null, 2) }
    ],
    temperature: 0.1,
  });
  const resp = await fetch('https://api.deepseek.com/v1/chat/completions', {
    method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${API_KEY}` }, body });
  const result = await resp.json();
  let content = result.choices[0].message.content;
  if (content.includes('```')) content = content.split('```')[1].replace(/^json/, '');
  const translated = JSON.parse(content.trim());
  Object.keys(translated).forEach(k => { if (keys.includes(k)) data[k] = translated[k]; });
  fs.writeFileSync(fp, JSON.stringify(data, null, 2), 'utf-8');
  console.log(`${lang}: ✅ ${Object.keys(translated).length} keys`);
}

(async () => {
  for (const lang of langs) { await translate(lang); }
  console.log('All done!');
})();
