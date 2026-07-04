/**
 * Add hero translation keys (name, highlight, badge, subtitle) to en.json
 * These are used in GradePageLayout's SubpageHero component.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const enPath = path.resolve(__dirname, '../src/i18n/translations/en.json');
const dataPath = path.resolve(__dirname, '../src/data/titanium-grades.ts');

// Read the TS and find all grade keys with hero values
// We'll use tsx to dynamically import
const { execSync } = require('child_process');

const cmd = `npx tsx -e "
import { GRADE_DATA } from './src/data/titanium-grades.ts';
import { readFileSync, writeFileSync } from 'fs';

const enPath = '${enPath.replace(/\\/g, '\\\\')}';
const en = JSON.parse(readFileSync(enPath, 'utf-8'));

let count = 0;
for (const [gk, g] of Object.entries(GRADE_DATA)) {
  const p = 'materials.' + gk + '.hero';
  const keys = {
    [p + '.name']: g.name,
    [p + '.highlight']: g.highlight,
    [p + '.badge']: g.badge,
    [p + '.subtitle']: g.subtitle,
  };
  for (const [k, v] of Object.entries(keys)) {
    if (!en[k]) { en[k] = v; count++; }
  }
}
writeFileSync(enPath, JSON.stringify(en, null, 2) + String.fromCharCode(10), 'utf-8');
console.log('Added ' + count + ' hero keys to en.json');
"` 

console.log('Running tsx to extract hero keys...');
const result = execSync(cmd, { cwd: path.resolve(__dirname, '..'), encoding: 'utf-8', timeout: 60000 });
console.log(result);