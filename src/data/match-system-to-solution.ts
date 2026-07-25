/* ── System-to-Solution Matcher ── */
/* Maps a system's title + industry + description to the best PART_DB entry  */
/* Falls back to auto-generating from the system's own data fields           */

import { PART_DB, ALLOYS, FORMS, type PartProfile } from './part-knowledge-base';

export interface SystemData {
  title: string;
  emoji: string;
  industry: string;
  description: string;
  designPrinciples?: string[];
  engineeringTrends?: string[];
  comparisonNotes?: string;
  productEntities?: string[];
  relatedCapabilities?: string[];
  relatedStandards?: string[];
}

export interface SolutionContent {
  image: string;
  category: string;
  industries: string[];
  /* 1. Part Feature */
  geometry: string;
  painPoints: string[];
  /* 2. Material */
  alloyName: string;
  alloyReason: string;
  /* 3. Form */
  formName: string;
  formReason: string;
  /* 4. Process */
  process: string[];
  tollServices: string[];
  pitfalls: string[];
  /* 5. Procurement */
  specNote: string;
  servicePage: string;
  /* Source tracking */
  matchedFromKB: boolean;
}

/* ── Keyword matching: system → PART_DB ── */
function matchSystemToKB(sys: SystemData): PartProfile | null {
  const queryStr = `${sys.title} ${sys.industry} ${sys.description}`.toLowerCase();
  const keywords = queryStr.split(/[\s,;:/&()\-]+/).filter(Boolean);

  const scored: { profile: PartProfile; score: number }[] = [];

  for (const p of PART_DB) {
    let score = 0;
    // Match keywords
    for (const kw of keywords) {
      if (kw.length < 2) continue;
      for (const pk of p.keywords) {
        const pkLower = pk.toLowerCase();
        if (pkLower.includes(kw) || kw.includes(pkLower)) {
          score += 10;
        }
      }
      // Match industries
      for (const ind of p.industries) {
        if (ind.toLowerCase().includes(kw) || kw.includes(ind.toLowerCase())) {
          score += 5;
        }
      }
    }
    // Match system industry against KB industries
    const sysIndLower = sys.industry.toLowerCase();
    for (const ind of p.industries) {
      if (ind.toLowerCase().includes(sysIndLower) || sysIndLower.includes(ind.toLowerCase())) {
        score += 8;
      }
    }
    // Match system title words against KB category
    const catLower = p.category.toLowerCase();
    for (const kw of keywords) {
      if (kw.length > 2 && catLower.includes(kw)) {
        score += 12;
      }
    }

    if (score > 0) {
      scored.push({ profile: p, score });
    }
  }

  scored.sort((a, b) => b.score - a.score);
  return scored.length > 0 && scored[0].score >= 15 ? scored[0].profile : null;
}

/* ── Auto-generate content from system data (fallback) ── */
function generateFromSystem(sys: SystemData): SolutionContent {
  // Determine image
  const emoji = sys.emoji || '⚙️';

  // 1. Part Feature - from description
  const geometry = sys.description || `${sys.title} precision titanium components`;

  // 2. Pain Points - from description context or defaults
  const painPoints: string[] = [];
  if (sys.description.toLowerCase().includes('thread')) painPoints.push('Thread galling / wear');
  if (sys.description.toLowerCase().includes('seal') || sys.description.toLowerCase().includes('sealing')) painPoints.push('Sealing integrity under cyclic loading');
  if (sys.description.toLowerCase().includes('thin')) painPoints.push('Thin-wall machining distortion');
  if (sys.description.toLowerCase().includes('fatigue') || sys.description.toLowerCase().includes('stress')) painPoints.push('Fatigue failure under cyclic loading');
  if (sys.industry.toLowerCase().includes('medical') || sys.description.toLowerCase().includes('implant')) {
    painPoints.push('Biocompatibility and osseointegration requirements');
    painPoints.push('Sterile processing and packaging validation');
  }
  if (sys.industry.toLowerCase().includes('aerospace') || sys.description.toLowerCase().includes('aero')) {
    painPoints.push('High-cycle fatigue at elevated temperature');
    painPoints.push('Weight reduction for fuel economy');
  }
  if (sys.industry.toLowerCase().includes('chemical') || sys.industry.toLowerCase().includes('marine')) {
    painPoints.push('Corrosion resistance in aggressive media');
  }
  if (painPoints.length === 0) {
    painPoints.push('Precision dimensional tolerancing of mating features');
    painPoints.push('Surface finish consistency for functional performance');
    painPoints.push('Material traceability and certification compliance');
  }

  // 3. Material - from designPrinciples
  let alloyName = 'Grade 5 Ti-6Al-4V — General alpha-beta alloy, high strength';
  let alloyReason = 'Grade 5 (Ti-6Al-4V) offers an excellent balance of strength, corrosion resistance, and cost-effectiveness for most titanium applications.';
  if (sys.designPrinciples && sys.designPrinciples.length > 0) {
    for (const dp of sys.designPrinciples) {
      if (dp.toLowerCase().includes('grade') || dp.toLowerCase().includes('astm') || dp.toLowerCase().includes('material') || dp.toLowerCase().includes('ti-') || dp.toLowerCase().includes('cp-')) {
        // Extract material info from design principle
        const dpLower = dp.toLowerCase();
        if (dpLower.includes('eli')) { alloyName = 'Grade 23 Ti-6Al-4V ELI — Ultra-low interstitial, implant grade'; alloyReason = dp; break; }
        if (dpLower.includes('grade 5') || dpLower.includes('tc4')) { alloyName = 'Grade 5 Ti-6Al-4V — General alpha-beta alloy, high strength'; alloyReason = dp; break; }
        if (dpLower.includes('grade 2') || dpLower.includes('cp-ti')) { alloyName = 'Grade 2 CP-Ti — Industrial pure Ti, general corrosion resistance'; alloyReason = dp; break; }
        if (dpLower.includes('grade 9')) { alloyName = 'Grade 9 Ti-3Al-2.5V — Medium strength, good formability'; alloyReason = dp; break; }
        if (dpLower.includes('grade 1')) { alloyName = 'Grade 1 CP-Ti — Pure Ti, highest ductility'; alloyReason = dp; break; }
      }
    }
  }

  // 4. Form - from designPrinciples
  let formName = FORMS.bar;
  let formReason = 'Bar/rod stock is the most common raw material form, offering flexibility for CNC turning and milling operations.';
  if (sys.designPrinciples && sys.designPrinciples.length > 0) {
    for (const dp of sys.designPrinciples) {
      const dpLower = dp.toLowerCase();
      if (dpLower.includes('bar') || dpLower.includes('rod') || dpLower.includes('diameter')) {
        formName = FORMS.bar; formReason = dp; break;
      }
      if (dpLower.includes('plate') || dpLower.includes('sheet')) {
        formName = FORMS.plate; formReason = dp; break;
      }
      if (dpLower.includes('tube') || dpLower.includes('pipe') || dpLower.includes('seamless')) {
        formName = FORMS.tube; formReason = dp; break;
      }
      if (dpLower.includes('forg') || dpLower.includes('die')) {
        formName = FORMS.forging; formReason = dp; break;
      }
      if (dpLower.includes('wire')) {
        formName = FORMS.wire; formReason = dp; break;
      }
    }
  }

  // 5. Process - from engineeringTrends + relatedCapabilities
  const process: string[] = [];
  const tollServices: string[] = [];
  if (sys.engineeringTrends && sys.engineeringTrends.length > 0) {
    for (const t of sys.engineeringTrends) {
      const clean = t.replace(/^(Process|Service):\s*/i, '').trim();
      if (t.startsWith('Process:')) process.push(clean);
      else if (t.startsWith('Service:')) tollServices.push(clean);
      else process.push(clean);
    }
  }
  if (sys.relatedCapabilities && sys.relatedCapabilities.length > 0) {
    for (const cap of sys.relatedCapabilities) {
      if (!process.includes(cap)) {
        tollServices.push(cap);
      }
    }
  }
  // Fill defaults if empty
  if (process.length === 0) {
    process.push('CNC precision machining (turning / milling)');
    process.push('Surface finishing (passivation / anodizing)');
    process.push('Dimensional inspection (CMM)');
  }
  if (tollServices.length === 0) {
    tollServices.push('Material certification (EN 10204 3.1 / MIL-SPEC)');
    tollServices.push('Non-destructive testing (UT / PT / MT)');
    tollServices.push('Packaging and logistics');
  }

  // 6. Pitfalls
  const pitfalls: string[] = [
    'Titanium\'s low thermal conductivity (6.7 W/m·K) requires reduced cutting speeds and high-pressure coolant to prevent work-hardening and tool failure',
    'Surface contamination (iron, nickel) must be controlled below 0.05% per ASTM F86 — dedicated Ti-only tooling and work areas required',
  ];
  if (sys.description.toLowerCase().includes('thread') || sys.description.toLowerCase().includes('fastener')) {
    pitfalls.push('Thread rolling is mandatory over thread cutting — rolled threads provide 30% higher fatigue strength and continuous grain flow');
  }

  // 7. Procurement - from comparisonNotes
  const specNote = sys.comparisonNotes || `ASTM B348 / ASTM B265, annealed, 100% dimensional inspection + material certification`;

  // 8. Service page
  let servicePage = '/titanium-cnc-machining-services/cnc-milling-turning/';
  if (sys.relatedCapabilities && sys.relatedCapabilities.some(c => c.toLowerCase().includes('weld') || c.toLowerCase().includes('fabricat'))) {
    servicePage = '/titanium-fabrication-services/';
  }
  if (sys.relatedCapabilities && sys.relatedCapabilities.some(c => c.toLowerCase().includes('additive') || c.toLowerCase().includes('3d print') || c.toLowerCase().includes('slm'))) {
    servicePage = '/titanium-additive-manufacturing/3d-printing-slm/';
  }

  return {
    image: emoji,
    category: sys.title,
    industries: [sys.industry],
    geometry,
    painPoints,
    alloyName,
    alloyReason,
    formName,
    formReason,
    process,
    tollServices,
    pitfalls,
    specNote,
    servicePage,
    matchedFromKB: false,
  };
}

/* ── Public matching function ── */
export function getSolutionForSystem(sys: SystemData): SolutionContent {
  // First, try to match against PART_DB
  const matched = matchSystemToKB(sys);
  if (matched) {
    const alloyName = ALLOYS[matched.alloyId as keyof typeof ALLOYS] || matched.alloyId;
    const formName = FORMS[matched.formId as keyof typeof FORMS] || matched.formId;
    return {
      image: matched.image,
      category: matched.category,
      industries: matched.industries,
      geometry: matched.geometry,
      painPoints: matched.painPoints,
      alloyName,
      alloyReason: matched.alloyReason,
      formName,
      formReason: matched.formReason,
      process: matched.process,
      tollServices: matched.tollServices,
      pitfalls: matched.pitfalls,
      specNote: matched.specNote,
      servicePage: matched.servicePage,
      matchedFromKB: true,
    };
  }

  // Fallback: generate from system data
  return generateFromSystem(sys);
}
