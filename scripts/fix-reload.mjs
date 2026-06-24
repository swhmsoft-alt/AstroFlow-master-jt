/**
 * Ultimate fix - read from git using cmd.exe and write with Node.js
 */
import { execSync } from 'child_process';
import fs from 'fs';

const files = [
  'src/components/ui/Button.astro',
  'src/components/ui/Card.astro',
  'src/components/ui/Section.astro',
  'src/components/Header.astro',
  'src/components/home/MaterialMatrix.astro',
  'src/components/home/PremiumCTA.astro',
  'src/components/home/PremiumHero.astro',
  'src/components/home/StatsShowcase.astro',
  'src/components/home/TechnicalCapabilities.astro',
  'src/components/home/TechnologyInnovation.astro',
  'src/components/home/Testimonials.astro',
  'src/components/react/CADUpload.tsx',
  'src/components/react/MobileMenu.tsx',
  'src/components/react/RFQForm.tsx',
  'src/components/resources/EngineeringDownloads.astro',
  'src/components/resources/FeaturedInsights.astro',
  'src/components/resources/ResourceHubMatrix.astro',
  'src/components/resources/TechnicalFaqAccordion.astro',
  'src/components/services/AdditiveBatchCta.astro',
  'src/components/services/AdditiveDedicatedCta.astro',
  'src/components/services/AnodizingDedicatedCta.astro',
  'src/components/services/AssemblyDedicatedCta.astro',
  'src/components/services/ComponentDedicatedCta.astro',
  'src/components/services/ExtrusionDedicatedCta.astro',
  'src/components/services/FabDedicatedCta.astro',
  'src/components/services/ForgingDedicatedCta.astro',
  'src/components/services/HeavyDedicatedCta.astro',
  'src/components/services/LaserDedicatedCta.astro',
  'src/components/services/MarkingDedicatedCta.astro',
  'src/components/services/MultiAxisCta.astro',
  'src/components/services/PackagingDedicatedCta.astro',
  'src/components/services/PassivationDedicatedCta.astro',
  'src/components/services/PrepDedicatedCta.astro',
  'src/components/services/RapidPrototypeCta.astro',
  'src/components/services/ServiceMatrixGrid.astro',
  'src/components/services/SlmDedicatedCta.astro',
  'src/components/services/SurfaceDedicatedCta.astro',
  'src/components/services/TexturingDedicatedCta.astro',
  'src/components/services/TurnMillDedicatedCta.astro',
  'src/components/services/WaterjetDedicatedCta.astro',
  'src/components/services/WireEdmDedicatedCta.astro',
  'src/i18n/ui.ts',
  'src/pages/blog/[...slug].astro',
  'src/pages/branded-custom-packaging-services.astro',
  'src/pages/laser-marking-custom-logo.astro',
  'src/pages/products/[...slug].astro',
  'src/pages/products/index.astro',
  'src/pages/rfq.astro',
  'src/pages/titanium-additive-manufacturing.astro',
  'src/pages/titanium-additive-manufacturing/3d-printing-slm.astro',
  'src/pages/titanium-additive-manufacturing/low-volume-production.astro',
  'src/pages/titanium-additive-manufacturing/rapid-prototyping.astro',
  'src/pages/titanium-cnc-machining-services.astro',
  'src/pages/titanium-cnc-machining-services/3-5-axis-cnc-machining.astro',
  'src/pages/titanium-cnc-machining-services/cnc-milling-turning.astro',
  'src/pages/titanium-cnc-machining-services/custom-industrial-components.astro',
  'src/pages/titanium-cnc-machining-services/wire-edm-machining.astro',
  'src/pages/titanium-fabrication-services.astro',
  'src/pages/titanium-fabrication-services/laser-cutting.astro',
  'src/pages/titanium-fabrication-services/titanium-welding-assembly.astro',
  'src/pages/titanium-fabrication-services/waterjet-cutting.astro',
  'src/pages/titanium-forming-heavy-manufacturing.astro',
  'src/pages/titanium-forming-heavy-manufacturing/raw-material-preparation-sizing.astro',
  'src/pages/titanium-forming-heavy-manufacturing/titanium-extrusion.astro',
  'src/pages/titanium-forming-heavy-manufacturing/titanium-forging.astro',
  'src/pages/titanium-surface-treatment.astro',
  'src/pages/titanium-surface-treatment/anodizing.astro',
  'src/pages/titanium-surface-treatment/chemical-passivation.astro',
  'src/pages/titanium-surface-treatment/polishing-sandblasting.astro',
];

let ok = 0, fail = 0;

function restore(f) {
  if (!fs.existsSync(f)) { return false; }
  try {
    const result = execSync(`cmd /c "git show HEAD:${f.replace(/\\/g, '/')}"`, {
      encoding: 'utf-8', timeout: 10000, maxBuffer: 50 * 1024 * 1024
    });
    if (result && result.length > 10) {
      fs.writeFileSync(f, result, 'utf-8');
      return true;
    }
  } catch(e) {}
  return false;
}

for (const f of files) {
  if (restore(f)) { console.log(`  OK: ${f}`); ok++; }
  else { console.log(`  FAIL: ${f}`); fail++; }
}

console.log(`\nOK: ${ok}, FAIL: ${fail}`);