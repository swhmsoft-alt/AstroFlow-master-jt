# Progress & TODO

## Completed
- ✅ Initial Memory Bank setup (projectbrief, productContext, systemPatterns, techContext, activeContext, progress)
- ✅ SEMANTIC_CLOSURE.md created (corrected for codebase reality)
- ✅ .clinerules updated with SEMANTIC_CLOSURE.md reference + conflict resolution
- ✅ **Fix #1** — BaseLayout.astro: Changed `walk(items: any[])` → `walk(items: NavItem[])`, added `NavItem` type import
- ✅ **Fix #2** — BaseLayout.astro: Added `<meta name="robots" content="index, follow" />`
- ✅ **Fix #3** — BaseLayout.astro: Changed `property="twitter:*"` → `name="twitter:*"` for all 3 Twitter Card tags
- ✅ **Fix #4** — Footer.astro: Added `target="_blank" rel="noopener noreferrer"` to LinkedIn link; improved `aria-label`
- ✅ **Fix #5** — ServicesOverview.astro: Migrated all 4 `onmouseover`/`onmouseout` handlers (card border+shadow, title color, corner accent, bottom CTA) to scoped CSS with `:hover` rules

## Pending
- [ ] Run `npx astro sync && npx tsc --noEmit` for full type check
- [ ] Run `npm run build` to verify production output
- [ ] Consider adding structured FAQ schema to service pages
