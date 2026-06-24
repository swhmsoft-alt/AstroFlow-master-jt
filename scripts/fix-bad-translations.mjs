/**
 * Fix bad translations introduced by the script.
 * Fixes these specific issues:
 * 1. t() in type annotations (e.g., `variant?: t('ui.button.primary')`)
 * 2. t() for Tailwind/CSS class values that shouldn't be translated
 * 3. When t() is used before the `t` variable is defined (import block at wrong position)
 * 4. Literal strings like 'button' wrapped in t()
 */

import fs from 'fs';
import { execSync } from 'child_process';

// Get files modified by the translation script
let modifiedFiles;
try {
  const result = execSync('git diff --name-only HEAD', { 
    encoding: 'utf-8', timeout: 10000, shell: 'cmd.exe' 
  });
  modifiedFiles = result.trim().split('\n').filter(Boolean);
} catch {
  modifiedFiles = [];
}

console.log(`Found ${modifiedFiles.length} modified files\n`);

// Helper: get original content from git
function getOriginal(file) {
  try {
    // Use cmd /c to avoid PowerShell escaping issues
    const result = execSync(`git show HEAD:${file.replace(/\\/g, '/')}`, {
      encoding: 'utf-8', timeout: 10000, shell: 'cmd.exe'
    });
    return result;
  } catch {
    return null;
  }
}

// These files had t() injected in CSS class values or type annotations
const BAD_FILES = {
  // Keys: file paths to fix
  // Values: 'restore' = restore from git completely, 'fix' = only fix issues
  'src/components/ui/Button.astro': 'restore',
  'src/components/ui/Card.astro': 'restore',
  'src/components/ui/Section.astro': 'restore',
  'src/components/Header.astro': 'restore',
  'src/components/home/MaterialMatrix.astro': 'restore',
  'src/components/home/PremiumCTA.astro': 'restore',
  'src/components/home/PremiumHero.astro': 'restore',
  'src/components/home/StatsShowcase.astro': 'restore',
  'src/components/home/TechnicalCapabilities.astro': 'restore',
  'src/components/home/TechnologyInnovation.astro': 'restore',
  'src/components/home/Testimonials.astro': 'restore',
  'src/components/react/CADUpload.tsx': 'restore',
  'src/components/react/MobileMenu.tsx': 'restore',
  'src/components/react/RFQForm.tsx': 'restore',
  'src/components/resources/EngineeringDownloads.astro': 'restore',
  'src/components/resources/FeaturedInsights.astro': 'restore',
  'src/components/resources/ResourceHubMatrix.astro': 'restore',
  'src/components/resources/TechnicalFaqAccordion.astro': 'restore',
  'src/components/services/AdditiveBatchCta.astro': 'restore',
  'src/components/services/AdditiveDedicatedCta.astro': 'restore',
  'src/components/services/AnodizingDedicatedCta.astro': 'restore',
  'src/components/services/AssemblyDedicatedCta.astro': 'restore',
  'src/components/services/ComponentDedicatedCta.astro': 'restore',
  'src/components/services/ExtrusionDedicatedCta.astro': 'restore',
  'src/components/services/FabDedicatedCta.astro': 'restore',
  'src/components/services/ForgingDedicatedCta.astro': 'restore',
  'src/components/services/HeavyDedicatedCta.astro': 'restore',
  'src/components/services/LaserDedicatedCta.astro': 'restore',
  'src/components/services/MarkingDedicatedCta.astro': 'restore',
  'src/components/services/MultiAxisCta.astro': 'restore',
  'src/components/services/PackagingDedicatedCta.astro': 'restore',
  'src/components/services/PassivationDedicatedCta.astro': 'restore',
  'src/components/services/PrepDedicatedCta.astro': 'restore',
  'src/components/services/RapidPrototypeCta.astro': 'restore',
  'src/components/services/ServiceMatrixGrid.astro': 'restore',
  'src/components/services/SlmDedicatedCta.astro': 'restore',
  'src/components/services/SurfaceDedicatedCta.astro': 'restore',
  'src/components/services/TexturingDedicatedCta.astro': 'restore',
  'src/components/services/TurnMillDedicatedCta.astro': 'restore',
  'src/components/services/WaterjetDedicatedCta.astro': 'restore',
  'src/components/services/WireEdmDedicatedCta.astro': 'restore',
  'src/pages/blog/[...slug].astro': 'restore',
  'src/pages/branded-custom-packaging-services.astro': 'restore',
  'src/pages/laser-marking-custom-logo.astro': 'restore',
  'src/pages/products/[...slug].astro': 'restore',
  'src/pages/products/index.astro': 'restore',
  'src/pages/rfq.astro': 'restore',
  'src/pages/titanium-additive-manufacturing.astro': 'restore',
  'src/pages/titanium-additive-manufacturing/3d-printing-slm.astro': 'restore',
  'src/pages/titanium-additive-manufacturing/low-volume-production.astro': 'restore',
  'src/pages/titanium-additive-manufacturing/rapid-prototyping.astro': 'restore',
  'src/pages/titanium-cnc-machining-services.astro': 'restore',
  'src/pages/titanium-cnc-machining-services/3-5-axis-cnc-machining.astro': 'restore',
  'src/pages/titanium-cnc-machining-services/cnc-milling-turning.astro': 'restore',
  'src/pages/titanium-cnc-machining-services/custom-industrial-components.astro': 'restore',
  'src/pages/titanium-cnc-machining-services/wire-edm-machining.astro': 'restore',
  'src/pages/titanium-fabrication-services.astro': 'restore',
  'src/pages/titanium-fabrication-services/laser-cutting.astro': 'restore',
  'src/pages/titanium-fabrication-services/titanium-welding-assembly.astro': 'restore',
  'src/pages/titanium-fabrication-services/waterjet-cutting.astro': 'restore',
  'src/pages/titanium-forming-heavy-manufacturing.astro': 'restore',
  'src/pages/titanium-forming-heavy-manufacturing/raw-material-preparation-sizing.astro': 'restore',
  'src/pages/titanium-forming-heavy-manufacturing/titanium-extrusion.astro': 'restore',
  'src/pages/titanium-forming-heavy-manufacturing/titanium-forging.astro': 'restore',
  'src/pages/titanium-surface-treatment.astro': 'restore',
  'src/pages/titanium-surface-treatment/anodizing.astro': 'restore',
  'src/pages/titanium-surface-treatment/chemical-passivation.astro': 'restore',
  'src/pages/titanium-surface-treatment/polishing-sandblasting.astro': 'restore',
  'src/i18n/ui.ts': 'restore',
};

let restored = 0;
let failed = 0;

Object.entries(BAD_FILES).forEach(([file, action]) => {
  if (!fs.existsSync(file)) {
    console.log(`  SKIP (not found): ${file}`);
    return;
  }
  
  if (action === 'restore') {
    const original = getOriginal(file);
    if (original !== null) {
      try {
        fs.writeFileSync(file, original, 'utf-8');
        console.log(`  ✓ RESTORED: ${file}`);
        restored++;
      } catch (err) {
        console.log(`  ✗ ${file}: ${err.message.substring(0, 60)}`);
        failed++;
      }
    } else {
      console.log(`  ✗ ${file}: Could not get original from git`);
      failed++;
    }
  }
});

console.log(`\nRestored: ${restored}, Failed: ${failed}`);
console.log('\nNow run: node scripts/translate-hardcoded-text.mjs --apply');