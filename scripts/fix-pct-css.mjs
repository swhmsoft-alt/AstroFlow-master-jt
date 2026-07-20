import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');

// Fix EngineeringWorkflow.astro: replace left-[12.5%] with inline style
let c = readFileSync(join(root, 'src', 'components', 'services', 'EngineeringWorkflow.astro'), 'utf-8');
c = c.replace(
  'left-[12.5%] right-[12.5%]',
  ''
);
c = c.replace(
  'class="hidden lg:block absolute top-24 h-0.5"',
  'class="hidden lg:block absolute top-24 h-0.5" style="left:12.5%;right:12.5%"'
);
writeFileSync(join(root, 'src', 'components', 'services', 'EngineeringWorkflow.astro'), c, 'utf-8');
console.log('Fixed EngineeringWorkflow.astro');

// Check ResponsePipelineTimeline.astro
let r = readFileSync(join(root, 'src', 'components', 'rfq', 'ResponsePipelineTimeline.astro'), 'utf-8');
const lines = r.split('\n').filter(l => l.includes('12.5') || l.includes('16.67') || l.includes('left-['));
if (lines.length > 0) {
  console.log('ResponsePipelineTimeline contains:', lines.join('\n'));
} else {
  console.log('ResponsePipelineTimeline has no % classes');
}

// Check rtl.css
let rtl = readFileSync(join(root, 'src', 'styles', 'rtl.css'), 'utf-8');
const rtlLines = rtl.split('\n').filter(l => l.includes('12.5') || l.includes('16.67'));
if (rtlLines.length > 0) {
  console.log('rtl.css has % lines - these will no longer be needed once source classes are fixed');
  rtlLines.forEach(l => console.log('  ' + l.trim()));
}
