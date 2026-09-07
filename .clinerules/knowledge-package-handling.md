# Knowledge Package Handling — AstroFlow Consumption Interface

> **Scope:** This rule ONLY applies when Cline is asked to consume a V2.0 Knowledge Package that has been APPROVED by human review. It does NOT load V2.0 itself, and it does NOT auto-trigger V2.0.

---

## 1. 触发条件 (Trigger)

本规则在以下任一条件成立时生效:

1. 用户明确说: "消费 knowledge-packages/{slug}/" 或 "按 APPROVED Knowledge Package 实现"
2. 用户提供 `knowledge-packages/{slug}/APPROVED.md` 路径并要求落地
3. 用户引用某 Knowledge Package 中的实体/关系/蓝图作为输入

**不触发条件:**
- ❌ 用户仅提到 V2.0 但未提供 Knowledge Package 路径 → 询问是否已 APPROVED
- ❌ Cline 自动判断任务"像 V2.0 任务" → **绝不自动触发**, 必须用户显式声明

---

## 2. 职责边界 (Authority Boundaries)

| 关注点 | V2.0 / Knowledge Package | AstroFlow (.clinerules + SEMANTIC_CLOSURE) |
|---|---|---|
| 角色 | 研究 / 分析 / 规划 | 工程实现 / 安全落地 |
| 实体真源 | ❌ 不作为 | ✅ `data/entities/entity-registry.json` |
| Schema 实现 | ❌ 不实现 | ✅ `src/lib/schema.ts` (唯一) |
| URL 路由 | ⚠️ 仅建议 | ✅ 由 `dist/sitemap*.xml` 驱动 |
| 内部链接 | ⚠️ 仅建议 | ✅ 由 `keywordMap` (`astro.config.mjs`) 驱动 |
| 内容文案 | ⚠️ 蓝图 | ✅ `.astro` 页面正文 |
| JSON-LD 注入 | ❌ 禁止在 .astro 中手写 | ✅ `BaseLayout.astro` 经 `buildPageGraph()` |
| Cline 自动上下文 | ❌ 不进入 | ✅ 本文件 + `.clinerules/工作区 Rules.txt` |

---

## 3. 消费协议 (Consumption Protocol)

按以下顺序严格处理 APPROVED Knowledge Package:

### Step 0 — 验证 IMPLEMENTATION_BRIEF.md 存在 (B-Prime+ 入口)
- 检查 `knowledge-packages/{slug}/IMPLEMENTATION_BRIEF.md` 是否存在
- 检查 `APPROVED.md` 同时存在 (BRIEF_READY 状态)
- 若 Brief 不存在 → **拒绝消费**，要求先按 `docs/prompts/IMPLEMENTATION_BRIEF_TEMPLATE.md` 生成 Brief
- 若 APPROVED.md 缺 checks → 拒绝消费，转人工 Review

> ⚠️ **核心变更**: 旧版本第一步检查 APPROVED.md；B-Prime+ 改为第一步检查 IMPLEMENTATION_BRIEF.md。
> Brief 是 Cline 的唯一执行入口，不直接读取 Package 其它文件。

### Step 0.5 — 上下文隔离 (CRITICAL, B-Prime+)

Cline 在消费 Knowledge Package 时，**必须严格隔离上下文**:

- ❌ **DO NOT** 读取 `docs/prompts/MASTER_PROMPT_V2.md` (除非用户明确指示)
- ❌ **DO NOT** 读取 Knowledge Package 中 Brief 之外的文件 (除非 Brief 显式引用)
- ✅ **DO** 仅读取: `IMPLEMENTATION_BRIEF.md` + 相关代码 + `.clinerules/` 已有规则
- ✅ **DO** 在 Brief 引用某文件 (如 `content-blueprint.md`) 时，按需读取该文件，不预读其它

**原理**: V2.0 (~28 KB) + Package (~15 KB) 同时加载会消耗 ~49 KB 上下文，仅剩少预算用于实际任务。
Brief (≤4 KB) 把上下文预算降到 ~12 KB，提升 Cline 实际执行注意力。

### Step 1 — 验证 APPROVED 标记 (BRIEF_READY 后)
- 在 Step 0 通过后，校验 `knowledge-packages/{slug}/APPROVED.md` 存在且所有 `checks:` 已勾选
- 若 BRIEF_READY 状态但 APPROVED.md 缺项 → 拒绝消费，转人工 Review

### Step 2 — 实体对齐
对 `entities.json` 中每个实体:
- `registry_status: EXISTS` → 复用 `registry_id`, 禁止创建重复条目
- `registry_status: NEW` → 提示用户先演进 `entity-registry.json` schema (添加新 id)
- `registry_status: CONFLICT` → **拒绝消费**, 转人工

### Step 3 — 关系过滤
对 `relationships.json` 中每个关系:
- 仅接受 entity-registry.json 已支持的 **7 个谓词**:
  - `conformsTo`, `usedIn`, `usesMaterial`, `usesProcess`, `usesEquipment`, `providesService`, `hasCaseStudy`
- 其他谓词 → 写入 `knowledge-packages/{slug}/implementation-notes.md` "V2.0 STEP 2 候选谓词 (待评审)" 区, **不进入 entity-registry**

### Step 4 — Evidence 过滤 (按 Brief 中已翻译的标记执行, B-Prime+)

**不再让 Cline 自己解读 E0-E6** — Brief 表格的 "Translation to AstroFlow" 列已预先翻译:

- **schema-eligible** → Cline 可写入 JSON-LD (需先校对 entity-registry 现有条目)
- **background-only** → Cline 仅作页面背景叙述，**不入 schema**
- 未标注 → 拒绝执行，转人工

**Evidence 等级编号 (per V2.0 §5, NOT AstroFlow 现有体系)**:
- E0 = Unverified
- E1 = Authoritative Standard (ASTM/ISO 等)
- E2 = Primary Technical Source (厂商 datasheet)
- E3 = Technical Literature (peer-reviewed)
- E4 = Verified Internal Company Evidence
- E5 = Secondary Source
- E6 = Analytical Inference (最低)

**翻译规则** (默认，Brief 可覆盖):
- E0, E1 → background-only
- E2, E3, E4, E5 → schema-eligible (按需)
- E6 → background-only (必须显式标注 "analytical inference")

> ⚠️ Cline 不应自行重新映射 E0-E6 编号。Brief 中已标注 → 直接执行。

### Step 5 — Blueprint 落地
- 按 `content-blueprint.md` 创建/更新 `.astro` 页面
- 复用现有 section 组件 (SubpageHero / TrustBadges / Capabilities / QualityControl / Applications)
- 内部链接通过 `keywordMap` + `src/lib/auto-inline-links.ts`, 不手写 `<a>` 锚文本

### Step 6 — Schema 注入
- **不重写** `src/lib/schema.ts`
- 若需新增 schema 类型 → 先在 `schema.ts` 添加 `buildXxx()` 函数, 再由 `BaseLayout.astro` 调用
- 禁止在 .astro `<script>` 中手写 JSON-LD

### Step 7 — URL 闭环
- 新页面 URL 必须已存在于 `dist/sitemap*.xml` 或由 `getStaticPaths` 生成
- 严禁凭空设计 URL 路径 (遵循 `.clinerules/.clinerules.md` 红线)

---

## 4. 写入边界 (Write Boundaries)

### ✅ 允许写入
- `data/keywords/main-db.json` (keywordMap 增量短语)
- `data/entities/entity-registry.json` (新增 entity, 需 schema 演进)
- `.astro` 页面文件 (按 content-blueprint)
- `memory-bank/activeContext.md` (追加 1 行消费记录)
- `docs/prompts/IMPLEMENTATION_BRIEF_TEMPLATE.md` (新增/扩展 Brief 模板时)
- `knowledge-packages/{slug}/IMPLEMENTATION_BRIEF.md` (post-APPROVED 生成 Brief 时)

### ❌ 禁止写入
- `src/lib/schema.ts` 重写 (扩展时改, 但不"覆盖")
- `.astro` 内联 `<script type="application/ld+json">` (统一由 `buildPageGraph()`)
- 任意 `.astro` 文件中手写 JSON-LD
- 凭空创建 URL 路由 (无 sitemap 对应)
- 跳过 APPROVED Review 直接消费
- 修改 `SEMANTIC_CLOSURE.md` / `.clinerules/工作区 Rules.txt` / `.clinerules/.clinerules.md` (除非用户明确要求)

---

## 5. 落地前自检 (Pre-Landing Self-Check)

每次消费 Knowledge Package 前, 必须自问:

- [ ] `IMPLEMENTATION_BRIEF.md` 存在且 `APPROVED.md` 处于 BRIEF_READY 状态? (B-Prime+ 入口)
- [ ] `APPROVED.md` 存在且所有 `checks` 已勾选?
- [ ] 所有 entity id 已与 `entity-registry.json` 对齐?
- [ ] 所有 relationships 限定在 7 个已支持谓词内?
- [ ] evidence E0-E2 claim 未被用于 schema (按 Brief 翻译执行, 不自行重映射)?
- [ ] content-blueprint slug 通过 `scripts/check-undefined-slugs.mjs`?
- [ ] keywordMap 增量不与现有短语冲突 (避免重复 `<a>` 包裹)?
- [ ] URL 路径已存在于 sitemap 或将由 getStaticPaths 生成?
- [ ] 已在 `memory-bank/activeContext.md` 追加消费记录?
- [ ] **上下文隔离**: 未读取 `MASTER_PROMPT_V2.md` (除非用户明确指示)?

任一未满足 → **拒绝落地**, 转人工。

---

## 6. 后续决策 (Out-of-Scope for Now)

以下事项当前**不**在本规则范围, 由用户后续决策:

- [ ] V2.0 自动触发器 → **当前不做**, 由人类主动调用
- [ ] Knowledge Package → entity-registry 自动合并 → **当前不做**, 必须人工 Review
- [ ] V2.0 多 LLM 交叉验证 → 待评估
- [ ] Knowledge Package 版本控制 / Git LFS → 待评估

---

## 7. 错误处理 (Error Handling)

| 场景 | 行为 |
|---|---|
| APPROVED.md 不存在 | 拒绝消费, 输出"请先经人工 Review" |
| entity id 冲突 | 列出冲突项, 转人工, 不写入 entity-registry |
| 关系谓词不支持 | 降级到 implementation-notes.md, 不写入 entity-registry |
| evidence E0-E2 入 schema | 拒绝写入, 列出违规 claim |
| slug 含 undefined | 跑 `scripts/check-undefined-slugs.mjs`, 报告 issue, 等待修复 |
| URL 不在 sitemap | 拒绝创建页面, 提示先生成 sitemap 条目 |

---

## 8. 与现有规则的关系

- `.clinerules/.clinerules.md` (URL 红线) — **优先级最高**, 任何 URL/路径操作必须遵守
- `.clinerules/工作区 Rules.txt` — 同时加载, 工程纪律优先
- `SEMANTIC_CLOSURE.md` — 同时加载, 闭环工程与 Validation Checklist 优先
- 本文件 — 仅在消费 Knowledge Package 时生效, **不覆盖** 上述三套规则

---

## 9. 一句话原则

> **V2.0 不属于 AstroFlow；AstroFlow 只是 V2.0 知识架构的一个实现端。**
> Knowledge Package 是研究产物, 不是数据源; APPROVED 是消费的唯一门槛。
