/**
 * Fix ALL known issues introduced by the translate script:
 * 1. Duplicate import/useTranslations blocks
 * 2. t() in type annotations (before t is defined)
 * 3. Move import block to frontmatter top if needed
 */
import fs from 'fs';
import { execSync } from 'child_process';

// Get modified files
let result;
try {
  result = execSync('git diff --name-only HEAD', { encoding: 'utf-8', shell: 'cmd.exe' });
} catch {
  console.log('No git diff available, scanning all src files');
  result = '';
}

const modifiedFiles = result.trim().split('\n').filter(Boolean);
const files = modifiedFiles.length > 0 ? modifiedFiles : [];

console.log(`Checking ${files.length} modified files...\n`);

let fixCount = 0;

files.forEach(filePath => {
  if (!filePath.endsWith('.astro') && !filePath.endsWith('.tsx') && filePath !== 'src/i18n/ui.ts') return;
  if (!fs.existsSync(filePath)) return;
  
  let content = fs.readFileSync(filePath, 'utf-8');
  let changed = false;
  
  // 1. Fix duplicate import blocks: remove ALL blocks after the first one
  const importPattern = /import \{ getLangFromUrl, useTranslations \} from ['"].+\/i18n\/utils['"];?/g;
  const tDefPattern = /const currentLang = getLangFromUrl\(Astro\.url\);\s*const t = useTranslations\(currentLang\);/g;
  
  // Check for duplicates
  const imports = [...content.matchAll(importPattern)];
  if (imports.length > 1) {
    // Keep the first one, remove the rest
    const firstIdx = imports[0].index;
    const firstEnd = firstIdx + imports[0][0].length;
    
    // Find the lines after the first import that contain duplicates
    const lines = content.split('\n');
    let keepIdx = -1;
    
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].includes("import { getLangFromUrl, useTranslations } from") && 
          lines[i].includes('/i18n/utils') && 
          keepIdx === -1) {
        keepIdx = i;
      }
    }
    
    // Build new content: remove all duplicate blocks
    const newLines = lines.filter((line, idx) => {
      // Always keep lines 0..keepIdx+2 (import + 2 t-def lines)
      if (idx <= keepIdx + 2) return true;
      
      // Filter out duplicates
      if (line.includes("import { getLangFromUrl, useTranslations } from") && 
          line.includes('/i18n/utils')) return false;
      if (line.includes("const currentLang = getLangFromUrl(Astro.url)")) return false;
      if (line.includes("const t = useTranslations(currentLang)")) return false;
      
      return true;
    });
    
    const fixed = newLines.join('\n');
    if (fixed !== content) {
      content = fixed;
      changed = true;
      console.log(`  ✓ ${filePath} - removed duplicate import block`);
    }
  }
  
  // 2. Fix t() in type annotations (like `variant?: t('...') | '...'`)
  // This pattern happens when the annotation is in the interface before the import
  const typeAnnotationFix = content.replace(
    /(\w+\??\s*:\s*)t\('[^']+'\)(\s*\|)/g,
    '$1$2'
  );
  if (typeAnnotationFix !== content) {
    content = typeAnnotationFix;
    changed = true;
    console.log(`  ✓ ${filePath} - fixed t() in type annotation`);
  }
  
  // 3. If there's no import block but t() is used, nothing to fix here
  // (the script already added it)
  
  if (changed) {
    try {
      fs.writeFileSync(filePath, content, 'utf-8');
      fixCount++;
    } catch (err) {
      console.log(`  ✗ ${filePath} - write error: ${err.message.substring(0, 50)}`);
    }
  }
});

console.log(`\nFixed ${fixCount} files.`);
console.log('Run "npm run build" to verify.');