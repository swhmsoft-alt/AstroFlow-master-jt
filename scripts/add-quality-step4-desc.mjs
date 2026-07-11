/**
 * Translate page_quality.workflow.step4_desc to all 9 target languages.
 * This key was newly added to en.json and needs translations.
 *
 * Usage: node scripts/add-quality-step4-desc.mjs
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const TRANSLATIONS_DIR = path.resolve(__dirname, '../src/i18n/translations');

const API_KEY = 'sk-b187f5cf84c74f9aac8bd04b7fd0d2f8';
const API_URL = 'https://api.deepseek.com/v1/chat/completions';

const KEY = 'page_quality.workflow.step4_desc';
const EN_TEXT = 'Finished lots undergo random or 100% dimensional gating using programmatic CMM cycles. Components are packed with comprehensive quality dossiers containing Mill Test Reports (MTRs), CMM dimensional data, surface roughness certificates, and Certificates of Conformance (CoC). All quality records are archived and retrievable for the life of the product.';

const LANG_NAMES = {
  de: 'German', ja: 'Japanese', fr: 'French', es: 'Spanish',
  pt: 'Portuguese', it: 'Italian', ko: 'Korean', nl: 'Dutch', pl: 'Polish',
};

async function translateTo(langCode, targetLang) {
  console.log(`  ⏳ Translating to ${targetLang} (${langCode})...`);
  const resp = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${API_KEY}` },
    body: JSON.stringify({
      model: 'deepseek-chat',
      messages: [
        { role: 'system', content: `You are a professional ${targetLang} translator for industrial/manufacturing content. Keep technical terms like CMM, MTR, CoC, ERP exactly as-is. Return ONLY the translated text, no JSON wrapper.` },
        { role: 'user', content: `Translate the following to ${targetLang}:\n\n${EN_TEXT}` }
      ],
      temperature: 0.3,
    }),
  });
  const data = await resp.json();
  const translated = data.choices[0].message.content.trim();
  // Remove any surrounding quotes if AI adds them
  return translated.replace(/^["']|["']$/g, '').trim();
}

async function main() {
  const langs = Object.entries(LANG_NAMES);
  let totalAdded = 0;

  for (const [langCode, langName] of langs) {
    const filePath = path.join(TRANSLATIONS_DIR, `${langCode}.json`);
    const json = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

    if (json[KEY]) {
      console.log(`  ⏭️  ${langCode}.json already has ${KEY}`);
      continue;
    }

    try {
      const translated = await translateTo(langCode, langName);
      json[KEY] = translated;

      // Sort keys alphabetically
      const sorted = {};
      for (const k of Object.keys(json).sort()) sorted[k] = json[k];
      fs.writeFileSync(filePath, JSON.stringify(sorted, null, 2) + '\n');
      console.log(`  ✅ ${langCode}.json - added`);
      totalAdded++;
    } catch (e) {
      console.error(`  ❌ ${langCode}.json - FAILED: ${e.message}`);
    }
  }

  console.log(`\n📝 Done! Added ${totalAdded}/${langs.length} translations.`);
}

main().catch(e => { console.error(`\n❌ ${e.message}`); process.exit(1); });
