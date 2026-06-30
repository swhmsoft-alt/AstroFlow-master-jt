/**
 * Add passivation specs dashboard metric keys to all languages.
 * Missing keys: metric0-3.label, metric0-3.desc
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DIR = path.resolve(__dirname, '../src/i18n/translations');
const EN = path.resolve(DIR, 'en.json');
const API_KEY = 'sk-b187f5cf84c74f9aac8bd04b7fd0d2f8';
const API_URL = 'https://api.deepseek.com/v1/chat/completions';
const LANGS = ['de','fr','es','pt','it','ko','nl','pl'];
const LN = { de:'German', fr:'French', es:'Spanish', pt:'Portuguese', it:'Italian', ko:'Korean', nl:'Dutch', pl:'Polish' };

const newEn = {
  "services.passivationspecsdashboard.metric0.label": "Surface Free-Iron Metric",
  "services.passivationspecsdashboard.metric0.desc": "Strict zero-trace parameters verified via potassium ferricyanide copper-spot testing protocols — no detectable free iron particles remaining on treated surfaces.",
  "services.passivationspecsdashboard.metric1.label": "Compliance Accreditations",
  "services.passivationspecsdashboard.metric1.desc": "100% fully interlocked under ASTM F86, ASTM A967, and AMS 2700 Type 2/3 structural codes — full material traceability with batch-level certification documentation.",
  "services.passivationspecsdashboard.metric2.label": "Cyclic Salt Spray Durability",
  "services.passivationspecsdashboard.metric2.desc": "Continuous anti-corrosion tracking exceeding 1,000+ hours zero-pitting boundaries per ASTM B117 standards — validated by accredited third-party corrosion laboratories.",
  "services.passivationspecsdashboard.metric3.label": "Native Oxide Continuity",
  "services.passivationspecsdashboard.metric3.desc": "100% uniform amorphous TiO₂ film crystallization lacking micro crystal-boundary defects — verified via electrochemical impedance spectroscopy (EIS) across entire treated surface."
};

const allKeys = Object.keys(newEn);

// Update en.json
const en = JSON.parse(fs.readFileSync(EN, 'utf-8'));
for (const [k,v] of Object.entries(newEn)) { en[k] = v; }
const s = {};
for (const k of Object.keys(en).sort()) { s[k] = en[k]; }
fs.writeFileSync(EN, JSON.stringify(s, null, 2), 'utf-8');
console.log('en.json updated');

// Translate to all languages
async function translateAll() {
  for (const lang of ['ja', ...LANGS]) {
    const lf = path.resolve(DIR, `${lang}.json`);
    const ld = JSON.parse(fs.readFileSync(lf, 'utf-8'));
    const untranslated = allKeys.filter(k => !(k in ld) || ld[k] === en[k]);
    if (untranslated.length === 0) { console.log(`  ${lang}: none`); continue; }
    
    const toT = {};
    for (const k of untranslated) { toT[k] = en[k]; }
    const ji = JSON.stringify(toT, null, 2);
    
    const prompt = `Professional ${LN[lang]||'Japanese'} translator for industrial titanium passivation website.
Translate English JSON to ${LN[lang]||'Japanese'}.

RULES:
- Keep: ASTM, AMS, EIS, TiO₂, pH, mm, hours
- Keep special chars: "—", "×", "±", ">", "<", "°", "₂"
- Translate VALUES only, keep KEYS exactly as-is
- Return ONLY valid JSON

\`\`\`json
${ji}
\`\`\``;

    try {
      const r = await fetch(API_URL, {
        method:'POST',
        headers:{'Content-Type':'application/json','Authorization':`Bearer ${API_KEY}`},
        body: JSON.stringify({
          model:'deepseek-chat',
          messages:[
            {role:'system',content:`Professional ${LN[lang]||'Japanese'} translator. Return ONLY valid JSON.`},
            {role:'user',content:prompt}
          ],
          temperature:0.1, max_tokens:16000
        })
      });
      if (!r.ok) throw new Error(`API ${r.status}`);
      const d = await r.json();
      const c = d.choices[0].message.content.trim();
      const m = c.match(/```(?:json)?\s*([\s\S]*?)\s*```/) || c.match(/{[\s\S]*}/);
      const res = JSON.parse(m ? m[1]||m[0] : c);
      let tr = 0;
      for (const [k,v] of Object.entries(res)) { if (v && typeof v === 'string') { ld[k] = v; tr++; } }
      
      const sorted = {};
      for (const k of Object.keys(ld).sort()) { sorted[k] = ld[k]; }
      fs.writeFileSync(lf, JSON.stringify(sorted, null, 2), 'utf-8');
      console.log(`  ${lang}: +${tr}`);
    } catch (err) { console.error(`  ${lang}: ERROR ${err.message}`); }
  }
}

await translateAll();
console.log('DONE!');