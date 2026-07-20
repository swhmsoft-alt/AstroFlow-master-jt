import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');

// Fix ResponsePipelineTimeline.astro
let c = readFileSync(join(root, 'src', 'components', 'rfq', 'ResponsePipelineTimeline.astro'), 'utf-8');
c = c.replace(
  'left-[calc(16.67%+1.5rem)] right-[calc(16.67%+1.5rem)]',
  ''
);
c = c.replace(
  'class="hidden md:block absolute top-8 h-px"',
  'class="hidden md:block absolute top-8 h-px" style="left:calc(16.67% + 1.5rem);right:calc(16.67% + 1.5rem)"'
);
writeFileSync(join(root, 'src', 'components', 'rfq', 'ResponsePipelineTimeline.astro'), c, 'utf-8');
console.log('Fixed ResponsePipelineTimeline.astro');

// Fix rtl.css - comment out or remove the problematic selectors
let rtl = readFileSync(join(root, 'src', 'styles', 'rtl.css'), 'utf-8');
rtl = rtl.replace(/\\[dir="rtl"\\] \\.left-\\\\\\[calc\\(16\\.67%.*?\\]/g, '/* RTL handled via inline style */');
rtl = rtl.replace(/\\[dir="rtl"\\] \\.right-\\\\\\[calc\\(16\\.67%.*?\\]/g, '/* RTL handled via inline style */');
rtl = rtl.replace(/\\[dir="rtl"\\] \\.left-\\\\\\[12\\.5%.*?\\]/g, '/* RTL handled via inline style */');
rtl = rtl.replace(/\\[dir="rtl"\\] \\.right-\\\\\\[12\\.5%.*?\\]/g, '/* RTL handled via inline style */');
writeFileSync(join(root, 'src', 'styles', 'rtl.css'), rtl, 'utf-8');
console.log('Fixed rtl.css comments');

// Now rebuild
console.log('All fixes applied. Run build to verify warnings are gone.');
