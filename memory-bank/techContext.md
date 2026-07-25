# Tech Context

## Core Stack
| Technology | Version | Usage |
|-----------|---------|-------|
| Astro | ^5.16.0 | SSG framework with i18n routing |
| TypeScript | ^5.9.3 | Strict mode, path aliases |
| Tailwind CSS | ^4.1.17 | Utility-first styling via Vite plugin |
| React | ^19.2.0 | Interactive components (CADUpload only) |
| motion | ^12.23.24 | Animations (vendor chunk) |
| lucide-react | ^0.554.0 | Icon set (vendor chunk) |

## Key Integrations
| Package | Purpose |
|---------|---------|
| `@astrojs/react` | React island support |
| `@astrojs/sitemap` | Multi-locale sitemap generation |
| `@tailwindcss/vite` | Tailwind v4 Vite integration |
| `@radix-ui/*` | Accessible UI primitives |
| `@reunmedia/astro-normalize-trailing-slash` | Trailing slash normalization |

## Project Structure
```
src/
├── assets/           — Static images/fonts
├── components/       — Astro & React components
│   ├── about/
│   ├── capabilities/
│   ├── equipment/
│   ├── home/
│   ├── industries/
│   ├── materials/
│   ├── react/        — React islands (CADUpload, InquiryForm)
│   ├── services/
│   └── ui/           — Reusable (Button, Card, Section, SubpageHero)
├── config/           — site.ts, seo.ts, hero.ts
├── content/          — Content collections + config.ts
├── data/             — Static data files
├── i18n/             — Translation utilities + JSON files
├── layouts/          — BaseLayout.astro only
├── lib/              — schema.ts, blog-i18n.ts, rehype plugins
├── pages/            — All routes
├── scripts/          — Build/optimization scripts
├── styles/           — global.css, rtl.css
└── utils/            — fonts, helpers
```

## Build Pipeline
```
npm run build →
  1. optimize:images (Sharp optimization)
  2. astro build (SSG output to dist/)
  3. split-sitemap (multi-file sitemap)
  4. postbuild.js (cleanup/postprocessing)
  5. postbuild:images

npm run deploy → build + FTP upload
```

## Path Aliases (tsconfig.json)
```
@/* → src/*
@components/* → src/components/*
@layouts/* → src/layouts/*
@config/* → src/config/*
@utils/* → src/utils/*
@lib/* → src/lib/*
@assets/* → src/assets/*
```
