/**
 * IndustryApplicationsJsonLd.tsx
 *
 * Page-level structured-data payload preparation for the Industry
 * Applications Hub (`/resources/industry-applications/`).
 *
 * No `<script>` is rendered here. All schema authority stays in
 * `src/lib/schema.ts` per project SOP. This module:
 *
 *   - Builds the `ItemList` payload for the `items=` BaseLayout prop, so
 *     `buildPageGraph()` emits one ListItem per industry application with
 *     proper @id.
 *   - Derives the articleAbout list (a non-redundant union of every
 *     standard referenced across the 6 cards) for the TechArticle
 *     entity's `about` field.
 *   - Returns a `supplementaryGraph` object describing the page-specific
 *     addition (extending Organization.knowsAbout with industry-specific
 *     compliance keywords not present in the global entity-registry).
 *     The .astro page renders this as the one allowed page-level
 *     supplementary JSON-LD `<script>`.
 */
import type { ApplicationCard } from '../../types/industry-application';

// ────────────────────────────────────────────────────────────────────
// Types
// ────────────────────────────────────────────────────────────────────

export interface IndustryItemListEntry {
  readonly name: string;
  readonly url: string;
  readonly description: string;
  readonly category: string;
}

export interface IndustryBreadcrumbItem {
  readonly position: number;
  readonly name: string;
  readonly item: string;
}

// ────────────────────────────────────────────────────────────────────
// 1. ItemList payload
// ────────────────────────────────────────────────────────────────────

/**
 * One Item per industry application, anchored to the canonical page URL.
 * Each item exposes description + intent category, giving RAG crawlers
 * enough semantic signal to rank the page for industry queries.
 */
export function toSchemaItemList(
  cards: readonly ApplicationCard[],
  pageUrl: string,
  basePath: string,
): ReadonlyArray<IndustryItemListEntry> {
  return cards.map((c) => ({
    name: c.title,
    url: `${pageUrl.replace(/\/resources\/industry-applications\/?$/, '')}${basePath}#${c.id}`,
    description: c.directAnswer,
    category:
      c.intent === 'informational'
        ? 'Industry Selection & Application'
        : c.intent === 'commercial-investigation'
          ? 'Compliance & Capability Verification'
          : 'Industry RFQ / Drawing Submission',
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
): ReadonlyArray<IndustryBreadcrumbItem> {
  return [
    { position: 1, name: homeLabel, item: `${siteUrl}/` },
    { position: 2, name: resourcesLabel, item: `${siteUrl}/resources/` },
    {
      position: 3,
      name: pageLabel,
      item: `${siteUrl}/resources/industry-applications/`,
    },
  ];
}

// ────────────────────────────────────────────────────────────────────
// 3. Aggregate `articleAbout` (non-redundant standards list)
// ────────────────────────────────────────────────────────────────────

/**
 * Build the `articleAbout` array for BaseLayout's `articleAbout` prop.
 * Walks every card's complianceChain + complianceBadges, and adds the
 * industry-specific keywords that the TechArticle @id should reference.
 * Capped at 24 to keep the articleAbout bounded and high-signal.
 */
export function aggregateArticleAbout(
  cards: readonly ApplicationCard[],
): readonly string[] {
  const set = new Set<string>();
  for (const c of cards) {
    for (const s of c.complianceChain) set.add(s.toUpperCase());
    for (const b of c.complianceBadges) set.add(b.badge);
  }
  // Add the 6 vertical industry keywords at the head of the list.
  set.add('Aerospace & Defence Titanium CNC Machining');
  set.add('Medical Implant Titanium CNC Machining');
  set.add('Marine Hydrofoil Titanium CNC Machining');
  set.add('Motorsport Titanium Fastener Manufacturing');
  set.add('Subsea Oil & Gas Titanium Housing Manufacturing');
  set.add('High-End Wearable Titanium Manufacturing');
  return Array.from(set).slice(0, 24);
}

// ────────────────────────────────────────────────────────────────────
// 4. Supplementary `knowsAbout` extension
// ────────────────────────────────────────────────────────────────────

export interface SupplementaryGraph {
  /** The list of `knowsAbout` keywords to add. */
  readonly knowsAbout: readonly string[];
  /** A stable @id for the supplementary list, so it can be referenced. */
  readonly listId: string;
}

/**
 * Builds the page-specific `knowsAbout` extension. Each card contributes
 * 1–3 unique industry-application keywords not already covered by the
 * global Organization schema. Slated for the supplementary `<script>`
 * block in the .astro wrapper per `.clinerules/工作区 Rules.txt`.
 */
export function buildSupplementaryKnowsAbout(
  cards: readonly ApplicationCard[],
): SupplementaryGraph {
  const set = new Set<string>();

  for (const c of cards) {
    // Industry-application verbs (process + outcome) that RAG / Google
    // need to surface this page for capability queries.
    set.add(`${c.materialSpec.standard} ${c.sector} titanium CNC machining`);
    for (const m of c.evidenceMetrics.slice(0, 2)) {
      if (m.standard !== undefined) set.add(m.standard);
    }
  }

  // Always include the 6 hub-level industry-vocabulary entries so the
  // page is surfaced for the broadest commercial-investigation queries.
  set.add('5-Axis CNC Machining of Industry-Specific Titanium Components');
  set.add('Vertical Industry Titanium Compliance Documentation');
  set.add('Titanium Weight Saving vs 316L Stainless / 4140 Steel');
  set.add('ASTM F136 / ISO 5832-3 Implant-Grade Titanium Manufacturing');
  set.add('NACE SP0198 / MR0175 Subsea Titanium Corrosion Resistance');
  set.add('AMS 4928 Aerospace Titanium Structural Bracket Manufacturing');
  set.add('AS9100D / ISO 13485 Dual-Certified Titanium Manufacturing');

  return {
    knowsAbout: Array.from(set),
    listId: 'https://cnc.bozemetal.com/resources/industry-applications/#knows-about',
  };
}

// ────────────────────────────────────────────────────────────────────
// 5. Supplementary @graph object — DefinedTermSet of industry terms
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
        name: 'Boze Metal Industry Application Vocabulary (knowsAbout)',
        description:
          'Real-world industry-specific titanium CNC machining applications documented on the Boze Titanium Industry Applications Hub.',
        hasDefinedTerm: supp.knowsAbout.map((term, idx) => ({
          '@type': 'DefinedTerm',
          '@id': `${supp.listId}#term-${idx + 1}`,
          name: term,
        })),
      },
    ],
  };
}

