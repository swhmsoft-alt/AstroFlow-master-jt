import { readFileSync } from 'fs';
const html = readFileSync('dist/products/product-entities/titanium-3d-printed-ergonomic-mouse/index.html', 'utf-8');

const checks = [
  ['ProductHero CTA', 'Request Enterprise Pricing'],
  ['SpecificationTable', 'Technical Specifications Matrix'],
  ['TOC Nav', 'Jump to:'],
  ['Aliases', 'Also known as'],
  ['Blueprint prose', 'Complete Engineering Specification'],
  ['ProcurementMatrix', 'Commercial Logistics'],
  ['ComplianceWall', 'Regulatory'],
  ['SemanticTopology', 'Systems Interconnectivity'],
  ['JSON-LD present', 'application/ld+json'],
  ['JSON-LD Topology', 'DefinedTermSet'],
  ['InquiryForm', 'inquiry-section'],
  ['No section duplication', 'Technical Specifications Matrix'],
];

let allOk = true;
checks.forEach(([name, marker]) => {
  let ok;
  if (marker === 'Technical Specifications Matrix') {
    // Check NO duplication
    ok = html.split(marker).length - 1 === 1;
  } else {
    ok = html.includes(marker);
  }
  if (!ok) allOk = false;
  console.log((ok ? '  PASS' : '  FAIL') + '  ' + name + ' -> ' + marker.substring(0, 40));
});

console.log('');
console.log(allOk ? 'ALL CHECKS PASSED' : 'SOME CHECKS FAILED');

// Count all component sections
const sections = ['Request Enterprise Pricing', 'Technical Specifications Matrix', 'Commercial Logistics', 'Regulatory', 'Systems Interconnectivity', 'inquiry-section'];
console.log('');
console.log('Component order verification:');
sections.forEach(s => {
  const idx = html.indexOf(s);
  console.log('  ' + idx + '  ' + s.substring(0, 40));
});
