/**
 * Generate all 13 titanium grade page files under src/pages/materials/
 */
import { writeFileSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const pagesDir = join(__dirname, '..', 'src', 'pages', 'materials');

const grades = [
  'grade-1', 'grade-2', 'grade-3', 'grade-4', 'grade-4-eli',
  'grade-5', 'grade-23', 'grade-6', 'grade-9',
  'grade-19', 'grade-21', 'grade-6242', 'ti-5553',
];

const template = (key) => `---
import BaseLayout from '../../layouts/BaseLayout.astro';
import GradePageLayout from '../../components/materials/GradePageLayout.astro';
import { getLangFromUrl } from '../../i18n/utils';
import { GRADE_DATA } from '../../data/titanium-grades';

const lang = getLangFromUrl(Astro.url);
const grade = GRADE_DATA['${key}'];
const canonicalURL = new URL(Astro.url.pathname, Astro.site || 'https://cnc.bozemetal.com').href;
---

<BaseLayout title={grade.pageTitle} description={grade.metaDescription} canonicalURL={canonicalURL}>
  <GradePageLayout grade={grade} lang={lang} />
</BaseLayout>
`;

mkdirSync(pagesDir, { recursive: true });

for (const key of grades) {
  const filePath = join(pagesDir, `${key}.astro`);
  writeFileSync(filePath, template(key), 'utf-8');
  console.log(`✓ Created ${key}.astro`);
}

console.log('\nDone! All 13 grade page files created.');