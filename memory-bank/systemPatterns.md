# System Patterns & Architecture

## Architecture Overview
```
astro.config.mjs (SSG, i18n, sitemap, tailwind)
├── src/
│   ├── layouts/BaseLayout.astro  (all pages wrapped)
│   ├── components/               (islands, sections, ui)
│   ├── content/config.ts         (10+ zod-validated collections)
│   ├── config/site.ts            (global nav, social, site config)
│   ├── config/seo.ts             (per-page per-locale SEO entries)
│   ├── lib/schema.ts             (JSON-LD structured data engine)
│   ├── i18n/                     (12 language translations)
│   ├── pages/                    (routes: en/, [lang]/, [...slug])
│   ├── data/                     (static data: grades, equipment, etc.)
│   └── styles/                   (global.css, rtl.css)
└── memory-bank/                  (Cline context files)
```

## Key Design Patterns

### 1. JSON-LD Structured Data (schema.ts)
- Single-file custom implementation using `buildPageGraph()`
- Every page gets Organization → WebSite → WebPage → BreadcrumbList
- Type-specific: Article, Service, Product, CollectionPage added based on `PageType`
- `@id` references consistent across all entities (`#boze-org`, `#boze-website`)

### 2. i18n Routing
- Default locale (en) at root, others at `/[lang]/...`
- Astro built-in i18n + custom `getLangFromUrl()`, `useTranslations()`
- Translation files in `src/i18n/translations/*.json`
- Alternate hreflang links auto-generated in BaseLayout

### 3. SEO Layer
- BaseLayout handles: title, description, OG, Twitter, canonical, alternates, JSON-LD
- SEO_CONFIG provides per-path per-locale titles/descriptions
- Fallback chain: explicit prop → SEO_CONFIG → SITE defaults

### 4. Content Collections
- Zod schema validation for all collections
- `pages`, `products`, `blog`, `blog-translations`, `product-translations`
- Knowledge graph: `systems`, `capabilities`, `semantic-*`, `product-entities`, etc.

### 5. Theme System
- CSS custom properties (--theme-*) for dynamic theming
- Single theme "aerospace-precision" currently active
- RTL support for Arabic locale
