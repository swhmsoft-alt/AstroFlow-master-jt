# Design Assets — Boze Titanium Manufacturing Center

This directory contains AI image generation prompts and specifications
for creating new brand assets for cnc.bozemetal.com.

## Required Assets

| Priority | Asset | File | Status |
|----------|-------|------|--------|
| P0 | Favicon (Ti symbol) | `boze-tmc-favicon-*.png` | ⏳ Needs generation |
| P0 | OG Share Image | `boze-tmc-og-en.png` | ⏳ Needs generation |
| P1 | WebP versions | `boze-tmc-og-en.webp` | ⏳ Auto-convert after PNG |

## Design Tokens

```css
--theme-bg-dark:        #0F172A  /* Deep navy / primary background */
--theme-surface:        #1E293B  /* Card/surface background */
--theme-text-light:     #F8FAFC  /* Near-white text */
--theme-primary-blue:   #3B82F6  /* Aerospace blue accent */
--titanium-silver:      #94A3B8  /* Metallic grey / secondary text */
--muted-grey:           #64748B  /* URL / muted text */
```

## Directories

- `public/uploads/` — Final destination for all generated image assets
- `docs/design-assets/` — Prompt files and specs

## Generation Workflow

1. Use AI prompts in `01-favicon-prompt.md` to generate favicon
2. Use AI prompts in `02-og-image-prompt.md` to generate OG image
3. Convert PNG → WebP for performance
4. Place all files in `public/uploads/`
5. Update code references in `src/layouts/BaseLayout.astro` and `src/lib/schema.ts`
