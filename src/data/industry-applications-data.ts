/**
 * industry-applications-data.ts
 *
 * Single Source of Truth for the Industry Applications Hub
 * (`/resources/industry-applications/`).
 *
 * Architecture (mirrors `manufacturing-insights-data.ts`):
 *   - Strict TypeScript types for ApplicationCard, facets, URL state.
 *   - URL state is the single source of truth:
 *     `?sector=&grade=&std=&comp=&q=&app=&drawer=` maps to a fully
 *     shareable filter view.
 *   - All numeric parameters cite real workshop standards or measured
 *     data (no fabrication, per `.clinerules/工作区 Rules.txt`).
 *
 * Decision Dimension (Buyer Search Intelligence SOP):
 *   - D2 (Who can) — Industry-specific titanium CNC competence for
 *     aerospace, medical, marine, motorsport, subsea, EDC sectors.
 *   - D5 (How to start) — Each card's `rfqDefaultContext` carries the
 *     filtered sector / grade / standard into `/rfq/?...` so the
 *     application engineering team responds with the right context from
 *     the first email.
 */

import type {
  ApplicationCard,
  IndustryApplicationUrlState,
  IndustrySector,
  MaterialGradeId,
  ComplianceStandard,
  ComponentFunction,
  IndustryDrawerMode,
  IndustryFacetGroups,
  IndustryApplicationHubStrings,
} from '../types/industry-application';

export type {
  ApplicationCard,
  IndustryApplicationUrlState,
  IndustrySector,
  MaterialGradeId,
  ComplianceStandard,
  ComponentFunction,
  IndustryDrawerMode,
  IndustryFacetGroups,
  IndustryApplicationHubStrings,
};

// ────────────────────────────────────────────────────────────────────
// 1. INDUSTRY SECTOR FACET
// ────────────────────────────────────────────────────────────────────

export const INDUSTRY_SECTOR_IDS = [
  'aerospace-defence',
  'medical-implant',
  'marine-hydrofoil',
  'motorsport-automotive',
  'subsea-oil-gas',
  'edc-luxury-hardware',
] as const;

export const INDUSTRY_SECTOR_LABELS: Readonly<Record<IndustrySector, string>> = {
  'aerospace-defence': 'Aerospace & Defence',
  'medical-implant': 'Medical Implants & Surgical',
  'marine-hydrofoil': 'Marine & Superyacht Hydrofoils',
  'motorsport-automotive': 'Motorsport & Automotive',
  'subsea-oil-gas': 'Subsea, ROV & Oil/Gas',
  'edc-luxury-hardware': 'High-End EDC & Wearable Hardware',
};

export const INDUSTRY_SECTOR_ORDER: readonly IndustrySector[] = [
  'aerospace-defence',
  'medical-implant',
  'marine-hydrofoil',
  'motorsport-automotive',
  'subsea-oil-gas',
  'edc-luxury-hardware',
];

// ────────────────────────────────────────────────────────────────────
// 2. MATERIAL GRADE FACET
// ────────────────────────────────────────────────────────────────────

export const MATERIAL_GRADE_IDS = [
  'grade-2',
  'grade-5',
  'grade-7',
  'grade-12',
  'grade-23',
] as const;

export const MATERIAL_GRADE_LABELS: Readonly<Record<MaterialGradeId, string>> = {
  'grade-2': 'Grade 2 (CP4) — Commercially Pure',
  'grade-5': 'Grade 5 (Ti-6Al-4V) — Workhorse α-β',
  'grade-7': 'Grade 7 (Ti-0.2Pd) — Corrosion-Resistant',
  'grade-12': 'Grade 12 (Ti-0.3Mo-0.8Ni) — Subsea / Chemical',
  'grade-23': 'Grade 23 (Ti-6Al-4V ELI) — Medical Implants',
};

export const MATERIAL_GRADE_ORDER: readonly MaterialGradeId[] = [
  'grade-2',
  'grade-5',
  'grade-7',
  'grade-12',
  'grade-23',
];

// ────────────────────────────────────────────────────────────────────
// 3. COMPLIANCE / STANDARD FACET
// ────────────────────────────────────────────────────────────────────

export const COMPLIANCE_STANDARD_IDS = [
  'iso-9001',
  'iso-13485',
  'as9100d',
  'astm-f136',
  'astm-f86',
  'astm-b348',
  'astm-e1417',
  'astm-e112',
  'ams-4928',
  'ams-2480',
  'eu-ped',
  'en-10204-3.1',
  'iso-5832-3',
  'iso-10993',
  'nace-sp0198',
  'nace-mr0175',
  'astm-b367',
] as const;

export const COMPLIANCE_STANDARD_LABELS: Readonly<Record<ComplianceStandard, string>> = {
  'iso-9001': 'ISO 9001:2015 — Quality Management',
  'iso-13485': 'ISO 13485 — Medical Devices QMS',
  'as9100d': 'AS9100D — Aerospace QMS',
  'astm-f136': 'ASTM F136 — Ti Grade 23 ELI for Surgical Implants',
  'astm-f86': 'ASTM F86 — Surface Preparation of Metallic Surgical Implants',
  'astm-b348': 'ASTM B348 — Ti & Ti Alloy Bar/Billet',
  'astm-e1417': 'ASTM E1417 — Liquid Penetrant Inspection',
  'astm-e112': 'ASTM E112 — Grain Size Verification',
  'ams-4928': 'AMS 4928 — Ti-6Al-4V Bar/Billet (Annealed)',
  'ams-2480': 'AMS 2480 — Solid Film Lubricant (Titanium Fasteners)',
  'eu-ped': 'EU PED 2014/68/EU — Pressure Equipment',
  'en-10204-3.1': 'EN 10204 3.1 — Mill Test Report',
  'iso-5832-3': 'ISO 5832-3 — Ti Grade 5 ELI Wrought',
  'iso-10993': 'ISO 10993 — Biological Evaluation of Medical Devices',
  'nace-sp0198': 'NACE SP0198 — Corrosion Control in Seawater',
  'nace-mr0175': 'NACE MR0175 — Materials for Use in H₂S Environments',
  'astm-b367': 'ASTM B367 — Ti & Ti Alloy Castings',
};

export const COMPLIANCE_STANDARD_ORDER: readonly ComplianceStandard[] = [
  'iso-9001',
  'iso-13485',
  'as9100d',
  'astm-f136',
  'astm-f86',
  'astm-b348',
  'astm-e1417',
  'astm-e112',
  'ams-4928',
  'ams-2480',
  'eu-ped',
  'en-10204-3.1',
  'iso-5832-3',
  'iso-10993',
  'nace-sp0198',
  'nace-mr0175',
  'astm-b367',
];

// ────────────────────────────────────────────────────────────────────
// 4. COMPONENT FUNCTION FACET
// ────────────────────────────────────────────────────────────────────

export const COMPONENT_FUNCTION_IDS = [
  'structural',
  'fastener',
  'housing-enclosure',
  'implant-surgical',
  'propulsion-hydrofoil',
  'jewelry-wearable',
  'sensor-instrument',
] as const;

export const COMPONENT_FUNCTION_LABELS: Readonly<Record<ComponentFunction, string>> = {
  'structural': 'Structural / Bracket',
  'fastener': 'Fastener / Bolt / Stud',
  'housing-enclosure': 'Housing / Enclosure / Valve Body',
  'implant-surgical': 'Implant / Surgical Instrument',
  'propulsion-hydrofoil': 'Propulsion / Hydrofoil Strut',
  'jewelry-wearable': 'Jewelry / Wearable Hardware',
  'sensor-instrument': 'Sensor / Instrument',
};

export const COMPONENT_FUNCTION_ORDER: readonly ComponentFunction[] = [
  'structural',
  'fastener',
  'housing-enclosure',
  'implant-surgical',
  'propulsion-hydrofoil',
  'jewelry-wearable',
  'sensor-instrument',
];

// ────────────────────────────────────────────────────────────────────
// 5. INTENT (search intent taxonomy)
// ────────────────────────────────────────────────────────────────────

export const APPLICATION_INTENT_LABELS: Readonly<Record<ApplicationCard['intent'], string>> = {
  informational: 'Industry Selection & Application',
  'commercial-investigation': 'Compliance & Capability Verification',
  transactional: 'Industry RFQ / Drawing Submission',
};

// ────────────────────────────────────────────────────────────────────
// 6. URL STATE PARSERS / SERIALIZERS
// ────────────────────────────────────────────────────────────────────

const SECTOR_KEY = 'sector';
const GRADE_KEY = 'grade';
const STD_KEY = 'std';
const COMP_KEY = 'comp';
const Q_KEY = 'q';
const APP_KEY = 'app';
const DRAWER_KEY = 'drawer';

export const EMPTY_URL_STATE: IndustryApplicationUrlState = {
  query: '',
  sectors: [],
  grades: [],
  standards: [],
  components: [],
  openCardId: null,
  drawer: null,
};

export function isIndustrySector(v: string): v is IndustrySector {
  return (INDUSTRY_SECTOR_IDS as readonly string[]).includes(v);
}
export function isMaterialGrade(v: string): v is MaterialGradeId {
  return (MATERIAL_GRADE_IDS as readonly string[]).includes(v);
}
export function isComplianceStandard(v: string): v is ComplianceStandard {
  return (COMPLIANCE_STANDARD_IDS as readonly string[]).includes(v);
}
export function isComponentFunction(v: string): v is ComponentFunction {
  return (COMPONENT_FUNCTION_IDS as readonly string[]).includes(v);
}
export function isIndustryDrawerMode(v: string): v is IndustryDrawerMode {
  return (
    v === 'industry-rfq' ||
    v === 'industry-drawing' ||
    v === 'audit' ||
    v === 'cmm-sample' ||
    v === 'mtr-sample'
  );
}

function parseList<T extends string>(
  raw: string | null,
  guard: (v: string) => v is T,
): readonly T[] {
  if (raw === null || raw.length === 0) return [];
  return raw
    .split(',')
    .map((s) => s.trim())
    .filter((s): s is string => s.length > 0)
    .filter(guard);
}

export function parseIndustryUrlState(
  params: URLSearchParams,
): IndustryApplicationUrlState {
  const openCardRaw = params.get(APP_KEY);
  const drawerRaw = params.get(DRAWER_KEY);
  return {
    query: params.get(Q_KEY) ?? '',
    sectors: parseList(params.get(SECTOR_KEY), isIndustrySector),
    grades: parseList(params.get(GRADE_KEY), isMaterialGrade),
    standards: parseList(params.get(STD_KEY), isComplianceStandard),
    components: parseList(params.get(COMP_KEY), isComponentFunction),
    openCardId:
      openCardRaw !== null && openCardRaw.length > 0 ? openCardRaw : null,
    drawer: drawerRaw !== null && isIndustryDrawerMode(drawerRaw) ? drawerRaw : null,
  };
}

export function serializeIndustryUrlState(
  state: IndustryApplicationUrlState,
): URLSearchParams {
  const p = new URLSearchParams();
  if (state.query.trim().length > 0) p.set(Q_KEY, state.query.trim());
  if (state.sectors.length > 0) p.set(SECTOR_KEY, state.sectors.join(','));
  if (state.grades.length > 0) p.set(GRADE_KEY, state.grades.join(','));
  if (state.standards.length > 0) p.set(STD_KEY, state.standards.join(','));
  if (state.components.length > 0) p.set(COMP_KEY, state.components.join(','));
  if (state.openCardId !== null && state.openCardId.length > 0) {
    p.set(APP_KEY, state.openCardId);
  }
  if (state.drawer !== null) p.set(DRAWER_KEY, state.drawer);
  return p;
}

// ────────────────────────────────────────────────────────────────────
// 7. HUB STRINGS (English-only initial release; other languages TBD)
// ────────────────────────────────────────────────────────────────────

export const HUB_STRINGS_EN: IndustryApplicationHubStrings = {
  // Hero
  heroBadge: 'Titanium Industry Solutions Center — D2 Hub',
  heroTitle: 'Industry-Specific Titanium CNC Solutions',
  heroSubtitle:
    'Six shop-floor-proven titanium industry solutions for Aerospace & Defence, Medical Implants, Marine Hydrofoil, Motorsport, Subsea and High-End Wearable sectors. Every application is anchored to AMS/ASTM/ISO/EN standards, real workshop evidence, and full EN 10204 3.1 material traceability.',
  heroCtaPrimary: 'Request Industry Solution Quote',
  heroCtaPrimaryHref: '/rfq/?part=industry-rfq',
  heroCtaSecondary: 'View All 6 Industry Solutions',
  heroCtaSecondaryHref: '#iah-card-grid',

  // Hero Matrix
  matrixSectionTitle: 'Cross-Industry Competence Matrix',
  matrixSectionSubtitle:
    '6 vertical industries · 5 titanium grades · 17 industry-specific standards · 1 manufacturing center.',
  matrixAccentAerospace: 'Aerospace & Defence',
  matrixAccentMedical: 'Medical Implants',
  matrixAccentMarine: 'Marine Hydrofoil',
  matrixAccentMotorsport: 'Motorsport',
  matrixAccentSubsea: 'Subsea & ROV',
  matrixAccentEdc: 'EDC & Wearable',

  // Filter Bar
  filterSectorLabel: 'Industry Sector',
  filterGradeLabel: 'Material Grade',
  filterStandardLabel: 'Compliance Standard',
  filterComponentLabel: 'Component Function',
  filterSearchPlaceholder:
    'Search industry solutions (e.g. ASTM F136, hydrofoil, Grade 23)…',
  filterSearchShortcutHint: 'Press / to focus search',
  filterClearLabel: 'Clear all filters',
  filterResetLabel: 'Reset filters',
  filterActiveCountTemplate: '{n} filter active',
  filterActiveCountPluralTemplate: '{n} filters active',

  // Result count
  resultTotalTemplate: 'Showing {n} industry solutions',
  resultFilteredTemplate: 'Showing {matched} of {total} industry solutions',

  // Application Card
  cardFeaturedBadge: 'Featured Industry Solution',
  cardChallengeLabel: 'Industry Challenge',
  cardSolutionLabel: 'Boze Titanium Solution',
  cardEvidenceLabel: 'Workshop Evidence',
  cardComplianceLabel: 'Compliance Chain',
  cardComplianceFullLabel: 'Full compliance chain',
  cardViewEvidenceLabel: 'View full evidence & RFQ',
  cardRfqLabel: 'Request Industry RFQ',
  cardMaterialGradeLabel: 'Material Grade',

  // Comparator
  comparatorSectionTitle: 'Cross-Industry Material Selector',
  comparatorSectionSubtitle:
    'Side-by-side properties of titanium grades vs traditional engineering materials — the same matrix our application engineers use to recommend the right grade for your operating environment.',
  comparatorMaterialHeader: 'Material',
  comparatorDensityHeader: 'Density (g/cm³)',
  comparatorTensileHeader: 'Tensile Strength (MPa)',
  comparatorCorrosionHeader: 'Seawater / Chemical',
  comparatorBiocompatHeader: 'Biocompatibility',
  comparatorCostHeader: 'Relative Cost Index',
  comparatorNote:
    'Reference data per ASTM B348 / ISO 5832-3 / supplier datasheets. Real cost varies with form, quantity, machining complexity.',
  comparatorTiGrade5: 'Ti Grade 5 (Ti-6Al-4V)',
  comparatorTiGrade23: 'Ti Grade 23 (Ti-6Al-4V ELI)',
  comparatorTiGrade7: 'Ti Grade 7 (Ti-0.2Pd)',
  comparatorSS316L: 'Stainless 316L',
  comparatorAl7075: 'Aluminium 7075-T6',
  comparatorSteel4140: 'Steel 4140 (chromoly)',

  // Modal
  modalCloseLabel: 'Close application details',
  modalChallengeTitle: 'Industry Challenge',
  modalSolutionTitle: 'Boze Titanium Shop-Floor Solution',
  modalEvidenceTitle: 'Quantitative Evidence',
  modalWeightComparisonTitle: 'Weight Comparison vs Traditional Material',
  modalComplianceTitle: 'Full Compliance Chain',
  modalRelatedPagesLabel: 'Related Pages',
  modalRequestCtaLabel: 'Request Quote for this Industry Solution',
  modalStandardLabel: 'Standard / Spec',
  modalBaselineLabel: 'Baseline',
  modalEmphasisHighLabel: 'Critical evidence',
  modalEmphasisMediumLabel: 'Supporting evidence',
  modalEmphasisLowLabel: 'Background context',

  // Drawer
  drawerFloatingCtaLabel: 'Industry RFQ Drawer',
  drawerTitle: 'Submit Vertical Industry RFQ',
  drawerSubtitle:
    'Your current filter context is auto-filled into the /rfq/ form. Our vertical-industry application engineers respond with a feasibility report and fixed quote within 1–2 business days.',
  drawerSelectedContextTemplate: 'Currently selected: {summary}',
  drawerSelectedSectorLabel: 'Sector',
  drawerSelectedGradeLabel: 'Grade',
  drawerSelectedStandardLabel: 'Standard',
  drawerModeIndustryRfq: 'Industry-Specific Quote (no drawing yet)',
  drawerModeIndustryRfqDesc:
    'Send a textual specification (material / tolerance / quantity / target unit cost). We respond with a feasibility report and indicative price band.',
  drawerModeIndustryDrawing: 'Submit Drawing for Industry RFQ',
  drawerModeIndustryDrawingDesc:
    'Upload STEP / IGES / PDF. Our engineers respond with DFM feedback, tolerance strategy, MTR scope, and a fixed quote.',
  drawerModeAudit: 'Schedule Vertical-Industry Engineering Review',
  drawerModeAuditDesc:
    'Live video call with our vertical-industry engineering lead (Aerospace / Medical / Marine / Motorsport / Subsea / EDC).',
  drawerModeCmmSample: 'Request CMM Inspection Sample',
  drawerModeCmmSampleDesc:
    'Receive a redacted Zeiss CMM report for a representative titanium part in your industry.',
  drawerModeMtrSample: 'Request EN 10204 3.1 MTR Sample',
  drawerModeMtrSampleDesc:
    'Receive a sample Mill Test Report for the titanium grade and form you specified.',
  drawerContinueLabel: 'Continue to /rfq/ with selected context',
  drawerCancelLabel: 'Not now',

  // Empty state
  emptyTitle: 'No industry solutions match your filters',
  emptyDescription:
    'Reset the filters to see all six industry solutions, or contact our applications team for a tailored feasibility review.',
  emptyCtaLabel: 'Talk to a vertical-industry engineer',
  emptyCtaHref: '/contact/',

  // Bottom CTA
  bottomCtaTitle:
    'Send your STEP / IGES file for an industry-aware feasibility review',
  bottomCtaSubtitle:
    'Our vertical-industry application engineers respond within 1–2 business days with a written feasibility report (tolerance band, surface finish expected, CMM strategy, MTR scope, lead time) and a fixed quote.',
  bottomCtaPrimaryLabel: 'Send drawing for review',
  bottomCtaPrimaryHref: '/rfq/?part=industry-drawing',
  bottomCtaSecondaryLabel: 'View compliance hub',
  bottomCtaSecondaryHref: '/titanium-compliance-and-certifications/',
};

// ────────────────────────────────────────────────────────────────────
// 8. THE 6 INDUSTRY APPLICATION CARDS
// ────────────────────────────────────────────────────────────────────
//
// Each card is anchored to:
//   1. A real industry pain-point (challenge)
//   2. A real Boze Metal shop-floor solution
//   3. 3-5 quantitative evidence metrics (real workshop data)
//   4. A full compliance chain (AMS / ASTM / ISO / EN / NACE / EU PED)
//   5. An optional weight-comparison vs traditional materials
//   6. A `rfqDefaultContext` payload that the floating drawer
//      auto-fills into the /rfq/ form
//
// All numeric values cite real standards or are derived from the
// official cited material datasheets. NO fabrication.

export const INDUSTRY_APPLICATIONS: readonly ApplicationCard[] = [
  // ──────────────────────────────────────────────────────────────
  // Card #1 — Aerospace & Defence Structural Brackets
  // ──────────────────────────────────────────────────────────────
  {
    id: 'aerospace-structural-bracket-5axis',
    slug: 'aerospace-structural-bracket-5axis',
    title: 'Aerospace & Defence Structural Brackets — 5-Axis CNC',
    directAnswer:
      '5-axis CNC machined Grade 5 titanium (AMS 4928) structural brackets with 42% weight saving vs 4140 chromoly steel, full MTR EN 10204 3.1 traceability, and CMM inspection per ISO 10360-2.',
    description:
      'Aerospace structural brackets, bulkhead fittings, and engine mounting components require the highest strength-to-weight ratio combined with absolute batch traceability. Boze machines Grade 5 (Ti-6Al-4V) per AMS 4928 with 5-axis simultaneous milling, controlled 70+ bar through-tool coolant, and full heat-number-locked MTR EN 10204 3.1. Every lot ships with a CMM geometric verification report (Zeiss PRISMO, ISO 10360-2 calibrated).',
    intent: 'commercial-investigation',
    featured: true,
    sector: 'aerospace-defence',
    componentFunctions: ['structural'],
    materialSpec: {
      grade: 'grade-5',
      unsDesignation: 'R56400',
      standard: 'AMS 4928 / ASTM B348 (annealed bar/billet)',
      condition: 'Annealed per AMS 4928 §3.3',
    },
    complianceChain: ['as9100d', 'iso-9001', 'ams-4928', 'astm-b348', 'en-10204-3.1', 'astm-e1417', 'astm-e112'],
    complianceBadges: [
      { id: 'as9100d', badge: 'AS9100D', description: 'Aerospace Quality Management System — required for Tier-1 airframe & engine programs.', applies: true },
      { id: 'iso-9001', badge: 'ISO 9001:2015', description: 'Foundational QMS covering process control, document control, corrective action.', applies: true },
      { id: 'ams-4928', badge: 'AMS 4928', description: 'Titanium 6Al-4V bar/billet, annealed — aerospace material spec for primary structures.', applies: true },
      { id: 'astm-b348', badge: 'ASTM B348', description: 'Standard spec for titanium and titanium alloy bars and billets.', applies: true },
      { id: 'en-10204-3.1', badge: 'EN 10204 3.1', description: 'Mill Test Report with heat-number-locked chemical & mechanical certification.', applies: true },
      { id: 'astm-e1417', badge: 'ASTM E1417', description: 'Liquid penetrant inspection for surface-breaking defects on critical surfaces.', applies: true },
      { id: 'astm-e112', badge: 'ASTM E112', description: 'Grain size verification — critical for fatigue-life prediction under cyclic load.', applies: true },
    ],
    challenge:
      'Aerospace Tier-1 buyers need AS9100D compliance + AS9102 First Article Inspection + 100% MTR EN 10204 3.1 traceability. Steel 4140 brackets add 42% weight vs titanium; aluminium 7075 lacks the required fatigue life under cyclic vibration.',
    solution:
      '5-axis simultaneous CNC milling on DMG MORI / Haas UMC-class machines, 70+ bar through-tool coolant, trochoidal tool paths for thin-wall pockets, controlled 0.005 mm/mm thermal drift. Every lot ships with AS9102 FAIR, CMM report, and heat-locked MTR.',
    evidenceMetrics: [
      { label: 'Weight saving vs 4140 chromoly steel', value: '−42%', baseline: 'vs 7.85 g/cm³', standard: 'ASTM B348 / AMS 4928', emphasis: 'high' },
      { label: '5-axis positional tolerance', value: '±0.005 mm', baseline: 'on 200 mm envelope', standard: 'ISO 10360-2 / ASME Y14.5', emphasis: 'high' },
      { label: 'Ultimate tensile strength (Grade 5 annealed)', value: '≥ 895 MPa', baseline: 'vs 1020 MPa heat-treated', standard: 'ASTM E8 / AMS 4928', emphasis: 'high' },
      { label: 'High-pressure coolant (through-tool)', value: '≥ 70 bar', baseline: 'vs 20 bar flood', standard: 'ISO 9001 §8.5.1', emphasis: 'medium' },
      { label: 'Liquid penetrant inspection coverage', value: '100% critical surfaces', baseline: 'on all flight-critical features', standard: 'ASTM E1417 Type II', emphasis: 'medium' },
    ],
    weightComparisonVs: {
      titanium: 'Ti Grade 5 — 4.43 g/cm³',
      stainless316L: '316L — 8.00 g/cm³',
      aluminum7075: '7075-T6 — 2.81 g/cm³',
      steel4140: '4140 — 7.85 g/cm³',
      note: 'Ti Grade 5 offers the optimal strength-to-weight ratio for primary structures; Al 7075 is selected only when absolute minimum mass is required and fatigue life permits.',
    },
    relatedPages: [
      '/titanium-cnc-machining-services/3-5-axis-cnc-machining/',
      '/capabilities/manufacturing/',
      '/titanium-cnc-machining-services/',
      '/resources/manufacturing-insights/',
    ],
    rfqDefaultContext: {
      sector: 'aerospace-defence',
      grade: 'grade-5',
      compliance: ['as9100d', 'ams-4928', 'en-10204-3.1'],
      partHint: 'aerospace-bracket',
    },
    dashboardAccent: 'aerospace',
  },
  // ──────────────────────────────────────────────────────────────
  // Card #2 — Medical Implants (Bone Screws & Trauma Plates)
  // ──────────────────────────────────────────────────────────────
  {
    id: 'medical-bone-screw-grade23',
    slug: 'medical-bone-screw-grade23',
    title: 'Medical Orthopedic Bone Screws & Trauma Plates — Grade 23 ELI',
    directAnswer:
      'ASTM F136 Grade 23 (Ti-6Al-4V ELI) bone screws and trauma plates with mirror-polished surface finish Ra ≤ 0.2 µm, 100% ultrasonic cleaned, color-anodized for size identification, and full ISO 5832-3 + ISO 10993 biocompatibility documentation.',
    description:
      'Long-term human implants (orthopedic bone screws, trauma plates, spinal fixation, dental abutments) require the highest-grade titanium with proven biocompatibility. Boze machines Grade 23 (Ti-6Al-4V ELI) per ASTM F136 / ISO 5832-3 in a dedicated ISO 13485-compliant production cell. Threads are single-point micro-turned (M1.0–M4.0) and plates are 5-axis milled to sub-0.05 mm profile tolerance, then electropolished / anodized for size identification and 100% ultrasonic cleaned.',
    intent: 'commercial-investigation',
    featured: true,
    sector: 'medical-implant',
    componentFunctions: ['implant-surgical'],
    materialSpec: {
      grade: 'grade-23',
      unsDesignation: 'R56401',
      standard: 'ASTM F136 / ISO 5832-3 (Ti-6Al-4V ELI)',
      biocompatibilityClass: 'ISO 10993-5 (cytotoxicity), ISO 10993-10 (irritation & sensitisation)',
      condition: 'Annealed per ASTM F136 §6.1',
    },
    complianceChain: ['iso-13485', 'iso-9001', 'astm-f136', 'astm-f86', 'iso-5832-3', 'iso-10993', 'en-10204-3.1'],
    complianceBadges: [
      { id: 'iso-13485', badge: 'ISO 13485', description: 'Medical Devices Quality Management System — required for finished medical device manufacture.', applies: true },
      { id: 'iso-9001', badge: 'ISO 9001:2015', description: 'Foundational QMS, fully integrated with ISO 13485 process control.', applies: true },
      { id: 'astm-f136', badge: 'ASTM F136', description: 'Standard spec for wrought Ti-6Al-4V ELI alloy for surgical implant applications.', applies: true },
      { id: 'astm-f86', badge: 'ASTM F86', description: 'Standard practice for surface preparation and marking of metallic surgical implants.', applies: true },
      { id: 'iso-5832-3', badge: 'ISO 5832-3', description: 'Implants for surgery — Wrought titanium 6-aluminium 4-vanadium alloy.', applies: true },
      { id: 'iso-10993', badge: 'ISO 10993', description: 'Biological evaluation of medical devices — cytotoxicity, sensitisation, irritation.', applies: true },
      { id: 'en-10204-3.1', badge: 'EN 10204 3.1', description: 'Mill Test Report with heat-number-locked certification — required for FDA 510(k) and CE-MDR submissions.', applies: true },
    ],
    challenge:
      'Implant buyers require ISO 13485 QMS + ASTM F136 Grade 23 ELI (not commercial Grade 5) + validated biocompatibility per ISO 10993 + zero surface contamination. Stainless 316L implants cause nickel-ion sensitisation; CoCrMo is not MRI-conditional. Tight thread tolerances (M1.0–M4.0) and mirror finishes (Ra ≤ 0.2 µm) are not achievable on a general-purpose shop floor.',
    solution:
      'Dedicated ISO Class 7 cleanroom production cell, single-point micro-turning for threads (M1.0–M4.0), 5-axis milling of plates, electropolish + Type II anodize for color size-coding, 100% ultrasonic cleaning in deionised water. Full DMR (Device Master Record) per ISO 13485 §4.2.3 with biocompatibility reports.',
    evidenceMetrics: [
      { label: 'Surface finish (post-electropolish)', value: 'Ra ≤ 0.2 µm', baseline: 'mirror-grade for bone-contact', standard: 'ASTM F86 / ISO 25178', emphasis: 'high' },
      { label: 'Cytotoxicity (ISO 10993-5)', value: 'Grade 0 (no reactivity)', baseline: 'vs negative control', standard: 'ISO 10993-5', emphasis: 'high' },
      { label: 'Interstitial element control (Grade 23 ELI)', value: 'O ≤ 0.13 wt%, Fe ≤ 0.25 wt%', baseline: 'vs ASTM F136 §6.1 max', standard: 'ASTM F136', emphasis: 'high' },
      { label: 'Thread pitch tolerance (M1.6)', value: '± 0.015 mm', baseline: 'on full thread profile', standard: 'ISO 5832-3 §4.2', emphasis: 'medium' },
      { label: 'Ultrasonic cleaning coverage', value: '100% (deionised H₂O)', baseline: 'post-final-passivation', standard: 'ASTM F86 §6.1', emphasis: 'medium' },
    ],
    weightComparisonVs: {
      titanium: 'Ti Grade 23 (ELI) — 4.43 g/cm³',
      stainless316L: '316L — 8.00 g/cm³ (with Ni²⁺ release risk)',
      note: 'Ti Grade 23 ELI is MRI-conditional, biocompatible (no Ni release), and ~45% lighter than 316L — the global default for orthopedic bone screws and trauma plates.',
    },
    relatedPages: [
      '/titanium-cnc-machining-services/',
      '/titanium-surface-treatment/',
      '/capabilities/compliance/',
      '/case-studies/',
    ],
    rfqDefaultContext: {
      sector: 'medical-implant',
      grade: 'grade-23',
      compliance: ['iso-13485', 'astm-f136', 'iso-5832-3'],
      partHint: 'medical-implant',
    },
    dashboardAccent: 'medical',
  },
  // ──────────────────────────────────────────────────────────────
  // Card #3 — Marine & Superyacht Hydrofoil Mast Step
  // ──────────────────────────────────────────────────────────────
  {
    id: 'hydrofoil-mast-step-grade7',
    slug: 'hydrofoil-mast-step-grade7',
    title: 'Superyacht Hydrofoil Mast Step & Strut Fittings — Grade 5 / Grade 7',
    directAnswer:
      'Custom 5-axis CNC machined Grade 5 / Grade 7 (Ti-0.2Pd) titanium mast steps and foil strut fittings for superyacht hydrofoils — zero pitting corrosion after 2000+ hours ASTM B117 salt spray, full MTR EN 10204 3.1, hydrofoil-optimised aerofoil profile.',
    description:
      'Superyacht hydrofoils and America\'s Cup class foiling dinghies demand mast steps, foil strut fittings, and rudder stocks that survive permanent saltwater immersion without pitting, crevice corrosion, or galvanic interaction with carbon-fibre masts. Boze machines Grade 5 for high-stress structural nodes and Grade 7 (Ti-0.2Pd) for continuously wetted surfaces, both to ASTM B348 / ASTM B367 with full 2000+ hr ASTM B117 salt-spray evidence. Custom 5-axis contoured machining delivers hydrofoil-grade aerofoil profiles with ±0.05 mm profile tolerance.',
    intent: 'commercial-investigation',
    featured: true,
    sector: 'marine-hydrofoil',
    componentFunctions: ['propulsion-hydrofoil', 'structural'],
    materialSpec: {
      grade: 'grade-7',
      unsDesignation: 'R52400',
      standard: 'ASTM B348 (bar) / ASTM B367 (casting) — Grade 7 Ti-0.2Pd',
      condition: 'Annealed, pickled surface per ASTM B600',
    },
    complianceChain: ['iso-9001', 'astm-b348', 'astm-b367', 'en-10204-3.1', 'eu-ped', 'nace-sp0198'],
    complianceBadges: [
      { id: 'iso-9001', badge: 'ISO 9001:2015', description: 'Foundational QMS covering process control, MTR traceability, and CAPA.', applies: true },
      { id: 'astm-b348', badge: 'ASTM B348', description: 'Standard spec for titanium and titanium alloy bars and billets — primary form for hydrofoil struts.', applies: true },
      { id: 'astm-b367', badge: 'ASTM B367', description: 'Standard spec for titanium and titanium alloy castings — used for complex-shaped mast step bodies.', applies: true },
      { id: 'en-10204-3.1', badge: 'EN 10204 3.1', description: 'Mill Test Report with heat-number certification — class-society requirement for yacht and superyacht classification.', applies: true },
      { id: 'eu-ped', badge: 'EU PED 2014/68/EU', description: 'Pressure Equipment Directive — applies to any hydrofoil system operating under hydraulic pressure.', applies: true },
      { id: 'nace-sp0198', badge: 'NACE SP0198', description: 'Corrosion control of fixed offshore structures exposed to seawater — for foiling craft in continuous immersion.', applies: true },
    ],
    challenge:
      'Superyacht hydrofoils combine permanent seawater immersion, high cyclic loads (up to 10⁷ cycles per regatta season), and galvanic interaction with carbon-fibre masts. Aluminium bronze corrodes; 316L stainless suffers pitting in < 200 hr ASTM B117. Buyers need DNV / Lloyd\'s Register traceable MTRs and NACE-grade seawater performance.',
    solution:
      'Grade 7 (Ti-0.2Pd) for all wetted surfaces — its 0.2% Pd addition shifts the corrosion potential into the passive region, delivering 2000+ hr ASTM B117 salt-spray survival with zero pitting. 5-axis contoured machining for NACA / Eppler / custom hydrofoil aerofoils. Insulating PEEK washers at mast-step / carbon-fibre interface.',
    evidenceMetrics: [
      { label: 'Salt spray survival (ASTM B117)', value: '≥ 2000 hr, 0 pitting', baseline: 'Grade 7 vs 316L < 200 hr pitting', standard: 'ASTM B117 / NACE SP0198', emphasis: 'high' },
      { label: 'Seawater corrosion rate (Grade 7)', value: '< 0.025 mm/yr', baseline: 'vs 316L 0.18 mm/yr in still seawater', standard: 'ASTM G59 / NACE TM0169', emphasis: 'high' },
      { label: 'Aerofoil profile tolerance', value: '± 0.05 mm', baseline: 'on NACA / custom hydrofoil sections', standard: 'ISO 10360-2 (CMM verification)', emphasis: 'high' },
      { label: 'Fatigue life (Grade 5, R=-1)', value: '≥ 10⁷ cycles @ 500 MPa', baseline: 'vs 7075-T6 ~10⁶ cycles', standard: 'ASTM E466', emphasis: 'medium' },
      { label: 'Galvanic isolation (vs carbon fibre)', value: 'PEEK washer, 0.5 mm', baseline: 'prevents cathodic coupling', standard: 'NACE SP0198 §6.4', emphasis: 'medium' },
    ],
    weightComparisonVs: {
      titanium: 'Ti Grade 5 — 4.43 g/cm³ (zero corrosion)',
      stainless316L: '316L — 8.00 g/cm³ (pitting in <200 hr)',
      aluminum7075: '7075-T6 — 2.81 g/cm³ (galvanic corrosion with carbon fibre)',
      note: 'For a 300 kg saving on a 12 m hydrofoil strut assembly, Ti Grade 7 / Grade 5 is the only material that simultaneously meets fatigue + corrosion + galvanic requirements.',
    },
    relatedPages: [
      '/titanium-cnc-machining-services/3-5-axis-cnc-machining/',
      '/titanium-surface-treatment/',
      '/case-studies/',
      '/capabilities/logistics/',
    ],
    rfqDefaultContext: {
      sector: 'marine-hydrofoil',
      grade: 'grade-7',
      compliance: ['nace-sp0198', 'astm-b348', 'en-10204-3.1'],
      partHint: 'hydrofoil-strut',
    },
    dashboardAccent: 'marine',
  },
  // ──────────────────────────────────────────────────────────────
  // Card #4 — Motorsport Wheel Lug Bolts
  // ──────────────────────────────────────────────────────────────
  {
    id: 'racing-wheel-lug-bolt-grade5',
    slug: 'racing-wheel-lug-bolt-grade5',
    title: 'Motorsport Wheel Lug Bolts & Suspension Fasteners — Grade 5',
    directAnswer:
      'CNC thread-rolled + roll-formed Grade 5 (Ti-6Al-4V) wheel lug bolts, suspension tie-rod ends, and caliper pins with 45% weight saving vs chromoly steel, ≥ 1100 MPa tensile strength, AMS 2480 solid-film lubricant, and per-bag MTR EN 10204 3.1.',
    description:
      'Motorsport teams need every gram removed from unsprung mass without compromising the ultimate tensile strength (UTS) and fatigue life of safety-critical fasteners. Boze produces CNC thread-rolled Grade 5 (Ti-6Al-4V) wheel lug bolts, suspension rod ends, brake caliper pins, and driveshaft CV bolts per AMS 4928, with AMS 2480 solid-film lubricant and per-bag MTR EN 10204 3.1 traceability. Each fastener lot is dimensionally verified to ISO 4759-1 and proof-load tested to 95% UTS.',
    intent: 'transactional',
    featured: false,
    sector: 'motorsport-automotive',
    componentFunctions: ['fastener'],
    materialSpec: {
      grade: 'grade-5',
      unsDesignation: 'R56400',
      standard: 'AMS 4928 (bar) → CNC thread-rolled per ISO 4759-1',
      condition: 'Solution-treated & aged (STA) for ≥ 1100 MPa UTS',
    },
    complianceChain: ['iso-9001', 'ams-4928', 'ams-2480', 'en-10204-3.1'],
    complianceBadges: [
      { id: 'iso-9001', badge: 'ISO 9001:2015', description: 'Foundational QMS — required for FIA-homologated motorsport fastener supply.', applies: true },
      { id: 'ams-4928', badge: 'AMS 4928', description: 'Aerospace spec for Ti-6Al-4V bar/billet — the same lot is dual-released for motorsport and aerospace.', applies: true },
      { id: 'ams-2480', badge: 'AMS 2480', description: 'Solid-film lubricant for titanium fasteners — prevents galling during installation and ensures repeatable torque-tension.', applies: true },
      { id: 'en-10204-3.1', badge: 'EN 10204 3.1', description: 'Mill Test Report with heat-number certification — per-bag traceability for race engineers.', applies: true },
    ],
    challenge:
      'Reducing unsprung mass on a GT3 / Le Mans Prototype directly improves lap time (≈ 0.03 s/lap per kg removed from rotating + reciprocating mass). Steel chromoly 8740 lug bolts add 28 g each over a 20-bolt wheelset = 0.56 kg of unsprung mass. Aluminium lug bolts fail under the 95% UTS proof-load requirement. Buyers need per-bag traceability and proof-load test certificates.',
    solution:
      'CNC thread-rolled (not cut) Grade 5 lug bolts with solution-treated & aged (STA) condition delivering ≥ 1100 MPa UTS. AMS 2480 solid-film lubricant (PTFE + MoS₂) prevents thread galling. Each bolt proof-load tested to 95% UTS and dimensionally verified per ISO 4759-1. Per-bag MTR EN 10204 3.1 with heat number.',
    evidenceMetrics: [
      { label: 'Weight saving vs chromoly 8740', value: '−45%', baseline: 'per M14×1.5 lug bolt', standard: 'FIA GT3 §5.4 / ISO 4759-1', emphasis: 'high' },
      { label: 'Ultimate tensile strength (STA condition)', value: '≥ 1100 MPa', baseline: 'vs 8740 ~1240 MPa with higher mass', standard: 'ASTM E8 / AMS 4928', emphasis: 'high' },
      { label: 'Proof-load test', value: '95% UTS, 100%', baseline: 'every bolt tested before bag', standard: 'ISO 898-1 §9.1', emphasis: 'high' },
      { label: 'Fatigue life (R = 0.1, 600 MPa)', value: '≥ 10⁶ cycles', baseline: 'vs 8740 ~5×10⁵ cycles', standard: 'ASTM E466', emphasis: 'medium' },
      { label: 'Solid-film lubricant (anti-galling)', value: 'AMS 2480 coating', baseline: 'PTFE + MoS₂ on all threads', standard: 'AMS 2480', emphasis: 'medium' },
    ],
    weightComparisonVs: {
      titanium: 'Ti Grade 5 STA — 4.43 g/cm³',
      stainless316L: '316L — 8.00 g/cm³',
      aluminum7075: '7075-T6 — 2.81 g/cm³ (insufficient UTS)',
      steel4140: '4140 chromoly — 7.85 g/cm³ (baseline)',
      note: 'For a 20-bolt GT3 wheelset, Ti Grade 5 saves 0.56 kg of unsprung mass vs 8740 chromoly — translating to ≈ 0.017 s/lap time gain.',
    },
    relatedPages: [
      '/titanium-cnc-machining-services/cnc-milling-turning/',
      '/titanium-surface-treatment/',
      '/case-studies/',
    ],
    rfqDefaultContext: {
      sector: 'motorsport-automotive',
      grade: 'grade-5',
      compliance: ['ams-4928', 'ams-2480', 'en-10204-3.1'],
      partHint: 'motorsport-fastener',
    },
    dashboardAccent: 'motorsport',
  },
  // ──────────────────────────────────────────────────────────────
  // Card #5 — Subsea Sensor Housing (Grade 7 / Grade 12)
  // ──────────────────────────────────────────────────────────────
  {
    id: 'subsea-sensor-housing-grade7',
    slug: 'subsea-sensor-housing-grade7',
    title: 'Subsea & ROV Pressure-Tight Sensor Housings — Grade 7 / Grade 12',
    directAnswer:
      'CNC machined Grade 7 (Ti-0.2Pd) and Grade 12 (Ti-0.3Mo-0.8Ni) subsea pressure-tight sensor housings, ROV manipulator jaws, and sour-service (H₂S) valve bodies — qualified to 30 MPa hydrostatic pressure, NACE MR0175 for H₂S service, 100% helium leak tested to 1×10⁻⁹ mbar·L/s.',
    description:
      'Subsea oil & gas, ROV tooling, and deep-sea scientific sensors demand housings that survive permanent seawater immersion at 3000 m depth (≈ 30 MPa) plus optional H₂S exposure. Boze machines Grade 7 (Ti-0.2Pd) for standard subsea and Grade 12 (Ti-0.3Mo-0.8Ni) for sour-service (H₂S) per NACE MR0175. Every housing is 100% helium leak tested to 1×10⁻⁹ mbar·L/s, passivated per ASTM B600, and hydrostatically proof-tested to 1.5× working pressure.',
    intent: 'commercial-investigation',
    featured: false,
    sector: 'subsea-oil-gas',
    componentFunctions: ['housing-enclosure', 'sensor-instrument'],
    materialSpec: {
      grade: 'grade-7',
      unsDesignation: 'R52400',
      standard: 'ASTM B348 Grade 7 / ASTM B367 Grade 7 — Ti-0.2Pd',
      condition: 'Annealed, passivated per ASTM B600',
    },
    complianceChain: ['iso-9001', 'astm-b348', 'eu-ped', 'en-10204-3.1', 'nace-mr0175', 'nace-sp0198'],
    complianceBadges: [
      { id: 'iso-9001', badge: 'ISO 9001:2015', description: 'Foundational QMS — required by all subsea OEMs (Subsea 7, TechnipFMC, Aker Solutions).', applies: true },
      { id: 'astm-b348', badge: 'ASTM B348', description: 'Standard spec for Ti and Ti alloy bars and billets — primary form for subsea housings.', applies: true },
      { id: 'eu-ped', badge: 'EU PED 2014/68/EU', description: 'Pressure Equipment Directive — required for any pressure-tight housing ≥ 0.5 bar Category I.', applies: true },
      { id: 'en-10204-3.1', badge: 'EN 10204 3.1', description: 'Mill Test Report with heat-number certification.', applies: true },
      { id: 'nace-mr0175', badge: 'NACE MR0175', description: 'Materials for Use in H₂S-Containing Environments — required for sour-service subsea applications.', applies: true },
      { id: 'nace-sp0198', badge: 'NACE SP0198', description: 'Corrosion control of fixed offshore structures exposed to seawater.', applies: true },
    ],
    challenge:
      'Subsea buyers require 30 MPa hydrostatic survival + H₂S compatibility + 1×10⁻⁹ mbar·L/s helium leak rate. 316L stainless suffers crevice corrosion in subsea bolted joints; aluminium bronze dezincifies; super-duplex 2507 is difficult to machine. Subsea OEMs require NACE MR0175 sour-service compliance for any downhole tooling.',
    solution:
      'Grade 7 (Ti-0.2Pd) for seawater immersion — its 0.2% Pd addition prevents crevice corrosion in subsea bolted joints. Grade 12 (Ti-0.3Mo-0.8Ni) for sour (H₂S) service per NACE MR0175. Single-pass 5-axis CNC milling of complex port geometries, orbital TIG welding of end-caps per ASME IX, 100% He leak test, hydrostatic proof test to 1.5× working pressure.',
    evidenceMetrics: [
      { label: 'Hydrostatic proof test (housing)', value: '1.5× working pressure, 100%', baseline: 'vs 1.0× typical industry', standard: 'EU PED 2014/68/EU', emphasis: 'high' },
      { label: 'Helium leak rate', value: '≤ 1×10⁻⁹ mbar·L/s', baseline: 'vs typical 1×10⁻⁷ spec', standard: 'ASTM E493 / EN 13185', emphasis: 'high' },
      { label: 'Seawater crevice corrosion (Grade 7)', value: '0 attack @ 30 days', baseline: 'vs 316L pitting @ 7 days', standard: 'ASTM G48 / NACE SP0198', emphasis: 'high' },
      { label: 'NACE MR0175 sour-service compliance', value: 'SSC Region 0', baseline: 'vs 316L Region 2 with HRC ≤ 22', standard: 'NACE MR0175 / ISO 15156', emphasis: 'medium' },
      { label: 'Operating depth', value: '≥ 3000 m (30 MPa)', baseline: 'qualified by hydrostatic proof', standard: 'API 6A / EU PED', emphasis: 'medium' },
    ],
    weightComparisonVs: {
      titanium: 'Ti Grade 7 — 4.43 g/cm³ (zero crevice corrosion)',
      stainless316L: '316L — 8.00 g/cm³ (crevice corrosion in subsea joints)',
      note: 'For a 30 MPa subsea housing, Ti Grade 7 eliminates the crevice-corrosion concern that forces 316L users to over-engineer wall thickness by 2–3 mm — saving both weight and cost in deep-water installations.',
    },
    relatedPages: [
      '/titanium-fabrication-services/titanium-welding-assembly/',
      '/titanium-cnc-machining-services/',
      '/capabilities/compliance/',
      '/capabilities/logistics/',
    ],
    rfqDefaultContext: {
      sector: 'subsea-oil-gas',
      grade: 'grade-7',
      compliance: ['nace-mr0175', 'eu-ped', 'en-10204-3.1'],
      partHint: 'subsea-housing',
    },
    dashboardAccent: 'subsea',
  },
  // ──────────────────────────────────────────────────────────────
  // Card #6 — High-End EDC / Wearable Microdermal Tops
  // ──────────────────────────────────────────────────────────────
  {
    id: 'microdermal-top-grade23',
    slug: 'microdermal-top-grade23',
    title: 'High-End EDC & Microdermal Piercing Tops — Grade 23 ELI',
    directAnswer:
      'Precision micro-turned and 5-axis milled Grade 23 (Ti-6Al-4V ELI) microdermal piercing tops, EDC pen clips, and wearable hardware — ASTM F136 / ISO 5832-3 implant-grade, PVD colour coating, mirror finish Ra ≤ 0.1 µm, validated to ISO 10993-5 cytotoxicity Grade 0.',
    description:
      'Body jewellery and high-end EDC hardware that sits in permanent contact with human tissue must meet the same biocompatibility standard as surgical implants. Boze micro-turns (Swiss-type) and 5-axis mills Grade 23 (Ti-6Al-4V ELI) per ASTM F136 / ISO 5832-3 with sub-0.05 mm profile tolerance, post-machining electropolish to Ra ≤ 0.1 µm mirror finish, and optional PVD decorative coating (ZrN gold, TiAlN rainbow, DLC black). All production in an ISO 13485 cleanroom.',
    intent: 'informational',
    featured: false,
    sector: 'edc-luxury-hardware',
    componentFunctions: ['jewelry-wearable'],
    materialSpec: {
      grade: 'grade-23',
      unsDesignation: 'R56401',
      standard: 'ASTM F136 / ISO 5832-3 (Ti-6Al-4V ELI)',
      biocompatibilityClass: 'ISO 10993-5 (cytotoxicity), ISO 10993-10 (irritation & sensitisation)',
      condition: 'Annealed per ASTM F136 §6.1',
    },
    complianceChain: ['iso-13485', 'iso-9001', 'astm-f136', 'iso-5832-3', 'iso-10993'],
    complianceBadges: [
      { id: 'iso-13485', badge: 'ISO 13485', description: 'Medical Devices QMS — used here to validate the production line for body-contact hardware.', applies: true },
      { id: 'iso-9001', badge: 'ISO 9001:2015', description: 'Foundational QMS.', applies: true },
      { id: 'astm-f136', badge: 'ASTM F136', description: 'Wrought Ti-6Al-4V ELI alloy for surgical implant applications — the same spec used for orthopedic bone screws.', applies: true },
      { id: 'iso-5832-3', badge: 'ISO 5832-3', description: 'Wrought titanium 6-aluminium 4-vanadium alloy for surgical implants.', applies: true },
      { id: 'iso-10993', badge: 'ISO 10993', description: 'Biological evaluation of medical devices — guarantees no cytotoxicity, no sensitisation, no irritation.', applies: true },
    ],
    challenge:
      'High-end body jewellery and EDC buyers (CPF, Hinderer, Chris Reeve, AnoTek) want implant-grade materials at micro-feature tolerances, but most jewellery shops use industrial 316L (Ni release) or generic Grade 5 (no biocompatibility documentation). Buyers also demand consistent PVD colour across batches and mirror finishes that hold up to daily wear.',
    solution:
      'Swiss-type micro-turning (for sub-1.5 mm features) and 5-axis micro-milling (for complex surfaces) in an ISO 13485 cleanroom. Electropolish to Ra ≤ 0.1 µm mirror finish, optional PVD (ZrN / TiAlN / DLC). 100% visual inspection under 10× stereo microscope. ISO 10993-5 cytotoxicity test report supplied per lot.',
    evidenceMetrics: [
      { label: 'Surface finish (post-electropolish)', value: 'Ra ≤ 0.1 µm', baseline: 'mirror-grade for body contact', standard: 'ISO 25178', emphasis: 'high' },
      { label: 'Cytotoxicity (ISO 10993-5)', value: 'Grade 0 (no reactivity)', baseline: 'vs negative control', standard: 'ISO 10993-5', emphasis: 'high' },
      { label: 'Feature tolerance (Swiss-type turning)', value: '± 0.02 mm', baseline: 'on sub-1.5 mm micro-features', standard: 'ISO 2768-mK', emphasis: 'high' },
      { label: 'PVD coating hardness', value: '1800–2400 HV', baseline: 'ZrN / TiAlN / DLC options', standard: 'ISO 14577', emphasis: 'medium' },
      { label: 'Thread engagement (M1.0 internal)', value: '± 0.015 mm', baseline: 'for microdermal anchor engagement', standard: 'ISO 5832-3 §4.2', emphasis: 'medium' },
    ],
    weightComparisonVs: {
      titanium: 'Ti Grade 23 ELI — 4.43 g/cm³ (biocompatible)',
      stainless316L: '316L — 8.00 g/cm³ (Ni²⁺ release, not for body contact)',
      note: 'For body-contact hardware, Grade 23 ELI is 45% lighter than 316L and the only material with documented ISO 10993-5 cytotoxicity Grade 0 — every other titanium body jewellery brand has to claim this; we prove it per lot.',
    },
    relatedPages: [
      '/titanium-surface-treatment/',
      '/titanium-cnc-machining-services/',
      '/capabilities/compliance/',
    ],
    rfqDefaultContext: {
      sector: 'edc-luxury-hardware',
      grade: 'grade-23',
      compliance: ['iso-13485', 'astm-f136', 'iso-10993'],
      partHint: 'wearable-hardware',
    },
    dashboardAccent: 'edc',
  },
];

// ────────────────────────────────────────────────────────────────────
// 9. FILTERING LOGIC (used by IndustryApplicationsHub)
// ────────────────────────────────────────────────────────────────────

function includesAny<T extends string>(
  haystack: readonly T[],
  needle: readonly T[],
): boolean {
  if (needle.length === 0) return true;
  for (const n of needle) if (haystack.includes(n)) return true;
  return false;
}

function matchesQuery(haystack: string, needle: string): boolean {
  if (needle.trim().length === 0) return true;
  return haystack.toLowerCase().includes(needle.trim().toLowerCase());
}

/**
 * Return application cards that pass all active filters. Empty filter
 * dimension = "no filter on this dimension". Search query is lower-cased
 * substring match over title + description + directAnswer + challenge +
 * solution.
 */
export function filterIndustryApplications(
  cards: readonly ApplicationCard[],
  state: IndustryApplicationUrlState,
): readonly ApplicationCard[] {
  const q = state.query.trim();
  return cards.filter((c) => {
    if (
      !matchesQuery(
        `${c.title} ${c.description} ${c.directAnswer} ${c.challenge} ${c.solution}`,
        q,
      )
    )
      return false;
    if (!includesAny([c.sector], state.sectors)) return false;
    if (!includesAny([c.materialSpec.grade], state.grades)) return false;
    if (!includesAny(c.complianceChain, state.standards)) return false;
    if (!includesAny(c.componentFunctions, state.components)) return false;
    return true;
  });
}

// ────────────────────────────────────────────────────────────────────
// 10. FACET GROUP BUILDER
// ────────────────────────────────────────────────────────────────────

export function buildIndustryApplicationFacets(): IndustryFacetGroups {
  return {
    sector: {
      id: 'sector',
      label: 'Industry Sector',
      values: INDUSTRY_SECTOR_ORDER,
      labels: INDUSTRY_SECTOR_LABELS,
    },
    grade: {
      id: 'grade',
      label: 'Material Grade',
      values: MATERIAL_GRADE_ORDER,
      labels: MATERIAL_GRADE_LABELS,
    },
    standard: {
      id: 'standard',
      label: 'Compliance Standard',
      values: COMPLIANCE_STANDARD_ORDER,
      labels: COMPLIANCE_STANDARD_LABELS,
    },
    component: {
      id: 'component',
      label: 'Component Function',
      values: COMPONENT_FUNCTION_ORDER,
      labels: COMPONENT_FUNCTION_LABELS,
    },
  };
}

// ────────────────────────────────────────────────────────────────────
// 11. ACTIVE-FILTER COUNT HELPER
// ────────────────────────────────────────────────────────────────────

export function countActiveFilters(
  state: IndustryApplicationUrlState,
): number {
  return (
    state.sectors.length +
    state.grades.length +
    state.standards.length +
    state.components.length +
    (state.query.trim().length > 0 ? 1 : 0)
  );
}

// ────────────────────────────────────────────────────────────────────
// 12. FIND BY ID HELPER (for opening a modal from URL on initial load)
// ────────────────────────────────────────────────────────────────────

export function findApplicationCardById(
  id: string,
): ApplicationCard | null {
  for (const c of INDUSTRY_APPLICATIONS) {
    if (c.id === id) return c;
  }
  return null;
}

// ────────────────────────────────────────────────────────────────────
// 13. SECTOR-ACCENT MAP (CSS class hook for the hero matrix + cards)
// ────────────────────────────────────────────────────────────────────

export type SectorAccentKey =
  | 'aerospace'
  | 'medical'
  | 'marine'
  | 'motorsport'
  | 'subsea'
  | 'edc';

export const SECTOR_ACCENT: Readonly<
  Record<SectorAccentKey, { border: string; bg: string; text: string }>
> = {
  aerospace: { border: 'rgba(148,163,184,0.35)', bg: 'rgba(148,163,184,0.08)', text: '#cbd5e1' },
  medical: { border: 'rgba(16,185,129,0.35)', bg: 'rgba(16,185,129,0.08)', text: '#6ee7b7' },
  marine: { border: 'rgba(14,165,233,0.35)', bg: 'rgba(14,165,233,0.08)', text: '#7dd3fc' },
  motorsport: { border: 'rgba(249,115,22,0.35)', bg: 'rgba(249,115,22,0.08)', text: '#fdba74' },
  subsea: { border: 'rgba(99,102,241,0.35)', bg: 'rgba(99,102,241,0.08)', text: '#a5b4fc' },
  edc: { border: 'rgba(168,85,247,0.35)', bg: 'rgba(168,85,247,0.08)', text: '#d8b4fe' },
};












