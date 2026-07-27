/**
 * src/lib/schema.ts
 *
 * Whole-site Structured Data center for BOZE CNC Ti.
 * Single file — no builder framework, no registry, no separate types.
 *
 * Responsibilities:
 *  - Build individual Schema.org entities (Organization, WebSite, WebPage, etc.)
 *  - Compose them into a single @graph per page
 *  - Auto-detect page type from SEO_CONFIG + URL pattern
 *  - Establish consistent @id references across all entities
 *
 * Principles:
 *  - Only Schema.org official types & properties
 *  - Only entities supported by actual page content
 *  - No fabricated values (no fake offers, reviews, ratings, prices)
 *  - Every entity with an @id is referenceable across the site
 */

import { SITE } from '@config/site';

// ── Constants ─────────────────────────────────────────

const MAIN_SITE = 'https://www.bozemetal.com';
const SITEROOT = SITE.url;
const ORG_ID     = `${MAIN_SITE}/#organization`;
const WEBSITE_ID = `${SITEROOT}/#website`;
const LOGO_ID    = `${SITEROOT}/#boze-logo`;

// ── Page Type ─────────────────────────────────────────

export type PageType =
  | 'home'
  | 'services-hub'
  | 'service-detail'
  | 'products-hub'
  | 'product-detail'
  | 'blog-index'
  | 'blog-post'
  | 'materials'
  | 'capabilities'
  | 'industries'
  | 'resources'
  | 'rfq'
  | 'generic';

// ── Helpers ───────────────────────────────────────────

/** Recursively remove null / undefined / empty-string / empty-object values. */
function clean(obj: Record<string, unknown>): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(obj)) {
    if (v == null) continue;
    if (Array.isArray(v)) {
      const filtered = v.filter(x => x != null);
      if (filtered.length) out[k] = filtered;
    } else if (typeof v === 'object' && !('@id' in (v as object))) {
      const child = clean(v as Record<string, unknown>);
      if (Object.keys(child).length) out[k] = child;
    } else {
      out[k] = v;
    }
  }
  return out;
}

// ── Entity Builders ───────────────────────────────────

export function buildOrganization() {
  return {
    '@type': 'Organization',
    '@id': ORG_ID,
    name: 'Baoji Boze Metal Products Co., Ltd.',
    legalName: 'Baoji Boze Metal Products Co., Ltd.',
    alternateName: ['Boze Metal', 'Boze CNC Ti'],
    url: MAIN_SITE,
    logo: { '@id': LOGO_ID },
    brand: {
      '@type': 'Brand',
      name: 'Boze CNC Ti',
    },
    sameAs: [
      'https://www.linkedin.com/in/baoji-boze-metal-products-co-ltd-25a0923aa',
      'https://www.facebook.com/titaniummachinedparts/',
      'https://www.instagram.com/boze.metal.products.company/',
      'https://www.youtube.com/@boze-666',
    ],
  };
}

export function buildWebSite() {
  return {
    '@type': 'WebSite',
    '@id': WEBSITE_ID,
    name: 'Boze Titanium Manufacturing Center',
    url: SITEROOT,
    description: SITE.description,
    publisher: { '@id': ORG_ID },
  };
}

export function buildImageObject() {
  return {
    '@type': 'ImageObject',
    '@id': LOGO_ID,
    url: `${SITEROOT}/uploads/boze-cnc-ti-ico.png`,
    contentUrl: `${SITEROOT}/uploads/boze-cnc-ti-ico.png`,
    caption: 'Boze CNC Ti - Boze Titanium Manufacturing Center',
  };
}

export interface WebPageInput {
  name: string;
  description: string;
  url: string;
  inLanguage?: string;
  datePublished?: string | null;
}

export function buildWebPage(input: WebPageInput) {
  const entity: Record<string, unknown> = {
    '@type': 'WebPage',
    '@id': input.url,
    url: input.url,
    name: input.name,
    description: input.description,
    isPartOf: { '@id': WEBSITE_ID },
  };
  if (input.inLanguage) entity.inLanguage = input.inLanguage;
  if (input.datePublished) entity.datePublished = input.datePublished;
  return entity;
}

export interface BreadcrumbItem {
  name: string;
  item: string;
}

export function buildBreadcrumbList(items: BreadcrumbItem[]) {
  const lastUrl = items[items.length - 1]?.item ?? SITEROOT;
  return {
    '@type': 'BreadcrumbList',
    '@id': `${lastUrl}#breadcrumb`,
    itemListElement: items.map((entry, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: entry.name,
      item: entry.item,
    })),
  };
}

export interface ArticleInput {
  headline: string;
  description: string;
  url: string;
  author: string;
  datePublished: string;
  image?: string;
  mainEntityOfPage: string;
}

export function buildArticle(input: ArticleInput) {
  const entity: Record<string, unknown> = {
    '@type': 'Article',
    '@id': `${input.url}#article`,
    headline: input.headline,
    description: input.description,
    url: input.url,
    author: { '@type': 'Person', name: input.author },
    publisher: { '@id': ORG_ID },
    mainEntityOfPage: { '@id': input.mainEntityOfPage },
    datePublished: input.datePublished,
  };
  if (input.image) entity.image = input.image;
  return entity;
}

export interface ServiceInput {
  name: string;
  description: string;
  url: string;
  category?: string;
}

export function buildService(input: ServiceInput) {
  return {
    '@type': 'Service',
    '@id': `${input.url}#service`,
    name: input.name,
    description: input.description,
    url: input.url,
    provider: { '@id': ORG_ID },
    category: input.category,
  };
}

export interface ProductInput {
  name: string;
  description: string;
  url: string;
  image?: string;
  category?: string;
  datePublished?: string | null;
}

export function buildProduct(input: ProductInput) {
  const entity: Record<string, unknown> = {
    '@type': 'Product',
    '@id': `${input.url}#product`,
    name: input.name,
    description: input.description,
    url: input.url,
    manufacturer: { '@id': ORG_ID },
  };
  if (input.image) entity.image = input.image;
  if (input.category) entity.category = input.category;
  if (input.datePublished) entity.datePublished = input.datePublished;
  return entity;
}

export interface CollectionInput {
  name: string;
  description: string;
  url: string;
}

export function buildCollectionPage(input: CollectionInput) {
  return {
    '@type': 'CollectionPage',
    '@id': `${input.url}#collection`,
    name: input.name,
    description: input.description,
    url: input.url,
    isPartOf: { '@id': WEBSITE_ID },
  };
}

export interface ItemListInput {
  name: string;
  url: string;
  numberOfItems?: number;
}

export function buildItemList(input: ItemListInput) {
  const entity: Record<string, unknown> = {
    '@type': 'ItemList',
    '@id': `${input.url}#itemlist`,
    name: input.name,
    url: input.url,
  };
  if (input.numberOfItems != null) entity.numberOfItems = input.numberOfItems;
  return entity;
}

// ── Page-type lookup ──────────────────────────────────

/**
 * Static map: canonical paths whose page type is known at build time.
 * Dynamic routes (blog/[...slug], products/[...slug]) rely on an explicit prop.
 */
const DIRECT_TYPE: Record<string, PageType> = {
  '/':                          'home',
  '/services':                  'services-hub',
  '/materials':                 'materials',
  '/capabilities':              'capabilities',
  '/industries':                'industries',
  '/resources':                 'resources',
  '/products':                  'products-hub',
  '/blog':                      'blog-index',
  '/rfq':                       'rfq',
  '/documentation':             'generic',
  '/use-cases':                 'generic',
  '/facilities':                'generic',
  '/theme-demo':                'generic',
};

/** Service-category hub paths (overview of sub-services). */
const SERVICE_HUBS = new Set([
  '/titanium-cnc-machining-services',
  '/titanium-additive-manufacturing',
  '/titanium-fabrication-services',
  '/titanium-forming-heavy-manufacturing',
  '/titanium-surface-treatment',
]);

/** Service-detail pages live under a hub path + '/'. */
const SERVICE_DETAIL_PREFIXES = [...SERVICE_HUBS].map(p => p + '/');

/** Standalone service-deep pages that aren't under a hub prefix. */
const STANDALONE_SERVICES = new Set([
  '/branded-custom-packaging-services',
  '/laser-marking-custom-logo',
]);

export function detectPageType(
  canonicalPath: string,
  explicit?: PageType,
): PageType {
  if (explicit) return explicit;

  const direct = DIRECT_TYPE[canonicalPath];
  if (direct) return direct;

  if (SERVICE_HUBS.has(canonicalPath)) return 'services-hub';
  if (STANDALONE_SERVICES.has(canonicalPath)) return 'service-detail';
  if (SERVICE_DETAIL_PREFIXES.some(p => canonicalPath.startsWith(p))) return 'service-detail';

  return 'generic';
}

// ── Breadcrumb generator ──────────────────────────────

/**
 * Build breadcrumb items for a canonical path.
 * Uses SEO_CONFIG titles when available; falls back to humanising the slug segment.
 *
 * @param canonicalPath  e.g. "/titanium-cnc-machining-services/cnc-milling-turning"
 * @param seoConfig      SEO_CONFIG lookup (imported at call site)
 * @param siteUrl        base URL
 * @param currentLang    language code (for picking the right title)
 * @returns              array of { name, item }
 */
export function buildBreadcrumbItems(
  canonicalPath: string,
  seoConfig: Record<string, { title?: Record<string, string> }>,
  siteUrl: string,
  currentLang: string,
): BreadcrumbItem[] {
  const items: BreadcrumbItem[] = [
    { name: 'Home', item: siteUrl },
  ];

  if (canonicalPath === '/') return items;

  // Split into segments: ['services'] or ['titanium-cnc-machining-services', 'cnc-milling-turning']
  const segments = canonicalPath.split('/').filter(Boolean);
  let accumulated = '';

  for (const seg of segments) {
    accumulated += '/' + seg;
    const entry = seoConfig[accumulated];
    // Prefer SEO_CONFIG title for this language; fall back to humanised segment
    const label = entry?.title?.[currentLang] ?? humaniseSlug(seg);
    items.push({
      name: label,
      item: `${siteUrl}${accumulated}`,
    });
  }

  return items;
}

/** Convert kebab-case slug to readable text: "cnc-milling-turning" → "CNC Milling Turning" */
function humaniseSlug(slug: string): string {
  return slug
    .split('-')
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

// ── Graph Composition ─────────────────────────────────

export interface SchemaPageData {
  // Page basics (always available)
  pageName: string;
  pageDescription: string;
  pageUrl: string;
  inLanguage?: string;

  // Breadcrumb (auto-generated in BaseLayout — can be overridden)
  breadcrumbItems?: BreadcrumbItem[];

  // Article (blog posts)
  articleHeadline?: string;
  articleDescription?: string;
  articleAuthor?: string;
  articleDatePublished?: string;
  articleImage?: string;

  // Service
  serviceName?: string;
  serviceDescription?: string;
  serviceCategory?: string;

  // Product
  productName?: string;
  productDescription?: string;
  productImage?: string;
  productCategory?: string;
  productDatePublished?: string | null;

  // Collection / listing
  collectionName?: string;
  collectionDescription?: string;
  itemCount?: number;
}

/**
 * Build the full @graph for a page.
 *
 * Every page always gets:
 *   Organization  (@id: #boze-org)
 *   WebSite       (publisher → #boze-org)
 *   WebPage       (isPartOf → #boze-website)
 *   BreadcrumbList (if items provided)
 *
 * Additional entities are added based on pageType.
 */
export function buildPageGraph(pageType: PageType, data: SchemaPageData) {
  const graph: Record<string, unknown>[] = [];

  // 1. Organization & WebSite — every page
  graph.push(buildOrganization());
  graph.push(buildImageObject());
  graph.push(buildWebSite());

  // 2. WebPage — every page
  graph.push(buildWebPage({
    name: data.pageName,
    description: data.pageDescription,
    url: data.pageUrl,
    inLanguage: data.inLanguage,
    datePublished: data.articleDatePublished ?? null,
  }));

  // 3. Breadcrumb
  if (data.breadcrumbItems?.length) {
    graph.push(buildBreadcrumbList(data.breadcrumbItems));
  }

  // 4. Type-specific entities
  switch (pageType) {
    case 'services-hub':
    case 'products-hub':
    case 'blog-index':
      if (data.collectionName) {
        graph.push(buildCollectionPage({
          name: data.collectionName,
          description: data.collectionDescription ?? data.pageDescription,
          url: data.pageUrl,
        }));
        graph.push(buildItemList({
          name: data.collectionName,
          url: data.pageUrl,
          numberOfItems: data.itemCount,
        }));
      }
      break;

    case 'service-detail':
      if (data.serviceName) {
        graph.push(buildService({
          name: data.serviceName,
          description: data.serviceDescription ?? data.pageDescription,
          url: data.pageUrl,
          category: data.serviceCategory,
        }));
      }
      break;

    case 'product-detail':
      if (data.productName) {
        graph.push(buildProduct({
          name: data.productName,
          description: data.productDescription ?? data.pageDescription,
          url: data.pageUrl,
          image: data.productImage,
          category: data.productCategory,
          datePublished: data.productDatePublished,
        }));
      }
      break;

    case 'blog-post':
      if (data.articleHeadline) {
        graph.push(buildArticle({
          headline: data.articleHeadline,
          description: data.articleDescription ?? data.pageDescription,
          url: data.pageUrl,
          author: data.articleAuthor ?? 'BOZE CNC Ti',
          datePublished: data.articleDatePublished ?? new Date().toISOString(),
          image: data.articleImage,
          mainEntityOfPage: data.pageUrl,
        }));
      }
      break;

    default:
      // 'home', 'materials', 'capabilities', 'industries', 'resources', 'rfq', 'generic'
      // already have Org + WebSite + WebPage + Breadcrumb
      break;
  }

  return clean({ '@context': 'https://schema.org', '@graph': graph });
}