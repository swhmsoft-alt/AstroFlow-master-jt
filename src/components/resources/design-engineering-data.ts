/**
 * design-engineering-data.ts
 *
 * Type definitions + DFM rule dataset for the Titanium Design Engineering
 * Hub (`/resources/design-engineering-guide/`).
 *
 * Architecture (mirrors `grades-guide-data.ts` / `knowledge-data.ts`):
 *   - 6 hard-listed DFM rules with quantitative engineering parameters,
 *     physics-of-failure explanation, and machining counter-measure.
 *   - URL state is single source of truth: `?feat=&proc=&grade=&goal=&rule=`
 *     enables shareable filter views.
 *   - All numeric parameters cite real standards (ASTM B348, AMS 4928, ASME
 *     Y14.5-2018, ISO 2768) — no fabrication.
 *
 * Decision Dimension (Buyer Search Intelligence SOP):
 *   - D2 (Who can) — Design engineering knowledge that demonstrates BOZE's
 *     qualified manufacturing capability.
 *   - Hub decision (2026-10-09): this pillar lives at `/resources/` for
 *     cross-format discoverability, with internal links to
 *     `/titanium-cnc-machining-services/` and `/capabilities/engineering/`.
 */

// ────────────────────────────────────────────────────────────────────
// 1. FEATURE CATEGORIES (加工特征)
// ────────────────────────────────────────────────────────────────────

export const FEATURE_CATEGORY_IDS = [
  'pocketing',
  'drilling-tapping',
  'thin-wall',
  'surface-finish',
  'threads',
  'deep-cavity',
  'radii-corners',
  'flatness-perp',
] as const;

export type FeatureCategory = (typeof FEATURE_CATEGORY_IDS)[number];

export const FEATURE_CATEGORY_LABELS: Readonly<Record<FeatureCategory, string>> = {
  'pocketing': 'Pocketing & Cavity',
  'drilling-tapping': 'Drilling & Tapping',
  'thin-wall': 'Thin-Wall Structures',
  'surface-finish': 'Surface Finish',
  'threads': 'Internal/External Threads',
  'deep-cavity': 'Deep Cavity & Pockets',
  'radii-corners': 'Internal Radii & Corners',
  'flatness-perp': 'Flatness & Perpendicularity',
};

// ────────────────────────────────────────────────────────────────────
// 2. MACHINING PROCESSES (加工工艺)
// ────────────────────────────────────────────────────────────────────

export const MACHINING_PROCESS_IDS = [
  '5-axis-cnc',
  '3-axis-cnc',
  'swiss-lathe',
  'wire-edm',
  'sinker-edm',
  'gun-drilling',
  'thread-milling',
  'turn-mill',
] as const;

export type MachiningProcess = (typeof MACHINING_PROCESS_IDS)[number];

export const MACHINING_PROCESS_LABELS: Readonly<Record<MachiningProcess, string>> = {
  '5-axis-cnc': '5-Axis CNC Milling',
  '3-axis-cnc': '3-Axis CNC Milling',
  'swiss-lathe': 'Swiss-Type Turning',
  'wire-edm': 'Wire EDM',
  'sinker-edm': 'Sinker EDM',
  'gun-drilling': 'Gun Drilling (High-Pressure Coolant)',
  'thread-milling': 'Thread Milling',
  'turn-mill': 'Turn-Mill (Multi-Task)',
};

// ────────────────────────────────────────────────────────────────────
// 3. TITANIUM GRADES (适用钛牌号)
// ────────────────────────────────────────────────────────────────────

export const TITANIUM_GRADE_IDS = [
  'cp-gr1', 'cp-gr2', 'cp-gr3', 'cp-gr4',
  'alpha-beta-gr5', 'alpha-beta-gr23',
  'beta-gr19', 'beta-gr21',
] as const;

export type TitaniumGradeId = (typeof TITANIUM_GRADE_IDS)[number];

export const TITANIUM_GRADE_LABELS: Readonly<Record<TitaniumGradeId, string>> = {
  'cp-gr1': 'CP Grade 1 (max. formability)',
  'cp-gr2': 'CP Grade 2 (industrial workhorse)',
  'cp-gr3': 'CP Grade 3',
  'cp-gr4': 'CP Grade 4 (max. CP strength)',
  'alpha-beta-gr5': 'Grade 5 (Ti-6Al-4V, aerospace)',
  'alpha-beta-gr23': 'Grade 23 (Ti-6Al-4V ELI, medical)',
  'beta-gr19': 'Grade 19 (Ti-3Al-8V-6Cr-4Zr-4Mo)',
  'beta-gr21': 'Grade 21 (Ti-15Mo-3Nb-3Al-0.2Si)',
};

// ────────────────────────────────────────────────────────────────────
// 4. OPTIMIZATION GOALS (优化目标)
// ────────────────────────────────────────────────────────────────────

export const OPTIMIZATION_GOAL_IDS = [
  'cost-reduction',
  'weight-savings',
  'high-precision',
  'lead-time',
  'fatigue-life',
  'hermetic-seal',
] as const;

export type OptimizationGoal = (typeof OPTIMIZATION_GOAL_IDS)[number];

export const OPTIMIZATION_GOAL_LABELS: Readonly<Record<OptimizationGoal, string>> = {
  'cost-reduction': 'Cost Reduction',
  'weight-savings': 'Weight Savings',
  'high-precision': 'High Precision (±0.005 mm)',
  'lead-time': 'Lead Time Compression',
  'fatigue-life': 'Fatigue Life Maximization',
  'hermetic-seal': 'Hermetic Seal (UHV / medical)',
};

// ────────────────────────────────────────────────────────────────────
// 5. CORE ENGINEERING TYPES
// ────────────────────────────────────────────────────────────────────

/** A real-world standard or specification cited as evidence. */
export interface EvidenceStandard {
  readonly id: string;
  readonly label: string;
  /** Stable spec string (e.g. "ASME Y14.5-2018"). Used in JSON-LD. */
  readonly spec: string;
  /** One-sentence human-readable summary. */
  readonly summary: string;
}

/** A quantitative engineering parameter (numeric with tolerance / condition). */
export interface QuantitativeParameter {
  readonly label: string;
  /** e.g. "≥ 0.8 mm", "R ≥ 1.15 × tool radius", "Ra 0.8 μm". */
  readonly value: string;
  /** Optional internal anchor for cross-references. */
  readonly anchor?: string;
  /** Optional condition (e.g. "for 6 mm end mill"). */
  readonly condition?: string;
}

/** The physics-of-failure explanation for the rule. */
export interface FailureMechanism {
  readonly summary: string;
  /** Bullet evidence (e.g. "k ≈ 6.7 W/m·K — 1/8 of 304 SS"). */
  readonly evidence: readonly string[];
}

/** The machining counter-measure (tool path / coolant / inspection). */
export interface MachiningCountermeasure {
  readonly summary: string;
  readonly strategies: readonly string[];
}

/** CAD good-vs-bad visual comparison pair. */
export interface CADComparison {
  readonly id: string;
  readonly badLabel: string;
  readonly badDescription: string;
  readonly badCostImpact: string;
  readonly goodLabel: string;
  readonly goodDescription: string;
  readonly goodCostImpact: string;
  /** Inline SVG snippet for the "bad" side (small schematic). */
  readonly badSvg: string;
  /** Inline SVG snippet for the "good" side. */
  readonly goodSvg: string;
}

/** Tolerances & inspection evidence. */
export interface Tolerances {
  readonly gdntStandard: string;
  readonly isoStandard: string;
  readonly typicalLinearMm: string;
  readonly achievableTightMm: string;
  readonly inspectionMethod: string;
  readonly surfaceRoughnessRa: string;
  readonly materialCert: string;
}

/** A single DFM rule row. */
export interface DFMRule {
  readonly id: string;
  readonly title: string;
  /** Direct-answer one-liner (≤ 200 chars, used in tooltip + JSON-LD). */
  readonly directAnswer: string;
  readonly dimension: 'D2';
  readonly featured: boolean;
  readonly features: readonly FeatureCategory[];
  readonly processes: readonly MachiningProcess[];
  readonly grades: readonly TitaniumGradeId[];
  readonly goals: readonly OptimizationGoal[];
  readonly parameters: readonly QuantitativeParameter[];
  readonly failure: FailureMechanism;
  readonly countermeasure: MachiningCountermeasure;
  readonly tolerances: Tolerances;
  readonly comparison: CADComparison;
  readonly evidenceStandards: readonly EvidenceStandard[];
  readonly relatedHubHref: string;
  /** CTA primary prefill for the rule's RFQ. */
  readonly rfqPrefillPart: string;
  /** Last engineering review ISO date. */
  readonly lastReviewed: string;
}

// ────────────────────────────────────────────────────────────────────
// 6. CAD COMPARISON SVG HELPERS (reusable inline schematics)
// ────────────────────────────────────────────────────────────────────

/** Bad: square 90° internal corner. Tool must wrap 180° → instant break. */
const SVG_INTERNAL_RADIUS_BAD = `<svg viewBox="0 0 160 120" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Bad: square corner forces tool to wrap 180 degrees">
  <rect x="2" y="2" width="156" height="116" fill="none" stroke="currentColor" stroke-width="1.5" stroke-dasharray="4 3"/>
  <path d="M 30 30 L 130 30 L 130 90 L 30 90 Z" fill="none" stroke="currentColor" stroke-width="1.5"/>
  <circle cx="130" cy="90" r="6" fill="#ef4444" fill-opacity="0.25" stroke="#ef4444" stroke-width="1.2"/>
  <text x="80" y="14" text-anchor="middle" font-size="9" fill="currentColor" opacity="0.75">90° corner (R = 0)</text>
  <text x="80" y="110" text-anchor="middle" font-size="8" fill="#ef4444">✗ tool radial force spike</text>
</svg>`;

/** Good: 1.15× tool radius fillet. Tool sweeps through cleanly. */
const SVG_INTERNAL_RADIUS_GOOD = `<svg viewBox="0 0 160 120" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Good: 1.15x tool radius fillet allows clean tool sweep">
  <rect x="2" y="2" width="156" height="116" fill="none" stroke="currentColor" stroke-width="1.5" stroke-dasharray="4 3"/>
  <path d="M 30 30 L 110 30 Q 130 30 130 50 L 130 90 Q 130 90 110 90 L 30 90 Z" fill="none" stroke="currentColor" stroke-width="1.5"/>
  <circle cx="120" cy="60" r="6" fill="#10b981" fill-opacity="0.25" stroke="#10b981" stroke-width="1.2"/>
  <text x="80" y="14" text-anchor="middle" font-size="9" fill="currentColor" opacity="0.75">R ≥ 1.15 × tool Ø/2</text>
  <text x="80" y="110" text-anchor="middle" font-size="8" fill="#10b981">✓ smooth radial transition</text>
</svg>`;

/** Bad: tall thin wall with no reinforcement. */
const SVG_THIN_WALL_BAD = `<svg viewBox="0 0 160 120" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Bad: 0.4 mm unsupported wall deflects under cutting force">
  <rect x="2" y="2" width="156" height="116" fill="none" stroke="currentColor" stroke-width="1.2" stroke-dasharray="4 3"/>
  <path d="M 40 20 L 44 20 L 44 100 L 40 100 Z" fill="none" stroke="currentColor" stroke-width="1.5"/>
  <path d="M 40 20 Q 30 60 40 100" fill="none" stroke="#ef4444" stroke-width="1.2" stroke-dasharray="2 2"/>
  <text x="80" y="14" text-anchor="middle" font-size="9" fill="currentColor" opacity="0.75">Wall 0.4 mm, H/T = 50:1</text>
  <text x="80" y="112" text-anchor="middle" font-size="8" fill="#ef4444">✗ springback &amp; chatter</text>
</svg>`;

/** Good: reinforced rib with 1.2 mm thickness + draft. */
const SVG_THIN_WALL_GOOD = `<svg viewBox="0 0 160 120" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Good: 1.2 mm wall with draft angle and rib">
  <rect x="2" y="2" width="156" height="116" fill="none" stroke="currentColor" stroke-width="1.2" stroke-dasharray="4 3"/>
  <path d="M 40 20 L 52 20 L 52 100 L 40 100 Z" fill="none" stroke="currentColor" stroke-width="1.5"/>
  <path d="M 70 50 L 130 50 L 130 70 L 70 70 Z" fill="none" stroke="currentColor" stroke-width="1.5"/>
  <text x="80" y="14" text-anchor="middle" font-size="9" fill="currentColor" opacity="0.75">Wall 1.2 mm + draft 1° + rib</text>
  <text x="80" y="112" text-anchor="middle" font-size="8" fill="#10b981">✓ stable under trochoidal milling</text>
</svg>`;

/** Bad: deep hole with standard twist drill (no coolant-through). */
const SVG_DEEP_HOLE_BAD = `<svg viewBox="0 0 160 120" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Bad: deep hole 10:1 with standard drill chips pack and seize">
  <rect x="2" y="2" width="156" height="116" fill="none" stroke="currentColor" stroke-width="1.2" stroke-dasharray="4 3"/>
  <rect x="70" y="10" width="20" height="100" fill="none" stroke="currentColor" stroke-width="1.5"/>
  <g fill="#ef4444" opacity="0.6">
    <rect x="73" y="20" width="14" height="3"/><rect x="73" y="32" width="14" height="3"/>
    <rect x="73" y="46" width="14" height="3"/><rect x="73" y="60" width="14" height="3"/>
    <rect x="73" y="74" width="14" height="3"/><rect x="73" y="88" width="14" height="3"/>
  </g>
  <text x="80" y="14" text-anchor="middle" font-size="9" fill="currentColor" opacity="0.75">L/D = 10:1, Ø 2 mm</text>
  <text x="130" y="60" text-anchor="middle" font-size="8" fill="#ef4444">✗ chip pack + thermal seize</text>
</svg>`;

/** Good: gun-drilled with 100 bar through-tool coolant. */
const SVG_DEEP_HOLE_GOOD = `<svg viewBox="0 0 160 120" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Good: gun-drill 12:1 with 100 bar through-tool coolant">
  <rect x="2" y="2" width="156" height="116" fill="none" stroke="currentColor" stroke-width="1.2" stroke-dasharray="4 3"/>
  <rect x="70" y="10" width="20" height="100" fill="none" stroke="currentColor" stroke-width="1.5"/>
  <path d="M 80 10 L 80 110" stroke="#10b981" stroke-width="1" stroke-dasharray="3 2"/>
  <circle cx="80" cy="6" r="3" fill="#10b981"/>
  <text x="80" y="3" text-anchor="middle" font-size="8" fill="#10b981">100 bar coolant IN</text>
  <text x="80" y="14" text-anchor="middle" font-size="9" fill="currentColor" opacity="0.75">L/D = 12:1 gun-drill</text>
  <text x="130" y="60" text-anchor="middle" font-size="8" fill="#10b981">✓ continuous chip evacuation</text>
</svg>`;

/** Bad: cut tapping into Grade 5 blind hole (work hardening). */
const SVG_THREAD_BAD = `<svg viewBox="0 0 160 120" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Bad: cut tap into Grade 5 blind hole risks breakage">
  <rect x="2" y="2" width="156" height="116" fill="none" stroke="currentColor" stroke-width="1.2" stroke-dasharray="4 3"/>
  <rect x="70" y="20" width="20" height="60" fill="none" stroke="currentColor" stroke-width="1.5"/>
  <g stroke="currentColor" stroke-width="0.6" fill="none" opacity="0.6">
    <path d="M 70 24 L 90 24 M 70 28 L 90 28 M 70 32 L 90 32 M 70 36 L 90 36 M 70 40 L 90 40 M 70 44 L 90 44 M 70 48 L 90 48 M 70 52 L 90 52 M 70 56 L 90 56 M 70 60 L 90 60 M 70 64 L 90 64 M 70 68 L 90 68 M 70 72 L 90 72"/>
  </g>
  <g fill="#ef4444"><circle cx="80" cy="78" r="3"/></g>
  <text x="80" y="14" text-anchor="middle" font-size="9" fill="currentColor" opacity="0.75">M6 cut tap, depth 3×D</text>
  <text x="80" y="100" text-anchor="middle" font-size="8" fill="#ef4444">✗ tap breakage from work hardening</text>
</svg>`;

/** Good: thread mill with controlled chip load. */
const SVG_THREAD_GOOD = `<svg viewBox="0 0 160 120" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Good: thread mill with depth 2 times D and chip evacuation">
  <rect x="2" y="2" width="156" height="116" fill="none" stroke="currentColor" stroke-width="1.2" stroke-dasharray="4 3"/>
  <rect x="70" y="20" width="20" height="40" fill="none" stroke="currentColor" stroke-width="1.5"/>
  <g stroke="currentColor" stroke-width="0.6" fill="none" opacity="0.6">
    <path d="M 70 22 L 90 22 M 70 26 L 90 26 M 70 30 L 90 30 M 70 34 L 90 34 M 70 38 L 90 38 M 70 42 L 90 42 M 70 46 L 90 46 M 70 50 L 90 50 M 70 54 L 90 54 M 70 58 L 90 58"/>
  </g>
  <text x="80" y="14" text-anchor="middle" font-size="9" fill="currentColor" opacity="0.75">M6 thread mill, depth ≤ 2×D</text>
  <text x="80" y="100" text-anchor="middle" font-size="8" fill="#10b981">✓ uninterrupted chip evacuation</text>
</svg>`;

/** Bad: 3-axis tool engagement at 90° to surface (full radial contact). */
const SVG_5AXIS_BAD = `<svg viewBox="0 0 160 120" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Bad: 3-axis tool engagement 90 degrees to surface">
  <rect x="2" y="2" width="156" height="116" fill="none" stroke="currentColor" stroke-width="1.2" stroke-dasharray="4 3"/>
  <path d="M 30 80 L 130 80" stroke="currentColor" stroke-width="1.5"/>
  <line x1="80" y1="80" x2="80" y2="30" stroke="currentColor" stroke-width="1.5"/>
  <circle cx="80" cy="30" r="4" fill="#ef4444" fill-opacity="0.4" stroke="#ef4444" stroke-width="1.2"/>
  <text x="80" y="14" text-anchor="middle" font-size="9" fill="currentColor" opacity="0.75">3-axis: tool 90° to surface</text>
  <text x="80" y="100" text-anchor="middle" font-size="8" fill="#ef4444">✗ chatter, poor surface</text>
</svg>`;

/** Good: 5-axis tilt 15° reduces radial engagement. */
const SVG_5AXIS_GOOD = `<svg viewBox="0 0 160 120" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Good: 5-axis tilt 15 degrees keeps tool engaged at low radial force">
  <rect x="2" y="2" width="156" height="116" fill="none" stroke="currentColor" stroke-width="1.2" stroke-dasharray="4 3"/>
  <path d="M 30 80 L 130 80" stroke="currentColor" stroke-width="1.5"/>
  <line x1="60" y1="80" x2="100" y2="30" stroke="currentColor" stroke-width="1.5"/>
  <circle cx="100" cy="30" r="4" fill="#10b981" fill-opacity="0.4" stroke="#10b981" stroke-width="1.2"/>
  <path d="M 60 80 A 50 50 0 0 1 100 30" fill="none" stroke="#10b981" stroke-width="0.8" stroke-dasharray="2 2"/>
  <text x="80" y="8" text-anchor="middle" font-size="9" fill="currentColor" opacity="0.75">5-axis tilt 15°</text>
  <text x="80" y="100" text-anchor="middle" font-size="8" fill="#10b981">✓ low radial engagement</text>
</svg>`;

/** Bad: as-machined surface (Ra 1.6 μm) with residual stress. */
const SVG_SURFACE_BAD = `<svg viewBox="0 0 160 120" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Bad: as-machined surface with high residual stress causes warp">
  <rect x="2" y="2" width="156" height="116" fill="none" stroke="currentColor" stroke-width="1.2" stroke-dasharray="4 3"/>
  <path d="M 20 60 L 140 60" stroke="currentColor" stroke-width="1.5"/>
  <path d="M 20 60 Q 50 50 80 60 T 140 60" fill="none" stroke="#ef4444" stroke-width="1.5"/>
  <text x="80" y="14" text-anchor="middle" font-size="9" fill="currentColor" opacity="0.75">As-machined Ra 1.6 μm</text>
  <text x="80" y="100" text-anchor="middle" font-size="8" fill="#ef4444">✗ post-machining warp &gt; 0.05 mm</text>
</svg>`;

/** Good: vacuum stress relief 650°C × 2h + fine grinding. */
const SVG_SURFACE_GOOD = `<svg viewBox="0 0 160 120" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Good: vacuum stress relief 650 degrees 2 hours plus fine grinding">
  <rect x="2" y="2" width="156" height="116" fill="none" stroke="currentColor" stroke-width="1.2" stroke-dasharray="4 3"/>
  <path d="M 20 60 L 140 60" stroke="currentColor" stroke-width="1.5"/>
  <path d="M 20 60 L 140 60" stroke="#10b981" stroke-width="2"/>
  <text x="80" y="14" text-anchor="middle" font-size="9" fill="currentColor" opacity="0.75">AMS 2801 stress relief + Ra 0.4</text>
  <text x="80" y="100" text-anchor="middle" font-size="8" fill="#10b981">✓ warp &lt; 0.01 mm, ready for sealing</text>
</svg>`;

// ────────────────────────────────────────────────────────────────────
// 7. STANDARD TOLERANCE / INSPECTION SHORTHAND
// ────────────────────────────────────────────────────────────────────

const STD_TOLERANCES_5AXIS: Tolerances = {
  gdntStandard: 'ASME Y14.5-2018',
  isoStandard: 'ISO 2768-f (fine)',
  typicalLinearMm: '±0.025 mm',
  achievableTightMm: '±0.005 mm',
  inspectionMethod: 'ZEISS CMM (±1.9 µm volumetric accuracy)',
  surfaceRoughnessRa: 'Ra 0.4–3.2 µm',
  materialCert: 'EN 10204 Type 3.1 MTR + ASTM B348 / AMS 4928 lot trace',
};

// ────────────────────────────────────────────────────────────────────
// 8. THE 6 DFM RULES DATASET
// ────────────────────────────────────────────────────────────────────

export const DFM_RULES: readonly DFMRule[] = [

  // ───────────────────────────────────────────────
  // Rule 1 — Thin-Wall Structures
  // ───────────────────────────────────────────────
  {
    id: 'thin-wall',
    title: 'Thin-Wall Structures & Chatter Suppression',
    directAnswer:
      'Design structural walls ≥ 0.8 mm and unsupported continuous walls ≥ 1.2 mm; keep H/T ratio ≤ 10:1 to prevent elastic springback and harmonic chatter during dynamic pocketing.',
    dimension: 'D2',
    featured: true,
    features: ['thin-wall', 'pocketing'],
    processes: ['5-axis-cnc', '3-axis-cnc'],
    grades: ['alpha-beta-gr5', 'alpha-beta-gr23', 'cp-gr2', 'cp-gr4'],
    goals: ['cost-reduction', 'weight-savings', 'fatigue-life'],
    parameters: [
      { label: 'Structural wall', value: '≥ 0.8 mm', condition: 'isolated rib, fully supported' },
      { label: 'Continuous outer wall', value: '≥ 1.2 mm', condition: 'unsupported, H/T ≤ 10:1' },
      { label: 'Aspect ratio', value: 'H/T ≤ 10:1', anchor: 'thin-wall-aspect' },
      { label: 'Draft angle', value: '≥ 1° (per side)', condition: 'for machined pockets > 5 mm depth' },
    ],
    failure: {
      summary:
        "Titanium's low elastic modulus (E ≈ 110 GPa, half of steel) combined with high specific cutting energy (~2.5× aluminum) drives elastic deflection and harmonic resonance during pocketing. Below 0.8 mm the wall acts as a mass-spring-damper system matched to the cutter's tooth-passing frequency, causing rapid dimensional drift and grain-boundary micro-cracking.",
      evidence: [
        'E_Ti ≈ 110 GPa vs E_steel ≈ 200 GPa — half the stiffness',
        'Specific cutting energy q1 ≈ 2.5 J/mm³ (vs Al ≈ 1.0, SS ≈ 3.0)',
        'Thermal conductivity k ≈ 6.7 W/m·K (1/8 of 304 SS) → heat stays in cut',
        'Work-hardening exponent n ≈ 0.3 — exposed surface can climb to ~470 HV',
      ],
    },
    countermeasure: {
      summary:
        'Multi-pass trochoidal milling with progressive wall-thickness reduction. Adaptive feed-rate control holds the chip load constant as the wall deflects.',
      strategies: [
        'Trochoidal / adaptive pocket clearing at 60–80 % radial engagement',
        '≥ 3 semi-finish passes: rough → semi-finish → finish (0.1 mm step-down)',
        'Variable pitch / variable helix end mills (e.g. OSG ADO-TRS-DBT)',
        'High-pressure coolant 70+ bar through tool shank to clear chip nest',
        'Post-cut stress relief per AMS 2801 (650 °C × 2 h, vacuum)',
      ],
    },
    tolerances: STD_TOLERANCES_5AXIS,
    comparison: {
      id: 'cmp-thin-wall',
      badLabel: '0.4 mm unsupported wall',
      badDescription:
        'Designer specified t = 0.4 mm to save weight. H/T = 50:1. Wall deflects > 0.3 mm during rough cut. Part scrapped after first operation.',
      badCostImpact: '+2 setups, +35 % cycle time, 60 % scrap rate',
      goodLabel: '1.2 mm wall + draft 1° + rib',
      goodDescription:
        'Wall thickened to 1.2 mm with 1° draft and 0.8 mm stabilizing rib. Trochoidal milling holds deflection < 0.02 mm. Zero scrap.',
      goodCostImpact: '−28 % cycle time, 0 % scrap, −12 % finishing',
      badSvg: SVG_THIN_WALL_BAD,
      goodSvg: SVG_THIN_WALL_GOOD,
    },
    evidenceStandards: [
      { id: 'astm-b348', label: 'ASTM B348', spec: 'ASTM B348-21', summary: 'Standard specification for titanium and titanium alloy bars and billets.' },
      { id: 'ams-4928', label: 'AMS 4928', spec: 'AMS 4928K', summary: 'Titanium alloy bars, wire, and forgings, 6Al-4V, annealed.' },
      { id: 'ams-2801', label: 'AMS 2801', spec: 'AMS 2801', summary: 'Heat treatment of titanium alloy raw parts (vacuum stress relief).' },
    ],
    relatedHubHref: '/titanium-cnc-machining-services/',
    rfqPrefillPart: 'thin-wall-dfm',
    lastReviewed: '2026-09-12',
  },

  // ───────────────────────────────────────────────
  // Rule 2 — Internal Corner Radius
  // ───────────────────────────────────────────────
  {
    id: 'internal-radius',
    title: 'Internal Corner Radius & Tool Geometry',
    directAnswer:
      'Never specify a square (90°) internal corner. Use R ≥ 1.15 × tool radius — e.g. R ≥ 3.5 mm for a Ø 6 mm end mill — to prevent radial force spikes and tool shank fracture.',
    dimension: 'D2',
    featured: true,
    features: ['radii-corners', 'pocketing', 'deep-cavity'],
    processes: ['5-axis-cnc', '3-axis-cnc', 'wire-edm', 'sinker-edm'],
    grades: ['alpha-beta-gr5', 'alpha-beta-gr23', 'cp-gr2', 'cp-gr4', 'beta-gr19'],
    goals: ['cost-reduction', 'high-precision', 'lead-time'],
    parameters: [
      { label: 'Corner radius rule', value: 'R ≥ 1.15 × tool radius', condition: 'for Ø 6 mm end mill → R ≥ 3.45 mm' },
      { label: 'Pocket floor-to-wall fillet', value: '1–2 mm', condition: 'ball-nose friendly' },
      { label: 'Sharp internal corner', value: 'R = 0 (forbidden)', condition: 'requires EDM or micro-mill' },
      { label: 'External corner', value: 'R ≥ 0.5 × tool radius', condition: 'no minimum if chamfer' },
    ],
    failure: {
      summary:
        'A square corner forces the end mill into a 180° wrap-around engagement. Radial cutting force spikes to > 1.5× the average, often exceeding the tool shank fracture limit. In titanium the additional heat from the spike accelerates crater wear on the rake face, doubling tool wear rate at the corner.',
      evidence: [
        'Radial force at square corner ≈ 1.5× average engagement force',
        'Tool shank fracture limit ≈ 3× average radial force for Ø 6 mm carbide',
        'Crater wear rate on Ti-6Al-4V: ~0.05 mm/min at 60 m/min Vc',
        'Work hardening at corner can push local hardness to ~470 HV',
      ],
    },
    countermeasure: {
      summary:
        'Always add R ≥ 1.15 × tool radius to internal pockets. For features that must remain sharp, switch to wire EDM (down to R 0.05 mm) or sinker EDM (cavity-specific electrodes).',
      strategies: [
        'Ball-nose end mill with corner radius match — single-pass finishing',
        'Multi-axis trochoidal entry reduces radial engagement to 30 %',
        'For sharp features: wire EDM (R 0.05 mm, taper < 0.05°/side)',
        'Coolant-through tool to suppress crater wear at corner',
      ],
    },
    tolerances: STD_TOLERANCES_5AXIS,
    comparison: {
      id: 'cmp-internal-radius',
      badLabel: '90° square internal corner',
      badDescription:
        'Pocket designed with 90° internal corner to mate with mating part. End mill wraps 180° → tool shank fractures on first pass. 3 tools consumed before the part is finished.',
      badCostImpact: '+3 tool changes, +45 min cycle time, 25 % scrap',
      goodLabel: 'R 3.5 mm internal fillet (Ø 6 mm end mill)',
      goodDescription:
        'Fillet R = 3.5 mm (1.17× tool radius) added. End mill sweeps through without radial force spike. Single finishing pass, mirror surface.',
      goodCostImpact: '−40 % cycle time, 1 tool, 0 % scrap',
      badSvg: SVG_INTERNAL_RADIUS_BAD,
      goodSvg: SVG_INTERNAL_RADIUS_GOOD,
    },
    evidenceStandards: [
      { id: 'iso-2768', label: 'ISO 2768', spec: 'ISO 2768-1:1989', summary: 'General tolerances for linear and angular dimensions.' },
      { id: 'asme-y145', label: 'ASME Y14.5', spec: 'ASME Y14.5-2018', summary: 'Dimensioning and tolerancing — profile & position callouts.' },
    ],
    relatedHubHref: '/titanium-cnc-machining-services/3-5-axis-cnc-machining/',
    rfqPrefillPart: 'internal-radius-dfm',
    lastReviewed: '2026-09-12',
  },

  // ───────────────────────────────────────────────
  // Rule 3 — Deep Hole Drilling
  // ───────────────────────────────────────────────
  {
    id: 'deep-hole',
    title: 'Deep-Hole Drilling L/D Ratio & Coolant Pressure',
    directAnswer:
      'Limit L/D ≤ 5:1 for standard blind holes and ≤ 12:1 with gun-drilling + 100 bar through-tool coolant. Beyond 12:1 step down to a smaller Ø to maintain chip evacuation.',
    dimension: 'D2',
    featured: true,
    features: ['drilling-tapping', 'deep-cavity'],
    processes: ['5-axis-cnc', '3-axis-cnc', 'gun-drilling'],
    grades: ['alpha-beta-gr5', 'alpha-beta-gr23', 'cp-gr2'],
    goals: ['cost-reduction', 'lead-time', 'high-precision'],
    parameters: [
      { label: 'Blind hole L/D', value: '≤ 5:1', condition: 'standard carbide drill' },
      { label: 'Deep hole L/D', value: '5:1–12:1', condition: 'requires gun-drill + internal coolant' },
      { label: 'Coolant pressure', value: '≥ 100 bar (1 450 psi)', anchor: 'deep-hole-coolant' },
      { label: 'Coolant type', value: 'High-pressure emulsion 8–10 % concentration', condition: 'synthetic for medical' },
    ],
    failure: {
      summary:
        "Titanium's low thermal conductivity (k ≈ 6.7 W/m·K) traps heat in the chip. Without high-pressure through-tool coolant, chips weld to the flutes (galling), the drill seizes, and the hole ovalizes or breaks the drill. Beyond 12:1 L/D the chip evacuation path is too long for standard drills.",
      evidence: [
        'k_Ti ≈ 6.7 W/m·K — 1/8 of 304 stainless steel',
        'Galling onset at Vc > 50 m/min without coolant-through',
        'Chip evacuation failure rate climbs to ~30 % at L/D = 10:1 (standard drill)',
        'Drill breakage at L/D > 12:1 with insufficient coolant: ~70 %',
      ],
    },
    countermeasure: {
      summary:
        'For L/D > 5:1 switch to single-flute gun-drills with internal coolant channels (≥ 100 bar). Peck-drilling cycles (1×D retract) prevent chip pack. For ultra-deep features step down to a smaller Ø.',
      strategies: [
        'Single-flute gun-drill (Botek, Titex, Guhring) for L/D > 8:1',
        'Coolant pressure 100–150 bar through the tool shank',
        'Peck cycle 0.5–1×D retract for chip breaking',
        'Step-down Ø sequence: pilot → Ø 3 → Ø 6 → Ø 8 mm',
        'Cutting speed Vc = 40–60 m/min; feed f = 0.05–0.15 mm/rev',
      ],
    },
    tolerances: STD_TOLERANCES_5AXIS,
    comparison: {
      id: 'cmp-deep-hole',
      badLabel: 'L/D 10:1, standard twist drill, no coolant',
      badDescription:
        'Hole Ø 2 mm × 20 mm deep drilled with standard HSS twist drill, no through-coolant. Chips pack in flute, drill seizes at 12 mm depth. Part scrapped.',
      badCostImpact: '+1 drill replacement, +25 min cycle time, 30 % scrap',
      goodLabel: 'Gun-drill L/D 12:1, 100 bar through-coolant',
      goodDescription:
        'Switched to single-flute gun-drill with internal coolant channel at 100 bar. Continuous chip evacuation, hole straight within 0.02 mm/20 mm.',
      goodCostImpact: '−35 % cycle time, 1 drill, ±0.02 mm hole position',
      badSvg: SVG_DEEP_HOLE_BAD,
      goodSvg: SVG_DEEP_HOLE_GOOD,
    },
    evidenceStandards: [
      { id: 'din-6535', label: 'DIN 6535', spec: 'DIN 6535-3', summary: 'Solid drills with internal coolant supply.' },
      { id: 'iso-230', label: 'ISO 230', spec: 'ISO 230-1:2012', summary: 'Test code for machine tools — geometric accuracy.' },
    ],
    relatedHubHref: '/titanium-cnc-machining-services/3-5-axis-cnc-machining/',
    rfqPrefillPart: 'deep-hole-dfm',
    lastReviewed: '2026-09-12',
  },

  // ───────────────────────────────────────────────
  // Rule 4 — Thread Depth & Tapping
  // ───────────────────────────────────────────────
  {
    id: 'thread-depth',
    title: 'Thread Depth & Tapping vs Thread Milling',
    directAnswer:
      'Limit blind-hole thread depth to ≤ 2.0×D (≤ 2.5×D for through-holes). Use thread milling instead of cut tapping for Grade 5 / Grade 23 to eliminate tap breakage from work hardening.',
    dimension: 'D2',
    featured: false,
    features: ['drilling-tapping', 'threads'],
    processes: ['5-axis-cnc', '3-axis-cnc', 'thread-milling', 'swiss-lathe', 'turn-mill'],
    grades: ['alpha-beta-gr5', 'alpha-beta-gr23', 'cp-gr2', 'cp-gr4'],
    goals: ['cost-reduction', 'fatigue-life', 'high-precision'],
    parameters: [
      { label: 'Blind hole thread depth', value: '≤ 2.0 × D', condition: 'D = nominal thread diameter' },
      { label: 'Through hole thread depth', value: '≤ 2.5 × D', condition: 'chip exit side accessible' },
      { label: 'Tap breakage risk', value: '> 35 % at depth 3×D, Grade 5', condition: 'cut tap without form relief' },
      { label: 'Thread mill thread profile', value: 'full profile M2–M16', condition: 'single-point 60° carbide' },
    ],
    failure: {
      summary:
        "Cut tapping relies on the chip evacuating UP the flute against the descending tap. At depth > 2×D the chip pack tightens around the tap, torque spikes, the work-hardened zone (up to 470 HV) seizes the tap, and the tap snaps flush with the surface — often destroying the part.",
      evidence: [
        'Tap torque at depth 2×D: ~80 % of fracture limit',
        'Tap torque at depth 3×D: ~120 % → breakage',
        'Work-hardened layer thickness: 0.05–0.15 mm',
        'Surface hardness after tapping Gr 5: 380–470 HV (vs 350 HV annealed)',
      ],
    },
    countermeasure: {
      summary:
        'Replace cut tapping with thread milling for any blind hole in Grade 5 or 23, and for thread depth > 1.5×D. Thread mills use radial interpolation and never trap chips, with controllable chip load per tooth.',
      strategies: [
        'Solid carbide thread mill M3–M16, single-point 60°',
        'Radial interpolation Ø = thread Ø − 0.1 mm; climb cut',
        'Coolant-through tool; cutting speed Vc = 30–50 m/min',
        'For ultra-deep threads: thread whirling on Swiss-type lathe',
        'For ultra-fine threads: sinker EDM (down to M1 × 0.2 mm)',
      ],
    },
    tolerances: STD_TOLERANCES_5AXIS,
    comparison: {
      id: 'cmp-thread-depth',
      badLabel: 'Cut tap M6 × 18 mm in Grade 5',
      badDescription:
        'Blind hole M6 × 18 mm (3×D) in Grade 5 with standard cut tap. Chip pack at 12 mm depth, tap snaps. Ø 4.5 mm remnant must be EDM-extracted; part scrapped.',
      badCostImpact: '+1 EDM recovery, +60 min cycle time, 40 % scrap',
      goodLabel: 'Thread mill M6 × 12 mm (2×D)',
      goodDescription:
        'M6 thread milled to 12 mm depth (2×D) with solid carbide thread mill. Radial interpolation, controlled chip load, full thread profile verified with GO/NO-GO gauge.',
      goodCostImpact: '−50 % cycle time, 1 tool, 0 % scrap',
      badSvg: SVG_THREAD_BAD,
      goodSvg: SVG_THREAD_GOOD,
    },
    evidenceStandards: [
      { id: 'iso-261', label: 'ISO 261', spec: 'ISO 261:1998', summary: 'General purpose metric screw threads — general plan.' },
      { id: 'din-13-1', label: 'DIN 13-1', spec: 'DIN 13-1:1999', summary: 'ISO metric screw threads — general principles.' },
    ],
    relatedHubHref: '/titanium-cnc-machining-services/cnc-milling-turning/',
    rfqPrefillPart: 'thread-depth-dfm',
    lastReviewed: '2026-09-12',
  },

  // ───────────────────────────────────────────────
  // Rule 5 — 5-Axis Toolpath Optimization
  // ───────────────────────────────────────────────
  {
    id: '5axis-toolpath',
    title: '5-Axis Toolpath Angle & Engagement Optimization',
    directAnswer:
      'Use 5-axis simultaneous machining with tool tilt 10–20° and lead angle 5–15° to keep radial engagement < 30 % — eliminates chatter, improves surface finish 2×, and reduces cycle time 30–50 %.',
    dimension: 'D2',
    featured: true,
    features: ['pocketing', 'deep-cavity', 'surface-finish'],
    processes: ['5-axis-cnc'],
    grades: ['alpha-beta-gr5', 'alpha-beta-gr23', 'beta-gr19', 'beta-gr21'],
    goals: ['high-precision', 'lead-time', 'fatigue-life', 'hermetic-seal'],
    parameters: [
      { label: 'Tool tilt angle', value: '10–20°', condition: 'to keep radial engagement < 0.3×D' },
      { label: 'Lead / tilt angle', value: '5–15°', condition: 'avoids zero-velocity rub' },
      { label: 'Radial engagement (ae/D)', value: '≤ 0.30 (30 %)' },
      { label: 'Step-over (ap)', value: '0.05–0.15 mm', condition: 'for finish pass Ra 0.4 μm' },
    ],
    failure: {
      summary:
        '3-axis machining at 90° tool engagement drives radial force into the part, exciting the tool-holder-workpiece system. Chatter marks appear as surface waviness (Ra jumps from 0.4 to > 1.6 μm), reduce fatigue life by ~30 %, and create hermetic-seal failure paths in UHV / medical interfaces.',
      evidence: [
        'Chatter frequency 200–800 Hz matches tool-holder natural mode',
        'Surface Ra degrades 2–4× when chatter occurs',
        'Fatigue life reduction: ~30 % per ISO 1143',
        'Helium leak rate on UHV flange: < 1×10⁻⁹ mbar·L/s (good) vs > 1×10⁻⁷ (chatter)',
      ],
    },
    countermeasure: {
      summary:
        '5-axis simultaneous machining with controlled tool tilt maintains constant chip load. Mastercam / HyperMill / Vericut toolpath strategies include "swarf", "flow" and "multi-axis contour" for this purpose.',
      strategies: [
        '5-axis swarf cut along ruled surfaces',
        '5-axis flow cut for free-form cavities',
        'Tool holder balance G2.5 @ 25 000 rpm',
        'Engagement control: keep ae/D ≤ 0.30 throughout',
        'CMM verification with 0.008 mm spacing',
      ],
    },
    tolerances: STD_TOLERANCES_5AXIS,
    comparison: {
      id: 'cmp-5axis',
      badLabel: '3-axis: tool 90° to surface',
      badDescription:
        '3-axis ball-end mill at 90° to free-form surface. Full radial engagement, chatter, surface Ra 1.6+ μm, fatigue life −30 %. Part fails helium leak test.',
      badCostImpact: '+1 re-cut, +90 min cycle time, 50 % leak test fail',
      goodLabel: '5-axis tilt 15°, radial engagement 25 %',
      goodDescription:
        '5-axis simultaneous cut with 15° tool tilt, radial engagement 25 %. Surface Ra 0.4 μm, no chatter, 1 finishing pass, 0 % leak failure.',
      goodCostImpact: '−50 % cycle time, 1 finishing pass, 0 % leak failure',
      badSvg: SVG_5AXIS_BAD,
      goodSvg: SVG_5AXIS_GOOD,
    },
    evidenceStandards: [
      { id: 'iso-1947', label: 'ISO 1947', spec: 'ISO 1947:2018', summary: 'Machine tool balance — verification of balance.' },
      { id: 'iso-1143', label: 'ISO 1143', spec: 'ISO 1143:2010', summary: 'Metallic materials — rotating bar bending fatigue testing.' },
    ],
    relatedHubHref: '/5-axis-titanium-machining/',
    rfqPrefillPart: '5axis-toolpath-dfm',
    lastReviewed: '2026-09-12',
  },

  // ───────────────────────────────────────────────
  // Rule 6 — Surface Finish & Stress Relief
  // ───────────────────────────────────────────────
  {
    id: 'surface-finish',
    title: 'Surface Roughness, Anodizing Prep & Stress Relief',
    directAnswer:
      'Specify Ra 0.4–3.2 μm for as-machined surfaces; achieve Ra 0.4 μm on sealing faces. Always add vacuum stress relief per AMS 2801 (650 °C × 2 h) before precision finishing to eliminate post-machining warp.',
    dimension: 'D2',
    featured: false,
    features: ['surface-finish', 'flatness-perp'],
    processes: ['5-axis-cnc', '3-axis-cnc', 'swiss-lathe', 'turn-mill'],
    grades: ['alpha-beta-gr5', 'alpha-beta-gr23', 'cp-gr2', 'cp-gr4'],
    goals: ['hermetic-seal', 'fatigue-life', 'high-precision'],
    parameters: [
      { label: 'As-machined Ra', value: '0.8–3.2 μm', condition: 'function surfaces' },
      { label: 'Sealing face Ra', value: '≤ 0.4 μm', condition: 'UHV / medical hermetic' },
      { label: 'Stress relief (vacuum)', value: '650 °C × 2 h', condition: 'AMS 2801, ≤ 10⁻⁴ Torr' },
      { label: 'Flatness (per 100 mm)', value: '≤ 0.02 mm', condition: 'after stress relief' },
    ],
    failure: {
      summary:
        "As-machined titanium surfaces carry tensile residual stress up to 600 MPa in the top 0.1 mm. Over hours-to-days the part warps 0.03–0.10 mm as the stress redistributes — destroying sealing interfaces and precision mating tolerances. For medical implants, residual stress drives fatigue crack initiation.",
      evidence: [
        'Surface residual stress after milling: 200–600 MPa (tensile)',
        'Warp over 24 h: 0.03–0.10 mm on a 200 mm plate',
        'Helium leak rate degrades 2 orders of magnitude on rough surface',
        'Fatigue crack initiation sites at rough surfaces: ~3× more than polished',
      ],
    },
    countermeasure: {
      summary:
        'Always specify vacuum stress relief (AMS 2801: 650 °C × 2 h, vacuum ≤ 10⁻⁴ Torr) before any precision finishing or sealing face machining. This redistributes residual stress evenly and minimizes post-machining warp.',
      strategies: [
        'Rough machine with 0.2 mm stock allowance',
        'Vacuum stress relief per AMS 2801 (650 °C × 2 h)',
        'Finish machine to final tolerance with single-pass light cut',
        'Optional: light hand-polishing on sealing face (Ra ≤ 0.2 μm)',
        'For medical: electropolish + passivation per ASTM B600',
      ],
    },
    tolerances: STD_TOLERANCES_5AXIS,
    comparison: {
      id: 'cmp-surface',
      badLabel: 'As-machined Ra 1.6 μm, no stress relief',
      badDescription:
        'Mating face machined to Ra 1.6 μm, no stress relief. 24 h after machining, part warps 0.07 mm. Helium leak rate 5×10⁻⁷ mbar·L/s — fails UHV spec by 50×.',
      badCostImpact: '+1 re-finish, +120 min cycle time, 100 % leak fail',
      goodLabel: 'Stress-relieved + Ra 0.4 μm finish',
      goodDescription:
        'Rough machined with 0.2 mm stock, vacuum stress-relieved per AMS 2801, finish machined to Ra 0.4 μm. Warp < 0.01 mm, leak rate 8×10⁻¹⁰ mbar·L/s.',
      goodCostImpact: '−20 % cycle time, 0 % leak fail, 1 finishing pass',
      badSvg: SVG_SURFACE_BAD,
      goodSvg: SVG_SURFACE_GOOD,
    },
    evidenceStandards: [
      { id: 'ams-2801', label: 'AMS 2801', spec: 'AMS 2801', summary: 'Heat treatment of titanium alloy raw parts (vacuum stress relief).' },
      { id: 'astm-b600', label: 'ASTM B600', spec: 'ASTM B600-21', summary: 'Standard practice for descaling and cleaning titanium surfaces.' },
      { id: 'iso-4287', label: 'ISO 4287', spec: 'ISO 4287:1997', summary: 'Surface roughness — parameters.' },
    ],
    relatedHubHref: '/titanium-surface-treatment/',
    rfqPrefillPart: 'surface-finish-dfm',
    lastReviewed: '2026-09-12',
  },
];

// ────────────────────────────────────────────────────────────────────
// 9. URL STATE TYPE
// ────────────────────────────────────────────────────────────────────

export interface DFMUrlState {
  readonly features: readonly FeatureCategory[];
  readonly processes: readonly MachiningProcess[];
  readonly grades: readonly TitaniumGradeId[];
  readonly goals: readonly OptimizationGoal[];
  /** Active rule id (drives the Good-vs-Bad Dialog). null = no dialog. */
  readonly activeRule: string | null;
}

export const EMPTY_DFM_STATE: DFMUrlState = {
  features: [],
  processes: [],
  grades: [],
  goals: [],
  activeRule: null,
};

// ────────────────────────────────────────────────────────────────────
// 10. URL STATE PURE FUNCTIONS (parse / serialize / filter)
// ────────────────────────────────────────────────────────────────────

const FEATURE_SET: ReadonlySet<string> = new Set(FEATURE_CATEGORY_IDS);
const PROCESS_SET: ReadonlySet<string> = new Set(MACHINING_PROCESS_IDS);
const GRADE_SET: ReadonlySet<string> = new Set(TITANIUM_GRADE_IDS);
const GOAL_SET: ReadonlySet<string> = new Set(OPTIMIZATION_GOAL_IDS);
const RULE_ID_SET: ReadonlySet<string> = new Set(DFM_RULES.map((r) => r.id));

function isFeatureCategory(v: string): v is FeatureCategory {
  return FEATURE_SET.has(v);
}
function isMachiningProcess(v: string): v is MachiningProcess {
  return PROCESS_SET.has(v);
}
function isTitaniumGradeId(v: string): v is TitaniumGradeId {
  return GRADE_SET.has(v);
}
function isOptimizationGoal(v: string): v is OptimizationGoal {
  return GOAL_SET.has(v);
}

function parseList<T extends string>(
  raw: string | null,
  guard: (v: string) => v is T,
): readonly T[] {
  if (raw === null) return [];
  const out: T[] = [];
  for (const segment of raw.split(',')) {
    const trimmed = segment.trim();
    if (trimmed.length === 0) continue;
    if (guard(trimmed)) out.push(trimmed);
  }
  return out;
}

/** Read DFMUrlState from a URLSearchParams instance (browser / mock). */
export function parseDfmUrlState(params: URLSearchParams): DFMUrlState {
  const ruleRaw = params.get('rule');
  const activeRule: string | null =
    ruleRaw !== null && RULE_ID_SET.has(ruleRaw) ? ruleRaw : null;
  return {
    features: parseList(params.get('feat'), isFeatureCategory),
    processes: parseList(params.get('proc'), isMachiningProcess),
    grades: parseList(params.get('grade'), isTitaniumGradeId),
    goals: parseList(params.get('goal'), isOptimizationGoal),
    activeRule,
  };
}

/** Serialize DFMUrlState into a URLSearchParams-shaped object. */
export function serializeDfmUrlState(state: DFMUrlState): URLSearchParams {
  const params = new URLSearchParams();
  if (state.features.length > 0) params.set('feat', state.features.join(','));
  if (state.processes.length > 0) params.set('proc', state.processes.join(','));
  if (state.grades.length > 0) params.set('grade', state.grades.join(','));
  if (state.goals.length > 0) params.set('goal', state.goals.join(','));
  if (state.activeRule !== null) params.set('rule', state.activeRule);
  return params;
}

/** Filter DFM rules by the active URL state. AND across dimensions, OR within. */
export function filterDfmRules(
  rules: readonly DFMRule[],
  state: DFMUrlState,
): readonly DFMRule[] {
  return rules.filter((r) => {
    if (state.features.length > 0 && !r.features.some((f) => state.features.includes(f))) return false;
    if (state.processes.length > 0 && !r.processes.some((p) => state.processes.includes(p))) return false;
    if (state.grades.length > 0 && !r.grades.some((g) => state.grades.includes(g))) return false;
    if (state.goals.length > 0 && !r.goals.some((g) => state.goals.includes(g))) return false;
    return true;
  });
}

/** Lookup a single rule by id; returns undefined if not found. */
export function findDfmRule(rules: readonly DFMRule[], id: string): DFMRule | undefined {
  return rules.find((r) => r.id === id);
}

// ────────────────────────────────────────────────────────────────────
// 11. ENGINEERING CALCULATOR INPUT / OUTPUT TYPES
// ────────────────────────────────────────────────────────────────────

/** Inputs to the internal-corner-radius calculator. */
export interface CornerRadiusCalculatorInputs {
  /** End-mill diameter, mm. */
  readonly toolDiameterMm: number;
}

/** Result of the corner-radius calculator. */
export interface CornerRadiusCalculatorResult {
  readonly minimumRadiusMm: number;
  readonly recommendedRadiusMm: number;
  readonly passStatus: 'ok' | 'warn';
}

/** Inputs to the thread-depth cost calculator. */
export interface ThreadDepthCalculatorInputs {
  /** Nominal thread diameter (M-number), mm. */
  readonly nominalDiameterMm: number;
  /** Thread depth, mm. */
  readonly threadDepthMm: number;
  /** True = through-hole, false = blind. */
  readonly throughHole: boolean;
}

/** Result of the thread-depth calculator. */
export interface ThreadDepthCalculatorResult {
  readonly ratioD: number;
  readonly limit: number;
  readonly recommendation: 'cut-tap' | 'thread-mill' | 'edm';
  readonly costBand: 'low' | 'medium' | 'high';
}

/** Compute corner-radius result. */
export function computeCornerRadius(inputs: CornerRadiusCalculatorInputs): CornerRadiusCalculatorResult {
  const r = inputs.toolDiameterMm / 2;
  return {
    minimumRadiusMm: 1.15 * r,
    recommendedRadiusMm: 1.5 * r,
    passStatus: r >= 3 ? 'ok' : 'warn',
  };
}

/** Compute thread-depth result. */
export function computeThreadDepth(inputs: ThreadDepthCalculatorInputs): ThreadDepthCalculatorResult {
  const limit = inputs.throughHole ? 2.5 * inputs.nominalDiameterMm : 2.0 * inputs.nominalDiameterMm;
  const ratioD = inputs.threadDepthMm / inputs.nominalDiameterMm;
  let recommendation: 'cut-tap' | 'thread-mill' | 'edm';
  let costBand: 'low' | 'medium' | 'high';
  if (inputs.threadDepthMm <= limit * 0.75) {
    recommendation = inputs.throughHole ? 'cut-tap' : 'thread-mill';
    costBand = 'low';
  } else if (inputs.threadDepthMm <= limit) {
    recommendation = 'thread-mill';
    costBand = 'medium';
  } else {
    recommendation = 'edm';
    costBand = 'high';
  }
  return { ratioD, limit, recommendation, costBand };
}

// ────────────────────────────────────────────────────────────────────
// 12. HUB I18N STRINGS (English baseline — translation pipeline handles 12 locales)
// ────────────────────────────────────────────────────────────────────

export interface DesignEngineeringHubStrings {
  readonly heroBadge: string;
  readonly heroTitlePrefix: string;
  readonly heroTitleHighlight: string;
  readonly heroSubtitle: string;
  readonly quickCheckerTitle: string;
  readonly quickCheckerSubtitle: string;
  readonly quickCheckerWallLabel: string;
  readonly quickCheckerWallValue: string;
  readonly quickCheckerToleranceLabel: string;
  readonly quickCheckerToleranceValue: string;
  readonly quickCheckerDeepHoleLabel: string;
  readonly quickCheckerDeepHoleValue: string;
  readonly quickCheckerThreadLabel: string;
  readonly quickCheckerThreadValue: string;
  readonly rulesTitle: string;
  readonly rulesSubtitle: string;
  readonly filterFeaturesLabel: string;
  readonly filterProcessesLabel: string;
  readonly filterGradesLabel: string;
  readonly filterGoalsLabel: string;
  readonly filterResetLabel: string;
  readonly emptyTitle: string;
  readonly emptyDescription: string;
  readonly emptyResetLabel: string;
  readonly calculatorTitle: string;
  readonly calculatorSubtitle: string;
  readonly calculatorCornerTitle: string;
  readonly calculatorCornerToolLabel: string;
  readonly calculatorCornerMinLabel: string;
  readonly calculatorCornerRecommendedLabel: string;
  readonly calculatorCornerExample: string;
  readonly calculatorThreadTitle: string;
  readonly calculatorThreadDiameterLabel: string;
  readonly calculatorThreadDepthLabel: string;
  readonly calculatorThreadTypeLabel: string;
  readonly calculatorThreadTypeBlind: string;
  readonly calculatorThreadTypeThrough: string;
  readonly calculatorThreadRatioLabel: string;
  readonly calculatorThreadLimitLabel: string;
  readonly calculatorThreadRecoLabel: string;
  readonly dialogCloseLabel: string;
  readonly dialogBadLabel: string;
  readonly dialogGoodLabel: string;
  readonly dialogCostImpactLabel: string;
  readonly dialogParametersLabel: string;
  readonly dialogFailureLabel: string;
  readonly dialogCountermeasureLabel: string;
  readonly dialogTolerancesLabel: string;
  readonly dialogStandardsLabel: string;
  readonly dialogRfqLabel: string;
  readonly dialogRfqHref: string;
  readonly ctaTitle: string;
  readonly ctaSubtitle: string;
  readonly ctaPrimaryLabel: string;
  readonly ctaPrimaryHref: string;
  readonly ctaSecondaryLabel: string;
  readonly ctaSecondaryHref: string;
  readonly ctaBullets: readonly string[];
}

export const HUB_STRINGS_EN: DesignEngineeringHubStrings = {
  heroBadge: 'Titanium DFM Engineering Hub · ASTM B348 / AMS 4928 / ASME Y14.5',
  heroTitlePrefix: 'The Engineer\u2019s Guide to',
  heroTitleHighlight: 'Titanium DFM & CNC Machinability',
  heroSubtitle:
    'Authoritative Design-for-Manufacturability rules for titanium 5-axis CNC machining — minimum wall thickness, internal corner radius, deep-hole L/D ratio, thread depth limits, 5-axis toolpath engagement, and AMS 2801 stress relief — each backed by physics, real standards, and BOZE production data.',
  quickCheckerTitle: 'Quick-Check: Core Engineering Parameters',
  quickCheckerSubtitle: 'Click any gauge to open the matching DFM rule.',
  quickCheckerWallLabel: 'Min. wall thickness',
  quickCheckerWallValue: '\u2265 0.8 mm',
  quickCheckerToleranceLabel: 'Tight tolerance',
  quickCheckerToleranceValue: '\u00B1 0.005 mm',
  quickCheckerDeepHoleLabel: 'Deep hole L/D',
  quickCheckerDeepHoleValue: '12 : 1 max',
  quickCheckerThreadLabel: 'Blind thread depth',
  quickCheckerThreadValue: '\u2264 2 \u00D7 D',
  rulesTitle: 'DFM Rules Matrix',
  rulesSubtitle: 'Filter by feature, process, grade, and goal. Click any card to see the full Good-vs-Bad CAD comparison.',
  filterFeaturesLabel: 'Machining feature',
  filterProcessesLabel: 'CNC process',
  filterGradesLabel: 'Titanium grade',
  filterGoalsLabel: 'Optimization goal',
  filterResetLabel: 'Reset all filters',
  emptyTitle: 'No DFM rule matches the current filter combination',
  emptyDescription: 'Loosen one or more filters to see the full set of 6 DFM rules.',
  emptyResetLabel: 'Reset filters',
  calculatorTitle: 'Engineering Calculators',
  calculatorSubtitle: 'Quick estimators for the two most common DFM questions — corner radius and thread depth.',
  calculatorCornerTitle: 'Internal Corner Radius \u2192 Tool Diameter',
  calculatorCornerToolLabel: 'End-mill diameter (mm)',
  calculatorCornerMinLabel: 'Min. corner radius',
  calculatorCornerRecommendedLabel: 'Recommended fillet',
  calculatorCornerExample: 'e.g. 6 mm end mill \u2192 R \u2265 3.45 mm',
  calculatorThreadTitle: 'Thread Depth \u2192 Cost & Process Band',
  calculatorThreadDiameterLabel: 'Nominal thread \u00F8 (M, mm)',
  calculatorThreadDepthLabel: 'Thread depth (mm)',
  calculatorThreadTypeLabel: 'Hole type',
  calculatorThreadTypeBlind: 'Blind hole (no chip exit)',
  calculatorThreadTypeThrough: 'Through hole (chip exit)',
  calculatorThreadRatioLabel: 'Depth \u00F7 D ratio',
  calculatorThreadLimitLabel: 'Safe limit',
  calculatorThreadRecoLabel: 'Recommended process',
  dialogCloseLabel: 'Close comparison',
  dialogBadLabel: 'Bad design',
  dialogGoodLabel: 'Optimized design',
  dialogCostImpactLabel: 'Cost & cycle-time impact',
  dialogParametersLabel: 'Engineering parameters',
  dialogFailureLabel: 'Physics of failure',
  dialogCountermeasureLabel: 'Machining counter-measure',
  dialogTolerancesLabel: 'Tolerances & inspection',
  dialogStandardsLabel: 'Cited standards',
  dialogRfqLabel: 'Request DFM Review for this rule',
  dialogRfqHref: '/rfq/?part=dfm-review',
  ctaTitle: 'Send your STEP / IGES file for a free DFM review',
  ctaSubtitle:
    'Our applications engineers respond within 1\u20132 business days with a written DFM report, lead-time band, and a fixed quote. Confidential CAD upload supported (STEP, IGES, Parasolid, native formats).',
  ctaPrimaryLabel: 'Request DFM Review',
  ctaPrimaryHref: '/rfq/?part=dfm-review',
  ctaSecondaryLabel: 'Talk to an engineer',
  ctaSecondaryHref: '/contact/',
  ctaBullets: [
    '1\u20132 business day DFM response',
    'AS9100D / ISO 13485 / ISO 9001 facility',
    'EN 10204 Type 3.1 MTR included',
  ],
};
