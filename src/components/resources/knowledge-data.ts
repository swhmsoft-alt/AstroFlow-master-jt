/**
 * knowledge-data.ts
 *
 * Type definitions + facet taxonomy for the Titanium Knowledge Base
 * (`/resources/titanium-knowledge-base/`). The hub is a CONSUMER view of
 * the existing blog collection — it does NOT own a content source. The
 * 4-dimension facet taxonomy (grade / process / standard / industry) is
 * derived at runtime from each blog entry's existing `tags` array via
 * the `derive*FromTags` pure functions below. New articles are NEVER
 * created by this module — only existing blog tags are matched.
 *
 * Architectural rule (post-mortem 2026-10-08):
 *   - Knowledge Base hub = `getCollection('blog')` filtered by tag heuristics
 *   - 4 facets are derived from `entry.data.tags` (real blog tag vocabulary)
 *   - Detail pages reuse the existing `src/pages/blog/[...slug].astro` route
 *   - URL pattern: `/blog/<entry.slug>/` (Astro-derived, no `.md` extension)
 *
 * If a tag does not appear in the dictionaries below, that blog entry simply
 * will not be counted in the corresponding facet bucket. NO fabrication.
 */

export type KnowledgeGrade =
  | "cp-gr1" | "cp-gr2" | "cp-gr3" | "cp-gr4"
  | "alpha-beta-gr5" | "alpha-beta-gr23"
  | "beta-gr19" | "beta-gr21";

export type KnowledgeProcess =
  | "5-axis-cnc" | "swiss-lathe" | "wire-edm" | "anodizing" | "pvd"
  | "additive-manufacturing" | "fabrication";

export type KnowledgeStandard =
  | "astm-b348" | "astm-f136" | "ams-4928" | "iso-9001" | "eu-ped"
  | "as9100d" | "iso-13485";

export type KnowledgeIndustry =
  | "aerospace" | "medical-implants" | "marine-superyacht"
  | "racing-motorsport" | "subsea-hydrofoil" | "chemical";

export type KnowledgeViewMode = "grid" | "list";

export type KnowledgeDimension = "grade" | "process" | "standard" | "industry";

export interface KnowledgeArticle {
  readonly id: string;
  readonly title: string;
  /** URL slug (no `.md`, no leading slash). Source: `entry.slug` from Astro. */
  readonly slug: string;
  readonly summary: string;
  readonly bodyHtml: string;
  readonly gradeTags: readonly KnowledgeGrade[];
  readonly processTags: readonly KnowledgeProcess[];
  readonly standardTags: readonly KnowledgeStandard[];
  readonly industryTags: readonly KnowledgeIndustry[];
  readonly publishedAt: string;
  readonly updatedAt: string;
  readonly readTimeMinutes: number;
  readonly primaryStandard?: KnowledgeStandard;
  readonly featured: boolean;
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

export const GRADE_LABELS: Readonly<Record<KnowledgeGrade, string>> = {
  "cp-gr1": "CP Grade 1",
  "cp-gr2": "CP Grade 2",
  "cp-gr3": "CP Grade 3",
  "cp-gr4": "CP Grade 4",
  "alpha-beta-gr5": "Grade 5 (Ti-6Al-4V)",
  "alpha-beta-gr23": "Grade 23 (Ti-6Al-4V ELI)",
  "beta-gr19": "Grade 19 (Ti-3Al-8V-6Cr-4Zr-4Mo)",
  "beta-gr21": "Grade 21 (Ti-15Mo-3Nb-3Al-0.2Si)",
};

export const PROCESS_LABELS: Readonly<Record<KnowledgeProcess, string>> = {
  "5-axis-cnc": "5-Axis CNC Milling",
  "swiss-lathe": "Swiss Lathe Turning",
  "wire-edm": "Wire EDM",
  "anodizing": "Anodizing",
  "pvd": "PVD Coating",
  "additive-manufacturing": "Additive Manufacturing",
  "fabrication": "Fabrication & Welding",
};

export const STANDARD_LABELS: Readonly<Record<KnowledgeStandard, string>> = {
  "astm-b348": "ASTM B348",
  "astm-f136": "ASTM F136",
  "ams-4928": "AMS 4928",
  "iso-9001": "ISO 9001",
  "eu-ped": "EU PED",
  "as9100d": "AS9100D",
  "iso-13485": "ISO 13485",
};

export const INDUSTRY_LABELS: Readonly<Record<KnowledgeIndustry, string>> = {
  "aerospace": "Aerospace",
  "medical-implants": "Medical Implants",
  "marine-superyacht": "Marine & Superyacht",
  "racing-motorsport": "Racing & Motorsport",
  "subsea-hydrofoil": "Subsea Hydrofoil",
  "chemical": "Chemical Processing",
};

export const EMPTY_FILTERS: KnowledgeFilters = {
  query: "",
  grades: [],
  processes: [],
  standards: [],
  industries: [],
  view: "grid",
} as const;

export const DIMENSION_LABELS: Readonly<Record<KnowledgeDimension, string>> = {
  grade: "Titanium Grade",
  process: "CNC & Processing",
  standard: "Standards & Compliance",
  industry: "Application Sector",
};

const GRADE_TAG_PATTERNS: ReadonlyArray<readonly [RegExp, KnowledgeGrade]> = [
  [/\bGrade\s*5\b/i, "alpha-beta-gr5"],
  [/\bTi-?6Al-?4V\b(?!\s*ELI)/i, "alpha-beta-gr5"],
  [/\bGrade\s*23\b/i, "alpha-beta-gr23"],
  [/\bTi-?6Al-?4V\s*ELI\b/i, "alpha-beta-gr23"],
  [/\bGrade\s*2\b/i, "cp-gr2"],
  [/\bCP\s*Titanium\b/i, "cp-gr2"],
  [/\bCommercially\s*Pure\b/i, "cp-gr2"],
  [/\bGrade\s*1\b/i, "cp-gr1"],
  [/\bGrade\s*3\b/i, "cp-gr3"],
  [/\bGrade\s*4\b/i, "cp-gr4"],
];

const PROCESS_TAG_PATTERNS: ReadonlyArray<readonly [RegExp, KnowledgeProcess]> = [
  [/\b5-?Axis\s*Machining\b/i, "5-axis-cnc"],
  [/\bTitanium\s*CNC\b/i, "5-axis-cnc"],
  [/\bCNC\s*Machining\b/i, "5-axis-cnc"],
  [/\bTitanium\s*EDM\b/i, "wire-edm"],
  [/\bEDM\b/i, "wire-edm"],
  [/\bTitanium\s*Welding\b/i, "fabrication"],
  [/\bTIG\s*Welding\b/i, "fabrication"],
  [/\bAerospace\s*Welding\b/i, "fabrication"],
  [/\bWelding\b/i, "fabrication"],
  [/\bWelded\s*Assembl/i, "fabrication"],
  [/\bAnodizing\b/i, "anodizing"],
];

const STANDARD_TAG_PATTERNS: ReadonlyArray<readonly [RegExp, KnowledgeStandard]> = [
  [/\bASTM\s*B348\b/i, "astm-b348"],
  [/\bASTM\s*F136\b/i, "astm-f136"],
  [/\bISO\s*5832-?3\b/i, "astm-f136"],
  [/\bASTM\s*F1472\b/i, "astm-b348"],
  [/\bAS9100D\b/i, "as9100d"],
  [/\bAS9100\b/i, "as9100d"],
  [/\bAS9102\b/i, "as9100d"],
  [/\bISO\s*13485\b/i, "iso-13485"],
  [/\bEN\s*10204\b/i, "iso-9001"],
];

const INDUSTRY_TAG_PATTERNS: ReadonlyArray<readonly [RegExp, KnowledgeIndustry]> = [
  [/\bAerospace\b/i, "aerospace"],
  [/\bMedical\s*Implant/i, "medical-implants"],
  [/\bChemical\s*Processing\b/i, "chemical"],
  [/\bMarine\b/i, "marine-superyacht"],
  [/\bRacing\b/i, "racing-motorsport"],
];

function deriveFromTags<T extends string>(
  tags: readonly string[],
  patterns: ReadonlyArray<readonly [RegExp, T]>,
): T[] {
  const joined = tags.join(" ");
  const seen = new Set<T>();
  for (const [pattern, id] of patterns) {
    if (pattern.test(joined)) seen.add(id);
  }
  return Array.from(seen);
}

export function deriveGradesFromTags(tags: readonly string[]): KnowledgeGrade[] {
  return deriveFromTags(tags, GRADE_TAG_PATTERNS);
}

export function deriveProcessesFromTags(tags: readonly string[]): KnowledgeProcess[] {
  return deriveFromTags(tags, PROCESS_TAG_PATTERNS);
}

export function deriveStandardsFromTags(tags: readonly string[]): KnowledgeStandard[] {
  return deriveFromTags(tags, STANDARD_TAG_PATTERNS);
}

export function deriveIndustriesFromTags(tags: readonly string[]): KnowledgeIndustry[] {
  return deriveFromTags(tags, INDUSTRY_TAG_PATTERNS);
}

export function isTitaniumBlogEntry(
  tags: readonly string[],
  title: string,
): boolean {
  const hay = `${title} ${tags.join(" ")}`;
  return /\b(titanium|Ti-6Al-4V|Ti-3Al-2\.5V|Ti-6Al-4V ELI)\b/i.test(hay)
    || /\b(Grade\s*[1-9]|CP\s*Titanium)\b/i.test(hay);
}

const GRADE_SET: ReadonlySet<string> = new Set<KnowledgeGrade>([
  "cp-gr1", "cp-gr2", "cp-gr3", "cp-gr4",
  "alpha-beta-gr5", "alpha-beta-gr23",
  "beta-gr19", "beta-gr21",
]);
const PROCESS_SET: ReadonlySet<string> = new Set<KnowledgeProcess>([
  "5-axis-cnc", "swiss-lathe", "wire-edm", "anodizing", "pvd",
  "additive-manufacturing", "fabrication",
]);
const STANDARD_SET: ReadonlySet<string> = new Set<KnowledgeStandard>([
  "astm-b348", "astm-f136", "ams-4928", "iso-9001", "eu-ped",
  "as9100d", "iso-13485",
]);
const INDUSTRY_SET: ReadonlySet<string> = new Set<KnowledgeIndustry>([
  "aerospace", "medical-implants", "marine-superyacht",
  "racing-motorsport", "subsea-hydrofoil", "chemical",
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
  return v === "grid" || v === "list";
}

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
    if (q.length > 0) {
      const hay = `${a.title} ${a.summary} ${a.bodyHtml.slice(0, 500)}`.toLowerCase();
      if (!hay.includes(q)) return false;
    }
    if (hasGrade && !filters.grades.some((g) => a.gradeTags.includes(g))) return false;
    if (hasProcess && !filters.processes.some((p) => a.processTags.includes(p))) return false;
    if (hasStandard && !filters.standards.some((s) => a.standardTags.includes(s))) return false;
    if (hasIndustry && !filters.industries.some((i) => a.industryTags.includes(i))) return false;
    return true;
  });
}

export function computeFacetCounts(
  articles: readonly KnowledgeArticle[],
  filters: KnowledgeFilters,
  query: string,
  dimension: KnowledgeDimension,
): Readonly<Record<string, number>> {
  const q = query.trim().toLowerCase();
  const counts: Record<string, number> = {};
  const filtersWithoutDim: KnowledgeFilters = {
    query: filters.query,
    grades: dimension === "grade" ? [] : filters.grades,
    processes: dimension === "process" ? [] : filters.processes,
    standards: dimension === "standard" ? [] : filters.standards,
    industries: dimension === "industry" ? [] : filters.industries,
    view: filters.view,
  };
  for (const a of articles) {
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
    const tags = (() => {
      switch (dimension) {
        case "grade": return a.gradeTags;
        case "process": return a.processTags;
        case "standard": return a.standardTags;
        case "industry": return a.industryTags;
      }
    })();
    for (const t of tags) counts[t] = (counts[t] ?? 0) + 1;
  }
  return counts;
}

export function buildFacetGroups(
  articles: readonly KnowledgeArticle[],
  filters: KnowledgeFilters,
  query: string,
): readonly KnowledgeFacetGroup[] {
  const gradeCounts = computeFacetCounts(articles, filters, query, "grade");
  const processCounts = computeFacetCounts(articles, filters, query, "process");
  const standardCounts = computeFacetCounts(articles, filters, query, "standard");
  const industryCounts = computeFacetCounts(articles, filters, query, "industry");
  const buildOptions = (
    ids: readonly string[],
    labels: Readonly<Record<string, string>>,
    counts: Readonly<Record<string, number>>,
  ): readonly KnowledgeFacetOption[] =>
    ids.map((id) => ({ id, label: labels[id] ?? id, count: counts[id] ?? 0 }));
  return [
    { dimension: "grade", label: DIMENSION_LABELS.grade, options: buildOptions(Object.keys(GRADE_LABELS), GRADE_LABELS as Readonly<Record<string, string>>, gradeCounts) },
    { dimension: "process", label: DIMENSION_LABELS.process, options: buildOptions(Object.keys(PROCESS_LABELS), PROCESS_LABELS as Readonly<Record<string, string>>, processCounts) },
    { dimension: "standard", label: DIMENSION_LABELS.standard, options: buildOptions(Object.keys(STANDARD_LABELS), STANDARD_LABELS as Readonly<Record<string, string>>, standardCounts) },
    { dimension: "industry", label: DIMENSION_LABELS.industry, options: buildOptions(Object.keys(INDUSTRY_LABELS), INDUSTRY_LABELS as Readonly<Record<string, string>>, industryCounts) },
  ];
}