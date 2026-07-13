/**
 * translate-seo.mjs
 *
 * Translates the `ru` and `ar` placeholder values in src/config/seo.ts
 * from English to Russian and Arabic via DeepSeek API.
 *
 * Safest approach: reads the file line by line, only modifies lines
 * that start with "      ru:" or "      ar:", translates the value,
 * and writes it back. Does NOT restructure or reformat any code.
 *
 * Usage: node scripts/translate-seo.mjs
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SEO_FILE = path.resolve(__dirname, '../src/config/seo.ts');

const API_KEY = 'sk-b187f5cf84c74f9aac8bd04b7fd0d2f8';
const API_URL = 'https://api.deepseek.com/v1/chat/completions';
const DELAY_MS = 1000;

const TARGETS = [
  { lang: 'ru', name: 'Russian', prompt: 'Russian' },
  { lang: 'ar', name: 'Arabic', prompt: 'Arabic (Modern Standard Arabic - الفصحى)' },
];

async function translateBatch(texts, targetLang) {
  const src = {};
  texts.forEach((t, i) => { src[`text_${i}`] = t; });

  const sysPrompt = `You are a professional ${targetLang} translator for an industrial titanium CNC machining website.
Translate the following SEO titles and meta descriptions from English to ${targetLang}.
Keep brand name "BOZE CNC Ti" unchanged.
Return ONLY a valid JSON object — NO markdown, NO code fences, NO extra text.
Every string MUST be properly closed with double quotes.
IMPORTANT: Verify the JSON is valid before returning.`;

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
  console.log('=== SEO Translation (ru + ar) ===\n');

  for (const target of TARGETS) {
    console.log(`\n--- Processing ${target.name} (${target.lang}) ---\n`);

    // Read current file
    let content = fs.readFileSync(SEO_FILE, 'utf-8');
    const lines = content.split('\n');

    // Collect all lines that need translation
    const targetLines = [];
    const linePattern = new RegExp(`^(\\s{6}${target.lang}:\\s*)'((?:[^'\\\\]|\\\\.)*)'`, '');
    
    for (let i = 0; i < lines.length; i++) {
      const match = lines[i].match(linePattern);
      if (match) {
        // Check if it's still English (placeholder) or already translated
        const value = match[2].replace(/\\'/g, "'");
        // Heuristic: if the value contains mostly ASCII letters, it's still English
        const nonAscii = value.replace(/[ -~]/g, '').length;
        const isEnglish = nonAscii < value.length * 0.1; // Less than 10% non-ASCII chars
        
        if (isEnglish) {
          targetLines.push({ index: i, prefix: match[1], value, isEnglish });
        }
      }
    }

    console.log(`Found ${targetLines.length} lines to translate for ${target.lang}`);

    if (targetLines.length === 0) {
      console.log('  ✅ None to translate');
      continue;
    }

    // Process in batches of 10
    const BATCH_SIZE = 10;
    let translated = 0;

    for (let i = 0; i < targetLines.length; i += BATCH_SIZE) {
      const batch = targetLines.slice(i, i + BATCH_SIZE);
      const batchNum = Math.floor(i / BATCH_SIZE) + 1;
      const totalBatches = Math.ceil(targetLines.length / BATCH_SIZE);

      const texts = batch.map(t => t.value);
      console.log(`  [Batch ${batchNum}/${totalBatches}] Translating ${texts.length} texts...`);

      try {
        const result = await translateBatch(texts, target.prompt);
        let count = 0;

        for (let j = 0; j < batch.length; j++) {
          const entry = batch[j];
          const translatedText = result[`text_${j}`];
          
          if (translatedText && typeof translatedText === 'string' && translatedText.length > 0) {
            // Escape single quotes for JavaScript string
            const escaped = translatedText.replace(/\\/g, '\\\\').replace(/'/g, "\\'");
            lines[entry.index] = `${entry.prefix}'${escaped}',`;
            count++;
            translated++;
          }
        }

        // Write progress after each batch
        fs.writeFileSync(SEO_FILE, lines.join('\n'), 'utf-8');
        console.log(`    ✅ ${count}/${texts.length} updated (total: ${translated}/${targetLines.length})`);

      } catch (e) {
        console.error(`    ❌ Batch ${batchNum} failed: ${e.message.slice(0, 150)}`);
        console.log('       Will retry on next run');
      }

      if (i + BATCH_SIZE < targetLines.length) {
        await new Promise(r => setTimeout(r, DELAY_MS));
      }
    }

    console.log(`\n  ${target.lang}: ${translated}/${targetLines.length} translated`);
  }

  console.log('\n=== All done ===');
}

main().catch(console.error);
