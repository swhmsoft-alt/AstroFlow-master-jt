import { readFileSync } from 'fs';
const html = readFileSync('dist/products/product-entities/titanium-3d-printed-ergonomic-mouse/index.html', 'utf-8');

console.log('Old heading "Semantic Graph":', html.includes('Semantic Graph'));
console.log('Old parenthesis "(The AI Search Optimization)":', html.includes('AI Search Optimization'));
console.log('New heading "System Interconnectivity":', html.includes('System Interconnectivity'));
console.log('Cross-Reference data preserved:', html.includes('Cross-Reference Classification'));
console.log('Primary Industrial Entity preserved:', html.includes('Primary Industrial Entity'));
