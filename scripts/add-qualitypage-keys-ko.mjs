/**
 * Add ALL missing qualitypage keys to ko.json via DeepSeek API.
 * ko.json has zero cap.qualitypage.* keys and missing page_quality.metrology.* desc keys.
 *
 * Usage: node scripts/add-qualitypage-keys-ko.mjs
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const TRANSLATIONS_DIR = path.resolve(__dirname, '../src/i18n/translations');

const API_KEY = 'sk-b187f5cf84c74f9aac8bd04b7fd0d2f8';
const API_URL = 'https://api.deepseek.com/v1/chat/completions';

const LANG_CODE = 'ko';
const LANG_NAME = 'Korean';

async function translateBatch(texts) {
  const keys = Object.keys(texts);
  const BATCH = 15;
  const result = {};
  for (let i = 0; i < keys.length; i += BATCH) {
    const batch = {};
    for (const k of keys.slice(i, i + BATCH)) batch[k] = texts[k];
    console.log(`  ⏳ Batch ${Math.floor(i / BATCH) + 1}/${Math.ceil(keys.length / BATCH)} (${Object.keys(batch).length} keys)...`);
    const resp = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${API_KEY}` },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          { role: 'system', content: 'You are a professional Korean translator for industrial/manufacturing content. Keep technical terms like CNC, CMM, EDM, AS9100, AS9102, EN 10204, ISO, PMI, MTR, CoC, FAIR, NDT, SPC, GD&T, ASTM, Grade 5, Grade 23, Grade 2, Ti-6Al-4V, Nadcap exactly as-is. DO NOT translate JSON keys. Return ONLY a valid JSON object.' },
          { role: 'user', content: `Translate to Korean. Return JSON with SAME keys but translated values:\n${JSON.stringify(batch, null, 2)}` }
        ],
        temperature: 0.3,
      }),
    });
    const data = await resp.json();
    const content = data.choices[0].message.content.trim();
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (jsonMatch) Object.assign(result, JSON.parse(jsonMatch[0]));
    else throw new Error(`No JSON in batch ${i}`);
    console.log(`  ✅ Batch done`);
  }
  return result;
}

async function main() {
  const enPath = path.join(TRANSLATIONS_DIR, 'en.json');
  const koPath = path.join(TRANSLATIONS_DIR, 'ko.json');

  const en = JSON.parse(fs.readFileSync(enPath, 'utf-8'));
  const ko = JSON.parse(fs.readFileSync(koPath, 'utf-8'));

  // Find missing keys: cap.qualitypage.* and specific page_quality.metrology.*
  const missing = {};
  for (const [k, v] of Object.entries(en)) {
    if (k.startsWith('cap.qualitypage.') && !ko[k]) {
      missing[k] = v;
    }
    if (k.startsWith('page_quality.metrology.') && !ko[k]) {
      // Skip metric1-4_label/desc which are not used in the 3 cards
      if (k.includes('cmm_desc') || k.includes('cmm_scan_type') || k.includes('xrf_desc') || k.includes('vision_desc') || k.includes('measurement_label')) {
        missing[k] = v;
      }
    }
  }

  if (Object.keys(missing).length === 0) {
    console.log(`✅ All keys already exist in ko.json`);
    return;
  }

  console.log(`🌐 Found ${Object.keys(missing).length} missing keys in ko.json`);
  console.log(`   Translating to ${LANG_NAME} via DeepSeek...\n`);

  const translated = await translateBatch(missing);

  let added = 0;
  for (const [k, v] of Object.entries(translated)) {
    if (!ko[k]) { ko[k] = v; added++; }
  }

  // Sort keys
  const sorted = {};
  for (const k of Object.keys(ko).sort()) sorted[k] = ko[k];
  fs.writeFileSync(koPath, JSON.stringify(sorted, null, 2) + '\n');

  console.log(`\n📝 Wrote ${added} new keys to ko.json`);
}

main().catch(e => { console.error(`\n❌ ${e.message}`); process.exit(1); });
