/**
 * 批量翻译 — 增量保存，每次运行翻译一个语言的一个批次
 * 用法: node scripts/batch-translate.mjs [语言代码]
 * 示例: node scripts/batch-translate.mjs de
 */
import fs from 'fs';
const DIR = 'c:/Users/Administrator/Desktop/AstroFlow-master-jt/src/i18n/translations';
const KEY = 'sk-b187f5cf84c74f9aac8bd04b7fd0d2f8';

const LANG_INFO = {
  de:{name:'German',std:'DIN',tone:'Formal Sie. Compound nouns.'},
  fr:{name:'French',std:'AFNOR',tone:'Formal Vous.'},
  es:{name:'Spanish',std:'UNE/ISO',tone:'Professional B2B.'},
  pt:{name:'Portuguese',std:'ABNT/ISO',tone:'Professional B2B.'},
  it:{name:'Italian',std:'UNI',tone:'High-precision engineering.'},
  nl:{name:'Dutch',std:'NEN',tone:'Corporate B2B.'},
  pl:{name:'Polish',std:'PN',tone:'Corporate B2B.'},
  ru:{name:'Russian',std:'GOST',tone:'Formal technical. Expect expansion.'},
  ar:{name:'Arabic',std:'SASO',tone:'Formal MSA. RTL. Expect contraction.'},
};

const code = process.argv[2];
if (!code || !LANG_INFO[code]) {
  console.log('Usage: node scripts/batch-translate.mjs [lang]');
  console.log('Langs: ' + Object.keys(LANG_INFO).join(', '));
  process.exit(1);
}

const info = LANG_INFO[code];
const en = JSON.parse(fs.readFileSync(DIR+'/en.json', 'utf8'));
const target = JSON.parse(fs.readFileSync(DIR+'/'+code+'.json', 'utf8'));

// Get untranslated keys (excluding standard names)
const allKeys = Object.keys(en).filter(k => 
  k.startsWith('industries.') && 
  !k.includes('.page.') &&
  !en[k].match(/^(EN |AS[89]|ASME |ISO |ZEISS|MTR|FAIR|DFARS|SPC|UHV|EMI|CRDM)/)
);
const todo = {};
for (const k of allKeys) {
  if (!target[k] || target[k] === en[k]) todo[k] = en[k];
}

const keys = Object.keys(todo);
if (keys.length === 0) { console.log(code + ': ✅ All done!'); process.exit(0); }

// Take only first 10 keys to ensure we finish within timeout
const batch = keys.slice(0, 10);
const batchObj = {};
for (const k of batch) batchObj[k] = todo[k];

console.log(code + ': translating ' + batch.length + '/' + keys.length + ' remaining...');

const resp = await fetch('https://api.deepseek.com/v1/chat/completions', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + KEY },
  body: JSON.stringify({
    model: 'deepseek-chat',
    messages: [
      { role: 'system', content: `Professional ${info.name} (${info.std}) industrial translator. ${info.tone} Keep standard names (AS9100D, ASTM, CMM, GD&T, Grade 5, Ti-6Al-4V, etc.) EXACTLY as-is. Return ONLY valid JSON. No markdown.` },
      { role: 'user', content: JSON.stringify(batchObj, null, 2) }
    ],
    temperature: 0.1
  })
});

const data = await resp.json();
const raw = data.choices?.[0]?.message?.content || '{}';
const cleaned = raw.replace(/```json\s*/gi, '').replace(/```/g, '').trim();
const result = JSON.parse(cleaned);

let n = 0;
for (const [k, v] of Object.entries(result)) {
  if (v && typeof v === 'string' && v.length > 0 && v !== en[k]) {
    target[k] = v;
    n++;
  }
}

// Save progress
const sorted = {};
Object.keys(target).sort().forEach(k => { sorted[k] = target[k]; });
fs.writeFileSync(DIR+'/'+code+'.json', JSON.stringify(sorted, null, 2) + '\n', 'utf8');

console.log(`${code}: ✅ ${n} translated (${keys.length - batch.length} remaining)`);
