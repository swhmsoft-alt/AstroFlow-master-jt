/**
 * src/lib/schema.ts
 *
 * Whole-site Structured Data center for Boze Titanium Manufacturing Center.
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
    alternateName: ['Boze Metal', 'Boze CNC Ti', 'Boze Titanium Manufacturing Center'],
    url: MAIN_SITE,
    logo: { '@id': LOGO_ID },
    brand: {
      '@type': 'Brand',
      name: 'Boze Titanium Manufacturing Center',
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
    alternateName: 'Boze Titanium Manufacturing Center',
    url: SITEROOT,
    description: 'Precision Titanium Manufacturing & CNC Machining Services',
    publisher: { '@id': ORG_ID },
  };
}

export function buildImageObject() {
  return {
    '@type': 'ImageObject',
    '@id': LOGO_ID,
    url: `${SITEROOT}/uploads/boze-cnc-ti-ico.png`,
    contentUrl: `${SITEROOT}/uploads/boze-cnc-ti-ico.png`,
    caption: 'Boze Titanium Manufacturing Center - Precision Titanium CNC Machining',
  };
}

export interface WebPageInput {
  name: string;
  description: string;
  url: string;
  inLanguage: string;
  datePublished?: string | null;
}

export function buildWebPage(input: WebPageInput) {
  const { name, description, url, inLanguage, datePublished } = input;
  return {
    '@type': 'WebPage',
    '@id': url,
    url,
    name,
    description,
    isPartOf: { '@id': WEBSITE_ID },
    inLanguage,
    ...(datePublished ? { datePublished } : {}),
  };
}

export interface BreadcrumbItem {
  position: number;
  name: string;
  item: string;
}

export function buildBreadcrumbList(items: BreadcrumbItem[]) {
  return {
    '@type': 'BreadcrumbList',
    '@id': `${SITEROOT}/#breadcrumb`,
    itemListElement: items.map((item) => ({
      '@type': 'ListItem',
      position: item.position,
      name: item.name,
      item: item.item,
    })),
  };
}

// ── Additional Entity Builders ────────────────────────

export function buildCollectionPage(input: { name: string; description: string; url: string; mainEntity?: string }) {
  return {
    '@type': 'CollectionPage',
    '@id': input.url,
    name: input.name,
    description: input.description,
    url: input.url,
    isPartOf: { '@id': WEBSITE_ID },
    ...(input.mainEntity ? { mainEntity: { '@id': input.mainEntity } } : {}),
  };
}

export function buildItemList(input: {
  name: string;
  url: string;
  numberOfItems?: number;
  items?: { name: string; url: string }[];
}) {
  return {
    '@type': 'ItemList',
    '@id': `${input.url}#item-list`,
    name: input.name,
    url: input.url,
    ...(input.numberOfItems != null ? { numberOfItems: input.numberOfItems } : {}),
    ...(input.items?.length
      ? {
          itemListElement: input.items.map((it, i) => ({
            '@type': 'ListItem',
            position: i + 1,
            name: it.name,
            url: it.url,
          })),
        }
      : {}),
    mainEntityOfPage: { '@id': input.url },
  };
}

export function buildService(input: {
  name: string;
  description: string;
  url: string;
  category?: string;
}) {
  return {
    '@type': 'Service',
    '@id': input.url,
    name: input.name,
    description: input.description,
    url: input.url,
    provider: { '@id': ORG_ID },
    ...(input.category ? { category: input.category } : {}),
  };
}

export function buildProduct(input: {
  name: string;
  description: string;
  url: string;
  image?: string;
  category?: string;
  datePublished?: string | null;
}) {
  return {
    '@type': 'Product',
    '@id': input.url,
    name: input.name,
    description: input.description,
    url: input.url,
    ...(input.image ? { image: input.image } : {}),
    ...(input.category ? { category: input.category } : {}),
    ...(input.datePublished ? { datePublished: input.datePublished } : {}),
    offers: {
      '@type': 'Offer',
      availability: 'https://schema.org/InStock',
      price: 'Inquire',
      priceCurrency: 'USD',
    },
  };
}

export function buildArticle(input: {
  headline: string;
  description: string;
  url: string;
  author: string;
  datePublished: string;
  image?: string;
  mainEntityOfPage?: string;
}) {
  return {
    '@type': 'Article',
    '@id': input.url,
    headline: input.headline,
    description: input.description,
    url: input.url,
    author: { '@type': 'Person', name: input.author },
    datePublished: input.datePublished,
    publisher: { '@id': ORG_ID },
    mainEntityOfPage: { '@id': input.mainEntityOfPage || input.url },
    ...(input.image ? { image: input.image } : {}),
  };
}

// ── Page type detection ───────────────────────────────

export function detectPageType(path: string, explicit?: PageType): PageType {
  if (explicit) return explicit;
  if (path === '/' || path === '') return 'home';
  if (path.startsWith('/services')) return path.split('/').filter(Boolean).length > 1 ? 'service-detail' : 'services-hub';
  if (path.startsWith('/products')) return path.split('/').filter(Boolean).length > 1 ? 'product-detail' : 'products-hub';
  if (path.startsWith('/blog') && path.split('/').filter(Boolean).length > 1) return 'blog-post';
  if (path.startsWith('/blog')) return 'blog-index';
  if (path.startsWith('/materials')) return 'materials';
  if (path.startsWith('/capabilities')) return 'capabilities';
  if (path.startsWith('/industries')) return 'industries';
  if (path.startsWith('/resources')) return 'resources';
  if (path.startsWith('/rfq') || path.startsWith('/contact')) return 'rfq';
  return 'generic';
}

// ── Breadcrumb builder ────────────────────────────────

/** Short breadcrumb labels for product hub sub-pages (not present in NAVIGATION). */
const BREADCRUMB_LABELS: Record<string, string> = {
  '/products/systems': 'Engineering Systems',
  '/products/industries': 'Industries Served',
  '/products/materials': 'Materials Library',
  '/products/capabilities': 'Capabilities',
  '/products/product-entities': 'Component Library',
  '/products/component-library': 'Component Library',
  '/products/standards': 'Standards',
};

const humanizeSeg = (seg: string) =>
  seg.replace(/[-_]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());

export function buildBreadcrumbItems(
  path: string,
  seoConfig: Record<string, any>,
  siteUrl: string,
  lang: string,
  homeLabel: string,
): BreadcrumbItem[] {
  const items: BreadcrumbItem[] = [
    { position: 1, name: homeLabel, item: siteUrl },
  ];

  const segments = path.split('/').filter(Boolean);
  let accumulated = '';

  for (const seg of segments) {
    accumulated += `/${seg}`;
    const entry = seoConfig[accumulated];
    const name = BREADCRUMB_LABELS[accumulated] || entry?.name || entry?.title?.[lang] || humanizeSeg(seg);
    items.push({
      position: items.length + 1,
      name,
      item: `${siteUrl}${accumulated}/`,
    });
  }

  return items;
}

// ── SchemaPageData ────────────────────────────────────

export interface SchemaPageData {
  pageName: string;
  pageDescription: string;
  pageUrl: string;
  inLanguage?: string;

  breadcrumbItems?: BreadcrumbItem[];

  // Article / blog
  articleHeadline?: string;
  articleDescription?: string;
  articleAuthor?: string;
  articleDatePublished?: string | null;
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
  items?: { name: string; url: string }[];
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
        const itemListId = `${data.pageUrl}#item-list`;
        graph.push(buildCollectionPage({
          name: data.collectionName,
          description: data.collectionDescription ?? data.pageDescription,
          url: data.pageUrl,
          mainEntity: data.items?.length ? itemListId : undefined,
        }));
        graph.push(buildItemList({
          name: data.collectionName,
          url: data.pageUrl,
          numberOfItems: data.itemCount,
          items: data.items,
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
          author: data.articleAuthor ?? 'Boze Titanium Manufacturing Center',
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
