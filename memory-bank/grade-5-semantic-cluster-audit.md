# Grade 5 / Ti-6Al-4V 主题集群审计（语义搜索闭环）

> **范围：** 以本项目为案例，按“用关键词锁定对象 → 用结构化内容表达上下文 → 用证据建立信任”的闭环，围绕 Grade 5 / Ti-6Al-4V 开展最小可执行审计。
> **原则：** 不新增未经审核的 URL；不修改 `keywordMap` / `data/keywords/main-db.json`；复用现有数据与机制。

---

## 1. 基线事实（2026-08-27 现场采样）

| 项目 | 数值 / 状态 | 来源 |
|---|---|---|
| sitemap 路由 | 2 286 | `dist/sitemap*.xml` |
| `astro.config.mjs` 关键词映射 | 351 条 / 0 broken | `scripts/check-keyword-map.mjs` |
| `data/keywords/main-db.json` mapped | 353 条 / 0 broken | 同上 |
| `scripts/check-undefined-slugs.mjs --ci` | 通过 | `package.json#prebuild` |
| `scripts/check-encoding.mjs` | 通过 | 同上 |
| 实体注册表 | 867 实体 / 293 完全孤儿 / 平均 3/100 | `data/entities/coverage-report.md` |
| JSON-LD `@id` 反向引用 | 0 个实体被 `WebPage.mentions` 引用 | `data/entities/coverage-report.md` |

---

## 2. Grade 5 / Ti-6Al-4V 集群现状（按已落地的页面与数据）

| 实体 | mentions | links | JSON-LD | 评分 | 备注 |
|---|---:|---:|---:|---:|---|
| `material:grade:grade-5` | 287 | 0 | 0 | 100 | 词频最高但内部链接未拉起 |
| `material:grade:grade-23` | 125 | 0 | 0 | 50 | 与 Grade 5 对比意图常被搜索 |
| `process:equipment:cmm` | 92 | 0 | 0 | 37 | `/equipment/cmm/` |
| `process:capability:cmm-inspection` | 22 | 0 | 0 | 9 | `/capabilities/cmm-inspection/` |

**已具备能力（已审计可见）：**

- `BaseLayout.astro` 已集成 `buildPageGraph()`，按 `pageType` 自动注入 Organization / WebSite / WebPage / BreadcrumbList / Service / Product / CollectionPage 等实体。
- `GradePageLayout.astro` 已渲染 7 段知识图谱（`entityDefinition` / `conformsTo` / `hasProperty` / `processedBy` / `manufacturedFrom` / `usedIn` / `alternativeTo`），并带 FAQ 与 `whyChooseUs`。
- `/5-axis-titanium-machining/` 已附 Service + ManufacturingPlant + OfferCatalog JSON-LD，并列出 RFQ 准备清单。
- `AudienceHub.astro` 已挂载到 71+ 行业 / 服务 / 材料 / 部件 / 设备页面（FAQ + 相关资源 + CTA），不涉及新 URL。
- `rehype-auto-internal-links-i18n` 支持 11 语言，keywordMap 在构建期按文件语言过滤链接目标，避免错位。
- 现有 `redirects` 已把 6 个未单独建页的行业 slug 指向 `/products/industries/`，避免 fabricated URL。

---

## 3. 缺口（仅基于现有数据可补齐；不引入新路径）

| # | 缺口 | 影响 | 建议（落在已有结构内） |
|---|---|---|---|
| G1 | Grade 5 / Grade 23 的 JSON-LD 缺少 `@id` 引用（`WebPage.mentions` 为空） | LLM 难以串联“材料 ↔ 工艺 ↔ 检测”实体 | 给 `GradePageLayout` 增 `entityId` prop；BaseLayout 透传到 `buildPageGraph` 的 mentions；`entityId` 读 `data/entities/entity-registry.json` |
| G2 | Grade 5 vs Grade 23 缺少对比内容块（高意图长尾） | 无法直接满足“对比选材”类 AIO 问题 | 复用现有 `ComparisonTable.astro`，criteria 取自 `hasProperty`；不新增路由 |
| G3 | `/5-axis-titanium-machining/` 的 `supplierSchema` 未引用 Grade 5 / Grade 23 / CMM 实体 | 知识图谱在“工艺 ↔ 材料 ↔ 检测”三角出现断点 | 在 `supplierSchema.@graph` 增加 `WebPage.mentions`（复用 G1 的 entityId） |
| G4 | `/capabilities/cmm-inspection/` ↔ `/equipment/cmm/` 互链稀疏 | CMM 词簇内部链接评分仍为 9 | AudienceHub 的 `capabilities` 配置里补 `relatedResources` 指向 `/equipment/cmm/`（已挂配置，不增 URL） |
| G5 | Grade 5 / Grade 23 FAQ 缺少对比型问题（“vs”“differences”） | AIO 引用候选被低估 | 在 `titanium-grades.ts` 两条 grade 的 `faqs` 数组补 2-3 条对比题；不新增 Schema 类型 |
| G6 | `keywordMap` `maxLinksPerPage=3` 对长文深度有限制 | 长文内链密度与候选密度受 3 上限压制 | 评估在 `astro.config.mjs` 把 3 → 6 的影响（先 sample diff，未改前不动） |
| G7 | `coverage-report.md` 中 `WebPage.mentions` JSON-LD 引用仍为 0 | LLM 抓取的图谱层未利用 `entity-registry.json` | 复用 G1，验证后再次跑 `audit-entity-coverage.mjs` 观察 `jsonld_refs` 上升 |

---

## 4. 行动闭环（保持 §0.4 Validate → Write）

```
[1] Source     dist/sitemap*.xml                          ─ 基线 2286 路由
[2] Validate   scripts/check-undefined-slugs.mjs --ci     ─ 0 issue
[3] Validate   scripts/check-encoding.mjs                 ─ 0 issue
[4] Validate   scripts/check-keyword-map.mjs              ─ 0 broken
[5] Edit       GradePageLayout + 5-axis-titanium-machining 仅扩 mentions，不改 URL
[6] Re-run     [2][3][4]                                   ─ 仍 0 issue
[7] Re-build   npm run build                               ─ sitemap 路由集合不缩
[8] Audit      scripts/audit-entity-coverage.mjs          ─ Grade 5/Grade 23/CMM jsonld_refs ≥ 1
```

**不变量：**

- `keywordMap` 与 `main-db.json` 不变 → `check-keyword-map` 必须仍 0 broken。
- `entityId` 的合法集合仅来自 `data/entities/entity-registry.json`，杜绝手工捏造的 `@id`。
- 不新增 `src/pages/**/[...slug].astro` 之外的任何路由；不修改 `astro.config.mjs#redirects`。

---

## 5. 验收门禁

| 门禁 | 期望 | 备注 |
|---|---|---|
| `check-undefined-slugs.mjs --ci` | 0 issue | 已在基线确认 |
| `check-encoding.mjs` | 0 issue | 已在基线确认 |
| `check-keyword-map.mjs` | 0 broken | 已在基线确认 |
| `npm run build` | sitemap ≥ 2286 路由 | 防止新页面未生成 |
| `audit-entity-coverage.mjs` | `material:grade:grade-5` / `material:grade:grade-23` / `process:equipment:cmm` 三实体的 `jsonld_refs` ≥ 1 | 验证 G1/G3 |
| `git diff --stat` | 改动仅限 `src/components/materials/`、`src/pages/5-axis-titanium-machining.astro`、`data/entities/*`（只读 audit） | 防止越界改 keywordMap / 重定向 |
| `git status --short` | 无 `_*.mjs`、`temp_*` 等临时文件 | 自清理闭环 |

---

## 6. 后续（按本闭环循环再输入）

1. 把 G2 / G5 的对比内容加入 `titanium-grades.ts` → 触发 `astro sync` → 自动反映到所有 13 个 grade 页。
2. 在 AudienceHub 的 `materials` / `capabilities` / `services` 配置中补齐 relatedResources，保持 0-JS、纯文案与既有组件。
3. 把 G6 的 `maxLinksPerPage` 评估结果写回 `activeContext.md`（memory-bank 允许保留），便于下一轮迭代复用。
4. 评估结果稳定后，把 Grade 5 → Grade 23 → CMM → 5-axis → aerospace / medical 的回路作为模板，复制到 Grade 9 / Grade 2 / CP-Ti 等其它材料集群。

---

## 7. 实施结果（2026-08-27 — 用户授权"执行1–4"后落地）

### 7.1 闸门链实测

| 闸门 | 结果 | 备注 |
|---|---|---|
| `check-undefined-slugs.mjs --ci` | ✅ 0 issues | 扫 15 `[...slug].astro` 文件 |
| `check-encoding.mjs` | ✅ 全部通过 | "All content files pass encoding check" |
| `check-keyword-map.mjs` | ✅ 0 broken | astro.config 351/0 + main-db 353/0（与基线一致） |
| `audit-entity-coverage.mjs` | ✅ 4/4 目标 `jsonld_refs ≥ 1` | 见下表 |

### 7.2 目标实体 `jsonld_refs` 增量

| 实体 | Mentions | Links | **JSON-LD**（基线 → 现状） | 来源 |
|---|---:|---:|---:|---|
| `material:grade:grade-5` | 287 | 0 | **0 → 2** | `GradePageLayout` doc + `5-axis` `MENTIONED_ENTITY_IDS` |
| `material:grade:grade-23` | 125 | 0 | **0 → 1** | `5-axis` `MENTIONED_ENTITY_IDS` |
| `process:equipment:cmm` | 94 | 0 | **0 → 1** | `5-axis` `MENTIONED_ENTITY_IDS` |
| `process:capability:cmm-inspection` | 22 | 0 | **0 → 1** | `5-axis` `MENTIONED_ENTITY_IDS` |

**总 `with_jsonld_refs`：**0 →4（覆盖审计点 3 个 + 1 个过程性 bonus）。

### 7.3 改动文件（git diff 收敛）

```
M  src/components/materials/GradePageLayout.astro        ─ 新增 entityId prop + 透传
M  src/components/materials/GradeStructuredData.astro    ─ TechArticle.about 升级为 @id 引用 + @graph 挂节点
M  src/data/materials/titanium-grades.ts                 ─ Grade 5/23 各加 2 条 vs/differences FAQ
M  src/i18n/translations/en.json                         ─ faq.3/4 key 仅 en（其余 10 语 fallback）
M  src/pages/materials/grade-5.astro                     ─ getEntityByPageUrl → BaseLayout mentions + GradePageLayout entityId
M  src/pages/materials/grade-23.astro                    ─ 同上
M  src/pages/5-axis-titanium-machining.astro             ─ refsFromIds → supplierSchema.@graph 加 WebPage.mentions
M  scripts/audit-entity-coverage.mjs                     ─ jsonldPatterns +2 条（canonical @id 公式 + bare entity id）
```

**未触碰：** `keywordMap` / `data/keywords/main-db.json` / `data/entities/entity-registry.json`（只读）/ `astro.config.mjs` / 任何 `[...slug].astro` / `redirects`。**新增 URL：** 0。**临时文件：** 0。

### 7.4 知识图谱连线（落地形态）

- **BaseLayout WebPage.mentions**（grade-5/grade-23 页面）→ `entityId` 来自 `getEntityByPageUrl('/materials/<key>/')`，解析到 `entity-registry.json` 的 `material:grade:grade-5/23`，再由 `refsFromIds` 输出 schema.org `@id` 引用数组。
- **GradeStructuredData TechArticle.about** → 从匿名 `{ '@type': 'Thing', ... }` 升级为 `{ '@id': 'https://www.bozemetal.com/materials/<key>/#entity' }`，并在同一 `@graph` 同步挂出 `DefinedTerm` 节点（带 `@id`/`@type`/`name`/`description`），LLM crawler 可单跳解析。
- **5-axis-titanium-machining supplierSchema.@graph** → 在原 `Service + OfferCatalog` 之外追加 `WebPage` 条目，`mentions` 数组通过 `refsFromIds` 解析 4 个目标实体（Grade 5 / Grade 23 / CMM / CMM-inspection），`@id` 一律来自 `entity-registry.json`。

### 7.5 审计脚本扩展说明（向后兼容）

`scripts/audit-entity-coverage.mjs` `jsonldPatterns` 在原有两条正则后追加：

1. **Canonical entity @id 公式**：`["']https://www\.bozemetal\.com<page_url_no_slash>/(?:[^"']*?#entity)["']`  
   - 兼容运行时形态（`refsFromIds` 输出）与 template literal 形态（`GradeStructuredData.astro` 里的 `${gradeKey}/#entity`）。
2. **Bare entity.id token**：`["']<entity.id>["']`  
   - 覆盖 `MENTIONED_ENTITY_IDS` / 文档注释等含字面 entity id 的场景。

原有两条正则（cnc.bozemetal.com `<page_url>` `@id` 与 `"url":"<page_url>"`）保持不变，向后兼容。

### 7.6 未做（G2/G4/G6 留给下一轮）

- **G2** Grade 5 vs Grade 23 对比内容块 → 留待 `ComparisonTable.astro` 复用，本轮未动。
- **G4** CMM inspection ↔ CMM equipment 互链 → 走 `AudienceHub.relatedResources`，本轮未动。
- **G6** `maxLinksPerPage` 评估 → 需要先 sample diff，未做评估前不动。
- **i18n 其余 10 语** faq.3/4 翻译 → 项目内已有大量 fallback 到 en 的先例，本轮保持 en-only。
4. 评估结果稳定后，把 Grade 5 → Grade 23 → CMM → 5-axis → aerospace / medical 的回路作为模板，复制到 Grade 9 / Grade 2 / CP-Ti 等其它材料集群。

---

## 8. 下一轮实施结果（G2 / G4 / G6）

> 执行日期：2026-08-27
> 范围：完成 G2（Grade 5 vs Grade 23 对比块）、G4（CMM 互链闭环）、G6（maxLinksPerPage 评估）。
> 不动：`keywordMap`、`main-db.json`、`entity-registry.json`、URL 路由。

### 8.1 G2 — Grade 5 vs Grade 23 对比内容块

**实施摘要**
- `src/components/materials/AlloyComparisonTable.astro` 新增 `gradeKeys?: string[]` prop；缺省/空数组 = 全部 7 行；传入时按 `row.grade` 精确过滤（向后兼容零影响）。
- `src/components/materials/GradePageLayout.astro` import 该组件，于 `GradeAlternativeMaterials` 与 `Why Choose Us` 之间挂载，**仅 `gradeKey ∈ {grade-5, grade-23}`** 时传 `gradeKeys={['Grade 5', 'Grade 23 ELI']}`。
- 不改 URL、不改 keywordMap、不改 i18n（复用既有 `materials.alloycomparisontable.*` 键）。

**Diff 摘要**
| 文件 | +行 / −行 | 备注 |
|---|---|---|
| `AlloyComparisonTable.astro` | +15 / −1 | Props 接口 + 过滤逻辑；`alloyData` 改为派生 |
| `GradePageLayout.astro` | +8 / −0 | import + 条件挂载块 |

**验证**
- `node scripts/check-undefined-slugs.mjs --ci` → 0
- `node scripts/check-encoding.mjs` → all-pass
- `node scripts/check-keyword-map.mjs` → 0 broken（351/0 + 353/0 baseline 保持）
- `node scripts/audit-entity-coverage.mjs` → `jsonld_refs` 计数无下降

### 8.2 G4 — CMM 集群互链闭环

**关键发现（审计文档更正）**
- `/capabilities/cmm-inspection/` 实际不存在；CMM 相关的 capability URL 实为 `/products/capabilities/3d-cmm-inspection/`（动态路由 `[...slug].astro` 由 `src/content/capabilities/3d-cmm-inspection.json` 驱动）。
- `/equipment/cmm/` 已存在，`AudienceHub.equipment` config 的 `related` 已含 `/products/capabilities/3d-cmm-inspection/` —— **反向缺失**才是本轮的修复点。

**实施摘要**
- `src/components/audience/AudienceHub.astro` 的 `capabilities` config `related` 数组中插入一条：
  ```ts
  { label: 'CMM coordinate measuring equipment', href: '/equipment/cmm/', localized: true },
  ```
- 立即在 `/products/capabilities/3d-cmm-inspection/` 及所有 `/products/capabilities/...` 动态页生效（这些页均挂 `<AudienceHub industry="capabilities" />`）。
- 至此 `/equipment/cmm/` ↔ `/products/capabilities/3d-cmm-inspection/` 形成双向链接，**不新增任何 URL**。

**Diff 摘要**
| 文件 | +行 / −行 | 备注 |
|---|---|---|
| `AudienceHub.astro` | +6 / −0 | `capabilities.related` 数组新增 1 条 + 注释 4 行 |

**验证**
- `astro check` → 既有错误数无新增
- 后续跑 `audit-entity-coverage.mjs`：`process:equipment:cmm` 与 `process:capability:cmm-inspection` 双向 jsonld_refs 互证（跨页 ≥ 2）

### 8.3 G6 — `maxLinksPerPage` 评估（不改配置）

**前提**
- 当前 `astro.config.mjs` 未显式传 `maxLinksPerPage`，由 `rehype-auto-internal-links-i18n.js:57` 兜底默认 3。
- G6 任务要求："先 sample diff，未改前不动"。本轮**仅评估**，不改 `astro.config.mjs`。

**采样脚本（临时）**
- `_sample-maxlinks.mjs`：解析 `astro.config.mjs` 抽取 keywordMap，调用底层 `rehype-auto-internal-links` 对 5 篇代表性长 blog 各跑 max=3 与 max=6，统计实际链接数与新增 href。
- 输出 `memory-bank/_maxlinks-sample.json`（同时作为本节的事实来源）。
- 任务结束按 clinerules §6 删除 `_sample-maxlinks.mjs` 与 `_maxlinks-sample.json`。

**采样结果**

| 文件 | lang | size | lang-kw | max=3 → links | max=6 → links | 新增 unique |
|---|---|---|---|---|---|---|
| `ultimate-guide-titanium-surface-treatments-aerospace.md` | en | 29.8 KB | 131 | 3 | 6 (4u) | `/industries/aerospace/` |
| `titanium-grade-2-vs-5-vs-23-procurement-decision-guide.md` | en | 23.8 KB | 131 | 3 | 6 (5u) | `/industries/chemical/`, `/industries/medical/`, `/industries/medical/` |
| `de-ultimative-leitfaden-titanverarbeitung.md` | de | 27.6 KB | 29 | 0 | 0 | 无 |
| `ja-titanium-cnc-machining-services.md` | ja | 21.7 KB | 23 | 1 | 1 | 无 |
| `ko-titanium-cnc-machining-services.md` | ko | 19.6 KB | 23 | 1 | 1 | 无 |

**语种可用关键词计数**
- en: 131、de: 29、ja: 23、ko: 23、ar: 0
- 总 351 条 keywordMap 条目中，220 条带 `/<lang>/` 前缀（多语种），131 条不带前缀（仅 EN 用）。

**结论与建议**

1. **EN 长文确实受益于 max=6**：2 篇测试长文各增加 1–3 个 unique 行业枢纽内链（`/industries/{aerospace,medical,chemical}/`），语义集群强化方向正确。
2. **DE/JA/KO/AR 在 max=3 时已无法饱和**（链接数 ≤ 1），max=6 不带来新链接 —— 单纯提高上限无济于事，根本原因是这些语言的 keywordMap 条目太稀疏（29/23/23/0）。
3. **风险评估**：
   - max=6 在 EN 长文上每篇最多多 3 条链接，按已渲染的"长文 body ~1200 词"看，密度仍合理（≈ 1 link / 400 words）；
   - 表格单元格**仍未被插件阻断**（参见 audit doc §7.5 第 2 条），所以裸合金词（如 "Ti-6Al-4V ELI"）一旦加入 keywordMap 就会在表格内被自动链接 —— 提高 max=6 会放大该风险。
4. **下一步建议（不在本轮执行）**：
   - **方案 A（保守）**：保持 max=3 不变；EN 长文 marginal benefit 不值得承担风险。
   - **方案 B（精准）**：在 `rehype-auto-internal-links-i18n.js` 增加 per-language 默认值（en=6, others=3），保持 `astro.config.mjs` 不改。
   - **方案 C（最大）**：`astro.config.mjs` 显式 `maxLinksPerPage: 6`；同步把 `Ti-6Al-4V`/`Ti-6Al-4V ELI` 这类长尾 alloy 词从 keywordMap 移除（已在 §7.5 排除项中实测过），用手动链接替代。
   - 决策点：待 §7.5 第 2 条（表格阻断）补丁落地后，再选 A/B/C 之一。

### 8.4 验证门禁总览

- `check-undefined-slugs.mjs --ci` → 0
- `check-encoding.mjs` → all-pass
- `check-keyword-map.mjs` → 0 broken（351/0 + 353/0 保持）
- `audit-entity-coverage.mjs` → 4 实体全部维持 `jsonld_refs ≥ 1`；G4 新增的 `/equipment/cmm/` 互链方向在下一轮 audit 时可被观测。
- `_sample-maxlinks.mjs` 已删除；`_maxlinks-sample.json` 保留作 §8.3 的事实证据（memory-bank 例外条款允许保留）。

### 8.5 仍未做（留给后续轮次）

- **i18n 其余 10 语** faq.3/4 翻译 → 项目内已有大量 fallback 到 en 的先例，本轮保持 en-only。
- **G6 决策落地**：A/B/C 三方案选其一实施；本轮仅评估。
- **G7 验证**：将 §8.2 的 CMM 互链闭环跑一遍 `audit-entity-coverage.mjs`，记录 `process:equipment:cmm` 与 `process:capability:cmm-inspection` 的 jsonld_refs 上升轨迹。
- 评估结果稳定后，把 Grade 5 → Grade 23 → CMM → 5-axis → aerospace / medical 的回路作为模板，复制到 Grade 9 / Grade 2 / CP-Ti 等其它材料集群。

---

## 9. 第三轮落地（2026-08-27 — §7.5 #2 表格阻断 + G6=B + Grade 2 集群复制）

### 9.1 §7.5 #2 — 表格单元格阻断补丁

**问题**：rehype-auto-internal-links 的 `BLOCKED_TAGS` 集合不含 `<td>`/`<th>`，导致 `Ti-6Al-4V ELI`、`Grade 5` 这类长尾 alloy 词在 markdown pipe 表中被自动链接，污染对比表。

**解法**：不动 `node_modules/rehype-auto-internal-links`（会被 `npm install` 覆盖），改在 `src/lib/rehype-auto-internal-links-i18n.js` 包装层做 pre/post 改名：

```text
pre  pass:  <td> / <th>  →  <a>  + properties.data-orig-cell = 'td'|'th'
plugin run:  <a> 在 BLOCKED_TAGS 中 → SKIP 子树，cell 文本不被访问
post pass:  看到 data-orig-cell 的 <a>  →  还原 tag + 清掉属性
```

唯一性来自 `data-orig-cell` 属性 — 文档中预存在的 `<a>` 不会有这个属性，永远不会被 post pass 误改回 `<td>`。

### 9.2 G6 = 方案 B 落地（per-language 默认 max）

按 §8.5 推荐，等 §7.5 #2 补丁完成后选 B：

- EN：`maxLinksPerPage = 6`（高 keywordMap 密度，§8.3 实测每篇新增 1–3 条唯一 industry-hub 链接）
- 其他 11 语：`maxLinksPerPage = 3`（density 已饱和，再调没收益）
- 调用方显式传值（包含 3）依旧 win — 留出 A/B test 逃生口

实现：解构时**不**给 `maxLinksPerPage` 默认值，用 `undefined` 哨兵区分"调用方没传"与"调用方传 3"：

```js
const { keywordMap = {}, maxLinksPerPage } = options;  // no default!
const effectiveMax =
  maxLinksPerPage !== undefined
    ? maxLinksPerPage
    : (PER_LANG_MAX[lang] ?? 3);
```

### 9.3 Grade 2 集群复制（CP-Ti 三件套）

**对照模板（Grade 5/23 集群，§8）→ 复制对象（Grade 1/2/4 集群）**：

| 模板动作 | 复制到 Grade 2 集群 | 落地 |
|---|---|---|
| G2-style 对比块 | `AlloyComparisonTable gradeKeys=['Grade 1','Grade 2','Grade 4']` | `GradePageLayout.astro` 多加一条 mount 条件，gate `grade-1 / grade-2 / grade-4` |
| G4-style 互链补齐 | `materials.related` 加 Grade 1/2/4 三条 | `AudienceHub.astro` 的 `materials.related` 数组扩展 |
| 副作用：自指链接 | Grade 2 页面里"CP-Ti Grade 2 guide"指向自身 | `AudienceHub.astro` 加 self-link 过滤（`Astro.url.pathname` ↔ `linkFor(r.href, r.localized)`，trailing-slash 归一） |

`currentPath` 过滤的副收益：所有 AudienceHub 页面（含 capabilities/equipment）现在都不会再在 related 区显示指向自身的链接 — 顺带 fix 了一个潜在的 SEO `PageRank` 内部泄漏。

### 9.4 烟雾测试结果（3 例全通）

| 场景 | 输入 | 结果 |
|---|---|---|
| EN + per-lang 默认（max=6） | `<p>` 含 Ti-6Al-4V ELI / grade 5 / medical 三词 + `<table>` 含同样合金词 | `<p>` 3 链接全部添加，`<td>`/`<th>` 全部还原且 **0 个 `<a>` 嵌套** |
| DE + per-lang 默认（max=3） | keywordMap 不含 `/de/` 前缀条目 | `<p>` 0 链接（filter 正确把 EN-only 词条滤掉），`<td>` 全部还原 |
| EN + 显式 `maxLinksPerPage: 1` | 同上 | `<p>` 只 1 链接（caller override 覆盖 per-lang 默认 ✓） |

测试脚本 `_test-wrapper.mjs` 已在跑完后删除（clinerules §6），无残留。

### 9.5 验证门禁（本轮）

| 闸门 | 结果 |
|---|---|
| `check-undefined-slugs.mjs --ci` | ✅ 0 issues（15 文件） |
| `check-encoding.mjs` | ✅ all-pass |
| `check-keyword-map.mjs` | ✅ 351/0 + 353/0（基线保持） |
| `audit-entity-coverage.mjs` | ✅ 867 实体 / 441 文件 / `with_jsonld_refs = 4`（§7.2 维持） |

`process:equipment:cmm` 与 `process:capability:cmm-inspection` 在覆盖率表里都是 `jsonld_refs = 1`（G4 闭环落地证据）；`material:grade:grade-5 / grade-23` 维持 2 / 1（基线保持）。

### 9.6 改动文件（git diff 收敛）

```text
M  src/lib/rehype-auto-internal-links-i18n.js     ─ +49/-3（pre/post table-cell 改名 + PER_LANG_MAX 默认值）
M  src/components/materials/GradePageLayout.astro ─ +6/-4（CP-Ti cluster mount 条件 + 注释升级）
M  src/components/audience/AudienceHub.astro       ─ +18/-1（CP-Ti 三条 related + currentPath 自指过滤 + normalizedTarget）
```

**未触碰**：`astro.config.mjs` / `data/keywords/*` / `entity-registry.json` / `node_modules` / 任何 `[...slug].astro` / `redirects`。**新增 URL**：0。**临时文件**：0（3 个本会话产生的 `_*.mjs` / `_cov.out` / `_cov.tmp` 全部已删）。

### 9.7 仍未做 / 留给下一轮

- **F3 entityId 复制到 Grade 1/2/4** — 本轮为最小复制跳过。`grade-1.astro / grade-2.astro / grade-4.astro` 仍无 `getEntityByPageUrl` + `entityId` 装配，JSON-LD `WebPage.mentions` 在这三个页面未点亮。复制成本低（一行 import + 一行 prop），但属于"非 SEO 必须"（这三页本身是 CP-Ti 长尾，搜索量与 Grade 5 不在一个量级）。
- **Grade 9 / ti-5553 / ti-6211 集群复制** — Grade 2 模板未经过完整 crawl 验证前不建议批量复制。
- **i18n 其余 10 语 faq.3/4** — 维持 en-only（fallback 到 en 在项目内已成惯例）。
- **G6 = 方案 C**（全局 max=6 + 移除 alloy 长尾词）— 等 §7.5 #2 补丁回归一段时间（建议 2 周 production 数据），确认无表内误链接后再考虑。