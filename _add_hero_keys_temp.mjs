import { GRADE_DATA } from './src/data/titanium-grades.ts';
import { readFileSync, writeFileSync } from 'fs';

const enPath = 'src/i18n/translations/en.json';
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
writeFileSync(enPath, JSON.stringify(en, null, 2) + '\n', 'utf-8');
console.log('Added ' + count + ' hero keys to en.json');