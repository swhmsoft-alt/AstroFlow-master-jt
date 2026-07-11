/**
 * Fix badge43 value from "Q&amp;A" to "Q&A" in all translation files.
 * The HTML entity &amp; is unnecessary; Astro auto-escapes & in templates.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DIR = path.resolve(__dirname, '../src/i18n/translations');
const LANGS = ['en','de','ja','fr','es','pt','it','ko','nl','pl'];
const KEY = '"cap.inspectionpage.badge43"';

for (const lang of LANGS) {
  const fp = path.join(DIR, `${lang}.json`);
  let content = fs.readFileSync(fp, 'utf-8');
  // Find the line with badge43 and fix the value
  content = content.replace(
    new RegExp(`"${KEY.replace(/"/g, '')}": "Q&amp;A"`, 'g'),
    `${KEY}: "Q&A"`
  );
  fs.writeFileSync(fp, content);
  console.log(`✅ ${lang}.json`);
}
console.log('Done!');
