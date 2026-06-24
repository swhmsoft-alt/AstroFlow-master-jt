/**
 * Fix missing useTranslations imports in .astro files that use t()
 * 
 * For pages: adds import after last existing import in frontmatter
 * For components: adds import + t() definition
 */
import fs from 'fs';
import path from 'path';

function collectFiles(dir) {
  const results = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory() && entry.name !== 'node_modules') {
      results.push(...collectFiles(full));
    } else if (entry.isFile() && entry.name.endsWith('.astro')) {
      results.push(full);
    }
  }
  return results;
}

function countDirDepth(filePath, baseDir) {
  const rel = path.relative(baseDir, filePath);
  const parts = rel.split(path.sep);
  return parts.length - 1; // subtract 1 for the file itself
}

function getRelativeImportPath(depth) {
  if (depth <= 0) return './i18n/utils';
  return '../'.repeat(depth) + 'i18n/utils';
}

function needsFix(content) {
  // Check if t() is used in template (outside frontmatter) or in frontmatter
  return /[^a-zA-Z0-9_$]t\(/.test(content) && 
         !content.includes('import { getLangFromUrl, useTranslations }');
}

function fixFile(filePath, baseDir) {
  let content = fs.readFileSync(filePath, 'utf-8');
  
  if (!needsFix(content)) return false;
  if (content.includes('import { getLangFromUrl, useTranslations }')) return false;
  
  const depth = countDirDepth(filePath, baseDir);
  const importPath = getRelativeImportPath(depth);
  
  // Find the frontmatter boundaries
  const fmMatch = content.match(/^---\n([\s\S]*?)\n---/);
  if (!fmMatch) return false;
  
  let fm = fmMatch[1];
  const lines = fm.split('\n');
  
  // Find the last import line in frontmatter
  let lastImportIdx = -1;
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].trim().startsWith('import ')) {
      lastImportIdx = i;
    }
  }
  
  const importStmt = `import { getLangFromUrl, useTranslations } from '${importPath}';`;
  const initStmt = `const lang = getLangFromUrl(Astro.url);\nconst t = useTranslations(lang);`;
  
  if (lastImportIdx >= 0) {
    // Insert after last import
    lines.splice(lastImportIdx + 1, 0, importStmt);
    lines.splice(lastImportIdx + 2, 0, '');
    lines.splice(lastImportIdx + 3, 0, initStmt);
  } else {
    // No imports in frontmatter, add at beginning of frontmatter
    lines.unshift(importStmt + '\n' + initStmt);
  }
  
  const newFm = lines.join('\n');
  content = content.replace(fmMatch[1], newFm);
  
  fs.writeFileSync(filePath, content, 'utf-8');
  console.log(`  ✓ Fixed: ${filePath}`);
  return true;
}

const baseDir = path.resolve('src');
const files = collectFiles(baseDir);
console.log(`\nScanning ${files.length} .astro files for missing useTranslations...\n`);

let fixed = 0;
for (const file of files) {
  if (fixFile(file, baseDir)) {
    fixed++;
  }
}

console.log(`\nFixed ${fixed} files.`);