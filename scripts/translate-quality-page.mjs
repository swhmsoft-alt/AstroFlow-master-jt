// Translate page_quality.* keys to target language
import fs from 'fs'; import path from 'path'; import { fileURLToPath } from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DIR = path.resolve(__dirname, '../src/i18n/translations');
const API_KEY = 'sk-b187f5cf84c74f9aac8bd04b7fd0d2f8';
const API_URL = 'https://api.deepseek.com/v1/chat/completions';
const LANG_NAMES = { en:'English', de:'German', ja:'Japanese', fr:'French', es:'Spanish', pt:'Portuguese', it:'Italian', ko:'Korean', nl:'Dutch', pl:'Polish' };

// All page_quality keys from en.json
const SOURCE_KEYS = [
  'page_quality.hero.badge','page_quality.hero.title','page_quality.hero.title_highlight','page_quality.hero.subtitle',
  'page_quality.cards.card1_desc','page_quality.cards.card2_desc','page_quality.cards.card2_label','page_quality.cards.card3_desc',
  'page_quality.workflow.badge','page_quality.workflow.title','page_quality.workflow.title_highlight','page_quality.workflow.subtitle',
  'page_quality.workflow.step1_desc','page_quality.workflow.step2_desc','page_quality.workflow.step3_desc',
  'page_quality.metrology.badge','page_quality.metrology.title','page_quality.metrology.title_highlight','page_quality.metrology.subtitle',
  'page_quality.metrology.metric1_label','page_quality.metrology.metric1_desc',
  'page_quality.metrology.metric2_label','page_quality.metrology.metric2_desc',
  'page_quality.metrology.metric3_label','page_quality.metrology.metric3_desc',
  'page_quality.metrology.metric4_label','page_quality.metrology.metric4_desc',
  'page_quality.docmatrix.badge','page_quality.docmatrix.title','page_quality.docmatrix.title_highlight','page_quality.docmatrix.subtitle',
  'page_quality.docmatrix.col1','page_quality.docmatrix.col2','page_quality.docmatrix.col3','page_quality.docmatrix.row1','page_quality.docmatrix.note',
  'page_quality.faq.badge','page_quality.faq.title','page_quality.faq.title_highlight','page_quality.faq.subtitle',
  'page_quality.faq.q1','page_quality.faq.a1','page_quality.faq.q2','page_quality.faq.a2','page_quality.faq.q3','page_quality.faq.a3','page_quality.faq.q4','page_quality.faq.a4',
  'page_quality.cta.text','page_quality.cta.btn',
];

async function translateBatch(texts, targetLang) {
  const keys = Object.keys(texts); const result = {};
  for (let i = 0; i < keys.length; i += 10) {
    const batch = {}; for (const k of keys.slice(i, i + 10)) batch[k] = texts[k];
    const r = await fetch(API_URL, { method:'POST', headers:{'Content-Type':'application/json','Authorization':'Bearer '+API_KEY},
      body: JSON.stringify({ model:'deepseek-chat', messages: [
        { role:'system', content: 'Translate industrial/quality texts to '+targetLang+'. Keep technical terms: AS9100D, ISO 13485, ISO 9001, CMM, NDT, FPI, UT, OES, PMI, MTR, CoC, FAIR, GD&T, EN 10204, ASME Y14.5, etc. as-is. Return ONLY a JSON object with same keys but translated values.' },
        { role:'user', content: 'Translate to '+targetLang+'. Return JSON with SAME keys:\n'+JSON.stringify(batch,null,2) }
      ], temperature: 0.3 }) });
    const data = await r.json(); const content = data.choices[0].message.content.trim();
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (jsonMatch) Object.assign(result, JSON.parse(jsonMatch[0]));
    else throw new Error('No JSON in response: '+content.substring(0,200));
  }
  return result;
}

async function main() {
  const langCode = process.argv[2]; if (!langCode) { console.error('Usage: node translate-quality-page.mjs <lang>'); process.exit(1); }
  const targetLang = LANG_NAMES[langCode]; if (!targetLang) { console.error('Unsupported: '+langCode); process.exit(1); }
  const filePath = path.join(DIR, langCode+'.json');
  const json = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

  // Build missing map from en.json
  const enPath = path.join(DIR, 'en.json');
  const enJson = JSON.parse(fs.readFileSync(enPath, 'utf-8'));
  const missing = {};
  for (const k of SOURCE_KEYS) { if (!json[k] && enJson[k]) missing[k] = enJson[k]; }

  if (Object.keys(missing).length === 0) { console.log('All keys exist in '+langCode+'.json'); return; }
  console.log('Missing '+Object.keys(missing).length+' keys for '+targetLang);

  if (langCode === 'en') { console.log('en.json is source - nothing to translate'); return; }

  const translated = await translateBatch(missing, targetLang);
  let added = 0;
  for (const [k, v] of Object.entries(translated)) { if (!json[k]) { json[k] = v; added++; } }
  fs.writeFileSync(filePath, JSON.stringify(json, null, 2) + '\n');
  console.log('Wrote '+added+' keys to '+langCode+'.json');
}
main().catch(e => { console.error('\nERROR: '+e.message); process.exit(1); });
