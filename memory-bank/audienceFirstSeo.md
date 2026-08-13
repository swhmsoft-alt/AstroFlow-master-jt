# Audience-First SEO 落地（受众优先 SEO）

> **方法论来源：**《Audience-First SEO: A Smarter Way to Rank Higher in 2026》
> **本项目落地模型：** B2B 受众 = **行业（应用场景）** × **人群（角色）** × **旅程阶段（awareness / consideration / decision）**

---

## 一、核心方法（文章提炼）

传统 SEO 以关键词/话题/搜索量为起点；受众优先 SEO **倒置逻辑**：先锁定高价值目标人群 → 再反向挖掘需求、关键词、内容赛道。关键词降级为“洞察用户需求的工具”，而非优化终点。

**四步落地：**
1. 细分高价值受众（身份 / 全旅程痛点 / 行为习惯）
2. 以人群为单位反向选词（长尾问答词优先，一主题一人群独立词库）
3. 受众导向内容创作（痛点前置、适配 AI 检索结构、人机内容边界、人群主题内容集群）
4. 技术 + 外链 + 数据复盘（速度 / 转化指标而非流量总量）

**底层动因：** AI Overview 重塑评判标准、泛话题转化暴跌、零点击搜索常态化。

---

## 二、本项目现状审计（2026-08-13）

| 四步法 | 现状 | 差距 |
|---|---|---|
| 受众细分 | `productContext.md` 有 3 个粗粒度 Persona | 未按旅程阶段拆痛点、无行为数据 |
| 反向选词 | `data/keywords/main-db.json` 已有 `intent` / `entity` | **缺 persona / journeyStage 维度** |
| 受众内容 | Blog 40+ 篇 + 多语翻译、知识图谱 | 多为话题/关键词驱动，非人群+旅程驱动 |
| 技术+复盘 | 询盘链路 + Google Ads 转化已上线 | 分人群转化复盘未沉淀 |

**关键判断：** 本项目已是“半受众优先”架构（industry→entity→intent 语义化），最薄弱处正是文章强调的 **“以人群为单位”的维度缺失**。

---

## 三、已落地内容（2026-08-13，有节制示范）

### 1. 权威受众分类法 `data/keywords/audience-taxonomy.json`
- **人群（角色）：** `procurement` 采购经理/工程师、`design` 设计工程师、`manufacturing` 制造/工艺工程师、`quality` 质量/合规工程师、`owner` 企业主/决策者
- **行业（应用场景）：** 复用现有 **12 个行业**（aerospace-defense、medical-device、semiconductor、energy、marine-offshore 等；注：实际 12 个，非文档所述 13）
- 每个行业配置高价值 persona 组合 + persona↔industry 反向映射

### 2. 关键词库加维度 `scripts/audience-tag.mjs`（幂等）
- 仅对 **43 个高价值核心 EN mapped 词**（行业/服务/工艺/产品页）打 `persona` + `journeyStage`
- `journeyStage` 由 `intent` + persona + 语义派生：informational→awareness；采购/决策词→decision；其余→consideration
- **纯新增字段**：`persona` / `journeyStage`；未改/删任何既有字段（`keyword / lang / intent / entity / status / targetUrl / anchorText / source / volume / difficulty` 全保留）
- 追加 **10 条** `status:'planned'` 的“行业×人群×旅程”长尾问答词（PAA 风格）作储备，不进构建

### 3. 数据统计（验证后）
- 带 persona 标签总数：**70**（43 核心词 + 7 行业 mapped + 10 计划词 + 10 blog planned）
  - `design` 13、`quality` 19、`owner` 3、`manufacturing` 18、`procurement` 17
- `planned` 储备：**110**（含项目原有 90 条）
- EN mapped 锚文本：**98**（+7 条行业页锚点）

### 3b. 行业页覆盖扩展 + blog 长尾（2026-08-13 第 2 轮）
- **行业页：** 为其余 7 个 `/industries/` 静态页补齐 **mapped** persona 关键词（ai-infrastructure→design、chemical→quality、energy→procurement、industrial-equipment→procurement、marine→manufacturing、semiconductor→quality、uav-drones→design），journeyStage 统一 consideration。至此 **9 个行业页全部覆盖**（aerospace、medical 此前已覆盖）。
- **blog：** 新增 **10 条 planned** 长尾问答词（`行业×人群×旅程`，targetUrl 指向对应 blog 文章），纯储备、不动内容 schema、不进构建。
- 数据流（闭环）：输入=行业页/blog→计算=audience-tag.mjs→存储=main-db.json→输出=`keywords-sync`→`entity-keywords.mjs`→`generate-entity-keywords`→`astro.config.mjs`（纯增量）→改进=astro check/字段校验→再输入=planned 词后续转 mapped。
- 验证：astro.config +21/0、entity-keywords +11/0（纯增量）；main-db NEWLY_MISSING=0；astro check 118 errors（与改动前一致，无新增）；blog planned 被 `exportAllLangs` 排除。**未部署**。

### 3c. 外显模块落地（2026-08-13 第 3 轮，回应"不外显"反馈）
- **新增 `src/components/audience/AudienceHub.astro`**：0-JS 可见模块，渲染 persona 标签 chips + FAQ（含 FAQPage JSON-LD）+ 相关资源 + CTA→/rfq/。通用文案走 `t()`，FAQ/相关为 9 行业内联 EN 配置。
- **整合进 9 个行业页**（CTA 前）：aerospace / ai-infrastructure / chemical / energy / industrial-equipment / marine / medical / semiconductor / uav-drones。已有 `BuyerIntentBlock` 的页（aerospace/medical/chemical）以 AudienceHub 作 FAQ/相关补充、不重复。
- i18n：`en.json` 追加 11 个 `audience.*` key（7325 keys，其余语言 t() 回退 EN）。
- 验证：`astro check` 118 errors（无新增）；dev server 实测 `/industries/semiconductor/` 标题/FAQ/JSON-LD/CTA 均渲染。
- **扩展至服务页（同轮续）：** AudienceHub 新增 6 个服务配置（cnc-machining/surface/fabrication/forming/additive/capabilities），挂载到 6 个服务页（titanium-cnc-machining-services、titanium-surface-treatment、titanium-fabrication-services、titanium-forming-heavy-manufacturing、titanium-additive-manufacturing、capabilities）。**15 页外显**。
- **再扩至子页（同轮续）：** 复用父级服务配置，再挂载 16 个子页（CNC×4、Fab×3、Forming×3、Surface×3、Additive×3）。**31 页外显**。
- **扩至材料/部件页（同轮三续）：** 新增 `materials`、`parts` 配置，经共享组件 `GradePageLayout.astro`（32 材料页）+ `PartsDetail.astro`（8 部件页）一次挂载。**71 页外显**（9 行业 + 6 服务枢纽 + 16 子页 + 32 材料 + 8 部件）。
- **扩至微能力页（同轮四续）：** `products/capabilities/*` 由 `[...slug].astro` 动态渲染，模板挂载一次覆盖全部（industry="capabilities"）。已跑 `check-undefined-slugs.mjs --ci`（0 issue）。
- **扩至 blog（同轮五续）：** 新增 `blog` 配置，在 `blog/[...slug].astro` 模板文章内容后挂载，覆盖全部 EN blog 文章。已跑 `check-undefined-slugs.mjs --ci`（0 issue）。
- **扩至设备页（同轮六续）：** 新增 `equipment` 配置，经共享组件 `EquipmentPageLayout.astro` 一次挂载，覆盖全部 13 设备页。
- 待办：`/use-cases/`（演示页，非被覆盖业务页，跳过）、`/applications/*`（目录不存在，跳过）。核心业务页类型已全覆盖。

---

## 四、验证门禁（已通过）

- `npx astro check`：无本次改动引入的诊断（现存 118 errors 均为既有、位于未改动文件）
- `main-db.json` 字段完整性：HEAD=15 vs CUR=15 缺失字段，**NEWLY_MISSING=0**
- `entity-keywords.mjs` / `astro.config.mjs` 未改动 → 构建内链映射不变
- `planned` 词条被 `repository.exportAllLangs()` 的 `status==='mapped'` 过滤，不参与构建
- 脚本幂等：重复运行不重复新增/打标

---

## 五、后续行动清单（建议）

1. **内容集群**：为 5 个 persona 各建“支柱页 + 细分子文章”，内部互链（呼应文章“主题内容集群”）
2. **FAQ 结构化数据**：核对/补齐 `FAQPage` schema，提升 AI Overview 引用概率
3. **长尾问答词落地**：将 planned 储备词按 persona 分批转 `mapped` 并配内容页（先 medical-device / semiconductor 高转化人群）
4. **分人群复盘**：GA/Google Ads 按 persona 划分落地页转化追踪（停留时长、表单、询盘）
5. **扩全量标注**：示范链路验证有效后，再对全部 mapped 词做全量 persona 标注

---

## 六、常用命令

```bash
# 重新执行打标（幂等）
node scripts/audience-tag.mjs
# 查询带 persona 的词
node scripts/kw-cli.mjs # 或直接查 main-db.json
```
