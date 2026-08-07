# Progress & TODO

## Completed
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
- [ ] 剩余 9 篇博客 Semantic Linking（第 4 批：alpha-case、astm-b348-vs-b265、high-pressure-coolant、chip-control、deformation、springback、tool-wear、work-hardening、welcome —— TOFU/MOFU 信息型，低价值；welcome 目前 0 链接完全孤立）
- [ ] keywordMap 增量（仅加长短语，规避 `<table>` 单元格自动链接）
- [ ] Run `npx astro sync && npx tsc --noEmit` for full type check
- [ ] 生产部署：全部近期改动（RFQ 重构/86 内链/Supplier 页/AS9100 页/5-Axis 页）需 commit + `npm run deploy:inc`
