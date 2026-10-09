/**
 * src/types/industry-application.ts
 *
 * Strict TypeScript types for the Industry Applications Hub
 * (`/resources/industry-applications/`).
 *
 * Re-exports the const-arrays' union types so consumers can write
 * `import type { IndustrySector } from '@/types/industry-application'`.
 *
 * The actual const arrays live in
 * `src/data/industry-applications-data.ts` (Single Source of Truth for
 * run-time values). This file owns the TYPE contracts only — no circular
 * import to the data file.
 *
 * Architecture mirrors `manufacturing-insight.ts`:
 *   - 4 facet dimensions: sector / grade / standard / component
 *   - Each ApplicationCard carries a full compliance chain + 3-5 evidence
 *     metrics + an optional weight-comparison vs traditional material
 *   - Buyer Search Intelligence intent: informational | commercial | transactional
 */

// ────────────────────────────────────────────────────────────────────
// 1. Industry Sector (vertical) — D2 (Who can) hub spine
// ────────────────────────────────────────────────────────────────────

export type IndustrySector =
  | 'aerospace-defence'
  | 'medical-implant'
  | 'marine-hydrofoil'
  | 'motorsport-automotive'
  | 'subsea-oil-gas'
  | 'edc-luxury-hardware';

// ────────────────────────────────────────────────────────────────────
// 2. Material grade (D1 — what) — only the grades used in real industry
//    application cards
// ────────────────────────────────────────────────────────────────────

export type MaterialGradeId =
  | 'grade-2'
  | 'grade-5'
  | 'grade-7'
  | 'grade-12'
  | 'grade-23';

// ────────────────────────────────────────────────────────────────────
// 3. Compliance / Standard — anchors the "evidence chain" framework
// ────────────────────────────────────────────────────────────────────

export type ComplianceStandard =
  | 'iso-9001'
  | 'iso-13485'
  | 'as9100d'
  | 'astm-f136'
  | 'astm-f86'
  | 'astm-b348'
  | 'astm-e1417'
  | 'astm-e112'
  | 'ams-4928'
  | 'ams-2480'
  | 'eu-ped'
  | 'en-10204-3.1'
  | 'iso-5832-3'
  | 'iso-10993'
  | 'nace-sp0198'
  | 'nace-mr0175'
  | 'astm-b367';

// ────────────────────────────────────────────────────────────────────
// 4. Component function (the physical role the part plays)
// ────────────────────────────────────────────────────────────────────

export type ComponentFunction =
  | 'structural'
  | 'fastener'
  | 'housing-enclosure'
  | 'implant-surgical'
  | 'propulsion-hydrofoil'
  | 'jewelry-wearable'
  | 'sensor-instrument';

// ────────────────────────────────────────────────────────────────────
// 5. Search intent taxonomy (1:1 with Buyer Search Intelligence)
// ────────────────────────────────────────────────────────────────────

export type ApplicationIntent =
  | 'informational'
  | 'commercial-investigation'
  | 'transactional';

// ────────────────────────────────────────────────────────────────────
// 6. Industry RFQ Drawer mode
// ────────────────────────────────────────────────────────────────────

export type IndustryDrawerMode =
  | 'industry-rfq'
  | 'industry-drawing'
  | 'audit'
  | 'cmm-sample'
  | 'mtr-sample';

// ────────────────────────────────────────────────────────────────────
// 7. Per-card field shapes
// ────────────────────────────────────────────────────────────────────

/**
 * A single quantitative threshold or measurement surfaced on an
 * application card. Mirrors `QualityMetric` from manufacturing-insight.ts
 * but is scoped to the Industry Applications Hub vocabulary.
 */
export interface CaseMetric {
  /** Human-readable label, e.g. "Weight Saving vs Steel". */
  readonly label: string;
  /** Measured / specified value with unit, e.g. "−42%" or "Ra ≤ 0.2 µm". */
  readonly value: string;
  /** Optional comparison / baseline, e.g. "vs 316L stainless". */
  readonly baseline?: string;
  /** Optional standard / section reference, e.g. "ASTM E8 / AMS 4928". */
  readonly standard?: string;
  /** Visual emphasis (also drives aria-label). */
  readonly emphasis: 'low' | 'medium' | 'high';
}

/** Material grade + standardisation context for a single card. */
export interface MaterialSpec {
  readonly grade: MaterialGradeId;
  /** UNS designation, e.g. "R56400" for Grade 5. */
  readonly unsDesignation: string;
  /** Material form / spec, e.g. "AMS 4928 bar/billet". */
  readonly standard: string;
  /** Optional biocompatibility class (for medical cards). */
  readonly biocompatibilityClass?: string;
  /** Optional condition / temper, e.g. "Annealed". */
  readonly condition?: string;
}

/** A single compliance / certification badge with explanation. */
export interface IndustryCompliance {
  readonly id: ComplianceStandard;
  /** Short badge text, e.g. "ASTM F136". */
  readonly badge: string;
  /** 1-line explainer for the badge. */
  readonly description: string;
  /** Whether this badge applies to the parent card (true in 99% cases). */
  readonly applies: boolean;
}

/** Weight comparison vs traditional engineering materials. */
export interface WeightComparison {
  /** Display label for the titanium side, e.g. "Ti Grade 5 (4.43 g/cm³)". */
  readonly titanium: string;
  /** Stainless 316L baseline, e.g. "8.00 g/cm³". */
  readonly stainless316L?: string;
  /** Aluminum 7075 baseline, e.g. "2.81 g/cm³". */
  readonly aluminum7075?: string;
  /** Steel 4140 baseline, e.g. "7.85 g/cm³". */
  readonly steel4140?: string;
  /** Optional note (e.g. test method, room-temp density). */
  readonly note?: string;
}

/**
 * Hub-level RFQ carry-on payload — the floating drawer auto-fills the
 * /rfq/ form with this context. Buyers never have to re-type the
 * industry / grade / standard they have already filtered for.
 */
export interface RfqDefaultContext {
  readonly sector: IndustrySector;
  readonly grade: MaterialGradeId;
  readonly compliance: readonly ComplianceStandard[];
  /** Optional part-context hint passed to /rfq/?part=. */
  readonly partHint?: string;
}

// ────────────────────────────────────────────────────────────────────
// 8. The ApplicationCard — one industry application / case
// ────────────────────────────────────────────────────────────────────

export interface ApplicationCard {
  /** Stable id used as URL param + React key. e.g. 'aerospace-structural-bracket-5axis'. */
  readonly id: string;
  /** URL slug (must match id for shareable deep-links). */
  readonly slug: string;
  /** Display title (8-12 words max). */
  readonly title: string;
  /** One-line direct answer (also rendered in JSON-LD about slot). */
  readonly directAnswer: string;
  /** Long description (2-3 sentences). */
  readonly description: string;
  /** Search-intent classification — drives card band placement. */
  readonly intent: ApplicationIntent;
  /** Featured cards get larger visual treatment in the grid. */
  readonly featured: boolean;
  /** Industry sector. */
  readonly sector: IndustrySector;
  /** Component function(s) the part serves. */
  readonly componentFunctions: readonly ComponentFunction[];
  /** Material grade + standard. */
  readonly materialSpec: MaterialSpec;
  /** Ordered list of applicable standards (drives compliance chain UI). */
  readonly complianceChain: readonly ComplianceStandard[];
  /** Detailed compliance badges (id + description). */
  readonly complianceBadges: readonly IndustryCompliance[];
  /** Workshop pain-point addressed. */
  readonly challenge: string;
  /** Boze Metal shop-floor solution. */
  readonly solution: string;
  /** 3-5 quantitative evidence metrics (real data, no fabrication). */
  readonly evidenceMetrics: readonly CaseMetric[];
  /** Optional weight comparison vs traditional materials. */
  readonly weightComparisonVs?: WeightComparison;
  /** Related Boze pages (relative URLs ending with `/`). */
  readonly relatedPages: readonly string[];
  /** RFQ carry-on payload (auto-fill industry context). */
  readonly rfqDefaultContext: RfqDefaultContext;
  /** Dashboard accent (which industry hero-matrix sub-callout this anchors). */
  readonly dashboardAccent:
    | 'aerospace'
    | 'medical'
    | 'marine'
    | 'motorsport'
    | 'subsea'
    | 'edc';
}

// ────────────────────────────────────────────────────────────────────
// 9. URL State — Single Source of Truth for shareable filter view
// ────────────────────────────────────────────────────────────────────

export interface IndustryApplicationUrlState {
  readonly query: string;
  readonly sectors: readonly IndustrySector[];
  readonly grades: readonly MaterialGradeId[];
  readonly standards: readonly ComplianceStandard[];
  readonly components: readonly ComponentFunction[];
  readonly openCardId: string | null;
  readonly drawer: IndustryDrawerMode | null;
}

// ────────────────────────────────────────────────────────────────────
// 10. Facet group definitions (passed to filter bar UI)
// ────────────────────────────────────────────────────────────────────

export interface IndustryFacetGroup<T extends string> {
  readonly id: 'sector' | 'grade' | 'standard' | 'component';
  readonly label: string;
  readonly values: ReadonlyArray<T>;
  readonly labels: Readonly<Record<T, string>>;
}

export interface IndustryFacetGroups {
  readonly sector: IndustryFacetGroup<IndustrySector>;
  readonly grade: IndustryFacetGroup<MaterialGradeId>;
  readonly standard: IndustryFacetGroup<ComplianceStandard>;
  readonly component: IndustryFacetGroup<ComponentFunction>;
}

// ────────────────────────────────────────────────────────────────────
// 11. Hub-level i18n strings (English baseline; other locales TBD)
// ────────────────────────────────────────────────────────────────────

export interface IndustryApplicationHubStrings {
  // Hero
  readonly heroBadge: string;
  readonly heroTitle: string;
  readonly heroSubtitle: string;
  readonly heroCtaPrimary: string;
  readonly heroCtaPrimaryHref: string;
  readonly heroCtaSecondary: string;
  readonly heroCtaSecondaryHref: string;

  // Hero Matrix
  readonly matrixSectionTitle: string;
  readonly matrixSectionSubtitle: string;
  readonly matrixAccentAerospace: string;
  readonly matrixAccentMedical: string;
  readonly matrixAccentMarine: string;
  readonly matrixAccentMotorsport: string;
  readonly matrixAccentSubsea: string;
  readonly matrixAccentEdc: string;

  // Filter Bar
  readonly filterSectorLabel: string;
  readonly filterGradeLabel: string;
  readonly filterStandardLabel: string;
  readonly filterComponentLabel: string;
  readonly filterSearchPlaceholder: string;
  readonly filterSearchShortcutHint: string;
  readonly filterClearLabel: string;
  readonly filterResetLabel: string;
  readonly filterActiveCountTemplate: string;
  readonly filterActiveCountPluralTemplate: string;

  // Result count
  readonly resultTotalTemplate: string;
  readonly resultFilteredTemplate: string;

  // Application Card
  readonly cardFeaturedBadge: string;
  readonly cardChallengeLabel: string;
  readonly cardSolutionLabel: string;
  readonly cardEvidenceLabel: string;
  readonly cardComplianceLabel: string;
  readonly cardComplianceFullLabel: string;
  readonly cardViewEvidenceLabel: string;
  readonly cardRfqLabel: string;
  readonly cardMaterialGradeLabel: string;

  // Comparator
  readonly comparatorSectionTitle: string;
  readonly comparatorSectionSubtitle: string;
  readonly comparatorMaterialHeader: string;
  readonly comparatorDensityHeader: string;
  readonly comparatorTensileHeader: string;
  readonly comparatorCorrosionHeader: string;
  readonly comparatorBiocompatHeader: string;
  readonly comparatorCostHeader: string;
  readonly comparatorNote: string;
  readonly comparatorTiGrade5: string;
  readonly comparatorTiGrade23: string;
  readonly comparatorTiGrade7: string;
  readonly comparatorSS316L: string;
  readonly comparatorAl7075: string;
  readonly comparatorSteel4140: string;

  // Modal (application detail)
  readonly modalCloseLabel: string;
  readonly modalChallengeTitle: string;
  readonly modalSolutionTitle: string;
  readonly modalEvidenceTitle: string;
  readonly modalWeightComparisonTitle: string;
  readonly modalComplianceTitle: string;
  readonly modalRelatedPagesLabel: string;
  readonly modalRequestCtaLabel: string;
  readonly modalStandardLabel: string;
  readonly modalBaselineLabel: string;
  readonly modalEmphasisHighLabel: string;
  readonly modalEmphasisMediumLabel: string;
  readonly modalEmphasisLowLabel: string;

  // Drawer (Industry RFQ)
  readonly drawerFloatingCtaLabel: string;
  readonly drawerTitle: string;
  readonly drawerSubtitle: string;
  readonly drawerSelectedContextTemplate: string;
  readonly drawerSelectedSectorLabel: string;
  readonly drawerSelectedGradeLabel: string;
  readonly drawerSelectedStandardLabel: string;
  readonly drawerModeIndustryRfq: string;
  readonly drawerModeIndustryRfqDesc: string;
  readonly drawerModeIndustryDrawing: string;
  readonly drawerModeIndustryDrawingDesc: string;
  readonly drawerModeAudit: string;
  readonly drawerModeAuditDesc: string;
  readonly drawerModeCmmSample: string;
  readonly drawerModeCmmSampleDesc: string;
  readonly drawerModeMtrSample: string;
  readonly drawerModeMtrSampleDesc: string;
  readonly drawerContinueLabel: string;
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
