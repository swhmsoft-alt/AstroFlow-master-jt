import { GRADE_DATA } from './src/data/titanium-grades.ts';
import { readFileSync, writeFileSync } from 'fs';

const enPath = 'src/i18n/translations/en.json';
const en = JSON.parse(readFileSync(enPath, 'utf-8'));

let count = 0;
for (const [gk, g] of Object.entries(GRADE_DATA)) {
  const p = 'materials.' + gk;
  
  // Page meta
  const metaKeys = {
    [p + '.pageTitle']: g.pageTitle,
    [p + '.metaDescription']: g.metaDescription,
  };
  
  // CTA text
  const shortName = g.name.split('–')[0] || g.name;
  const ctaKeys = {
    [p + '.cta.title']: `Need ${shortName.trim()} Components?`,
    [p + '.cta.description']: `Our engineering team delivers precision-machined components in ${shortName.trim()}. Submit your RFQ for a competitive quote within 24–48 hours.`,
    [p + '.cta.btnQuote']: 'Request a Quote',
    [p + '.cta.btnGuide']: 'All Materials Guide',
  };
  
  for (const [k, v] of Object.entries({...metaKeys, ...ctaKeys})) {
    if (!en[k]) { en[k] = v; count++; }
  }
}
writeFileSync(enPath, JSON.stringify(en, null, 2) + '\n', 'utf-8');
console.log('Added ' + count + ' meta+cta keys to en.json');