import { readFileSync } from 'fs';

const c = readFileSync('src/i18n/ui.ts', 'utf-8');
// Find the end of en block
const zhIndex = c.indexOf('  zh:');
if (zhIndex === -1) {
  console.log('No zh section found');
  console.log('Last 400 chars:', c.slice(-400));
} else {
  console.log('zh section starts at index', zhIndex);
  console.log('20 lines before zh:');
  const before = c.slice(Math.max(0, zhIndex - 300), zhIndex);
  console.log(before);
  console.log('---zh start---');
  console.log(c.slice(zhIndex, zhIndex + 200));
}