/**
 * Update all 13 grade page files to pass gradeKey prop
 */
import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const pagesDir = join(__dirname, '..', 'src', 'pages', 'materials');

const grades = [
  'grade-1', 'grade-2', 'grade-3', 'grade-4', 'grade-4-eli',
  'grade-5', 'grade-23', 'grade-6', 'grade-9',
  'grade-19', 'grade-21', 'grade-6242', 'ti-5553',
];

for (const key of grades) {
  const filePath = join(pagesDir, `${key}.astro`);
  let content = readFileSync(filePath, 'utf-8');
  
  // Replace the GradePageLayout line to include gradeKey
  content = content.replace(
    '<GradePageLayout grade={grade} lang={lang} />',
    '<GradePageLayout grade={grade} lang={lang} gradeKey={grade.key} />'
  );
  
  writeFileSync(filePath, content, 'utf-8');
  console.log(`✓ Updated ${key}.astro`);
}

console.log('Done!');