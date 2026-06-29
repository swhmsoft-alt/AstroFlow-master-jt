/**
 * Script to add new additive translation keys to all 9 language files.
 * Runs: node scripts/add-translations.mjs
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const translationsDir = path.resolve(__dirname, '../src/i18n/translations');

// New keys with English translations (will be used as fallback for all languages)
const newEntries = `  "services.additiveprocessspectrum.badge": "Additive Capabilities",
  "services.additiveprocessspectrum.subtitle": "From laser-powder fusion of complex internal geometries to rapid prototyping and low-volume production — three additive workflows covering your full titanium AM portfolio.",
  "services.additivespecsdashboard.badge": "Technical Specifications",
  "services.additivespecsdashboard.subtitle": "Industrial SLM/DMLS printer parameters — calibrated and verified for titanium aerospace and medical-grade production.",
  "services.additivespecsdashboard.footnote": "Specifications apply to our EOS / Renishaw SLM platforms. Mechanical properties verified per ASTM F2924 (Ti-6Al-4V) and ASTM F3302 (additive manufacturing).",
  "services.additivequalityknowhow.badge": "Quality Assurance",
  "services.additivequalityknowhow.subtitle": "Titanium 3D printing demands rigorous atmospheric control and post-process thermal management. Here's how we ensure defect-free, fatigue-rated components.",
  "services.additivequalityknowhow.0.title": "Strict Vacuum Argon & Powder Integrity Control",
  "services.additivequalityknowhow.0.problem": "Titanium's extreme affinity for oxygen at elevated temperatures means that even trace O₂ contamination (>100 ppm) during the SLM/DMLS process causes embrittlement, oxide inclusion formation, and degradation of mechanical properties — reducing ductility and fatigue life below aerospace and medical acceptance thresholds.",
  "services.additivequalityknowhow.0.solution": "Sub-100 ppm Oxygen Monitoring & Certified ASTM F136 Spherical Powders",
  "services.additivequalityknowhow.0.detail0": "Build chamber oxygen maintained at ≤100 ppm continuous monitoring via dual zirconia sensors — automated inert gas purging triggers if threshold is exceeded, preventing build contamination",
  "services.additivequalityknowhow.0.detail1": "Ultra-high-purity argon (99.999%) used as the protective atmosphere — flow rate dynamically adjusted to maintain laminar inert gas sweep across the powder bed, preventing turbulent oxygen entrainment",
  "services.additivequalityknowhow.0.detail2": "Certified ASTM F136 / F3001 spherical titanium powders sourced from ISO 13485-compliant suppliers — each lot supplied with chemical composition certificate and particle size distribution (15-45 µm / 45-90 µm)",
  "services.additivequalityknowhow.0.detail3": "Closed-loop powder handling system: Sieving → drying → recirculating under argon — minimizing atmospheric exposure and maintaining powder flowability across multi-build production runs",
  "services.additivequalityknowhow.1.title": "Residual Stress Relief & HIP Readiness",
  "services.additivequalityknowhow.1.problem": "The rapid melting and solidification inherent to SLM/DMLS creates steep thermal gradients within each printed layer — generating locked-in residual stresses that can cause part distortion upon removal from the build plate, geometric warping during support removal, and reduced fatigue performance in service.",
  "services.additivequalityknowhow.1.solution": "Mandatory In-Furnace Vacuum Stress Relief & Downstream HIP Integration",
  "services.additivequalityknowhow.1.detail0": "Post-print vacuum stress relief at 540-650°C (per ASME BPV Code) — applied immediately after build plate removal to release locked-in thermal stresses before any support removal or secondary machining operations",
  "services.additivequalityknowhow.1.detail1": "Vacuum furnace atmosphere maintained at ≤10⁻⁵ mbar during the entire stress relief cycle — preventing any surface oxidation or alpha-case formation on the titanium component",
  "services.additivequalityknowhow.1.detail2": "Hot Isostatic Pressing (HIP) ready process flow: stress relief → support removal → HIP at 900-950°C / 100-150 MPa → final machining — closing internal micro-porosity and achieving defense-grade fatigue lifetimes",
  "services.additivequalityknowhow.1.detail3": "Mechanical property validation per ASTM F2924: post-HIP tensile strength ≥930 MPa, yield strength ≥860 MPa, elongation ≥10% — matching or exceeding wrought Ti-6Al-4V specifications"`;

const languages = ['de', 'ja', 'fr', 'es', 'pt', 'it', 'ko', 'nl', 'pl'];

for (const lang of languages) {
  const filePath = path.join(translationsDir, `${lang}.json`);
  let content = fs.readFileSync(filePath, 'utf-8');
  
  // Remove trailing whitespace and closing brace
  content = content.trimEnd();
  
  // Remove the trailing newline and closing brace
  if (content.endsWith('}')) {
    content = content.slice(0, -1).trimEnd();
    // Add a comma after the last entry if there isn't one already
    if (!content.endsWith(',')) {
      content += ',';
    }
    content += '\n' + newEntries + '\n}';
  }
  
  fs.writeFileSync(filePath, content);
  console.log(`✓ Updated ${lang}.json`);
}

console.log('\nAll 9 language files updated successfully!');