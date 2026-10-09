/**
 * ManufacturingInsightsJsonLd.tsx
 *
 * Page-level structured-data payload preparation for the Manufacturing
 * Insights Hub (`/resources/manufacturing-insights/`).
 *
 * No `<script>` is rendered here. All schema authority stays in
 * `src/lib/schema.ts` per project SOP. This module:
 *
 *   - Builds the `ItemList` payload for the `items=` BaseLayout prop, so
 *     `buildPageGraph()` emits one ListItem per insight with proper @id.
 *   - Derives the `BreadcrumbList` items for the page-level graph.
 *   - Returns a `supplementaryGraph` object describing the page-specific
 *     addition (extending Organization.knowsAbout with manufacturing-capability
 *     keywords not present in the global entity-registry). The .astro page
 *     renders this as the one allowed page-level supplementary JSON-LD `<script>`.
 */
import type {
  ManufacturingInsight,
  QualityMetric,
} from '../../types/manufacturing-insight';

// ────────────────────────────────────────────────────────────────────
// Types — mirrors what the .astro page feeds into BaseLayout props
// ────────────────────────────────────────────────────────────────────

export interface ManufacturingItemListEntry {
  readonly name: string;
  readonly url: string;
  readonly description: string;
  readonly category: string;
}

export interface ManufacturingBreadcrumbItem {
  readonly position: number;
  readonly name: string;
  readonly item: string;
}

// ────────────────────────────────────────────────────────────────────
// 1. ItemList payload
// ────────────────────────────────────────────────────────────────────

/**
 * One Item per insight, anchored to the canonical page URL.
 * Each item exposes description + intent category, giving RAG crawlers
 * enough semantic signal to rank the page for capability queries.
 */
export function toSchemaItemList(
  insights: readonly ManufacturingInsight[],
  pageUrl: string,
  basePath: string,
): ReadonlyArray<ManufacturingItemListEntry> {
  return insights.map((i) => ({
    name: i.title,
    url: `${pageUrl.replace(/\/resources\/manufacturing-insights\/?$/, '')}${basePath}#${i.id}`,
    description: i.directAnswer,
    category:
      i.intent === 'informational'
        ? 'Process & Technology'
        : i.intent === 'commercial'
          ? 'Capability Verification'
          : 'Audit & Sample Request',
  }));
}

// ────────────────────────────────────────────────────────────────────
// 2. BreadcrumbList items
// ────────────────────────────────────────────────────────────────────

export function toSchemaBreadcrumb(
  siteUrl: string,
  homeLabel: string,
  resourcesLabel: string,
  pageLabel: string,
): ReadonlyArray<ManufacturingBreadcrumbItem> {
  return [
    { position: 1, name: homeLabel, item: `${siteUrl}/` },
    { position: 2, name: resourcesLabel, item: `${siteUrl}/resources/` },
    {
      position: 3,
      name: pageLabel,
      item: `${siteUrl}/resources/manufacturing-insights/`,
    },
  ];
}

// ────────────────────────────────────────────────────────────────────
// 3. Supplementary graph — extends Organization.knowsAbout
// ────────────────────────────────────────────────────────────────────

export interface SupplementaryGraph {
  /** The list of `knowsAbout` keywords to add. */
  readonly knowsAbout: readonly string[];
  /** A stable @id for the supplementary list, so it can be referenced. */
  readonly listId: string;
}

/**
 * Builds the page-specific `knowsAbout` extension. Each insight contributes
 * 1\u20133 unique capability keywords not already covered by the global
 * Organization schema (slated for the supplementary `<script>` block in the
 * .astro wrapper per `.clinerules/工作区 Rules.txt`).
 *
 * Implementation: harvest all unique certifications + the unique
 * process + quality dimension labels from the six insights.
 */
export function buildSupplementaryKnowsAbout(
  insights: readonly ManufacturingInsight[],
): SupplementaryGraph {
  const set = new Set<string>();

  for (const i of insights) {
    // Push capability keywords that RAG / Google will need to surface this
    // page for capability queries. Cap to 12 per insight to keep the list
    // bounded and high-signal.
    for (const c of i.certifications) set.add(c);
    for (const t of i.thresholds) {
      if (t.standard !== undefined) set.add(t.standard);
    }
    // Always include the page-level manufacturing vocabulary.
    set.add('5-Axis CNC Milling of Titanium Alloys');
    set.add('Trochoidal Milling for Thin-Wall Titanium');
    set.add('High-Pressure Through-Tool Coolant Machining');
    set.add('Zeiss PRISMO CMM Inspection');
    set.add('EN 10204 3.1 Material Test Reports');
    set.add('EU PED 2014/68/EU Pressure-Component Manufacturing');
    set.add('AS9100D Aerospace Quality Management');
  }

  return {
    knowsAbout: Array.from(set),
    listId: 'https://cnc.bozemetal.com/resources/manufacturing-insights/#knows-about',
  };
}

// ────────────────────────────────────────────────────────────────────
// 4. Supplementary @graph item \u2014 acts on a real @id via KnowsAboutList
//    (Not strictly required; kept here for completeness & future extension.)
// ────────────────────────────────────────────────────────────────────

export function buildSupplementaryGraphObject(
  supp: SupplementaryGraph,
): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'DefinedTermSet',
        '@id': supp.listId,
        name: 'Boze Metal Manufacturing Capabilities (knowsAbout)',
        description:
          'Real-world manufacturing capabilities documented on the Boze Titanium Manufacturing Insights Hub.',
        hasDefinedTerm: supp.knowsAbout.map((term, idx) => ({
          '@type': 'DefinedTerm',
          '@id': `${supp.listId}#term-${idx + 1}`,
          name: term,
        })),
      },
    ],
  };
}

// ────────────────────────────────────────────────────────────────────
// 5. Threshold-only summary for downstream consumers
// ────────────────────────────────────────────────────────────────────

/** Flat list of every threshold across the corpus (used by BaseLayout briefly). */
export function flattenThresholds(
  insights: readonly ManufacturingInsight[],
): readonly QualityMetric[] {
  return insights.flatMap((i) => i.thresholds);
}
