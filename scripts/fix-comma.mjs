// Fix missing trailing commas on ru:/ar: lines in seo.ts
import fs from 'fs';
const c = fs.readFileSync('src/config/seo.ts', 'utf-8').split('\n');
let fixed = 0;
for (let i = 0; i < c.length; i++) {
  const l = c[i];
  if (/^\s{6}(ru|ar):/.test(l) && !l.trimEnd().endsWith(',')) {
    c[i] = l.trimEnd() + ',';
    fixed++;
  }
}
fs.writeFileSync('src/config/seo.ts', c.join('\n'), 'utf-8');
console.log('Fixed', fixed, 'lines');
