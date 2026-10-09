/**
 * DesignEngineeringJsonLd.tsx
 *
 * Page-level structured-data payload preparation for the Design
 * Engineering Hub. Mirrors `KnowledgeJsonLd.tsx`:
 *
 *   - Builds the `ItemList` payload (one ListItem per DFM rule).
 *   - Builds the `HowTo` payload (one HowToStep per DFM rule's
 *     counter-measure strategies).
 *   - Builds the `BreadcrumbList` items for the page-level graph.
 *   - Exposes typed accessors so the .astro page can feed BaseLayout
 *     props (`faqItems`, `items`, `articleAbout`) without inline JSON-LD.
 *
 * No `<script>` is rendered here. All schema authority stays in
 * `src/lib/schema.ts` per project SOP. BaseLayout consumes the typed
 * payloads via its `pageType="tech-article"` slot → `buildPageGraph()`.
 */
import type { DFMRule } from './design-engineering-data';
import {
  FEATURE_CATEGORY_LABELS,
  MACHINING_PROCESS_LABELS,
  TITANIUM_GRADE_LABELS,
  OPTIMIZATION_GOAL_LABELS,
} from './design-engineering-data';

export interface DesignEngineeringItemListEntry {
  readonly name: string;
  readonly url: string;
  readonly description: string;
  readonly dateModified: string;
  readonly primaryStandard: string;
}

export interface DesignEngineeringBreadcrumbItem {
  readonly position: number;
  readonly name: string;
  readonly item: string;
}

export interface DesignEngineeringHowToStep {
  readonly name: string;
  readonly text: string;
  readonly url: string;
}

export interface DesignEngineeringFaqItem {
  readonly question: string;
  readonly answer: string;
}

/** Build the `ItemList` payload — one ListItem per DFM rule. */
export function toSchemaItemList(
  rules: readonly DFMRule[],
  pageUrl: string,
): ReadonlyArray<DesignEngineeringItemListEntry> {
  return rules.map((r) => ({
    name: r.title,
    url: `${pageUrl}#rule-${r.id}`,
    description: r.directAnswer,
    dateModified: r.lastReviewed,
    primaryStandard: r.evidenceStandards[0]?.spec ?? 'ASME Y14.5-2018',
  }));
}

/** Build the `HowTo` step payload — one step per rule's top counter-measure. */
export function toSchemaHowToSteps(
  rules: readonly DFMRule[],
  pageUrl: string,
): ReadonlyArray<DesignEngineeringHowToStep> {
  return rules.map((r) => ({
    name: r.title,
    text: r.countermeasure.summary + ' ' + r.countermeasure.strategies.join(' / '),
    url: `${pageUrl}#rule-${r.id}`,
  }));
}

/** Build the page-level `BreadcrumbList` items. */
export function toSchemaBreadcrumb(
  siteUrl: string,
  homeLabel: string,
  resourcesLabel: string,
  pageLabel: string,
): readonly DesignEngineeringBreadcrumbItem[] {
  return [
    { position: 1, name: homeLabel, item: `${siteUrl}/` },
    { position: 2, name: resourcesLabel, item: `${siteUrl}/resources/` },
    { position: 3, name: pageLabel, item: `${siteUrl}/resources/design-engineering-guide/` },
  ];
}

/**
 * NOTE: BaseLayout does NOT accept a `breadcrumb` prop — `BreadcrumbList` JSON-LD
 * is auto-emitted by `buildPageGraph()` via `buildBreadcrumbItems(path, seoConfig)`.
 * This `toSchemaBreadcrumb` is kept for explicit JSON-LD or for callers that
 * want the list as a typed array (e.g. for manual breadcrumb rendering).
 */

/** Build the FAQPage `mainEntity` items. */
export function toSchemaFaqItems(
  faqItems: readonly DesignEngineeringFaqItem[],
): ReadonlyArray<{ question: string; answer: string }> {
  return faqItems.map((f) => ({ question: f.question, answer: f.answer }));
}

/**
 * Build a flat `keywords` list for the page-level `articleAbout` prop
 * (consumed by `BaseLayout` → `buildPageGraph()` → `TechArticle.about`).
 * Combines: rule titles, evidence standards, grade labels, process labels.
 */
export function toSchemaArticleAbout(
  rules: readonly DFMRule[],
): string {
  const set = new Set<string>();
  // 6 DFM rule titles
  for (const r of rules) {
    set.add(r.title);
    for (const s of r.evidenceStandards) set.add(s.spec);
  }
  // 8 grades
  for (const v of Object.values(TITANIUM_GRADE_LABELS)) set.add(v);
  // 8 processes
  for (const v of Object.values(MACHINING_PROCESS_LABELS)) set.add(v);
  // 8 features
  for (const v of Object.values(FEATURE_CATEGORY_LABELS)) set.add(v);
  // 6 goals
  for (const v of Object.values(OPTIMIZATION_GOAL_LABELS)) set.add(v);
  return Array.from(set).join(', ');
}
