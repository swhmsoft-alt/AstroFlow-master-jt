/**
 * Translate inspection page Section 2 keys to all 8 remaining languages.
 * Usage: node scripts/add-inspection-s2-keys-all.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DIR = path.resolve(__dirname, '../src/i18n/translations');
const KEY = 'sk-b187f5cf84c74f9aac8bd04b7fd0d2f8';
const URL = 'https://api.deepseek.com/v1/chat/completions';
const LANG = { de:'German', fr:'French', es:'Spanish', pt:'Portuguese', it:'Italian', ko:'Korean', nl:'Dutch', pl:'Polish' };

async function translateAll(texts, langName, langCode) {
  const keys = Object.keys(texts);
  const BATCH = 8;
  const result = {};
  for (let i = 0; i < keys.length; i += BATCH) {
    const batch = {};
    for (const k of keys.slice(i, i + BATCH)) batch[k] = texts[k];
    const resp = await fetch(URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${KEY}` },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          { role: 'system', content: `Professional ${langName} translator for industrial/manufacturing content. Keep terms like CMM, GD&T, FPI, UT, NDT, Nadcap, ASME, ASTM, ISO, AMS, Rockwell, Brinell exactly as-is. Return ONLY valid JSON.` },
          { role: 'user', content: `Translate to ${langName}. Return JSON with SAME keys:\n${JSON.stringify(batch, null, 2)}` }
        ],
        temperature: 0.3,
      }),
    });
    const data = await resp.json();
    const c = data.choices[0].message.content.trim();
    const m = c.match(/\{[\s\S]*\}/);
    if (m) Object.assign(result, JSON.parse(m[0]));
    else console.error(`  ⚠ No JSON in batch, raw: ${c.substring(0,200)}`);
  }
  return result;
}

async function main() {
  const en = JSON.parse(fs.readFileSync(path.join(DIR, 'en.json'), 'utf-8'));
  const s2keys = {};
  for (const [k, v] of Object.entries(en)) {
    if (k.startsWith('cap.inspectionpage.s2')) s2keys[k] = v;
  }
  console.log(`📦 ${Object.keys(s2keys).length} s2 keys to translate\n`);

  for (const [code, name] of Object.entries(LANG)) {
    const fp = path.join(DIR, `${code}.json`);
    const json = JSON.parse(fs.readFileSync(fp, 'utf-8'));
    const missing = {};
    for (const [k, v] of Object.entries(s2keys)) { if (!json[k]) missing[k] = v; }
    if (Object.keys(missing).length === 0) { console.log(`⏭️  ${code} - all exist`); continue; }
    console.log(`🌐 ${code} (${name}) - ${Object.keys(missing).length} missing...`);
    const t = await translateAll(missing, name, code);
    let added = 0;
    for (const [k, v] of Object.entries(t)) { if (!json[k]) { json[k] = v; added++; } }
    const sorted = {};
    for (const k of Object.keys(json).sort()) sorted[k] = json[k];
    fs.writeFileSync(fp, JSON.stringify(sorted, null, 2) + '\n');
    console.log(`  ✅ ${added} keys added`);
  }
  console.log(`\n🎉 Done!`);
}

main().catch(e => { console.error(`❌ ${e.message}`); process.exit(1); });
