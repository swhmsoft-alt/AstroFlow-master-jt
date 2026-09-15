---
trigger: model_decision
description: |
  Engineering discipline for Buyer Search Intelligence implementation on
  AstroFlow / BOZE CNC Ti project. Created 2026-09-15 in response to a
  critical architectural mistake: Phase A/B were placed at root-level
  (`/titanium-compliance-and-certifications/`, `/titanium-supplier-evaluation/`)
  instead of being mapped to the existing site decision tree
  (`/capabilities/compliance/`, `/capabilities/supplier-evaluation/`).

  This SOP codifies the correct methodology and forbids the mistake.

  **Load this SOP BEFORE** any Buyer Search Intelligence / Answer Module /
  "12-class audit" / new content hub task. If you are about to create a new
  `.astro` page under `src/pages/`, ask yourself: "Does the Hub-Mapping-First
  flow put this URL inside an existing decision-tree node, or am I creating
  a root-level orphan?" If the answer is the latter, STOP and re-apply the
  flow — do not write the file.
---

# Buyer Search Intelligence — Implementation SOP

## 0. Core Thesis (the cognitive layer, non-negotiable)

**Buyer Search Intelligence is a methodology for mapping buyer question
types onto an existing site decision tree. It is NOT a methodology for
generating 12 independent landing pages.**

| Era | Mistake |
|---|---|
| Keyword-research era | 1 query = 1 landing page → 12 queries = 12 root-level pages |
| LLM-semantic era | 1 question **type** = 1 **decision-tree node** → 12 types embed into existing hub tree |

> **Quote (post-mortem, 2026-09-15):** "The mistake was treating the
> 12-class audit as a list of pages to write, instead of as a list of
> decision dimensions to map onto the site's existing topology."
> — Cline lesson learned from Phase A/B root-level mistake.

The Buyer Search Intelligence 12-class framework comes from external
methodology. Our implementation discipline lives in this file.

---

## 1. The Hub-Mapping-First Flow (4 mandatory steps)

**Before creating any new `.astro` page or sub-page under `src/pages/`**
for a Buyer Search Intelligence topic, complete all 4 steps IN ORDER.
Each step must produce a written record (comment in file, memory-bank
entry, or commit message) so the decision is auditable later.

### Step 1 — Decision-Dimension Localization

Answer: "In the buyer's procurement decision chain, which **dimension**
does this question type represent?"

The decision tree has exactly **5 dimensions** for B2B titanium CNC:

| Dim | Buyer Question | Existing Site Anchor |
|---|---|---|
| **D1 — What** | What material / process / part do I need? | `/materials/`, `/titanium-cnc-machining-services/`, `/titanium-additive-manufacturing/`, `/titanium-surface-treatment/` |
| **D2 — Who can** | Who is qualified to make this part? | **`/capabilities/`** (master hub) |
| **D3 — How much** | What does it cost? | `/rfq/` (B2B inquiry form) |
| **D4 — How long** | How fast can they deliver? | `/capabilities/lead-time/` (sub of D2) |
| **D5 — How to start** | What is the first step? | `/rfq/`, `/contact/`, WhatsApp |

**Rule:** Every Buyer Search Intelligence question type maps to exactly
one of D1–D5. If you cannot map a topic to D1–D5, the question is either
out-of-scope for this site (do not implement) or needs user clarification.

### Step 2 — Site-Tree Attribution

Given the decision dimension from Step 1, identify the **exact URL path**
under the existing site tree. **NEVER** create a root-level page for
a topic that fits under an existing hub.

**Rule:** A new Buyer Search Intelligence page MUST live under one of
the existing hub sub-paths. If you think you need a new root-level path,
the next step is to write a 1-paragraph justification and request user
approval. The default assumption is **NO**.

### Step 3 — Path Authority Verification

Run **`node scripts/check-undefined-slugs.mjs`** AND verify that the new
URL appears in `dist/sitemap-*.xml` after the next build. If the URL is
not produced by an existing `[...slug].astro` file or by a fixed route,
the path is invalid.

### Step 4 — Inbound-Entry Auto-Check (the 5-entry rule)

A new page is **NOT discoverable** until it has inbound entries from at
least these 5 locations. Cline MUST update all 5 before claiming
"CLOSED-LOOP" status:

| # | Inbound Source | File |
|---|---|---|
| 1 | Top NAV dropdown | `src/config/site.ts` → `NAVIGATION` (parent hub menu) |
| 2 | Footer link block | `src/components/Footer.astro` (or inherited from NAVIGATION) |
| 3 | Parent hub cross-link | e.g. for `/capabilities/lead-time/` → `src/pages/capabilities.astro` |
| 4 | `data/keywords/main-db.json` (auto-inline-links) | adds anchor in 117+ markdown files |
| 5 | `astro.config.mjs` → `keywordMap` (rehype plugin) | adds anchor at HTML render time |

**Rule:** A page without these 5 inbound entries is an **orphan**, even
if it builds and passes schema audit. Cline MUST NOT claim CLOSED-LOOP
without updating all 5.

---

## 2. Buyer Search Intelligence 12-Class Mapping (canonical)

This table is the **single source of truth** for which URL path serves
each question type. If the user requests a topic and the table disagrees,
**the table wins** unless the user explicitly overrides.

| # | Question Type | Method status | Decision Dim | URL Path | Status |
|---|---|---|---|---|---|
| 1 | Capability 能力 | PARTIAL | D2 | `/capabilities/` | ✅ Hub exists |
| 2 | Comparison 对比 | FULLY | D1+D2 | (inline blog + comparison list frontmatter) | ✅ |
| 3 | Pricing 价格 | — | D3 | `/rfq/` | ✅ |
| **4** | **Compliance 合规** | **MISSING ◎** | **D2** | **`/capabilities/compliance/`** | **🚧 Phase A — to be migrated** |
| 5 | Process 工艺 | PARTIAL | D1 | `/titanium-cnc-machining-services/` | ✅ Hub exists |
| 6 | Troubleshoot 排查 | — | blog | `/blog/problems-solutions/` | ✅ cluster exists |
| **7** | **Lead Time 交期** | **MISSING ◎** | **D2 / D4** | **`/capabilities/lead-time/`** | **🚧 Phase C** |
| 8 | Material 材料 | FULLY | D1 | `/materials/` | ✅ Hub exists |
| **9** | **Supplier Eval 评估** | **— (not in original 12 but project-critical)** | **D2** | **`/capabilities/supplier-evaluation/`** | **🚧 Phase B — to be migrated** |
| 10 | Prototype 小批量 | PARTIAL | D1 | `/titanium-additive-manufacturing/rapid-prototyping/` | ✅ |
| 11 | Finishing 表面处理 | FULLY | D1 | `/titanium-surface-treatment/` | ✅ |
| **12** | **Logistics 物流** | **MISSING ◎** | **D2 / D4** | **`/capabilities/logistics/`** | **🚧 Phase D** |

### Existing hub tree (post-2026-09-15)

```
/                                (Home)
/materials/                      (D1 — Material)
/titanium-cnc-machining-services/ (D1 — Process)
/titanium-additive-manufacturing/ (D1 — Process)
/titanium-surface-treatment/     (D1 — Process)
/titanium-fabrication-services/   (D1 — Process)
/titanium-forming-heavy-manufacturing/ (D1 — Process)

/capabilities/                   (D2 — Who can, MASTER HUB)
├── /capabilities/compliance/    (D2 — compliance evidence)
├── /capabilities/supplier-evaluation/ (D2 — self-assessment + scorecard)
├── /capabilities/lead-time/      (D2 — delivery time)
└── /capabilities/logistics/      (D2 — Incoterms, packaging, freight)

/rfq/                            (D3 — Pricing, D5 — Start)
/case-studies/                   (trust evidence, all dims)
/blog/                           (long-form knowledge, all dims)
```

---

## 3. Migration Protocol (for previously-rooted pages)

When a page was created at root level in error, follow this protocol to
migrate it under the correct hub. **Do not delete + recreate** — preserve
SEO authority with 301 redirects.

### 3.1 Identify the migration

A page needs migration when:

- Its URL path is at `src/pages/<topic>.astro` (root level)
- Its content belongs to an existing hub per Step 2 mapping
- The topic is one of: Compliance / Supplier Evaluation / Lead Time / Logistics / Capability specifics

### 3.2 Execute the migration

1. **Create new file** at the correct path: `src/pages/<hub>/<topic>/index.astro`
2. **Move content** verbatim (no rewriting). Only update:
   - `canonicalUrl` to new path
   - `pageTitle` if it makes sense (often unchanged)
   - All internal `<a href="/old-path/">` to `<a href="/new-path/">`
3. **Add 301 redirect** in `astro.config.mjs`:
   ```js
   redirects: {
     '/<old-path>/': '/<new-path>/',
   }
   ```
4. **Delete** the old root-level file `src/pages/<topic>.astro`
5. **Update** the 5 inbound entries (per Step 4) to point to the **new** path
6. **Build** and verify the new path appears in `dist/sitemap-*.xml`
7. **Run** `check-keyword-map.mjs` to confirm 0 broken links

### 3.3 Update memory-bank

- Append migration entry to `memory-bank/activeContext.md` (Closed-Loop section)
- Append status change to `memory-bank/progress.md`

---

## 4. Implementation Template (per Phase)

Each Phase (A, B, C, D, ...) follows this template. **Do not skip steps.**

### Phase lifecycle

```
1. Pre-flight       read parent hub + sibling pages
2. Page create      src/pages/<hub>/<topic>/index.astro (Answer Module 6 elements)
3. Schema write     JSON-LD via BaseLayout props + supplementary @graph
4. Inbound entries  5 locations per Step 4
5. Build (bg)       npx astro build via Start-Process
6. Schema verify    dist HTML grep for @type
7. Slug check       node scripts/check-undefined-slugs.mjs
8. Keyword check    node scripts/check-keyword-map.mjs
9. Memory-bank      activeContext + progress entries
10. Cleanup         delete all Cline-created *.log / scratch files
```

### Answer Module 6 elements (mandatory per page)

| # | Element | Implementation |
|---|---|---|
| ① Direct Answer | `SubpageHero subtitle` first sentence states the conclusion |
| ② 诚实定位 (Honest Positioning) | "What We Don't Cover / Where We Don't Compete" inline section, 3-5 cards |
| ③ 结构化主体 (Structured Body) | HTML tables + grids + accordions (≥4 structured elements per page) |
| ④ Claim ↔ Evidence | Every claim cites a real standard / part number / capability number |
| ⑤ Entities | JSON-LD via `BaseLayout` props + supplementary `@graph` for credentials |
| ⑥ Related | 4-5 outbound Tier1 anchors to parent hub / sibling pages / RFQ |

### Component reuse (mandatory)

- **Always** reuse: `SubpageHero`, `TrustBadges`, `Capabilities`, `QualityControl`, `Applications`
- **Never** create a new component for a single page
- Inline sections (table / accordion / grid) are acceptable as `.astro` body content

### Schema props (mandatory)

```astro
<BaseLayout
  pageType="service-detail"
  serviceName="..."
  serviceDescription="..."
  serviceCategory="..."
  faqItems={[{ question, answer }, ...]}    // NB: question/answer keys, NOT q/a
  faqName="..."
>
```

The `pageType="service-detail"` automatically triggers Service +
BreadcrumbList + Organization JSON-LD via `buildPageGraph()` in
`src/lib/schema.ts`. Add page-level supplementary JSON-LD only when the
page has credentials or knowsAbout lists not covered by entity-registry.

---

## 5. Forbidden Patterns (do NOT do these)

| # | Anti-pattern | Why forbidden |
|---|---|---|
| F1 | Root-level page for a topic that fits an existing hub | Orphan in decision tree, breaks buyer mental model |
| F2 | New component for a single page's section | Maintenance debt, breaks DRY |
| F3 | `{ q, a }` keys in faqItems array | Schema.org requires `{ question, answer }`; causes empty `Question.name` / `Answer.text` in JSON-LD |
| F4 | Inline JSON-LD `<script>` blocks instead of BaseLayout props | Splits schema authority, breaks `buildPageGraph()` ownership |
| F5 | Hardcoded `URL` or `href` paths that bypass the i18n layer | Breaks locale routing for 12 languages |
| F6 | Hand-written `<a href>` from blog post to new hub without `keywordMap` registration | Loses auto-inline-links benefit |
| F7 | Calling a Phase "CLOSED-LOOP" before updating all 5 inbound entries | False closure — buyer still cannot discover the page |
| F8 | Creating `src/pages/<topic>.astro` without first running Hub-Mapping-First | Violates the core thesis of this SOP |
| F9 | Inventing new URL paths not present in `dist/sitemap-*.xml` after build | URL Fabrication — see SEMANTIC_CLOSURE.md §4.4 |
| F10 | Rewriting `src/lib/schema.ts` to add custom @type builders | Schema authority lives in one file; extend, never duplicate |

---

## 6. Validation Gates (per Phase)

Before marking a Phase complete, ALL gates must pass:

| Gate | Command | Expected |
|---|---|---|
| G1 | `node scripts/check-undefined-slugs.mjs` | 0 issues |
| G2 | `npx astro build` (background via Start-Process) | `[build] Complete!` |
| G3 | `Select-String dist/<path>/index.html` for `@type` | Service + FAQPage with populated `name`/`text` |
| G4 | `node scripts/check-keyword-map.mjs` | 0 broken |
| G5 | Manual: 5 inbound entries verified | NAV / Footer / parent hub / keywordMap / main-db all updated |
| G6 | `git status --short` shows zero Cline-created *.log / temp files | Clean working tree |

**A Phase is CLOSED-LOOP only when G1–G6 all pass.**

---

## 7. Quick Reference — Cheat Sheet

```
Before any new Buyer Search Intelligence page:

1. WHICH DIMENSION?    D1 (what) / D2 (who) / D3 (cost) / D4 (time) / D5 (start)
2. WHICH HUB?          /materials/ /services/ /capabilities/ /rfq/ /blog/
3. WHICH SUB-PATH?     See Section 2 mapping table
4. 5 INBOUND ENTRIES?  NAV / Footer / parent hub / keywordMap / main-db
5. REUSED COMPONENTS?  SubpageHero + TrustBadges + Capabilities + QualityControl + Applications
6. SCHEMA PROPS?       pageType=service-detail + faqItems[{question,answer}]
7. REDIRECTS?          If migrating from old URL → 301 in astro.config.mjs
```

If any answer is "I don't know" or "I'll figure it out later" — STOP.
Either complete the SOP step, or ask the user. Never write the page
first and back-fill the SOP later.

---

## 8. Workflow Boundary · Cline scope vs Ops scope

**Lesson learned 2026-09-15** — user questioned why Cline needs FTP credentials when GitHub already has the code.

**Cline's work flow ends at:**
```
Plan → Implement → Build → Test → Commit → Push → origin/main synced
```

**Ops / User work flow (NOT Cline's responsibility):**
- `npm run deploy:inc` (FTP upload to cPanel-like host)
- FTP credential management (PRODUCTION_FTP_HOST/USER/PASSWORD)
- Production monitoring and incident response
- DNS / CDN / hosting platform migration decisions

**Rule:** When user asks "commit + push + deploy", interpret as
**"commit + push"** only. Deploy requires user's own infrastructure
access. Never fabricate FTP credentials, never read .env.production
content, never include deployment in Cline's reported success criteria.

**Production deploy rationale** (for user reference, not for Cline to act on):
- Project's production host `cnc.bozemetal.com` is cPanel-like shared hosting
- FTP is the only deploy path given the current host
- Improvement: `.github/workflows/deploy.yml` can automate
  `npm run deploy:inc` triggered by push to main, with FTP creds
  stored as GitHub Secrets — **no Cline involvement needed**

---

## 9. Related Documents

- `SEMANTIC_CLOSURE.md` — JSON-LD @graph architecture, validation checklist
- `.clinerules/.clinerules.md` — URL red lines, no-fabrication rules
- `.clinerules/工作区 Rules.txt` — workspace engineering constraints
- `.clinerules/knowledge-package-handling.md` — V2.0 Knowledge Package protocol (separate workflow)
- `memory-bank/blog-content-rewrite-workflow.md` — Blog content SOP (markdown-only, not astro pages)
- `memory-bank/entity-graph.md` — Entity graph architecture (868 entities)
