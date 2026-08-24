# Progress & TODO

## Completed
- ✅ **GEO Cluster×Inbound Phase 1 — 实体图谱 + 覆盖率审计（2026-08-24）** — 从 11 个数据源收割 867 个实体到 `data/entities/entity-registry.json`（material 34 / standard 18 / process 458 / service 22 / industry 12 / application 60 / product 260 / case-study 3），构建脚本 `scripts/build-entity-registry.mjs`（基于正则 TS 剥离 + `vm.runInContext` 加载，**无新增依赖**），审计脚本 `scripts/audit-entity-coverage.mjs`（扫描 162 页 + 277 组件，输出 `data/entities/coverage-report.{json,md}`）。**核心发现**：293/867 实体零引用（product 179 + process 106 几乎全孤儿）、仅 8 个实体有内部链接、行业类覆盖率最佳（avg 59）。落档：`memory-bank/entity-graph.md`。**未部署**（仅数据+文档，构建零影响）。
- ✅ **Chemical 页优化**（2026-08-07）— 导航 Industries 下拉新增 Chemical；`/industries/` 行业页网格新增 Chemical Processing 模块并让 9 个行业卡片全部可点击（href 映射 + Learn More）；BuyerIntentBlock 新增 `showCta` prop（Chemical 页传 false 移除重复 CTA）+ 修复历史标签闭合错位；en.json 新增 ind8 键；`npx astro build` ✅ **2219 页**；**未部署**
- ✅ **Trust Layer Phase 0-4（Procurement Evidence Architecture）**（2026-08-07）— 案例库双体系（`/case-studies/` 索引+详情，CollectionPage/ItemList JSON-LD，3 个 Manufacturing Example 标注 manufacturing-example）+ 制造能力矩阵（`/capabilities/manufacturing/` Section 2.5，10 行真实设备数据）+ BuyerIntentBlock 组件（集成 aerospace/medical）+ Chemical 行业页（采购意图式标题）+ Organization Schema 强化（knowsAbout×10 / makesOffer / industry）；`check-undefined-slugs` 0 issue；`check-encoding` 通过；tsc 0 错误；`npx astro build` ✅ **2219 页**；sitemap 已含新页；**未部署**
- ✅ **6 个既有 React 类型错误修复**（2026-08-07）— FacilityStats/StatsCards/UseCaseTabs 图标类型补 `style?: React.CSSProperties`（ts2769 ×3）、UseCaseTabs `onerror`→`onError`（ts2322）、ReverseEngineerTool 搜索逻辑 `kw`→`k`（ts2345 ×2，顺带修复数组误用运行时 bug）；`npx tsc --noEmit` ✅ **0 错误**；`npx astro build` ✅ 2213 页；ReverseEngineerTool/UseCaseTabs 生成新 bundle 哈希
- ✅ **第 4 批内链生产部署**（2026-08-07）— commit `ada264cf` + 全量 `npm run build` + `npm run deploy:inc`：首轮 2142 成功/28 失败（末尾连接中断）→ 清除缓存重跑 28 成功/0 失败（191s），合计 **2170 文件 / 304MB / 0 失败**（总耗时 ~51min）；线上抽查全部通过（welcome 5 链 / astm-b348 全链 / chip-control CTA / HPC+medical 自动链）
- ✅ **Semantic Linking Phase 4 + keywordMap 增量 + type check**（2026-08-07）— 剩余 9 篇博客新增 27 条手动内链（material=5, equipment=2, service=4, capability=2, blog 交叉=3, blog hub=1, industry=1, rfq=9）；**welcome 从 0 链接去孤立（5 条）**；四批累计 **39 篇全部完成 / 113 条新 Tier1 内链**；keywordMap 增量 6 条长短语（Ti-6Al-4V Grade 5/Grade 5 titanium→grade-5、Grade 23 titanium→grade-23、through-spindle & high-pressure coolant→equipment/high-pressure-coolant、medical implants→industries/medical；全部表格安全）；tsconfig `ignoreDeprecations 6.0→5.0` 解除 TS5103 阻断；`check-undefined-slugs` 0 issue；`npx astro build` ✅ 2213 页；dist 0 重复包裹；`tsc --noEmit` 6 个既有 React 错误（本次 0 新增）
- ✅ **生产部署**（2026-08-05）— commit `75f55a01` + `npm run deploy:inc`：2172 文件 / 306.2MB 上传成功 / 0 失败 / 2330s；线上验证 4 关键页（Supplier/AS9100/5-Axis/rfq 新表单）全部在线 ✅
- ✅ **P1 5-Axis 深度强化 + RFQ Preparation**（2026-08-05）— `/5-axis-titanium-machining/` 上线（SubpageHero + Why-5Axis/RFQ-Prep 自定义 + TrustBadges/Capabilities/Applications/QualityControl 复用；pageType=service-detail + Service/OfferCatalog JSON-LD；3 条入口链）；**路线图 P0.5/P0.6/P1 全部完成**；build ✅ 2170 HTML
- ✅ **P0.6 AS9100 Landing**（2026-08-05）— `/as9100-titanium-supplier/` 上线（SubpageHero + TrustBadges/QualityControl/Capabilities/Applications 复用 + AS9100D Scope/Evidence Docs 自定义；pageType=service-detail + Service/hasCredential/ManufacturingPlant JSON-LD；3 条入口链）；build ✅ 2169 HTML
- ✅ **P0.5 Supplier Entity Page**（2026-08-05）— `/titanium-cnc-machining-manufacturer/` 上线（SubpageHero + TrustBadges/Capabilities/QualityControl/Applications 复用 + Supplier Profile/Materials/CTA 自定义；pageType=service-detail + Service/ManufacturingPlant JSON-LD）；入口扩充至 9 条（7 博客 + 2 落地页横幅 + sitemap）；build ✅ 2168 HTML
- ✅ **Semantic Linking Phase 3**（2026-08-05）— 第三批 10 篇（知识中枢/材料对比/信任认证/DFM/工艺）新增 31 条 Tier1 内链（service=4, material=11, industry=3, rfq=7, capabilities=5, tools=3）；三批累计 30 篇 / 86 条新 Tier1 内链；`check-undefined-slugs` 0 issue；`npm run build` 通过；dist 0 重复包裹
- ✅ **Semantic Linking Phase 2**（2026-08-05）— 第二批 10 篇 BOFU/采购/案例/行业博客新增 30 条 Tier1 内链（service=3, material=10, industry=5, rfq=7, capabilities=2, tools=3）；`check-undefined-slugs` 0 issue；`npm run build` 通过；dist 0 重复包裹
- ✅ **Semantic Linking Phase 1**（2026-08-05）— 10 篇高商业价值博客新增 25 条 Tier1 语义内链（service=6, material=8, industry=4, rfq=5, capabilities=6, tools=2）；keywordMap Safety Audit 完成（无二次包裹风险、`<table>` 未阻断需注意）；`check-undefined-slugs.mjs` 0 issue；`npm run build` 通过；dist 验证 0 重复包裹
- ✅ Initial Memory Bank setup (projectbrief, productContext, systemPatterns, techContext, activeContext, progress)
- ✅ SEMANTIC_CLOSURE.md created (corrected for codebase reality)
- ✅ .clinerules updated with SEMANTIC_CLOSURE.md reference + conflict resolution
- ✅ **Fix #1** — BaseLayout.astro: Changed `walk(items: any[])` → `walk(items: NavItem[])`, added `NavItem` type import
- ✅ **Fix #2** — BaseLayout.astro: Added `<meta name="robots" content="index, follow" />`
- ✅ **Fix #3** — BaseLayout.astro: Changed `property="twitter:*"` → `name="twitter:*"` for all 3 Twitter Card tags
- ✅ **Fix #4** — Footer.astro: Added `target="_blank" rel="noopener noreferrer"` to LinkedIn link; improved `aria-label`
- ✅ **Fix #5** — ServicesOverview.astro: Migrated all 4 `onmouseover`/`onmouseout` handlers (card border+shadow, title color, corner accent, bottom CTA) to scoped CSS with `:hover` rules

## Pending
- [ ] `git push`（HEAD=`ada264cf` 未推送到 origin/main）
- [ ] Trust Layer 生产部署（`npm run deploy:inc`，待用户确认）
