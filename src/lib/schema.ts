/**
 * src/lib/schema.ts
 *
 * Whole-site Structured Data center for Boze Titanium Manufacturing Center.
 * Single file -no builder framework, no registry, no separate types.
 *
 * Architecture: JSON-LD Graph with @id-pointer reference model.
 *  - Global entities (Organization, Brand, ManufacturingCenter, WebSite, ImageObject)
 *    are emitted once per page and carry stable @id values.
 *  - Page-level entities (Product, Service, Article, etc.) reference the global
 *    entities by @id, NEVER by inline re-declaration of `name`/`url`/`address`.
 *  - This deduplicates entity nodes across the site graph and lets Google
 *    cleanly resolve the canonical Legal Org, Brands, and Manufacturing Center.
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
 *  - No fabricated values: no fake reviews / ratings / prices. An `Offer` is
 *    emitted ONLY when a real numeric retail price exists. Boze is a B2B
 *    make-to-order machining business with no published list price, so
 *    product-detail / standard-part-detail / part-detail Products carry no
 *    `offers` node at all.
 *
 *    Why (GSC Merchant Listings, 2026-10-21): Google treats any
 *    `Product.offers` node as a retail Merchant Listing and enforces the B2C
 *    field set - ERROR on missing `price`/`priceSpecification`, plus WARNINGs
 *    on `availability` enum, `hasMerchantReturnPolicy` and `shippingDetails`.
 *    Those fields have no meaning for custom-machined B2B parts (no shelf
 *    price, no consumer returns window, no parcel shipping policy). Emitting a
 *    price-less RFQ Offer produced exactly those 4 GSC findings across every
 *    locale mirror, so the Offer block was dropped rather than populated with
 *    invented values. The RFQ relationship remains fully modelled through
 *    `Organization.makesOffer` (itemOffered: Service) and the site-wide
 *    `OfferCatalog` (`OFFER_CATALOG_ID`).
 *  - Every entity with an @id is referenceable across the site
 */

import { SITE } from '@config/site';
import { refsFromIds } from './entity-graph';

// 鈹€鈹€ schema-dts type imports (Phase 1, 2026-10-14) 鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€
//
// `schema-dts` is Google's official TypeScript type declarations for the
// Schema.org vocabulary. We use it purely as a *type-only* dependency: the
// builders below return objects whose structural shape is enforced at
// compile-time by the Schema.org types. This catches:
//   - field name typos (e.g. `knowsabout` vs `knowsAbout`)
//   - field-type mismatches (e.g. `number` vs `string`)
//   - deprecated / non-existent properties
//
// `schema-dts` does NOT validate JSON-LD values at runtime -it only checks
// TypeScript types at build time. The schema-org-validator / manual
// review of dist JSON-LD is still the runtime safety net.
//
// We import only the subset of Schema.org types actually emitted by the
// builders in this file. Adding a new builder that emits a new entity
// type should add a corresponding `import type` here.
import type {
  Organization,
  Brand,
  Certification,
  WebSite,
  ImageObject,
  WebPage,
  BreadcrumbList,
  CollectionPage,
  ItemList,
  Service,
  Product,
  Offer,
  OfferCatalog,
  Article,
  TechArticle,
  FAQPage,
  Question,
  HowTo,
  HowToStep,
  Speakable,
  PostalAddress,
  Country,
  PropertyValue,
  Person,
  Graph,
} from 'schema-dts';

// 鈹€鈹€ Constants 鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€
//
// Entity Identity (Single Source of Truth) -EXPORTED so page-level
// supplementary JSON-LD blocks can reference these by @id without ever
// re-declaring the underlying entity fields.
//
//   Legal Entity      鈫?https://www.bozemetal.com/#organization        (Baoji Boze Metal Products Co., Ltd.)
//   Corporate Brand   鈫?https://www.bozemetal.com/#brand-boze-metal    (BOZE Metal)
//   Commercial Brand  鈫?https://www.bozemetal.com/#brand-boze-cnc-ti   (BOZE CNC Ti)
//   Manufacturing Ctr 鈫?https://cnc.bozemetal.com/#manufacturing-center (Boze Titanium Manufacturing Center)
//   WebSite           鈫?https://cnc.bozemetal.com/#website            (Boze Titanium Manufacturing Center)
//
// 鈹€鈹€ FROZEN ENTITY-ARCHITECTURE RED LINES (2026-09-12) 鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€
// These rules protect an intentional brand-separation design: the
// commercial brand `BOZE CNC Ti` lives under the bozemetal.com namespace
// (alongside the Legal Entity and Corporate Brand `BOZE Metal`); the
// manufacturing center + website live under cnc.bozemetal.com and use the
// neutral name `Boze Titanium Manufacturing Center` so the cnc subdomain
// is not misidentified with the BOZE CNC Ti brand.
//
//  1. cnc.bozemetal.com/#organization MUST NOT exist (no second legal entity).
//  2. WebSite name MUST stay "Boze Titanium Manufacturing Center".
//     DO NOT rename it back to "BOZE CNC Ti Website", "BOZE CNC Ti", or any
//     form that re-merges the cnc subdomain with the commercial brand.
//  3. Organization.alternateName MUST NOT include "BOZE CNC Ti".
//     Brand-level aliases belong on the Brand @ids, not on the Legal Entity.
//  4. DO NOT create a second Organization under cnc.bozemetal.com that
//     claims legalEntity status. The ManufacturingCenter entity is `@type:
//     Organization` purely to use the `parentOrganization` property; it is
//     the physical plant, NOT a second legal entity.
//  5. Namespace split is intentional:
//       bozemetal.com       鈫?#organization (Legal), #brand-* (2 Brands)
//       cnc.bozemetal.com   鈫?#manufacturing-center (Plant), #website, #boze-logo
//     Connections between namespaces MUST go through @id pointers
//     (parentOrganization / publisher / brand), NOT through shared @type.
// 鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€

const MAIN_SITE = 'https://www.bozemetal.com';
const SITEROOT = SITE.url;
export const ORG_ID     = `${MAIN_SITE}/#organization`;
export const BRAND_BOZE_METAL_ID = `${MAIN_SITE}/#brand-boze-metal`;
export const BRAND_BOZE_CNC_TI_ID = `${MAIN_SITE}/#brand-boze-cnc-ti`;
export const WEBSITE_ID = `${SITEROOT}/#website`;
export const LOGO_ID    = `${SITEROOT}/#boze-logo`;
export const MANUFACTURING_CENTER_ID = `${SITEROOT}/#manufacturing-center`;
// Certification @ids live under the Legal Org namespace (bozemetal.com) since
// the certificate is issued to the corporate entity Baoji Boze Metal
// Products Co., Ltd. (not the manufacturing-center plant).
export const CERT_AS9100_ID = `${MAIN_SITE}/#certification-as9100`;

// 鈹€鈹€ B2B Export Markets & Offer Catalog (2026-10-15) 鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€
//
// Entity strategy for the export-only B2B funnel (cnc.bozemetal.com):
//  - The Legal Org declares its nine served markets as schema.org Country
//    nodes (stable @ids under the SITEROOT namespace). Entity-graph
//    builders and LLM crawlers resolve typed Country nodes far better than
//    the opaque Text "Worldwide".
//  - The Org publishes an OfferCatalog enumerating the nine OEM/ODM +
//    wholesale service lines, so a single page crawl exposes the full
//    export catalog without visiting every hub.
//  - Deliberately NOT LocalBusiness: Boze is a Baoji-based manufacturer
//    with no walk-in retail premise in any target market. The Legal Org is
//    modeled as the schema.org Corporation subtype (incorporated for-profit
//    legal entity).

/** Nine declared export markets (ISO 3166-1 alpha-2 code + display name). */
const B2B_EXPORT_MARKETS: { code: string; name: string }[] = [
  { code: 'US', name: 'United States' },
  { code: 'CA', name: 'Canada' },
  { code: 'GB', name: 'United Kingdom' },
  { code: 'DE', name: 'Germany' },
  { code: 'FR', name: 'France' },
  { code: 'IT', name: 'Italy' },
  { code: 'NL', name: 'Netherlands' },
  { code: 'JP', name: 'Japan' },
  { code: 'AU', name: 'Australia' },
];

/** Stable per-country @id under the SITEROOT namespace. */
const countryId = (code: string) => `${SITEROOT}/#country-${code.toLowerCase()}`;

/**
 * Shared areaServed @id-reference array -single source of truth used by
 * Organization.areaServed, Organization.makesOffer[0].itemOffered.areaServed,
 * and every OfferCatalog itemOffered Service. The Country nodes themselves
 * are emitted once per page graph by buildMarketCountries().
 */
const B2B_MARKET_AREA_SERVED: { '@id': string }[] = B2B_EXPORT_MARKETS.map((m) => ({
  '@id': countryId(m.code),
}));

/**
 * ISO 3166-1 alpha-2 code array, used as the default `serviceAreaServed`
 * for every service-related page (service-detail / services-hub /
 * industry-detail). This is the simplified string-array form that flows
 * into Service.areaServed when the page does not pass its own override.
 * Mirrors B2B_EXPORT_MARKETS; the two lists must stay in sync.
 */
export const B2B_MARKET_ISO_CODES: string[] = B2B_EXPORT_MARKETS.map((m) => m.code);

/** Stable @id of the site-wide B2B export OfferCatalog. */
export const OFFER_CATALOG_ID = `${SITEROOT}/#offer-catalog`;

// 鈹€鈹€ Page Type 鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€

export type PageType =
  | 'home'
  | 'services-hub'
  | 'service-detail'
  | 'products-hub'
  | 'product-detail'
  | 'parts-hub'
  | 'part-detail'
  | 'tools-hub'
  | 'tool-detail'
  | 'equipment-detail'
  | 'case-study'
  | 'blog-index'
  | 'blog-post'
  | 'case-studies'
  | 'materials'
  | 'capabilities'
  | 'industries'
  | 'industry-detail'
  | 'resources'
  | 'tech-article'
  | 'rfq'
  | 'standard-parts-hub'
  | 'standard-part-detail'
  | 'generic';

// 鈹€鈹€ Helpers 鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€

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

// 鈹€鈹€ Entity Builders 鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€

export function buildOrganization(): Organization {
  return {
    // schema.org Corporation subtype (2026-10-15, B2B entity strategy):
    // Corporation rdfs:subClassOf Organization -the incorporated-for-profit
    // legal form of this entity. schema-dts models Corporation inside the
    // Organization union, so every @id reference site keeps its Organization
    // typing and spec-compliant parsers expand the subclass chain.
    // Deliberately NOT LocalBusiness -see constants block above.
    '@type': 'Corporation',
    '@id': ORG_ID,
    name: 'Baoji Boze Metal Products Co., Ltd.',
    legalName: 'Baoji Boze Metal Products Co., Ltd.',
    // Corporate founding date. Source: src/i18n/translations/en.json
    //   about.story.paragraph1 鈫?"Founded in 2011 in the heart of 'Titanium
    //   Valley' (Baoji, China)..." No month/day published, so use Jan 1 as
    //   the canonical ISO-8601 representation of the founding year.
    // Use year-only ISO-8601 (`YYYY`) per Schema.org date spec. Avoids
    //   the artificial "Jan 1" padding which can trip data-quality
    //   auditors that compare against sources reporting only a year.
    foundingDate: '2011',
    // alternateName intentionally only carries the corporate trade name.
    // Brand-level aliases (BOZE Metal, BOZE CNC Ti) live on the Brand @ids
    // below -duplicating them here confuses LLM crawlers trying to resolve
    // which node is canonical for a given alias. See Phase 2A / P2-2.
    alternateName: ['BOZE', 'Boze Metal', 'Baoji Boze'],
    url: MAIN_SITE,
    logo: { '@id': LOGO_ID },
    // Phase 2B (2026-10-15): Google Rich Results Test 'LocalBusiness' branch
    // (which fires when a Corporation carries a PostalAddress + telephone) requires
    // an `image` field for the Knowledge Panel / visual anchor. Point to the same
    // canonical Logo @id (no new ImageObject, no duplicate upload).
    image: { '@id': LOGO_ID },
    // 鈹€鈹€ Public contact data (verbatim from src/i18n/translations/*/footer.*,
    //    cross-checked across all 12 locales for consistency) 鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€
    // Source: src/i18n/translations/en.json
    //   footer.tel      鈫?"Tel: 0917-6753303"           (Baoji landline)
    //   footer.phone    鈫?"Phone Number: +86-186-2391-9905" (international B2B mobile)
    //   footer.email    鈫?"Email: info@bozemetal.com"
    //   footer.address  鈫?"Add: C4 Workshop, North Area of High Tech Auto Parts
    //                     Business Incubation Base, FengHuang 10th Road,
    //                     High Tech Development Zone, Baoji City,
    //                     Shaanxi Province, P.R. China 721013"
    // We use the international mobile as the primary `telephone` because the
    // cnc.bozemetal.com site serves a global B2B audience; the landline
    // (0917-6753303) is preserved as a second `contactPoint` entry
    // (contactType: 'customer service') so both numbers stay reachable.
    email: 'info@bozemetal.com',
    telephone: '+86-186-2391-9905',
    address: {
      '@type': 'PostalAddress',
      streetAddress:
        'C4 Workshop, North Area of High Tech Auto Parts Business Incubation Base, FengHuang 10th Road',
      addressLocality: 'Baoji City',
      addressRegion: 'Shaanxi Province',
      postalCode: '721013',
      // Schema.org PostalAddress.addressCountry expects a Text value
      // (ISO 3166-1 alpha-2 country code). Using a nested Country object
      // caused Google Rich Results Test to flag "鍥藉/鍦板尯浠ｇ爜鏃犳晥" even
      // though 'CN' is the correct code. See Phase 2A / P2-1.
      addressCountry: 'CN',
    },
    contactPoint: [
      {
        '@type': 'ContactPoint',
        contactType: 'sales',
        telephone: '+86-186-2391-9905',
        email: 'info@bozemetal.com',
        // Schema.org allows repeated `contactType`; provide both English and
        // Chinese labels so multilingual LLMs/parsers can route correctly.
        alternateName: ['Sales', 'Sales - B2B Procurement'],
        // Schema.org 14.0 supports `contactOption` (TollFree / HearingImpairedSupported)
        // We leave it unset; the B2B audience is not a 1-800 caller.
        availableLanguage: ['en', 'de', 'ja', 'fr', 'es', 'pt', 'it', 'ko', 'nl', 'pl', 'ru', 'ar'],
      },
      {
        '@type': 'ContactPoint',
        contactType: 'customer service',
        telephone: '0917-6753303',
        email: 'info@bozemetal.com',
        alternateName: ['Customer Service', 'Tel (Landline)'],
        availableLanguage: ['en'],
      },
    ],
    brand: [
      { '@id': BRAND_BOZE_METAL_ID },
      { '@id': BRAND_BOZE_CNC_TI_ID },
    ],
    // Active certifications held by the Legal Org. Source of truth:
    //   AS9100D / EN 9100:2018 / ISO 9001:2015 -Bureau Veritas cert
    //   number CN054217, issued 2025-04-08, expires 2028-04-07.
    // The Certification @graph node is built by buildAS9100Certification()
    // and emitted once per page in buildPageGraph().
    hasCertification: [{ '@id': CERT_AS9100_ID }],
    industry: 'Titanium Manufacturing',
    // B2B export markets (single source of truth): nine served markets
    // resolved via Country-node @ids emitted once per page graph. Declares
    // the global OEM/ODM + wholesale reach for entity-graph builders.
    areaServed: B2B_MARKET_AREA_SERVED,
    // Enumerates the nine service lines of the export catalog. The
    // OfferCatalog node is built by buildOfferCatalog() and emitted once
    // per page in buildPageGraph().
    hasOfferCatalog: { '@id': OFFER_CATALOG_ID },
    knowsAbout: [
      'Titanium CNC Machining',
      'Titanium Components Manufacturing',
      'Ti-6Al-4V (Grade 5)',
      'Ti-6Al-4V ELI (Grade 23)',
      'Aerospace Titanium Components',
      'Medical Titanium Components',
      'Chemical Corrosion Resistant Components',
      '5-Axis CNC Machining',
      'CMM Inspection & Metrology',
      'Material Traceability (MTR)',
      // Industrial standards (2026-10-15): every designator below is live
      // site content -hero badges / highlight lists on the mill-products
      // and standard-parts hubs (src/config/hero.ts) plus the Bureau Veritas
      // certificate scope. No MIL-SPEC entry: the site cites no specific
      // MIL-SPEC document, so claiming one would violate the honesty rule.
      'AS9100D Aerospace Quality Management',
      'EN 9100:2018 Aerospace Quality Management',
      'ISO 9001:2015 Quality Management',
      'ASTM B348 Titanium & Titanium Alloy Bars and Billets',
      'ASTM B381 Titanium & Titanium Alloy Forgings',
      'ASTM F136 Ti-6Al-4V ELI Surgical Implant Titanium',
      'AMS 4928 Ti-6Al-4V Aerospace Bars, Forgings and Rings',
    ],
    makesOffer: [
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Titanium Manufacturing Services',
          description: 'Precision titanium CNC machining, fabrication, additive manufacturing, and surface treatment for aerospace, medical, chemical, and industrial components.',
          // B2B export markets (single source of truth -see
          // B2B_MARKET_AREA_SERVED). Supersedes the former opaque Text
          // 'Worldwide': the nine Country nodes resolve cleanly in entity
          // graphs while remaining factually accurate for the export-only
          // cnc.bozemetal.com funnel (12+ locale switcher, +86 international
          // phone, RFQ / Worldwide Procurement route verified by the Header /
          // Footer chrome and the i18n routing table).
          areaServed: B2B_MARKET_AREA_SERVED,
          category: 'Titanium Manufacturing',
        },
      },
    ],
    sameAs: [
      'https://www.linkedin.com/in/baoji-boze-metal-products-co-ltd-25a0923aa',
      'https://www.facebook.com/titaniummachinedparts/',
      'https://www.instagram.com/boze.metal.products.company/',
      'https://www.youtube.com/@boze-666',
    ],
  };
}

/**
 * AS9100D / EN 9100:2018 / ISO 9001:2015 certification
 *
 * Bureau Veritas Certification, cert number CN054217, issued 2025-04-08,
 * expires 2028-04-07. Issued to:
 *   BAOJI BOZE METAL PRODUCTS CO.,LTD
 *   C4 Workshop, North Area of High Tech Auto Parts Business Incubation Base,
 *   FengHuang 10th Road, High Tech Development Zone, Baoji City,
 *   Shaanxi Province, P.R. China
 * Scope: Machining of metal standard part used for aviation.
 * Source: AS9100-Certificate-CN054217-EN.pdf (Bureau Veritas original).
 * HD scan served at /uploads/cert-as9100-en9100-bv-HD.jpg.
 */
export function buildAS9100Certification(): Certification {
  return {
    '@type': 'Certification',
    '@id': CERT_AS9100_ID,
    name: 'AS9100D / EN 9100:2018 / ISO 9001:2015 -Quality Management System for Aviation Standard Parts',
    identifier: 'CN054217',
    issuedBy: {
      '@type': 'Organization',
      name: 'Bureau Veritas Certification',
      url: 'https://www.bureauveritas.com/',
      address: {
        '@type': 'PostalAddress',
        streetAddress: '5th Floor, 100 Lower Thames Street',
        addressLocality: 'London',
        postalCode: 'EC3R 6DL',
        // Same as Organization address: simple ISO 3166-1 alpha-2 code
        // (see Phase 2A / P2-1 commentary above for rationale).
        addressCountry: 'GB',
      },
    },
    validFrom: '2025-04-08',
    validThrough: '2028-04-07',
    url: `${SITEROOT}/uploads/cert-as9100-en9100-bv-HD.jpg`,
    about: { '@id': ORG_ID },
  };
}

export function buildBrands(): Brand[] {
  return [
    {
      '@type': 'Brand',
      '@id': BRAND_BOZE_METAL_ID,
      name: 'BOZE Metal',
    },
    {
      '@type': 'Brand',
      '@id': BRAND_BOZE_CNC_TI_ID,
      name: 'BOZE CNC Ti',
      parentBrand: { '@id': BRAND_BOZE_METAL_ID },
    },
  ];
}

/**
 * Emit the nine B2B export-market Country nodes. Emitted once per page
 * graph in buildPageGraph(); every areaServed declaration site
 * (Organization, makesOffer Service, OfferCatalog items) references
 * these nodes by @id, so each country appears exactly once per graph.
 */
export function buildMarketCountries(): Country[] {
  return B2B_EXPORT_MARKETS.map((m) => ({
    '@type': 'Country' as const,
    '@id': countryId(m.code),
    name: m.name,
    identifier: m.code,
  }));
}

/**
 * The nine catalog service lines, each mapped to its verified hub URL.
 * URLs verified against src/pages/ (2026-10-15). itemOffered Services are
 * intentionally anonymous (no @id): the per-hub Service entities use the
 * `${url}#service` @id convention on their own pages, and giving catalog
 * items the same @id would create duplicate-node conflicts in graphs that
 * contain both.
 */
const OFFER_CATALOG_ITEMS: { name: string; url: string; serviceType: string }[] = [
  { name: 'Titanium CNC Machining Services', url: `${SITEROOT}/titanium-cnc-machining-services/`, serviceType: 'CNC Milling & Turning' },
  { name: '5-Axis Titanium Machining', url: `${SITEROOT}/5-axis-titanium-machining/`, serviceType: '5-Axis CNC Machining' },
  { name: 'Titanium Additive Manufacturing', url: `${SITEROOT}/titanium-additive-manufacturing/`, serviceType: 'Additive Manufacturing' },
  { name: 'Titanium Fabrication Services', url: `${SITEROOT}/titanium-fabrication-services/`, serviceType: 'Fabrication & Welding' },
  { name: 'Titanium Forming & Heavy Manufacturing', url: `${SITEROOT}/titanium-forming-heavy-manufacturing/`, serviceType: 'Forming & Heavy Manufacturing' },
  { name: 'Titanium Surface Treatment', url: `${SITEROOT}/titanium-surface-treatment/`, serviceType: 'Surface Treatment & Finishing' },
  { name: 'Custom Titanium Parts (OEM/ODM)', url: `${SITEROOT}/parts/`, serviceType: 'OEM/ODM Custom Manufacturing' },
  { name: 'Titanium Standard Parts', url: `${SITEROOT}/standard-parts/`, serviceType: 'Standard Parts Supply' },
  { name: 'Titanium Mill Products', url: `${SITEROOT}/mill-products/`, serviceType: 'Mill Products Supply' },
];

/**
 * schema.org OfferCatalog -the OEM/ODM + wholesale B2B export catalog.
 *
 * Referenced from Organization.hasOfferCatalog ({ '@id': OFFER_CATALOG_ID })
 * and emitted once per page in buildPageGraph(). Declares to LLM crawlers
 * and entity-graph builders that Boze serves global / EU / US procurement
 * teams with the nine listed manufacturing service lines. Catalog entries
 * follow the canonical ItemList shape (ListItem 鈫?position 鈫?item: Offer 鈫?
 * itemOffered: Service) so every entry carries an unambiguous position and
 * the Offer semantics stay intact for parsers that only read Offer nodes.
 */
export function buildOfferCatalog(): OfferCatalog {
  return {
    '@type': 'OfferCatalog',
    '@id': OFFER_CATALOG_ID,
    name: 'Boze OEM/ODM Titanium Manufacturing Catalog (B2B Export)',
    description:
      'B2B export catalog of precision titanium manufacturing services: CNC machining, additive manufacturing, fabrication, surface treatment, and mill products. Serving aerospace, medical, chemical, marine, and industrial OEM/ODM procurement teams in the US, Canada, UK, Germany, France, Italy, Netherlands, Japan, and Australia.',
    numberOfItems: OFFER_CATALOG_ITEMS.length,
    itemListElement: OFFER_CATALOG_ITEMS.map((item, i) => ({
      '@type': 'ListItem' as const,
      position: i + 1,
      item: {
        '@type': 'Offer' as const,
        url: item.url,
        itemOffered: {
          '@type': 'Service' as const,
          name: item.name,
          serviceType: item.serviceType,
          provider: { '@id': ORG_ID },
          areaServed: B2B_MARKET_AREA_SERVED,
        },
      },
    })),
  };
}

export function buildManufacturingCenter(): Organization {
  return {
    '@type': 'Organization',
    '@id': MANUFACTURING_CENTER_ID,
    name: 'Boze Titanium Manufacturing Center',
    url: SITEROOT,
    parentOrganization: { '@id': ORG_ID },
    brand: { '@id': BRAND_BOZE_CNC_TI_ID },
  };
}

export function buildWebSite(): WebSite {
  return {
    '@type': 'WebSite',
    '@id': WEBSITE_ID,
    name: 'Boze Titanium Manufacturing Center',
    url: SITEROOT,
    description: 'Precision Titanium Manufacturing & CNC Machining Services',
    publisher: { '@id': ORG_ID },
  };
}

export function buildImageObject(): ImageObject {
  return {
    '@type': 'ImageObject',
    '@id': LOGO_ID,
    // 2026-10-14: upgraded from /uploads/boze-cnc-ti-ico.png (39脳38 favicon)
    // to /uploads/boze-cnc-ti-ico-512.png per user authorization. The file is
    // actually 2048脳2048 (1:1 square, ~1.3MB PNG) -well above Google's 112脳112
    // minimum for logo rich result. Filename keeps the 512 suffix by user
    // convention; declared width/height reflect the actual pixel dimensions.
    url: `${SITEROOT}/uploads/boze-cnc-ti-ico-512.png`,
    contentUrl: `${SITEROOT}/uploads/boze-cnc-ti-ico-512.png`,
    width: 2048,
    height: 2048,
    encodingFormat: 'image/png',
    caption: 'Boze Titanium Manufacturing Center - Precision Titanium CNC Machining',
  };
}

export interface WebPageInput {
  name: string;
  description: string;
  url: string;
  inLanguage: string;
  datePublished?: string | null;
  /**
   * F3 -绔欑偣瀹炰綋鍥俱€?
   * 浼犲叆 entity-registry.json 涓殑 entity.id 鍒楄〃锛屾湰鍑芥暟瑙ｆ瀽涓?
   * schema.org @id 寮曠敤骞朵互 WebPage.mentions 褰㈠紡杈撳嚭锛屼緵 LLM crawler
   * 寤虹珛璺ㄩ〉瀹炰綋鍏宠仈鍥俱€傛棤 page_url 鐨勫疄浣撹嚜鍔ㄨ烦杩囥€?
   */
  mentions?: string[];
  /**
   * AIO -Speakable CSS selectors. Targets in-page paragraphs that AIO
   * (Google AI Overviews) is permitted to cite as the authoritative answer
   * for voice / AI-summary features. Recommended: 3-5 thesis-first
   * paragraphs at the top of the page. Must match real DOM ids, e.g.
   * `['#aio-thesis-1', '#aio-thesis-2']`.
   *
   * Reference: https://schema.org/speakable
   */
  speakableSelectors?: string[];
}

export function buildWebPage(input: WebPageInput): WebPage {
  const { name, description, url, inLanguage, datePublished, mentions, speakableSelectors } = input;
  const mentionRefs = mentions ? refsFromIds(mentions) : [];
  const hasSpeakable = Array.isArray(speakableSelectors) && speakableSelectors.length > 0;
  return {
    '@type': 'WebPage',
    '@id': url,
    url,
    name,
    description,
    isPartOf: { '@id': WEBSITE_ID },
    inLanguage,
    // Bidirectional entity references (PDF fix 2026-10-14): close the
    // WebPage 鈫?BreadcrumbList and WebPage 鈫?Service pointers so graph
    // parsers (Google, LLM schema extractors) can resolve the page
    // surface area without re-traversing the @graph.
    // Use absolute @id (SITEROOT-scoped) so the WebPage 鈫?BreadcrumbList
    // pointer resolves to the actual `buildBreadcrumbList()` node in the
    // @graph. A relative `#breadcrumb` would fragment-resolve to
    // `<page-url>#breadcrumb` and surface as an orphan stub in Google
    // Rich Results Test (3rd BreadcrumbList entry with no itemListElement).
    breadcrumb: { '@id': `${SITEROOT}/#breadcrumb` },
    mainEntity: { '@id': `${url}#service` },
    ...(datePublished ? { datePublished } : {}),
    ...(mentionRefs.length > 0 ? { mentions: mentionRefs } : {}),
    ...(hasSpeakable
      ? {
          speakable: {
            '@type': 'Speakable',
            cssSelector: speakableSelectors,
          },
        }
      : {}),
  };
}

export interface BreadcrumbItem {
  position: number;
  name: string;
  item: string;
}

/**
 * Single FAQ Q&A pair. Mirrors the schema.org Question / acceptedAnswer shape
 * used by buildFaqPage(). Plain strings so callers can hardcode English
 * content or pass `t('...')` lookups directly.
 */
export interface FaqItem {
  question: string;
  answer: string;
}

export function buildBreadcrumbList(items: BreadcrumbItem[]): BreadcrumbList {
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

/**
 * Build a single schema.org Question entity.
 * Used inside buildFaqPage(). The acceptedAnswer.text holds the
 * plain-text answer.
 */
export function buildFaqEntry(item: FaqItem): Question {
  return {
    '@type': 'Question',
    name: item.question,
    acceptedAnswer: {
      '@type': 'Answer',
      text: item.answer,
    },
  };
}

/**
 * Build a schema.org FAQPage entity for a set of Q&A pairs.
 *
 * Per Google Search Central (2024+), FAQPage rich results are limited to
 * well-formed government / health Q&A. For B2B industrial pages we still emit
 * the entity so search engines and LLMs can ingest the structured Q&A pairs,
 * even though rich-result eligibility is restricted.
 */
export function buildFaqPage(input: {
  name: string;
  description?: string;
  url: string;
  inLanguage?: string;
  items: FaqItem[];
}): FAQPage {
  const faqId = `${input.url}#faq`;
  return {
    '@type': 'FAQPage',
    '@id': faqId,
    name: input.name,
    ...(input.description ? { description: input.description } : {}),
    url: input.url,
    ...(input.inLanguage ? { inLanguage: input.inLanguage } : {}),
    mainEntity: input.items.map((it) => buildFaqEntry(it)),
  };
}

/**
 * Single step inside a HowTo procedure. Mirrors the schema.org HowToStep
 * shape used by buildHowTo(). Plain strings so callers can hardcode English
 * content or pass `t('...')` lookups directly.
 *
 * Schema.org HowToStep reference:
 *   - position (int, required by Google rich-result guidelines)
 *   - name     (Text, recommended -short step title)
 *   - text     (Text, required -the step instruction itself)
 *   - url      (URL, optional -anchor to in-page section)
 */
export interface HowToStep {
  name: string;
  text: string;
  /** 1-based ordinal position of the step within the procedure. */
  position: number;
  /** Optional in-page anchor URL the AI extractor should link the step to. */
  url?: string;
}

/**
 * A HowTo procedure -a recipe-style, step-by-step answer to a "how to"
 * question. Mirrors the schema.org HowTo shape used by buildHowTo().
 *
 * Designed for AIO (Google AI Overviews) extraction: the procedure appears
 * inline in the AI-generated summary when the user's query is procedural
 * (e.g. "how to choose a titanium grade", "how to qualify an AS9100
 * supplier"). Per Google Search Central, HowTo rich results require
 *   - name (required)
 *   - step (required, 鈮? item, each with name + text + position)
 *
 * Reference: https://schema.org/HowTo
 */
export interface HowToItem {
  /** Procedure title (e.g. "How to Choose the Right Titanium Grade"). */
  name: string;
  /** Short human-readable description of what the procedure accomplishes. */
  description: string;
  /** Ordered list of steps. Must have at least one item with position 鈮?1. */
  steps: HowToStep[];
  /** ISO 8601 duration string (e.g. "PT15M", "P1D"). Recommended. */
  totalTime?: string;
  /** Estimated cost as a MonetaryAmount-shaped value (USD). Optional. */
  estimatedCost?: { currency: string; value: number };
  /** Tools required (HowToTool shape). Plain strings render as Text. */
  tool?: string[];
  /** Supplies / materials required (HowToSupply shape). Plain strings render as Text. */
  supply?: string[];
}

/**
 * Build a single schema.org HowToStep entity.
 * Used inside buildHowTo().
 */
export function buildHowToStep(step: HowToStep): HowToStep {
  return {
      '@type': 'HowToStep',
      position: step.position,
      name: step.name,
      text: step.text,
      ...(step.url ? { url: step.url } : {}),
    };
}

/**
 * Build a schema.org HowTo entity for a step-by-step procedure.
 *
 * AIO (Google AI Overviews) heavily favours HowTo schemas for procedural
 * queries. Emitting this entity signals the AI engine that the page is
 * a primary candidate for "how to" summary citations.
 *
 * Reference: https://schema.org/HowTo
 *   Google rich-result requirements: https://developers.google.com/search/docs/appearance/structured-data/how-to
 */
export function buildHowTo(input: {
  /** URL of the page hosting the procedure -used to derive a unique @id. */
  url: string;
  inLanguage?: string;
  item: HowToItem;
}): HowTo {
  const howtoId = `${input.url}#howto`;
  return {
    '@type': 'HowTo',
    '@id': howtoId,
    name: input.item.name,
    description: input.item.description,
    ...(input.inLanguage ? { inLanguage: input.inLanguage } : {}),
    ...(input.item.totalTime ? { totalTime: input.item.totalTime } : {}),
    ...(input.item.estimatedCost
      ? {
          estimatedCost: {
            '@type': 'MonetaryAmount',
            currency: input.item.estimatedCost.currency,
            value: input.item.estimatedCost.value,
          },
        }
      : {}),
    ...(input.item.tool?.length
      ? {
          tool: input.item.tool.map((t) => ({ '@type': 'HowToTool', name: t })),
        }
      : {}),
    ...(input.item.supply?.length
      ? {
          supply: input.item.supply.map((s) => ({ '@type': 'HowToSupply', name: s })),
        }
      : {}),
    step: input.item.steps
      .slice()
      .sort((a, b) => a.position - b.position)
      .map(buildHowToStep),
  };
}

// 鈹€鈹€ Additional Entity Builders 鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€

export function buildCollectionPage(input: { name: string; description: string; url: string; mainEntity?: string }): CollectionPage {
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
}): ItemList {
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

/**
 * Build a schema.org ItemList entity for a comparison table (e.g. "Grade 5
 * vs Grade 23"). AIO heavily cites comparison tables for "best X for Y"
 * queries. Each row is emitted as a ListItem referencing a Product @id,
 * with the comparison criteria exposed via additionalProperty.
 *
 * Reference: https://schema.org/ItemList
 */
export function buildComparisonList(input: {
  /** URL of the page hosting the comparison table -used to derive a unique @id. */
  url: string;
  /** Comparison-table heading (e.g. "Grade 5 vs Grade 23 (Ti-6Al-4V ELI)"). */
  name: string;
  /** Short human-readable description of what is being compared. */
  description?: string;
  /**
   * Compared entities. Each item must reference an existing schema.org @id
   * (Product, Service, etc.) so the ItemList links back into the site-wide
   * entity graph.
   */
  items: { '@id': string; name: string; description?: string }[];
  /**
   * Comparison criteria as PropertyValue rows. AIO uses these to render
   * feature-by-feature cells in the AI summary table.
   */
  criteria?: { name: string; values: Record<string, string | number> }[];
}): ItemList {
  const comparisonId = `${input.url}#comparison-list`;
  return {
    '@type': 'ItemList',
    '@id': comparisonId,
    name: input.name,
    ...(input.description ? { description: input.description } : {}),
    url: input.url,
    numberOfItems: input.items.length,
    // ItemList item is a cross-page @id reference to an existing Product entity.
    // Do NOT re-declare @type / name / description inline -Google treats inline
    // re-declarations as a Product owned by the host page and complains about
    // missing offers/review/aggregateRating on a page that is actually a BlogPosting.
    // Schema.org / Google guidance: a referenced Thing carries only @id.
    itemListElement: input.items.map((it, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      item: { '@id': it['@id'] },
    })),
    ...(input.criteria?.length
      ? {
          additionalProperty: input.criteria.map((c) => ({
            '@type': 'PropertyValue',
            name: c.name,
            value: c.values,
          })),
        }
      : {}),
  };
}

export function buildService(input: {
  name: string;
  description: string;
  url: string;
  category?: string;
  /**
   * Schema.org Service.serviceType -e.g. "Precision CNC Machining",
   * "5-axis CNC machining". Forwarded verbatim when provided.
   * IMPORTANT: only declare processes the page actually advertises.
   */
  serviceType?: string;
  /**
   * Schema.org Service.areaServed -geographic scope. For the cnc.bozemetal.com
   * site (export-only B2B), "Worldwide" is the factually accurate default;
   * callers may override with a country/region list when serving a narrower
   * audience. Do NOT emit this for purely domestic services.
   */
  areaServed?: string | string[];
  /**
   * Quantitative capability claims forwarded to buildService().additionalProperty.
   * Each entry maps to a Schema.org PropertyValue. The values must be
   * verbatim from the page's visible body (not synthesised).
   */
  serviceAdditionalProperty?: { name: string; value: number | string; unitText?: string }[];
  /**
   * Schema.org additionalProperty (PropertyValue[]) -quantitative
   * capability claims that the page renders as visible text (tolerance,
   * surface finish, yield, monthly capacity, etc.). The values MUST be
   * verbatim from the page's visible body; do NOT synthesise or improve
   * precision beyond what the page actually says.
   */
  additionalProperty?: { name: string; value: number | string; unitText?: string }[];
}): Service {
  return {
    '@type': 'Service',
    // Service @id must NOT collide with the page-level WebPage @id (= input.url).
    // The site data layer (`src/data/services-schema.ts`) already canonicalizes
    // each hub-service to `${pageUrl}#service`, so we follow that convention.
    '@id': `${input.url}#service`,
    name: input.name,
    description: input.description,
    url: input.url,
    // WebPage keeps its canonical @id = input.url (no fragment) by convention;
    // mainEntityOfPage therefore points at the WebPage entity directly.
    mainEntityOfPage: { '@id': input.url },
    provider: { '@id': ORG_ID },
    ...(input.category ? { category: input.category } : {}),
    ...(input.serviceType ? { serviceType: input.serviceType } : {}),
    ...(input.areaServed ? { areaServed: input.areaServed } : {}),
    ...(input.additionalProperty?.length
      ? {
          additionalProperty: input.additionalProperty.map((p) => ({
            '@type': 'PropertyValue',
            name: p.name,
            value: p.value,
            ...(p.unitText ? { unitText: p.unitText } : {}),
          })),
        }
      : {}),
  };
}

export function buildProduct(input: {
  name: string;
  description: string;
  url: string;
  image?: string;
  category?: string;
  datePublished?: string | null;
  /** Phase 3 -optional Product.sku (e.g. "TI-MOUSE-001"). */
  sku?: string;
  /** Phase 3 -optional Product.material (e.g. "Grade 5 Ti-6Al-4V"). */
  material?: string;
  /**
   * Real numeric retail price (USD). An `Offer` node is emitted ONLY when a
   * real numeric price exists (retail stock sale). Boze's catalogue is B2B
   * custom-manufactured to drawing - there is no published list price.
   */
  price?: number;
  /**
   * GSC Merchant Listings removal (2026-10-21) - no longer emits an Offer.
   *
   * Historical behaviour: when `price` was absent but `rfqUrl` was set, this
   * builder emitted a price-less `Offer` (MadeToOrder -> /rfq/). Google treats
   * any `Product.offers` node as a retail Merchant Listing and then enforces the
   * B2C-only required/recommended field set:
   *   - ERROR   missing field "price" / "priceSpecification" (in "offers")
   *   - WARNING invalid "availability" enum value (in "offers")
   *   - WARNING missing "hasMerchantReturnPolicy" (in "offers")
   *   - WARNING missing "shippingDetails" (in "offers")
   * Those fields are meaningless for a made-to-order B2B machining business
   * (no shelf price, no consumer returns, no parcel shipping policy), so the
   * only two honest options were fabricate them (schema spam - forbidden) or
   * drop the Offer so Google never runs the Merchant Listings check.
   *
   * The property is retained as an accepted-but-ignored no-op so the 260
   * `/products/product-entities/*` pages and every other existing caller keep
   * compiling without churn. The RFQ relationship is still fully expressed in
   * the graph via `Organization.makesOffer` (Service) and the site-wide
   * `OfferCatalog`, plus the in-page RFQ CTA.
   */
  rfqUrl?: string;
  /**
   * Offer.deliveryLeadTime. Only forwarded when a real numeric `price` exists
   * (i.e. when an Offer node is actually emitted). B2B made-to-order parts
   * surface their lead time in on-page content and in the Service entity's
   * `additionalProperty`, not in a retail Offer.
   */
  deliveryLeadTime?: string;
}): Product {
  const hasPrice = input.price != null;
  const offers = hasPrice
    ? {
        '@type': 'Offer',
        '@id': `${input.url}#offer`,
        url: input.url,
        price: input.price,
        priceCurrency: 'USD',
        ...(input.deliveryLeadTime ? { deliveryLeadTime: input.deliveryLeadTime } : {}),
        availability: 'https://schema.org/InStock',
        itemCondition: 'https://schema.org/NewCondition',
        seller: {
          '@type': 'Organization',
          '@id': ORG_ID,
          name: 'Baoji Boze Metal Products Co., Ltd.',
        },
        itemOffered: {
          '@type': 'Product',
          '@id': `${input.url}#product`,
        },
      }
    : undefined;

  return {
    '@type': 'Product',
    '@id': `${input.url}#product`,
    name: input.name,
    description: input.description,
    url: input.url,
    ...(input.image ? { image: input.image } : {}),
    ...(input.category ? { category: input.category } : {}),
    ...(input.sku ? { sku: input.sku } : {}),
    ...(input.material ? { material: input.material } : {}),
    ...(input.datePublished ? { datePublished: input.datePublished } : {}),
    manufacturer: {
      '@type': 'Organization',
      '@id': ORG_ID,
      name: 'Baoji Boze Metal Products Co., Ltd.',
    },
    brand: {
      '@type': 'Brand',
      '@id': BRAND_BOZE_CNC_TI_ID,
      name: 'BOZE CNC Ti',
    },
    ...(offers ? { offers } : {}),
  };
}

export function buildArticle(input: {
  headline: string;
  description: string;
  url: string;
  author: string;
  datePublished: string;
  /**
   * ISO 8601 date string. Per schema.org/Article spec, dateModified indicates
   * when the article was last edited. Emitted as `dateModified` on the
   * Article/BlogPosting node so search engines can surface freshness signals.
   */
  dateModified?: string;
  image?: string;
  mainEntityOfPage?: string;
  /**
   * Schema.org article subtype. Defaults to the generic 'Article' for
   * backward compatibility. Blog pages pass `BlogPosting`, which is the
   * precise Article subtype defined by schema.org for blog posts and is
   * the recommended type for blog content per Google's structured-data
   * documentation.
   */
  articleType?: 'Article' | 'BlogPosting' | 'NewsArticle';
}): Article {
  return {
    '@type': input.articleType ?? 'Article',
    '@id': input.url,
    headline: input.headline,
    description: input.description,
    url: input.url,
    author: { '@type': 'Person', name: input.author },
    datePublished: input.datePublished,
    ...(input.dateModified ? { dateModified: input.dateModified } : {}),
    publisher: { '@id': ORG_ID },
    mainEntityOfPage: { '@id': input.mainEntityOfPage || input.url },
    ...(input.image ? { image: input.image } : {}),
  };
}

/**
 * Schema.org TechArticle builder.
 *
 * TechArticle is the precise Article subtype for technical / engineering
 * content (per https://schema.org/TechArticle). It carries two
 * TechArticle-specific properties absent from the generic Article builder:
 *   - `proficiencyLevel` -declares the assumed reader knowledge tier.
 *   - `about`            -the technical subject the article covers (entity
 *                          link or string label). Used by Google to surface
 *                          the article in "expertise"-filtered search.
 *
 * Emitted only for `pageType === 'tech-article'` pages (Titanium Knowledge
 * Base, currently the only consumer). Backed by BaseLayout's
 * `articleHeadline` / `articleDescription` props, which `buildPageGraph`
 * already routes to this builder.
 */
export function buildTechArticle(input: {
  headline: string;
  description: string;
  url: string;
  author: string;
  datePublished: string;
  dateModified?: string;
  image?: string;
  mainEntityOfPage?: string;
  /** Optional audience tier -'Expert' for engineer-facing deep-dives, 'Beginner' for intro material. */
  proficiencyLevel?: 'Beginner' | 'Expert';
  /** Technical subject -entity link, schema.org @id, or plain string. */
  about?: string | readonly string[];
}): TechArticle {
  return {
    '@type': 'TechArticle',
    '@id': input.url,
    headline: input.headline,
    description: input.description,
    url: input.url,
    author: { '@type': 'Person', name: input.author },
    datePublished: input.datePublished,
    ...(input.dateModified ? { dateModified: input.dateModified } : {}),
    publisher: { '@id': ORG_ID },
    mainEntityOfPage: { '@id': input.mainEntityOfPage || input.url },
    ...(input.image ? { image: input.image } : {}),
    ...(input.proficiencyLevel ? { proficiencyLevel: input.proficiencyLevel } : {}),
    ...(input.about ? { about: input.about } : {}),
  };
}

// 鈹€鈹€ Page type detection 鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€

export function detectPageType(path: string, explicit?: PageType): PageType {
  if (explicit) return explicit;
  if (path === '/' || path === '') return 'home';
  if (path.startsWith('/services')) return path.split('/').filter(Boolean).length > 1 ? 'service-detail' : 'services-hub';
  if (path.startsWith('/parts')) return path.split('/').filter(Boolean).length > 1 ? 'part-detail' : 'parts-hub';
  if (path.startsWith('/standard-parts')) return path.split('/').filter(Boolean).length > 1 ? 'standard-part-detail' : 'standard-parts-hub';
  if (path.startsWith('/mill-products')) return path.split('/').filter(Boolean).length > 1 ? 'standard-part-detail' : 'mill-products-hub';
  if (path.startsWith('/products')) return path.split('/').filter(Boolean).length > 1 ? 'product-detail' : 'products-hub';
  if (path.startsWith('/tools')) return path.split('/').filter(Boolean).length > 1 ? 'tool-detail' : 'tools-hub';
  if (path.startsWith('/equipment')) return path.split('/').filter(Boolean).length > 1 ? 'equipment-detail' : 'generic';
  if (path.startsWith('/blog/category')) return 'blog-index';
  if (path.startsWith('/blog/page/')) return 'blog-index';
  if (path.startsWith('/blog') && path.split('/').filter(Boolean).length > 1) return 'blog-post';
  if (path.startsWith('/blog')) return 'blog-index';
  if (path.startsWith('/case-studies')) return path.split('/').filter(Boolean).length > 1 ? 'case-study' : 'case-studies';
  if (path.startsWith('/materials')) return 'materials';
  if (path.startsWith('/capabilities')) return 'capabilities';
  if (path.startsWith('/industries')) return 'industries';
  if (path.startsWith('/resources')) return 'resources';
  if (path.startsWith('/rfq') || path.startsWith('/contact')) return 'rfq';
  return 'generic';
}

// 鈹€鈹€ Breadcrumb builder 鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€

/** Short breadcrumb labels for product hub sub-pages (not present in NAVIGATION). */
const BREADCRUMB_LABELS: Record<string, string> = {
  '/products': 'Products & Solutions',
  '/products/systems': 'Engineering Systems',
  '/products/industries': 'Industries Served',
  '/products/materials': 'Materials Library',
  '/products/capabilities': 'Capabilities',
  '/products/product-entities': 'Component Library',
  '/products/component-library': 'Component Library',
  '/products/standards': 'Standards',
  // Titanium Parts (top-level B2B procurement entry, English nav)
  '/parts': 'Titanium Parts',
  // Solutions sub-hubs (Buyer Search Intelligence Phase G 路 Mill Products)
  '/mill-products': 'Titanium Mill Products',
  '/mill-products/plates-sheets': 'Titanium Plate & Sheet Stock',
  '/mill-products/bars-rods': 'Titanium Bar & Rod Stock',
  '/mill-products/tubes-pipes': 'Titanium Tube & Pipe Stock',
  '/mill-products/wire': 'Titanium Wire Stock',
  '/mill-products/foil-coils': 'Titanium Foil & Coil Stock',
  '/mill-products/mesh': 'Titanium Mesh Stock',
  // Solutions sub-hubs (Buyer Search Intelligence Phase H 路 Standard Parts)
  '/standard-parts': 'Titanium Standard Parts',
  '/standard-parts/flanges': 'Titanium Flanges',
  '/standard-parts/pipe-fittings': 'Titanium Pipe Fittings',
  '/standard-parts/fasteners': 'Titanium Fasteners',
  '/standard-parts/machined-components': 'CNC Machined Standard Components',
  '/parts/titanium-cnc-parts': 'Titanium CNC Parts',
  '/parts/titanium-fabricated-parts': 'Titanium Fabricated Parts',
  '/parts/titanium-pipe-components': 'Titanium Pipe Components',
  '/parts/titanium-marine-parts': 'Titanium Marine Parts',
  '/parts/titanium-uav-components': 'Titanium UAV Components',
  '/parts/titanium-motorsport-parts': 'Titanium Motorsport Parts',
  '/parts/titanium-medical-components': 'Titanium Medical Components',
  '/parts/titanium-anode': 'Titanium Anodes',
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

// 鈹€鈹€ SchemaPageData 鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€

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
  /** ISO 8601 last-modified timestamp for Article/BlogPosting schema. */
  articleDateModified?: string | null;
  articleImage?: string;
  /**
   * P2-7 -TechArticle-specific: a string or array of strings describing
   * the technical subject the article covers. Forwarded to
   * schema.org/TechArticle.about. Falls back to a generic titanium-machining
   * label when caller omits it.
   */
  articleAbout?: string | readonly string[];

  // Service
  serviceName?: string;
  serviceDescription?: string;
  serviceCategory?: string;
  /**
   * Schema.org Service.serviceType forwarded to buildService(). Optional;
   * omit when the page does not advertise a specific service-type label.
   * For cnc.bozemetal.com (export-only B2B) the default areaServed is
   * "Worldwide"; callers may pass a country/region list when narrower.
   */
  serviceType?: string;
  /**
   * Schema.org Service.areaServed forwarded to buildService(). For the
   * cnc.bozemetal.com export-only B2B funnel, the default is "Worldwide".
   * Pass a country/region list when the page explicitly serves a narrower
   * audience (e.g. a domestic-only landing page).
   */
  serviceAreaServed?: string | string[];

  // Product
  productName?: string;
  productDescription?: string;
  productImage?: string;
  productCategory?: string;
  productDatePublished?: string | null;
  /**
   * B2B Request-Quote URL. Retained as an accepted-but-ignored no-op.
   *
   * GSC Merchant Listings fix (2026-10-21): this used to auto-inject a
   * price-less `Offer` (MadeToOrder -> /rfq/) into every product-detail /
   * standard-part-detail Product. Google reads any `Product.offers` as a retail
   * Merchant Listing and then requires B2C-only fields that do not apply to a
   * made-to-order machining business. Passing this prop no longer produces an
   * Offer; the RFQ relationship is carried by `Organization.makesOffer`
   * (Service) and the site-wide `OfferCatalog` instead.
   */
  productRfqUrl?: string;
  /** Phase 3 -Product SKU. Per-page override of the entity's own sku field. */
  productSku?: string;
  /** Phase 3 -Product material (e.g. "Grade 5 Ti-6Al-4V"). Maps to schema.org Product.material. */
  productMaterial?: string;
  /**
   * Offer.deliveryLeadTime. Only emitted when a real numeric price produces an
   * Offer node; ignored for the B2B made-to-order Product entities (which
   * surface lead time in on-page content and via the Service entity's
   * `additionalProperty`).
   */
  productDeliveryLeadTime?: string;
  /**
   * Phase 3 -Override howToItem for product-detail pages. When the page has
   * a spec-driven manufacturing_process list, pass it as a HowToItem so the
   * main graph emits a single HowTo entity without a parallel page-level script.
   */
  productHowto?: HowToItem;
  /**
   * Phase 3 -Override faqItems for product-detail pages. When the page has
   * a spec-driven FAQ list, pass it as a FaqItem[] so the main graph emits a
   * single FAQPage entity without a parallel page-level script.
   */
  productFaqItems?: FaqItem[];

  // Tool (Phase 2C) -WebApplication entity for /tools/<slug>/ pages
  toolName?: string;
  toolDescription?: string;
  toolCategory?: string;
  toolSubCategory?: string;
  /** Optional path (relative to SITEROOT) for the RFQ Offer link from a tool. */
  toolRfqPath?: string;

  // Collection / listing
  collectionName?: string;
  collectionDescription?: string;
  itemCount?: number;
  items?: { name: string; url: string }[];

  /**
   * FAQPage structured-data items. When provided, buildPageGraph will emit
   * an additional FAQPage entity (Question / acceptedAnswer pairs) regardless
   * of pageType. Use for service-detail / product / blog pages where the
   * visible accordion Q&A should be machine-readable.
   */
  faqItems?: FaqItem[];
  /** Optional human-readable label for the FAQPage entity. */
  faqName?: string;

  /**
   * AIO -HowTo structured-data item. When provided, buildPageGraph will emit
   * an additional HowTo entity (recipe-style step-by-step procedure) regardless
   * of pageType. Use for procedural content pages that answer a "how to"
   * query (e.g. "how to choose a titanium grade", "how to qualify an AS9100
   * supplier"). Google AI Overviews heavily favour HowTo schemas for procedural
   * queries and may cite the procedure inline in the AI summary.
   */
  howtoItem?: HowToItem;

  /**
   * F3 -Entity graph @id references. Pass an array of `entity.id` from
   * `data/entities/entity-registry.json`; each is resolved to a schema.org
   * @id + @type reference and emitted under WebPage.mentions.
   *
   * Use this for hub pages (industries, capabilities, materials, parts)
   * to declare "this page is about these entities" -enables LLM crawlers
   * to build a site-wide entity graph even without crawling every detail
   * page.
   */
  mentions?: string[];
  /**
   * AIO -Speakable CSS selectors. Targets in-page paragraphs that AIO
   * (Google AI Overviews) is permitted to cite as the authoritative answer
   * for voice / AI-summary features. Recommended: 3-5 thesis-first
   * paragraphs at the top of the page. Must match real DOM ids, e.g.
   * `['#aio-thesis-1', '#aio-thesis-2']`.
   *
   * Reference: https://schema.org/speakable
   */
  speakableSelectors?: string[];
  /**
   * AIO -Comparison-table ItemList. When provided, buildPageGraph emits an
   * additional ItemList entity where each ListItem references an existing
   * Product @id and the comparison criteria are exposed via PropertyValue.
   * AIO cites comparison tables for "best X for Y" queries.
   */
  comparisonList?: {
    name: string;
    description?: string;
    items: { '@id': string; name: string; description?: string }[];
    criteria?: { name: string; values: Record<string, string | number> }[];
  };
}

/**
 * Build the full @graph for a page.
 *
 * Every page always gets:
 *   Organization  (@id: #boze-org)
 *   WebSite       (publisher 鈫?#boze-org)
 *   WebPage       (isPartOf 鈫?#boze-website)
 *   BreadcrumbList (if items provided)
 *
 * Additional entities are added based on pageType.
 */
export function buildPageGraph(pageType: PageType, data: SchemaPageData) {
  // `unknown[]` (not Record<string, unknown>[]) -the builders return
  // schema-dts leaf interfaces (and unions containing `string`), which
  // carry no index signature. Every consumer treats nodes as opaque
  // JSON-LD values, so the wider array type is the honest annotation and
  // removes a family of false-positive TS2345 errors at the push sites.
  const graph: unknown[] = [];

  // 1. Legal Organization + Brands + Manufacturing Center + WebSite -every page
  graph.push(buildOrganization());
  graph.push(...buildBrands());
  graph.push(buildAS9100Certification());
  graph.push(buildManufacturingCenter());
  graph.push(buildImageObject());
  graph.push(buildWebSite());

  // 1b. B2B export-market Country nodes + OfferCatalog -every page. The
  //     Country nodes are the @id targets for every areaServed declaration
  //     (Organization, makesOffer Service, catalog items); the OfferCatalog
  //     enumerates the nine export service lines so any single page crawl
  //     resolves Boze's full OEM/ODM catalog.
  graph.push(...buildMarketCountries());
  graph.push(buildOfferCatalog());

  // 2. WebPage -every page
  graph.push(buildWebPage({
    name: data.pageName,
    description: data.pageDescription,
    url: data.pageUrl,
    inLanguage: data.inLanguage ?? 'en-US',
    datePublished: data.articleDatePublished ?? null,
    mentions: data.mentions,
    speakableSelectors: data.speakableSelectors,
  }));

  // 3. Breadcrumb
  if (data.breadcrumbItems?.length) {
    graph.push(buildBreadcrumbList(data.breadcrumbItems));
  }

  // 4. FAQ (opt-in -independent of pageType so it works on service-detail,
  //    product-detail, blog-post, etc. when an accordion is present).
  if (data.faqItems?.length) {
    graph.push(buildFaqPage({
      name: data.faqName ?? `${data.pageName} -Frequently Asked Questions`,
      url: data.pageUrl,
      inLanguage: data.inLanguage ?? 'en-US',
      items: data.faqItems,
    }));
  }

  // 4b. AIO -HowTo (opt-in -independent of pageType). Emits a recipe-style
  //     step-by-step procedure entity that Google AI Overviews can extract
  //     for procedural "how to" queries.
  if (data.howtoItem?.steps?.length) {
    graph.push(buildHowTo({
      url: data.pageUrl,
      inLanguage: data.inLanguage ?? 'en-US',
      item: data.howtoItem,
    }));
  }

  // 4c. AIO -Comparison ItemList (opt-in -independent of pageType). Emits
  //     an ItemList entity referencing existing Product @ids, with comparison
  //     criteria as PropertyValue rows. AIO cites comparison tables for
  //     "best X for Y" queries.
  if (data.comparisonList?.items?.length) {
    graph.push(buildComparisonList({
      url: data.pageUrl,
      name: data.comparisonList.name,
      ...(data.comparisonList.description ? { description: data.comparisonList.description } : {}),
      items: data.comparisonList.items,
      ...(data.comparisonList.criteria?.length ? { criteria: data.comparisonList.criteria } : {}),
    }));
  }

  // 5. Type-specific entities
  switch (pageType) {
    case 'services-hub':
    case 'products-hub':
    case 'parts-hub':
    case 'tools-hub':
    case 'blog-index':
    case 'case-studies':
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
      // F4 -services-hub exposes Service + Article entities (Product removed in
      // Phase 2B, 2026-09-12 -see schema-issues.md P0-1 and P2-4). Hubs must
      // not emit Product entities because GSC then applies the retail-Product
      // enhancement check (review / aggregateRating / price / priceCurrency /
      // availability) and reports 5 false-positive warnings on every B2B hub
      // page. The "Custom Titanium CNC Parts" concept is correctly modeled as
      // Product on the per-part detail pages only.
      if (pageType === 'services-hub') {
        if (data.serviceName) {
          graph.push(buildService({
            name: data.serviceName,
            description: data.serviceDescription ?? data.pageDescription,
            url: data.pageUrl,
            category: data.serviceCategory,
            ...(data.serviceType ? { serviceType: data.serviceType } : {}),
            ...(data.serviceAreaServed ? { areaServed: data.serviceAreaServed } : { areaServed: B2B_MARKET_ISO_CODES }),
            ...(data.serviceAdditionalProperty?.length
              ? { additionalProperty: data.serviceAdditionalProperty }
              : {}),
          }));
        }
        if (data.articleHeadline && data.articleDatePublished) {
          graph.push(buildArticle({
            headline: data.articleHeadline,
            description: data.articleDescription ?? data.pageDescription,
            url: data.pageUrl,
            author: data.articleAuthor || 'BOZE CNC Ti Engineering Team',
            datePublished: data.articleDatePublished,
            mainEntityOfPage: data.pageUrl,
          }));
        }
      }
      break;

    case 'service-detail':
    case 'industry-detail':
      if (data.serviceName) {
        graph.push(buildService({
          name: data.serviceName,
          description: data.serviceDescription ?? data.pageDescription,
          url: data.pageUrl,
          category: data.serviceCategory,
          ...(data.serviceType ? { serviceType: data.serviceType } : {}),
          ...(data.serviceAreaServed ? { areaServed: data.serviceAreaServed } : { areaServed: B2B_MARKET_ISO_CODES }),
          ...(data.serviceAdditionalProperty?.length
            ? { additionalProperty: data.serviceAdditionalProperty }
            : {}),
        }));
      }
      break;

    // Phase H -Buyer Search Intelligence. /standard-parts/ Hub + sub-Hubs.
    // Both pageTypes share the same graph-emission shape:
    //   CollectionPage + ItemList  (when collectionName / items provided)
    //   Service                   (when serviceName provided -no inline
    //                              JSON-LD needed, F4 compliance)
    // Phase G-2.2: now also emits a Product entity for the standard-part-detail
    // case when productName (or serviceName as fallback) is present, with
    // deliveryLeadTime forwarded from productDeliveryLeadTime. The product
    // hub (`standard-parts-hub`) still does NOT emit Product -that's the
    // procurement landing page, not a per-SKU page.
    case 'standard-parts-hub':
    case 'standard-part-detail':
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
      if (data.serviceName) {
        graph.push(buildService({
          name: data.serviceName,
          description: data.serviceDescription ?? data.pageDescription,
          url: data.pageUrl,
          category: data.serviceCategory,
          ...(data.serviceType ? { serviceType: data.serviceType } : {}),
          ...(data.serviceAreaServed ? { areaServed: data.serviceAreaServed } : { areaServed: B2B_MARKET_ISO_CODES }),
          ...(data.serviceAdditionalProperty?.length
            ? { additionalProperty: data.serviceAdditionalProperty }
            : {}),
        }));
      }
      // Phase G-2.2: opt-in Product entity for standard-part-detail (not
      // standard-parts-hub, which remains a procurement landing page).
      //
      // GSC Merchant Listings fix (2026-10-21): the RFQ `Offer` injection was
      // removed here. A price-less `Offer` on a `Product` makes Google run the
      // B2C retail Merchant Listings check, which then errors on missing
      // price/priceSpecification and warns on availability /
      // hasMerchantReturnPolicy / shippingDetails. These parts are made-to-order
      // B2B goods quoted per drawing, so no Offer is emitted at all — the
      // procurement path stays expressed by the Service entity above plus the
      // site-wide Organization.makesOffer / OfferCatalog nodes.
      if (pageType === 'standard-part-detail') {
        const productName = data.productName ?? data.serviceName;
        if (productName) {
          graph.push(buildProduct({
            name: productName,
            description: data.productDescription ?? data.serviceDescription ?? data.pageDescription,
            url: data.pageUrl,
            image: data.productImage,
            category: data.productCategory,
            ...(data.productSku ? { sku: data.productSku } : {}),
            ...(data.productMaterial ? { material: data.productMaterial } : {}),
          }));
        }
      }
      break;

    case 'product-detail':
    case 'part-detail':
      // Phase 2C -part-detail emits BOTH Product (the part being procured)
      // and Service (the manufacturing capability that backs the part). This
      // matches the B2B reality: customer procures a Part, but the Part is
      // fulfilled by a custom Manufacturing Service. See schema-issues.md P1-2.
      // Phase 3 -product-detail now accepts sku / material / howto / faqItems
      // via SchemaPageData (previously only emitted via parallel page-level
      // JSON-LD blocks; see product-entities/[...slug].astro pre-Phase 3).
      if (data.productName) {
        graph.push(buildProduct({
          name: data.productName,
          description: data.productDescription ?? data.pageDescription,
          url: data.pageUrl,
          image: data.productImage,
          category: data.productCategory,
          ...(data.productSku ? { sku: data.productSku } : {}),
          ...(data.productMaterial ? { material: data.productMaterial } : {}),
          datePublished: data.productDatePublished,
          // No rfqUrl — GSC Merchant Listings fix (2026-10-21). A price-less
          // Offer on a B2B made-to-order part triggers the retail Merchant
          // Listings check (price/priceSpecification error + availability /
          // hasMerchantReturnPolicy / shippingDetails warnings). No Offer is
          // emitted; the RFQ path is carried by the Service entity below and
          // by Organization.makesOffer / the site-wide OfferCatalog.
        }));
      }
      // Phase 3 -product-detail page-level HowTo (manufacturing_process) is
      // now expressed via productHowto prop. The main graph emits a single
      // HowTo entity in the unified @graph.
      if (data.productHowto && data.productHowto.steps?.length) {
        graph.push(buildHowTo({
          url: data.pageUrl,
          inLanguage: data.inLanguage ?? 'en-US',
          item: data.productHowto,
        }));
      }
      // Phase 3 -product-detail FAQ (specEntry?.data.faqs or data.faq) now
      // expressed via productFaqItems prop. Falls back to existing faqItems if
      // the page-level override is not provided (backwards-compatible).
      if (data.productFaqItems?.length && !data.faqItems?.length) {
        graph.push(buildFaqPage({
          name: data.faqName ?? `${data.pageName} -Frequently Asked Questions`,
          url: data.pageUrl,
          inLanguage: data.inLanguage ?? 'en-US',
          items: data.productFaqItems,
        }));
      }
      if (data.serviceName) {
        graph.push(buildService({
          name: data.serviceName,
          description: data.serviceDescription ?? data.pageDescription,
          url: data.pageUrl,
          category: data.serviceCategory,
          ...(data.serviceType ? { serviceType: data.serviceType } : {}),
          ...(data.serviceAreaServed ? { areaServed: data.serviceAreaServed } : { areaServed: B2B_MARKET_ISO_CODES }),
          ...(data.serviceAdditionalProperty?.length
            ? { additionalProperty: data.serviceAdditionalProperty }
            : {}),
        }));
      }
      break;

    // Phase 2C -equipment-detail emits a Product entity WITHOUT an Offer
    // (equipment pages are showcase, not retail sale). Mirrors part-detail
    // structure for consistency. See docs/schema-audit/schema-issues.md P1-5.
    case 'equipment-detail':
      if (data.productName) {
        graph.push(buildProduct({
          name: data.productName,
          description: data.productDescription ?? data.pageDescription,
          url: data.pageUrl,
          image: data.productImage,
          category: data.productCategory,
          datePublished: data.productDatePublished,
          // No rfqUrl / no price — buildProduct skips the Offer block entirely,
          // so Google never runs the B2C Merchant Listings check on equipment
          // showcase pages. See docs/schema-audit/schema-issues.md P1-5.
        }));
      }
      break;

    // Phase 2C -tool-detail emits a WebApplication entity (interactive
    // engineering calculators / utilities). NOT a Product -tools are free
    // utilities, not retail goods. See schema-issues.md P1-6.
    case 'tool-detail':
      if (data.toolName) {
        graph.push({
          '@type': 'WebApplication',
          '@id': `${data.pageUrl}#webapp`,
          url: data.pageUrl,
          name: data.toolName,
          description: data.toolDescription ?? data.pageDescription,
          applicationCategory: data.toolCategory ?? 'EngineeringApplication',
          applicationSubCategory: data.toolSubCategory,
          operatingSystem: 'Web Browser',
          browserRequirements: 'Modern browser with JavaScript enabled',
          inLanguage: data.inLanguage ?? 'en-US',
          isPartOf: { '@id': WEBSITE_ID },
          provider: { '@id': ORG_ID },
          // Free engineering tools -link to RFQ for downstream manufacturing
          // service, but do NOT fabricate availability/price.
          ...(data.toolRfqPath ? { offers: { '@type': 'Offer', url: `${SITEROOT}${data.toolRfqPath}`, availability: 'https://schema.org/MadeToOrder', itemOffered: { '@type': 'Service', name: data.toolName } } } : {}),
        });
      }
      break;

    // Phase 2C -case-study emits Article (NOT BlogPosting). Procurement
    // evidence pages are not blog content. See schema-issues.md P1-1.
    case 'case-study':
      if (data.articleHeadline) {
        graph.push(buildArticle({
          headline: data.articleHeadline,
          description: data.articleDescription ?? data.pageDescription,
          url: data.pageUrl,
          author: data.articleAuthor ?? 'Boze Titanium Manufacturing Center',
          datePublished: data.articleDatePublished ?? new Date().toISOString(),
          image: data.articleImage,
          mainEntityOfPage: data.pageUrl,
          // Generic Article (not BlogPosting) -case studies are procurement
          // evidence, not blog content.
          articleType: 'Article',
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
          // Only emit dateModified when caller provides one -avoids
          // a fabricated value that would mislead search engines.
          ...(data.articleDateModified ? { dateModified: data.articleDateModified } : {}),
          image: data.articleImage,
          mainEntityOfPage: data.pageUrl,
          // schema.org Article subtype: BlogPosting is the precise match for
          // blog content per Google's structured-data documentation. The
          // generic 'Article' fallback would also be valid but less specific.
          articleType: 'BlogPosting',
        }));
      }
      break;

    // P2-7 -Titanium Knowledge Base hub page emits a TechArticle entity.
    // Drives the page-level structured-data so Google's "expertise" filter
    // can surface the page for technical / engineering queries. Same prop
    // surface as the blog-post case (articleHeadline / articleDescription /
    // articleAuthor / articleDatePublished / articleDateModified).
    case 'tech-article':
      if (data.articleHeadline) {
        graph.push(buildTechArticle({
          headline: data.articleHeadline,
          description: data.articleDescription ?? data.pageDescription,
          url: data.pageUrl,
          author: data.articleAuthor ?? 'Boze Titanium Engineering Center',
          datePublished: data.articleDatePublished ?? new Date().toISOString(),
          ...(data.articleDateModified ? { dateModified: data.articleDateModified } : {}),
          image: data.articleImage,
          mainEntityOfPage: data.pageUrl,
          proficiencyLevel: 'Expert',
          about: data.articleAbout ?? 'Titanium CNC Machining, ASTM/AMS Standards, Grade 5 / Grade 23 Selection',
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
