/**
 * Translate equipment data from English to all 9 target languages.
 * 
 * Step 1: Extract all translation keys from equipment.ts and write to en.json
 * Step 2: For each target language, batch-translate via DeepSeek API
 *
 * Usage: node scripts/translate-equipment-i18n.mjs
 *        node scripts/translate-equipment-i18n.mjs --lang de  (single language only)
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const I18N_DIR = path.resolve(ROOT, 'src/i18n/translations');

const DEEPSEEK_API_KEY = 'sk-b187f5cf84c74f9aac8bd04b7fd0d2f8';
const DEEPSEEK_API_URL = 'https://api.deepseek.com/v1/chat/completions';

// The 9 target languages (excluding English)
const TARGET_LANGS = ['de', 'ja', 'fr', 'es', 'pt', 'it', 'ko', 'nl', 'pl'];

const LANGUAGE_NAMES = {
  de: 'German',
  ja: 'Japanese',
  fr: 'French',
  es: 'Spanish',
  pt: 'Portuguese',
  it: 'Italian',
  ko: 'Korean',
  nl: 'Dutch',
  pl: 'Polish',
};

const args = process.argv.slice(2);
const onlyLangs = [];
for (let i = 0; i < args.length; i++) {
  if (args[i] === '--lang' && args[i + 1]) onlyLangs.push(args[++i]);
}

const langsToTranslate = onlyLangs.length > 0 ? onlyLangs : TARGET_LANGS;

/**
 * Recursively collect all leaf string values from an object, building key path.
 * Returns a flat object like: { "equipment.5-axis-machining-center.name": "5-Axis Machining Center", ... }
 */
function collectKeys(obj, prefix = '') {
  const result = {};
  if (typeof obj === 'string') {
    result[prefix] = obj;
  } else if (typeof obj === 'number') {
    result[prefix] = String(obj);
  } else if (Array.isArray(obj)) {
    for (let i = 0; i < obj.length; i++) {
      Object.assign(result, collectKeys(obj[i], `${prefix}.${i}`));
    }
  } else if (obj && typeof obj === 'object') {
    for (const [key, val] of Object.entries(obj)) {
      if (key === 'key' || key === 'category') continue; // skip metadata
      Object.assign(result, collectKeys(val, prefix ? `${prefix}.${key}` : key));
    }
  }
  return result;
}

// ─── Step 1: Build the complete equipment data ─────────────────────────────

// Direct import from the TypeScript file using dynamic import
// Since we can't import .ts directly, we'll construct the data from the file content
import { createRequire } from 'module';
const require = createRequire(import.meta.url);

// Read the TypeScript file
const tsCode = fs.readFileSync(path.resolve(ROOT, 'src/data/equipment.ts'), 'utf-8');

// Extract the EQUIPMENT_DATA object by finding its boundaries
function extractEquipmentData(code) {
  const startMarker = 'export const EQUIPMENT_DATA: EquipmentMap = {';
  const startIdx = code.indexOf(startMarker);
  if (startIdx < 0) {
    console.error('Could not find EQUIPMENT_DATA in equipment.ts');
    process.exit(1);
  }
  
  // Find the matching closing brace
  let depth = 0;
  let inStr = false;
  let escape = false;
  let objStart = -1;
  let objEnd = -1;
  
  for (let i = startIdx; i < code.length; i++) {
    const ch = code[i];
    
    if (escape) { escape = false; continue; }
    if (ch === '\\' && inStr) { escape = true; continue; }
    if (ch === '"' || ch === "'" || ch === '`') { 
      if (!inStr) { inStr = ch; } else if (ch === inStr) { inStr = false; }
      continue; 
    }
    if (inStr) continue;
    
    if (ch === '{') {
      depth++;
      if (depth === 1) objStart = i;
    }
    if (ch === '}') {
      depth--;
      if (depth === 0 && objStart >= 0) {
        objEnd = i + 1;
        break;
      }
    }
  }
  
  if (objEnd < 0) {
    console.error('Could not find end of EQUIPMENT_DATA object');
    process.exit(1);
  }
  
  return code.slice(objStart, objEnd);
}

// Try to parse the extracted object as JSON by stripping TypeScript
function typescriptToJson(ts) {
  // Remove comments
  let cleaned = ts.replace(/\/\/.*$/gm, '');
  // Remove trailing commas before } and ]
  cleaned = cleaned.replace(/,\s*([}\]])/g, '$1');
  // Replace single-quoted strings with double-quoted
  cleaned = cleaned.replace(/'/g, '"');
  // The result should be roughly valid JSON now
  return cleaned;
}

const rawObj = extractEquipmentData(tsCode);
let equipmentData;

try {
  const jsonStr = typescriptToJson(rawObj);
  equipmentData = JSON.parse(jsonStr);
  console.log('✓ Successfully parsed EQUIPMENT_DATA from TypeScript');
} catch (e) {
  console.error('Failed to parse equipment data:', e.message);
  console.log('Trying alternative parsing method...');
  
  // Alternative: evaluate with esbuild register or just extract known keys
  // For now, read from the pre-existing JSON file
  equipmentData = JSON.parse(fs.readFileSync(path.resolve(ROOT, 'scripts/equipment-data.json'), 'utf-8'));
  console.log('✓ Loaded from equipment-data.json');
}

// Collect all keys
const allKeys = collectKeys(equipmentData, 'equipment');
const keyCount = Object.keys(allKeys).length;
console.log(`✓ Collected ${keyCount} translation keys from equipment data`);

// ─── Step 2: Write to en.json (English original) ──────────────────────────

function mergeIntoJson(filePath, newKeys) {
  const content = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  let added = 0;
  for (const [k, v] of Object.entries(newKeys)) {
    if (!(k in content)) {
      content[k] = v;
      added++;
    }
  }
  fs.writeFileSync(filePath, JSON.stringify(content, null, 2) + '\n');
  return added;
}

const enAdded = mergeIntoJson(path.join(I18N_DIR, 'en.json'), allKeys);
console.log(`✓ Added ${enAdded} new keys to en.json`);

// ─── Step 3: Translate to target languages via DeepSeek API ────────────────

async function translateBatch(texts, targetLang) {
  const langName = LANGUAGE_NAMES[targetLang];
  
  const systemPrompt = `You are a professional translator specializing in industrial manufacturing, CNC machining, and metallurgy terminology. Translate the following English JSON key-value pairs to ${langName}. Keep all keys exactly as they are - only translate the values. Return ONLY valid JSON with the same keys. Maintain technical accuracy for manufacturing terms, standards (ISO, ASTM, AMS), equipment names, and industry terminology.`;
  
  // Build the translation payload - send all keys as a single JSON object
  const payload = JSON.stringify(texts, null, 2);
  
  const userPrompt = `Translate ALL of the following equipment manufacturing content from English to ${langName}. Preserve all keys, translate only values. Return valid JSON with same structure:\n\n${payload}`;
  
  try {
    const response = await fetch(DEEPSEEK_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${DEEPSEEK_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        temperature: 0.3,
        max_tokens: 32000,
      }),
    });
    
    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`API error ${response.status}: ${errText}`);
    }
    
    const data = await response.json();
    const resultText = data.choices[0].message.content;
    
    // Extract JSON from the response (handle markdown code blocks)
    const jsonMatch = resultText.match(/```(?:json)?\s*([\s\S]*?)```/);
    const cleanJson = jsonMatch ? jsonMatch[1].trim() : resultText.trim();
    
    return JSON.parse(cleanJson);
  } catch (err) {
    console.error(`  ✗ API call failed for ${langName}: ${err.message}`);
    // Return original (untouched) as fallback
    return texts;
  }
}

async function main() {
  console.log('\nStarting translation to target languages...\n');
  
  // Process each language
  for (const lang of langsToTranslate) {
    const langName = LANGUAGE_NAMES[lang];
    console.log(`Translating to ${langName} (${lang})...`);
    
    const langFile = path.join(I18N_DIR, `${lang}.json`);
    const langContent = JSON.parse(fs.readFileSync(langFile, 'utf-8'));
    
    // Find which keys need translation (not yet present in target language)
    const untranslatedKeys = {};
    for (const [k, v] of Object.entries(allKeys)) {
      if (!(k in langContent)) {
        untranslatedKeys[k] = v;
      }
    }
    
    const untranslatedCount = Object.keys(untranslatedKeys).length;
    if (untranslatedCount === 0) {
      console.log(`  All keys already present in ${lang}.json, skipping.`);
      continue;
    }
    
    console.log(`  ${untranslatedCount} keys need translation...`);
    
    // Translate in batches if needed (DeepSeek max tokens is 32K)
    // A single batch of ~1500 keys is well within range (roughly 20-30K tokens)
    const translated = await translateBatch(untranslatedKeys, lang);
    
    // Merge translations into language file
    let added = 0;
    for (const [k, v] of Object.entries(translated)) {
      if (!(k in langContent)) {
        langContent[k] = v;
        added++;
      }
    }
    
    fs.writeFileSync(langFile, JSON.stringify(langContent, null, 2) + '\n');
    console.log(`  ✓ Added ${added} translated keys to ${lang}.json`);
    
    // Small delay between API calls to avoid rate limiting
    if (lang !== langsToTranslate[langsToTranslate.length - 1]) {
      await new Promise(r => setTimeout(r, 1000));
    }
  }
  
  console.log('\n✓ Translation complete!');
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});