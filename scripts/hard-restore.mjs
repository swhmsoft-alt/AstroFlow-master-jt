/**
 * Hard restore - reads file content from git using git cat-file and writes it back
 */
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

function getGitSha(filePath) {
  try {
    const result = execSync(`git ls-files -s "${filePath}"`, { 
      encoding: 'utf-8', 
      timeout: 5000,
      shell: true
    });
    const match = result.match(/^(\d+) (\w+) \d+\t/m);
    return match ? match[2] : null;
  } catch {
    return null;
  }
}

function getFileFromGit(sha) {
  try {
    const result = execSync(`git cat-file -p ${sha}`, { 
      encoding: 'utf-8', 
      timeout: 5000,
      shell: true
    });
    return result;
  } catch {
    return null;
  }
}

function restoreFile(filePath) {
  const normalizedPath = filePath.replace(/\\/g, '/');
  const sha = getGitSha(normalizedPath);
  if (!sha) {
    console.log(`  ✗ ${filePath}: No git sha found`);
    return false;
  }
  
  const content = getFileFromGit(sha);
  if (content === null) {
    console.log(`  ✗ ${filePath}: Failed to get content from git`);
    return false;
  }
  
  try {
    fs.writeFileSync(filePath, content, 'utf-8');
    console.log(`  ✓ ${filePath}`);
    return true;
  } catch (err) {
    console.log(`  ✗ ${filePath}: Write error - ${err.message.substring(0, 60)}`);
    return false;
  }
}

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

console.log('Restoring files from git HEAD...\n');
let restored = 0;
let failed = 0;

files.forEach(file => {
  if (restoreFile(file)) restored++;
  else failed++;
});

console.log(`\nRestored: ${restored}, Failed: ${failed}`);