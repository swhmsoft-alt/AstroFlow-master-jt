/**
 * Add ALL missing cap.inspectionpage.* keys to ko.json via DeepSeek.
 * ko.json has only 35 keys but en.json has 89.
 * Usage: node scripts/add-inspection-all-keys-ko.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DIR = path.resolve(__dirname, '../src/i18n/translations');
const KEY = 'sk-b187f5cf84c74f9aac8bd04b7fd0d2f8';
const API = 'https://api.deepseek.com/v1/chat/completions';

async function tr(texts) {
  const k = Object.keys(texts); const r = {}; const BATCH = 10;
  for (let i = 0; i < k.length; i += BATCH) {
    const b = {}; for (const x of k.slice(i, i + BATCH)) b[x] = texts[x];
    const resp = await fetch(API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${KEY}` },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          { role: 'system', content: 'Professional Korean translator for industrial/manufacturing content. Keep terms like CNC, CMM, EDM, FPI, UT, NDT, SPC, GD&T, OES, PMI, MTR, CoC, FAIR, AS9102, ASME, ASTM, ISO, EN 10204, Nadcap, ZEISS, CONTURA, OGP, SPECTROMAXx, Mitutoyo, Olympus, OmniScan exactly as-is. Return ONLY valid JSON.' },
          { role: 'user', content: `Translate to Korean. Return JSON with SAME keys:\n${JSON.stringify(b, null, 2)}` }
        ],
        temperature: 0.3,
      }),
    });
    const d = await resp.json();
    const c = d.choices[0].message.content.trim();
    const m = c.match(/\{[\s\S]*\}/);
    if (m) Object.assign(r, JSON.parse(m[0]));
  }
  return r;
}

async function main() {
  const en = JSON.parse(fs.readFileSync(path.join(DIR, 'en.json'), 'utf-8'));
  const ko = JSON.parse(fs.readFileSync(path.join(DIR, 'ko.json'), 'utf-8'));
  
  // Find ALL cap.inspectionpage.* keys missing from ko
  const missing = {};
  for (const [k, v] of Object.entries(en)) {
    if (k.startsWith('cap.inspectionpage.') && !ko[k]) missing[k] = v;
  }

  if (Object.keys(missing).length === 0) { console.log('✅ All exist in ko.json'); return; }
  console.log(`🌐 ${Object.keys(missing).length} missing cap.inspectionpage.* keys in ko.json\n`);

  const t = await tr(missing);
  let added = 0;
  for (const [k, v] of Object.entries(t)) { if (!ko[k]) { ko[k] = v; added++; } }
  const s = {}; for (const k of Object.keys(ko).sort()) s[k] = ko[k];
  fs.writeFileSync(path.join(DIR, 'ko.json'), JSON.stringify(s, null, 2) + '\n');
  console.log(`\n📝 Added ${added} keys to ko.json`);
}

main().catch(e => { console.error(`❌ ${e.message}`); process.exit(1); });
