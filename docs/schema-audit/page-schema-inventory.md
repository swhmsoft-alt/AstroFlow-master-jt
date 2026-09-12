# Boze Page Type → Entity → Schema Inventory

> **Generated:** 2026-09-12
> **Phase:** 1 — Read-only audit (no code modified)
> **Author:** Cline (MiniMax M3)
> **Scope:** Real `src/pages/`, `src/components/`, `src/layouts/`, `src/lib/schema.ts`, `src/content/`, and `dist/**/*.html`

---

## 1. Methodology

This inventory is the single source of truth for **current state** of structured data on
the Boze Titanium Manufacturing Center site. Every entry below was extracted from:

- **Source-of-truth template/component chain** (Astro page → BaseLayout → schema.ts builder)
- **Page-level inline JSON-LD blocks** (components that emit their own `<script type="application/ld+json">`)
- **Dist verification** (`tasks/audit_product_pages.mjs` ran against the existing `dist/` tree)

No value below was guessed or fabricated. Where a field is missing in the source,
it is marked `—` (literal "not present in template").

---

## 2. Page Type Coverage

### 2.1 Page Types Defined by `src/lib/schema.ts` (`PageType` enum, schema.ts:46–61)

```text
home
services-hub
service-detail
products-hub
product-detail
blog-index
blog-post
case-studies
materials
capabilities
industries
industry-detail
resources
rfq
generic
```

### 2.2 Page Type Detection Rule (`detectPageType`, schema.ts:623–639)

| Path prefix              | Detected PageType            |
|--------------------------|------------------------------|
| `/`                      | `home`                       |
| `/services` (1 seg)      | `services-hub`               |
| `/services/*` (>1 seg)   | `service-detail`             |
| `/products` (1 seg)      | `products-hub`               |
| `/products/*` (>1 seg)   | `product-detail`             |
| `/blog/category`         | `blog-index`                 |
| `/blog/page/`            | `blog-index`                 |
| `/blog/*` (>1 seg)       | `blog-post`                  |
| `/blog` (1 seg)          | `blog-index`                 |
| `/case-studies`          | `case-studies`               |
| `/materials`             | `materials`                  |
| `/capabilities`          | `capabilities`               |
| `/industries`            | `industries`                  |
| `/resources`             | `resources`                  |
| `/rfq`, `/contact`       | `rfq`                        |
| (fallback)               | `generic`                    |

### 2.3 Explicit `pageType=` overrides in source files (41 files)

| Source file | Explicit pageType | Auto-detect would yield |
|---|---|---|
| `src/pages/5-axis-titanium-machining.astro` | `service-detail` | `service-detail` |
| `src/pages/as9100-titanium-supplier.astro` | `service-detail` | `service-detail` |
| `src/pages/blog/category/[slug].astro` | `blog-index` | `blog-index` |
| `src/pages/blog/page/[page].astro` | `blog-index` | `blog-index` |
| `src/pages/blog/[...slug].astro` | `blog-post` | `blog-post` |
| `src/pages/case-studies/index.astro` | `case-studies` | `case-studies` |
| `src/pages/case-studies/[...slug].astro` | `blog-post` ⚠️ | `blog-post` (mismatch) |
| `src/pages/industries/aerospace.astro` | `industry-detail` | `industry-detail` |
| `src/pages/industries/ai-infrastructure.astro` | `industry-detail` | `industry-detail` |
| `src/pages/industries/chemical.astro` | `industry-detail` | `industry-detail` |
| `src/pages/industries/energy.astro` | `industry-detail` | `industry-detail` |
| `src/pages/industries/industrial-equipment.astro` | `industry-detail` | `industry-detail` |
| `src/pages/industries/marine.astro` | `industry-detail` | `industry-detail` |
| `src/pages/industries/medical.astro` | `industry-detail` | `industry-detail` |
| `src/pages/industries/semiconductor.astro` | `industry-detail` | `industry-detail` |
| `src/pages/industries/uav-drones.astro` | `industry-detail` | `industry-detail` |
| `src/pages/parts/index.astro` | `products-hub` ⚠️ | `products-hub` (semantic mismatch) |
| `src/pages/parts/titanium-cnc-parts.astro` | `service-detail` ⚠️ | `service-detail` (semantic mismatch) |
| `src/pages/parts/titanium-fabricated-parts.astro` | `service-detail` ⚠️ | `service-detail` |
| `src/pages/parts/titanium-pipe-components.astro` | `service-detail` ⚠️ | `service-detail` |
| `src/pages/parts/titanium-marine-parts.astro` | `service-detail` ⚠️ | `service-detail` |
| `src/pages/parts/titanium-uav-components.astro` | `service-detail` ⚠️ | `service-detail` |
| `src/pages/parts/titanium-motorsport-parts.astro` | `service-detail` ⚠️ | `service-detail` |
| `src/pages/parts/titanium-medical-components.astro` | `service-detail` ⚠️ | `service-detail` |
| `src/pages/products/capabilities/index.astro` | `products-hub` | `products-hub` |
| `src/pages/products/component-library/index.astro` | `products-hub` | `products-hub` |
| `src/pages/products/industries/index.astro` | `products-hub` | `products-hub` |
| `src/pages/products/materials/index.astro` | `products-hub` | `products-hub` |
| `src/pages/products/product-entities/index.astro` | `products-hub` | `products-hub` |
| `src/pages/products/systems/index.astro` | `products-hub` | `products-hub` |
| `src/pages/products/[...slug].astro` | `product-detail` | `product-detail` |
| `src/pages/rfq.astro` | `rfq` | `rfq` |
| `src/pages/services.astro` | `services-hub` | `services-hub` |
| `src/pages/titanium-cnc-machining-manufacturer.astro` | `service-detail` | `service-detail` |
| `src/pages/titanium-machining.astro` | `service-detail` | `service-detail` |
| `src/pages/tools/index.astro` | `services-hub` ⚠️ | `services-hub` (semantic mismatch) |
| `src/pages/tools/machining-simulator.astro` | `generic` ⚠️ | `generic` |
| `src/pages/[...lang]/services/[...slug].astro` | `service-detail` | varies |
| `src/pages/[lang]/blog/[...slug].astro` | `blog-post` | `blog-post` |
| `src/pages/[lang]/[...slug].astro` | `industry-detail` | varies |
| `src/pages/[...lang]/capabilities/[...slug].astro.bak` | (excluded — backup) | — |

---

## 3. URL Inventory — Real Pages

### 3.1 Static Routes (src/pages/*.astro, no dynamic data)

| URL | Source file | Title source | H1 | Page Type Candidate | Primary Entity | Current Schema | Status |
|---|---|---|---|---|---|---|---|
| `/` | `src/pages/index.astro` | SITE.title | (hero h1) | `home` | BOZE Titanium Mfg Center | Organization+Brand+ManufacturingCenter+WebSite+WebPage | CORRECT |
| `/about/` | `src/pages/about.astro` | SEO_CONFIG | (about h1) | `generic` | Organization | Organization+Brand+...+WebPage | CORRECT |
| `/services/` | `src/pages/services.astro` | SEO_CONFIG | "Titanium CNC Manufacturing Services" | `services-hub` | **Service** (Titanium CNC Manufacturing Services) | Service + Product ⚠️ + Article + CollectionPage + ItemList + FAQPage + HowTo | **WRONG_ENTITY** (Product 错位) |
| `/rfq/` | `src/pages/rfq.astro` | SEO_CONFIG | (rfq h1) | `rfq` | **Service** (RFQ & Quotation) | Service (page-level) + OfferCatalog + Org+Brand+...+WebPage | CORRECT |
| `/case-studies/` | `src/pages/case-studies/index.astro` | inline | "Case Studies" | `case-studies` | **Collection** of Case Studies | CollectionPage + ItemList + Org+... | CORRECT |
| `/blog/` | `src/pages/blog/index.astro` | SEO_CONFIG | "Blog" | `blog-index` | **Collection** of blog posts | CollectionPage + ItemList + Org+... | CORRECT |
| `/blog/page/2/` ... `/blog/page/4/` | `src/pages/blog/page/[page].astro` | SEO_CONFIG | "Blog — Page N" | `blog-index` | **Collection** of blog posts | CollectionPage + ItemList + Org+... | CORRECT |
| `/blog/category/<slug>/` | `src/pages/blog/category/[slug].astro` | inline | (category h1) | `blog-index` | **Collection** of blog posts | CollectionPage + ItemList + Org+... | CORRECT |
| `/materials/` | `src/pages/materials.astro` | SEO_CONFIG | "Materials" | `materials` | **Collection** of materials/standards | (only Org+WebSite+WebPage; no CollectionPage emitted because schema.ts generic path has no collectionName prop) | **MISSING_SCHEMA** (no CollectionPage) |
| `/capabilities/` | `src/pages/capabilities.astro` | SEO_CONFIG | "Capabilities" | `capabilities` | **Collection** of capabilities | (same as /materials/) | **MISSING_SCHEMA** |
| `/equipment/` | `src/pages/equipment.astro` | i18n | "Equipment" | `generic` | **Collection** of equipment | Org+WebSite+WebPage (no CollectionPage) | **MISSING_SCHEMA** |
| `/industries/` | `src/pages/industries.astro` | SEO_CONFIG | "Industries" | `industries` | **Collection** of industries | Org+WebSite+WebPage | **MISSING_SCHEMA** |
| `/products/` | `src/pages/products/index.astro` | SEO_CONFIG | "Products" | `products-hub` | **Collection** of products/systems | Org+WebSite+WebPage | **MISSING_SCHEMA** (no CollectionPage emitted because no explicit collectionName prop) |
| `/products/systems/` | `src/pages/products/systems/index.astro` | SEO_CONFIG | "Systems" | `products-hub` | **Collection** of systems | CollectionPage + ItemList (via explicit pageType="products-hub") | CORRECT |
| `/products/materials/` | `src/pages/products/materials/index.astro` | SEO_CONFIG | "Materials" | `products-hub` | **Collection** of material entries | CollectionPage + ItemList | CORRECT |
| `/products/industries/` | `src/pages/products/industries/index.astro` | SEO_CONFIG | "Industries" | `products-hub` | **Collection** of industries | CollectionPage + ItemList | CORRECT |
| `/products/capabilities/` | `src/pages/products/capabilities/index.astro` | SEO_CONFIG | "Capabilities" | `products-hub` | **Collection** of capabilities | CollectionPage + ItemList | CORRECT |
| `/products/component-library/` | `src/pages/products/component-library/index.astro` | SEO_CONFIG | "Component Library" | `products-hub` | **Collection** of components | CollectionPage + ItemList | CORRECT |
| `/products/product-entities/` | `src/pages/products/product-entities/index.astro` | SEO_CONFIG | "Component Library" | `products-hub` | **Collection** of 260 product entities | CollectionPage + ItemList | CORRECT |
| `/parts/` | `src/pages/parts/index.astro` | SEO_CONFIG | "Titanium Parts" | `products-hub` ⚠️ | **Collection** of parts | CollectionPage + ItemList (via pageType="products-hub") | **WRONG_PAGE_TYPE** (should be `parts-hub`) |
| `/resources/` | `src/pages/resources.astro` | SEO_CONFIG | "Resources" | `resources` | **Collection** of resources | Org+WebSite+WebPage | **MISSING_SCHEMA** |
| `/tools/` | `src/pages/tools/index.astro` | SEO_CONFIG | "Tools" | `services-hub` ⚠️ | **Collection** of tools | CollectionPage + ItemList (via pageType="services-hub") | **WRONG_PAGE_TYPE** (should be `tools-hub`) |
| `/cookie-policy/`, `/privacy-policy/`, `/terms-of-service/` | (corresponding `*.astro`) | SEO_CONFIG | (legal h1) | `generic` | **Legal** text | Org+WebSite+WebPage | CORRECT |
| `/404/` | `src/pages/404.astro` | inline | "404" | `generic` | — | Org+WebSite+WebPage | CORRECT |

### 3.2 Dynamic Routes (with data source)

| URL pattern | Data source | Template | Page Type | Primary Entity | Current Schema | Status |
|---|---|---|---|---|---|---|
| `/products/product-entities/<slug>/` | `src/content/product-entities/<slug>.json` (260 files) | `src/pages/products/product-entities/[...slug].astro` | `product-detail` (auto-detect) | **Product** (Titanium <X>) | Product + Offer (MadeToOrder→/rfq/) + HowTo + FAQPage (page-level) + Org+Brand+...+WebPage | **CORRECT** (B2B RFQ Offer is real) |
| `/products/<slug>/` | `src/content/products/titanium-cnc-parts.md` (only 1 file) | `src/pages/products/[...slug].astro` | `product-detail` (explicit) | **Product** (Titanium CNC Machined Components) | Product + Offer (MadeToOrder→/rfq/) (via buildPageGraph) + Org+Brand+...+WebPage | **CORRECT** |
| `/blog/<slug>/` | `src/content/blog/<slug>.md` (~40 files en) | `src/pages/blog/[...slug].astro` | `blog-post` (explicit) | **Article** (BlogPosting) | Article (BlogPosting) + Org+Brand+...+WebPage | CORRECT |
| `/[lang]/blog/<slug>/` | same blog collection, multi-locale mirror | `src/pages/[lang]/blog/[...slug].astro` | `blog-post` | **Article** (BlogPosting) | Article + ... | CORRECT |
| `/case-studies/<slug>/` | `src/content/case-studies/<slug>.md` (3 files) | `src/pages/case-studies/[...slug].astro` | `blog-post` ⚠️ | **Article** (currently BlogPosting, should be Article/Report) | Article (BlogPosting) + Org+... | **WRONG_SCHEMA** |
| `/parts/<slug>/` (7 files) | `src/data/parts.ts` PART_PAGES | `src/pages/parts/<slug>.astro` (one per part) | `service-detail` ⚠️ | **Service** (per supplementary JSON-LD) | Service (page-level) + TechArticle + FAQPage + Org+WebSite+WebPage | **WRONG_PAGE_TYPE** |
| `/industries/<slug>/` (10 files: aerospace, ai-infrastructure, chemical, energy, industrial-equipment, marine, medical, semiconductor, uav-drones) | inline per-file | `src/pages/industries/<slug>.astro` | `industry-detail` | **Service** (industry-specific, via serviceName prop) | Service + Org+...+WebPage | CORRECT |
| `/materials/grade-<id>/` (32 files) | `src/content/titanium-grades.ts` | `src/pages/materials/grade-*.astro` | `materials` | **Product** ⚠️ (page-level in GradeStructuredData) | TechArticle + BreadcrumbList + Product ⚠️ + DefinedTerm + FAQPage | **WRONG_SCHEMA** (Product should be DefinedTerm or Service) |
| `/materials/astm-<id>/`, `/materials/iso-<id>/`, `/materials/mil-<id>/`, `/materials/ti-<id>/`, `/materials/ams-<id>/` (15+ files) | `src/data/titanium-standards.ts` STANDARD_DATA | `src/pages/materials/<id>.astro` | `materials` | **Product** ⚠️ | TechArticle + BreadcrumbList + Product ⚠️ + FAQPage | **WRONG_SCHEMA** |
| `/capabilities/<slug>/` (capacity, certifications, engineering, inspection, manufacturing, quality, traceability) | inline per-file | `src/pages/capabilities/<slug>.astro` | `capabilities` | **Capability** (Service per content) | Org+WebSite+WebPage + page-level supplements | **NEEDS_REVIEW** |
| `/equipment/<slug>/` (13 files) | i18n keys | `src/pages/equipment/<slug>.astro` | `generic` ⚠️ | **Equipment** (Product/ProductGroup) | Org+WebSite+WebPage | **WRONG_PAGE_TYPE** + **MISSING_SCHEMA** |
| `/tools/<slug>/` (8 files: cnc-tolerance-checker, gdt-symbol-reference, machining-simulator, reverse-manufacturing-engine, surface-roughness-comparator, titanium-grade-finder, titanium-selection-workflow, titanium-weight-calculator) | inline per-file | `src/pages/tools/<slug>.astro` | `generic` ⚠️ (except machining-simulator which has explicit `generic`) | **SoftwareApplication** or **WebApplication** (utility tool) | Org+WebSite+WebPage | **WRONG_PAGE_TYPE** + **MISSING_SCHEMA** |
| `/titanium-cnc-machining-services/<slug>/` (4 files) | inline per-file | `src/pages/titanium-cnc-machining-services/<slug>.astro` | `service-detail` (auto) | **Service** (CNC service) | Service + Org+... | CORRECT |
| `/titanium-additive-manufacturing/<slug>/` (3 files) | inline | `src/pages/titanium-additive-manufacturing/<slug>.astro` | `service-detail` | **Service** (additive manufacturing) | Service + Org+... | CORRECT |
| `/titanium-fabrication-services/<slug>/` (4 files) | inline | `src/pages/titanium-fabrication-services/<slug>.astro` | `service-detail` | **Service** (fabrication) | Service + Org+... | CORRECT |
| `/titanium-forming-heavy-manufacturing/<slug>/` (4 files) | inline | `src/pages/titanium-forming-heavy-manufacturing/<slug>.astro` | `service-detail` | **Service** (forming) | Service + Org+... | CORRECT |
| `/titanium-surface-treatment/<slug>/` (3 files) | inline | `src/pages/titanium-surface-treatment/<slug>.astro` | `service-detail` | **Service** (surface treatment) | Service + Org+... | CORRECT |
| `/<lang>/products/<slug>/` | `src/content/products/<slug>.md` (multi-locale) | `src/pages/[lang]/products/[...slug].astro` | `product-detail` | **Product** | Product + Offer | CORRECT |
| `/<lang>/services/<slug>/` | i18n keys | `src/pages/[...lang]/services/[...slug].astro` | `service-detail` (explicit) | **Service** | Service | CORRECT |
| `/<lang>/capabilities/<slug>/` (BAK) | (excluded — backup file) | — | — | — | — | — |
| `/<lang>/comparison/<slug>/`, `/<lang>/applications/<slug>/` | inline | `src/pages/[...lang]/<...>/[...slug].astro` | `generic` | varies | Org+WebSite+WebPage | NEEDS_REVIEW |
| `/5-axis-titanium-machining/` | inline + landing components | `src/pages/5-axis-titanium-machining.astro` | `service-detail` | **Service** (5-Axis CNC Machining) | Service + Org+...+WebPage | CORRECT |
| `/as9100-titanium-supplier/` | inline + landing components | `src/pages/as9100-titanium-supplier.astro` | `service-detail` | **Service** (AS9100D supplier) | Service + hasCredential Certification + Org+... | CORRECT |
| `/titanium-machining/` | inline | `src/pages/titanium-machining.astro` | `service-detail` | **Service** (Titanium Machining) | Service + Org+... | CORRECT |
| `/titanium-cnc-machining-manufacturer/` | inline | `src/pages/titanium-cnc-machining-manufacturer.astro` | `service-detail` | **Service** (Manufacturer profile) | Service + Org+... | CORRECT |
| `/branded-custom-packaging-services/` | inline | `src/pages/branded-custom-packaging-services.astro` | `service-detail` | **Service** (packaging) | Service + Org+... | CORRECT |
| `/laser-marking-custom-logo/` | inline | `src/pages/laser-marking-custom-logo.astro` | `service-detail` | **Service** (laser marking) | Service + Org+... | CORRECT |

### 3.3 Multi-Locale Mirror

Every page above is mirrored across 12 languages via `src/i18n/` + `[lang]` dynamic prefix.
The schema.org output is the **same entity graph** per page; only `inLanguage` changes.
Same Status applies to all language variants.

---

## 4. Entity Inventory

### 4.1 Single-Source-of-Truth Entity Identities (`src/lib/schema.ts:26–42`)

| Identity | @id | @type | Source | Notes |
|---|---|---|---|---|
| Legal Org | `https://www.bozemetal.com/#organization` | Organization | `buildOrganization()` | "Baoji Boze Metal Products Co., Ltd." |
| Corporate Brand | `https://www.bozemetal.com/#brand-boze-metal` | Brand | `buildBrands()` | "BOZE Metal" |
| Commercial Brand | `https://www.bozemetal.com/#brand-boze-cnc-ti` | Brand | `buildBrands()` | "BOZE CNC Ti", `parentBrand: #brand-boze-metal` |
| Manufacturing Center | `https://cnc.bozemetal.com/#manufacturing-center` | Organization | `buildManufacturingCenter()` | "Boze Titanium Manufacturing Center", `parentOrganization: #organization`, `brand: #brand-boze-cnc-ti` |
| WebSite | `https://cnc.bozemetal.com/#website` | WebSite | `buildWebSite()` | publisher → #organization |
| Logo | `https://cnc.bozemetal.com/#boze-logo` | ImageObject | `buildImageObject()` | |

**Note (schema.ts:33):** `cnc.bozemetal.com/#organization` is **deliberately not defined** —
the manufacturing center is not a separate legal entity.

### 4.2 Entity Duplication Issues

| Entity name | Defined at | Issue |
|---|---|---|
| "BOZE Titanium Manufacturing Center" | `src/pages/parts/titanium-cnc-parts.astro:20-23` (anonymous, no @id) | 12-language mirror × 1 part-detail page = **13 anonymous Organization nodes** that duplicate the canonical `#manufacturing-center` |
| "BOZE Metal" / "BOZE CNC Ti" / "BOZE" | `buildOrganization().alternateName` | Brand names are duplicated as `alternateName` of the Legal Org, in addition to the canonical Brand entities |
| "Custom Titanium CNC Parts" (Product) on `/services/` | `src/pages/services.astro:41` + schema.ts:894-903 | Same conceptual entity appears as both **Service** (`Titanium CNC Manufacturing Services`) and **Product** (`Custom Titanium CNC Parts`) on the same page — competing primary entities |
| "Titanium Manufacturing Services" (Service) on `/services/` | `src/pages/services.astro:36` (via buildService) | Used in 1 hub page; conceptually distinct from "Titanium CNC Manufacturing Services" but currently merged via pageType="services-hub" + serviceName |

### 4.3 Content Collections as Entity Sources

| Collection | Path | Items | Drives Page Type |
|---|---|---|---|
| `product-entities` | `src/content/product-entities/*.json` | 260 | `product-detail` (per product entity) |
| `products` | `src/content/products/*.md` | 1 | `product-detail` (legacy) |
| `product-specs` | `src/content/product-specs/*.md` | 260 | (sidecar spec for product entities) |
| `product-translations` | `src/content/product-translations/*` | varies | (i18n strings) |
| `materials` | `src/content/materials/*.json` | 20 | `materials` (via data/titanium-grades.ts adapter) |
| `standards` | `src/content/standards/*` | (data) | `materials` (via data/titanium-standards.ts adapter) |
| `industries` | `src/content/industries/*.json` | 12 | `industry-detail` (inline per file) |
| `systems` | `src/content/systems/*.json` | 60 | (referenced by `/products/systems/`) |
| `capabilities` | `src/content/capabilities/*.json` | 445 | (referenced by `/products/capabilities/`) |
| `case-studies` | `src/content/case-studies/*.md` | 3 | `case-studies` (hub) + `blog-post` ⚠️ (detail) |
| `blog` | `src/content/blog/*.md` | ~70 en + translations | `blog-index` + `blog-post` |
| `pages` | `src/content/pages/*` | varies | (page metadata) |

---

## 5. Schema Generation Source Tree

### 5.1 The Single Global Schema Pipeline

```text
src/pages/*.astro
  └─ <BaseLayout ...>
       └─ src/layouts/BaseLayout.astro
            ├─ detectPageType(canonicalPath, explicitPageType)   [schema.ts:623]
            ├─ resolve props → schemaData object                  [BaseLayout.astro:200–213]
            ├─ buildPageGraph(pageType, schemaData)                [schema.ts:798]
            │    ├─ [always] buildOrganization()                  → 1 Organization
            │    ├─ [always] buildBrands()                        → 2 Brand
            │    ├─ [always] buildManufacturingCenter()           → 1 Organization
            │    ├─ [always] buildImageObject()                    → 1 ImageObject
            │    ├─ [always] buildWebSite()                        → 1 WebSite
            │    ├─ [always] buildWebPage(...)                    → 1 WebPage
            │    ├─ [opt]    buildBreadcrumbList(...)              → 0 or 1 BreadcrumbList
            │    ├─ [opt]    buildFaqPage(...)                     → 0 or 1 FAQPage
            │    ├─ [opt]    buildHowTo(...)                       → 0 or 1 HowTo
            │    ├─ [opt]    buildComparisonList(...)              → 0 or 1 ItemList (comparison)
            │    └─ [switch pageType]:
            │         ├─ services-hub / products-hub / blog-index / case-studies:
            │         │    ├─ buildCollectionPage(...)             → 0 or 1 CollectionPage
            │         │    ├─ buildItemList(...)                  → 0 or 1 ItemList
            │         │    └─ [services-hub only]:
            │         │         ├─ buildService(...)              → 0 or 1 Service
            │         │         ├─ buildProduct(...)              → 0 or 1 Product  ⚠️
            │         │         └─ buildArticle(...)              → 0 or 1 Article
            │         ├─ service-detail / industry-detail:
            │         │    └─ buildService(...)                   → 0 or 1 Service
            │         ├─ product-detail:
            │         │    └─ buildProduct(...)                   → 0 or 1 Product
            │         └─ blog-post:
            │              └─ buildArticle(...)                   → 0 or 1 Article (BlogPosting)
            └─ <script type="application/ld+json">{ldJson}</script>  [BaseLayout.astro:265]
```

### 5.2 Page-Level Inline JSON-LD Blocks (NOT routed through schema.ts)

| File | @types emitted | Drives |
|---|---|---|
| `src/components/materials/GradeStructuredData.astro:50-99` | `TechArticle`, `BreadcrumbList`, **`Product`**, `DefinedTerm`, `FAQPage` | materials grade pages (~390 HTML) |
| `src/components/materials/StandardStructuredData.astro:38-106` | `TechArticle`, `BreadcrumbList`, **`Product`**, `FAQPage` | materials standard pages (~195 HTML) |
| `src/components/ComparisonTable.astro:63-83` | `ItemList` (items contain inline `@type: Product` reference) | comparison tables across site |
| `src/pages/rfq.astro:31-76` | `Service` (ManufacturingPlant provider), `OfferCatalog` (2 Offers) | `/rfq/` (12 langs) |
| `src/pages/parts/titanium-cnc-parts.astro:10-51` | `Service` (anonymous Org), `TechArticle`, `FAQPage` | `/parts/titanium-cnc-parts/` (12 langs) |
| `src/pages/products/product-entities/[...slug].astro:127-171` | **`Product`**, `Offer` (MadeToOrder→/rfq/), `HowTo`, `FAQPage` | 260 product entity pages × 12 langs |

---

## 6. Offer Schema Inventory (every Offer across site)

| # | Source | Parent @type | Offer URL | price | priceCurrency | availability | itemCondition | seller @id | itemOffered | Status |
|---|---|---|---|---|---|---|---|---|---|---|
| 1 | `schema.ts:546-564` (rfqUrl branch, current default) | Product | `${SITEROOT}/rfq/` | — | — | `https://schema.org/MadeToOrder` | `https://schema.org/NewCondition` | `#organization` | Product@id | CORRECT (no fabricated price) |
| 2 | `schema.ts:546-564` (price branch, no current caller) | Product | `${input.url}` | `input.price` | `USD` | `https://schema.org/InStock` | `https://schema.org/NewCondition` | `#organization` | Product@id | (no live caller) |
| 3 | `product-entities/[...slug].astro:142-150` (page-level) | Product | `${SITEROOT}/rfq/` | — | — | `https://schema.org/MadeToOrder` | `https://schema.org/NewCondition` | `#organization` | Product@id | CORRECT |
| 4 | `rfq.astro:57-72` (OfferCatalog ×2) | Service | — | — | — | — | — | — | Service | CORRECT (itemOffered=Service) |

**Confirmed:** No fabricated price, priceCurrency, review, aggregateRating, or availability.

---

## 7. Distribution (per Phase 0 dist audit)

```text
Total HTML pages scanned:       2319
Pages with @type: Product:      647
  ├── by dist-page-type (audit script classification):
  │     ├── other (materials multi-locale mirrors):    385  ← 91% are wrong-type
  │     ├── product-entity (260 components):           260  ← correct
  │     ├── product-detail-legacy:                       1  ← correct
  │     └── services-hub:                                1  ← wrong-type
```

---

## 8. Status Legend

| Status | Meaning |
|---|---|
| `CORRECT` | Page type, primary entity, and schema type are aligned. |
| `WRONG_SCHEMA` | Schema `@type` does not match the page's primary entity (e.g. Material page emits Product). |
| `WRONG_ENTITY` | Page has multiple competing primary entities (e.g. `/services/` declares both Service and Product). |
| `WRONG_PAGE_TYPE` | `pageType` value does not match the page's actual role (e.g. `/parts/*` as `service-detail`). |
| `DUPLICATE_ENTITY` | Same conceptual entity is defined twice with different `@type` or no `@id` linking. |
| `MISSING_SCHEMA` | Page role warrants a schema entity that is not emitted (e.g. Equipment detail page has no Equipment/Product entity). |
| `AMBIGUOUS` | Source code or content is unclear; manual review required. |
| `NEEDS_REVIEW` | Status borderline; requires ChatGPT governance matrix decision. |
| `PENDING` | Audit pending; no data yet. |

---

## 9. Files Created

This Phase 1 audit created only:

- `docs/schema-audit/page-schema-inventory.md` (this file)
- `docs/schema-audit/schema-issues.md` (companion file)

**No code, schema, JSON-LD, entity data, URL, canonical, or product entity was modified.**