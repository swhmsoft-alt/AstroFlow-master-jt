---
template_for: knowledge-packages/{seed-slug}/IMPLEMENTATION_BRIEF.md
generated_by: human or research AI (post-APPROVED only)
audience: Cline / AstroFlow executor
context_budget: ≤ 4 KB (STRICT)
prohibits:
  - reading MASTER_PROMPT_V2.md (unless user explicitly asks)
  - reading non-Brief files in Knowledge Package (unless Brief references)
positioning: "精简执行上下文 — Cline 的唯一入口"
---

# Implementation Brief — {Seed Entity}

> ⚠️ **唯一执行入口**：Cline 只读取本 Brief + 项目已有规则。
> 不要读取 V2.0、Knowledge Package 其它文件，除非本 Brief 显式引用。
> Brief 字段必须与 Knowledge Package 严格对齐；任何不一致 → 拒绝执行。

---

## Topic
{seed-slug human-readable name}

## Approved Entities
- `{entity_id_1}` ({category})
- `{entity_id_2}` ({category})
- ...

## Approved Relationships
- `{from}` --{predicate}--> `{to}` (evidence: `{evidence_ref}`)
- ...

## Content Architecture (page-level)
1. `/`{slug-1}`/` ({pageType}) — {1 句用途}
2. `/`{slug-2}`/` ({pageType}) — {1 句用途}
3. ...

## Information Gain (3-5 增量点)
- {incremental_point_1}
- {incremental_point_2}
- ...

## Evidence Anchors (per V2.0 §5)
| Claim | Level | Source | Translation to AstroFlow |
|-------|:-----:|--------|---------------------------|
| {claim_1} | E{0-6} | {source_ref} | {schema-eligible / background-only} |
| {claim_2} | E{0-6} | {source_ref} | {schema-eligible / background-only} |

> **Translation Rule** (Cline 必须遵守):
> - **E0, E1** → **不可入 JSON-LD schema**，仅作页面背景叙述
> - **E2, E3, E4, E5** → 可入 schema (需校对 entity-registry 现有条目后再写)
> - **E6** → **不可入 schema**，需明确标注 "analytical inference"
>
> ⚠️ 等级编号遵循 V2.0 §5 定义（E1 = ASTM/ISO 最高权威，E6 = 推断最低）。
> 不与 AstroFlow 现有 evidence 体系强行对齐。

## Required Pages
- [ ] `/`{slug}`/` ({pageType}) — {1 句}
- [ ] `/`{slug}`/` ({pageType}) — {1 句}

## Hub Content Mandate (Conditional — 仅 hub-type seed 触发)

> **触发条件**: 若 seed-slug 对应 URL 是 `/{hub}/` 总览类 (如 `/services/`、`/industries/`、`/products/`、`/materials/`), 本节**必填**. 否则标注 N/A.

> **目的**: 防止 V2.0 把 hub 页当成"关系图谱节点"而忽略内容交付. Hub 页必须有**实质内容增量**, 否则用户看不到新系统价值.

### 必填项

- [ ] **Hero 重写**: `/`{hub-slug}`/` 页面的 h1 + subtitle 文案 (≥ 200 字, 覆盖 domain 定位 / commercial intent / GEO 锚点 / 信任锚点 / 价值主张)
- [ ] **Sections 清单**: 主章节列表 ≥ 5 块, 每块说明插入哪个现有 section 组件 (按 `src/components/{hub}/` 目录, **禁止建议创建新组件**)
- [ ] **内部链接图**: hub → 各 sub-hub 的 anchor + 锚文本 (每条锚文本必须与 `data/keywords/main-db.json` 已 mapped 短语对齐)

### 缺项处理

缺任意一项 → Brief 不进入 BRIEF_READY → Cline 拒绝消费 → 必须补齐后重新触发 Review.

### 示例 (seed = services)

- [x] **Hero 重写**: `/services/` h1 = "..." + subtitle = "..." (≥ 200 字)
- [x] **Sections**: SubpageHero + ServiceMatrixGrid + ComplianceRibbon + EngineeringWorkflow + QuickIndustrySolutions + PartsPromoBanner
- [x] **内部链接图**: 5 主服务的 anchor 文本已与 main-db.json 对齐

## Required Changes
- [ ] `entity-registry.json`: 新增 {n} 个, schema 演进 {m} 处
- [ ] `keywordMap` (astro.config.mjs): 新增短语 {n} 条 (避免与现有重复)
- [ ] `src/lib/schema.ts`: 复用现有 `buildXxx()`; 仅在必要时新增 builder
- [ ] `.astro` 页面: 按 Content Blueprint 创建/更新

## Risks / Constraints
- {risk_1 — 例如: 现有 entity-registry 无 Grade 5 schema, 需先演进}
- {risk_2}

## Source Files (按需查阅, 非默认读取)
- Knowledge Package: `knowledge-packages/{seed-slug}/`
- APPROVED.md: `knowledge-packages/{seed-slug}/APPROVED.md`
- Content Blueprint: `knowledge-packages/{seed-slug}/content-blueprint.md`
- Evidence Matrix: `knowledge-packages/{seed-slug}/evidence-matrix.md`

---

## STRICT EXECUTION RULES (per `.clinerules/knowledge-package-handling.md`)

- ❌ **DO NOT** read `docs/prompts/MASTER_PROMPT_V2.md` (除非用户明确指示)
- ❌ **DO NOT** read Knowledge Package 中 Brief 之外的文件 (除非本 Brief 引用)
- ❌ **DO NOT** modify `src/lib/schema.ts` directly; only **extend** with new `buildXxx()`
- ❌ **DO NOT** hand-write JSON-LD in `.astro` `<script type="application/ld+json">`
- ❌ **DO NOT** create URL routes not in `dist/sitemap*.xml` or `getStaticPaths`
- ❌ **DO NOT** pollute `entity-registry.json` without `registry_status` alignment
- ✅ **DO** verify all slugs via `scripts/check-undefined-slugs.mjs`
- ✅ **DO** follow keywordMap chain (no parallel `<a>` anchor text)
- ✅ **DO** append 1-line record to `memory-bank/activeContext.md`

---

## Approval Trail

```
Knowledge Package Status: APPROVED + BRIEF_READY
APPROVED.md date: {YYYY-MM-DD}
Brief generated: {YYYY-MM-DD}
Brief generator: {human / Claude / Gemini / other}
Execution start: {to be filled by Cline}
```
