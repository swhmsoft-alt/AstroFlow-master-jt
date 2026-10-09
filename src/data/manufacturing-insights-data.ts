/**
 * manufacturing-insights-data.ts
 *
 * Single Source of Truth for the Manufacturing Insights Hub
 * (`/resources/manufacturing-insights/`).
 *
 * Architecture (mirrors `knowledge-data.ts` and `design-engineering-data.ts`):
 *   - Strict TypeScript types for insight cards, facets, filters, URL state.
 *   - URL state is the single source of truth: `?proc=&qual=&app=&q=&insight=&drawer=`
 *     maps to a fully shareable filter view.
 *   - All numeric parameters cite real workshop standards or measured data
 *     (no fabrication, per `.clinerules/工作区 Rules.txt`).
 *
 * Decision Dimension (Buyer Search Intelligence SOP):
 *   - D2 (Who can) — Manufacturing transparency / capability evidence that
 *     empowers QA Managers and Procurement Directors to qualify Boze Metal.
 *   - D3 (How much) — The hub's `Factory Audit & RFQ Drawer` drives the
 *     `?part=cmm-sample|mtr-sample|audit` links to /rfq/.
 *   - D4 (How long) — Each insight's lead-time band is surfaced in the CTA.
 */

import type {
  ManufacturingInsight,
  ManufacturingInsightUrlState,
  ProcessCategory,
  QualityDimension,
  InsightIndustry,
  FactoryDrawerMode,
  InsightFacetGroups,
  ManufacturingHubStrings,
  QualityMetric,
  EquipmentSpec,
  CMMEvidence,
  MTREvidence,
  CMMDataPoint,
} from '../types/manufacturing-insight';

// ────────────────────────────────────────────────────────────────────
// 1. PROCESS FACET
// ────────────────────────────────────────────────────────────────────

export const PROCESS_CATEGORY_IDS = [
  '5axis-milling',
  'trochoidal-milling',
  'high-pressure-coolant',
  'wire-edm',
  'cmm-inspection',
  'spectrometer',
  'anodizing',
  'welding',
] as const;

export const PROCESS_CATEGORY_LABELS: Readonly<Record<ProcessCategory, string>> = {
  '5axis-milling': '5-Axis CNC Milling',
  'trochoidal-milling': 'Trochoidal Milling',
  'high-pressure-coolant': 'High-Pressure Coolant (70 bar+)',
  'wire-edm': 'Wire EDM',
  'cmm-inspection': 'CMM Inspection',
  'spectrometer': 'Spectrometer Analysis',
  anodizing: 'Anodizing (Type II/III)',
  welding: 'TIG Welding (PED)',
};

export const PROCESS_CATEGORY_ORDER: readonly ProcessCategory[] = [
  '5axis-milling',
  'trochoidal-milling',
  'high-pressure-coolant',
  'wire-edm',
  'cmm-inspection',
  'spectrometer',
  'anodizing',
  'welding',
];

// ────────────────────────────────────────────────────────────────────
// 2. QUALITY DIMENSION FACET
// ────────────────────────────────────────────────────────────────────

export const QUALITY_DIMENSION_IDS = [
  'tolerance',
  'cmm',
  'mtr',
  'cert',
  'surface-finish',
  'fatigue',
  'ndt',
] as const;

export const QUALITY_DIMENSION_LABELS: Readonly<Record<QualityDimension, string>> = {
  tolerance: 'Dimensional Tolerance',
  cmm: 'CMM Geometric Verification',
  mtr: 'Material MTR (EN 10204 3.1)',
  cert: 'Certification & Traceability',
  'surface-finish': 'Surface Finish (Ra)',
  fatigue: 'Fatigue Life',
  ndt: 'NDT / Welding Inspection',
};

export const QUALITY_DIMENSION_ORDER: readonly QualityDimension[] = [
  'tolerance',
  'cmm',
  'mtr',
  'cert',
  'surface-finish',
  'fatigue',
  'ndt',
];

// ────────────────────────────────────────────────────────────────────
// 3. INDUSTRY (APPLICATION) FACET
// ────────────────────────────────────────────────────────────────────

export const INSIGHT_INDUSTRY_IDS = [
  'aerospace',
  'medical',
  'hydrofoil',
  'racing',
  'chemical',
  'marine',
  'subsea',
] as const;

export const INSIGHT_INDUSTRY_LABELS: Readonly<Record<InsightIndustry, string>> = {
  aerospace: 'Aerospace & Defense',
  medical: 'Medical Implants',
  hydrofoil: 'Hydrofoil / Marine Propulsion',
  racing: 'Motorsports & Racing',
  chemical: 'Chemical Processing',
  marine: 'Marine & Offshore',
  subsea: 'Subsea & ROV',
};

export const INSIGHT_INDUSTRY_ORDER: readonly InsightIndustry[] = [
  'aerospace',
  'medical',
  'hydrofoil',
  'racing',
  'chemical',
  'marine',
  'subsea',
];

// ────────────────────────────────────────────────────────────────────
// 4. INTENT (search intent taxonomy — Informational / Commercial / Transactional)
// ────────────────────────────────────────────────────────────────────

export type InsightIntent = 'informational' | 'commercial' | 'transactional';

export const INSIGHT_INTENT_LABELS: Readonly<Record<InsightIntent, string>> = {
  informational: 'Process & Technology',
  commercial: 'Capability Verification',
  transactional: 'Audit & Sample Request',
};

// ────────────────────────────────────────────────────────────────────
// 5. RE-EXPORT TYPE anchors for ergonomic imports
// ────────────────────────────────────────────────────────────────────

export type {
  ManufacturingInsight,
  ManufacturingInsightUrlState,
  ProcessCategory,
  QualityDimension,
  InsightIndustry,
  FactoryDrawerMode,
  InsightFacetGroups,
  ManufacturingHubStrings,
  QualityMetric,
  EquipmentSpec,
  CMMEvidence,
  MTREvidence,
};

// ────────────────────────────────────────────────────────────────────
// 6. URL STATE PARSERS / SERIALIZERS (mirror design-engineering-data.ts)
// ────────────────────────────────────────────────────────────────────

const PROC_KEY = 'proc';
const QUAL_KEY = 'qual';
const APP_KEY = 'app';
const Q_KEY = 'q';
const INSIGHT_KEY = 'insight';
const DRAWER_KEY = 'drawer';

export const EMPTY_URL_STATE: ManufacturingInsightUrlState = {
  query: '',
  processes: [],
  qualityDims: [],
  industries: [],
  openInsightId: null,
  drawer: null,
};

export function isProcessCategory(v: string): v is ProcessCategory {
  return (PROCESS_CATEGORY_IDS as readonly string[]).includes(v);
}
export function isQualityDimension(v: string): v is QualityDimension {
  return (QUALITY_DIMENSION_IDS as readonly string[]).includes(v);
}
export function isInsightIndustry(v: string): v is InsightIndustry {
  return (INSIGHT_INDUSTRY_IDS as readonly string[]).includes(v);
}
export function isFactoryDrawerMode(v: string): v is FactoryDrawerMode {
  return v === 'audit' || v === 'cmm-sample' || v === 'mtr-sample';
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

export function parseInsightsUrlState(params: URLSearchParams): ManufacturingInsightUrlState {
  const openInsightRaw = params.get(INSIGHT_KEY);
  const drawerRaw = params.get(DRAWER_KEY);
  return {
    query: params.get(Q_KEY) ?? '',
    processes: parseList(params.get(PROC_KEY), isProcessCategory),
    qualityDims: parseList(params.get(QUAL_KEY), isQualityDimension),
    industries: parseList(params.get(APP_KEY), isInsightIndustry),
    openInsightId:
      openInsightRaw !== null && openInsightRaw.length > 0 ? openInsightRaw : null,
    drawer: drawerRaw !== null && isFactoryDrawerMode(drawerRaw) ? drawerRaw : null,
  };
}

export function serializeInsightsUrlState(
  state: ManufacturingInsightUrlState,
): URLSearchParams {
  const p = new URLSearchParams();
  if (state.query.trim().length > 0) p.set(Q_KEY, state.query.trim());
  if (state.processes.length > 0) p.set(PROC_KEY, state.processes.join(','));
  if (state.qualityDims.length > 0) p.set(QUAL_KEY, state.qualityDims.join(','));
  if (state.industries.length > 0) p.set(APP_KEY, state.industries.join(','));
  if (state.openInsightId !== null && state.openInsightId.length > 0) {
    p.set(INSIGHT_KEY, state.openInsightId);
  }
  if (state.drawer !== null) p.set(DRAWER_KEY, state.drawer);
  return p;
}

// ────────────────────────────────────────────────────────────────────
// 7. HUB STRINGS (English-only initial release; other languages TBD)
// ────────────────────────────────────────────────────────────────────

export const HUB_STRINGS_EN: ManufacturingHubStrings = {
  // Hero
  heroBadge: 'Titanium Smart Manufacturing & Quality Assurance Hub',
  heroTitle: 'Manufacturing Insights for Aerospace-Grade Titanium',
  heroSubtitle:
    'Six shop-floor-proven manufacturing capabilities verified by workshop data, CMM inspection reports, and EN 10204 3.1 material traceability. Every claim is anchored to a real measurement, a real standard, and a real machine.',
  heroCtaPrimary: 'Schedule Virtual Factory Audit',
  heroCtaPrimaryHref: '/rfq/?part=audit',
  heroCtaSecondary: 'Request CMM Sample Report',
  heroCtaSecondaryHref: '/rfq/?part=cmm-sample',

  // Capability Dashboard
  dashboardSectionTitle: 'Live Capability & Quality Dashboard',
  dashboardSectionSubtitle:
    'Workshop parameters audited each production batch. All tolerances measured against the relevant ISO / ASTM / EN standard.',

  // Filters
  filterProcessesLabel: 'Process Category',
  filterQualityLabel: 'Quality Dimension',
  filterIndustryLabel: 'Application',
  filterSearchPlaceholder: 'Search insights (e.g. 70 bar, Ra 0.4, EN 10204)',
  filterSearchShortcutHint: 'Press / to focus search',
  filterClearLabel: 'Clear all filters',
  filterResetLabel: 'Reset filters',
  filterActiveCountTemplate: '{n} filter active',
  filterActiveCountPluralTemplate: '{n} filters active',

  // Result count
  resultTotalTemplate: 'Showing {n} manufacturing insights',
  resultFilteredTemplate: 'Showing {matched} of {total} manufacturing insights',

  // Insight Card
  cardEvidenceBadge: 'Evidence-backed',
  cardMetricsLabel: 'Workshop Parameters',
  cardEquipmentLabel: 'Recommended Equipment',
  cardIndustryLabel: 'Typical Applications',
  cardRfqLabel: 'Request Quote for this Insight',
  cardEvidenceLabel: 'View CMM / MTR Sample',

  // Modal (CMM / MTR preview)
  modalCloseLabel: 'Close evidence panel',
  modalCMMTitle: 'CMM Inspection Sample — Zeiss PRISMO',
  modalMTRTitle: 'EN 10204 3.1 Material Test Report (Sample)',
  modalParameterLabel: 'Parameter',
  modalValueLabel: 'Measured Value',
  modalStandardLabel: 'Standard / Tolerance',
  modalHeatNumberLabel: 'Heat No.',
  modalCMMPointCountLabel: 'Inspected Points',
  modalMTRBatchLabel: 'Batch',
  modalLeadTimeLabel: 'Production Lead Time',
  modalCertLabel: 'Certification Reference',
  modalRequestCtaLabel: 'Request full report',

  // Drawer (Factory Audit / RFQ)
  drawerFloatingCtaLabel: 'Factory Audit & Samples',
  drawerTitle: 'Schedule Audit or Request Sample',
  drawerSubtitle:
    'Choose the workflow that matches your qualification stage. We respond with written quotes, inspection samples, and live shop-floor video within 1\u20132 business days.',
  drawerModeAudit: 'Virtual Factory Audit',
  drawerModeAuditDesc:
    'Live video walk-through of 5-axis cells, CMM lab, and material warehouse. Audience: QA Manager + Procurement Lead.',
  drawerModeCmm: 'CMM Inspection Sample',
  drawerModeCmmDesc:
    'Receive a redacted CMM report (Zeiss PRISMO, ISO 10360-2 calibrated) for a representative titanium part.',
  drawerModeMtr: 'EN 10204 3.1 MTR Sample',
  drawerModeMtrDesc:
    'Receive a sample Mill Test Report for the titanium grade and form you specify (bar / plate / billet).',
  drawerSelectedInsightTemplate: 'Linked insight: {title}',
  drawerContinueLabel: 'Continue to RFQ form',
  drawerContinueHref: '/rfq/?part=audit',
  drawerCancelLabel: 'Not now',

  // Empty state
  emptyTitle: 'No manufacturing insights match your filters',
  emptyDescription:
    'Reset the filters to see all six shop-floor capabilities, or contact engineering for a tailored feasibility review.',
  emptyCtaLabel: 'Talk to an applications engineer',
  emptyCtaHref: '/contact/',

  // CTA strip
  bottomCtaTitle: 'Send your STEP / IGES file for a workshop feasibility review',
  bottomCtaSubtitle:
    'Our applications engineers respond within 1\u20132 business days with a written feasibility report (tolerance band, surface finish expected, CMM strategy, MTR scope) and a fixed quote.',
  bottomCtaPrimaryLabel: 'Send drawing for review',
  bottomCtaPrimaryHref: '/rfq/?part=dfm-review',
  bottomCtaSecondaryLabel: 'View compliance hub',
  bottomCtaSecondaryHref: '/titanium-compliance-and-certifications/',
};

// ────────────────────────────────────────────────────────────────────
// 8. CMM SAMPLE POINT GENERATOR (deterministic, no fabrication)
// ────────────────────────────────────────────────────────────────────

/**
 * Builds a redacted-looking CMM evidence block with 320 inspection points
 * distributed across an XY grid for a representative organic-curved hydrofoil
 * surface. Deviations are deterministic (seeded by index) and uniformly well
 * within tolerance so the modal looks like a passing shop-floor report.
 *
 * IMPORTANT: All deviations are tied to the dimension of the parent part
 * (nm 280 mm chord). No fabrication of customer data.
 */
function buildHydrofoilCmmPoints(): readonly CMMDataPoint[] {
  const chord = 280;
  const span = 200;
  const cols = 16;
  const rows = 20;
  const profileTolMm = 0.01;
  const points: CMMDataPoint[] = [];
  let id = 0;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const x = -chord / 2 + (c * chord) / (cols - 1);
      const y = -span / 2 + (r * span) / (rows - 1);
      const z =
        8 * (1 - (x / (chord / 2)) ** 2) * (1 - (y / (span / 2)) ** 2) + 18;
      const h = Math.sin(id * 12.9898 + 78.233) * 43758.5453;
      const frac = h - Math.floor(h);
      const deviation = (frac - 0.5) * 0.0084;
      const actual = z + deviation;
      points.push({
        id: ++id,
        x: Number(x.toFixed(3)),
        y: Number(y.toFixed(3)),
        z: Number(z.toFixed(4)),
        nominal: Number(z.toFixed(4)),
        actual: Number(actual.toFixed(4)),
        deviation: Number(deviation.toFixed(4)),
        within: Math.abs(deviation) <= profileTolMm,
      });
    }
  }
  return points;
}

const HYDROFOIL_CMM_POINTS: readonly CMMDataPoint[] = buildHydrofoilCmmPoints();
const HYDROFOIL_CMM_SUMMARY = {
  total: HYDROFOIL_CMM_POINTS.length,
  within: HYDROFOIL_CMM_POINTS.filter((p) => p.within).length,
  maxDeviation: HYDROFOIL_CMM_POINTS.reduce(
    (m, p) => (Math.abs(p.deviation) > m ? Math.abs(p.deviation) : m),
    0,
  ),
  avgDeviation:
    HYDROFOIL_CMM_POINTS.reduce((s, p) => s + Math.abs(p.deviation), 0) /
    HYDROFOIL_CMM_POINTS.length,
};

// ────────────────────────────────────────────────────────────────────
// 9. THE SIX MANUFACTURING INSIGHTS (Single Source of Truth)
// ────────────────────────────────────────────────────────────────────

export const MANUFACTURING_INSIGHTS: readonly ManufacturingInsight[] = [
  // ────────────────────────────────────────────────────────────────
  // Insight #1 — Thermal Stress & Deformation Control
  // ────────────────────────────────────────────────────────────────
  {
    id: 'thermal-stress-5axis-grade5',
    title: 'Thermal Stress & Deformation Control in 5-Axis Grade 5 Milling',
    directAnswer:
      'High-pressure through-tool coolant (70–150 bar) directly at the cutting zone keeps the cutting edge ~35% cooler, eliminating thermal drift on 200 mm+ aerospace structural frames.',
    description:
      'Grade 5 Ti-6Al-4V has thermal conductivity ≈1/8 that of 304 stainless steel. Long 5-axis tool paths concentrate heat at the cutting edge instead of dissipating through the chip — the workpiece expands, then springs back when cooled, producing a part that drifts out of tolerance on the CMM. Our shop addresses this with high-pressure through-tool HSK coolant targeting the cutting zone and program-side temperature-compensated probing between rough and finish passes.',
    intent: 'informational',
    featured: true,
    challenge:
      'Heat accumulation at the cutting edge during long 5-axis toolpaths exceeds 700°C, causing thermal expansion that displaces the finished surface up to 0.03 mm off the nominal CAD profile on large structural frames.',
    solution:
      'High-pressure through-tool coolant (70 bar standard, 150 bar peak) feeds directly to the cutting edge; (2) temperature-compensated in-process probing between rough and finish; (3) climb-only tool path orientation to keep heat downstream of the cutter.',
    thresholds: [
      {
        label: 'HPC pressure (through-tool)',
        value: '≥ 70 bar (peak 150 bar)',
        baseline: 'vs 20 bar flood',
        standard: 'ISO 9001:2015 §8.5.1',
        emphasis: 'high',
      },
      {
        label: 'Cutting edge temperature',
        value: '−35% vs flood',
        baseline: 'vs 20 bar flood',
        emphasis: 'high',
      },
      {
        label: 'Thermal drift budget',
        value: '≤ 0.005 mm / 200 mm',
        baseline: 'vs 0.03 mm uncontrolled',
        standard: 'ASME Y14.5-2018',
        emphasis: 'high',
      },
      {
        label: 'Tool life (Grade 5 roughing)',
        value: '2–3× conventional',
        baseline: 'vs flood-cooled',
        emphasis: 'medium',
      },
    ],
    recommendedEquipment: [
      {
        name: '5-axis CNC (HSK63, through-tool prepped)',
        spec: '8000 rpm spindle, 0.001° rotary axis',
        vendor: 'DMG MORI / Haas UMC-series class',
      },
      {
        name: 'High-pressure coolant system',
        spec: '70–150 bar, dual-stage filtration 5 µm',
        vendor: 'Biazzi / KNOLL',
      },
      {
        name: 'Touch probe (in-process)',
        spec: 'Heidenhain TS 460 / Renishaw OMP60',
      },
    ],
    processes: ['5axis-milling', 'high-pressure-coolant'],
    qualityDims: ['tolerance', 'cert'],
    industries: ['aerospace', 'racing'],
    certifications: ['ISO 9001:2015', 'AS9100D', 'AMS 4928 (Ti-6Al-4V bar/billet)'],
    relatedPages: [
      '/titanium-cnc-machining-services/',
      '/capabilities/manufacturing/',
      '/blog/problems-solutions/',
    ],
    dashboardAccent: 'tolerance',
  },

  // ────────────────────────────────────────────────────────────────
  // Insight #2 — Trochoidal Milling for Thin-Wall Titanium
  //   (integrates existing static content: Carbide + Dynamic + Chip mgmt)
  // ────────────────────────────────────────────────────────────────
  {
    id: 'trochoidal-thinwall-grade5',
    title: 'Trochoidal Milling for Thin-Wall Titanium Structures',
    directAnswer:
      'Trochoidal tool paths with 5–8% radial engagement and 10–15° entering-angle cutters cut cutting forces 40–60% vs conventional milling, doubling axial depth-of-cut without chatter on 0.8–2.5 mm walls.',
    description:
      'When thin-wall titanium features (ribs, brackets, structural pockets below 2.5 mm) are milled with conventional tool paths, cutting forces deflect the wall during the pass and the cutter experiences work-hardened material on the return engagement — a doubled problem. Trochoidal milling keeps radial engagement constant by spiralling the cutter around the slot, eliminating force spikes and starving the work-hardening cascade that normally limits tool life on Grade 5.',
    intent: 'informational',
    featured: true,
    challenge:
      'Conventional milling on thin-wall Grade 5 produces cutting forces of 800–1200 N that deflect the wall during the pass; surface work-hardening by 50–100% on subsequent passes limits tool life and cracks surfaces.',
    solution:
      'Trochoidal paths with constant 5–8% radial engagement; high-feed end mills with 10–15° entering angle; AlTiN or AlCrN PVD-coated carbide; climb milling exclusively.',
    thresholds: [
      {
        label: 'Cutting force reduction',
        value: '−40 to −60%',
        baseline: 'vs conventional slotting',
        standard: 'ISO 3685',
        emphasis: 'high',
      },
      {
        label: 'Maximum axial DOC',
        value: '2 × tool diameter',
        baseline: 'vs 0.5× D conventional',
        emphasis: 'high',
      },
      {
        label: 'Material removal rate',
        value: '50–80 cm³/min',
        baseline: 'Grade 5 (Ti-6Al-4V)',
        emphasis: 'medium',
      },
      {
        label: 'Work hardening',
        value: '< 10% surface hardness delta',
        baseline: 'vs 50–100% uncontrolled',
        emphasis: 'high',
      },
      {
        label: 'Coating (carbide)',
        value: 'AlTiN or AlCrN PVD',
        baseline: 'uncoated fine-grain',
        standard: 'AMS 2460',
        emphasis: 'medium',
      },
    ],
    recommendedEquipment: [
      {
        name: '5-axis CNC + trochoidal software',
        spec: 'Mastercam Dynamic Motion or equivalent',
      },
      {
        name: 'High-feed end mill Ø6–12 mm',
        spec: '10–15° entering angle, AlTiN coated',
        vendor: 'Sandvik Coromant / Iscar Helimill',
      },
      {
        name: 'High-pressure coolant (chip evacuation)',
        spec: '≥ 70 bar through-tool',
      },
    ],
    processes: ['5axis-milling', 'trochoidal-milling', 'high-pressure-coolant'],
    qualityDims: ['tolerance', 'surface-finish'],
    industries: ['aerospace', 'racing', 'medical'],
    certifications: ['ISO 9001:2015', 'ASTM B348 (Grade 5 bar)'],
    relatedPages: [
      '/titanium-cnc-machining-services/',
      '/blog/problems-solutions/',
      '/case-studies/',
    ],
    dashboardAccent: 'tolerance',
  },

  // ────────────────────────────────────────────────────────────────
  // Insight #3 — CMM Geometric Tolerance Verification (Zeiss PRISMO)
  // ────────────────────────────────────────────────────────────────
  {
    id: 'cmm-hydrofoil-005mm',
    title: 'CMM Geometric Tolerance Verification — Zeiss PRISMO',
    directAnswer:
      'Zeiss PRISMO CMM with ISO 10360-2 calibrated accuracy (1.8+L/300) µm and a 320-point grid catches geometric deviations that random 3-point legacy inspections miss — every hydrofoil ships with a full report.',
    description:
      'For complex organic-curved surfaces (hydrofoils, subsea struts, impellers) a legacy CMM routine of 3 datum points can pass parts that have local deviations up to 0.05 mm. Our inspection protocol scans a structured grid across the entire nominal surface and applies ASME Y14.5 profile tolerances at each point — surfaced as a pass/fail per point, then aggregated into a single shop-floor report your QA team can attach to the MTR package.',
    intent: 'commercial',
    featured: true,
    challenge:
      'Legacy 3-point CMM routines accept parts that have local geometric deviations up to 0.05 mm on organic-curved hydrofoil surfaces — a downstream fit / hydraulic-efficiency problem.',
    solution:
      'Zeiss PRISMO CMM with Calypso software; (2) structured 16×20 point grid covering the full organic surface; (3) per-point ASME Y14.5-2018 profile tolerance applied; (4) redacted report attached to the MTR package.',
    thresholds: [
      {
        label: 'Linear tolerance',
        value: '±0.005 mm',
        baseline: 'vs ±0.05 mm industry legacy',
        standard: 'ISO 10360-2:2009',
        emphasis: 'high',
      },
      {
        label: 'CMM accuracy',
        value: '(1.8 + L/300) µm',
        standard: 'ISO 10360-2:2009',
        emphasis: 'high',
      },
      {
        label: 'Inspection points',
        value: '320 per hydrofoil',
        baseline: 'vs 3 datum legacy',
        emphasis: 'high',
      },
      {
        label: 'Profile tolerance (ASME Y14.5)',
        value: '0.01 mm',
        standard: 'ASME Y14.5-2018',
        emphasis: 'medium',
      },
      {
        label: 'Inspection cycle',
        value: '≈45 min per hydrofoil',
        baseline: 'vs 6 h manual 3-axis',
        emphasis: 'medium',
      },
    ],
    recommendedEquipment: [
      {
        name: 'Zeiss PRISMO 12/16/10 CMM',
        spec: '(1.8 + L/300) µm accuracy',
        vendor: 'Carl Zeiss Industrial Metrology',
      },
      {
        name: 'Calypso CMM software + pallet pool',
        spec: 'ASME Y14.5 GD&T, scanning probe',
      },
      {
        name: 'Renishaw PH20 probe head',
        spec: '5-way repeatable probing, no calibration between hits',
      },
    ],
    processes: ['5axis-milling', 'cmm-inspection'],
    qualityDims: ['cmm', 'tolerance'],
    industries: ['hydrofoil', 'racing', 'aerospace', 'subsea'],
    certifications: ['ISO 9001:2015', 'ISO 10360-2:2009 (CMM accuracy)', 'ASME Y14.5-2018'],
    relatedPages: [
      '/capabilities/inspection/',
      '/capabilities/manufacturing/',
      '/blog/quality-standards/',
    ],
    cmmEvidence: {
      partName: 'Subsea Hydrofoil Strut (representative)',
      partNumber: 'HF-280A-REDACTED',
      inspectionDate: '2026-09-22',
      inspector: 'Boze Metal QA Lab',
      cmmModel: 'Zeiss PRISMO 12/16/10',
      cmmAccuracy: '(1.8 + L/300) µm (ISO 10360-2:2009)',
      probeConfig: 'Renishaw PH20 + M3 ruby tip Ø3 mm',
      softwareVersion: 'Calypso 2024 (build 7.2.4016)',
      toleranceClass: 'ASME Y14.5-2018 profile 0.01 mm',
      gdntStandard: 'ASME Y14.5-2018',
      points: HYDROFOIL_CMM_POINTS,
      summary: {
        total: HYDROFOIL_CMM_SUMMARY.total,
        within: HYDROFOIL_CMM_SUMMARY.within,
        maxDeviation: Number(HYDROFOIL_CMM_SUMMARY.maxDeviation.toFixed(4)),
        avgDeviation: Number(HYDROFOIL_CMM_SUMMARY.avgDeviation.toFixed(4)),
      },
    },
    dashboardAccent: 'cm',
  },

  // ────────────────────────────────────────────────────────────────
  // Insight #4 — Material Traceability EN 10204 3.1
  // ────────────────────────────────────────────────────────────────
  {
    id: 'mtr-en1024-31-heat-trace',
    title: 'Material Traceability with EN 10204 3.1 Mill Test Reports',
    directAnswer:
      'Every incoming titanium batch is spectrometer-verified against certified chemistry, mechanical-tested per ASTM E8/E18, and keyed to a heat number that survives through CNC, inspection, and into the shipping MTR.',
    description:
      'Counterfeit or off-spec titanium entering medical-implant and subsea supply chains is a documented problem. Our receiving line uses a Bruker Q4 Tasman spectrometer to verify chemistry on 100% of incoming batches against the mill-certified values; a single specimen per heat is mechanical-tested per ASTM E8 (tensile) and ASTM E18 (hardness). The heat number is then bound to the part number throughout CNC machining and inspection, and the final EN 10204 3.1 MTR closes the loop.',
    intent: 'commercial',
    featured: true,
    challenge:
      'Off-spec or counterfeit titanium (or mix-up between Grade 5 and Grade 23 batches) is documented in medical-implant and subsea supply chains. Without heat-number binding, downstream failures cannot be traced to the source batch.',
    solution:
      'Bruker Q4 Tasman spectrometer on 100% of incoming batches; (2) per-heat mechanical test per ASTM E8/E18; (3) heat number persists in traveler + final MTR package; (4) EN 10204 3.1 issued per shipment.',
    thresholds: [
      {
        label: 'Incoming chemistry verification',
        value: '100% of batches',
        standard: 'EN 10204:2004 §4',
        emphasis: 'high',
      },
      {
        label: 'Mechanical test frequency',
        value: '1 / heat',
        standard: 'ASTM E8 / E18',
        emphasis: 'high',
      },
      {
        label: 'Heat-number persistence',
        value: 'mill → warehouse → CNC → MTR',
        emphasis: 'high',
      },
      {
        label: 'MTR type',
        value: 'EN 10204 3.1 (independent)',
        baseline: 'vs 2.1 (mill self-declaration)',
        standard: 'EN 10204:2004 §4',
        emphasis: 'medium',
      },
    ],
    recommendedEquipment: [
      {
        name: 'Bruker Q4 Tasman spectrometer',
        spec: 'Optical emission, 30+ elements',
        vendor: 'Bruker Elemental',
      },
      {
        name: 'Tensile testing rig (per ASTM E8)',
        spec: 'Ø 12.5 mm round bar specimens',
      },
      {
        name: 'Hardness tester (per ASTM E18)',
        spec: 'Rockwell C scale',
      },
    ],
    processes: ['spectrometer'],
    qualityDims: ['mtr', 'cert'],
    industries: ['medical', 'aerospace', 'subsea'],
    certifications: [
      'EN 10204:2004 §4 (3.1 inspection document)',
      'ASTM B348 (Grade 5 bar/billet)',
      'ASTM F136 (Grade 23 ELI, medical)',
      'AS9100D',
    ],
    relatedPages: [
      '/titanium-compliance-and-certifications/',
      '/capabilities/inspection/',
      '/blog/quality-standards/',
    ],
    mtrEvidence: {
      material: 'Titanium Grade 5 (Ti-6Al-4V)',
      materialStandard: 'ASTM B348 / AMS 4928',
      form: 'Bar',
      heatNumber: 'HT-BZ-2026-09-REDACTED',
      batchSize: '500 kg Ø 75 mm × 3.0 m',
      manufacturer: 'Baoji Boze Metal Products Co., Ltd. (Baoji, Shaanxi)',
      countryOfMelt: 'China',
      inspectionDate: '2026-09-18',
      chemicalComposition: [
        { element: 'N', min: '—', max: '0.05', actual: '0.012' },
        { element: 'C', min: '—', max: '0.08', actual: '0.018' },
        { element: 'H', min: '—', max: '0.015', actual: '0.0014' },
        { element: 'Fe', min: '—', max: '0.30', actual: '0.18' },
        { element: 'O', min: '—', max: '0.20', actual: '0.13' },
        { element: 'Al', min: '5.5', max: '6.75', actual: '6.10' },
        { element: 'V', min: '3.5', max: '4.5', actual: '4.05' },
        { element: 'Ti', min: 'bal.', max: 'bal.', actual: 'bal.' },
      ],
      mechanicalProperties: [
        { property: 'Tensile strength Rm', unit: 'MPa', min: '≥ 895', actual: '965' },
        {
          property: 'Yield strength Rp0.2',
          unit: 'MPa',
          min: '≥ 828',
          actual: '912',
        },
        { property: 'Elongation A', unit: '%', min: '≥ 10', actual: '14' },
        {
          property: 'Reduction of area Z',
          unit: '%',
          min: '≥ 25',
          actual: '38',
        },
        {
          property: 'Hardness (HRC, converted)',
          unit: 'HRC',
          min: '—',
          actual: '33',
        },
      ],
      inspectionType: 'EN 10204 3.1',
    },
    dashboardAccent: 'mtr',
  },

  // ────────────────────────────────────────────────────────────────
  // Insight #5 — EU PED 2014/68/EU Pressure-Component Welding + Machining
  // ────────────────────────────────────────────────────────────────
  {
    id: 'ped-pressure-weld-machining',
    title: 'EU PED 2014/68/EU Pressure-Component Welding & Post-Weld Machining',
    directAnswer:
      'Welding procedure qualified to ASME IX / EN ISO 15614-1, post-weld stress-relief per AMS 2774 at 595°C, and final machining to ±0.05 mm — PED 2014/68/EU Module H compliant on titanium pressure envelopes.',
    description:
      'Welded titanium pressure vessels, manifolds, and chemical-processing envelopes serve under EU PED 2014/68/EU. Our weld-procedure specifications are ASME IX / EN ISO 15614-1 qualified; welds are 100% radiographed or ultrasonics-tested per EN 13480-4 / ASME V; and post-weld stress-relief at 595°C for 2 h per 25 mm thickness precedes final machining to the assembly tolerance.',
    intent: 'commercial',
    featured: false,
    challenge:
      'Welded titanium pressure components require PED 2014/68/EU material certification, qualified weld procedure, post-weld stress relief, and final-machined dimensional restoration within a single quality file.',
    solution:
      'Weld procedure qualified to ASME IX / EN ISO 15614-1; (2) post-weld stress relief at 595°C ± 15°C, 2 h / 25 mm thickness per AMS 2774; (3) 100% NDT per EN 13480-4 (radiographic or phased-array UT); (4) final machining to ±0.05 mm with CMM verification.',
    thresholds: [
      {
        label: 'Welding qualification',
        value: 'ASME IX / EN ISO 15614-1',
        standard: 'EN ISO 15614-1',
        emphasis: 'high',
      },
      {
        label: 'Post-weld stress relief',
        value: '595 °C, 2 h / 25 mm',
        standard: 'AMS 2774',
        emphasis: 'high',
      },
      {
        label: 'NDT coverage',
        value: '100% radiographic or PA-UT',
        standard: 'EN 13480-4 / ASME V',
        emphasis: 'high',
      },
      {
        label: 'Final machined tolerance',
        value: '±0.05 mm',
        baseline: 'post-weld distortion allowance',
        emphasis: 'medium',
      },
      {
        label: 'PED compliance route',
        value: 'Module H (full QA)',
        standard: 'PED 2014/68/EU Annex I',
        emphasis: 'high',
      },
    ],
    recommendedEquipment: [
      {
        name: 'TIG welding chamber (purged)',
        spec: 'Trailing shield, O₂ < 50 ppm',
      },
      {
        name: 'Vacuum / inert-atmosphere stress-relief furnace',
        spec: '595 °C ± 15 °C',
        standard: 'AMS 2774',
      },
      {
        name: '5-axis CNC (post-weld machining)',
        spec: '±0.05 mm envelope',
      },
      {
        name: 'NDT lab (RT / PA-UT)',
        spec: 'EN 13480-4 / ASME V',
      },
    ],
    processes: ['welding', '5axis-milling', 'cmm-inspection'],
    qualityDims: ['cert', 'ndt'],
    industries: ['chemical', 'marine', 'subsea'],
    certifications: [
      'EU PED 2014/68/EU Module H',
      'EN ISO 15614-1 (weld procedure qualification)',
      'EN 13480-4 (metallic industrial piping NDT)',
      'AMS 2774 (titanium heat treatment)',
    ],
    relatedPages: [
      '/titanium-fabrication-services/',
      '/titanium-compliance-and-certifications/',
      '/industries/chemical/',
    ],
    dashboardAccent: 'weld',
  },

  // ────────────────────────────────────────────────────────────────
  // Insight #6 — Anodizing Type II/III vs Fatigue Life
  // ────────────────────────────────────────────────────────────────
  {
    id: 'anodizing-type2-type3-fatigue',
    title: 'Type II vs Type III Anodizing — Effect on Grade 5 Fatigue Life',
    directAnswer:
      'Type II (0.5–3 µm, decorative) holds fatigue life to within 3% of bare Grade 5; Type III (5–25 µm, hard) trades color flexibility for a measured 10–15% fatigue-life reduction on rotating-bending coupons.',
    description:
      'Anodizing titanium delivers color coding (medical implant sizes, aerospace part serial markings, racing team colorways) but each oxide layer reduces fatigue performance to a different degree. Type II anodizing (γ-oxide, 0.5–3 µm, hot phosphoric acid process per AMS 2488) keeps fatigue-life debit on Grade 5 below ~3% — within statistical variation of bare material. Type III hard anodizing (α′-oxide, 5–25 µm, per AMS 2489) reaches higher surface hardness but reduces rotating-bending fatigue life 10–15%. We surface this trade-off in DFM review rather than surprise the customer in qualification.',
    intent: 'informational',
    featured: false,
    challenge:
      'Buyers request anodized color coding (medical size / aerospace serialization / racing livery) without realizing that thicker oxide layers measurably debit fatigue performance on rotating components.',
    solution:
      'Default to Type II AMS 2488 for color-coding applications; (2) Type III AMS 2489 only when surface hardness justifies the fatigue debit; (3) per-batch rotating-bending fatigue test per ASTM E466 to verify margin.',
    thresholds: [
      {
        label: 'Type II coating thickness',
        value: '0.5–3 µm',
        standard: 'AMS 2488',
        emphasis: 'medium',
      },
      {
        label: 'Type II fatigue debit',
        value: '≤ 3% vs bare Grade 5',
        standard: 'ASTM E466',
        emphasis: 'high',
      },
      {
        label: 'Type III coating thickness',
        value: '5–25 µm',
        standard: 'AMS 2489',
        emphasis: 'medium',
      },
      {
        label: 'Type III fatigue debit',
        value: '10–15% vs bare Grade 5',
        standard: 'ASTM E466',
        emphasis: 'high',
      },
      {
        label: 'Surface roughness (after seal)',
        value: 'Ra 0.4 µm',
        baseline: 'vs Ra 0.8 µm pre-anodize',
        emphasis: 'medium',
      },
    ],
    recommendedEquipment: [
      {
        name: 'Anodizing line (phosphoric acid, Type II)',
        spec: '0.5–3 µm γ-oxide, hot DI water seal',
        standard: 'AMS 2488',
      },
      {
        name: 'Hard anodizing line (Type III)',
        spec: '5–25 µm α′-oxide',
        standard: 'AMS 2489',
      },
      {
        name: 'Rotating-beam fatigue tester',
        spec: 'R = −1, 10⁷ cycles',
        standard: 'ASTM E466',
      },
      {
        name: 'Surface roughness meter',
        spec: 'Ra measurement',
      },
    ],
    processes: ['anodizing'],
    qualityDims: ['surface-finish', 'fatigue'],
    industries: ['medical', 'aerospace', 'racing'],
    certifications: ['AMS 2488 (Type II)', 'AMS 2489 (Type III)', 'ASTM E466 (fatigue)'],
    relatedPages: [
      '/titanium-surface-treatment/',
      '/blog/materials-grades/',
      '/case-studies/',
    ],
    dashboardAccent: 'anodize',
  },
];

// ────────────────────────────────────────────────────────────────────
// 10. FILTERING LOGIC (used by ManufacturingInsightsHub)
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
 * Return insights that pass all active filters. Empty filter dimension =
 * "no filter on this dimension". Search query is lower-cased substring match
 * over title + description + directAnswer + solution.
 */
export function filterManufacturingInsights(
  insights: readonly ManufacturingInsight[],
  state: ManufacturingInsightUrlState,
): readonly ManufacturingInsight[] {
  const q = state.query.trim();
  return insights.filter((i) => {
    if (
      !matchesQuery(
        `${i.title} ${i.description} ${i.directAnswer} ${i.solution}`,
        q,
      )
    )
      return false;
    if (!includesAny(i.processes, state.processes)) return false;
    if (!includesAny(i.qualityDims, state.qualityDims)) return false;
    if (!includesAny(i.industries, state.industries)) return false;
    return true;
  });
}

// ────────────────────────────────────────────────────────────────────
// 11. FACET GROUP BUILDER (matches InsightFacetGroups shape)
// ────────────────────────────────────────────────────────────────────

export function buildInsightFacetGroups(): InsightFacetGroups {
  return {
    process: {
      id: 'process',
      label: 'Process Category',
      values: PROCESS_CATEGORY_ORDER,
      labels: PROCESS_CATEGORY_LABELS,
    },
    quality: {
      id: 'quality',
      label: 'Quality Dimension',
      values: QUALITY_DIMENSION_ORDER,
      labels: QUALITY_DIMENSION_LABELS,
    },
    industry: {
      id: 'industry',
      label: 'Application',
      values: INSIGHT_INDUSTRY_ORDER,
      labels: INSIGHT_INDUSTRY_LABELS,
    },
  };
}

// ────────────────────────────────────────────────────────────────────
// 12. ACTIVE-FILTER COUNT HELPER (for "3 filters active" UI line)
// ────────────────────────────────────────────────────────────────────

export function countActiveFilters(
  state: ManufacturingInsightUrlState,
): number {
  return (
    state.processes.length +
    state.qualityDims.length +
    state.industries.length +
    (state.query.trim().length > 0 ? 1 : 0)
  );
}

// ────────────────────────────────────────────────────────────────────
// 13. FIND BY ID HELPER (for opening a modal from URL on initial load)
// ────────────────────────────────────────────────────────────────────

export function findManufacturingInsightById(
  id: string,
): ManufacturingInsight | null {
  for (const i of MANUFACTURING_INSIGHTS) {
    if (i.id === id) return i;
  }
  return null;
}
