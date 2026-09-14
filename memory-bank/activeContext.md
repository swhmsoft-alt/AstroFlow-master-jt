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
