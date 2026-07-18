/**
 * Batch 1 Migration — Piping & Flanges (7 products)
 * Merges generated .md spec content with original JSON data and writes .md files
 * that Astro can render, preserving existing URL slugs.
 */

import { readFileSync, writeFileSync, unlinkSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ENTITIES_DIR = join(__dirname, '..', 'src', 'content', 'product-entities');
const SPECS_DIR = join(__dirname, '..', 'output', 'product-specs');

// Batch 1 products: JSON slug → generated .md slug (may differ)
const BATCH = {
  'titanium-blind-flange-asme-b165':   'titanium-blind-flange-asme-b16.5',
  'titanium-concentric-reducer':       'titanium-concentric-reducer',
  'titanium-equal-tee-asme-b169':      'titanium-equal-tee-asme-b16.9',
  'titanium-slip-on-flange':           'titanium-slip-on-flange',
  'titanium-stub-end-lap-joint':       'titanium-stub-end-lap-joint',
  'titanium-threaded-npt-nipple':      'titanium-threaded-npt-nipple',
  'titanium-weld-neck-flange':         'titanium-weld-neck-flange',
};

let count = 0;
for (const [jsonSlug, specSlug] of Object.entries(BATCH)) {
  const jsonPath = join(ENTITIES_DIR, `${jsonSlug}.json`);
  const specPath = join(SPECS_DIR, `${specSlug}.md`);
  const outPath = join(ENTITIES_DIR, `${jsonSlug}.md`);

  if (!existsSync(jsonPath)) { console.error(`  ❌ Missing JSON: ${jsonPath}`); continue; }
  if (!existsSync(specPath)) { console.error(`  ❌ Missing spec: ${specPath}`); continue; }

  // Read original JSON
  const jsonRaw = readFileSync(jsonPath, 'utf-8');
  const json = JSON.parse(jsonRaw);

  // Read generated spec markdown — extract frontmatter and body
  const specRaw = readFileSync(specPath, 'utf-8');
  
  // Split frontmatter from body
  const fmMatch = specRaw.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!fmMatch) { console.error(`  ❌ Cannot parse spec frontmatter: ${specSlug}`); continue; }
  
  const specBody = fmMatch[2]; // The rich markdown body (sections 1-6)

  // Build merged frontmatter — use JSON data as base, overlay spec data
  const aliases = json.aliases || [];
  const surfaceTreatment = json.surfaceTreatment || [];
  const inspection = json.inspection || [];
  const commonFailures = json.commonFailures || [];
  const process = json.process || [];
  const faq = json.faq || [];
  const relatedProducts = json.relatedProducts || [];
  const relatedCapabilities = json.relatedCapabilities || [];
  const relatedMaterials = json.relatedMaterials || [];
  const relatedIndustries = json.relatedIndustries || [];
  const designConsiderations = json.designConsiderations || [];
  const typicalRfqRequirements = json.typicalRfqRequirements || [];
  const standards = json.standards || ['ASTM B348'];
  const alloyReason = json.alloyReason || '';
  const pubDate = json.pubDate || '2026-07-18';
  const order = json.order ?? 0;
  const seoTitle = json.seoTitle || '';
  const seoDescription = json.seoDescription || '';

  // Rich fields from spec frontmatter
  const specFm = fmMatch[1];
  const sku = specFm.match(/^sku:\s*"(.*?)"$/m)?.[1] || `TI-${json.industry?.substring(0,3).toUpperCase() || 'GEN'}-${(json.category||'GEN').substring(0,3).toUpperCase()}`;
  const titaniumType = specFm.match(/^titanium_type:\s*"(.*?)"$/m)?.[1] || 'Titanium Alloy';
  const unsNumber = specFm.match(/^uns_number:\s*"(.*?)"$/m)?.[1] || '';
  const wnr = specFm.match(/^werkstoff_number:\s*"(.*?)"$/m)?.[1] || '';
  const density = specFm.match(/^density:\s*"(.*?)"$/m)?.[1] || '';
  const tensile = specFm.match(/^tensile_strength:\s*"(.*?)"$/m)?.[1] || '';
  const yieldS = specFm.match(/^yield_strength:\s*"(.*?)"$/m)?.[1] || '';
  const elong = specFm.match(/^elongation:\s*"(.*?)"$/m)?.[1] || '';
  const hardness = specFm.match(/^hardness:\s*"(.*?)"$/m)?.[1] || '';
  const modulus = specFm.match(/^modulus:\s*"(.*?)"$/m)?.[1] || '';
  const tc = specFm.match(/^thermal_conductivity:\s*"(.*?)"$/m)?.[1] || '';
  const mst = specFm.match(/^max_service_temp:\s*"(.*?)"$/m)?.[1] || '';
  const sf = specFm.match(/^surface_finish:\s*"(.*?)"$/m)?.[1] || '';
  const mp = specFm.match(/^manufacturing_process:\s*"(.*?)"$/m)?.[1] || '';
  const wr = specFm.match(/^weight_reduction:\s*"(.*?)"$/m)?.[1] || '';
  const ndt = specFm.match(/^ndt_methods:\s*"(.*?)"$/m)?.[1] || '';
  const complianceMatch = specFm.match(/^compliance:\s*(\[.*?\])$/ms);
  const compliance = complianceMatch ? JSON.parse(complianceMatch[1]) : ['EN 10204 3.1', 'REACH', 'RoHS 3'];

  // Build merged YAML frontmatter
  const frontmatter = `---
title: "${json.title}"
sku: "${sku}"
category: "${json.category || ''}"
industry: "${json.industry || ''}"
system: "${json.system || ''}"
titanium_grade: "${json.material || ''}"
titanium_type: "${titaniumType}"
uns_number: "${unsNumber}"
werkstoff_number: "${wnr}"
density: "${density}"
tensile_strength: "${tensile}"
yield_strength: "${yieldS}"
elongation: "${elong}"
hardness: "${hardness}"
modulus: "${modulus}"
thermal_conductivity: "${tc}"
max_service_temp: "${mst}"
function: "${json.function || ''}"
material: "${json.material || ''}"
alloyReason: "${alloyReason}"
process: ${JSON.stringify(process)}
surfaceTreatment: ${JSON.stringify(surfaceTreatment)}
inspection: ${JSON.stringify(inspection)}
commonFailures: ${JSON.stringify(commonFailures)}
designConsiderations: ${JSON.stringify(designConsiderations)}
typicalRfqRequirements: ${JSON.stringify(typicalRfqRequirements)}
standards: ${JSON.stringify(standards)}
faq: ${JSON.stringify(faq)}
relatedProducts: ${JSON.stringify(relatedProducts)}
relatedCapabilities: ${JSON.stringify(relatedCapabilities)}
relatedMaterials: ${JSON.stringify(relatedMaterials)}
relatedIndustries: ${JSON.stringify(relatedIndustries)}
aliases: ${JSON.stringify(aliases)}
seoTitle: "${seoTitle}"
seoDescription: "${seoDescription}"
order: ${order}
pubDate: "${pubDate}"
surface_finish: "${sf}"
manufacturing_process: "${mp}"
weight_reduction: "${wr}"
ndt_methods: "${ndt}"
compliance: ${JSON.stringify(compliance)}
---

`;

  // Write merged .md file
  writeFileSync(outPath, frontmatter + specBody, 'utf-8');

  // Delete original JSON
  unlinkSync(jsonPath);

  count++;
  console.log(`  ✅ ${jsonSlug}.json → ${jsonSlug}.md`);
}

console.log(`\n✅ Batch 1 migration complete. ${count} product spec pages injected.`);
console.log('   Run `npx astro build` to verify.');
