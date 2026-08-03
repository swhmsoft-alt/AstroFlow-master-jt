# Active Context

> **Last Updated:** 2026-08-03
> **Current Focus:** Service 组件主题变量迁移 — 全站硬编码深色背景修复完成

## Current Status
✅ Brand identity migration across all major touchpoints completed.

## Recent Decisions

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
