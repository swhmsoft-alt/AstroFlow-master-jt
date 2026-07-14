import fs from 'fs';
const KEY = 'sk-b187f5cf84c74f9aac8bd04b7fd0d2f8';
const DIR = 'src/i18n/translations';
const en = JSON.parse(fs.readFileSync(DIR+'/en.json','utf8'));
const ja = JSON.parse(fs.readFileSync(DIR+'/ja.json','utf8'));

// All untranslated industry content keys
const pending = {};
Object.keys(en).filter(k => k.startsWith('industries.uav.') && !k.includes('.page.')).forEach(k => {
  if (!ja[k] || ja[k] === en[k]) pending[k] = en[k];
});

const list = Object.keys(pending);
if (list.length === 0) { console.log('All translated'); process.exit(0); }

// Take just 15 keys per batch to avoid timeout
const batchSize = Math.min(15, list.length);
const batch = list.slice(0, batchSize);
const batchObj = {};
for (const k of batch) batchObj[k] = pending[k];

const sysPrompt = `You are a professional Japanese (JIS standard) industrial translator for titanium and CNC manufacturing. 

CRITICAL RULES:
1. Use 敬語 (keigo), polite manufacturing business register
2. Keep EXACTLY as-is: AS9100D, ASTM, CMM, GD&T, Grade 5, Grade 23, Ti-6Al-4V, Ti-6Al-4V ELI, Ti-3Al-8V-6Cr-4Mo-4Zr, EN 10204, 3.1, MTR, AS9102, FAIR, DFARS, ASME Y14.5, ISO 13485, ISO 17025, ISO 10993, ISO 14971, ISO 19227, ISO 11737, MIL-S-8879C, AS8879, ASTM F136, ASTM F543, ASTM E466, ASTM E2371, ZEISS, DMG MORI, Mazak, CAD, STEP, IGES, STL, CNC, CAM, FEA, SPC, UTS, Ra, µm, MPa, %, mm, °C, UNJF, MJ
3. Never translate JSON keys, only values
4. Return ONLY valid JSON object with exact same keys

Titanium terminology:
- Galling = カリング / 工具溶着
- Built-up Edge (BUE) = 構成刃先
- Feed Rate = 送り速度
- Heat Treatment = 熱処理
- Residual Stress = 残留応力
- Fatigue Life = 疲労寿命
- Fracture Toughness = 破壊靭性
- Aging = 時効処理`;

const resp = await fetch('https://api.deepseek.com/v1/chat/completions', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + KEY },
  body: JSON.stringify({
    model: 'deepseek-chat',
    messages: [{ role: 'system', content: sysPrompt }, { role: 'user', content: JSON.stringify(batchObj, null, 2) }],
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
    ja[k] = v;
    n++;
  }
}

const sorted = {};
Object.keys(ja).sort().forEach(k => { sorted[k] = ja[k]; });
fs.writeFileSync(DIR+'/ja.json', JSON.stringify(sorted, null, 2) + '\n', 'utf8');
console.log(`Translated ${n}/${batchSize} UAV keys to Japanese`);
