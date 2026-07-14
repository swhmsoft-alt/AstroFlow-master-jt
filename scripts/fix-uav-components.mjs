import fs from 'fs';

// Fix UavImpactSection - add t() calls
function fixImpact() {
  let c = fs.readFileSync('src/components/industries/uav-drones/UavImpactSection.astro', 'utf8');
  
  c = c.replace(
    'Impact &amp; Fatigue Resistance',
    "{t('industries.uav.impact.badge')}"
  );
  
  c = c.replace(
    /<span style="color: var\(--theme-primary\);">Impact &amp; Fracture Toughness<\/span> — Grade 5 Titanium Outperforms Aluminum 7075 and Carbon Fiber/,
    '<span style="color: var(--theme-primary);">{t(\'industries.uav.impact.title.main\')}</span> — {t(\'industries.uav.impact.title.suffix\')}'
  );
  
  c = c.replace(
    'Titanium components evaluated for fracture toughness to withstand high-G deceleration events and field impacts without catastrophic failure',
    "{t('industries.uav.impact.desc')}"
  );
  
  c = c.replace(
    'Entity Cluster:',
    "{t('industries.uav.impact.entityLabel')}:"
  );
  
  fs.writeFileSync('src/components/industries/uav-drones/UavImpactSection.astro', c, 'utf8');
  console.log('Impact: fixed');
}

// Fix UavComplianceSection
function fixCompliance() {
  let c = fs.readFileSync('src/components/industries/uav-drones/UavComplianceSection.astro', 'utf8');
  
  c = c.replace(
    'Material Certification',
    "{t('industries.uav.compliance.badge')}"
  );
  
  c = c.replace(
    /100% <span style="color: var\(--theme-primary\);">Material Traceability<\/span> — EN 10204 3\.1 MTR &amp; Metallurgical Uniformity for Airborne Components/,
    '100% <span style="color: var(--theme-primary);">{t(\'industries.uav.compliance.title.main\')}</span> — {t(\'industries.uav.compliance.title.suffix\')}'
  );
  
  c = c.replace(
    'Every UAV component is backed by EN 10204 3.1 Mill Test Reports certifying chemical composition and mechanical properties',
    "{t('industries.uav.compliance.desc')}"
  );
  
  c = c.replace(
    'EN 10204 3.1 Mill Test Reports',
    "{t('industries.uav.compliance.pillar1.title')}"
  );
  
  c = c.replace(
    'Every batch of Grade 5 Titanium is certified with EN 10204 Type 3.1 documentation',
    "{t('industries.uav.compliance.pillar1.desc')}"
  );
  
  c = c.replace(
    'CMM Dimensional Validation',
    "{t('industries.uav.compliance.pillar2.title')}"
  );
  
  c = c.replace(
    'All UAV structural components receive CMM dimensional inspection per engineering drawings with ZEISS CMM platforms',
    "{t('industries.uav.compliance.pillar2.desc')}"
  );
  
  c = c.replace(
    'Entity Cluster:',
    "{t('industries.uav.compliance.entityLabel')}:"
  );
  
  fs.writeFileSync('src/components/industries/uav-drones/UavComplianceSection.astro', c, 'utf8');
  console.log('Compliance: fixed');
}

fixImpact();
fixCompliance();
