/**
 * translate-seo-russian.mjs
 *
 * Reads src/config/seo.ts, extracts all English title/description entries,
 * translates them to Russian via DeepSeek API, and inserts the `ru` field
 * into each title/description object.
 *
 * Usage: node scripts/translate-seo-russian.mjs
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SEO_FILE = path.resolve(__dirname, '../src/config/seo.ts');

const API_KEY = 'sk-b187f5cf84c74f9aac8bd04b7fd0d2f8';
const API_URL = 'https://api.deepseek.com/v1/chat/completions';
const DELAY_MS = 800;

/**
 * Parse the seo.ts file to extract all path entries and their English text.
 * Returns an array of { path, type (title|description), enText } objects.
 */
function extractEnglishTexts(content) {
  const entries = [];
  
  // Match path blocks like: '/some-path': { title: { ... }, description: { ... } }
  const pathRegex = /\s+'([^']+)':\s*\{([^}]*?\btitle\s*:\s*\{[\s\S]*?\})\s*([^}]*?\bdescription\s*:\s*\{[\s\S]*?\})\s*\}/g;
  
  // Simpler approach: find all title: { en: '...' } and description: { en: '...' } blocks
  // Match a block like: title: {\n      en: '...',\n      de: '...',\n      ...
  const blockRegex = /(title|description):\s*\{([^}]+)\}/g;
  let match;
  
  // Track current path
  const pathRegex2 = /^\s+'([^']+)':\s*\{/gm;
  const paths = [];
  let pm;
  while ((pm = pathRegex2.exec(content)) !== null) {
    paths.push({ index: pm.index, path: pm[1] });
  }
  
  // Reset block regex
  blockRegex.lastIndex = 0;
  
  while ((match = blockRegex.exec(content)) !== null) {
    const type = match[1]; // 'title' or 'description'
    const block = match[2];
    
    // Extract the English text
    const enMatch = block.match(/\ben\s*:\s*'((?:[^'\\]|\\.)*)'/);
    if (enMatch) {
      // Find which path this belongs to (find nearest preceding path)
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

/**
 * Check if a block already has a 'ru' field.
 */
function hasRussianField(content, entry) {
  const blockContent = content.substring(entry.blockStart, entry.blockEnd);
  return blockContent.includes('ru:');
}

/**
 * Generate Russian translation for a batch of English texts.
 */
async function translateBatch(texts) {
  const src = {};
  texts.forEach((t, i) => {
    src[`entry_${i}`] = t;
  });

  const sysPrompt = `You are a professional Russian translator for an industrial website about titanium CNC machining and manufacturing. 
Translate the following website SEO titles and meta descriptions from English to Russian.
Keep them concise, accurate, and natural-sounding in Russian. Preserve brand name "BOZE CNC Ti" unchanged.
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

/**
 * Insert the ru field into a title or description block.
 * Finds the last language entry (e.g., `pl: '...'`) and inserts `ru: '...'` after it.
 */
function insertRussianField(content, entry, ruText) {
  const beforeBlock = content.substring(0, entry.blockEnd);
  const afterBlock = content.substring(entry.blockEnd);
  
  // Find the last `xx: '...'` in the block
  const blockContent = content.substring(entry.blockStart, entry.blockEnd);
  const langLines = blockContent.match(/\s+\w+\s*:\s*'(?:[^'\\]|\\.)*'/g);
  
  if (!langLines || langLines.length === 0) {
    console.warn(`  ⚠️  Could not find language lines in block for ${entry.path}/${entry.type}`);
    return content;
  }
  
  const lastLine = langLines[langLines.length - 1];
  const lastLineEscaped = lastLine.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  
  // Escape single quotes in the Russian text
  const escapedRuText = ruText.replace(/\\/g, '\\\\').replace(/'/g, "\\'");
  
  // Insert ru after the last language line
  const newLine = `\n      ru: '${escapedRuText}',`;
  const updatedBlock = blockContent.replace(
    new RegExp(lastLineEscaped),
    lastLine + newLine
  );
  
  // Update the block end position
  const newBlockEnd = entry.blockEnd + newLine.length;
  
  return {
    content: beforeBlock + updatedBlock + afterBlock,
    newBlockEnd,
  };
}

async function main() {
  console.log('=== SEO Russian Translation Generator ===\n');

  // Read the SEO file
  let content = fs.readFileSync(SEO_FILE, 'utf-8');
  
  // Extract all English texts that need translation
  const entries = extractEnglishTexts(content);
  console.log(`Found ${entries.length} English title/description entries\n`);
  
  // Filter to only those without 'ru' field
  const toTranslate = entries.filter(e => !hasRussianField(content, e));
  console.log(`Entries needing Russian translation: ${toTranslate.length}\n`);
  
  if (toTranslate.length === 0) {
    console.log('✅ All SEO entries already have Russian translations!');
    return;
  }

  // Group by path for cleaner output
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

  // Process in batches (max 10 texts per batch)
  const BATCH_SIZE = 10;
  let translated = 0;
  let failed = 0;
  
  // Process in reverse order so block positions don't shift
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
        const ruText = result[`entry_${j}`];
        
        if (ruText && typeof ruText === 'string' && ruText.length > 0) {
          const result2 = insertRussianField(content, entry, ruText);
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
  
  // Write final result
  fs.writeFileSync(SEO_FILE, content, 'utf-8');
  
  console.log('\n=== Summary ===');
  console.log(`Translations inserted: ${translated}`);
  console.log(`Failed batches: ${failed}`);
  console.log('\n✅ SEO file updated!');
}

main().catch(console.error);
