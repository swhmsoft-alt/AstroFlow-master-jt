/**
 * Fixes all issues introduced by the bad translation script.
 * 
 * Issues to fix:
 * 1. CSS/Tailwind class values wrapped in t() - revert to original strings
 * 2. Type annotations using t() - revert to original type literal
 * 3. t() call before t is defined - move import block up
 * 4. Literal strings like 'button' wrapped in t()
 * 
 * We do this by reverting the problematic parts using git.
 */

import { execSync } from 'child_process';
import fs from 'fs';

// Get all modified files
let modifiedFiles;
try {
  const result = execSync('git diff --name-only HEAD', { encoding: 'utf-8', timeout: 10000 });
  modifiedFiles = result.trim().split('\n').filter(Boolean);
} catch (e) {
  console.error('Failed to get modified files:', e.message);
  process.exit(1);
}

console.log(`Found ${modifiedFiles.length} modified files\n`);

// These files had the wrong kind of t() calls (CSS classes, type annotations, etc.)
// We need to restore their original versions from git
const PROBLEMATIC_FILES = [
  'src/components/ui/Button.astro',
  'src/components/ui/TestimonialCard.astro',
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

// Also revert ui.ts changes since the dictionary entries are wrong for CSS classes
const UI_TS = 'src/i18n/ui.ts';

// Count modified files
const filesToRevert = modifiedFiles.filter(f => 
  !f.startsWith('scripts/') && !f.startsWith('temp/') && !f.startsWith('node_modules/')
);

console.log(`Files to potentially revert: ${filesToRevert.length}\n`);

// Use git show to get the original content of each problematic file
// and restore it
let restored = 0;
let failed = 0;

filesToRevert.forEach(file => {
  if (!fs.existsSync(file)) return;
  
  // For .astro, .tsx, and ui.ts files, restore from git HEAD
  if (file.endsWith('.astro') || file.endsWith('.tsx') || file === 'src/i18n/ui.ts') {
    try {
      const originalContent = execSync(`git show HEAD:"${file}"`, { encoding: 'utf-8', timeout: 5000 });
      fs.writeFileSync(file, originalContent, 'utf-8');
      console.log(`  ✓ Restored: ${file}`);
      restored++;
    } catch (e) {
      console.log(`  ✗ Failed to restore ${file}: ${e.message.substring(0, 50)}`);
      failed++;
    }
  }
});

console.log(`\nRestored ${restored} files, ${failed} failed`);
console.log('\nNow run: node scripts/translate-hardcoded-text.mjs --apply');