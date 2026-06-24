import fs from 'fs';
import { execSync } from 'child_process';

// Get modified files
const result = execSync('git diff --name-only HEAD', { encoding: 'utf-8' });
const files = result.trim().split('\n').filter(Boolean);

console.log(`Files modified: ${files.length}`);
files.forEach(f => console.log(`  ${f}`));

// Check for common issues
const issues = [];
files.forEach(file => {
  if (!fs.existsSync(file)) return;
  const content = fs.readFileSync(file, 'utf-8');
  
  // Check for t() used before t is defined
  const lines = content.split('\n');
  let tDefinedLine = -1;
  let tUsedBeforeDef = false;
  
  lines.forEach((line, idx) => {
    if (line.includes('const t = useTranslations')) {
      tDefinedLine = idx;
    }
    // Check if t() is used before t is defined, in the frontmatter (--- blocks)
    if (tDefinedLine === -1 && line.includes("t('") && !line.includes('import')) {
      tUsedBeforeDef = true;
    }
  });
  
  if (tUsedBeforeDef) {
    issues.push(`${file}: t() used before t is defined`);
  }
  
  // Check for t() in type annotations
  if (/:\s*t\(/.test(content)) {
    issues.push(`${file}: t() used in type annotation`);
  }
});

console.log(`\nIssues found: ${issues.length}`);
issues.forEach(i => console.log(`  ❌ ${i}`));