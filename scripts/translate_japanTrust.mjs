/**
 * translate_japanTrust.mjs
 *
 * Translate all 29 home.japanTrust.* keys from English into the 10
 * non-English languages that are missing them (de, fr, es, pt, it,
 * ko, nl, pl, ru, ar).
 *
 * Uses DeepSeek API (same pattern as small-translate.mjs).
 * Japanese (ja) already has translations and is skipped.
 */

import fs from 'fs';
import path from 'path';

const DIR = 'c:/Users/Administrator/Desktop/AstroFlow-master-jt/src/i18n/translations';
const KEY = 'sk-b187f5cf84c74f9aac8bd04b7fd0d2f8';
const en = JSON.parse(fs.readFileSync(path.join(DIR, 'en.json'), 'utf8'));

// 29 home.japanTrust.* keys
const JAPAN_TRUST_KEYS = Object.keys(en)
  .filter(k => k.startsWith('home.japanTrust.'))
  .sort();

// Build source batch once
const SOURCE = {};
JAPAN_TRUST_KEYS.forEach(k => { SOURCE[k] = en[k]; });

const LANGS = {
  de: 'German', fr: 'French', es: 'Spanish', pt: 'Portuguese',
  it: 'Italian', ko: 'Korean', nl: 'Dutch', pl: 'Polish',
  ru: 'Russian', ar: 'Arabic'
};

// Values that must be kept exactly as in English source (technical/numeric)
const PRESERVE_EXACT = new Set([
  'home.japanTrust.cpkVal',
  'home.japanTrust.machinableSizeVal',
  'home.japanTrust.materialsVal',
  'home.japanTrust.monthlyCapacityVal',
  'home.japanTrust.leadTimeVal',
  'home.japanTrust.minLotVal',
  'home.japanTrust.sampleVal',
  'home.japanTrust.dfmVal',
  'home.japanTrust.faiVal',
  'home.japanTrust.ndaVal',
  'home.japanTrust.ppapVal'
]);

async function translateAll(code, name) {
  const systemMsg = 'Translate JSON values from English to ' + name +
    '. Keep ALL numbers, units, acronyms (like Cpk/FAI/PPAP/NDA/DFM/AS9102), ' +
    'material grades, and exact technical values UNCHANGED. ' +
    'Return ONLY valid JSON, no markdown.';

  const resp = await fetch('https://api.deepseek.com/v1/chat/completions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + KEY },
    body: JSON.stringify({
      model: 'deepseek-chat',
      messages: [
        { role: 'system', content: systemMsg },
        { role: 'user', content: JSON.stringify(SOURCE, null, 2) }
      ],
      temperature: 0.1
    })
  });
  if (!resp.ok) {
    const t = await resp.text();
    throw new Error('HTTP ' + resp.status + ': ' + t.slice(0, 200));
  }
  const d = await resp.json();
  let raw = d.choices?.[0]?.message?.content || '';
  raw = raw.replace(/```json\s*/gi, '').replace(/```/g, '').trim();
  const parsed = JSON.parse(raw);

  // Restore exact values for technical fields
  for (const pk of PRESERVE_EXACT) {
    if (SOURCE[pk]) parsed[pk] = SOURCE[pk];
  }
  return parsed;
}

// Accept optional language filter from CLI: node translate_japanTrust.mjs de
// or: node translate_japanTrust.mjs de,fr,es
const cliFilter = process.argv[2];
const filtered = cliFilter
  ? Object.fromEntries(Object.entries(LANGS).filter(([c]) => cliFilter.split(',').includes(c)))
  : LANGS;

async function main() {
  for (const [code, name] of Object.entries(filtered)) {
    const fp = path.join(DIR, code + '.json');
    const target = JSON.parse(fs.readFileSync(fp, 'utf8'));

    // Check which keys are already translated
    const missing = JAPAN_TRUST_KEYS.filter(k =>
      target[k] === undefined || target[k] === en[k]
    );
    if (missing.length === 0) {
      console.log(code + ': all 29 keys already present, skipping');
      continue;
    }

    console.log(code + ' (' + name + '): ' + missing.length + ' keys to translate...');
    try {
      const result = await translateAll(code, name);
      let n = 0;
      for (const k of JAPAN_TRUST_KEYS) {
        if (result[k] && result[k] !== en[k]) {
          target[k] = result[k];
          n++;
        } else if (result[k] === en[k] || !result[k]) {
          // Use source if translation is identical to EN or missing
          target[k] = en[k];
        }
      }
      // Sort keys
      const sorted = {};
      Object.keys(target).sort().forEach(k => { sorted[k] = target[k]; });
      fs.writeFileSync(fp, JSON.stringify(sorted, null, 2) + '\n', 'utf8');
      console.log('  -> ' + n + ' keys saved');
    } catch (e) {
      console.error('  ERROR: ' + e.message);
    }
  }
  console.log('Done!');
}

main();
