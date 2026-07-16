/**
 * translate-remaining.mjs
 * Translate remaining ti-6211 keys for nl, pl, ru, ar
 * These 4 languages still have 100% English values.
 * Runs each language sequentially.
 */
import fs from 'fs';
const EN = JSON.parse(fs.readFileSync('src/i18n/translations/en.json', 'utf-8'));
const KEYS = Object.keys(EN).filter(k => k.includes('ti-6211')).sort();
const SRC = {};
KEYS.forEach(k => SRC[k] = EN[k]);

const API_KEY = 'sk-b187f5cf84c74f9aac8bd04b7fd0d2f8';
const API_URL = 'https://api.deepseek.com/v1/chat/completions';

const LANGS = {
  nl: { name: 'Dutch', prompt: 'Translate the following JSON values from English to Dutch. CRITICAL: Translate EVERY value. NEVER return English text. Keep these terms exactly as-is: Ti-6211, Ti-6Al-2Nb-1Ta-0.8Mo, Ti-621/0.8, UNS R56210, all element symbols (Al, Nb, Ta, Mo, V, Sn, Zr, Cr, Fe), all grade names (Grade 5, Grade 23, Grade 9, Grade 6242), all acronyms (SCC, KIC, KISCC, HIP, HAZ, TIG, EDM, CNC, CMM, NDT, MTR, DFM, NADCAP), all standard designations (ASTM, AMS, MIL, NACE, ISO, ABS, NAVSEA, AS9100D, AS9102, EN 10204), all units (MPa, ksi, GPa, HRC, W/(m·K), g/cm³, lb/in³, mm, °C, °F), and BOZE CNC Ti. Return ONLY valid JSON.' },
  pl: { name: 'Polish', prompt: 'Translate the following JSON values from English to Polish. CRITICAL: Translate EVERY value. NEVER return English text. Keep these terms exactly as-is: Ti-6211, Ti-6Al-2Nb-1Ta-0.8Mo, Ti-621/0.8, UNS R56210, all element symbols (Al, Nb, Ta, Mo, V, Sn, Zr, Cr, Fe), all grade names (Grade 5, Grade 23, Grade 9, Grade 6242), all acronyms (SCC, KIC, KISCC, HIP, HAZ, TIG, EDM, CNC, CMM, NDT, MTR, DFM, NADCAP), all standard designations (ASTM, AMS, MIL, NACE, ISO, ABS, NAVSEA, AS9100D, AS9102, EN 10204), all units (MPa, ksi, GPa, HRC, W/(m·K), g/cm³, lb/in³, mm, °C, °F), and BOZE CNC Ti. Return ONLY valid JSON.' },
  ru: { name: 'Russian', prompt: 'Translate the following JSON values from English to Russian. CRITICAL: Translate EVERY value. NEVER return English text. Keep these terms exactly as-is: Ti-6211, Ti-6Al-2Nb-1Ta-0.8Mo, Ti-621/0.8, UNS R56210, all element symbols (Al, Nb, Ta, Mo, V, Sn, Zr, Cr, Fe), all grade names (Grade 5, Grade 23, Grade 9, Grade 6242), all acronyms (SCC, KIC, KISCC, HIP, HAZ, TIG, EDM, CNC, CMM, NDT, MTR, DFM, NADCAP), all standard designations (ASTM, AMS, MIL, NACE, ISO, ABS, NAVSEA, AS9100D, AS9102, EN 10204), all units (MPa, ksi, GPa, HRC, W/(m·K), g/cm³, lb/in³, mm, °C, °F), and BOZE CNC Ti. Return ONLY valid JSON.' },
  ar: { name: 'Arabic', prompt: 'Translate the following JSON values from English to Arabic. CRITICAL: Translate EVERY value. NEVER return English text. Keep these terms exactly as-is: Ti-6211, Ti-6Al-2Nb-1Ta-0.8Mo, Ti-621/0.8, UNS R56210, all element symbols (Al, Nb, Ta, Mo, V, Sn, Zr, Cr, Fe), all grade names (Grade 5, Grade 23, Grade 9, Grade 6242), all acronyms (SCC, KIC, KISCC, HIP, HAZ, TIG, EDM, CNC, CMM, NDT, MTR, DFM, NADCAP), all standard designations (ASTM, AMS, MIL, NACE, ISO, ABS, NAVSEA, AS9100D, AS9102, EN 10204), all units (MPa, ksi, GPa, HRC, W/(m·K), g/cm³, lb/in³, mm, °C, °F), and BOZE CNC Ti. Return ONLY valid JSON.' },
};

async function translateOne(lang, { name, prompt }) {
  const fp = `src/i18n/translations/${lang}.json`;
  const data = JSON.parse(fs.readFileSync(fp, 'utf-8'));
  const needs = {};
  KEYS.forEach(k => { if (data[k] === undefined || data[k] === SRC[k]) needs[k] = SRC[k]; });
  const total = Object.keys(needs).length;
  if (total === 0) { console.log(`${lang}: ✅ already done`); return; }

  console.log(`\n${lang} (${name}): ${total} keys to translate`);
  
  // Process in batches of 40
  const entries = Object.entries(needs);
  let done = 0;
  for (let i = 0; i < entries.length; i += 40) {
    const batch = Object.fromEntries(entries.slice(i, i + 40));
    console.log(`  Batch ${i/40 + 1}/${Math.ceil(entries.length/40)} (${Object.keys(batch).length} keys)...`);
    
    const resp = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${API_KEY}` },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          { role: 'system', content: prompt },
          { role: 'user', content: JSON.stringify(batch, null, 2) }
        ],
        temperature: 0.3,
      })
    });
    const result = await resp.json();
    let content = result.choices[0].message.content;
    if (content.includes('```')) content = content.split('```')[1].replace(/^json\n?/, '');
    const translated = JSON.parse(content.trim());
    Object.keys(translated).forEach(k => { if (KEYS.includes(k)) data[k] = translated[k]; });
    done += Object.keys(translated).length;
    const still = KEYS.filter(k => data[k] === SRC[k]).length;
    console.log(`    ✓ ${Object.keys(translated).length} translated, ${still} still English`);
    if (i + 40 < entries.length) await new Promise(r => setTimeout(r, 500));
  }
  
  fs.writeFileSync(fp, JSON.stringify(data, null, 2), 'utf-8');
  const finalStill = KEYS.filter(k => data[k] === SRC[k]).length;
  console.log(`${lang}: ✅ ${total - finalStill}/${total} done, ${finalStill} still English`);
}

(async () => {
  console.log('🚀 Translating remaining ti-6211 keys...');
  for (const [lang, config] of Object.entries(LANGS)) {
    try { await translateOne(lang, config); }
    catch(e) { console.error(`${lang}: ❌ ${e.message}`); }
  }
  console.log('\n✅ All done!');
})();
