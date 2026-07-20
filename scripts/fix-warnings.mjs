import { readFileSync, writeFileSync, readdirSync, mkdirSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');

// ============================================================
// WARNING 1: Duplicate '/products' key in hero.ts
// ============================================================
console.log('--- Warning 1: Duplicate key ---');
const heroPath = join(root, 'src', 'config', 'hero.ts');
let hero = readFileSync(heroPath, 'utf-8');

const matches = hero.match(/'\/products':/g);
console.log('Found', matches ? matches.length : 0, 'occurrences of /products key');

if (matches && matches.length > 1) {
  const idx1 = hero.indexOf("'/products'");
  const idx2 = hero.indexOf("'/products'", idx1 + 1);
  
  console.log('First /products at byte', idx1);
  console.log('Second /products at byte', idx2);
  
  // Find the closing brace of the FIRST object
  const brace1 = hero.indexOf('{', idx1);
  let depth = 1;
  let close1 = brace1 + 1;
  while (depth > 0 && close1 < hero.length) {
    if (hero[close1] === '{') depth++;
    else if (hero[close1] === '}') depth--;
    close1++;
  }
  
  // Remove the FIRST occurrence (the older, less complete one)
  const beforeFirst = hero.lastIndexOf(',', idx1);
  // The first occurrence ends at close1
  // After it there's a comma, then the second occurrence
  // We remove from beforeFirst to after the first object's closing
  hero = hero.substring(0, beforeFirst) + hero.substring(close1);
  
  writeFileSync(heroPath, hero, 'utf-8');
  console.log('Fixed duplicate /products key.');
} else {
  console.log('No duplicate found, or already fixed.');
}

// ============================================================
// WARNING 2: Unused React imports
// ============================================================
console.log('\n--- Warning 2: Unused imports ---');
const reactDir = join(root, 'src', 'components', 'react');
const tsxFiles = readdirSync(reactDir).filter(f => f.endsWith('.tsx'));

for (const file of tsxFiles) {
  const fp = join(reactDir, file);
  let content = readFileSync(fp, 'utf-8');
  
  const hasAlertTriangle = content.includes('AlertTriangle');
  const hasCheck = content.includes('Check');
  
  if (hasAlertTriangle || hasCheck) {
    const alertUsed = new RegExp('<AlertTriangle').test(content);
    const checkUsed = new RegExp('<Check').test(content);
    
    let changed = false;
    
    if (!alertUsed && hasAlertTriangle) {
      // Remove AlertTriangle from import
      content = content.replace(/,\s*AlertTriangle/g, '').replace(/AlertTriangle,\s*/g, '');
      changed = true;
      console.log('  Removed AlertTriangle from', file);
    }
    if (!checkUsed && hasCheck) {
      content = content.replace(/,\s*Check/g, '').replace(/Check,\s*/g, '');
      changed = true;
      console.log('  Removed Check from', file);
    }
    
    if (changed) writeFileSync(fp, content, 'utf-8');
  }
}

// ============================================================
// WARNING 3: RTL CSS - Arabic is in the locale list, so RTL support is intentional
// ============================================================
console.log('\n--- Warning 3: RTL CSS ---');
const astroConfig = readFileSync(join(root, 'astro.config.mjs'), 'utf-8');
const hasArabic = astroConfig.includes('ar-SA') || astroConfig.includes("'ar'");
console.log('Arabic locale configured:', hasArabic);
console.log('RTL styles are intentional for Arabic. CSS minification warnings are harmless.');

// ============================================================
// WARNING 4: Missing standards directory
// ============================================================
console.log('\n--- Warning 4: Standards directory ---');
const standardsDir = join(root, 'src', 'content', 'standards');
if (!existsSync(standardsDir)) {
  mkdirSync(standardsDir, { recursive: true });
  writeFileSync(join(standardsDir, '.gitkeep'), '');
  console.log('Created standards/ directory with .gitkeep');
} else {
  const files = readdirSync(standardsDir);
  console.log('Standards directory exists with', files.length, 'files');
}

console.log('\nAll warnings processed.');
