# Active Context

> **Last Updated:** 2026-09-14
> **Current Focus:** Schema 审计工具升级。audit-trinity.mjs 改为读 dist/ 运行时 + 区分核心 vs 辅助 @type；新增 scripts/audit-schema-by-page-type.mjs 全站巡检。全站 374/376 详情页核心 @type 完整。等待 GSC 重新抓取验证。

---

## Recent Activity (2026-09-14)

### Schema audit tooling upgrade — closed loop: input (GSC diff) → compute (dist/ runtime scan) → store (audit-schema-by-page-type.mjs) → output (audit-trinity.mjs with core-vs-aux) → re-input (memory-bank/activeContext.md)

**Problem discovered via GSC URL inspection (2026-09-14):**
- User inspected `https://cnc.bozemetal.com/blog/ti-6al-4v-grade-5-titanium-guide/` in GSC.
- GSC showed: 2 BreadcrumbList only, NO BlogPosting.
- GSC last successful fetch: 2026-08-15 11:36:14.
- User flagged: articleSchema detection in audit-trinity.mjs is a false negative
  (source regex can't match runtime `articleType: 'BlogPosting'` value).

**Diagnosis (dist/ runtime scan):**
- `dist/blog/ti-6al-4v-grade-5-titanium-guide/index.html` (built 2026-09-14 03:37) DOES contain BlogPosting.
- Root cause: Googlebot hasn't re-crawled since 2026-08-15. Source code fix landed, but Google hasn't seen it.
- Additional findings from runtime scan:
  - `audit-trinity.mjs` pageType detection had URL-prefix vs content-marker order bug — `src/pages/blog/[...slug].astro` imports AudienceHub, which triggered `'service'` pageType and reported "MISSING Service" for a BlogPosting page.
  - Source-level regex audits can't reliably detect @type presence when @type is a runtime value.

**Files changed:**
1. `scripts/audit-trinity.mjs`:
   - Page-type detection: URL prefix first, content markers as fallback (was reversed).
   - Page types recognized: `blog-post`, `case-study`, `equipment`, `product`, `tool-detail`, `service`, `industry`, `material`, `capability`, `part`.
   - AI schema dimension: reads `dist/<slug>/index.html` (runtime truth) and extracts @types via @graph traversal. Falls back to source regex only if dist/ missing.
   - New `coreTypePresent` AI check: validates page-type-specific CORE @type (BlogPosting, Article, Product, Service, WebApplication).
   - Report output: appends `**Runtime @types detected (dist/)**: ...`, `**Expected core @type**: ...`, `**❌ MISSING core @type**: ...` lines.
2. `scripts/audit-schema-by-page-type.mjs` (new):
   - Standalone site-wide schema coverage audit.
   - Distinguishes CORE (@type that drives rich-result eligibility, varies by pageType) from AUX (Organization, Brand, WebSite, BreadcrumbList, ImageObject, FAQPage, HowTo, CollectionPage, ItemList, WebApplication).
   - Scans `dist/case-studies/`, `dist/equipment/`, `dist/blog/`, `dist/products/product-entities/`, `dist/industries/<live-slug>/`.
   - Exits non-zero if any detail page lacks its expected CORE @type.
   - Usage: `node scripts/audit-schema-by-page-type.mjs [--dir=dist/blog]`

**Validation results (2026-09-14, post-fix):**
- `node scripts/audit-schema-by-page-type.mjs` → **376 detail pages scanned, 374 OK (99%), 2 false positives** (blog/category and blog/page are pagination indices, not detail pages — false positives from dir-as-slug scanning).
- `node scripts/audit-trinity.mjs blog/ti-6al-4v-grade-5-titanium-guide --no-serp` → Total 61/100 (was 57/100 before fix), AI 62/100 (was 50), now correctly shows BlogPosting as (core) in runtime @types, no MISSING core @type line.

**Next action items (waiting on user):**
- [ ] User to trigger GSC re-fetch + Indexing API ping for updated blog pages:
  - `curl "https://www.google.com/ping?sitemap=https://cnc.bozemetal.com/sitemap-en.xml"`
  - Or manual: GSC → URL Inspection → "Request Indexing" for top-traffic blog posts.
- [ ] (Optional) Phase 4A: Extend audit-schema-by-page-type to include multi-locale pages (`dist/<lang>/blog/...`).
- [ ] (Optional) Phase 4B: Add CI hook to fail build if schema coverage drops below threshold (currently 99%).

**Lessons:**
- Source-level regex audits give false negatives for runtime @type values. Always read dist/ for schema truth.
- GSC's last-fetch timestamp is the source of truth for what Google has actually indexed. Source code fixes don't help until Google re-crawls.
- Audit reports must distinguish CORE vs AUX @type — having BreadcrumbList does NOT mean a blog post has its article schema.

---

## Blog Content Rewrite SOP — closed loop: input (audit-trinity detector matrix) → compute (single-write markdown) → store (memory-bank/blog-content-rewrite-workflow.md) → output (audit-preflight.mjs ≥97/100) → re-input (next post uses same SOP)

**Trigger (2026-09-14):** Ti-6Al-4V Grade 5 guide blog post sat at 61/100 Trinity Audit (Buyer 58 | EEAT 62 | AI 62). User flagged the workflow was non-sustainable — multiple iterative edits per post, no pre-flight tooling, blocked by `npm run build` shell timeouts.

**Approach:**
1. Built `scripts/audit-preflight.mjs` — local mirror of `audit-trinity.mjs` detectors (lines 170-274) that runs without `dist/`. 30-second iteration loop.
2. Single-write markdown (`src/content/blog/ti-6al-4v-grade-5-titanium-guide.md`, commit `ce6fc219`, +386/-35 lines): 9 numbered sections, 7 real HTML `<table>` blocks, `howto:` frontmatter, "Structured Data Reference" `<details>` block with JSON-LD example for AI-citation source-fallback path.
3. Detector hit list extracted and codified in `memory-bank/blog-content-rewrite-workflow.md` so the next post is 30-50 min instead of multi-hour iteration.

**Validation (2026-09-14):**
- Preflight: `node scripts/audit-preflight.mjs blog/ti-6al-4v-grade-5-titanium-guide` → **TOTAL 97/100** (Buyer 100 | EEAT 100 | AI 92).
- Single remaining failure: `quotedSpec` ❌ — structural false-positive. Tailwind component class names in the imported component tree (`"space-y-1"`, `"flex-shrink-0"`, `"apple-touch-icon"`) match the audit regex `("[a-z]+(-[a-z0-9]+){2,}")`. Audit-script bug, not content. Hard ceiling = 97/100.

**Files changed:**
1. `src/content/blog/ti-6al-4v-grade-5-titanium-guide.md` — rewrote (commit `ce6fc219`, pushed).
2. `scripts/audit-preflight.mjs` — NEW local pre-flight checker.
3. `memory-bank/blog-content-rewrite-workflow.md` — NEW SOP (detector hit list + 5-step workflow + anti-patterns).
4. `memory-bank/activeContext.md` — this entry.
5. `memory-bank/progress.md` — entry to follow.

**Next action items:**
- [ ] (User-driven) Apply the SOP to the next high-value blog rewrite using `audit-preflight.mjs`. Target 30-50 min per post.
- [ ] (Optional, low priority) Patch `scripts/audit-trinity.mjs` `quotedSpec` regex to exclude CSS class-name contexts (e.g. only count quoted strings inside `<p>` / `<li>` text, not in attribute values or class lists). Would unblock 100/100 for structurally-perfect posts.
- [ ] (Optional) GSC re-fetch of `https://cnc.bozemetal.com/blog/ti-6al-4v-grade-5-titanium-guide/` to verify the new content + HowTo schema are indexed.

**Lessons:**
- One single `create_file` write beats 3+ mid-stream edits. List every detector hit upfront, then write once.
- Preflight script (no dist) is the right iteration tool. Full audit + build is the verification step, not the iteration step.
- Hard ceilings exist. `quotedSpec` is structurally unfixable from markdown (Tailwind classes in imported components). Recognise the ceiling and stop chasing 100.
- Reference implementation (`ti-6al-4v-grade-5-titanium-guide.md`) is the template. Copy its 9-section structure + 7-table density for the next post.

---

## Buyer Search Intelligence · Problem Space #4 Compliance Hub — closed loop: input (Buyer-Search-Intelligence methodology + 12-class audit) → compute (project asset audit) → store (Answer Module template + titanium-compliance-and-certifications.astro) → output (8 scopes / 7-row doc matrix / 5 honesty rows / 10 FAQ / 6 hasCredential JSON-LD) → re-input (memory-bank/activeContext.md + progress.md)

**Trigger (2026-09-15):** User shared the Buyer Search Intelligence · Problem Space methodology (replacing keyword-research paradigm with 12 fixed question types + Answer Modules) and asked to apply it to the BOZE CNC Ti project (cnc.bozemetal.com, B2B titanium CNC machining).

**Project audit vs 12-class map:**
- FULLY: Material (4 grades), Comparison, Finishing (anodizing/passivation/polishing)
- PARTIAL: Capability, Process, Prototype
- MISSING ◎: Compliance, Lead Time, Logistics (methodology's primary gap list)
- Project gap list: also Supplier Eval (only 1 supplier landing) + Troubleshooting (only category hub)

**Mapping methodology "Answer Module 6 elements" → existing AstroFlow mechanisms (no new tools invented):**
| Method element | Project path |
|---|---|
| ① Direct Answer | `SubpageHero subtitle` first sentence |
| ② 诚实定位 | "What We Don't Cover" inline section |
| ③ 结构化主体 | HTML `<table>` SOP (≥7 per blog) + `comparisonList` frontmatter |
| ④ Claim ↔ Evidence | `standards[]` frontmatter → `refsFromIds` → knowsAbout JSON-LD |
| ⑤ Entities | `data/entities/entity-registry.json` (868 entities) → `knowsAbout` schema |
| ⑥ Related | `keywordMap` + `main-db.json` + `relatedLinks` frontmatter + Tier1 anchors |

**Phase A Compliance Hub implementation (single-page answer module, 2026-09-15):**
- New file: `src/pages/titanium-compliance-and-certifications.astro` (318 lines)
- URL: `/titanium-compliance-and-certifications/` (English-only campaign page, mirrors `/as9100-titanium-supplier/` pattern)
- Components reused (no new component invented): `SubpageHero`, `TrustBadges`, `Capabilities`, `QualityControl`, `Applications` — all existing
- Inline sections (no new component): 8-scope grid, 7-row document matrix table, 5 honesty cards, 10 FAQ accordion
- Schema:
  - `BaseLayout` props: `pageType="service-detail"`, `serviceName`, `serviceDescription`, `serviceCategory`, `faqItems` × 10, `faqName`
  - Supplementary JSON-LD: Service + 6 `hasCredential` (AS9100D / ISO 9001:2015 / ISO 13485:2016 / ASTM B348-F136 / EN 10204 3.1 / DFARS)
  - `FAQPage` JSON-LD auto-emitted by buildPageGraph via `faqItems` prop
- Internal Tier1 links: 4 outbound (AS9100 supplier, 5-axis, manufacturer profile, RFQ)
- `node scripts/check-undefined-slugs.mjs` → **0 issues, 15 files scanned** (page is not [...slug] but all `<a href>` targets verified against existing sitemap)

**Validation gates remaining (not run in this session — run before deploy):**
- [ ] `npm run build` (expect 2219 → 2220 pages)
- [ ] `node scripts/audit-preflight.mjs titanium-compliance-and-certifications`
- [ ] `node scripts/audit-schema-by-page-type.mjs --dir=dist/`
- [ ] `node scripts/check-keyword-map.mjs` (page is .astro, not affected by keywordMap, but verify no other regressions)
- [ ] Manual: confirm `dist/titanium-compliance-and-certifications/index.html` has Service + 6 hasCredential + FAQPage in @graph

**Validation gates results (2026-09-15 16:58, after Fix #1 FaqItem key rename):**

| Gate | Result | Evidence |
|---|---|---|
| `npx astro build` (full SSG) | ✅ **PASS** | `[build] Complete!` in build-bg.out — 16:57:12 start, 16:58:16 finish (53.32s); vite 8.00s + 2.15s; 2180 modules transformed; `dist/titanium-compliance-and-certifications/index.html` re-emitted |
| Manual JSON-LD verification | ✅ **PASS** | `Service` + `EducationalOccupationalCredential` × 6 (AS9100D / ISO 9001:2015 / ISO 13485:2016 / ASTM B348·F136 / EN 10204 3.1 / DFARS) + `FAQPage` with 10 Question/Answer pairs (`Question.name` and `Answer.text` both populated) |
| `audit-schema-by-page-type.mjs` | ✅ **375/384 (98%) OK** | 9 missing are blog category index pages (`dist/blog/<cluster>/index.html`) — pagination indices, not detail pages — same false positive noted in activeContext 2026-09-14 entry. **My service-detail page is not in this scanner's scope** (script scans `dist/blog/`, `dist/equipment/`, `dist/case-studies/`, `dist/products/product-entities/`, `dist/industries/<slug>/` only) |
| `check-keyword-map.mjs` | ✅ **PASS** | 2294 authoritative routes from `dist/sitemap*.xml`; astro.config.mjs keywordMap 351 entries / 0 broken; data/keywords/main-db.json 353 mapped entries / 0 broken |
| `audit-preflight.mjs` | ⚠️ **N/A** | Script is designed for blog markdown (`src/content/blog/<slug>.md`); my page is a `.astro` campaign page, not a blog post. The blog SOP does not apply here. |

**Fix #1 (FaqItem key rename) — applied 2026-09-15 16:55:**
- Original `complianceFaqs` array used `{ q, a }` keys but `FaqItem` interface (`src/lib/schema.ts:287-290`) requires `{ question, answer }`.
- Symptom: dist HTML had `"@type":"Question","acceptedAnswer":{"@type":"Answer"}` — empty name/text.
- Fix: 10 FAQ entries renamed to `{ question, answer }`. JSX template (`<span>{f.question}</span>` / `<p>{f.answer}</p>`) also updated.
- Verified after rebuild: dist JSON-LD now contains `"name":"Are you compliant with REACH and RoHS for European markets?","acceptedAnswer":{"@type":"Answer","text":"We provide SVHC (Substances of Very High Concern) declaration letters per REACH (EC) No 1907/2006..."}`.

**Phase A closed-loop status: COMPLETE ✅** (all gates passed, 1 fix applied during validation)

**Phase order (Buyer Search Intelligence methodology + project gap audit):**
1. ✅ Phase A · Compliance Hub — DONE (this session)
2. ⏳ Phase B · Supplier Evaluation Hub (`/titanium-supplier-evaluation/`) — 自我评估问答 + 评分卡
3. ⏳ Phase C · Lead Time Guide (`/titanium-lead-time-guide/`) — 分阶交期表
4. ⏳ Phase D · Logistics & Shipping (`/titanium-logistics-and-shipping/`) — Incoterms + 包装 + 海运
5. ⏳ Phase E · Capability 规格对比表 + Troubleshooting 失效模式表 (回头补 PARTIAL)

**Phase B Supplier Evaluation Hub implementation (single-page answer module, 2026-09-15 17:38):**

| 项 | 值 |
|---|---|
| New file | `src/pages/titanium-supplier-evaluation.astro` (400 lines) |
| URL | `/titanium-supplier-evaluation/` (English-only campaign page, mirrors as9100/supplier pattern) |
| Template reuse | 100% reuse SubpageHero / TrustBadges / Capabilities / QualityControl / Applications — no new component |
| Inline sections | 7-dim framework table + 25-pt scorecard table + 9 Red/Yellow/Green triage cards + 4 honesty cards + 10 self-disclosure FAQ accordion |
| PageType | `service-detail` (BaseLayout) |
| Schema | Service + 7 knowsAbout (AS9100D / ISO 13485 / ASTM B348 / F136 / EN 10204 3.1 / DFARS / FAIR / CMM ISO 10360) + FAQPage (10 Q/A auto via faqItems) |
| Internal Tier1 links | 5 outbound: /rfq/, /titanium-compliance-and-certifications/, /titanium-cnc-machining-manufacturer/, /5-axis-titanium-machining/, https://wa.me/ |
| check-undefined-slugs.mjs | ✅ **0 issues, 15 files scanned** |
| `npx astro build` | ✅ **PASS** — `[build] Complete!` at 17:37:56 (vite 8.21s + 2.96s + 2180 modules; total 41.28s) |
| Manual JSON-LD verify | ✅ **PASS** — 10 Question/Answer pairs with `Question.name` and `Answer.text` both populated (lesson from Phase A applied — used `{ question, answer }` keys from start) |
| `check-keyword-map.mjs` | ✅ **PASS** — 351 keywordMap + 353 main-db / 0 broken |

**Phase B closed-loop status: COMPLETE ✅** (first-time success — Phase A lessons applied, no fixes needed during validation)

---

## Buyer Search Intelligence · Migration to /capabilities/ sub-pages (2026-09-15 18:34)

**Trigger:** User's critical insight — 12-class problem mapping ≠ 12 root-level pages. The correct architecture is to map question types to the existing site decision tree (D1 What / D2 Who can / D3 Cost / D4 How long / D5 How to start) and embed them as sub-pages of existing hubs.

**SOP codified:** `.clinerules/Buyer-Search-Intelligence-SOP.md` (309 lines) — Hub-Mapping-First 4-step flow, 12-class canonical mapping, 10 forbidden patterns, 6 validation gates.

**Migration (Phase A → /capabilities/compliance/):**
- New file: `src/pages/capabilities/compliance/index.astro` (318 lines, sub-page of /capabilities/)
- Removed: `src/pages/titanium-compliance-and-certifications.astro`
- 301 redirect: `'/titanium-compliance-and-certifications/': '/capabilities/compliance/'` in astro.config.mjs

**Migration (Phase B → /capabilities/supplier-evaluation/):**
- New file: `src/pages/capabilities/supplier-evaluation/index.astro` (~250 lines, sub-page)
- Removed: `src/pages/titanium-supplier-evaluation.astro`
- 301 redirect: `'/titanium-supplier-evaluation/': '/capabilities/supplier-evaluation/'`

**New pages (Phase C/D):**
- `src/pages/capabilities/lead-time/index.astro` — D4 How long, 4 lead-time tiers + 6 FAQ + Service + knowsAbout × 4
- `src/pages/capabilities/logistics/index.astro` — D4 How long, 6 Incoterms 2020 + 5 packaging methods + 6 FAQ + Service + knowsAbout × 5

**Build verification (2026-09-15 18:34):**
- `npx astro build` → `[build] Complete!` in 43.98s (vite 6.65s + 9.31s + 2180+ pages SSG)
- 4 new URLs in dist/ confirmed by Test-Path
- Old source files confirmed deleted (Test-path False × 2)
- Old URL directories in dist/ manually cleaned
- sitemap-0.xml: capabilities/{compliance,supplier-evaluation,lead-time,logistics} present, old URLs absent
- Temporary .log files cleaned

**Next steps (per SOP §4 Inbound-Entry Auto-Check, 5-entry rule — NOT yet done):**
- NAVIGATION in src/config/site.ts needs "Capabilities" dropdown with 4 sub-items
- Footer trust block
- Parent hub /capabilities/ 6-dim matrix cross-link
- data/keywords/main-db.json: ~10 compliance/supplier/lead-time/logistics phrases for 117+ markdown auto-links
- astro.config.mjs keywordMap: 4 hub anchor phrases for rehype plugin
- These 5 inbound entries are the next Phase F — without them, the 4 new pages are again orphaned relative to top-nav/footer (only the parent hub /capabilities/ links them).

**Phase F COMPLETED 2026-09-15 19:34:** All 5 inbound entries implemented and validated — Phase A→B→C→D now CLOSED-LOOP. Implementation table appended below.

| # | Entry | File | Status |
|---|---|---|---|
| 1 | Top NAV dropdown | `src/config/site.ts` | ✅ "Capabilities" section + 5 sub-items |
| 2 | Footer trust block | `src/components/Footer.astro` | ✅ "Capabilities & Compliance" column + 4 links |
| 3 | Parent hub cross-link | `src/pages/capabilities.astro` | ✅ 6-dim matrix cards appended |
| 4 | `data/keywords/main-db.json` | | ✅ 4 new en keywords added |
| 5 | `astro.config.mjs` keywordMap | | ✅ 7 new rehype phrases added |

**Build 19:34:** `[build] Complete!` in 52.81s. `check-keyword-map.mjs` → 358 keywordMap / 357 main-db / **0 broken**.


**Lessons:**
- "Answer Module" methodology doesn't require new tools — it requires reusing the right combinations of existing ones. The "innovation" is structural (which 6 elements on which page), not technical.
- Single-page Phase A under 318 lines: 8 scopes + 7 docs + 5 honesty + 10 FAQ = 30 atomic units of evidence a buyer/LLM can cite verbatim. Density over volume.
- `service-detail` pageType in schema.ts already supports Service + hasCredential × N — no schema.ts rewrite needed (per .clinerules red line: "不重写 src/lib/schema.ts").
- English-only campaign page pattern (no SEO_CONFIG entry needed) matches `/as9100-titanium-supplier/` and `/titanium-cnc-machining-manufacturer/` exactly. Don't invent new i18n routing for campaign pages.
- `faqItems` prop in BaseLayout auto-emits FAQPage JSON-LD — pre-existing mechanism, zero new code needed for FAQPage @type.
