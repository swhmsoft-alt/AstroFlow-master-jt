/**
 * Extract English keys from src/i18n/ui.ts → temp/en-keys.json
 * Usage: node temp/extract-keys.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const uiPath = path.resolve(__dirname, '../src/i18n/ui.ts');

const content = fs.readFileSync(uiPath, 'utf-8');

// Match lines like: 'key': 'value',
const regex = /^\s+'([\w.-]+)':\s*'((?:[^'\\]|\\.)*)'/gm;
const entries = {};
let match;
while ((match = regex.exec(content)) !== null) {
  entries[match[1]] = match[2];
}

const outPath = path.resolve(__dirname, 'en-keys.json');
fs.mkdirSync(path.dirname(outPath), { recursive: true });
fs.writeFileSync(outPath, JSON.stringify(entries, null, 2), 'utf-8');

console.log(`✅ Extracted ${Object.keys(entries).length} keys → temp/en-keys.json`);