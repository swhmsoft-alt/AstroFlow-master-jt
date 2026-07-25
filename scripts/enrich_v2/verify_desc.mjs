/* Verify capabilitiesDescription differentiation */
import { readFileSync, readdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
const __dirname = dirname(fileURLToPath(import.meta.url));
const CAP_DIR = join(__dirname, '..', '..', 'src', 'content', 'capabilities');
const files = readdirSync(CAP_DIR).filter(f => f.endsWith('.json'));

// Sample pages from different categories
const samples = [
  '5-axis-cnc-machining-of-blades',
  'waterjet-cutting',
  'vacuum-annealing',
  'anodizing-ams-2488',
  'laser-marking-udi-code',
  'charpy-impact-at-20c',
  '100-crack-detection',
  'assembly-and-riveting',
  'thread-rolling-of-all-fasteners',
  'tig-welding-of-frame-assemblies',
];

console.log('=== capabilitiesDescription samples (post-fix) ===');
for (const s of samples) {
  const f = files.find(fn => fn.includes(s));
  if (!f) { console.log('  SKIP: ' + s); continue; }
  const d = JSON.parse(readFileSync(join(CAP_DIR, f), 'utf8'));
  const cap = d.capabilitiesDescription || '(empty)';
  // Check if matches the old template
  const isOld = cap.includes('Our facility is equipped to handle') || 'SPC monitoring';
  console.log('  ' + d.title.substring(0,32).padEnd(34) + '| ' + cap.substring(0,70));
}

// Check how many still have old template
let oldCount = 0;
for (const f of files) {
  const d = JSON.parse(readFileSync(join(CAP_DIR, f), 'utf8'));
  const cap = d.capabilitiesDescription || '';
  if (cap.includes('Our facility is equipped to handle')) oldCount++;
}
console.log('\n=== Result ===');
console.log('  Total files: ' + files.length);
console.log('  Still using old template: ' + oldCount);
