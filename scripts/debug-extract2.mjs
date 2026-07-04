import fs from 'fs';
const code = fs.readFileSync('src/data/equipment.ts', 'utf-8');

const key = '5-axis-machining-center';
const idx = code.indexOf('"' + key + '"');
console.log('idx:', idx);

// Show 100 chars around idx
console.log('Around idx:', JSON.stringify(code.substring(Math.max(0, idx - 20), idx + 80)));

const colon = code.indexOf(':', idx);
console.log('colon:', colon);
console.log('Around colon:', JSON.stringify(code.substring(colon - 5, colon + 5)));

let start = colon + 1;
while (start < code.length && code[start] !== '{') start++;
console.log('start (brace pos):', start);
console.log('Char at start:', code[start]);
console.log('Around start:', JSON.stringify(code.substring(start, start + 50)));

// Count braces
let depth = 1, inStr = false, esc = false;
let end = start + 1;
let debugPos = 0;
for (let i = end; i < code.length; i++) {
  const ch = code[i];
  if (esc) { esc = false; continue; }
  if (ch === '\\' && inStr) { esc = true; continue; }
  if ((ch === '"' || ch === "'" || ch === '`') && !esc) {
    if (!inStr) inStr = ch;
    else if (inStr === ch) inStr = false;
    continue;
  }
  if (inStr) continue;
  if (ch === '{') depth++;
  if (ch === '}') { 
    depth--; 
    if (depth === 20) debugPos = i;
    if (depth === 0) { end = i + 1; break; } 
  }
}

console.log('End position:', end);
console.log('First 200 chars of extracted:');
const entry = code.slice(start, end);
console.log(entry.substring(0, 200));
console.log('Total length:', entry.length);