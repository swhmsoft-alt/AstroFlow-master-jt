/**
 * src/types/manufacturing-insight.ts
 *
 * Strict TypeScript types for the Manufacturing Insights Hub
 * (`/resources/manufacturing-insights/`). Re-exported from the data file
 * (`src/data/manufacturing-insights-data.ts`) which holds the run-time values;
 * this file exists so other modules can import the shape without pulling in
 * the data set (useful for tests and for tooling that only needs the contract).
 */

// Re-export the const-arrays' union types so consumers can write
// `import type { ProcessCategory } from '@/types/manufacturing-insight'`.
//
// The actual const arrays live in `src/data/manufacturing-insights-data.ts`
// (Single Source of Truth for run-time values). This file owns the TYPE
// contracts only — no circular import to the data file.

export type ProcessCategory =
  | '5axis-milling'
  | 'trochoidal-milling'
  | 'high-pressure-coolant'
  | 'wire-edm'
  | 'cmm-inspection'
  | 'spectrometer'
  | 'anodizing'
  | 'welding';

export type QualityDimension =
  | 'tolerance'
  | 'cmm'
  | 'mtr'
  | 'cert'
  | 'surface-finish'
  | 'fatigue'
  | 'ndt';

export type InsightIndustry =
  | 'aerospace'
  | 'medical'
  | 'hydrofoil'
  | 'racing'
  | 'chemical'
  | 'marine'
  | 'subsea';

// ────────────────────────────────────────────────────────────────────
// 1. Search-intent taxonomy (1:1 with Buyer Search Intelligence framework)
// ────────────────────────────────────────────────────────────────────

/**
 * - 'informational' — process / technology (e.g. "how to eliminate chatter in Grade 5")
 * - 'commercial'    — capability verification (e.g. "ISO 9001 + EU PED titanium shop")
 * - 'transactional'— audit / sample / RFQ (e.g. "request CMM sample report")
 */
export type InsightIntent = 'informational' | 'commercial' | 'transactional';

// ────────────────────────────────────────────────────────────────────
// 2. Individual field shapes
// ────────────────────────────────────────────────────────────────────

/** A single quantitative threshold or measurement surfaced on an insight card. */
export interface QualityMetric {
  /** Human-readable label, e.g. "HPC Pressure". */
  readonly label: string;
  /** Measured / specified value with unit, e.g. "\u2265 70 bar" or "\u00b10.005 mm". */
  readonly value: string;
  /** Optional comparison / baseline, e.g. "vs 20 bar flood coolant". */
  readonly baseline?: string;
  /** Optional standard/section reference, e.g. "ISO 9001:2015 \u00a78.5.1". */
  readonly standard?: string;
  /** Visual emphasis for the metric chip (used as aria-label). */
  readonly emphasis?: 'low' | 'medium' | 'high';
}

/** A single piece of equipment recommended for the insight. */
export interface EquipmentSpec {
  /** Machine name, e.g. "Zeiss PRISMO 12/16/10". */
  readonly name: string;
  /** Spec line, e.g. "CMM accuracy (1.8+L/300) \u00b5m (ISO 10360-2)". */
  readonly spec: string;
  /** Vendor or brand family, optional. */
  readonly vendor?: string;
  /** Optional standard / spec reference, e.g. "ISO 10360-2" or "AMS 2774". */
  readonly standard?: string;
}

/**
 * A CMM inspection data point — used in the modal preview to mirror a real
 * Zeiss inspection report (redacted sample, no fabrication).
 */
export interface CMMDataPoint {
  readonly id: number;
  readonly x: number;
  readonly y: number;
  readonly z: number;
  readonly nominal: number;
  readonly actual: number;
  readonly deviation: number;
  readonly within: boolean;
}

/** A redacted CMM evidence block embedded in an insight modal. */
export interface CMMEvidence {
  readonly partName: string;
  readonly partNumber: string;
  readonly inspectionDate: string;
  readonly inspector: string;
  readonly cmmModel: string;
  readonly cmmAccuracy: string;
  readonly probeConfig: string;
  readonly softwareVersion: string;
  readonly toleranceClass: string;
  readonly gdntStandard: string;
  readonly points: readonly CMMDataPoint[];
  readonly summary: {
    readonly total: number;
    readonly within: number;
    readonly maxDeviation: number;
    readonly avgDeviation: number;
  };
}

/**
 * A redacted EN 10204 3.1 mill test report — chemical composition +
 * mechanical properties + heat number lifecycle.
 */
export interface MTREvidence {
  readonly material: string;
  readonly materialStandard: string;
  readonly form: 'Bar' | 'Plate' | 'Billet' | 'Forging' | 'Sheet' | 'Tube';
  readonly heatNumber: string;
  readonly batchSize: string;
  readonly manufacturer: string;
  readonly countryOfMelt: string;
  readonly inspectionDate: string;
  readonly chemicalComposition: ReadonlyArray<{
    readonly element: string;
    readonly min: string;
    readonly max: string;
    readonly actual: string;
  }>;
  readonly mechanicalProperties: ReadonlyArray<{
    readonly property: string;
    readonly unit: string;
    readonly min: string;
    readonly actual: string;
  }>;
  readonly inspectionType: 'EN 10204 3.1' | 'EN 10204 3.2';
}

/** Factory Audit / Sample Drawer mode driving the RFQ carry-on. */
export type FactoryDrawerMode = 'audit' | 'cmm-sample' | 'mtr-sample';

/**
 * A single deep manufacturing insight. Six of these drive the entire hub.
 */
export interface ManufacturingInsight {
  /** Stable id used as URL param & React key. e.g. 'thermal-stress-5axis-grade5'. */
  readonly id: string;
  /** Display title, 8\u201312 words max. */
  readonly title: string;
  /** One-line direct answer (renders in card + JSON-LD TechArticle.about). */
  readonly directAnswer: string;
  /** Long description (2\u20133 sentences), used in card body + JSON-LD. */
  readonly description: string;
  /** Search-intent classification \u2014 lets the hub group cards into 3 bands. */
  readonly intent: InsightIntent;
  /** Featured cards get larger visual treatment in the grid. */
  readonly featured: boolean;
  /** Workshop pain-point addressed (the reason the buyer is here). */
  readonly challenge: string;
  /** Boze Metal shop-floor solution. */
  readonly solution: string;
  /** Quantitative thresholds / measurements on the card. */
  readonly thresholds: readonly QualityMetric[];
  /** Recommended equipment list. */
  readonly recommendedEquipment: readonly EquipmentSpec[];
  /** Process facets (matches PROCESS_CATEGORY_IDS). */
  readonly processes: readonly ProcessCategory[];
  /** Quality-dimension facets (matches QUALITY_DIMENSION_IDS). */
  readonly qualityDims: readonly QualityDimension[];
  /** Industry facets (matches INSIGHT_INDUSTRY_IDS). */
  readonly industries: readonly InsightIndustry[];
  /** Cited standards / certifications (real, no fabrication). */
  readonly certifications: readonly string[];
  /** Cited authoritative sources / pages (relative URLs ending with /). */
  readonly relatedPages: readonly string[];
  /** Modal payload \u2014 CMM evidence sample. */
  readonly cmmEvidence?: CMMEvidence;
  /** Modal payload \u2014 MTR sample. */
  readonly mtrEvidence?: MTREvidence;
  /** Modal accent (which dashboard sub-callout this insight anchors). */
  readonly dashboardAccent:
    | 'tolerance'
    | 'cm'
    | 'finish'
    | 'hpc'
    | 'mtr'
    | 'weld'
    | 'anodize';
}

// ────────────────────────────────────────────────────────────────────
// 4. URL State
// ────────────────────────────────────────────────────────────────────

export interface ManufacturingInsightUrlState {
  readonly query: string;
  readonly processes: readonly ProcessCategory[];
  readonly qualityDims: readonly QualityDimension[];
  readonly industries: readonly InsightIndustry[];
  readonly openInsightId: string | null;
  readonly drawer: FactoryDrawerMode | null;
}

// ────────────────────────────────────────────────────────────────────
// 5. Facet group definition (passed to <KnowledgeFacetSidebar /> style UI)
// ────────────────────────────────────────────────────────────────────

export interface InsightFacetGroup<T extends string> {
  readonly id: 'process' | 'quality' | 'industry';
  readonly label: string;
  readonly values: ReadonlyArray<T>;
  readonly labels: Readonly<Record<T, string>>;
}

export interface InsightFacetGroups {
  readonly process: InsightFacetGroup<ProcessCategory>;
  readonly quality: InsightFacetGroup<QualityDimension>;
  readonly industry: InsightFacetGroup<InsightIndustry>;
}

// ────────────────────────────────────────────────────────────────────
// 6. Hub-level i18n strings (English baseline; other locales TBD)
// ────────────────────────────────────────────────────────────────────

export interface ManufacturingHubStrings {
  // Hero
  readonly heroBadge: string;
  readonly heroTitle: string;
  readonly heroSubtitle: string;
  readonly heroCtaPrimary: string;
  readonly heroCtaPrimaryHref: string;
  readonly heroCtaSecondary: string;
  readonly heroCtaSecondaryHref: string;

  // Dashboard
  readonly dashboardSectionTitle: string;
  readonly dashboardSectionSubtitle: string;

  // Filters
  readonly filterProcessesLabel: string;
  readonly filterQualityLabel: string;
  readonly filterIndustryLabel: string;
  readonly filterSearchPlaceholder: string;
  readonly filterSearchShortcutHint: string;
  readonly filterClearLabel: string;
  readonly filterResetLabel: string;
  readonly filterActiveCountTemplate: string;
  readonly filterActiveCountPluralTemplate: string;

  // Result count
  readonly resultTotalTemplate: string;
  readonly resultFilteredTemplate: string;

  // Insight Card
  readonly cardEvidenceBadge: string;
  readonly cardMetricsLabel: string;
  readonly cardEquipmentLabel: string;
  readonly cardIndustryLabel: string;
  readonly cardRfqLabel: string;
  readonly cardEvidenceLabel: string;

  // Modal
  readonly modalCloseLabel: string;
  readonly modalCMMTitle: string;
  readonly modalMTRTitle: string;
  readonly modalParameterLabel: string;
  readonly modalValueLabel: string;
  readonly modalStandardLabel: string;
  readonly modalHeatNumberLabel: string;
  readonly modalCMMPointCountLabel: string;
  readonly modalMTRBatchLabel: string;
  readonly modalLeadTimeLabel: string;
  readonly modalCertLabel: string;
  readonly modalRequestCtaLabel: string;

  // Drawer
  readonly drawerFloatingCtaLabel: string;
  readonly drawerTitle: string;
  readonly drawerSubtitle: string;
  readonly drawerModeAudit: string;
  readonly drawerModeAuditDesc: string;
  readonly drawerModeCmm: string;
  readonly drawerModeCmmDesc: string;
  readonly drawerModeMtr: string;
  readonly drawerModeMtrDesc: string;
  readonly drawerSelectedInsightTemplate: string;
  readonly drawerContinueLabel: string;
  readonly drawerContinueHref: string;
  readonly drawerCancelLabel: string;

  // Empty state
  readonly emptyTitle: string;
  readonly emptyDescription: string;
  readonly emptyCtaLabel: string;
  readonly emptyCtaHref: string;

  // Bottom CTA
  readonly bottomCtaTitle: string;
  readonly bottomCtaSubtitle: string;
  readonly bottomCtaPrimaryLabel: string;
  readonly bottomCtaPrimaryHref: string;
  readonly bottomCtaSecondaryLabel: string;
  readonly bottomCtaSecondaryHref: string;
}
