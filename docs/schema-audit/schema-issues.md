# Boze Schema Issues — Severity-ranked Catalog

> **Generated:** 2026-09-12
> **Phase:** 1 — Read-only audit (no code modified)
> **Author:** Cline (MiniMax M3)
> **Companion file:** `docs/schema-audit/page-schema-inventory.md`
> **Reference:** `tasks/audit-report.json` (647 Product entities × 2319 HTML pages)

---

## ⚠️ Important Note on GSC Warnings

**Google Search Console warnings are NOT necessarily semantic-architecture errors.**

Many of the issues below affect **GSC "Product structured-data enhancement"** warnings
(5 fields: review, aggregateRating, price, priceCurrency, availability). These warnings
fire *because* the page declares `@type: Product` and Google then expects retail-product
fields. The root cause is often **wrong `@type` declaration** (e.g. material page
declaring `Product`), not field omission.

**Phase 2 must fix the type, not fabricate the field.** Adding fake `price: "0"` or
fake `aggregateRating` would constitute schema spam and is explicitly out of scope.

---

## P0 — Critical: Primary entity misidentification

These cause Google to fundamentally mis-classify the page. Resolution requires
changing `@type` or removing the mis-declared entity.

### P0-1 — `/services/` declares both Service AND Product as primary entity

- **URL pattern:** `/services/` (all 12 locales)
- **Source chain:**
  1. `src/pages/services.astro:41` defines `productName = 'Custom Titanium CNC Parts'`
  2. `src/pages/services.astro:74-77` passes `productName`, `productCategory`, `productRfqUrl` to `<BaseLayout>`
  3. `src/lib/schema.ts:894-903` (services-hub branch of `buildPageGraph`) calls `buildProduct({ name: data.productName, ..., rfqUrl: data.productRfqUrl })`
  4. `src/lib/schema.ts:530-588` (`buildProduct`) emits a Product entity with `@id: ${input.url}#product`
- **Concrete evidence:** `dist/services/index.html` line 1 of the Product entity: `"@type":"Product"`, `"name":"Custom Titanium CNC Parts"`
- **Why it matters:** Google receives two competing primary entities on the same page:
  - Service entity `name: "Titanium CNC Manufacturing Services"` (correct)
  - Product entity `name: "Custom Titanium CNC Parts"` (wrong — hub does not sell a single SKU)
- **GSC effect:** Fires Product enhancement warning (5 fields missing).
- **Affected pages:** 1 (× 12 locales)
- **Recommended fix (do NOT execute in Phase 1):** Remove `productName`/`productCategory`/`productRfqUrl` props from `src/pages/services.astro`; remove the `buildProduct` call in `schema.ts:894-903`. Hub becomes a clean Service + CollectionPage + ItemList + Article + FAQPage + HowTo.

### P0-2 — Materials `grade-*` and `standard-*` pages declare `@type: Product` with service-shaped names

- **URL pattern:** `*/materials/grade-<id>/` (× 12 locales), `*/materials/astm-<id>/`, `*/materials/iso-<id>/`, `*/materials/mil-<id>/`, `*/materials/ti-<id>/`, `*/materials/ams-<id>/` (× 12 locales)
- **Source chain:**
  1. `src/pages/materials/grade-*.astro` imports `<GradeStructuredData>` from `src/components/materials/`
  2. `src/components/materials/GradeStructuredData.astro:81-89` (inside `<script type="application/ld+json">`):
     ```js
     {
       '@type': 'Product',
       '@id': canonicalURL + '#product',
       url: canonicalURL,
       name: `${grade.name} Titanium Precision Machining Services`,  // ← "Services" in the name
       description: grade.sub,
       brand: { '@id': brandId, name: 'BOZE CNC Ti' },
       manufacturer: { '@id': orgId, name: orgName },
     }
     ```
  3. Same pattern in `src/components/materials/StandardStructuredData.astro:82-99` with name `"${standard.name} Titanium Precision Machining Services"`.
- **Concrete evidence:** `dist/materials/grade-5/index.html` (block #2) Product entity:
  - `@id: https://cnc.bozemetal.com/materials/grade-5/#product`
  - `@type: Product`
  - `name: Grade 5 – Ti-6Al-4V Titanium Alloy Titanium Precision Machining Services`
- **Why it matters:**
  - Page content describes a **material specification** (chemical composition, mechanical properties, applications) — that is a `DefinedTerm` or `ProductGroup` or `Service` entity, **not** a sellable Product.
  - The `name` literally ends with "Services" while the `@type` says "Product" — Google receives an internally inconsistent signal.
  - 195 grade pages × 12 locales = ~2340 HTML pages misclassified.
- **GSC effect:** Every materials page fires Product enhancement warnings.
- **Affected pages:** ~385 (per `audit-report.json` byPageType other = 385)
- **Recommended fix:** Replace `@type: Product` with `@type: DefinedTerm` (for the material entity itself) and ensure the surrounding page already declares TechArticle. The service-shaped naming suggests the *intent* was Service; treat the entity as "Titanium Precision Machining **Service** for [material]" rather than "Product".

### P0-3 — `/services/` → Service hub content vs. Product entity name collision

- **URL pattern:** `/services/` (12 locales)
- **Source chain:** Same as P0-1.
- **Why it's separate from P0-1:** The collision is not just a wrong entity — it's also a semantic name conflict. The Service is named `"Titanium CNC Manufacturing Services"` (correct) and the Product is named `"Custom Titanium CNC Parts"` (incorrect name for a hub).
- **Recommended fix:** After removing the Product entity, no residual conflict. Hub's primary entity becomes Service (Titanium CNC Manufacturing Services).

---

## P1 — Significant: Wrong `@type` for page role

### P1-1 — `/case-studies/<slug>/` declared as `blog-post`

- **URL pattern:** `/case-studies/aerospace-thin-wall-housing/`, `/case-studies/medical-bone-screws/`, `/case-studies/semiconductor-uhv-showerhead/` (× 12 locales)
- **Source chain:**
  1. `src/pages/case-studies/[...slug].astro:43` sets `pageType="blog-post"`
  2. `src/lib/schema.ts:944-959` emits `Article` with `articleType: 'BlogPosting'`
- **Why it matters:**
  - Markdown content (`src/content/case-studies/*.md`) uses `data.type === 'case-study'` or `'manufacturing-example'` (per `case-studies/[...slug].astro:29-30`).
  - Page UI renders "Verified Case Study" or "Manufacturing Example" badges.
  - Google receives `BlogPosting` for what is a procurement evidence / engineering case study.
  - Schema.org BlogPosting is restricted to actual blog content per Google's structured-data documentation.
- **Recommended fix:** Add a new `case-study` pageType or reuse generic `blog-post` but pass `articleType: 'Article'` (non-BlogPosting). The Article entity is otherwise valid; only the subtype is wrong.

### P1-2 — `/parts/<slug>/` declared as `service-detail` with page-level Service JSON-LD

- **URL pattern:** `/parts/titanium-cnc-parts/`, `/parts/titanium-fabricated-parts/`, `/parts/titanium-pipe-components/`, `/parts/titanium-marine-parts/`, `/parts/titanium-uav-components/`, `/parts/titanium-motorsport-parts/`, `/parts/titanium-medical-components/` (× 12 locales)
- **Source chain:**
  1. `src/pages/parts/<slug>.astro:56` sets `pageType="service-detail"`
  2. `src/pages/parts/<slug>.astro:57` passes `serviceName={data.heroH1}` to `<BaseLayout>`
  3. `src/pages/parts/<slug>.astro:10-51` injects supplementary JSON-LD with `Service` (and an anonymous `Organization` provider)
  4. `src/lib/schema.ts:918-928` (service-detail branch) calls `buildService({ name: serviceName })`
- **Why it matters:**
  - The page UI and content are B2B **part procurement** detail pages (parts catalog).
  - They are declared as `Service` (manufacturing service), not as `Product` (the part being purchased).
  - Anonymous Organization node at line 20-23 (`name: 'BOZE Titanium Manufacturing Center'`, no `@id`) duplicates `#manufacturing-center`.
- **Recommended fix:**
  - Either declare them as `product-detail` (since the part is the primary entity being procured) or add a new `part-detail` pageType.
  - Remove the anonymous Organization node; reference `#organization` or `#manufacturing-center` by `@id`.
  - The supplementary JSON-LD's `Service` entity can stay if it's reframed as the manufacturing service backing the part procurement.

### P1-3 — `/parts/` (hub) declared as `products-hub`

- **URL pattern:** `/parts/` (× 12 locales)
- **Source chain:**
  1. `src/pages/parts/index.astro` sets `pageType="products-hub"`
- **Why it matters:** Parts hub lists 7 part categories (titanium-cnc-parts, titanium-fabricated-parts, etc.). These are `Part` entities (a subtype of Product), but they're categorized separately from the products hub for procurement intent.
- **Recommended fix:** Rename to `parts-hub` for clarity. Currently works because the page does emit a CollectionPage + ItemList, so functional behavior is correct; only the semantic name is wrong.

### P1-4 — `/tools/` (hub) declared as `services-hub`

- **URL pattern:** `/tools/` (× 12 locales)
- **Source chain:**
  1. `src/pages/tools/index.astro` sets `pageType="services-hub"`
- **Why it matters:** The tools hub is a list of interactive calculators (`titanium-weight-calculator`, `titanium-grade-finder`, etc.). These are not services — they are utilities (`WebApplication` or `SoftwareApplication`).
- **Recommended fix:** Use a new `tools-hub` pageType. No semantic content is currently injected because `serviceName` is not passed, so removing the wrong label has no functional side effect.

### P1-5 — `/equipment/<slug>/` declared as `generic` (13 detail pages)

- **URL pattern:** `/equipment/cmm/`, `/equipment/wire-edm/`, `/equipment/turn-mill-cnc/`, `/equipment/5-axis-machining-center/`, `/equipment/anodizing-surface-treatment/`, `/equipment/automatic-bar-feeder/`, `/equipment/automatic-tool-magazine/`, `/equipment/chip-management-fire-suppression/`, `/equipment/high-pressure-coolant/`, `/equipment/laser-tracker-3d-scanner/`, `/equipment/robotic-pallet-system/`, `/equipment/tool-presetter/`, `/equipment/vacuum-heat-treat-furnace/` (× 12 locales)
- **Source chain:** No explicit `pageType=` is set; auto-detect falls through to `generic` because `/equipment` is not in the detection map (schema.ts:626-637).
- **Why it matters:** Equipment detail pages describe real manufacturing equipment (CMM, Wire EDM, etc.). These are `Product` entities (industrial equipment) or `ProductGroup`/`IndividualProduct` subtypes. Currently they emit only the 7-entity baseline graph (Org + Brand + ... + WebPage) with no equipment-specific schema.
- **Recommended fix:** Add `equipment` and `equipment-detail` pageTypes; emit a `Product` entity with appropriate `category` (e.g., `Industrial Metrology Equipment`) and `manufacturer` (the Brand or the parent Org).

### P1-6 — `/tools/<slug>/` declared as `generic` (8 utility pages)

- **URL pattern:** `/tools/cnc-tolerance-checker/`, `/tools/gdt-symbol-reference/`, `/tools/machining-simulator/`, `/tools/reverse-manufacturing-engine/`, `/tools/surface-roughness-comparator/`, `/tools/titanium-grade-finder/`, `/tools/titanium-selection-workflow/`, `/tools/titanium-weight-calculator/` (× 12 locales)
- **Source chain:** No explicit `pageType=` (or explicit `generic` for `machining-simulator`).
- **Why it matters:** These are interactive engineering tools. The correct Schema.org type is `WebApplication` (with `applicationCategory: 'EngineeringTool'` or `applicationSubCategory`).
- **Recommended fix:** Add `tool-detail` pageType; emit a `WebApplication` entity.

---

## P2 — Entity @id and relationship inconsistency

### P2-1 — Anonymous Organization node on `/parts/titanium-cnc-parts/`

- **URL pattern:** `/parts/titanium-cnc-parts/` (× 12 locales)
- **Source:** `src/pages/parts/titanium-cnc-parts.astro:10-26`
- **Concrete:** The page-level supplementary JSON-LD declares:
  ```js
  {
    '@type': 'Service',
    provider: {
      '@type': 'Organization',                  // ← anonymous, no @id
      name: 'BOZE Titanium Manufacturing Center', // ← duplicates #manufacturing-center name
      url: SITE,
    },
  }
  ```
- **Why it matters:** Every page in the site already emits `#organization` (Legal Org) and `#manufacturing-center` via `buildOrganization()` + `buildManufacturingCenter()`. Adding an anonymous Organization is a duplicate that Google cannot dedupe because no `@id` is provided.
- **Recommended fix:** Replace with `{ `@id`: MANUFACTURING_CENTER_ID }` or `{ `@id`: ORG_ID }`.

### P2-2 — `buildOrganization().alternateName` includes Brand names

- **Source:** `src/lib/schema.ts:91`
- **Concrete:**
  ```js
  alternateName: ['BOZE Metal', 'BOZE CNC Ti', 'BOZE'],
  ```
- **Why it matters:** The Legal Org already has Brand nodes (`#brand-boze-metal`, `#brand-boze-cnc-ti`) emitted on every page. Putting Brand names in Org.alternateName is redundant and can confuse LLM crawlers trying to resolve which node is canonical for "BOZE Metal".
- **Recommended fix:** Either remove the Brand names from `alternateName`, OR mark this as intentional (the Org is the parent of both Brands — the alias is for the corporate trade name). At minimum, document the choice.

### P2-3 — `ComparisonTable.astro` re-declares inline `@type: Product` on ListItem items

- **Source:** `src/components/ComparisonTable.astro:75`
- **Concrete:**
  ```js
  itemListElement: itemList.items.map((it, i) => ({
    '@type': 'ListItem',
    position: i + 1,
    item: { '@id': it['@id'], '@type': 'Product', name: it.name },  // ← inline re-declaration
  })),
  ```
- **Why it matters:** `src/lib/schema.ts:491-495` already warns: "Do NOT re-declare @type / name / description inline — Google treats inline re-declarations as a Product owned by the host page and complains about missing offers/review/aggregateRating on a page that is actually a BlogPosting."
- **ComparisonTable.astro` violates this warning.**
- **Recommended fix:** Drop the inline `@type` and `name`; keep only `{ '@id': it['@id'] }`.

### P2-4 — Product Entity page-level Offer duplicates `buildProduct()` semantics

- **Source:** `src/pages/products/product-entities/[...slug].astro:127-160` (Product entity) + `:142-150` (Offer)
- **Why it matters:** The page-level Product + Offer block emits a Product entity that does NOT pass through `buildProduct()` in `schema.ts:530-588`. The two are structurally aligned today (both use `#organization` seller, both use MadeToOrder → `/rfq/`), but they could drift independently. A future schema.ts change to `buildProduct()` would not propagate to these 260 pages.
- **Recommended fix:** Refactor `buildProduct()` to expose a pure JSON object (already does — no side effects), then call it from both `schema.ts:buildPageGraph` AND `product-entities/[...slug].astro`. Reduces 2 implementation paths to 1.

---

## P3 — Field-level / Google warning / optimization items

### P3-1 — Product Entity Offer uses `availability: 'https://schema.org/MadeToOrder'`

- **Affected pages:** ~3380 (260 product entities × 12 locales + 1 legacy product-detail × 12 locales = 3252, plus 1× parts/titanium-cnc-parts if any)
- **GSC message:** "字段 'availability' 中的枚举值无效" (severity: non-critical)
- **Schema.org note:** `MadeToOrder` IS a valid `schema.org/ItemAvailability` enum value. Google Search Console's rich-result tester treats it as invalid for the `Offer.availability` property.
- **Recommended action:** Document the deliberate choice. Two acceptable paths:
  - **(A)** Keep current value — schema.org valid, semantic intent (custom manufacturing) is correct.
  - **(B)** Add `availabilityStarts` + `priceSpecification` to anchor the Offer as a true RFQ (no fixed availability date) rather than retail stock.
- **Red line:** Do NOT fabricate `availability: 'https://schema.org/InStock'` (would be a lie).

### P3-2 — `/materials/`, `/capabilities/`, `/equipment/`, `/industries/`, `/resources/`, `/products/` (root) lack explicit CollectionPage entity

- **Source:** Auto-detected pageTypes (`materials`, `capabilities`, `industries`, `resources`, `generic`) hit the `default` branch of `buildPageGraph` (schema.ts:962-966) which emits only the baseline 7-entity graph.
- **Why it matters:** These are hub pages that list sub-entities (materials, equipment, etc.). They should emit a CollectionPage + ItemList (like `/products/systems/` does via explicit `pageType="products-hub"` + `collectionName`/`items` props).
- **Recommended fix:** Add `collectionName` and `items` props to these hub pages, OR add new pageTypes (`materials-hub`, `capabilities-hub`, etc.) that auto-emit CollectionPage.

### P3-3 — `/products/capabilities/` and similar inner hub pages use `pageType="products-hub"` semantically

- **Affected pages:** `/products/systems/`, `/products/materials/`, `/products/industries/`, `/products/capabilities/`, `/products/component-library/`, `/products/product-entities/`
- **Why it matters:** All six are product-related but each sub-hub actually aggregates a different entity type (systems, material entries, industries, capabilities, components, product-entities). They are all currently labeled `products-hub` for lack of finer-grained pageTypes.
- **Recommended fix:** Either accept the over-broad `products-hub` (functionally correct) or introduce finer types (`systems-hub`, `materials-hub`, etc.).

### P3-4 — Equipment / Tools detail pages emit no equipment- or tool-specific entity

- **Affected pages:** 13 × 12 = 156 (equipment) + 8 × 12 = 96 (tools) = 252 pages
- **Recommended fix:** See P1-5, P1-6.

### P3-5 — RichEntityContent / LegacyEntityContent / SemanticClosedLoop / EquipmentEntityDefinition components do not directly emit JSON-LD

- **Source:** `src/components/product/RichEntityContent.astro`, `LegacyEntityContent.astro`, `SemanticClosedLoop.astro`, `EquipmentEntityDefinition.astro`
- **Why it matters:** These component names suggest they emit structured data, but only `ComparisonTable.astro` and the two `*StructuredData.astro` files do. The others are body-content composition layers.
- **Recommended fix:** No action; verified via `grep -l "@type" src/components/` returning only 3 files (ComparisonTable, GradeStructuredData, StandardStructuredData).

### P3-6 — Two spelling variants of "Boze Titanium Manufacturing Center"

- **Source A:** `src/lib/schema.ts:152` `buildManufacturingCenter().name = 'Boze Titanium Manufacturing Center'` (lowercase "Boze")
- **Source B:** `src/pages/parts/titanium-cnc-parts.astro:21` anonymous provider `name = 'BOZE Titanium Manufacturing Center'` (all-caps "BOZE")
- **Source C:** `src/lib/schema.ts:163` `buildWebSite().name = 'Boze Titanium Manufacturing Center'` (matches A)
- **Recommended fix:** Pick one capitalization and apply consistently. "Boze" (sentence case) appears to be the chosen brand standard based on majority usage in components.

### P3-7 — No 410 / sitemap / noindex handling for case-study / manufacturing-example distinction

- **Source:** `src/pages/case-studies/[...slug].astro:29-30` distinguishes via `data.type === 'case-study'`, but the JSON-LD emitted (`Article` with `articleType: 'BlogPosting'`) is the same for both.
- **Recommended fix:** Either accept both as "Article" (drop the verified/unverified distinction in schema), or differentiate via `Article.provenance` or a `ClaimReview`-like pattern.

---

## Cross-cutting risks

### R1 — `tasks/audit-report.json` is a snapshot, not live

The dist directory may have been rebuilt after Phase 0 ran. The `byPageType` counts (385/260/1/1) and the verdict counts (REMOVE_OFFER_OR_KEEP 384) were captured at one moment. Before Phase 2 begins, re-run `node tasks/audit_product_pages.mjs` to refresh.

### R2 — Schema.ts is the single global pipeline

Every schema fix in Phase 2 will go through one of these files:

- `src/lib/schema.ts` (pageType detection, builders, switch cases)
- `src/layouts/BaseLayout.astro` (prop forwarding)
- Individual page files (`src/pages/*.astro` — props, inline JSON-LD)
- Component files (`src/components/**/*.astro` — inline JSON-LD blocks)

There is no separate registry, builder framework, or class hierarchy. Single-file edits are sufficient. **Risk:** any edit to `buildPageGraph` switch cases affects ALL pages using that pageType.

### R3 — Multi-locale mirror (×12)

Every HTML page exists in up to 12 language variants. The schema entity graph is structurally identical across locales; only `inLanguage` and translated string fields change. Fixes to one locale propagate via the source template.

---

## Summary counts

| Severity | Count | Affected HTML |
|---|---|---|
| P0 | 3 distinct issues | ~387 pages |
| P1 | 6 distinct issues | ~245 pages |
| P2 | 4 distinct issues | ~270 pages + 13 anon Org nodes |
| P3 | 7 distinct issues | ~2500+ pages |
| Cross-cutting | 3 risks | site-wide |

---

## What Phase 1 did NOT do (red lines observed)

- ❌ Did not modify any code, schema, JSON-LD, Entity JSON, URL, canonical, or product entity.
- ❌ Did not fabricate price / priceCurrency / review / aggregateRating / availability to silence GSC.
- ❌ Did not add fake fields to make `Product` enhancement warnings go away.
- ❌ Did not invent page types — only flagged potential new ones (`case-study`, `part-detail`, `parts-hub`, `tools-hub`, `equipment-detail`, `tool-detail`, `legal-page`).
- ❌ Did not create or delete any dist files.

Phase 2 should be executed only after ChatGPT produces the **Page Type → Entity Type → Schema Governance Matrix** based on this audit.