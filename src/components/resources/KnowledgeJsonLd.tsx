/**
 * KnowledgeJsonLd.tsx
 *
 * Page-level structured-data payload preparation for the Knowledge Base.
 * The actual <script> tag is emitted by `BaseLayout` (which routes the
 * TechArticle entity to `buildPageGraph()` → `buildTechArticle()`).
 *
 * This module is the data-transformation layer:
 *   - Builds the `ItemList` payload for the "list of articles" entity.
 *   - Derives the `BreadcrumbList` items for the page-level graph.
 *   - Exposes typed accessors so the .astro page can feed BaseLayout
 *     props without inline JSON-LD.
 *
 * No `<script>` is rendered here. All schema authority stays in
 * `src/lib/schema.ts` per project SOP.
 */
import type {
  KnowledgeArticle,
} from './knowledge-data';
import { STANDARD_LABELS } from './knowledge-data';

export interface KnowledgeItemListEntry {
  readonly name: string;
  readonly url: string;
  readonly description: string;
  readonly datePublished: string;
  readonly dateModified: string;
  readonly primaryStandard: string;
}

export interface KnowledgeBreadcrumbItem {
  readonly position: number;
  readonly name: string;
  readonly item: string;
}

/** Build the `ItemList` payload — one Item per article. */
export function toSchemaItemList(
  articles: readonly KnowledgeArticle[],
  pageUrl: string,
): ReadonlyArray<KnowledgeItemListEntry> {
  return articles.map((a) => ({
    name: a.title,
    url: `${pageUrl.replace(/\/resources\/titanium-knowledge-base\/?$/, '/blog')}${a.slug}/`,
    description: a.summary,
    datePublished: a.publishedAt,
    dateModified: a.updatedAt,
    primaryStandard: a.primaryStandard ? STANDARD_LABELS[a.primaryStandard] : 'Titanium engineering reference',
  }));
}

/** Build the page-level `BreadcrumbList` items. */
export function toSchemaBreadcrumb(
  siteUrl: string,
  homeLabel: string,
  resourcesLabel: string,
  pageLabel: string,
): readonly KnowledgeBreadcrumbItem[] {
  return [
    { position: 1, name: homeLabel, item: `${siteUrl}/` },
    { position: 2, name: resourcesLabel, item: `${siteUrl}/resources/` },
    { position: 3, name: pageLabel, item: `${siteUrl}/resources/titanium-knowledge-base/` },
  ];
}
