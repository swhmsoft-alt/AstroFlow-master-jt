# Progress & TODO

## Completed
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
- [ ] **P0.5 Supplier Entity Page** `/titanium-cnc-machining-manufacturer/`（待批准）
- [ ] **P0.6 AS9100 Landing**（待批准）
- [ ] **P1 5-Axis 深度强化 + RFQ Preparation**（待批准）
- [ ] 剩余 29 篇博客的 Semantic Linking（第二批，低商业价值优先级）
- [ ] keywordMap 增量（仅加长短语，规避 `<table>` 单元格自动链接）
- [ ] Run `npx astro sync && npx tsc --noEmit` for full type check
