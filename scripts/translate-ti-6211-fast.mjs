/**
 * translate-ti-6211-fast.mjs
 * Batch-translate all 112 ti-6211 keys into remaining untranslated languages.
 * Uses a single API call per language (sends all 112 keys at once).
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DIR = path.resolve(__dirname, '../src/i18n/translations');
const KEY = 'sk-b187f5cf84c74f9aac8bd04b7fd0d2f8';
const URL = 'https://api.deepseek.com/v1/chat/completions';
const EN = JSON.parse(fs.readFileSync(path.join(DIR, 'en.json'), 'utf-8'));
const ALL_KEYS = Object.keys(EN).filter(k => k.includes('ti-6211')).sort();
const SRC = {};
ALL_KEYS.forEach(k => SRC[k] = EN[k]);
const LANG_NAMES = { de:'German', fr:'French', es:'Spanish', pt:'Portuguese', it:'Italian', ko:'Korean', nl:'Dutch', pl:'Polish', ru:'Russian', ar:'Arabic' };

async function translate(lang, langName) {
  const fp = path.join(DIR, `${lang}.json`);
  let raw = fs.readFileSync(fp, 'utf-8');
  if (raw.charCodeAt(0) === 0xFEFF) raw = raw.slice(1);
  const data = JSON.parse(raw);
  
  const needs = {};
  ALL_KEYS.forEach(k => { if (data[k] === undefined || data[k] === SRC[k]) needs[k] = SRC[k]; });
  const n = Object.keys(needs).length;
  if (n === 0) { console.log(`${lang}: ✅ all done`); return; }
  console.log(`${lang}: translating ${n} keys...`);

  const resp = await fetch(URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${KEY}` },
    body: JSON.stringify({
      model: 'deepseek-chat',
      messages: [
        { role: 'system', content: `Professional ${langName} translator for aerospace/metallurgy content. Keep EXACTLY as-is: Ti-6211, Ti-6Al-2Nb-1Ta-0.8Mo, Ti-621/0.8, UNS R56210, alloy elements (Al,Nb,Ta,Mo,V,Sn,Zr,Cr,Fe), all grade names (Grade 5, Grade 23 etc.), acronyms (SCC,KIC,KISCC,HIP,HAZ,TIG,EDM,CNC,CMM,NDT), standards (ASTM,AMS,MIL,NACE,ISO,ABS,NAVSEA,AS9100D), units (MPa,ksi,GPa,HRC,mm,°C,°F), BOZE CNC Ti. Translate property labels and section titles. Return ONLY valid JSON.` },
        { role: 'user', content: JSON.stringify(needs, null, 2) }
      ],
      temperature: 0.1,
    })
  });
  const result = await resp.json();
  let content = result.choices[0].message.content;
  if (content.includes('```')) content = content.split('```')[1].replace(/^json\n?/, '');
  const translated = JSON.parse(content.trim());
  Object.keys(translated).forEach(k => { if (ALL_KEYS.includes(k)) data[k] = translated[k]; });
  fs.writeFileSync(fp, JSON.stringify(data, null, 2), 'utf-8');
  const stillEn = ALL_KEYS.filter(k => data[k] === SRC[k]).length;
  console.log(`${lang}: ✅ ${Object.keys(translated).length} translated, ${stillEn} still English`);
}

(async () => {
  console.log('🚀 Translating ti-6211 keys...\n');
  for (const [lang, name] of Object.entries(LANG_NAMES)) {
    try { await translate(lang, name); } catch(e) { console.error(`${lang}: ❌ ${e.message}`); }
  }
  console.log('\n✅ Done!');
})();
