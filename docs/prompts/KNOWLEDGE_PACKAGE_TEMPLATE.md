# Knowledge Package — Standard Template

> **Status: Pending full text — this is the structural skeleton.**
> V2.0 Knowledge Package 标准化产物。**不是数据源**，是 **待审议 (DRAFT → IN REVIEW → APPROVED/REJECTED)** 的研究产物。

---

## 0. 设计原则

1. **V2.0 不直接进入 AstroFlow** — 它的产出必须先经过 Knowledge Package 沉淀，再经人工 Review，才能进入正式系统。
2. **Knowledge Package 是研究产物，不是数据库** — `entity-registry.json` 才是 Single Source of Truth。
3. **每个 Knowledge Package 自包含** — 必须包含 README + architecture + entities + relationships + intent + info-gain + evidence + blueprint + implementation-notes。
4. **状态机严格**：DRAFT → IN REVIEW → APPROVED | REJECTED。仅 APPROVED 状态可被 AstroFlow 消费。

---

## 1. 目录结构

```text
knowledge-packages/
└── {seed-slug}/
    ├── README.md                 ← 1 段概述 + 链接到各 artifact
    ├── architecture.md           ← Seed / Domain / Persona / Intent / Page Type + Intent Map + Info Gain Summary
    ├── entities.json             ← 实体候选 (与 entity-registry 对齐)
    ├── relationships.json        ← 关系候选 (限定 7 谓词)
    ├── intent-map.json           ← Intent Map (Primary/Secondary/Multi-Hop/Decision/Commercial)
    ├── information-gain.md       ← 真正的增量点 (3-5 条)
    ├── evidence-matrix.md        ← Claim × E0-E6 × Source × Confidence
    ├── content-blueprint.md      ← 页面级大纲 (pageType / H1 / H2 / schema / 链入/链出)
    ├── implementation-notes.md   ← 落地建议 (entity 演进 / keywordMap / 内链 / i18n / 工作量)
    └── APPROVED.md               ← Reviewer 创建的状态标记文件 (仅 APPROVED 时存在)
```

---

## 2. README.md 模板

```markdown
# Knowledge Package: {Seed Entity}

**Status:** DRAFT | IN REVIEW | REJECTED | APPROVED
**Created:** YYYY-MM-DD
**Source:** Master Prompt V2.0 (executed via: Gemini / Claude / ChatGPT / Other)
**Domain:** {industry vertical}
**Persona:** {procurement / design / quality / manufacturing / executive}
**Intent:** {supplier qualification / material selection / etc.}
**Page Type:** {landing / product / guide / comparison / case-study / etc.}
**Reviewer:** {name or "pending"}

## 概述 (1 段)
{研究问题、关键发现 3-5 个、是否值得 APPROVED 进入 AstroFlow}

## Artifacts
- [architecture.md](./architecture.md)
- [entities.json](./entities.json)
- [relationships.json](./relationships.json)
- [intent-map.json](./intent-map.json)
- [information-gain.md](./information-gain.md)
- [evidence-matrix.md](./evidence-matrix.md)
- [content-blueprint.md](./content-blueprint.md)
- [implementation-notes.md](./implementation-notes.md)

## Review Checklist
- [ ] 实体 id 与 entity-registry.json 对齐 (无冲突)
- [ ] 关系限定在 entity-registry 已支持的 7 谓词
- [ ] evidence E0-E2 claim 未标记为可入 schema
- [ ] content-blueprint slug 通过 scripts/check-undefined-slugs.mjs
- [ ] 不引入 V2.0 22 谓词之外的关系 (除非明确 schema 演进)
- [ ] 在 memory-bank/activeContext.md 追加 1 行记录
```

---

## 3. architecture.md 模板

```markdown
# Architecture

## Seed
- **Seed Entity:** {name}
- **Slug:** {kebab-case-slug}
- **Domain:** {industry vertical}

## Context
- **Persona:** {procurement manager / design engineer / quality / etc.}
- **Intent:** {supplier qualification / material selection / cost analysis / etc.}
- **Page Type:** {service-detail / product-detail / guide / case-study / etc.}
- **Journey Stage:** {awareness / consideration / decision}

## Intent Map Summary
- **Primary Intent:** {1 句话}
- **Secondary Intents:** {3-5 个}
- **Multi-Hop Queries:** {2-3 个}
- **Decision Intents:** {2-3 个}
- **Commercial Intents:** {1-2 个}

## Information Gain Summary (3-5 真正增量点)
1. {增量点 1 + 现有覆盖度 + 证据强度}
2. {增量点 2}
3. ...

## Recommendation
{一句话: 是否建议 APPROVED 进入 AstroFlow, 预估工作量, 风险点}
```

---

## 4. entities.json 模板

```json
[
  {
    "id": "material.grade-5-titanium",
    "slug": "grade-5",
    "category": "material",
    "name": "Grade 5 Titanium (Ti-6Al-4V)",
    "description": "...",
    "attributes": {
      "standard": "ASTM B348",
      "tensile_strength_ksi": 138,
      "yield_strength_ksi": 128,
      "elongation_pct": 14
    },
    "registry_status": "EXISTS",
    "registry_id": "material.grade-5-titanium"
  },
  {
    "id": "process.high-pressure-coolant",
    "slug": "high-pressure-coolant",
    "category": "process",
    "name": "High-Pressure Through-Spindle Coolant",
    "description": "...",
    "attributes": {},
    "registry_status": "NEW",
    "registry_id": null,
    "schema_evolution_required": true
  }
]
```

**字段说明**：
- `registry_status`: EXISTS (已存在) | NEW (需新增) | CONFLICT (冲突, 需人工)
- `registry_id`: 若 EXISTS, 必填; 若 NEW, 留 null
- `schema_evolution_required`: 仅 NEW 时考虑

---

## 5. relationships.json 模板

```json
[
  {
    "from": "service.cnc-machining",
    "to": "material.grade-5-titanium",
    "predicate": "usesMaterial",
    "evidence_ref": "evidence-matrix.md#E3",
    "confidence": "high"
  },
  {
    "from": "material.grade-5-titanium",
    "to": "standard.astm-b348",
    "predicate": "conformsTo",
    "evidence_ref": "evidence-matrix.md#E4",
    "confidence": "high"
  }
]
```

**仅接受的 7 谓词** (与 entity-registry.json 已支持一致):
- `conformsTo`
- `usedIn`
- `usesMaterial`
- `usesProcess`
- `usesEquipment`
- `providesService`
- `hasCaseStudy`

V2.0 STEP 2 的其余 22 谓词候选 → 写入 `implementation-notes.md` 待评审, 不直接进入本文件。

---

## 6. intent-map.json 模板

```json
{
  "primary_intent": "qualify titanium CNC machining supplier for medical implants",
  "secondary_intents": [
    "compare grade-5 vs grade-23 for medical use",
    "understand AS9100 certification scope"
  ],
  "multi_hop": [
    "titanium supplier → medical implant → FDA compliance"
  ],
  "decision_intents": [
    "should I choose grade-5 or grade-23 for my application?"
  ],
  "commercial_intents": [
    "request quote for titanium CNC machining"
  ],
  "personas_served": [
    "procurement-manager",
    "design-engineer"
  ]
}
```

---

## 7. information-gain.md 模板

```markdown
# Information Gain Analysis

## 当前覆盖度
- 现有已发布内容覆盖度: {高/中/低}
- 现有 keywordMap 覆盖短语: {n 条}
- 现有 schema.ts 支持的 pageType: {已支持/不需新增}

## 真正增量点 (3-5 条)

### 增量点 1: {title}
- **现有覆盖度:** {现有页面 / 现有段落 / 无}
- **新增内容:** {1-2 句概述}
- **证据强度:** E{0-6} ({source})
- **是否值得新页面:** {是 / 否, 原因}
- **建议 pageType:** {service-detail / guide / etc.}

### 增量点 2: ...
```

---

## 8. evidence-matrix.md 模板

```markdown
# Evidence Matrix

| Claim | Evidence Level (E0-E6) | Source | Confidence | Notes |
|-------|------------------------|--------|------------|-------|
| Grade 5 has 138 ksi tensile | E2 | ASTM B348 Table 2 | high | Industry standard |
| High-pressure coolant extends tool life 40% | E3 | Sandvik tooling guide | medium | Vendor-published |
| AS9100D requires risk-based thinking | E4 | AS9100D §6.1 | high | Cert-body |
| Customer claims 30% cost saving | E1 | Internal case study | low | Single-source |

## 证据等级定义

- **E0** — 经验 / 内部惯例 (不可单独入 schema)
- **E1** — 厂商资料 / 单源案例 (不可单独入 schema)
- **E2** — 行业标准 (ASTM / ASME / ISO 等) (可入 schema 引用)
- **E3** — 学术文献 / peer-reviewed (可入 schema 引用)
- **E4** — 政府 / 认证机构 (FDA / AS9100 / NADCAP) (可入 schema, 权威)
- **E5** — 一手测试报告 (内部实验室 / 第三方) (可入 schema)
- **E6** — 多源交叉验证 (≥2 个独立 E2-E5 来源) (可入 schema, 强)

**Rule:** E0 / E1 级别的 claim **不可**进入 JSON-LD schema 或页面正文"事实断言"。可作为背景叙述或案例素材。

> ⚠️ **证据等级对齐说明（2026-09-04 B-Prime+ 修订）**：本模板的证据等级编号遵循 V2.0 §5 定义（**E1 = 最高权威 ASTM/ISO，E6 = 最低 Analytical Inference**）。
> 与 AstroFlow 现有 evidence 体系（如 `grade-5-semantic-cluster-audit.md`）**不强行对齐**。
> 翻译责任放在 AstroFlow 端，详见 `.clinerules/knowledge-package-handling.md` Step 4 的 "Translation Rule"。
> 母引擎不为适配子系统而变形 — V2.0 编号保持原样，AstroFlow 端做映射。
```

---

## 9. content-blueprint.md 模板

```markdown
# Content Blueprint

## 页面级大纲

### 页面 1: {slug} ({pageType})
- **H1:** {title}
- **H2 序列:**
  1. {h2-1}
     - {key points / data}
  2. {h2-2}
     - {key points / data}
  3. ...
- **关键 schema:** {Service / Product / Article / FAQPage}
- **入口链 (本页链入):** {来自哪些现有页面}
- **出口链 (本页链向):** {链向哪些现有页面, 至少 3 条 Tier1}
- **复用现有 section:** {SubpageHero / TrustBadges / Capabilities / QualityControl / etc.}

### 页面 2: ...
```

---

## 10. implementation-notes.md 模板

```markdown
# Implementation Notes

## 新增 entity 建议
- {id} ({category}) — 需要先演进 entity-registry.json schema

## keywordMap 增量建议
- {短语} → /{slug}/
- {短语} → /{slug}/

## 内部链接候选 (避免与 SEMANTIC_CLOSURE §4.4 冲突)
- {from page} → {to page}: {anchor text}
- {from page} → {to page}: {anchor text}

## i18n 优先级
- [ ] en (强制)
- [ ] zh (推荐)
- [ ] de / ja / es (按需求)

## 预估工作量
- 页面数: {n}
- entity 演进: {n 个}
- keywordMap 增量: {n 条}
- i18n 翻译: {n 个语言}
- 风险点: {列出}

## V2.0 STEP 2 候选谓词 (待评审, 不进入 entity-registry)
- {新谓词} — {理由}
```

---

## 11. APPROVED.md 模板 (Reviewer 创建)

```markdown
---
approver: {name}
date: YYYY-MM-DD
package_path: knowledge-packages/{seed-slug}/
checks:
  - [ ] 所有 entity id 已对齐 entity-registry.json (无冲突)
  - [ ] relationships 仅使用 7 个已支持谓词
  - [ ] evidence E0-E2 claim 未标记为可入 schema (per V2.0 §5, E0/E1 为最低)
  - [ ] content-blueprint slug 通过 scripts/check-undefined-slugs.mjs
  - [ ] 不引入 V2.0 22 谓词之外的关系
  - [ ] 在 memory-bank/activeContext.md 追加 1 行记录
  - [ ] **IMPLEMENTATION_BRIEF.md 已生成** 并与 Knowledge Package 字段对齐 (B-Prime+ 要求)
notes: "{任何额外说明}"
---

# APPROVED — {Seed Entity}

本 Knowledge Package 已通过 Review, 可被 AstroFlow `.clinerules/knowledge-package-handling.md` 消费。
```

---

## 12. 状态机 (B-Prime+)

```
DRAFT ──(作者提交)──> IN REVIEW ──(Reviewer 决策)──> APPROVED
                                          │
                                          └──> REJECTED ──(归档)──> knowledge-packages/_archive/

APPROVED ──(生成 Brief)──> APPROVED + BRIEF_READY ──> AstroFlow 消费
                                    │
                                    └──> REJECTED (回到 DRAFT, 重新 Review)
```

**关键约束**:
- DRAFT / IN REVIEW 状态 — Cline **不可**消费
- APPROVED 状态 — Knowledge Package 已通过 Review，但 Brief 尚未生成 → **Cline 仍不可消费**
- APPROVED + BRIEF_READY 状态 — Brief 已生成并校验 → **Cline 可按 `.clinerules/knowledge-package-handling.md` Step 0 协议消费**
- REJECTED 状态 — 不消费，归档到 `knowledge-packages/_archive/`
- **Brief 优先原则**: Cline 只读取 `IMPLEMENTATION_BRIEF.md`，不读取 Knowledge Package 其它文件 (除非 Brief 显式引用)

---

## 13. 与 AstroFlow 的边界

| 关注点 | Knowledge Package | AstroFlow 正式系统 |
|---|---|---|
| 实体真源 | ❌ 不作为 | ✅ `entity-registry.json` |
| Schema 实现 | ❌ 不实现 | ✅ `src/lib/schema.ts` |
| URL 路由 | ⚠️ 仅建议 | ✅ 由 sitemap 驱动 |
| 内链 | ⚠️ 仅建议 | ✅ 由 `keywordMap` 驱动 |
| 内容文案 | ⚠️ 蓝图 | ✅ `.astro` 页面 |
| 部署 | ❌ 不部署 | ✅ `npm run deploy:inc` |

---

## 14. IMPLEMENTATION_BRIEF.md (B-Prime+ 新增，给 Cline 看的精简执行上下文)

### 14.1 设计动机

Knowledge Package 完整但体积大 (~15 KB, 8 文件)，直接喂给 Cline 会消耗过多上下文。
**Implementation Brief** 是 Knowledge Package 的精简执行视图:

- **体积**: ≤ 4 KB
- **字段**: 仅包含 Cline 执行所需的最小集合
- **生成时机**: Knowledge Package 进入 `APPROVED + BRIEF_READY` 状态后
- **生成方**: Human / Claude / Gemini (post-APPROVED only)
- **消费方**: 仅 Cline (不再直接读 Package 其它文件)

### 14.2 Brief 文件位置

```text
knowledge-packages/
└── {seed-slug}/
    ├── ... (其他文件)
    └── IMPLEMENTATION_BRIEF.md   ← 新增
```

### 14.3 Brief 模板

参见: `docs/prompts/IMPLEMENTATION_BRIEF_TEMPLATE.md`

Brief 字段包括: Topic / Approved Entities / Approved Relationships / Content Architecture / Information Gain / Evidence Anchors / Required Pages / Required Changes / Risks / Source Files / STRICT EXECUTION RULES。

### 14.4 Brief 与 Package 的双向可追溯

- Brief 中的每一项 (Entities / Relationships / Evidence) 必须可追溯到 Package 中的具体文件/行
- Package 任何变更后必须重新生成 Brief 并校验
- Brief 与 Package 不一致 → Cline 拒绝执行 (per `.clinerules/knowledge-package-handling.md` Step 0)
