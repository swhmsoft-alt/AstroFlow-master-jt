import { readFileSync } from 'fs';
const html = readFileSync('dist/products/product-entities/titanium-3d-printed-ergonomic-mouse/index.html', 'utf-8');

console.log('=== ANCHORS ===');
console.log('Anchor script injected:', html.includes('inject anchor IDs'));
console.log('Has id=tech-specs:', html.includes('id="tech-specs"'));

console.log('');
console.log('=== ALIASES ===');
console.log('Also known as:', html.includes('Also known as'));

console.log('');
console.log('=== JSON-LD ===');
console.log('SKU:', html.includes('TI-CE-INP-PRINTE'));
console.log('UNS:', html.includes('UNS R56400'));
console.log('Tensile:', html.includes('Min. 895 MPa'));
console.log('Compliance:', html.includes('EN 10204'));

console.log('');
console.log('=== SINGLE RENDER ===');
['Technical Specifications Matrix','Supply Chain, Traceability','Application Dynamics','Advanced Manufacturing','Technical FAQ','Semantic Graph'].forEach(s => {
  const count = html.split(s).length - 1;
  const status = count === 1 ? 'OK' : 'FAIL(' + count + 'x)';
  console.log('  ' + s + ': ' + status);
});
