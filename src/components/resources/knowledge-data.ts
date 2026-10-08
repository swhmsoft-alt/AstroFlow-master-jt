/**
 * knowledge-data.ts
 *
 * Type definitions + facet taxonomy for the Titanium Knowledge Base
 * (`/resources/titanium-knowledge-base/`). React-island-side; consumed by:
 *   - `KnowledgeBaseHub.tsx`     — orchestrates state + filtering
 *   - `KnowledgeFacetSidebar.tsx` — renders the 4-dim checkbox groups
 *   - `KnowledgeArticleGrid.tsx`  — renders the article cards
 *   - `useKnowledgeUrlState.ts`   — round-trips filters through URL params
 *
 * Single Source of Truth for the facet vocabulary. Adding a new grade /
 * process / standard / industry option means adding it to the corresponding
 * `Knowledge*` type union here AND to the matching zod enum in
 * `src/content/config.ts → knowledgeCollection`. The two stay in lockstep.
 *
 * The 6-letter ISO-style slugs in each union (e.g. 'alpha-beta-gr5',
 * 'astm-b348') are the canonical URL param tokens — also reused as the
 * `id` field on the corresponding markdown frontmatter tag. Keep them
 * lowercase, kebab-cased, no spaces.
 */

export type KnowledgeGrade =
  | 'cp-gr1' | 'cp-gr2' | 'cp-gr3' | 'cp-gr4'
  | 'alpha-beta-gr5' | 'alpha-beta-gr23'
  | 'beta-gr19' | 'beta-gr21';

export type KnowledgeProcess =
  | '5-axis-cnc' | 'swiss-lathe' | 'wire-edm' | 'anodizing' | 'pvd'
  | 'additive-manufacturing' | 'fabrication';

export type KnowledgeStandard =
  | 'astm-b348' | 'astm-f136' | 'ams-4928' | 'iso-9001' | 'eu-ped'
  | 'as9100d' | 'iso-13485';

export type KnowledgeIndustry =
  | 'aerospace' | 'medical-implants' | 'marine-superyacht'
  | 'racing-motorsport' | 'subsea-hydrofoil' | 'chemical';

export type KnowledgeViewMode = 'grid' | 'list';

export type KnowledgeDimension = 'grade' | 'process' | 'standard' | 'industry';

export interface KnowledgeArticle {
  readonly id: string;
  readonly title: string;
  readonly slug: string;
  readonly summary: string;
  /** Pre-rendered HTML body (Markdown → HTML at build time). */
  readonly bodyHtml: string;
  readonly gradeTags: readonly KnowledgeGrade[];
  readonly processTags: readonly KnowledgeProcess[];
  readonly standardTags: readonly KnowledgeStandard[];
  readonly industryTags: readonly KnowledgeIndustry[];
  /** ISO 8601 publication date (e.g. "2026-09-22"). */
  readonly publishedAt: string;
  /** ISO 8601 last-modified date. */
  readonly updatedAt: string;
  /** Estimated read time in minutes. */
  readonly readTimeMinutes: number;
  /** The single most-prominent compliance standard for badge highlight. */
  readonly primaryStandard?: KnowledgeStandard;
  readonly featured: boolean;
  /** Word count — used for readTime fallback when frontmatter is missing. */
  readonly wordCount: number;
}

export interface KnowledgeFilters {
  readonly query: string;
  readonly grades: readonly KnowledgeGrade[];
  readonly processes: readonly KnowledgeProcess[];
  readonly standards: readonly KnowledgeStandard[];
  readonly industries: readonly KnowledgeIndustry[];
  readonly view: KnowledgeViewMode;
}

export interface KnowledgeFacetOption {
  readonly id: string;
  readonly label: string;
  readonly count: number;
}

export interface KnowledgeFacetGroup {
  readonly dimension: KnowledgeDimension;
  readonly label: string;
  readonly options: readonly KnowledgeFacetOption[];
}

/** Human-readable labels for the grade dimension. */
export const GRADE_LABELS: Readonly<Record<KnowledgeGrade, string>> = {
  'cp-gr1': 'CP Grade 1',
  'cp-gr2': 'CP Grade 2',
  'cp-gr3': 'CP Grade 3',
  'cp-gr4': 'CP Grade 4',
  'alpha-beta-gr5': 'Grade 5 (Ti-6Al-4V)',
  'alpha-beta-gr23': 'Grade 23 (Ti-6Al-4V ELI)',
  'beta-gr19': 'Grade 19 (Ti-3Al-8V-6Cr-4Zr-4Mo)',
  'beta-gr21': 'Grade 21 (Ti-15Mo-3Nb-3Al-0.2Si)',
};

/** Human-readable labels for the process dimension. */
export const PROCESS_LABELS: Readonly<Record<KnowledgeProcess, string>> = {
  '5-axis-cnc': '5-Axis CNC Milling',
  'swiss-lathe': 'Swiss Lathe Turning',
  'wire-edm': 'Wire EDM',
  'anodizing': 'Anodizing',
  'pvd': 'PVD Coating',
  'additive-manufacturing': 'Additive Manufacturing',
  'fabrication': 'Fabrication & Welding',
};

/** Human-readable labels for the standards dimension. */
export const STANDARD_LABELS: Readonly<Record<KnowledgeStandard, string>> = {
  'astm-b348': 'ASTM B348',
  'astm-f136': 'ASTM F136',
  'ams-4928': 'AMS 4928',
  'iso-9001': 'ISO 9001',
  'eu-ped': 'EU PED',
  'as9100d': 'AS9100D',
  'iso-13485': 'ISO 13485',
};

/** Human-readable labels for the industry dimension. */
export const INDUSTRY_LABELS: Readonly<Record<KnowledgeIndustry, string>> = {
  'aerospace': 'Aerospace',
  'medical-implants': 'Medical Implants',
  'marine-superyacht': 'Marine & Superyacht',
  'racing-motorsport': 'Racing & Motorsport',
  'subsea-hydrofoil': 'Subsea Hydrofoil',
  'chemical': 'Chemical Processing',
};

/** Default empty filter state — used on first paint and on reset. */
export const EMPTY_FILTERS: KnowledgeFilters = {
  query: '',
  grades: [],
  processes: [],
  standards: [],
  industries: [],
  view: 'grid',
} as const;

/** Dimension → label map, drives sidebar group headers. */
export const DIMENSION_LABELS: Readonly<Record<KnowledgeDimension, string>> = {
  grade: 'Titanium Grade',
  process: 'CNC & Processing',
  standard: 'Standards & Compliance',
  industry: 'Application Sector',
};

/** Type guard helpers — used by useKnowledgeUrlState to sanitize URL params. */
const GRADE_SET: ReadonlySet<string> = new Set<KnowledgeGrade>([
  'cp-gr1', 'cp-gr2', 'cp-gr3', 'cp-gr4',
  'alpha-beta-gr5', 'alpha-beta-gr23',
  'beta-gr19', 'beta-gr21',
]);
const PROCESS_SET: ReadonlySet<string> = new Set<KnowledgeProcess>([
  '5-axis-cnc', 'swiss-lathe', 'wire-edm', 'anodizing', 'pvd',
  'additive-manufacturing', 'fabrication',
]);
const STANDARD_SET: ReadonlySet<string> = new Set<KnowledgeStandard>([
  'astm-b348', 'astm-f136', 'ams-4928', 'iso-9001', 'eu-ped',
  'as9100d', 'iso-13485',
]);
const INDUSTRY_SET: ReadonlySet<string> = new Set<KnowledgeIndustry>([
  'aerospace', 'medical-implants', 'marine-superyacht',
  'racing-motorsport', 'subsea-hydrofoil', 'chemical',
]);

export function isKnowledgeGrade(v: string): v is KnowledgeGrade {
  return GRADE_SET.has(v);
}
export function isKnowledgeProcess(v: string): v is KnowledgeProcess {
  return PROCESS_SET.has(v);
}
export function isKnowledgeStandard(v: string): v is KnowledgeStandard {
  return STANDARD_SET.has(v);
}
export function isKnowledgeIndustry(v: string): v is KnowledgeIndustry {
  return INDUSTRY_SET.has(v);
}
export function isKnowledgeViewMode(v: string): v is KnowledgeViewMode {
  return v === 'grid' || v === 'list';
}

/**
 * Pure filter function — single point of filtering logic. Memoization is the
 * caller's responsibility (see KnowledgeBaseHub).
 *
 * @param articles  the full corpus (always the same reference, never mutated)
 * @param filters   current filter state from useKnowledgeUrlState
 * @param query     DEBOUNCED search query (caller pre-debounces for perf)
 */
export function filterKnowledgeArticles(
  articles: readonly KnowledgeArticle[],
  filters: KnowledgeFilters,
  query: string,
): readonly KnowledgeArticle[] {
  const q = query.trim().toLowerCase();
  const hasGrade = filters.grades.length > 0;
  const hasProcess = filters.processes.length > 0;
  const hasStandard = filters.standards.length > 0;
  const hasIndustry = filters.industries.length > 0;
  const hasAnyFilter = hasGrade || hasProcess || hasStandard || hasIndustry;
  if (q.length === 0 && !hasAnyFilter) return articles;

  return articles.filter((a) => {
    // ── Free-text query — match title + summary + first 500 chars of body ──
    if (q.length > 0) {
      const hay = `${a.title} ${a.summary} ${a.bodyHtml.slice(0, 500)}`.toLowerCase();
      if (!hay.includes(q)) return false;
    }
    // ── Facet filters: OR-within-dimension, AND-across-dimensions ──
    if (hasGrade && !filters.grades.some((g) => a.gradeTags.includes(g))) return false;
    if (hasProcess && !filters.processes.some((p) => a.processTags.includes(p))) return false;
    if (hasStandard && !filters.standards.some((s) => a.standardTags.includes(s))) return false;
    if (hasIndustry && !filters.industries.some((i) => a.industryTags.includes(i))) return false;
    return true;
  });
}

/**
 * Compute the count for each facet option, EXCLUDING the dimension being
 * computed. This is the standard "Amazon-style" faceting: the grade counts
 * show "how many results would match if I picked THIS grade, given the
 * currently selected process/standard/industry filters".
 *
 * Result is memoization-friendly (pure, no closure captures).
 */
export function computeFacetCounts(
  articles: readonly KnowledgeArticle[],
  filters: KnowledgeFilters,
  query: string,
  dimension: KnowledgeDimension,
): Readonly<Record<string, number>> {
  const q = query.trim().toLowerCase();
  const counts: Record<string, number> = {};

  // Build a filter copy with the current dimension emptied.
  const filtersWithoutDim: KnowledgeFilters = {
    query: filters.query,
    grades: dimension === 'grade' ? [] : filters.grades,
    processes: dimension === 'process' ? [] : filters.processes,
    standards: dimension === 'standard' ? [] : filters.standards,
    industries: dimension === 'industry' ? [] : filters.industries,
    view: filters.view,
  };

  for (const a of articles) {
    // Apply the non-current-dimension filters (and the query).
    if (q.length > 0) {
      const hay = `${a.title} ${a.summary} ${a.bodyHtml.slice(0, 500)}`.toLowerCase();
      if (!hay.includes(q)) continue;
    }
    if (filtersWithoutDim.grades.length > 0
      && !filtersWithoutDim.grades.some((g) => a.gradeTags.includes(g))) continue;
    if (filtersWithoutDim.processes.length > 0
      && !filtersWithoutDim.processes.some((p) => a.processTags.includes(p))) continue;
    if (filtersWithoutDim.standards.length > 0
      && !filtersWithoutDim.standards.some((s) => a.standardTags.includes(s))) continue;
    if (filtersWithoutDim.industries.length > 0
      && !filtersWithoutDim.industries.some((i) => a.industryTags.includes(i))) continue;

    // Count this article toward each tag it carries in the target dimension.
    const tags = (() => {
      switch (dimension) {
        case 'grade': return a.gradeTags;
        case 'process': return a.processTags;
        case 'standard': return a.standardTags;
        case 'industry': return a.industryTags;
      }
    })();
    for (const t of tags) counts[t] = (counts[t] ?? 0) + 1;
  }

  return counts;
}

/** Build the 4 facet groups in stable display order. */
export function buildFacetGroups(
  articles: readonly KnowledgeArticle[],
  filters: KnowledgeFilters,
  query: string,
): readonly KnowledgeFacetGroup[] {
  const gradeCounts = computeFacetCounts(articles, filters, query, 'grade');
  const processCounts = computeFacetCounts(articles, filters, query, 'process');
  const standardCounts = computeFacetCounts(articles, filters, query, 'standard');
  const industryCounts = computeFacetCounts(articles, filters, query, 'industry');

  const buildOptions = (
    ids: readonly string[],
    labels: Readonly<Record<string, string>>,
    counts: Readonly<Record<string, number>>,
  ): readonly KnowledgeFacetOption[] =>
    ids.map((id) => ({ id, label: labels[id] ?? id, count: counts[id] ?? 0 }));

  return [
    {
      dimension: 'grade',
      label: DIMENSION_LABELS.grade,
      options: buildOptions(
        Object.keys(GRADE_LABELS),
        GRADE_LABELS as Readonly<Record<string, string>>,
        gradeCounts,
      ),
    },
    {
      dimension: 'process',
      label: DIMENSION_LABELS.process,
      options: buildOptions(
        Object.keys(PROCESS_LABELS),
        PROCESS_LABELS as Readonly<Record<string, string>>,
        processCounts,
      ),
    },
    {
      dimension: 'standard',
      label: DIMENSION_LABELS.standard,
      options: buildOptions(
        Object.keys(STANDARD_LABELS),
        STANDARD_LABELS as Readonly<Record<string, string>>,
        standardCounts,
      ),
    },
    {
      dimension: 'industry',
      label: DIMENSION_LABELS.industry,
      options: buildOptions(
        Object.keys(INDUSTRY_LABELS),
        INDUSTRY_LABELS as Readonly<Record<string, string>>,
        industryCounts,
      ),
    },
  ];
}
