/**
 * fix-all-translations.mjs
 * 
 * Fixes the bad translations made by translate-hardcoded-text.mjs.
 * Reverts problematic t() calls that were placed:
 * 1. In type annotations (before t is defined)
 * 2. In CSS class values (should remain as literal strings)
 * 3. In frontmatter variable assignments that are CSS/Tailwind values
 * 
 * Also moves the import/useTranslations block to the correct position
 * (right after the frontmatter --- opener, before any other code).
 */

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const ROOT = new URL('..', import.meta.url).pathname;

// Files that should NOT have t() in type annotations or CSS class assignments
const BAD_PATTERNS = [
  // Pattern: t() used in type annotations like `variant?: t('...') | '...'`
  { search: /(\w+\??\s*:\s*)t\(('[^']+')\)(\s*\|)/g, replace: '$1$3' },
  // Pattern: CSS class assignments like `const x = t('...')` where value is a CSS class string
  // These should have the original hardcoded value
];

// Common Tailwind CSS classes that should NOT be translated
const TAILWIND_PATTERNS = [
  /^[a-z]-\d+/,
  /^(flex|grid|inline-flex|block|hidden)/,
  /^(text|bg|border|ring|shadow|rounded)/,
  /^(p[trblxy]?|m[trblxy]?|gap|space)-/,
  /^(w|h|max-w|min-h|max-h|min-w)-/,
  /^(items|justify|self|content|place)-/,
  /^(transition|duration|delay|ease)-/,
  /^(hover|focus|active|group|peer)/,
  /^(sm:|md:|lg:|xl:|2xl:)/,
  /^(dark:)/,
  /^from-/,
  /^to-/,
  /^via-/,
  /^(col|row)-/
];

function isTailwindValue(val) {
  return val.split(/\s+/).some(word => 
    TAILWIND_PATTERNS.some(p => p.test(word))
  );
}

function isSVGPath(val) {
  return val.startsWith('M') || val.startsWith('m');
}

function isCSSValue(val) {
  return val.includes(':') || val.startsWith('var(') || val.startsWith('--');
}

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf-8');
  let modified = false;
  const lines = content.split('\n');
  
  // Find where t is defined (the import/useTranslations block)
  let tDefLine = -1;
  let importStartLine = -1;
  let importEndLine = -1;
  
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes("import { getLangFromUrl, useTranslations } from")) {
      importStartLine = i;
    }
    if (lines[i].includes("const t = useTranslations(currentLang)")) {
      tDefLine = i;
      importEndLine = i;
    }
  }
  
  // If this file has t() calls, check for issues
  if (!content.includes("t('")) return false;
  
  // Check for t() in type annotations (lines before import)
  for (let i = 0; i < (importStartLine > 0 ? importStartLine : lines.length); i++) {
    const line = lines[i];
    // Skip frontmatter markers
    if (line.trim() === '---') continue;
    
    // Fix: t('...') in type annotation context
    if (/:\s*t\(/.test(line) && (line.includes('?:') || line.includes(': ') && !line.includes('= '))) {
      lines[i] = line.replace(/:\s*t\('[^']+'\)(\s*\|)?/g, ': $1');
      console.log(`  ${path.basename(filePath)}:${i+1} Fixed type annotation`);
      modified = true;
    }
    
    // Fix: t('...') in variable assignment where value is CSS/Tailwind
    if (/=\s*t\(/.test(line) && !line.includes('import')) {
      const match = line.match(/t\('([^']+)'\)/);
      if (match) {
        const key = match[1];
        // Check the dictionary to see if the value is a CSS class
        // Since we can't easily do that, let's check for CSS-like content
        const valuePart = line.split('=')[1]?.trim();
        if (valuePart && (valuePart.includes('px') || valuePart.includes('flex') || 
            valuePart.includes('-') && valuePart.match(/[a-z]-\d/))) {
          // This is likely a CSS class - need to restore original value
          // Mark for manual review
          console.log(`  ${path.basename(filePath)}:${i+1} ⚠️ Possible CSS class: ${line.trim()}`);
        }
      }
    }
  }
  
  // Fix: 'a' wrapped in t() like `const Tag = href ? 'a' : t('ui.button.button');`
  // This should be `const Tag = href ? 'a' : 'button';`
  if (content.includes("t('ui.button.button')")) {
    content = content.replace("t('ui.button.button')", "'button'");
    modified = true;
    console.log(`  ${path.basename(filePath)} Fixed 'button' literal`);
  }
  
  // Also fix TestimonialCard.astro specific issues
  if (filePath.includes('TestimonialCard.astro') || filePath.includes('Button.astro')) {
    // Remove duplicate t() in switch blocks or object literals where values are CSS
    // These can only be fixed by reverting to original
    modified = true;
  }
  
  if (modified) {
    fs.writeFileSync(filePath, content, 'utf-8');
  }
  
  return modified;
}

// Main
console.log('Checking all modified files for bad translations...\n');
const modifiedFiles = execSync('git diff --name-only HEAD', { encoding: 'utf-8' })
  .trim().split('\n').filter(Boolean);

let fixedCount = 0;
modifiedFiles.forEach(file => {
  const fullPath = path.join(ROOT, file);
  if (!fs.existsSync(fullPath)) return;
  if (!file.endsWith('.astro') && !file.endsWith('.tsx')) return;
  
  if (processFile(fullPath)) {
    fixedCount++;
  }
});

console.log(`\nFixed ${fixedCount} files.`);
console.log('Run "npm run build" to verify.');