import { readFileSync } from 'fs';
const html = readFileSync('dist/products/product-entities/titanium-3d-printed-ergonomic-mouse/index.html', 'utf-8');

console.log('=== SINGLE RENDER CONFIRMED ===');
['Technical Specifications Matrix',
 'Supply Chain, Traceability',
 'Application Dynamics',
 'Advanced Manufacturing',
 'Technical FAQ for System Engineers',
 'Semantic Graph'
].forEach(s => {
  const count = html.split(s).length - 1;
  console.log(`  ${s}: ${count}x`);
});

console.log('');
console.log('=== LEGACY DUPLICATES (should be hidden) ===');
['Why Titanium', 'Engineering Challenges', 'FAQ &mdash;'].forEach(s => {
  console.log(`  ${s}: ${html.includes(s)}`);
});

console.log('');
console.log('=== STRUCTURE ===');
console.log('  TOC Jump to:', html.includes('Jump to:'));
console.log('  Complete Engineering Spec:', html.includes('Complete Engineering Specification'));
console.log('  Related Knowledge:', html.includes('Related Knowledge'));
console.log('  CTA:', html.includes('Request Quote for'));

console.log('');
console.log('=== ANCHOR IDS ===');
['tech-specs', 'supply-chain', 'application', 'manufacturing', 'faq-section', 'knowledge-graph'].forEach(id => {
  console.log(`  #${id}: ${html.includes('id="' + id + '"')}`);
});
