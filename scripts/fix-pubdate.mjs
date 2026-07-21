import { readFileSync, writeFileSync } from 'fs';
let c = readFileSync('scripts/differentiate-specs.mjs', 'utf8');
// The broken line 141
const broken = 'newLines.push(pubDate: " + dates[h % dates.length] + ");';
const fixed  = "newLines.push('pubDate: \"' + dates[h % dates.length] + '\"');";
if (c.includes(broken)) {
  c = c.replace(broken, fixed);
  writeFileSync('scripts/differentiate-specs.mjs', c, 'utf8');
  console.log('Fixed pubDate quoting');
} else {
  console.log('Pattern not found - checking...');
  // Check what the actual line looks like
  const lines = c.split('\n');
  lines.forEach((l,i) => { if (l.includes('pubDate')) console.log(`${i+1}: ${l}`); });
}
