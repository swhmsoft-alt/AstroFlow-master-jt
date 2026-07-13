/**
 * translate-russian.mjs
 *
 * Translates ALL keys from en.json to Russian via DeepSeek API.
 * Batches keys in groups of ~80 to avoid token limits.
 * Output: src/i18n/translations/ru.json
 *
 * Usage: node scripts/translate-russian.mjs
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const TRANS_DIR = path.resolve(__dirname, '../src/i18n/translations');

const API_KEY = 'sk-b187f5cf84c74f9aac8bd04b7fd0d2f8';
const API_URL = 'https://api.deepseek.com/v1/chat/completions';

const BATCH_SIZE = 80; // keys per API call
const DELAY_MS = 1200;  // delay between batches

async function translateBatch(keys, values) {
  const src = {};
  for (let i = 0; i < keys.length; i++) {
    src[keys[i]] = values[i];
  }

  const sysPrompt = `You are a professional Russian translator for an industrial titanium CNC machining and manufacturing website. 
Translate ONLY the values from English to Russian. Keep keys unchanged, keep HTML tags unchanged, keep units (mm, µm, etc.) unchanged.
Return ONLY valid JSON object with the same keys. Preserve all special characters, line breaks, and formatting exactly as in the source.
Technical terms should be translated accurately for the CNC/machining industry context.`;

  const resp = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${API_KEY}` },
    body: JSON.stringify({
      model: 'deepseek-chat',
      messages: [
        { role: 'system', content: sysPrompt },
        { role: 'user', content: JSON.stringify(src, null, 2) },
      ],
      temperature: 0.1,
      max_tokens: 4096,
    }),
  });

  if (!resp.ok) throw new Error(`HTTP ${resp.status}: ${await resp.text()}`);

  const json = await resp.json();
  let txt = json.choices[0].message.content;
  const m = txt.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (m) txt = m[1];

  return JSON.parse(txt.trim());
}

async function main() {
  console.log('=== Russian Translation Generator ===\n');

  // Read English source
  const en = JSON.parse(fs.readFileSync(path.join(TRANS_DIR, 'en.json'), 'utf-8'));
  const allKeys = Object.keys(en);
  const totalKeys = allKeys.length;
  console.log(`Total keys to translate: ${totalKeys}\n`);

  // Load existing Russian translations if any (for resumability)
  let ru = {};
  if (fs.existsSync(path.join(TRANS_DIR, 'ru.json'))) {
    ru = JSON.parse(fs.readFileSync(path.join(TRANS_DIR, 'ru.json'), 'utf-8'));
    console.log(`Existing ru.json loaded with ${Object.keys(ru).length} keys`);
  }

  // Determine which keys still need translation
  const keysToTranslate = allKeys.filter(k => !(k in ru) || ru[k] === en[k]);
  console.log(`Keys remaining to translate: ${keysToTranslate.length}\n`);

  if (keysToTranslate.length === 0) {
    console.log('✅ All keys already translated!');
    return;
  }

  // Process in batches
  let translated = 0;
  let failed = 0;

  for (let i = 0; i < keysToTranslate.length; i += BATCH_SIZE) {
    const batchKeys = keysToTranslate.slice(i, i + BATCH_SIZE);
    const batchValues = batchKeys.map(k => en[k]);
    
    const batchNum = Math.floor(i / BATCH_SIZE) + 1;
    const totalBatches = Math.ceil(keysToTranslate.length / BATCH_SIZE);
    
    console.log(`[Batch ${batchNum}/${totalBatches}] Translating ${batchKeys.length} keys...`);

    try {
      const result = await translateBatch(batchKeys, batchValues);
      
      let count = 0;
      for (const [k, v] of Object.entries(result)) {
        if (v && typeof v === 'string' && v !== en[k]) {
          ru[k] = v;
          count++;
        }
      }
      
      translated += count;

      // Write progress after each batch (resumable)
      fs.writeFileSync(
        path.join(TRANS_DIR, 'ru.json'),
        JSON.stringify(ru, null, 2),
        'utf-8'
      );

      console.log(`  ✅ ${count}/${batchKeys.length} keys translated (total: ${translated}/${keysToTranslate.length})`);
    } catch (e) {
      failed++;
      console.error(`  ❌ Batch ${batchNum} failed: ${e.message.slice(0, 150)}`);
      console.log('     Will retry on next run (progress saved)');
    }

    // Delay between batches (skip after last)
    if (i + BATCH_SIZE < keysToTranslate.length) {
      await new Promise(r => setTimeout(r, DELAY_MS));
    }
  }

  // Save final result
  fs.writeFileSync(
    path.join(TRANS_DIR, 'ru.json'),
    JSON.stringify(ru, null, 2),
    'utf-8'
  );

  console.log('\n=== Summary ===');
  console.log(`Total keys in ru.json: ${Object.keys(ru).length}`);
  console.log(`Newly translated: ${translated}`);
  console.log(`Failed batches: ${failed}`);
  console.log(`Remaining untranslated: ${allKeys.filter(k => !(k in ru) || ru[k] === en[k]).length}`);
  
  if (failed > 0) {
    console.log('\n⚠️  Some batches failed. Re-run the script to resume.');
  } else {
    console.log('\n✅ All done! ru.json is ready.');
  }
}

main().catch(console.error);
