# mentions.ts — Page-level entity mentions for JSON-LD

> Pure builder functions that read the canonical frontmatter schema
> for products / capabilities / industries and return an array of
> entity IDs (`"<category>:<slug>"`) suitable for `WebPage.mentions`.

**Status:** F3.2 — extracted from `entity-graph.ts` (2026-08-25).
**Owner:** SEO / schema-engineering track.
**License:** MIT (project default).

---

## 1. Why this module exists

`WebPage.mentions` lets the JSON-LD payload reference other entity URIs
that a page is about. For a product detail page those are typically:

- the **industry** the product serves,
- the **material** it is made from,
- the **application / system** it lives inside,
- the **process** used to manufacture it,
- the **standard** it complies with.

This module encapsulates the "frontmatter → entity IDs" mapping in one
auditable place. The mapping is:

- **Strict** — only the canonical fields listed in §3 are read; no silent
  fallbacks across alternative field names.
- **Type-safe** — each builder accepts a typed interface that mirrors the
  source schema; the TypeScript compiler flags the call site if a
  field is renamed or removed.
- **Deterministic** — for the same input the same output, in stable order.

---

## 2. Public API

```ts
import {
  mentionsForProduct,
  mentionsForCapability,
  mentionsForIndustry,
  type ProductData,
  type CapabilityData,
  type IndustryData,
} from '@/lib/mentions';

const ids = mentionsForProduct(productFrontmatter, currentProductId, 12);
```

| Builder                | Caller            | Reads                       | Resolves to                |
| ---------------------- | ----------------- | --------------------------- | -------------------------- |
| `mentionsForProduct`   | product detail    | `ProductData`               | `industry`, `material`, `application`, `process`, `standard` |
| `mentionsForCapability`| capability detail | `CapabilityData`            | `industry`, `material`, `application`, `standard` |
| `mentionsForIndustry`  | industry detail   | `IndustryData`              | `application`              |

All builders:

- return a `string[]` of entity IDs,
- deduplicate by ID,
- exclude the page's own ID (`currentProductId` etc.),
- clamp to the optional `cap` (default 12),
- return `[]` on empty / null / non-object input.

---

## 3. Canonical input schema

The builders read **exactly** the following fields. No others.

### Product (`src/content/product-entities/*.json`, 260 files)

| Field                 | Type     | Resolver          | Target category |
| --------------------- | -------- | ----------------- | --------------- |
| `industry`            | string   | fuzzy             | `industry`      |
| `relatedIndustries`   | slug[]   | **exact**         | `industry`      |
| `material`            | string   | fuzzy             | `material`      |
| `system`              | string   | fuzzy             | `application`   |
| `process`             | string[] | fuzzy             | `process`       |
| `standards`           | string[] | fuzzy             | `standard`      |
| `relatedCapabilities` | slug[]   | **exact**         | `process`       |

### Capability (`src/content/capabilities/*.json`, 445 files)

| Field                | Type     | Resolver | Target category |
| -------------------- | -------- | -------- | --------------- |
| `industries`         | slug[]   | **exact**| `industry`      |
| `materials`          | string[] | fuzzy    | `material`      |
| `typicalApplications`| string[] | fuzzy    | `application`   |
| `qualityStandards`   | string[] | fuzzy    | `standard`      |

### Industry (`src/content/industries/*.json`, 12 files)

| Field          | Type     | Resolver | Target category |
| -------------- | -------- | -------- | --------------- |
| `applications` | string[] | fuzzy    | `application`   |
| `systems`      | string[] | fuzzy    | `application`   |

> **Important:** Industry pages have NO `materials`, `process`, or
> `standards` fields. The `mentionsForIndustry` builder does not consult
> any such fields; if a future schema adds them, extend the builder
> here rather than adding silent fallbacks.

### Why two resolvers?

- **Display strings** (`material: "Grade 5 Ti-6Al-4V"`) are matched
  fuzzily against `entity.canonical_name` and `entity.aliases`. This is
  how we tolerate editorial variation.
- **Slug arrays** (`relatedIndustries: ["consumer-electronics"]`) are
  identifiers — they MUST match exactly, against `entity.slug` or
  `entity._source_slug`. Fuzzy matching here would produce wrong IDs
  (e.g. matching "cnc-milling" to "cnc-milling-of-ergonomic-contours").

---

## 4. Scoring algorithm (display strings)

For each `value` and candidate `entity`, three acceptance levels:

| Score | Meaning                                                                |
| ----- | ---------------------------------------------------------------------- |
| 100   | Exact normalized match between `value` and `canonical_name`/alias.    |
| 90    | Substring match: one is contained in the other (min length 8).         |
| 70    | Token-Jaccard ≥ 0.7 (after stripping stop tokens < 3 chars).            |
| < 70  | Rejected.                                                              |

Normalization lowercases, expands `&` → `and`, strips punctuation,
collapses whitespace. The first hit with score ≥ 70 wins; ties broken
by registry order.

---

## 5. Integration

```astro
---
// src/pages/products/[...slug].astro
import { getEntry } from 'astro:content';
import { mentionsForProduct } from '@/lib/mentions';

const entry = await getEntry('product-entities', params.slug);
const mentions = mentionsForProduct(entry.data, `product:${entry.slug}`, 12);
const mentionsRefs = mentions
  .map((id) => getEntityRef(id))
  .filter(Boolean); // -> Thing[] | unknown[]
---
<script type="application/ld+json" set:html={JSON.stringify({
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  mentions: mentionsRefs,
})} />
```

`getEntityRef(id)` lives in `entity-graph.ts` and returns the canonical
schema.org `Thing` shape that `WebPage.mentions` expects.

---

## 6. Validation

```bash
npx tsx scripts/test-mentions.mts
```

27 assertions across 11 sections (preflight, builders, slug resolution,
fuzzy resolution, non-canonical-field rejection, determinism, gibberish
filter, self-exclusion, cap, coverage). Sample data is loaded from
`src/content/product-entities/`, `src/content/capabilities/`, and
`src/content/industries/`.

Dangling slugs (slugs in `relatedIndustries` / `relatedCapabilities`
that don't match any registry entity) are surfaced as informational
findings, NOT as test failures. They indicate real data-quality issues
to fix in the source JSON, separate from the builder correctness.

---

## 7. When you change the schema

1. Update the typed interface in this file.
2. Update §3 above (this README).
3. Re-run `npx tsx scripts/test-mentions.mts` and fix any new failures.
4. If a field is removed from the source JSON, expect the TypeScript
   compiler to flag the call site — this is intentional. Do not
   silence it with `?? undefined` fallbacks.

---

## 8. Related modules

- [`entity-graph.ts`](./entity-graph.ts) — registry loader, `getEntityById`, `getEntityRef`, slug maps.
- [`data/entities/entity-registry.json`](../../data/entities/entity-registry.json) — single source of truth for entity IDs.
- [`scripts/test-mentions.mts`](../../scripts/test-mentions.mts) — validator.