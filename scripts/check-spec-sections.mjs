import { readFileSync } from 'fs';
const c = readFileSync('src/content/product-specs/titanium-action-camera-lens-bezel.md', 'utf-8');
const parts = c.split('---');
const body = parts.slice(2).join('---');
const sections = body.match(/## [^\n]+/g);
console.log('SECTIONS IN PROSE BODY:');
sections.forEach(s => console.log('  ' + s.trim()));
