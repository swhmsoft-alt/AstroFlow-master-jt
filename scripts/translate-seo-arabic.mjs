/**
 * translate-seo-arabic.mjs
 *
 * Reads src/config/seo.ts, extracts all English title/description entries,
 * translates them to Arabic via DeepSeek API, and inserts the `ar` field
 * into each title/description object.
 *
 * Usage: node scripts/translate-seo-arabic.mjs
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SEO_FILE = path.resolve(__dirname, '../src/config/seo.ts');

const API_KEY = 'sk-b187f5cf84c74f9aac8bd04b7fd0d2f8';
const API_URL = 'https://api.deepseek.com/v1/chat/completions';
const DELAY_MS = 800;

const LANG_CODE = 'ar';
const LANG_NAME = 'Arabic';

/**
 * Parse the seo.ts file to extract all path entries and their English text.
 */
function extractEnglishTexts(content) {
  const entries = [];
  
  const pathRegex2 = /^\s+'([^']+)':\s*\{/gm;
  const paths = [];
  let pm;
  while ((pm = pathRegex2.exec(content)) !== null) {
    paths.push({ index: pm.index, path: pm[1] });
  }
  
  const blockRegex = /(title|description):\s*\{([^}]+)\}/g;
  let match;
  
  while ((match = blockRegex.exec(content)) !== null) {
    const type = match[1];
    const block = match[2];
    
    const enMatch = block.match(/\ben\s*:\s*'((?:[^'\\]|\\.)*)'/);
    if (enMatch) {
      const pos = match.index;
      let currentPath = 'unknown';
      for (const p of paths) {
        if (p.index < pos) currentPath = p.path;
        else break;
      }
      
      entries.push({
        path: currentPath,
        type,
        enText: enMatch[1].replace(/\\'/g, "'"),
        blockStart: match.index,
        blockEnd: match.index + match[0].length,
      });
    }
  }
  
  return entries;
}

function hasLangField(content, entry) {
  const blockContent = content.substring(entry.blockStart, entry.blockEnd);
  return blockContent.includes(`${LANG_CODE}:`);
}

async function translateBatch(texts) {
  const src = {};
  texts.forEach((t, i) => {
    src[`entry_${i}`] = t;
  });

  const sysPrompt = `You are a professional Arabic translator for an industrial website about titanium CNC machining and manufacturing. 
Translate the following website SEO titles and meta descriptions from English to Arabic.
Keep them concise, accurate, and natural-sounding in Modern Standard Arabic. Preserve brand name "BOZE CNC Ti" unchanged.
Return ONLY valid JSON with the same keys and translated values.`;

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

function insertLangField(content, entry, translatedText) {
  const beforeBlock = content.substring(0, entry.blockEnd);
  const afterBlock = content.substring(entry.blockEnd);
  
  const blockContent = content.substring(entry.blockStart, entry.blockEnd);
  const langLines = blockContent.match(/\s+\w+\s*:\s*'(?:[^'\\]|\\.)*'/g);
  
  if (!langLines || langLines.length === 0) {
    console.warn(`  ⚠️  Could not find language lines in block for ${entry.path}/${entry.type}`);
    return { content, newBlockEnd: entry.blockEnd };
  }
  
  const lastLine = langLines[langLines.length - 1];
  const escapedRuText = translatedText.replace(/\\/g, '\\\\').replace(/'/g, "\\'");
  
  const newLine = `\n      ${LANG_CODE}: '${escapedRuText}',`;
  const updatedBlock = blockContent.replace(lastLine, lastLine + newLine);
  
  const newBlockEnd = entry.blockEnd + newLine.length;
  
  return {
    content: beforeBlock + updatedBlock + afterBlock,
    newBlockEnd,
  };
}

async function main() {
  console.log(`=== SEO ${LANG_NAME} Translation Generator ===\n`);

  let content = fs.readFileSync(SEO_FILE, 'utf-8');
  
  const entries = extractEnglishTexts(content);
  console.log(`Found ${entries.length} English title/description entries\n`);
  
  const toTranslate = entries.filter(e => !hasLangField(content, e));
  console.log(`Entries needing ${LANG_NAME} translation: ${toTranslate.length}\n`);
  
  if (toTranslate.length === 0) {
    console.log(`✅ All SEO entries already have ${LANG_NAME} translations!`);
    return;
  }

  const grouped = {};
  for (const e of toTranslate) {
    if (!grouped[e.path]) grouped[e.path] = {};
    grouped[e.path][e.type] = e;
  }
  
  console.log('Paths needing translation:');
  for (const [p, types] of Object.entries(grouped)) {
    console.log(`  ${p}: ${Object.keys(types).join(', ')}`);
  }
  console.log('');

  const BATCH_SIZE = 10;
  let translated = 0;
  let failed = 0;
  
  const sortedEntries = [...toTranslate].sort((a, b) => b.blockStart - a.blockStart);
  
  for (let i = 0; i < sortedEntries.length; i += BATCH_SIZE) {
    const batch = sortedEntries.slice(i, i + BATCH_SIZE);
    const batchNum = Math.floor(i / BATCH_SIZE) + 1;
    const totalBatches = Math.ceil(sortedEntries.length / BATCH_SIZE);
    
    console.log(`[Batch ${batchNum}/${totalBatches}] Translating ${batch.length} entries...`);
    
    const texts = batch.map(e => e.enText);
    
    try {
      const result = await translateBatch(texts);
      
      let count = 0;
      for (let j = 0; j < batch.length; j++) {
        const entry = batch[j];
        const trText = result[`entry_${j}`];
        
        if (trText && typeof trText === 'string' && trText.length > 0) {
          const result2 = insertLangField(content, entry, trText);
          content = result2.content;
          count++;
          translated++;
        }
      }
      
      console.log(`  ✅ ${count}/${batch.length} inserted`);
    } catch (e) {
      failed++;
      console.error(`  ❌ Batch ${batchNum} failed: ${e.message.slice(0, 150)}`);
    }
    
    if (i + BATCH_SIZE < sortedEntries.length) {
      await new Promise(r => setTimeout(r, DELAY_MS));
    }
  }
  
  fs.writeFileSync(SEO_FILE, content, 'utf-8');
  
  console.log('\n=== Summary ===');
  console.log(`Translations inserted: ${translated}`);
  console.log(`Failed batches: ${failed}`);
  console.log(`\n✅ SEO file updated with ${LANG_NAME} translations!`);
}

main().catch(console.error);
