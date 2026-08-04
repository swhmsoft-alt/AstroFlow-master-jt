# Active Context

> **Last Updated:** 2026-08-04
> **Current Focus:** Google Ads 落地页 `/titanium-machining/` — Precision Titanium CNC Machining Services 高转化单页 + 主站询盘表单对接

## Current Status
✅ Google Ads 落地页已构建并通过全量构建验证（2210 页 / 35.7s）。表单已改为 cPanel 原生 PHP 后端方案。

## Recent Decisions

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
