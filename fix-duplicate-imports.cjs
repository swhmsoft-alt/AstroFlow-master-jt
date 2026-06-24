const { readFileSync, writeFileSync } = require('fs');
const { globSync } = require('glob');

const files = globSync('src/**/*.astro');

for (const file of files) {
  const content = readFileSync(file, 'utf-8');
  const lines = content.split('\n');
  
  let newLines = [];
  let i = 0;
  let foundFirst = false;
  
  while (i < lines.length) {
    const line = lines[i];
    const next1 = lines[i+1] || '';
    const next2 = lines[i+2] || '';
    
    if ((line.includes("import { getLangFromUrl, useTranslations } from") || 
         line.includes("import { getLangFromUrl, useTranslations, localizePath } from")) &&
        (next1.includes("const currentLang = ") || next1.includes("const {") && next2.includes("const currentLang = ")) &&
        foundFirst) {
      console.log(`  Removing duplicate at line ${i+1} in ${file}`);
      if (next1.includes("const currentLang = ") && next2.includes("const t = ")) {
        i += 3;
      } else if (next1.includes("const currentLang = ")) {
        i += 2;
      } else if (next1.includes("const {") && next2.includes("const currentLang = ") && (lines[i+3]||'').includes("const t = ")) {
        i += 4;
      } else {
        newLines.push(line);
        i++;
      }
      continue;
    }
    
    if ((line.includes("import { getLangFromUrl, useTranslations } from") ||
         line.includes("import { getLangFromUrl, useTranslations, localizePath } from"))) {
      foundFirst = true;
    }
    
    newLines.push(line);
    i++;
  }
  
  const result = newLines.join('\n');
  if (result !== content) {
    writeFileSync(file, result, 'utf-8');
    console.log(`Fixed: ${file}`);
  }
}

console.log('Done!');