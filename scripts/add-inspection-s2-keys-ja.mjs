/**
 * Translate inspection page Section 2 keys to Japanese.
 * Usage: node scripts/add-inspection-s2-keys-ja.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DIR = path.resolve(__dirname, '../src/i18n/translations');
const API_KEY = 'sk-b187f5cf84c74f9aac8bd04b7fd0d2f8';
const API_URL = 'https://api.deepseek.com/v1/chat/completions';

async function translateBatch(texts) {
  const keys = Object.keys(texts);
  const BATCH = 8;
  const result = {};
  for (let i = 0; i < keys.length; i += BATCH) {
    const batch = {};
    for (const k of keys.slice(i, i + BATCH)) batch[k] = texts[k];
    console.log(`  ⏳ Batch ${Math.floor(i / BATCH) + 1}/${Math.ceil(keys.length / BATCH)}...`);
    const resp = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${API_KEY}` },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          { role: 'system', content: 'Translate industrial/manufacturing content to Japanese. Keep technical terms like CMM, GD&T, FPI, UT, NDT, Nadcap, ASME, ASTM, ISO, AMS exactly as-is. DO NOT translate JSON keys. Return ONLY valid JSON.' },
          { role: 'user', content: `Translate to Japanese. Return JSON with SAME keys:\n${JSON.stringify(batch, null, 2)}` }
        ],
        temperature: 0.3,
      }),
    });
    const data = await resp.json();
    const c = data.choices[0].message.content.trim();
    const m = c.match(/\{[\s\S]*\}/);
    if (m) Object.assign(result, JSON.parse(m[0]));
    else throw new Error(`No JSON in batch ${i}`);
  }
  return result;
}

async function main() {
  const jaPath = path.join(DIR, 'ja.json');
  const enPath = path.join(DIR, 'en.json');
  const ja = JSON.parse(fs.readFileSync(jaPath, 'utf-8'));
  const en = JSON.parse(fs.readFileSync(enPath, 'utf-8'));

  // Find missing s2 keys
  const missing = {};
  for (const [k, v] of Object.entries(en)) {
    if (k.startsWith('cap.inspectionpage.s2') && !ja[k]) missing[k] = v;
  }

  if (Object.keys(missing).length === 0) { console.log('All exist'); return; }
  console.log(`🌐 ${Object.keys(missing).length} missing keys → Japanese\n`);
  const t = await translateBatch(missing);
  let added = 0;
  for (const [k, v] of Object.entries(t)) { if (!ja[k]) { ja[k] = v; added++; } }
  const sorted = {};
  for (const k of Object.keys(ja).sort()) sorted[k] = ja[k];
  fs.writeFileSync(jaPath, JSON.stringify(sorted, null, 2) + '\n');
  console.log(`\n📝 ${added} keys added to ja.json`);
}

main().catch(e => { console.error(`❌ ${e.message}`); process.exit(1); });
