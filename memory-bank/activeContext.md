# Active Context

> **Last Updated:** 2026-08-08
> **Current Focus:** 修复 `baoji-china-titanium-valley.md` 缺失封面图路径（40 篇中唯一无 coverImage 的文章）。

## Current Status
✅ **博客封面图缺失修复完成（2026-08-08）：** `baoji-china-titanium-valley.md` frontmatter 补充 `coverImage: /uploads/blog-baoji-china-titanium-valley-cover.jpg` + `coverImageAlt`（图片文件早已存在于 `public/uploads/`，仅 frontmatter 漏写）。修复后 40 篇英文博客文章全部具备封面图。`npx astro build` ✅ **2232 页**；dist 抽查详情页 `<img src="/uploads/blog-baoji-china-titanium-valley-cover.jpg" alt=...>` 正常渲染，首页 Industry Insights 卡片同步显示封面。**未部署**（上一轮方案 A+B 分页/归档已随 commit `213e2689` 入库推送）。

## Recent Decisions

### 博客分页（方案 B）（2026-08-08）
**背景：** 方案 A 交付后用户选择继续叠加**方案 B 分页**（原计划文案："文章数大幅增长（如 100+ 篇）时再叠加"）。根因：博客首页为分类分组视图（每类 ≤4 篇 + View all 到归档页），缺少按时间倒序浏览全部文章的入口；40 篇已需翻页。

**执行（4 文件）：**
1. **`src/pages/blog/page/[page].astro`**（新建）— 分页列表页：`getStaticPaths` 按 `BLOG_PAGE_SIZE=12` 切分 40 篇英文文章 → 4 页；`page===1` 时 `Astro.redirect('/blog')`（避免 `/blog/page/1/` 与 `/blog/` 重复内容，规范 canonical）；页码导航（当前页高亮、`aria-current`）+ `rel="prev"`（第 2 页 prev 指向 `/blog/`）+ `rel="next"`；面包屑 Home > Blog > Page {n}；`pageType="blog-index"` + items 驱动 JSON-LD `ItemList(numberOfItems)+CollectionPage+BreadcrumbList`；`alternateLinks` 仅 en。
2. **`src/lib/blog-i18n.ts`** — 新增共享 `BLOG_PAGE_SIZE = 12` 常量（getStaticPaths 与组件 body 均引用，避免 Astro 编译作用域问题）。
3. **`src/pages/blog/index.astro`** — ① 分类导航栏末尾新增 "All Articles →" 入口（`totalPages > 1` 条件渲染，指向 `/blog/page/2/`）；② 分类区块与 CTA 之间新增分页区块（Next Page 按钮 + "{totalPages} pages · {totalArticles} articles" 文案）。
4. **`src/layouts/BaseLayout.astro`** + **`src/lib/schema.ts`** — BaseLayout 新增 `prevURL`/`nextURL` props，head 输出 `<link rel="prev">`/`<link rel="next">`；`detectPageType` 增加 `/blog/page/` 前缀识别为 `blog-index`（防误判 `blog-post`）。

**验证：** `check-undefined-slugs.mjs --ci` 0 issue；`npx astro build` ✅ **2232 页**（2228 + 4 分页页）；dist 抽查：`/blog/page/2/` 12 篇 + rel=prev(→/blog/) + rel=next(→/blog/page/3/) + ItemList(12) + JSON-LD 面包屑 Home>Blog>Page>2；`/blog/page/4/` 4 篇 + rel=prev 有 + rel=next 无；`/blog/page/1/` meta refresh 301 → `/blog` + canonical 正确；首页含 All Articles 入口 + Next Page 区块 + "4 pages · 40 articles"；改动文件 astro check 0 新错误。

**下一步：** 用户确认后 `git push` + 部署。可选后续：为 12 语言新增分页/分类归档页（多语言博客首页目前为全量列表无隐藏问题）。

### 博客分类归档页 + View all 修复（2026-08-08）
**背景：** 用户审计 `/blog/`：① 分类分组布局每类最多 4 篇（`MAX_VISIBLE`），Manufacturing Problems(10)/Materials Engineering(5)/Applications and Processes(5) 共 8 篇被隐藏且 "View all N articles" 按钮仅为 `#锚点`（不展开、不跳转）；② `baoji-china-titanium-valley.md` 的 `Industry Insights` 分类不在 `CATEGORY_ORDER`，首页完全不可见（但仍计入 "9 Categories" 统计，孤儿文章）；③ 无分页（`/blog/page/2/` 404）、无分类归档页。用户选定**方案 A：修复 View all + 新增分类归档页**。

**执行（5 文件）：**
1. **`src/lib/blog-i18n.ts`** — 新增共享 `categoryToSlug()`（`toLowerCase → 非字母数字转 - → 去首尾 -`，空值回退 `uncategorized`），首页与归档页共用同一 slug 规则。
2. **`src/pages/blog/category/[slug].astro`**（新建）— `getStaticPaths` 遍历全部英文文章提取 9 个分类生成静态路径；展示该分类全部文章（featured 大卡 + 网格）；面包屑 Home > Blog > {category}；`pageType="blog-index"` + `collectionName/itemCount/items` 驱动 JSON-LD `CollectionPage + ItemList + BreadcrumbList`；`alternateLinks` 仅 en（避免生成不存在多语言分类页的 hreflang）。
3. **`src/pages/blog/index.astro`** — "View all" 按钮 `href` 从 `#sectionId` 改为 `/blog/category/{categoryToSlug(cat)}/`；遍历列表改为 `orderedCategories`（`CATEGORY_ORDER` + 剩余分类）使 Industry Insights 区块可见，未来新分类也不会被遗漏。
4. **`src/lib/schema.ts`** — `detectPageType` 增加 `/blog/category` 前缀优先识别为 `blog-index`（此前被误判为 `blog-post`）。
5. **`src/pages/blog/[...slug].astro`** — 分类徽章改为链接到分类归档页；HTML 面包屑增加分类层级（Home > Blog > {category} > Title，JSON-LD 面包屑仍由 BaseLayout 自动生成 Home > Blog > Title）。

**验证：** `check-undefined-slugs.mjs --ci` 0 issue；`npx astro build` ✅ **2228 页**（原 2219 + 9 分类页）；dist 抽查：manufacturing-problems 分类页 **10 篇全量**链接、industry-insights 页含 `baoji-china-titanium-valley`、首页含 Industry Insights 区块 + View all 真实链接、JSON-LD `CollectionPage+ItemList(numberOfItems:10)` 命中；详情页分类徽章/面包屑链接命中。改动文件（blog-i18n.ts、schema.ts、blog/index.astro、blog/[...slug].astro、blog/category/[slug].astro）`astro check` 0 错误（其余 117 错误均为基线既有）。

**下一步：** 用户确认后 `git push` + 部署。可选后续：为 12 语言新增对应分类归档页、博客首页分页（方案 B）。

### 产品页工艺流程链接化（2026-08-08）
**背景：** 用户要求产品页"工艺流程"中的工艺（如 fender mounting bolt 的 CNC turning / heat treatment / surface grinding / passivation / dimensional check）链接到对应服务和能力页面。根因：`manufacturing_process`（product-specs frontmatter，全库仅 5 种模板值）渲染为纯文本，无任何内链。

**执行（3 文件）：**
1. **`src/utils/process-links.ts`**（新建）— `PROCESS_LINK_MAP` 有序映射（长词优先）：CNC 车铣/5轴/精密加工→`/titanium-cnc-machining-services/cnc-milling-turning/`；热处理/应力消除→`/products/capabilities/vacuum-heat-treatment/`；磨削→`high-precision-grinding`；钝化→`/titanium-surface-treatment/chemical-passivation/`；检验（CMM/vision/optical gauging/check）→`100-dimensional-inspection-cmm`；另有 thread-rolling / electropolishing / ultrasonic-cleaning / pvd-coating / bead-blasting / diamond-cut-beveling / deburring 能力页。`linkifyProcessSteps(str)` 按逗号拆分、trim、逐步骤匹配，返回 `{text, href?}[]`。
2. **`SpecBlock.astro`** — "Process:" 行（⚙️ CNC & Stress Relief Controls）改为每步骤 `<a class="underline underline-offset-2">` 渲染。
3. **`EngineeringReport.astro`** — Specifications "Process:" 列表项 + "is manufactured using…" 段落（原 `toLowerCase()` 改为保留原大小写步骤文本）两处同样链接化。

**验证：** `check-undefined-slugs` 0 issue；`npx tsc --noEmit` 0 错误；`npx astro build` ✅ 2219 页；dist 抽查 fender + 其他 4 种工艺模板产品页（acetabular-cup / acoustic-waveguide-extension / air-sparger-pipe / brake-bleed-port-screw）：全部步骤链接命中且目标 URL 均为有效页面；JSON-LD HowToStep 保持纯文本；`git status` 无残留临时文件（process-links.ts 为新增应用代码）。

**下一步：** 用户确认后 `git push` + 部署。可后续将 `PROCESS_LINK_MAP` 扩充覆盖更多工艺关键词（如 forging / welding / EDM）。

### 系统页组件链接 + 完整产品列表（2026-08-08）
**背景：** 用户报告系统页（如 `premium-consumer-electronics-wearables`）：① 组件没有链接到具体产品；② 产品列表不全（仅 6 行）。根因：`keySpecs = allProducts.slice(0, 6)` 硬编码截断；表格组件名渲染为纯文本无 `<a>`；系统 JSON `productEntities` 只列 13 个而匹配 `system === title` 的产品实体有 27 个，导致 `/products/` 索引计数（13 parts）与详情页（27 Components）不一致。

**执行（2 文件）：**
1. **`src/pages/products/systems/[...slug].astro`**（60 个系统共享模板）— `keySpecs` 移除 `slice(0, 6)`；为每个 spec 增加 `slug`（`p.slug || p.id?.replace('.json','') || ''` fallback 链）；组件名称 `<td>` 内包 `<a href={`/products/product-entities/${spec.slug}/`} class="hover:underline">`。
2. **`src/content/systems/premium-consumer-electronics-wearables.json`** — `productEntities` 数组补全 13 → 27（字母序，与 product-entities 集合顺序一致）：新增 camera-hot-shoe-mount、camera-lens-filter-ring、edc-pen-body、edc-utility-knife-handle、flashlight-body、headphone-driver-enclosure、key-organizer-screw、laptop-hinge-bracket、laptop-hinge-shaft、pen-clip、pocket-comb、smartphone-sim-tray、smartphone-volume-button、wallet-card-case。

**验证：** `check-undefined-slugs.mjs` 0 issue；`npx astro build` ✅ 2219 页；dist 抽查：组件表格 **27 行**全部带 `/products/product-entities/{slug}/` 链接（27 个目标页均存在）、用户列出的 6 个组件保持表格前部（字母序）、`/products/` 索引页显示 "27 parts"；`git status` 仅 2 个预期文件改动，无残留临时文件。

**下一步：** 用户确认后 `git push` + 部署。**后续对齐审计（2026-08-08）已完成：** 全量扫描全部 60 个系统的 `productEntities` 数组 vs product-entities 集合（`system === title`），差异 0；所有产品实体均有 `system` 字段且均指向存在的系统标题（孤儿 0）。即此前的偏差仅为 premium-consumer-electronics-wearables 一处（已修复），其余系统数据源天然一致，无需再改其他系统 JSON。

### Chemical 页优化 — 导航/行业网格/CTA 去重（2026-08-07）
**背景：** 用户要求：① 导航行业下拉加 Chemical；② `/industries/` 行业页加 Chemical 模块并为全部行业卡片加链接；③ 移除 Chemical 页 BuyerIntentBlock 内 CTA（与页面底部 CTA 重复）。

**执行（5 文件）：**
1. **`src/config/site.ts`** — Industries 下拉新增 `{ name: 'Chemical', href: '/industries/chemical' }`（Energy 之后）。
2. **`src/components/industries/IndustryVerticalsGrid.astro`** — `Industry` 接口加 `href`；9 个行业全部映射到各自页面；新增 **Chemical Processing** 模块（ind8：Heat Exchanger / Pipe Fittings / Valve Bodies / Reactor Internals；pain: chloride corrosion resistance）；卡片 `<div>`→`<a>` 可点击（保留 hover 效果 + Learn More 链接 + aria-label）。
3. **`src/i18n/translations/en.json`** — 新增 `ind8_*` 翻译键；desc 更新为 "Nine specialized sectors..."（其他语言自动回退英文，不扩 12 语言）。
4. **`src/components/industries/BuyerIntentBlock.astro`** — 新增 `showCta` prop（默认 true）；CTA 区块条件渲染；**修复历史遗留标签闭合错位**（Row 2 的 `</a></article></div>` 归位，删除文件末尾残留）。
5. **`src/pages/industries/chemical.astro`** — `<BuyerIntentBlock showCta={false} />`。

**验证：** `check-undefined-slugs` 0 issue；`check-encoding` 通过；tsc 0 错误；`npx astro build` ✅ 2219 页；渲染抽查：导航含 Chemical、行业页 9 卡片可点击（href 全部命中）、Learn More ×9、Chemical 页组件内 CTA 已移除且页面底部 CTA 保留。

**下一步：** 用户确认后 `git push` + 部署。


### Trust Layer — Procurement Evidence Architecture（2026-08-07）
**背景：** 战略层批准从"Semantic Layer（让搜索引擎理解）"转向"Trust Layer（让采购经理相信）"。执行顺序调整：Phase B（能力矩阵）→ Phase A（案例/制造示例）→ Phase C（行业增强）→ Phase D（Schema）。仅英文，不扩展 12 语言；不编造客户案例（Case Study 仅真实、Manufacturing Example 用于能力展示）。

**执行（Phase 0-4）：**
1. **Phase 0 — Content Collection：** `src/content/config.ts` 新增 `case-studies` 集合（`type: case-study | manufacturing-example` 双体系，含 material/process/equipment/inspection/certification/metrics 证据字段）。
2. **Phase 2 — 案例库系统：** `/case-studies/` 索引页（CollectionPage+ItemList JSON-LD、按 verified/examples 分区、行业筛选）+ `/case-studies/[...slug]/` 详情页（Material/Manufacturing/Quality Evidence 侧栏 + CTA）。创建 3 个 **Manufacturing Example**（aerospace thin-wall housing 0.60mm、medical bone screws Ra0.38µm、semiconductor UHV showerhead）—— 全部从现有硬编码 CaseStudies.astro 抽取，标注 manufacturing-example，避免"虚假案例感"。导航加入 Resources 下拉。
3. **Phase 1 — 制造能力矩阵：** `/capabilities/manufacturing/` 新增 Section 2.5 "Titanium Machining Capability Matrix"（10 行真实设备数据：5-axis ±0.005mm、turn-mill、wire EDM ±0.002mm、HPC 70-150bar、tool magazine、vacuum HT AMS2750F、CMM (1.8+L/300)µm、laser tracker、anodizing、bar feeder）。所有数字来自 `src/data/equipment.ts`。
4. **Phase 3 — Buyer Intent：** 新建可复用 `BuyerIntentBlock.astro` 组件（Why Titanium → Typical Components → Manufacturing → Quality → Related Evidence → CTA）。增量集成到 aerospace + medical 行业页。新建 `/industries/chemical/`（"Titanium Corrosion Resistant Components Manufacturer"采购意图页，英文硬编码，含 Grade 2/12 材料链接）。
5. **Phase 4 — Schema：** `src/lib/schema.ts` Organization 增加 `industry: 'Titanium Manufacturing'`、`knowsAbout`（10 项）、`makesOffer`（Titanium Manufacturing Services）；PageType 增加 `case-studies`，detectPageType/buildPageGraph 支持 CollectionPage+ItemList。

**验证：** `check-undefined-slugs.mjs --ci` 0 issue；`check-encoding.mjs` 通过；`npx tsc --noEmit` 0 错误；`npx astro build` ✅ 2219 页（原 2213 → 案例库+4、chemical+1、其它页复用）；sitemap 含 `/case-studies/` 与 `/industries/chemical/`；渲染抽查：CollectionPage/ItemList、Capability Matrix 全部字段、Chemical H1+Service schema、BuyerIntentBlock、knowsAbout/makesOffer 全部命中。

**下一步：** 用户确认后 `git push` + 部署；后续可加真实 Case Study（客户允许+照片+数据）扩充证据库；Manufacturing Example 可继续按设备/工艺扩容。


### 导航：Products 提升为英语站一级分类（2026-08-07）
**背景：** 用户要求将导航上的 Products 位置提到 Services 之前、作为一级分类，**且只在英语站调整**；多语言站因暂无大范围产品布局需保持不变。已确认方案：Products 为**无下拉的纯一级链接**（→ `/products`）。

**执行：**
1. **`src/config/site.ts`** — 新增 `getNavigation(lang)`：`en` 时构建专属导航 `Home → Products → Services → Materials → Capabilities → Industries → Resources`，并从 Resources 下拉中移除重复的 Products 子项；非 `en` 原样返回 `NAVIGATION`（多语言零变化）。**关键约束：** 不在 site.ts 引入 `i18n/ui`（`DEFAULT_LANG`），避免 React MobileMenu island 把 12 套翻译字典拉进客户端 bundle → 直接比较 `'en'` 字面量（加注释说明）。
2. **`Header.astro`** — 桌面导航改用 `getNavigation(currentLang)`；`<MobileMenu>` 新增 `items={navItems}` prop。
3. **`MobileMenu.tsx`** — 新增 `items?: NavItem[]` prop（默认回退 `NAVIGATION`，不传时行为不变）。
4. **未改动**：`Footer.astro`（Quick Links 仅渲染一级项，原本就不含 Products，任何语言均不变）、`BaseLayout.astro`（面包屑 NAV_LABEL_MAP 与顺序无关）、所有翻译文件（en `nav.products` 已存在）、所有 slug/路由文件。

**验证：**
- `check-undefined-slugs.mjs --ci` 0 issue、`check-encoding.mjs` 通过
- `npx tsc --noEmit` 0 错误
- 功能验证（esbuild 加载真实 site.ts）：en 顺序 `/ → /products → /services → …`、en Resources 无 products 子项、de/ja 与 `NAVIGATION` 完全一致
- 渲染验证（dev server 抓取 HTML）：EN 桌面导航 `Home → Products → Services → …`，`/products/` 在 header 仅 1 处（Resources 下拉已移除）；DE 导航顺序不变且 `/de/products/` 仍只存在于 Resources 下拉；EN/DE MobileMenu island props 序列化顺序均正确（EN 中 Products 在 Services 前，DE 中 Products 在 Resources 子项内）

**下一步：** 用户确认后 `git push` + 部署；如后续需 Footer Quick Links 同步展示 Products（英语站）或为 Products 增加英文子分类下拉，可再扩展。

### Semantic Linking Phase 1（2026-08-05）
**背景：** 战略层批准 Semantic Linking Map（39 篇博客），执行顺序调整为 Phase 0（keywordMap Safety Audit）→ Phase 1（10 篇高价值博客手动内链）。

**Phase 0 — KeywordMap Safety Audit 结论：**
- 底层插件 `rehype-auto-internal-links` v0.1.0：`BLOCKED_TAGS` 含 `a/code/pre/h1-h6/script/style/button`，遇到即 SKIP → **手动链接绝不会被二次包裹** ✅
- ⚠️ `<table>` **未阻断**：若未来 keywordMap 增加裸合金词（如 "Ti-6Al-4V"），表格单元格会被自动链接 → 只加长短语或用手动链接
- ⚠️ 无 exclude selector / URL 黑名单选项（仅 keywordMap + maxLinksPerPage=3）
- i18n 过滤正确：en 页排除 `/nl/...` 等语言前缀（`Rapid Prototyping → /nl/...` 异常项不污染英语页）
- 本次完全未修改 keywordMap

**Phase 1 — 10 篇博客内链（25 条新 Tier1）：**
| 目标类型 | Before | After |
|---|---|---|
| Service | 2 | 6 |
| Material | 0 | 8 |
| Industry | 0 | 4 |
| RFQ | 0 | 5 |
| Capabilities | 0 | 6 |
| Tools | 0 | 2 |

- 关键修复：`why-titanium-is-difficult-to-machine` 补齐 Material Entity 链接（→ `/materials/grade-5/`，形成 Problem→Material→Process→Service→RFQ 链）；`titanium-cnc-machining-rfq-checklist` 补齐最高价值 `/rfq/` 链接
- 锚文本全部各异，遵循「描述目标实体」原则，无重复商业锚文本
- 构建验证：dist 产物链接正确渲染、`<a href="..."><a href=` 重复包裹数 = 0

**下一步（待批准）：** P0.5 Supplier Entity Page `/titanium-cnc-machining-manufacturer/` → P0.6 AS9100 → P1 5-Axis / RFQ Preparation 强化

### RFQ 询盘页重构（2026-08-05）
**背景：** 用户要求：删除 `/rfq/` 原页面内容与组件，复制 `/titanium-machining/`（已上线测试通过的询盘落地页）内容与组件到 `/rfq/`，改造为专业询盘页；HeroRfq 询盘模块完全保留。

**执行：**
1. **`src/pages/rfq.astro` 重写** — 复制 titanium-machining 装配（HeroRfq + TrustBadges + Capabilities + QualityControl + Applications + FinalCta + StickyCta），SEO 改 RFQ 意图（title 沿用 seo.ts `/rfq` 条目），canonical=`/rfq/`，`pageType="rfq"`，保留 Service+ManufacturingPlant 补充 JSON-LD；不传 alternateLinks（默认 12 语 hreflang，`/lang/rfq/` 真实存在）。
2. **`[lang]/[...slug].astro` 同步** — 移除 3 个旧组件 import（第 122-124 行），新增 7 个 landing 组件 import；rfq 分支（原 1804-1839）改为渲染 landing 组件。**关键依赖：不更新此路由则删组件后构建报错。**
3. **删除旧组件**：`EngineeringRfqForm.astro`（mailto 型表单）、`SecurityNdaBanner.astro`、`ResponsePipelineTimeline.astro`（`src/components/rfq/` 现已空）。
4. **HeroRfq 询盘模块零改动** — 表单 action=/submit-rfq.php、蜜罐、防重复提交、mailto CAD 提示卡片全部原样。

**验证：** `check-undefined-slugs` 0 issue；`npm run build` 全链路通过（2167 HTML webp 更新 Completed）；dist `/rfq/`：`action="/submit-rfq.php"` 1、`tm-rfq-form` 1、旧 `engineering-rfq-form` 0、ld+json 2、ManufacturingPlant 1、hreflang 12+x-default；`/de/rfq/` 含新表单；旧 `EngineeringRfqForm*.js` 产物已从 dist/_astro 消失。

**影响说明：** `/lang/rfq/`（11 语）现统一渲染英文 landing 内容 —— 与 titanium-machining English-only 活动页先例一致。

### Semantic Linking Phase 2（2026-08-05）
**背景：** 用户批准第二批 10 篇（BOFU/采购/案例研究/行业优先），完成后转向 Supplier Entity Page。

**执行：** 10 篇新增 **30 条新 Tier1 内链**：service=3, material=10, industry=5, **rfq=7**, capabilities=2, tools=3。
- BOFU 类全部补齐 `/rfq/` 链：cost-factors、grade-2-vs-5-vs-23、case-study-medical、case-study-thin-wall、aerospace-challenges、medical-implants、semiconductor（7 篇）
- 案例/行业类补 `/industries/*` 链：medical/semiconductor/aerospace
- 对比文章（grade-2-vs-5-vs-23）链全 3 个材料实体页（合理超 3 条）
- 锚文本全部各异；`titanium-cnc-machining-services` 博客仅 2 条（竞品列表文，克制）
- ⚠️ 踩坑：该博客正文含 **U+2011 不间断连字符**（`one‑stop`/`Ti‑6Al‑4V`），精确匹配失败 → 改用避开特殊字符的子串匹配

**验证：** `check-undefined-slugs` 0 issue；`npm run build` 全链路通过；dist 抽查 5 篇博客页：rfq/grade-5/industries 链接正确渲染、`<a href="..."><a href=` 重复包裹 = 0。

**下一步：** 剩余 9 篇信息型博客（Manufacturing Problems 簇 + welcome）待定；**P0.6 AS9100 Landing** 为下一优先。

### Semantic Linking Phase 3（2026-08-05）
**背景：** 用户批准第三批 10 篇（知识中枢/材料对比/信任认证/DFM/工艺类）。

**执行：** 10 篇新增 **31 条新 Tier1 内链**：service=4, material=11, industry=3, **rfq=7**, capabilities=5, tools=3。
- 知识中枢 `titanium-grades-complete-guide` 链 3 个材料实体页 + grade finder（合理超 3 条）
- 信任类（as9100d/nadcap/material-certification）补 `/capabilities/certifications|traceability` + `/industries/aerospace` + `/rfq/`
- 工艺类（welding→welding-assembly 服务、additive-vs-cnc→additive+cnc 服务、thin-wall→5-axis 服务）
- 锚文本继续全部各异，无重复商业锚文本

**验证：** `check-undefined-slugs` 0 issue；`npm run build` 全链路通过；dist 抽查 5 篇：rfq/grade-5 链接正确、`<a href="..."><a href=` 重复包裹 = 0。

**累计：** 三批共 **30 篇博客 / 86 条新 Tier1 内链**（svc=13, mat=29, ind=12, rfq=19, cap=13, tool=8）。剩余 9 篇：alpha-case、high-pressure-coolant（已有 1 服务链）、chip-control、deformation、springback、tool-wear、work-hardening、welcome（低价值可跳过或仅 1-2 链）。

### Semantic Linking Phase 4 + keywordMap 增量 + type check（2026-08-07）
**背景：** 收尾剩余 9 篇博客（Manufacturing Problems 簇 + welcome）+ keywordMap 长短语增量 + 全量 type check。

**执行（9 篇 / 27 条新手动内链）：** material=5（grade-5 ×3、astm-b348、astm-b265）、equipment=2（vacuum-heat-treat-furnace、chip-management-fire-suppression）、service=4（3-5-axis ×3、services ×1）、capability=2（traceability、certifications）、blog 交叉=3（thin-wall ×2、work-hardening）、blog hub=1（/blog/）、industry=1（aerospace）、rfq=9。
- **welcome 去孤立：** 0 链接 → 5 条（/blog/、services、aerospace、certifications、/rfq/），成为博客枢纽入口
- 首度引入 `/equipment/` 设备页目标类型（前 3 批未用）；已确认页面真实存在且内容完整
- 锚文本全部各异；RFQ CTA 段落沿用 thin-wall 博客先例

**keywordMap 增量（6 条长短语，全部逐条核对无 `<table>` 单元格命中）：**
| 关键词 | → URL | 正文出现 |
|---|---|---|
| `Ti-6Al-4V Grade 5` / `Grade 5 titanium` | `/materials/grade-5/` | 3 / 4 |
| `Grade 23 titanium` | `/materials/grade-23/` | 8 |
| `through-spindle coolant` / `high-pressure coolant` | `/equipment/high-pressure-coolant/` | 6 / 7 |
| `medical implants` | `/industries/medical/` | 7 |
- 排除项（实测命中表格单元格）：`Ti-6Al-4V ELI`（2 处）、`material certification`（1 处）
- 插件属性复核：大小写不敏感、跳过 a/code/pre/h1-h6/script/style/button、maxLinksPerPage=3、长词优先、word-boundary 匹配 → 无二次包裹风险

**Type check：** tsconfig `ignoreDeprecations` `6.0→5.0`（TS 5.9.3 仅接受 5.0，此前 TS5103 使 tsc 完全无法运行）；`npx astro sync` ✅；`npx tsc --noEmit` ✅ **0 错误**（6 个既有 React 错误已修复：FacilityStats/StatsCards/UseCaseTabs 图标类型补 `style`、UseCaseTabs `onerror`→`onError`、ReverseEngineerTool `kw`→`k` 匹配逻辑修复）。

**验证：** `check-undefined-slugs` 0 issue；`npx astro build` ✅ **2213 页**（48.8s，0 错误）；dist 抽查：9 篇博客预期 href 全部命中、14 个目标页面均存在、全 dist `<a href="..."><a href=` 重复包裹 = 0、keywordMap 自动链接生效（HPC→equipment ×2、grade-5 ×2、medical→industries ×3）。

**生产部署（2026-08-07）：** commit `ada264cf` 后全量 `npm run build`（5 步通过，2213 页 + sitemap 12 语 + webp 更新 2170 HTML）。`npm run deploy:inc` 首轮 SIZE 对比发现 2170 文件差异（304.0MB，与上次全量规模一致——增量脚本实际每次几乎全量）→ **2142 成功 / 28 失败**（失败集中在末尾 titanium-*/tools/use-cases，典型连接中断）→ 删除 `.deploy-diff.json` 重跑，**第二轮 28 成功 / 0 失败（191s）**，合计 **2170 文件全部上传 / 0 失败**。线上验证（全部通过）：welcome（5 条新 href）、alpha-case（CTA）、chip-control（CTA+fire-suppression）、astm-b348（astm-b348/b265+traceability+grade-5 自动链）、HPC 博客（equipment 自动链+3-5-axis）、medical 博客（industries 自动链）、equipment/high-pressure-coolant（HTTP 200）。

**下一步：** git push（HEAD=`ada264cf` 未推送）；6 个既有 React 类型错误专项修复（进行中）。

### 生产部署上线（2026-08-05）
**任务：** commit `75f55a01`「P1 5-Axis 落地页 + 博客入口链 + Memory Bank」（6 文件）+ `npm run deploy:inc`。

**部署：** `deploy-incremental-ftp.js` → SIZE 对比 2664 文件 → **2172 需上传（306.2MB）/ 492 未变** → 4 连接并行上传，**2172 成功 / 0 失败，总耗时 2330s（~39min）**。注：因上次部署后累积大量改动（RFQ 重构/86 内链/3 新页/入口扩充），上传量远超上次的 407 文件。

**线上验证（全部通过）：** `/titanium-cnc-machining-manufacturer/`（H1/CTA/材料卡/AS9100 交叉链 ✅）、`/as9100-titanium-supplier/`（AS9100D Scope + Evidence Docs ✅）、`/5-axis-titanium-machining/`（Why-5Axis + RFQ Prep ✅）、`/rfq/`（新表单 mailto 提示 + 24h 报价 + Supplier 横幅 ✅）。

**git：** HEAD=`75f55a01` 未 push（origin/main 仍为 `85224284`）—— 需用户 `git push`。`.deploy-diff.json` 为部署缓存（10min TTL）。

### P1 5-Axis 深度强化 + RFQ Preparation 上线（2026-08-05）
**背景：** 用户批准 P1 —— 路线图最后一页。目标 Query「5 axis titanium machining / 5 axis titanium machining supplier」（差异化能力 ★★★★★）。将 5-Axis 深度 + RFQ Preparation 两个子项合并为单一综合落地页。

**页面：** `src/pages/5-axis-titanium-machining.astro` → `/5-axis-titanium-machining/`
- **Hero：** `SubpageHero` 自定义（H1「5-Axis Titanium Machining Services」+ 4 指标 + 5 芯片 + slot CTA → `/rfq/`）
- **Why 5-Axis（自定义 4 卡）**：单装夹/薄壁稳定/公差/表面完整性 + 能力事实 4 格（5-Axis/±0.005mm/1.0mm 薄壁/Ra 0.4μm）
- **RFQ Preparation（自定义 5 项）**：CAD/材料规格/关键公差/表面+检验/数量交期 → `/rfq/` + RFQ 清单博客 —— 转化核心
- **复用：** TrustBadges / Capabilities / Applications / QualityControl
- **SEO：** Title「5-Axis Titanium Machining Services \| ±0.005 mm Tolerances \| AS9100D Certified」、`pageType="service-detail"` + 补充 JSON-LD（Service + OfferCatalog ×3 + ManufacturingPlant）、alternateLinks 仅 en+x-default

**入口链（3 条）：** 5-axis-best-practices 博客（锚「5-axis titanium machining services」）、case-study-medical-implant（锚「5-axis machine tool」）、case-study-complex-component（锚「5-axis titanium machining」）。

**验证：** `check-undefined-slugs` 0 issue；`npm run build` ✅（**2170 HTML**，+1 新页）；dist：h1/canonical ✅、CTA→/rfq/ ×3、RFQ Prep 区块 ✅、ld+json ×2（含 OfferCatalog）、sitemap-en.xml 收录（+ 5-axis 博客 URL）、入口链 ✅。

**路线图状态：** P0.5 Supplier / P0.6 AS9100 / P1 5-Axis+RFQ 全部完成 ✅。**下一步：** 剩余 9 篇博客（第 4 批）+ keywordMap 增量 + type check + 生产部署。

### P0.6 AS9100 Landing 上线（2026-08-05）
**背景：** 用户从待办审计中选择继续路线图 → P0.6 AS9100 Landing（目标 Query「AS9100 titanium supplier」，航空采购信任 ★★★★★）。

**页面：** `src/pages/as9100-titanium-supplier.astro` → `/as9100-titanium-supplier/`
- **Hero：** `SubpageHero` 自定义（H1「AS9100D Titanium CNC Machining Supplier」+ AS9100D 徽标 + 4 指标 + 5 芯片 + slot CTA → `/rfq/`）
- **复用：** TrustBadges / QualityControl（CMM/FAIR/MTR）/ Capabilities / Applications
- **自定义：** AS9100D Scope 4 卡（QMS/热号追溯/首件/防伪）+ Evidence Documentation 4 项（MTR/FAIR/CMM/PPAP）—— Evidence Query 层
- **SEO：** Title「AS9100D Titanium CNC Machining Supplier \| Aerospace Quality …」、`pageType="service-detail"` + 补充 JSON-LD（Service + **hasCredential Certification** + ManufacturingPlant）、alternateLinks 仅 en+x-default

**入口链（3 条）：** as9100d 博客 + nadcap 博客（锚「AS9100D titanium CNC machining supplier」）+ Supplier 页 CTA 交叉链接。

**验证：** `check-undefined-slugs` 0 issue；`npm run build` ✅（**2169 HTML**，+1 新页）；dist：h1/canonical/title ✅、CTA→/rfq/ ×2、hasCredential ✅、sitemap-en.xml 收录、入口链 ✅。

### P0.5 Supplier Entity Page 上线（2026-08-05）
**背景：** 用户批准继续（“继续”），按路线图推进最高商业意图 Query「titanium cnc machining manufacturer」（机会评分 95）。

**页面：** `src/pages/titanium-cnc-machining-manufacturer.astro` → `/titanium-cnc-machining-manufacturer/`
- **Hero：** `SubpageHero` 自定义（H1「Titanium CNC Machining Manufacturer」+ AS9100D 徽标 + 4 指标 + 6 能力芯片 + slot CTA → `/rfq/`）；**不用 HeroRfq/FinalCta**（表单页/外链 CTA 不适合，FinalCta 主 CTA 外链 bozemetal.com/contact）
- **复用组件：** TrustBadges / Capabilities / QualityControl / Applications（已验证）
- **自定义紧凑区：** Supplier Profile（Boze Metal 实体 + 链 `/about/` `/facilities/` `/equipment/`）、Materials 3 卡片（→ `/materials/grade-5|2|23/`）、底部 CTA（→ `/rfq/` + WhatsApp）
- **SEO：** Title「Titanium CNC Machining Manufacturer \| AS9100D Certified…」、canonical、`pageType="service-detail"` + serviceName、补充 JSON-LD（Service + ManufacturingPlant + OfferCatalog + areaServed）、alternateLinks 仅 en+x-default（英文专属，不入 [lang] 路由）

**内链：** 2 篇高相关已上线博客补入口链（锚文本各异）：`how-to-choose-titanium-cnc-machining-supplier`（CNC machining manufacturer）、`custom-titanium-machining-contract-manufacturer-china-rfq-preparation`（titanium CNC machining manufacturer）。

**验证：** `check-undefined-slugs` 0 issue；`npm run build` 全链路通过（**2168 HTML**，+1 新页）；dist：h1/canonical/title ✅、CTA→/rfq/ ×2、材料链接 ×3、ld+json ×2（含 ManufacturingPlant）、sitemap-en.xml 收录、博客入口链 ✅。

**入口扩充（用户选轻量方案，2026-08-05）：** 入口从 2 条扩到 **9 条**：① 7 篇博客内链（原 2 篇 + 新增 aerospace-full-process、as9100d、cost-factors、cnc-services-blog、grade-2-vs-5-vs-23）；② 2 个英文落地页交叉链接横幅（`/titanium-machining/`、`/rfq/`，FinalCta 后 StickyCta 前，锚文本「titanium CNC machining manufacturer profile」）；③ sitemap-en.xml。**未动导航/页脚**（i18n 系统 + localizePath 会生成 /lang/ 404，属完整方案范畴）。build ✅ 2168 HTML、dist 0 重复包裹。

### GA 跟踪码增量部署上线（2026-08-05 15:20）
- **任务：** commit `eaf68377`「GA」（更新 GA 跟踪码 + 类型修复批次）向生产 FTP 提交（账号内置 `.env.production`）。
- **构建：** `npm run build` 全 5 步通过（约 80s），dist 共 2662 文件 / 332.6MB，GA4 `G-HT4X8QR22B` + Google Ads `AW-18359358390` 确认在产物中。
- **部署方式（时间限制下最优）：** 新增正式脚本 `scripts/deploy-incremental-ftp.js`（修复 `package.json` 中 `deploy:inc` 引用的缺失文件）：
  - 并行 SIZE 命令对比（6 连接，实测 ~247ms/文件，控制通道无需数据连接）→ 仅 407/2662 文件不同（60MB）；
  - 差异缓存 `.deploy-diff.json`（10min TTL，重启免重复对比）；
  - 4 连接并行上传（单连接实测仅 ~37KB/s，并行提至 ~0.6 文件/s）。
  - 结果：**407 成功 / 0 失败，总耗时 628s（~10.5min）**。
- **踩坑记录：** ① basic-ftp `list(path)` 若服务器 MLSD 忽略路径参数会无限递归列根目录（内存膨胀）→ 改用 SIZE 方案；② `ensureDir()` 会改变 cwd，上传须用「绝对父目录 ensureDir + basename uploadFrom」；③ 服务器单连接上传极慢（~120KB/s），必须并行；④ PowerShell 字符串 `.Length` ≠ UTF-8 字节数（多字节语言校验需用 FTP SIZE）。
- **线上验证（全部通过）：**
  - 首页 GA4 + Ads + gtag.js + consent 门控在线；`hreflang` 属性已生效（新构建标记）；
  - `/thank-you/` 含 `AW-18359358390/u_IbCPfX6tgcELantrJE` 转化代码；
  - `/ar/materials/grade-6242/` 等本次上传页 GA 码在线；
  - FTP SIZE 抽查 6 文件：远程字节数与本地 dist 完全一致（二进制完整性 ✅）。

### 剩余 src/ 错误深度修复（2026-08-05，第二轮）
**背景：** 用户问剩余 166 个错误是否需修复。逐一调查发现其中含多个**真实运行时 bug**，已全部修复；其余为类型级问题（slug 死分支等）。

**发现的真实 bug 与修复：**
| 文件 | Bug | 修复 |
|---|---|---|
| `src/components/react/RFQForm.tsx` | `const t = 'var(--theme-text)'` 颜色字符串被当翻译函数调用 `t('react.rfqform.*')`（20 处）→ 提交按钮等**运行时崩溃** | 全部替换为硬编码英文（该组件本就无 i18n） |
| `src/components/react/CADUpload.tsx` | `t` 完全未定义却调用 `t('react.cadupload.*')`（4 处）→ **运行时 ReferenceError** | 替换为硬编码英文 |
| `src/data/titanium-grades.ts` | 8 个 grade 条目的 `faqs`/`whyChooseUs` 被误嵌套进 `alternativeTo` 内 → **8 个 grade 页 FAQ/WhyChooseUs 区块静默丢失**（数据在、翻译键在、仅位置错） | 脚本将 8 处 `faqs`/`whyChooseUs` 移回顶层（14 个 grade 全部恢复顶层字段）；构建产物验证 grade-4 页 `<details>` 1→4 |
| `src/pages/products/product-entities/[...slug].astro` | `specEntry?.data?.faq` 字段名错（product-specs 集合是 `faqs` 复数）→ FAQ JSON-LD 恒空 | 改为 `specEntry?.data?.faqs`（注意：当前页 data 是 `faq` 单数，勿混淆） |
| `src/components/home/IndustriesServed.astro` | 内联 `onmouseover/onmouseout`（含 `\x27` 转义）导致 24 个 ts(1127)，且违反 SEMANTIC_CLOSURE §2.1 | 迁移为 CSS `:hover`（scoped `<style>`） |
| `src/components/home/EngineeringResources.astro` | `image: any` 必填但 3 个资源对象未提供 → 断图 + ts(2741) | `image?: string` + 条件渲染 |

**类型级修复：** `[lang]/index.astro`（pageData `Record<string, any>` 注解）、`BaseLayout.astro`（`canonicalURL?: string \| URL` + `String()` 归一化，消除 ~30 个设备/能力页错误）、`schema.ts`（`inLanguage ?? 'en-US'`）、`blog-i18n.ts`（stub 返回类型修正）、`ThemeSwitcher`/`HeroRfq`（函数参数 `: string` 注解）、`titanium-grades.ts`（`GradeSection` 补可选 `faqs`/`whyChooseUs`）。

**验证：** `npx astro check` 166→68；`npx astro build` ✅ 2210 页；grade-4 页 FAQ 恢复；prod-entities 详情页 FAQPage JSON-LD 存在。

**剩余 68 个错误分类（建议专项跟进）：** ① ~30 个 slug 类型错误（`entry.slug` 在 Astro v5 类型不存在、运行时为 undefined，均有 id 兜底 → 类型级、运行时安全）；② ~15 个组件 props 契约问题（CTA/Hero 的 Button props、RichEntityContent 3、UseCaseTabs/FacilityStats/StatsCards 的 ts(2769)、EngineeringReport 隐式 any 等）；③ 零星（ProcessWorkflow/documentation 缺 image、StickyCta 类型、ReverseEngineerTool string[] 等）。另：prod-entities 的 spec 注入匹配（`s.slug === specSlug`）因 v5 无 slug **静默失效**（构建产物 Jump-to 块缺失），修复需改用 id 匹配并重建验证——属行为变更，建议单独确认后处理。

**经验教训：** PowerShell 中 `[...slug]` 方括号会被当作 glob 通配符，`Select-String`/`git status` 需用 `-LiteralPath`/引号包裹，否则静默不匹配造成假阴性；不同 content collection 字段名可能不同（`faq` vs `faqs`），修改前必须查 `src/content/config.ts` 确认。

### 类型检查净化 + SEO 修复（2026-08-05，第一轮）
**背景：** 修复 BaseLayout `hrefLang` TS 错误后调研发现，`astro check` 1864 个错误中 84%（1562 个）来自根目录损坏草稿 `update_translations.js`（全部 ts(1005) 语法错误），其余为 temp/ 草稿 + src/ 既有类型错误。用户授权 Cline 决定处理范围。

**修改文件：**
| 文件 | 变更 |
|---|---|
| `src/layouts/BaseLayout.astro` | ① `hrefLang` → `hreflang`（第 170/172 行，标准 HTML 属性，修复 LinkHTMLAttributes 类型错误）；② 第 169 行 JSON-LD 与第 190 行 gtag 脚本加 `is:inline`（消除 2 个 astro(4000)）；③ 清理注释 U+FFFD 乱码（第 171/175 行，恢复 em-dash） |
| `src/lib/schema.ts` | `PageType` 联合类型新增 `'industry-detail'`（消除 12+ 个 ts(2322)）；switch 并入 `service-detail` 分支 → 行业详情页现生成 `Service` JSON-LD 实体（SEO 增强） |
| `tsconfig.json` | `exclude` 新增 `temp`/`tasks`/`output`/`scripts` 目录 + 根目录 8 个草稿脚本（update_translations.js 等）；非破坏性，草稿文件本体保留仅退出类型检查 |

**关键决策：**
- ❌ 不批量清理 ts(6133) 未使用变量（纯警告不影响构建；BaseLayout 剩 4 条：DEFAULT_LANG/hideThemeSwitcher/serviceHubKey/cmsDefaultTheme）
- ❌ 不删除草稿文件本体（仅 tsconfig 排除）
- ❌ 不修 `canonicalURL: URL` 的 ~30 个 equipment/capabilities 页面（涉及面大，留作专项）
- ⏳ 剩余 166 个 src/ 错误均为既有问题（IndustriesServed.astro 编码损坏 ts(1127) 24、RFQForm.tsx ts(2349) 19、[lang]/index.astro ts(2339) 12、titanium-grades.ts ts(2353) 8 等）

**验证：** `check-undefined-slugs`/`check-encoding` ✅；`npx astro check` 1864→166（本次改动 0 新增 error/warning）；`npx astro build` ✅ 2210 页；产物断言：`"@type":"Service"` 已生成、13 个 hreflang 链接（含 x-default）、is:inline 脚本渲染正确。

**经验教训：** `astro check` 输出含 ANSI 颜色码（`\x1b[91m` 前缀），PowerShell 正则统计前须剥离（`$esc = [char]27; -replace ($esc + '\\[[0-9;]*m')`）；`Get-Content`/`Select-String` 处理 700KB+ 输出会超时，应使用 `-Tail` 流式读取。

### 落地页表单改为 cPanel 原生 PHP 后端（2026-08-04）
用户确认最终方案：放弃 Formspree/Redirect，改用**自托管 PHP 处理询盘 + 图纸附件上传**（cPanel 共享主机、无 Node 运行时、零第三方费用）。

**新增/修改文件：**
- `public/submit-rfq.php`（新增）— 原生 PHP 处理：蜜罐 `bot-field` 静默拦截 → 文本字段 CR/LF 清洗 + 邮箱/长度校验 → 附件后缀白名单（step/stp/igs/iges/pdf/zip）+ 25MB 上限 + 危险 MIME 拦截 → `mail()` MIME multipart 打包 base64 附件 → 成功 `Location: /thank-you/`，失败 `?rfq=error`
- `src/pages/thank-you.astro`（新增）— 转化页，`noindex`，含 `window.__LANDING_CONVERSION_PLACEHOLDER__` 标记（compressHTML 会剥离纯注释脚本，故用真实语句占位）
- `src/components/landing/HeroRfq.astro` — 表单改为 `<form method="POST" action="/submit-rfq.php" enctype="multipart/form-data">`；新增隐藏蜜罐；文件字段 `name="drawing_attachment"` required（accept .zip 加入）；脚本改为拖拽→DataTransfer 附加真实 input + 客户端校验（25MB/ZIP）+ 防重复提交 + `?rfq=error` 错误横幅；CTA 改橙蓝高亮
- `src/layouts/BaseLayout.astro` — 新增 `noindex?: boolean` prop（robots meta 可覆盖）
- `astro.config.mjs` — sitemap 过滤 `/thank-you`（noindex 页不入 sitemap）
- `FinalCta.astro` / `StickyCta.astro` — CTA 改橙色渐变（#ff8a3d→#ff5a00）与石板蓝搭配

**关键决策：**
| 项 | 决策 |
|---|---|
| 表单提交 | 原生 multipart POST → PHP → mail()（无 JS fetch，最稳） |
| 文件上传 | 真实附件经 mail() base64 发送；PHP 白名单+大小+危险 MIME 三重校验 |
| 转化统计 | 成功跳 `/thank-you/`（GTM 占位在 is:inline 脚本中保留）；BaseLayout 头部 gtagReportConversion 定义仍在（页面不再直接调用） |
| GTM 占位 | compressHTML 会删纯注释脚本 → 改用 `window.__LANDING_CONVERSION_PLACEHOLDER__ = true;` 真实语句标记 |

**验证：** `check-undefined-slugs`/`check-encoding` 通过；`npx astro build` ✅ 2210 页；产物断言：form POST action、honeypot、drawing_attachment required、橙 CTA、thank-you noindex+H1+GTM 标记、`dist/submit-rfq.php` 原样拷贝、sitemap 排除 thank-you、单 H1、ManufacturingPlant JSON-LD。PHP 本机无 CLI 未 lint（cPanel 部署后 `php -l submit-rfq.php` 验证）。

**部署：** `npm run build` → 上传 `dist/` 全部内容到 cPanel `public_html/`；编辑 `public/submit-rfq.php` 顶部 `$to` 为公司邮箱。

### FTP 部署上线（2026-08-04）
用户授权使用内置 FTP 凭据直接部署。

- 主机 cPanel **无 public_html 层级**，FTP 根目录即网站文档根（`.env.production` 的 `PRODUCTION_SERVER_PATH=/` 证实）；全量 `npm run deploy`（2661 文件）在 FTP 下单文件串行约需 40+ 分钟，中途终止。
- 改用**精准上传**脚本（basic-ftp，复用 `.env.production` 凭据）只传本任务文件：根目录 `index.html/robots.txt/404.html/sitemap-*.xml/submit-rfq.php` + `thank-you/` + `titanium-machining/` + `_astro/`(20 文件)。注意 `ensureDir` 在本机（CD-first 流程）失败，需显式 `MKD`。
- 线上验证：`/submit-rfq.php` 302（PHP 已执行）；`/thank-you/` 200（H1/24h 文案/noindex/`__LANDING_CONVERSION_PLACEHOLDER__` 全在）；`/titanium-machining/` 200（含 action=/submit-rfq.php、drawing_attachment、蜜罐、橙 CTA）；**真实 POST 实测 → 302 跳转 `/thank-you/`**（全链路通）；蜜罐 POST → 200 静默拦截。
- ⚠️ **待办（关键）**：`$to` 仍是占位符 `YOUR_COMPANY_EMAIL@YOURDOMAIN.COM`，邮件会被主机 mail 队列接受后丢失。用户设置真实公司邮箱前，询盘不会送达收件箱（页面流程正常，仅邮件目的地为占位）。

### 邮箱 + Google Ads 转化代码配置上线（2026-08-04）
- `public/submit-rfq.php`：`$to = 'info@bozemetal.com'`（本地源 + 重新构建 + FTP 覆盖服务器文件，经 FTP 下载回验确认）。
- `src/pages/thank-you.astro`：占位标记替换为**真实 Google Ads 转化代码**：`gtag('event','conversion',{send_to:'AW-18359358390/u_IbCPfX6tgcELantrJE', value:1.0, currency:'TWD'})`，受 Consent Mode v2 门控（`localStorage.ad_consent === 'granted'`，与 CookieConsent/BaseLayout 同键同值）。转换 ID 取自 BaseLayout 的 gtagReportConversion（GA 标签 AW-18359358390 + 转化行为 u_IbCPfX6tgcELantrJE）。
- 线上验证：`/thank-you/` 含 send_to 代码 + consent 门控（旧占位已消失）；`/submit-rfq.php` GET→302（PHP 运行中）；FTP 下载服务器 submit-rfq.php 确认 `$to=info@bozemetal.com`。
- 部署方式：重建（35s）+ 最小 FTP 精准上传 2 文件（submit-rfq.php、thank-you/index.html）。
- 经验教训：日志文件名避免与仓库既有已跟踪文件重名（`deploy_final_log.txt` 曾被覆盖并删除，已 `git restore` 恢复）。
- ⚠️ 遗留观察：BaseLayout head 中 `gtag('config','{gaId}')` 与 `send_to:'{gaId}/...'` 是字面量占位符（未插值），站点级 gtagReportConversion 实际 send_to 无效；不影响本落地页新转化链路（感谢页脚本自包含正确 ID）。如需修复可改为模板字符串 `${gaId}`。

### 询盘邮件未收到 — 根因定位与修复（2026-08-04）
用户实测表单提交成功但未收到邮件。诊断结论：

| 检查项 | 结果 |
|---|---|
| DNS | `bozemetal.com` 邮箱托管**网易 163 企业邮箱**（qiye163mx01/02.mxmail.netease.com）；SPF=`v=spf1 +ip4:40.160.1.205 +include:relay.mailchannels.net +include:spf.163.com -all`（**已授权服务器 IP**） |
| 根因 | PHP 发件域用 `no-reply@cnc.bozemetal.com`，该子域**无 SPF** → 163 拒收/丢垃圾箱；且 `mail()` 返回 true 但投递失败（用户以为「没发」） |
| 服务器诊断 | `?rfq_diag=1` 临时口：PHP 8.3.31，mail() 可用，sendmail=/usr/sbin/sendmail -t -i，mail() 返回 true，POST/文件接收正常 |
| 修复 | `$fromEmail = 'no-reply@bozemetal.com'`（SPF 授权域）+ `mail(...,'-f '.$fromEmail)` 信封发件人 + 失败回退无 -f；已向 info@bozemetal.com 发出 2 封 `RFQ diag` 测试邮件待用户确认 |
| 上传限制 | 服务器 `post_max_size=8M`（upload 100M 但 POST 体 8M）→ 新增 `public/.htaccess`（php_value post_max_size 32M / upload_max_filesize 30M），**LiteSpeed 生效**（诊断复验 32M/30M） |

- 部署：重建 + FTP 上传最终 `dist/submit-rfq.php` 与 `.htaccess`；诊断口已从最终版移除（`?rfq_diag=1` 现 302）。
- 提交：`6a40a0cf` 修复询盘邮件投递 + .htaccess 上传限制（已推 origin/main）。
- 遗留建议：163 企业邮箱反垃圾严格，若仍收不到需在 163 后台加白名单或配 DKIM；`-f` 参数在部分 MTA 会被拒，已内置无 -f 回退。

### 附件投递验证（2026-08-04）
- 用户确认收到 `RFQ diag body A` 纯文本测试邮件 → **SPF 发件域修复生效**（no-reply@bozemetal.com → 163 收件箱）。
- **8MB 附件实测**：POST 带 8MB `.step` → 302 `/thank-you/`（HTTP 层 post_max_size=32M 已由 .htaccess 生效；`mail()` 成功入队），附件邮件 `Titanium Machining RFQ — Attachment Test` 已发，待用户确认收件。
- ⚠️ 25MB 边界说明：base64 使邮件体膨胀 ~33%（25MB 文件 ≈ 33MB 邮件），共享主机 Exim 常有单封大小上限（常见 25MB），故接近 25MB 的附件可能网页层成功、邮件层被拒。建议实用安全上限 ≈15–18MB，更大文件应 ZIP；如需下调表单文案待用户决定。

### 附件邮件被企业邮网关拦截 — 服务器端存储方案（2026-08-04）
用户确认：**1MB 附件也没收到**（纯文本能到）→ 非大小问题，而是**企业邮网关（恩特/163 链路）对外部发件人附件整体拦截**。

- MIME 结构已本机解析验证合法（boundary/双部件/base64 解码一致）→ 排除格式问题。
- **修复：双保险**：① 附件仍随邮件发送（网关放行则直达）；② **图纸同时保存服务器 `/rfq-files/`**（随机名 `rfq_日期_hex.step`），邮件正文附服务器路径提示；目录由 PHP 自引导创建并自动写入 deny-all `.htaccess`（FTP `MKD` 被拒 501，故不依赖 FTP 建目录）。
- 附件 MIME 改为规范类型映射（step→application/step、pdf→application/pdf、zip→application/zip 等）提升网关兼容。
- 实测：POST 带 2MB → 302；FTP 确认 `rfq-files/` 存在且含保存文件（精确 2MB）+ 自写 .htaccess；网页直访 `rfq-files/` 返回 404（不可公网下载）。
- 团队取件方式：FTP/cPanel 访问根目录 `rfq-files/`。提交 `5be7e7ff` 已推送。
- 遗留：若希望邮件附件直达，需 SMTP 认证发信（用 info@bozemetal.com 的 SMTP 账号+密码）或邮件后台白名单/DKIM——需用户提供凭据/操作。

### 表单移除附件上传（2026-08-04）
用户决定：落地页表单**去掉 CAD 附件上传控件**，改为提示「Need to send CAD attachments? Email them directly to info@bozemetal.com to avoid losing drawings.」（避免图纸丢失）。

- `src/components/landing/HeroRfq.astro`：删除拖拽区/tm-file-input/tm-dropzone/drawing_attachment 及对应 JS（handleFile/DataTransfer/校验），副标题改为「Submit your project requirements…」；新增 mailto 提示卡片。表单仍 `enctype=multipart/form-data` + POST `/submit-rfq.php`（兼容 PHP 防御性处理）。
- PHP `submit-rfq.php` **未改**：无文件时走 UPLOAD_ERR_NO_FILE 分支照常收询盘；若直接 POST 带文件仍会存档 rfq-files（防御性）。
- 实测：无附件 POST → 302 /thank-you/；线上确认无上传控件、提示卡片+mailto 在位。提交 `46bce0d6` 已推送。

### 根因再定位：网关拦截 multipart/mixed（非仅附件）— 纯文本修复（2026-08-04）
用户反馈：**无附件真实提交邮件也未收到**（此前 `diag body A` 纯文本成功）。对比确认：

| 邮件 | 格式 | 结果 |
|---|---|---|
| diag body A/B | **text/plain** | ✅ 收到 |
| 真实表单（无附件）| **multipart/mixed**（PHP 始终按 multipart 构造）| ❌ 未收到 |

→ **网关拦的是 multipart/mixed 格式本身**（外部发件人），与有无附件无关。

- **修复**：`submit-rfq.php` 邮件构造改为分支——**无附件 → 纯文本 text/plain**（可靠送达，与成功样例同格式）；**有附件 → 才用 multipart/mixed**（best effort）。
- 已部署 + FTP 回验（含 text/plain 分支 + multipart 分支）；无附件 POST → 302；已发 `Plain Text Test` 待用户确认。提交 `e9adecca` 已推送。

### Google Ads Landing Page — `/titanium-machining/` (2026-08-04)
面向 "Titanium Machining Services" 关键词的 B2B 高转化单页落地页（英文，Google Ads Quality Score + CRO 优化）。

**交付文件（10）：**
- `src/pages/titanium-machining.astro` — 页面装配 + 精确 Title/Meta/Canonical + 补充 JSON-LD（Service + ManufacturingPlant + OfferCatalog）
- `src/components/landing/` 7 个模块组件：`HeroRfq` / `TrustBadges` / `Capabilities` / `QualityControl` / `Applications` / `FinalCta` / `StickyCta`
- `src/layouts/BaseLayout.astro` — Props 接口补声明 `alternateLinks?`（原已在 line 79 解构但未声明类型）

**关键技术决策：**
| 项 | 决策 | 原因 |
|---|---|---|
| 表单对接 | 用户选择 **Redirect** 策略：表单提交 → `window.open('https://www.bozemetal.com/contact')` 新标签页 + 站内成功面板（Email/WhatsApp/重开表单） | 主站 `/form/submitJoinForm` 无 CORS 头 + 需 CSRF（预检实测 500 无 ACAO），跨域 AJAX 必然被浏览器拦截；与现有 `InquiryForm.tsx`/home hero 模式一致 |
| SEO | Title `Precision Titanium CNC Machining Services \| AS9100D Certified`；Desc 含 ±0.005mm/24h；canonical `https://cnc.bozemetal.com/titanium-machining/`；`alternateLinks` 仅 en + x-default（避免 11 个 404 hreflang） | 精确匹配用户给定文案；页面为英文专属不加入 12 语 seo.ts |
| JSON-LD | `pageType="service-detail"` 走 `buildPageGraph`（自动 Organization/WebSite/WebPage/Breadcrumb/Service）+ 补充 ManufacturingPlant/OfferCatalog 图 | 合规（SEMANTIC_CLOSURE §3.1 备选方案） |
| 性能 | 0-JS 默认（无 React island），仅 2 个原生 `<script>`（表单 + 粘性 CTA，~5KB）；画廊用 CSS 渐变占位，零图片权重 | Lighthouse 100 意图 |
| ITAR | **不标注** ITAR Registered（主站未声称该认证，避免虚假信任信号）→ 用 AS9100D / ISO 9001:2015 / ISO 13485 / MTR Traceability | 真实性优先 |

**验证结果：**
- `check-undefined-slugs.mjs --ci` ✅ 0 issues；`check-encoding.mjs` ✅
- `npx astro build` ✅ 2209 页 / 41.67s 完成
- 产物断言：Title/Desc/Canonical 精确匹配；H1 唯一（1 个）；JSON-LD 2 块含 Service+ManufacturingPlant+OfferCatalog+Breadcrumb；alternate 仅 en/x-default；表单字段与粘性 CTA 均在；sitemap-0.xml 收录

**后续建议：** 部署后配置 Google Ads 转化（`window.gtagReportConversion()` 钩子已在 BaseLayout 定义，表单提交自动调用）；如需 ITAR 徽标须先取得注册证明。


## Recent Decisions

### Products Hub 结构化数据修复 — CollectionPage/ItemList/Breadcrumb (2026-08-03)
排查 `/products/systems/` 结构化数据发现 6 个问题并修复：

| # | 问题 | 修复 |
|---|---|---|
| 1 | `/products/systems/` 被 `detectPageType` 误判为 `product-detail`（路径段数>1），导致不生成 CollectionPage/ItemList | 6 个 hub 页显式传 `pageType="products-hub"` |
| 2 | `explicitPageType` 覆盖失效（回归）：BaseLayout 传 2 参，schema.ts `detectPageType(path)` 只收 1 参 | `schema.ts` 恢复 `detectPageType(path, explicit?)` 签名，`if (explicit) return explicit` |
| 3 | 手写孤立 CollectionPage JSON-LD（无 @id/url/isPartOf/mainEntity），与主 graph 割裂 | 删除 5 个 hub 页的手写 JSON-LD（systems/industries/materials/capabilities/product-entities） |
| 4 | 无 ItemList 枚举 60 个系统 | `buildItemList` 增加 `items` 参数生成 `itemListElement`；6 页传 `items`（name+真实 URL） |
| 5 | 面包屑名称差（完整 SEO title + 原始段名 "systems"）；根因 BaseLayout 用 `breadcrumbRaw` 而非带标签的 `breadcrumbItems` | ① schemaData 改用 `breadcrumbItems`（激活 NAV_LABEL_MAP 死代码）② `buildBreadcrumbItems` 增加 `BREADCRUMB_LABELS` 映射 + `humanizeSeg` 回退 |
| 6 | CollectionPage 与 ItemList 无关联 | `buildCollectionPage` 增加 `mainEntity` 指向 `#item-list`；ItemList 保留 `mainEntityOfPage` |

修改文件（8）：
- `src/lib/schema.ts`：detectPageType 签名、buildItemList/buildCollectionPage 扩展、SchemaPageData.items、BREADCRUMB_LABELS
- `src/layouts/BaseLayout.astro`：Props.items、schemaData 用带标签面包屑 + items、清理 buildPageGraph 死参
- 6 个 hub 页：`src/pages/products/{systems,industries,materials,capabilities,product-entities,component-library}/index.astro`

验证：`npx astro build` 通过（2208 页）；产物中 6 页均为**单块 JSON-LD**，含 CollectionPage(@id/url/isPartOf/mainEntity) + ItemList(numberOfItems + 真实 itemListElement)；面包屑 "Home → Products → Engineering Systems" 等正确；`check-encoding` / `check-undefined-slugs` 通过。

未改动（后续建议）：父级 `/products/` 的手写 JSON-LD 含完整行业分组 ItemList（DefinedTermSet），非孤立空块，暂保留。

### Service Component Theme Migration — Hardcoded Dark Colors → Theme Variables (2026-08-03)
用户报告 `/titanium-surface-treatment/` 切换到亮色主题时正文区域不变色。根因：页面 4 个正文组件（及全站其它服务组件）将深色主题色值（`#0F172A`/`#1E293B`/`#F8FAFC`/`#38BDF8`）硬编码进 Tailwind class，未引用 `--theme-*` CSS 变量。主题系统本身正常（`data-theme` + CSS 变量，`SubpageHero`/`Header`/`Footer`/`BrandAbout` 均已主题化）。

修复范围：全站 **24 个**服务组件（用户选择全面统一方案）：
- 6× DedicatedCta：Anodizing / Passivation / Surface / Texturing / Marking / Packaging
- 6× SpecsDashboard：Anodizing / Marking / Packaging / Passivation / Surface / Texturing
- 6× ProcessSpectrum / Classifications：AnodizingClassifications / Marking / Packaging / Passivation / Surface / Texturing
- 6× KnowHow：GallingColorVariation / GallingOsseointegration / HydrogenEmbrittlement / SmearingEmbedding / SmearingWarehouse / ThermalStress

替换规则（与已主题化兄弟组件 `CncProcessSpectrum`/`CncDedicatedCta` 一致）：
| 硬编码 | → | 主题变量 |
|---|---|---|
| `bg-[#0F172A]` | → | `bg-theme-bg` |
| `bg-[#1E293B]` / `border-[#1E293B]` | → | `bg-theme-surface` / `border-theme-surface` |
| `text-[#F8FAFC]` 及 `/NN` | → | `text-theme-text` 及 `/NN` |
| `bg/border/text-[#38BDF8]` 及 `/NN` | → | `bg/border/text-theme-primary` 及 `/NN` |
| 内联 `#38BDF8`/`#1E293B`/`#F8FAFC` | → | `var(--theme-primary)`/`var(--theme-surface)`/`var(--theme-text)` |
| 内联 `rgba(56,189,248,X)` | → | `color-mix(in srgb, var(--theme-primary) X%, transparent)` |
| `hover:shadow-[0_0_30px_rgba(56,189,248,X)]` | → | `hover:shadow-[0_0_30px_color-mix(in_srgb,var(--theme-primary)_X%,transparent)]` |

刻意保留：CTA 按钮深色文字 `text-[#0F172A]`（在 `var(--theme-primary)` 按钮上保证对比度，与 `CncDedicatedCta` 惯例一致）。

已主题化的 17 个 CTA 组件（`AdditiveBatchCta` 等，仅含按钮 `color: #0F172A`）确认无需改动。

### 验证结果
- ✅ `npx astro build` 成功：2208 页面，35s，无编译错误
- ✅ Tailwind v4 正确生成新类（`bg-theme-bg`、`text-theme-text/65`、`bg-theme-primary/10`、`hover:shadow-[...color-mix...]` 含 `@supports` 降级）
- ✅ `node scripts/check-encoding.mjs` 通过
- ✅ 构建产物中 `bg-[#0F172A]` 残留 = 0
- ✅ `git status` 仅 24 个目标文件被修改

### Brand Identity Migration (2026-07-29)
The cnc.bozemetal.com site branding has been systematically migrated from "BOZE CNC Ti" to **"Boze Titanium Manufacturing Center"** to:
1. Establish a distinct brand identity separate from bozemetal.com's "BOZE CNC-Ti" brand
2. Improve search engine understanding of this site as a manufacturing entity
3. Resolve the user's core concern that the site was still perceived as "BOZE CNC Ti"

### Files Modified

| File | Change |
|------|--------|
| **Header.astro** | `logoText`: `'BOZE CNC Ti'` → `'Boze Titanium Manufacturing Center'`; `logoAlt` updated |
| **Footer.astro** | `logoText`: `'BOZE CNC Ti'` → `'Boze Titanium Manufacturing Center'`; `logoAlt` updated |
| **schema.ts** | `Organization.brand.name`: `'Boze CNC Ti'` → `'Boze Titanium Manufacturing Center'`; `alternateName` updated; `WebSite.alternateName` updated; article author updated; image caption updated |
| **seo.ts** | All page title suffixes `| BOZE CNC Ti` → `| Boze Titanium Manufacturing Center`; About page titles/descriptions updated; Blog descriptions updated; Theme demo descriptions updated (~150+ multilingual entries) |
| **en.json** | About page content (hero title, description, story, process steps, subtitle) updated; Blog description updated; Cookie policy & Terms of Service updated; Grade page badge updated |
| **home.md** | Badge text: `BOZE CNC Ti` → `Boze Titanium Manufacturing Center` |
| **en.json logoSubtext** | `"Titanium Manufacturing Center"` → `"Precision Titanium Manufacturing"` (avoid redundancy) |

### What Was NOT Changed (By Design)
- **"BOZE Metal"** — Parent company name, kept as is
- **"BOZE CNC operates..."** — FAQ/QA contexts where "BOZE CNC" refers to operational entity
- **Favicon filename** (`boze-cnc-ti-ico.png`) — Changing requires new image asset
- **OG image filename** (`boze-1-en.png`) — Changing requires new image asset
- **Video filename** (`boze-cnc-ti.mp4`) — Changing requires new video asset
- **Other language translation files** (de.json, ja.json, etc.) — Updated the most visible SEO titles/descriptions in seo.ts; full transcreation of 12 languages needed separately

## Current State
| Fix | File | Status |
|-----|------|--------|
| Header logo — icon | Header.astro | ✅ SVG cube icon（fallback） |
| Header logo — main text | Header.astro | ✅ `'Boze'` (简洁品牌名) |
| Header logo — subtext | en.json | ✅ `'Titanium Manufacturing Center'` |
| Footer logo — icon | Footer.astro | ✅ SVG cube icon（fallback） |
| Footer logo — main text | Footer.astro | ✅ `'Boze'` |
| Footer logo — subtext | en.json | ✅ `'Titanium Manufacturing Center'` |
| Schema brand name | schema.ts | ✅ `'Boze Titanium Manufacturing Center'` |
| SEO titles | seo.ts | ✅ All page titles updated |
| SEO descriptions | seo.ts | ✅ Blog & theme descriptions updated |
| About page content | en.json | ✅ Hero, story, process steps updated |
| Home badge | home.md | ✅ Updated |
| BaseLayout OG image ref | BaseLayout.astro | ✅ `boze-1-en.png` → `boze-tmc-og-en.png` |
| BaseLayout favicon ref | BaseLayout.astro | ✅ `boze-cnc-ti-ico.png` → `boze-tmc-favicon-32.png` |
| Schema imageObject ref | schema.ts | ✅ `boze-cnc-ti-ico.png` → `boze-tmc-favicon-32.png` |

## Image Assets Status
| Asset | File | Status |
|-------|------|--------|
| Favicon PNG | `public/uploads/boze-tmc-favicon-32.png` | ✅ Generated |
| Favicon WebP | `public/uploads/boze-tmc-favicon-32.webp` | ✅ Generated |
| OG Image PNG | `public/uploads/boze-tmc-og-en.png` | ✅ Generated |
| OG Image WebP | `public/uploads/boze-tmc-og-en.webp` | ✅ Generated |

## Next Steps
1. **Build & deploy** — Run `npm run build` and deploy to verify the changes live
2. **Monitor search console** — After deployment, monitor Google Search Console for re-indexing of the new brand entity
3. **12-language translation update** — Update all other language files (de, ja, fr, es, pt, etc.) to match the English rebranding

---

## Global Entity Alignment — JSON-LD Restructure (2026-08-08)

### Context
cnc.bozemetal.com (Boze Titanium Manufacturing Center) restructured to align with main site (BOZE CNC Ti) per client instruction. **Main site www.bozemetal.com unchanged.**

### Knowledge Graph (Single Source of Truth in `src/lib/schema.ts`)
```
Baoji Boze Metal Products Co., Ltd.   Legal Entity     @id https://www.bozemetal.com/#organization
  ├─ BOZE Metal                       Corporate Brand  @id https://www.bozemetal.com/#brand-boze-metal
  │    └─ BOZE CNC Ti                 Commercial Brand @id https://www.bozemetal.com/#brand-boze-cnc-ti (parentBrand: BOZE Metal)
  └─ Boze Titanium Manufacturing Center  Manufacturing Center Org  @id https://cnc.bozemetal.com/#manufacturing-center
       (parentOrganization → Legal Entity, brand → BOZE CNC Ti)
WebSite: cnc.bozemetal.com/#website, name "Boze Titanium Manufacturing Center", publisher → Legal Entity @id
```

### Changes
- `src/lib/schema.ts`: 4 fixed @id constants; `buildBrands()` (BOZE Metal + BOZE CNC Ti w/ parentBrand); `buildManufacturingCenter()`; Organization.alternateName → [BOZE Metal, BOZE CNC Ti, BOZE]; Organization.brand → both Brand @ids; `buildProduct()` removed `price:'Inquire'` (offers only with real numeric price), manufacturer → Legal Org @id, brand → BOZE CNC Ti @id; every page graph now emits Brands + Manufacturing Center.
- Product pages (`[...slug].astro`): Product has `@id=pageURL#product`, `url`, `image` (absolute), manufacturer=Legal Org, brand=BOZE CNC Ti; **removed** invalid offers + mis-typed `isRelatedTo`/`isPartOf`; image path fixed (svg→webp for the mouse).
- `SemanticClosedLoop.astro`: **removed duplicate Product/AggregateOffer**; DefinedTermSet @id namespace → cnc.bozemetal.com + real page slug; added `pageSlug` prop (via RichEntityContent).
- 7 capabilities pages + `[lang]/[...slug].astro` (7 multi-lang blocks): **removed hand-written JSON-LD** (WebPage/WebSite/Breadcrumb/ManufacturingBusiness @id=cnc/#organization) — BaseLayout is the only source. Fixed corrupted `capacity.astro` (duplicate template).
- 5 landing pages (titanium-machining, titanium-cnc-machining-manufacturer, 5-axis, as9100, rfq): `Service.provider` → `@id` reference to Legal Org + legal name (was name/url mismatch).
- Materials (`GradeStructuredData`/`StandardStructuredData`): eliminated phantom "Bozemetal CNC Ti Manufacturing"; author/publisher → BOZE CNC Ti Brand @id; Product brand/manufacturer aligned; removed invalid offers (UnitPriceSpecification w/o price).
- `[lang]/blog/[...slug].astro`: removed hand-written BlogPosting (dup with BaseLayout Article); added `pageType="blog-post"` so Article emits.
- Legal text: replaced "Bozhe Metal Titanium Technology Co., Ltd." (4th entity) with "Baoji Boze Metal Products Co., Ltd." in 12 i18n files + PrivacyPolicy + privacy-policy.astro. **⚠️ Client should verify legal entity name for privacy policy.**
- Deleted legacy root files `ja_equipment.html` (4th entity, old export) and `temp_homepage.html`.

### Verification
- `node scripts/check-undefined-slugs.mjs` → 0 issues (15 files scanned)
- `npx astro build` → 2219 pages, exit 0
- dist scan (2208 html): `price="Inquire"`=0, `ManufacturingBusiness`=0, `Bozemetal CNC Ti Manufacturing`=0, `cnc.bozemetal.com/#organization`=0
- Spot-checked: home/capabilities(en+ja)/landing/product-entities/materials-grade/blog(en+ja) — 1 Organization @id=www.bozemetal.com/#organization each, Brands + Manufacturing Center present, Product manufacturer=Legal Org / brand=BOZE CNC Ti, blog Article=1 BlogPosting=0.

### Next Steps
1. Deploy dist → re-test GSC URL inspection for the mouse product page (image now present, no invalid price).
2. Client to confirm "Baoji Boze Metal Products Co., Ltd." is correct Data Controller for privacy policy (or revert legal-text change).


---

## Production Deploy Recovery + Deploy Script Hardening (2026-08-08)

### Incident
`npm run deploy` (deploy-basic-ftp.js, FTPS single-connection) hit `ECONNRESET` on cPanel → partial upload → site in "new HTML + missing _astro assets" state (CSS 404, broken rendering).

### Root causes
1. cPanel FTP unstable: FTPS data connection reset; 4-concurrent plain FTP triggers server throttling (large failure batches).
2. Old `deploy-incremental-ftp.js`: `.deploy-diff.json` TTL 10min, no persisted success record → every restart re-did full SIZE compare + progress reset (user: "每次中断就从 0 开始").
3. Processes launched via the agent's run_commands got killed when the terminal session closed.

### Fixes
- **`scripts/deploy-incremental-ftp.js` v2 (resume + auto-retry):**
  - `deploy-manifest.json` persisted: every successfully uploaded file written immediately → restart resumes, no full re-compare, progress not lost.
  - Internal retry loop (MAX_ROUNDS=8): failures auto-re-enter next round until 0 failures.
  - Per-file retry (3x) + connection rebuild on ECONNRESET; UPLOAD_POOL 4→2 (stable).
- Recovery executed via `Start-Process` (detached process, survives terminal close).
- Deployed remaining 297 files (0 failures) after prior partial rounds; final SIZE-compare confirmed all 2671 files consistent on remote (the "2374 not uploaded" report was a false positive — files were already present & size-matched).
- `deploy-manifest.json` now covers all 2671 files (future `deploy:inc` runs are fast no-ops unless manifest deleted).

### Verified online (live)
- `/_astro/_slug_.DbjtM4T2.css` → 200 (82KB)
- `_astro/*.js` (client/vendor/component) → 200
- Homepage, capabilities(EN+JA), products, materials, equipment, industries render normally
- Mouse product page JSON-LD: `@id=pageURL#product`, manufacturer=Legal Org `www.bozemetal.com/#organization`, brand=`#brand-boze-cnc-ti` BOZE CNC Ti, no Inquire, image=webp, no `cnc.bozemetal.com/#organization`
- capabilities/manufacturing: no ManufacturingBusiness, no cnc/#organization, has manufacturing-center + brands

### Deploy process notes
- Use `Start-Process node scripts/deploy-incremental-ftp.js` (detached) for long FTP deploys; do NOT delete `deploy-manifest.json` between runs.
- `deploy-manifest.json` is runtime state (generated); consider adding to .gitignore if desired.

