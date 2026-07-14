/**
 * 强制翻译所有语言中未翻译的行业内容
 * 逐步处理每个语言，每次10条
 */
import fs from 'fs';

const DIR = 'c:/Users/Administrator/Desktop/AstroFlow-master-jt/src/i18n/translations';
const KEY = 'sk-b187f5cf84c74f9aac8bd04b7fd0d2f8';
const LANG_NAMES = { de:'German (DIN)', fr:'French (AFNOR)', es:'Spanish (UNE/ISO)', pt:'Portuguese (ABNT/ISO)', it:'Italian (UNI)', ko:'Korean (KS)', nl:'Dutch (NEN)', pl:'Polish (PN)', ru:'Russian (GOST)', ar:'Arabic (SASO/MSA)' };
const LANG_TONES = { de:'Formal Sie. Compound nouns.', fr:'Formal Vous.', es:'Professional B2B.', pt:'Professional B2B.', it:'High-precision engineering.', ko:'Formal 존댓말.', nl:'Corporate B2B.', pl:'Corporate B2B.', ru:'Formal technical. Expect expansion.', ar:'Formal MSA. RTL formatting.' };

const en = JSON.parse(fs.readFileSync(DIR+'/en.json', 'utf8'));
const code = process.argv[2] || 'de';
const target = JSON.parse(fs.readFileSync(DIR+'/'+code+'.json', 'utf8'));

// ALL industry keys that need translation
const keys = Object.keys(en).filter(k => k.startsWith('industries.') && !k.includes('.page.'));
const todo = {};
for (const k of keys) {
  if (!target[k] || target[k] === en[k]) todo[k] = en[k];
}

const list = Object.keys(todo);
// Skip pure standard-name keys
const contentKeys = list.filter(k => {
  const v = en[k];
  return !v.match(/^(AS[89][0-9][0-9]|EN 10204|ASME |ISO [0-9]|ZEISS|NADCAP|AMS |MIL-|SAE |AWS |NACE |API |FDA |RoHS|REACH|SEMI )/);
});

if (contentKeys.length === 0) {
  console.log(`${code}: ✅ All content translated (remaining ${list.length} are standard names)`);
  process.exit(0);
}

const batch = contentKeys.slice(0, 10);
const batchObj = {};
for (const k of batch) batchObj[k] = todo[k];

console.log(`${code} (${LANG_NAMES[code]}): ${contentKeys.length} content keys to translate, doing ${batch.length} now...`);

const resp = await fetch('https://api.deepseek.com/v1/chat/completions', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + KEY },
  body: JSON.stringify({
    model: 'deepseek-chat',
    messages: [
      { role: 'system', content: `Professional ${LANG_NAMES[code]} industrial translator. ${LANG_TONES[code]} IMPORTANT: You MUST translate every string to proper ${code} technical language. Keep ONLY standard names (AS9100D, ASTM, CMM, GD&T, Grade 5, Ti-6Al-4V, µm, MPa, CNC) as-is. Translate all other words including "Technical Implementation", "Entity Cluster", "5-Axis CNC Milling", etc. to ${code}. Return ONLY valid JSON.` },
      { role: 'user', content: `Translate ALL of the following to ${code}. Every value MUST be in ${code}. Return ONLY JSON:\n\n${JSON.stringify(batchObj, null, 2)}` }
    ],
    temperature: 0.2
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

const sorted = {};
Object.keys(target).sort().forEach(k => { sorted[k] = target[k]; });
fs.writeFileSync(DIR+'/'+code+'.json', JSON.stringify(sorted, null, 2) + '\n', 'utf8');
console.log(`${code}: ✅ ${n} translated (${contentKeys.length - batch.length} content keys remaining)`);
