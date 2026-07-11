/**
 * Translate inspection page Section 3 keys to all 9 languages.
 * Usage: node scripts/add-inspection-s3-keys-all.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DIR = path.resolve(__dirname, '../src/i18n/translations');
const KEY = 'sk-b187f5cf84c74f9aac8bd04b7fd0d2f8';
const URL = 'https://api.deepseek.com/v1/chat/completions';
const LANG = { de:'German', ja:'Japanese', fr:'French', es:'Spanish', pt:'Portuguese', it:'Italian', ko:'Korean', nl:'Dutch', pl:'Polish' };

async function translateAll(texts, langName) {
  const keys = Object.keys(texts); const BATCH = 5; const result = {};
  for (let i = 0; i < keys.length; i += BATCH) {
    const batch = {}; for (const k of keys.slice(i, i + BATCH)) batch[k] = texts[k];
    const resp = await fetch(URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${KEY}` },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          { role: 'system', content: `Professional ${langName} translator for industrial/manufacturing content. Keep terms like CMM, OES, SPC, FPI, UT, NDT, MTR, CoC, FAIR, AS9102, EN 10204, GD&T exactly as-is. Return ONLY valid JSON.` },
          { role: 'user', content: `Translate to ${langName}. Return JSON with SAME keys:\n${JSON.stringify(batch, null, 2)}` }
        ],
        temperature: 0.3,
      }),
    });
    const data = await resp.json();
    const c = data.choices[0].message.content.trim();
    const m = c.match(/\{[\s\S]*\}/);
    if (m) Object.assign(result, JSON.parse(m[0]));
  }
  return result;
}

async function main() {
  const en = JSON.parse(fs.readFileSync(path.join(DIR, 'en.json'), 'utf-8'));
  const s3keys = {};
  for (const [k, v] of Object.entries(en)) if (k.startsWith('cap.inspectionpage.s3')) s3keys[k] = v;
  console.log(`📦 ${Object.keys(s3keys).length} s3 keys\n`);

  for (const [code, name] of Object.entries(LANG)) {
    const fp = path.join(DIR, `${code}.json`);
    const json = JSON.parse(fs.readFileSync(fp, 'utf-8'));
    const missing = {};
    for (const [k, v] of Object.entries(s3keys)) if (!json[k]) missing[k] = v;
    if (Object.keys(missing).length === 0) { console.log(`⏭️  ${code}`); continue; }
    console.log(`🌐 ${code} (${name}) - ${Object.keys(missing).length} missing...`);
    const t = await translateAll(missing, name);
    let added = 0;
    for (const [k, v] of Object.entries(t)) { if (!json[k]) { json[k] = v; added++; } }
    const sorted = {};
    for (const k of Object.keys(json).sort()) sorted[k] = json[k];
    fs.writeFileSync(fp, JSON.stringify(sorted, null, 2) + '\n');
    console.log(`  ✅ ${added} keys`);
  }
  console.log(`\n🎉 Done!`);
}

main().catch(e => { console.error(`❌ ${e.message}`); process.exit(1); });
