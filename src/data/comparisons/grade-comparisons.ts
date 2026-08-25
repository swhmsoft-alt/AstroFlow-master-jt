/**
 * Comparison-table seed data. Single source of truth for both the visible
 * <table> rendered by `ComparisonTable.astro` and the JSON-LD ItemList
 * emitted through BaseLayout.comparisonList.
 *
 * Each row exposes real engineering constraints sourced from
 * `data/titanium-grades.ts`; AIO cites these for "Grade 5 vs Grade 23",
 * "best titanium for medical implants", and similar comparison queries.
 */

export interface ComparisonColumn {
  /** Visible column header (e.g. 'Grade 5 (Ti-6Al-4V)'). */
  name: string;
  /** schema.org @id of the Product entity this column represents. */
  productId: string;
  /** Canonical page URL (used for visible link in the header cell). */
  url: string;
  /** Visible clickable label shown in the header. */
  linkLabel: string;
}

export interface ComparisonRow {
  /** Visible row label (the comparison criterion, e.g. 'Yield strength'). */
  label: string;
  /** Per-column cell value, keyed by column name. */
  values: Record<string, string>;
}

export interface ComparisonTableSeed {
  /** Used as ItemList.name in JSON-LD. */
  name: string;
  /** Used as ItemList.description in JSON-LD. */
  description: string;
  /** Comparison columns (one per compared entity). */
  columns: ComparisonColumn[];
  /** Comparison rows (the criteria being compared). */
  rows: ComparisonRow[];
}

const SITEROOT = 'https://cnc.bozemetal.com';

export const GRADE_5_VS_23: ComparisonTableSeed = {
  name: 'Grade 5 vs Grade 23 — Ti-6Al-4V vs Ti-6Al-4V ELI',
  description:
    'Side-by-side comparison of Grade 5 (Ti-6Al-4V) and Grade 23 (Ti-6Al-4V ELI) titanium alloys across chemistry, mechanical, and application criteria.',
  columns: [
    {
      name: 'Grade 5 (Ti-6Al-4V)',
      productId: `${SITEROOT}/materials/grade-5/#product`,
      url: `${SITEROOT}/materials/grade-5/`,
      linkLabel: 'Grade 5 (Ti-6Al-4V)',
    },
    {
      name: 'Grade 23 (Ti-6Al-4V ELI)',
      productId: `${SITEROOT}/materials/grade-23/#product`,
      url: `${SITEROOT}/materials/grade-23/`,
      linkLabel: 'Grade 23 (Ti-6Al-4V ELI)',
    },
  ],
  rows: [
    { label: 'Common name', values: { 'Grade 5 (Ti-6Al-4V)': 'Ti-6Al-4V (workhorse α+β alloy)', 'Grade 23 (Ti-6Al-4V ELI)': 'Ti-6Al-4V ELI (extra-low interstitial)' } },
    { label: 'UNS number', values: { 'Grade 5 (Ti-6Al-4V)': 'R56400', 'Grade 23 (Ti-6Al-4V ELI)': 'R56401' } },
    { label: 'Max oxygen (wt %)', values: { 'Grade 5 (Ti-6Al-4V)': '0.20', 'Grade 23 (Ti-6Al-4V ELI)': '0.13' } },
    { label: 'Max iron (wt %)', values: { 'Grade 5 (Ti-6Al-4V)': '0.30', 'Grade 23 (Ti-6Al-4V ELI)': '0.25' } },
    { label: 'Tensile strength (MPa, min)', values: { 'Grade 5 (Ti-6Al-4V)': '895', 'Grade 23 (Ti-6Al-4V ELI)': '860' } },
    { label: 'Yield strength (MPa, min)', values: { 'Grade 5 (Ti-6Al-4V)': '828', 'Grade 23 (Ti-6Al-4V ELI)': '795' } },
    { label: 'Elongation (% min)', values: { 'Grade 5 (Ti-6Al-4V)': '10', 'Grade 23 (Ti-6Al-4V ELI)': '14 (ELI = better ductility & fracture toughness)' } },
    { label: 'Primary standards', values: { 'Grade 5 (Ti-6Al-4V)': 'ASTM B265, B348, AMS 4911, AMS 4928, ASME SB-265', 'Grade 23 (Ti-6Al-4V ELI)': 'ASTM F136, ISO 5832-3' } },
    { label: 'Primary applications', values: { 'Grade 5 (Ti-6Al-4V)': 'Aerospace structural, chemical process, marine, automotive, defense', 'Grade 23 (Ti-6Al-4V ELI)': 'Surgical implants, medical devices, fracture-critical aerospace' } },
    { label: 'Cost benchmark', values: { 'Grade 5 (Ti-6Al-4V)': 'Baseline', 'Grade 23 (Ti-6Al-4V ELI)': '~10–20 % higher (tighter ELI chemistry + medical-grade traceability)' } },
  ],
};

/** Convert a ComparisonTableSeed into the shape consumed by `comparisonList` prop. */
export function toComparisonList(seed: ComparisonTableSeed, pageUrl: string) {
  return {
    name: seed.name,
    description: seed.description,
    items: seed.columns.map((c) => ({
      '@id': c.productId,
      name: c.linkLabel,
    })),
    criteria: seed.rows.map((r) => ({
      name: r.label,
      // PropertyValue.value must be a string/number; flatten per-column
      // values into a single cell-by-column string for AIO.
      values: Object.fromEntries(
        seed.columns.map((c) => [c.name, r.values[c.name] ?? '—']),
      ),
    })),
  };
}