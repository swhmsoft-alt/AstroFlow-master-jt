// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';
// NOTE: previously imported `@reunmedia/astro-normalize-trailing-slash` here,
// but that package exports raw .ts source from node_modules 閳?Astro 5.18
// refuses to strip types from node_modules at config-load time, so `astro dev`
// crashes before any rendering starts.  The Astro built-in `trailingSlash: 'always'`
// option below already enforces trailing slashes at the route level, and our
// rehype-i18n-link plugin handles the cross-language variants.  The integration
// was redundant and is now removed.
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import { rehypeAutoInternalLinksI18n } from './src/lib/rehype-auto-internal-links-i18n.js';
import { createRehypeI18nLinkPlugin } from './src/lib/rehype-i18n-link.mjs';
import devDashboardApi from './astro/integrations/dev-dashboard-vite-plugin.mjs';

// https://astro.build
export default defineConfig({
  site: 'https://cnc.bozemetal.com',
  output: 'static',
  trailingSlash: 'always',
  integrations: [
    react(),
    sitemap({
      filter: (page) => !page.includes('/theme-demo') && !page.includes('/admin') && !page.includes('/thank-you') && !page.includes('/image-catalog'),
      changefreq: 'weekly',
      priority: 0.7,
      lastmod: new Date(),
      i18n: {
        defaultLocale: 'en',
        locales: {
          en: 'en-US',
          de: 'de-DE',
          ja: 'ja-JP',
          fr: 'fr-FR',
          es: 'es-ES',
          pt: 'pt-PT',
          it: 'it-IT',
          ko: 'ko-KR',
          nl: 'nl-NL',
          pl: 'pl-PL',
          ru: 'ru-RU',
          ar: 'ar-SA',
        },
      },
    }),
  ],
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'de', 'ja', 'fr', 'es', 'pt', 'it', 'ko', 'nl', 'pl', 'ru', 'ar'],
    routing: {
      prefixDefaultLocale: false,
    },
  },
  // F4 閳?Industry page slug reconciliation.
  // Maps content-collection-derived slugs (aerospace-defense, etc.) and
  // entity-registry canonical slugs to the actual /pages/industries/*.astro
  // filenames, so F1 internal-link mesh and JSON-LD @id refs don't 404.
  // 2026-08-25: 6 industry entities still have no dedicated page yet 閳?fall
  // back to the canonical /products/industries/ hub.
  redirects: {
    '/industries/aerospace-defense/':           '/industries/aerospace/',
    '/industries/chemical-processing/':         '/industries/chemical/',
    '/industries/marine-offshore/':             '/industries/marine/',
    '/industries/medical-device/':              '/industries/medical/',
    '/industries/automotive-motorsports/':      '/products/industries/',
    '/industries/consumer-electronics/':        '/products/industries/',
    '/industries/cycling---bicycle/':           '/products/industries/',
    '/industries/electroplating-surface-finishing/': '/products/industries/',
    '/industries/environmental-engineering/':   '/products/industries/',
    '/industries/general-industrial/':          '/products/industries/',
    // F5 閳?Blog category 閳?7-cluster redirects (P2 of cluster migration).
    // 8 effective redirects; 21 edge categories (1-2 posts) intentionally
    // produce no static page and 404 naturally 閳?see Plan 鎼? + 鎼?.
    // Slug `'machining-processes'` is unchanged, no redirect needed.
    '/blog/category/materials-engineering/': '/blog/materials-grades/',
    '/blog/category/manufacturing-problems/': '/blog/problems-solutions/',
    '/blog/category/quality-and-standards/': '/blog/quality-standards/',
    '/blog/category/applications-and-processes/': '/blog/applications-industries/',
    '/blog/category/procurement-guides/': '/blog/procurement-services/',
    '/blog/category/design-engineering/': '/blog/design-dfm/',
    '/blog/category/titanium-cnc-machining-services/': '/blog/procurement-services/',
    '/blog/category/case-studies/': '/blog/applications-industries/',

  // BSI Migration (2026-09-15) 閳?Phase A/B migrated from root to /capabilities/
  // per Hub-Mapping-First SOP. 301 redirects preserve SEO authority.
  '/titanium-compliance-and-certifications/': '/capabilities/compliance/',
  '/titanium-supplier-evaluation/': '/capabilities/supplier-evaluation/',

  // BSI Phase E 閳?ECO Iteration landing page moved under /capabilities/ hub.
  '/eco-iterative-cnc-machining/': '/capabilities/eco-iteration/',

  // /<lang>/capabilities/eco-iteration/ 閳?EN hub (Phase E).
  '/de/capabilities/eco-iteration/': '/capabilities/eco-iteration/',
  '/ja/capabilities/eco-iteration/': '/capabilities/eco-iteration/',
  '/fr/capabilities/eco-iteration/': '/capabilities/eco-iteration/',
  '/es/capabilities/eco-iteration/': '/capabilities/eco-iteration/',
  '/pt/capabilities/eco-iteration/': '/capabilities/eco-iteration/',
  '/it/capabilities/eco-iteration/': '/capabilities/eco-iteration/',
  '/ko/capabilities/eco-iteration/': '/capabilities/eco-iteration/',
  '/nl/capabilities/eco-iteration/': '/capabilities/eco-iteration/',
  '/pl/capabilities/eco-iteration/': '/capabilities/eco-iteration/',
  '/ru/capabilities/eco-iteration/': '/capabilities/eco-iteration/',
  '/ar/capabilities/eco-iteration/': '/capabilities/eco-iteration/',

  // F4 閳?`/standards/:slug/` 閳?`/materials/:slug/` (canonical exists).
  // SpecificationTable.astro previously hard-coded `/standards/` prefix which
  // 404'd; the redirect is a safety net for any external inbound link.
  '/standards/astm-b348/':     '/materials/astm-b348/',
  '/standards/astm-b265/':     '/materials/astm-b265/',
  '/standards/astm-b381/':     '/materials/astm-b381/',
  '/standards/astm-b338/':     '/materials/astm-b338/',
  '/standards/astm-b861/':     '/materials/astm-b861/',
  '/standards/astm-f67/':      '/materials/astm-f67/',
  '/standards/astm-f136/':     '/materials/astm-f136/',
  '/standards/astm-f86/':      '/materials/astm-f86/',
  '/standards/iso-5832-3/':    '/materials/iso-5832-3/',
  '/standards/iso-5832-11/':   '/materials/iso-5832-11/',
  '/standards/iso-2768/':      '/materials/iso-2768/',
  '/standards/astm-f2924/':    '/materials/astm-f2924/',
  '/standards/astm-f3001/':    '/materials/astm-f3001/',
  '/standards/ams-4911/':      '/materials/ams-4911/',
  '/standards/ams-4928/':      '/materials/ams-4928/',
  '/standards/ams-4943/':      '/materials/ams-4943/',
  '/standards/ams-4944/':      '/materials/ams-4944/',
  '/standards/ams-2488/':      '/materials/ams-2488/',
  '/standards/mil-t-9047/':    '/materials/mil-t-9047/',
  '/standards/mil-std-810h/':  '/capabilities/inspection/',

  // /de/capabilities/* 閳?EN-only sub-pages, redirect to nearest EN hub.
  '/de/capabilities/compliance/':           '/capabilities/certifications/',
  '/de/capabilities/lead-time/':            '/capabilities/manufacturing/',
  '/de/capabilities/logistics/':            '/capabilities/capacity/',
  '/de/capabilities/supplier-evaluation/':  '/capabilities/manufacturing/',

  // 10 other locales 鑴?4 sub-routes. Each /<lang>/capabilities/<sub>/  閳? EN hub.
  '/ja/capabilities/compliance/':           '/capabilities/certifications/',
  '/fr/capabilities/compliance/':           '/capabilities/certifications/',
  '/es/capabilities/compliance/':           '/capabilities/certifications/',
  '/pt/capabilities/compliance/':           '/capabilities/certifications/',
  '/it/capabilities/compliance/':           '/capabilities/certifications/',
  '/ko/capabilities/compliance/':           '/capabilities/certifications/',
  '/nl/capabilities/compliance/':           '/capabilities/certifications/',
  '/pl/capabilities/compliance/':           '/capabilities/certifications/',
  '/ru/capabilities/compliance/':           '/capabilities/certifications/',
  '/ar/capabilities/compliance/':           '/capabilities/certifications/',
  '/ja/capabilities/lead-time/':            '/capabilities/manufacturing/',
  '/fr/capabilities/lead-time/':            '/capabilities/manufacturing/',
  '/es/capabilities/lead-time/':            '/capabilities/manufacturing/',
  '/pt/capabilities/lead-time/':            '/capabilities/manufacturing/',
  '/it/capabilities/lead-time/':            '/capabilities/manufacturing/',
  '/ko/capabilities/lead-time/':            '/capabilities/manufacturing/',
  '/nl/capabilities/lead-time/':            '/capabilities/manufacturing/',
  '/pl/capabilities/lead-time/':            '/capabilities/manufacturing/',
  '/ru/capabilities/lead-time/':            '/capabilities/manufacturing/',
  '/ar/capabilities/lead-time/':            '/capabilities/manufacturing/',
  '/ja/capabilities/logistics/':            '/capabilities/capacity/',
  '/fr/capabilities/logistics/':            '/capabilities/capacity/',
  '/es/capabilities/logistics/':            '/capabilities/capacity/',
  '/pt/capabilities/logistics/':            '/capabilities/capacity/',
  '/it/capabilities/logistics/':            '/capabilities/capacity/',
  '/ko/capabilities/logistics/':            '/capabilities/capacity/',
  '/nl/capabilities/logistics/':            '/capabilities/capacity/',
  '/pl/capabilities/logistics/':            '/capabilities/capacity/',
  '/ru/capabilities/logistics/':            '/capabilities/capacity/',
  '/ar/capabilities/logistics/':            '/capabilities/capacity/',
  '/ja/capabilities/supplier-evaluation/':  '/capabilities/manufacturing/',
  '/fr/capabilities/supplier-evaluation/':  '/capabilities/manufacturing/',
  '/es/capabilities/supplier-evaluation/':  '/capabilities/manufacturing/',
  '/pt/capabilities/supplier-evaluation/':  '/capabilities/manufacturing/',
  '/it/capabilities/supplier-evaluation/':  '/capabilities/manufacturing/',
  '/ko/capabilities/supplier-evaluation/':  '/capabilities/manufacturing/',
  '/nl/capabilities/supplier-evaluation/':  '/capabilities/manufacturing/',
  '/pl/capabilities/supplier-evaluation/':  '/capabilities/manufacturing/',
  '/ru/capabilities/supplier-evaluation/':  '/capabilities/manufacturing/',
  '/ar/capabilities/supplier-evaluation/':  '/capabilities/manufacturing/',

  // Missing EN translation pages.
  '/de/case-studies/':                      '/case-studies/',
  '/de/industries/chemical/':               '/industries/chemical/',
  },
  markdown: {
    remarkPlugins: [remarkMath],
    rehypePlugins: [
      // F6 閳?Unified cross-language link filter. Handles all EN-only paths
      // (per src/config/route-availability.mjs EN_ONLY_PREFIXES) and
      // cross-language blog refs whose target translation does not exist
      // (per filesystem scan of src/content/blog-translations/). Replaces
      // the blog-only plugin with a single mechanism. Preserves anchor text
      // (so readers still see "閸欏倽鈧?X" citations), strips href so crawlers
      // see zero clickable URLs to untranslated territory. Also drops
      // hreflang <link rel="alternate"> for the same targets.
      createRehypeI18nLinkPlugin({ translationsDir: './src/content/blog-translations' }),
      rehypeKatex,
      [rehypeAutoInternalLinksI18n, {
        keywordMap: {
          "3/5-Axis CNC Machining": {
            "href": "/titanium-cnc-machining-services/3-5-axis-cnc-machining/"
          },
          "3/5-Axis CNC Milling": {
            "href": "/titanium-cnc-machining-services/3-5-axis-cnc-machining/"
          },
          "3D CMM inspection": {
            "href": "/products/capabilities/3d-cmm-inspection/"
          },
          "3D Printing SLM/DMLS": {
            "href": "/titanium-additive-manufacturing/3d-printing-slm/"
          },
          "3D Printing SLM": {
            "href": "/titanium-additive-manufacturing/3d-printing-slm/"
          },
          "5-Axis CNC Machining": {
            "href": "/titanium-cnc-machining-services/3-5-axis-cnc-machining/"
          },
          "5-Axis Machining": {
            "href": "/titanium-cnc-machining-services/3-5-axis-cnc-machining/"
          },
          // BSI Phase F 璺?Buyer Search Intelligence 璺?5-Entry rule (keywordMap)
          "AS9100D compliance hub": {
            "href": "/capabilities/compliance/"
          },
          "AS9100D titanium compliance": {
            "href": "/capabilities/compliance/"
          },
          // BSI Phase G 璺?Buyer Search Intelligence 璺?5-Entry rule (keywordMap)
          // Mill Products Hub inbound anchors
          "titanium mill products": {
            "href": "/mill-products/"
          },
          "titanium mill products hub": {
            "href": "/mill-products/"
          },
          "titanium bar plate tube stock": {
            "href": "/mill-products/"
          },
          "titanium mill product specifications": {
            "href": "/mill-products/"
          },
          "AS9100D mill product supply": {
            "href": "/mill-products/"
          },
          "titanium MTR documentation": {
            "href": "/mill-products/"
          },
          "titanium supplier evaluation": {
            "href": "/capabilities/supplier-evaluation/"
          },
          "ECO-controlled iterative CNC": {
            "href": "/capabilities/eco-iteration/"
          },
          "ECO iteration CNC machining": {
            "href": "/capabilities/eco-iteration/"
          },
          "iterative CNC with ECO control": {
            "href": "/capabilities/eco-iteration/"
          },
          "titanium lead time": {
            "href": "/capabilities/lead-time/"
          },
          "titanium CNC lead time": {
            "href": "/capabilities/lead-time/"
          },
          "titanium logistics": {
            "href": "/capabilities/logistics/"
          },
          "Incoterms for titanium shipping": {
            "href": "/capabilities/logistics/"
          },
          "Aerospace & Defense": {
            "href": "/industries/aerospace/"
          },
          "aerospace titanium": {
            "href": "/industries/aerospace/"
          },
          "AMS 4928T": {
            "href": "/materials/grade-5/"
          },
          "anodizing of titanium": {
            "href": "/titanium-surface-treatment/anodizing/"
          },
          "Anodizing / Surface Treatment Line": {
            "href": "/equipment/anodizing-surface-treatment/"
          },
          "Anodizing (Type II": {
            "href": "/titanium-surface-treatment/anodizing/"
          },
          "Anodizing (Type II & Type III)": {
            "href": "/titanium-surface-treatment/anodizing/"
          },
          "AS9100": {
            "href": "/capabilities/"
          },
          "AS9100D": {
            "href": "/capabilities/"
          },
          "ASTM B348": {
            "href": "/materials/grade-5/"
          },
          "Automatic Bar Feeder": {
            "href": "/equipment/automatic-bar-feeder/"
          },
          "Automatic Tool Magazine": {
            "href": "/equipment/automatic-tool-magazine/"
          },
          "Automatic Tool Presetter": {
            "href": "/equipment/tool-presetter/"
          },
          "bead blasting": {
            "href": "/products/capabilities/bead-blasting-anodizing-pvd/"
          },
          "Chemical Passivation": {
            "href": "/titanium-surface-treatment/chemical-passivation/"
          },
          "chemical passivation treatment": {
            "href": "/titanium-surface-treatment/chemical-passivation/"
          },
          "Chemical Processing": {
            "href": "/industries/chemical/"
          },
          "Chip Management & Fire Suppression System": {
            "href": "/equipment/chip-management-fire-suppression/"
          },
          "CMM": {
            "href": "/equipment/cmm/"
          },
          "CNC Machining": {
            "href": "/titanium-cnc-machining-services/"
          },
          "CNC Machining of Fittings & Flanges": {
            "href": "/titanium-cnc-machining-services/"
          },
          "CNC Milling": {
            "href": "/titanium-cnc-machining-services/cnc-milling-turning/"
          },
          "CNC Milling & Turning": {
            "href": "/titanium-cnc-machining-services/cnc-milling-turning/"
          },
          "CNC Turning & Mill-Turn": {
            "href": "/titanium-cnc-machining-services/cnc-milling-turning/"
          },
          "CNC Turning & Milling": {
            "href": "/titanium-cnc-machining-services/cnc-milling-turning/"
          },
          "Comprehensive Titanium Manufacturing": {
            "href": "/"
          },
          "Comprehensive Titanium Manufacturing & Processing Services": {
            "href": "/"
          },
          // BSI 2026-10-08 — Titanium Grades Guide pillar page (5-inbound #5: keywordMap)
          "titanium grades guide": {
            "href": "/resources/titanium-grades-guide/"
          },
          "Titanium Grades Guide": {
            "href": "/resources/titanium-grades-guide/"
          },
          "titanium grade selection hub": {
            "href": "/resources/titanium-grades-guide/"
          },
          "titanium alloy grades comparison": {
            "href": "/resources/titanium-grades-guide/"
          },
          "Grade 5 vs Grade 23 titanium": {
            "href": "/resources/titanium-grades-guide/#grade-grade-23"
          },
          "Grade 7 titanium corrosion resistance": {
            "href": "/resources/titanium-grades-guide/#grade-grade-7"
          },
          "Grade 12 titanium chemical composition": {
            "href": "/resources/titanium-grades-guide/#grade-grade-12"
          },
          "ASTM B348 titanium grades": {
            "href": "/resources/titanium-grades-guide/"
          },
          "AMS 4928 titanium specification": {
            "href": "/resources/titanium-grades-guide/"
          },
          "ISO 5832-3 Ti-6Al-4V surgical implants": {
            "href": "/resources/titanium-grades-guide/"
          },
          "EN 10204 3.1 mill test report titanium": {
            "href": "/resources/titanium-grades-guide/"
          },
          // BSI 2026-10-09 — Design & Engineering Guide pillar page (5-inbound #5: keywordMap)
          "titanium design engineering guide": {
            "href": "/resources/design-engineering-guide/"
          },
          "Titanium Design & Engineering Guide": {
            "href": "/resources/design-engineering-guide/"
          },
          "titanium DFM hub": {
            "href": "/resources/design-engineering-guide/"
          },
          "titanium DFM engineering hub": {
            "href": "/resources/design-engineering-guide/"
          },
          "titanium DFM rules": {
            "href": "/resources/design-engineering-guide/#rule-thin-wall"
          },
          "titanium minimum wall thickness": {
            "href": "/resources/design-engineering-guide/#rule-thin-wall"
          },
          "titanium internal corner radius": {
            "href": "/resources/design-engineering-guide/#rule-internal-radius"
          },
          "titanium deep hole drilling L/D ratio": {
            "href": "/resources/design-engineering-guide/#rule-deep-hole"
          },
          "titanium thread depth DFM": {
            "href": "/resources/design-engineering-guide/#rule-thread-depth"
          },
          "titanium 5-axis toolpath engagement": {
            "href": "/resources/design-engineering-guide/#rule-5axis-toolpath"
          },
          "titanium surface roughness Ra stress relief": {
            "href": "/resources/design-engineering-guide/#rule-surface-finish"
          },
          "ASME Y14.5 titanium GD&T": {
            "href": "/resources/design-engineering-guide/"
          },
          "AS9100D titanium design review": {
            "href": "/resources/design-engineering-guide/"
          },
          "Coordinate Measuring Machine (CMM)": {
            "href": "/equipment/cmm/"
          },
          "Custom Industrial Components": {
            "href": "/titanium-cnc-machining-services/custom-industrial-components/"
          },
          "deburring of components": {
            "href": "/products/capabilities/deburring-edge-rounding/"
          },
          "dimensional inspection": {
            "href": "/products/capabilities/100-dimensional-inspection-cmm/"
          },
          "electropolishing": {
            "href": "/products/capabilities/electropolishing/"
          },
          "legacy-materials-grade-4-eli": {
            "href": "/materials/grade-4-eli/"
          },
          "legacy-case-studies-semiconductor-uhv-showerhead": {
            "href": "/case-studies/semiconductor-uhv-showerhead/"
          },
          "legacy-materials-grade-4": {
            "href": "/materials/grade-4/"
          },
          "legacy-materials-grade-9": {
            "href": "/materials/grade-9/"
          },
          "legacy-materials-grade-21": {
            "href": "/materials/grade-21/"
          },
          "legacy-materials-grade-19": {
            "href": "/materials/grade-19/"
          },
          "legacy-case-studies-medical-bone-screws": {
            "href": "/case-studies/medical-bone-screws/"
          },
          "legacy-materials-grade-1": {
            "href": "/materials/grade-1/"
          },
          "legacy-materials-grade-3": {
            "href": "/materials/grade-3/"
          },
          "legacy-materials-grade-6242": {
            "href": "/materials/grade-6242/"
          },
          "legacy-materials-grade-6": {
            "href": "/materials/grade-6/"
          },
          "legacy-materials-grade-5": {
            "href": "/materials/grade-5/"
          },
          "legacy-materials-grade-23": {
            "href": "/materials/grade-23/"
          },
          "Manufacturing Example: Thin-Wall Titanium Aerospace Housing": {
            "href": "/case-studies/aerospace-thin-wall-housing/"
          },
          "legacy-materials-ti-6211": {
            "href": "/materials/ti-6211/"
          },
          "legacy-materials-grade-2": {
            "href": "/materials/grade-2/"
          },
          "Energy": {
            "href": "/industries/energy/"
          },
          "Forming & Bending": {
            "href": "/titanium-forming-heavy-manufacturing/"
          },
          "Grade 1 Titanium": {
            "href": "/materials/grade-1/"
          },
          "Grade 2 Titanium": {
            "href": "/materials/grade-2/"
          },
          "Grade 23 Titanium": {
            "href": "/materials/grade-23/"
          },
          "Grade 5 Titanium": {
            "href": "/materials/grade-5/"
          },
          "Grade 9 Titanium": {
            "href": "/materials/grade-9/"
          },
          "ISO 13485": {
            "href": "/capabilities/"
          },
          "ISO 9001": {
            "href": "/capabilities/"
          },
          "ITAR": {
            "href": "/capabilities/"
          },
          "Laser Cutting": {
            "href": "/titanium-fabrication-services/laser-cutting/"
          },
          "Laser Cutting (Sheet": {
            "href": "/titanium-fabrication-services/laser-cutting/"
          },
          "Laser Cutting (Sheet & Tube)": {
            "href": "/titanium-fabrication-services/laser-cutting/"
          },
          "Laser Tracker / 3D Scanner": {
            "href": "/equipment/laser-tracker-3d-scanner/"
          },
          "laser welding titanium": {
            "href": "/titanium-fabrication-services/titanium-welding-assembly/"
          },
          "Low-Volume Production": {
            "href": "/titanium-additive-manufacturing/low-volume-production/"
          },
          "Marine & Offshore": {
            "href": "/industries/marine/"
          },
          "marine titanium components": {
            "href": "/industries/marine/"
          },
          "Medical Device": {
            "href": "/industries/medical/"
          },
          "medical implants": {
            "href": "/industries/medical/"
          },
          "NADCAP": {
            "href": "/capabilities/"
          },
          "Pipe Spool Fabrication": {
            "href": "/titanium-fabrication-services/titanium-welding-assembly/"
          },
          "Polishing": {
            "href": "/titanium-surface-treatment/polishing-sandblasting/"
          },
          "Polishing & Sandblasting": {
            "href": "/titanium-surface-treatment/polishing-sandblasting/"
          },
          "Precision CNC Machining": {
            "href": "/titanium-cnc-machining-services/"
          },
          "Rapid Prototyping": {
            "href": "/nl/titanium-additive-manufacturing/rapid-prototyping/"
          },
          "Raw Material Preparation": {
            "href": "/titanium-forming-heavy-manufacturing/raw-material-preparation-sizing/"
          },
          "Raw Material Preparation & Sizing": {
            "href": "/titanium-forming-heavy-manufacturing/raw-material-preparation-sizing/"
          },
          "RFQ": {
            "href": "/rfq/"
          },
          "Robotic Loading / Pallet System": {
            "href": "/equipment/robotic-pallet-system/"
          },
          "Semiconductor": {
            "href": "/industries/semiconductor/"
          },
          "semiconductor titanium components": {
            "href": "/industries/semiconductor/"
          },
          "SLM": {
            "href": "/titanium-additive-manufacturing/3d-printing-slm/"
          },
          "Surface Treatment": {
            "href": "/titanium-surface-treatment/"
          },
          "thread rolling of titanium": {
            "href": "/products/capabilities/thread-rolling/"
          },
          "Through-Spindle High-Pressure Coolant System": {
            "href": "/equipment/high-pressure-coolant/"
          },
          "Ti-5Al-5V-5Mo-3Cr High Strength Titanium": {
            "href": "/materials/ti-5553/"
          },
          "Ti-6Al-4V ELI": {
            "href": "/materials/grade-23/"
          },
          "Ti-6Al-4V": {
            "href": "/materials/grade-5/"
          },
          "TIG (GTAW) Pipe Welding": {
            "href": "/titanium-fabrication-services/titanium-welding-assembly/"
          },
          "TIG Welding & Fabrication": {
            "href": "/titanium-fabrication-services/titanium-welding-assembly/"
          },
          "titanium 3D printing parts": {
            "href": "/titanium-additive-manufacturing/"
          },
          "Titanium Additive Manufacturing": {
            "href": "/titanium-additive-manufacturing/"
          },
          "titanium AI infrastructure components": {
            "href": "/industries/ai-infrastructure/"
          },
          "titanium chemical processing equipment": {
            "href": "/industries/chemical/"
          },
          "Titanium CNC Machining Services": {
            "href": "/titanium-cnc-machining-services/"
          },
          "titanium CNC parts": {
            "href": "/parts/titanium-cnc-parts/"
          },
          "titanium components for the energy industry": {
            "href": "/industries/energy/"
          },
          "titanium components for UAVs and drones": {
            "href": "/industries/uav-drones/"
          },
          "Titanium Extrusion": {
            "href": "/titanium-forming-heavy-manufacturing/titanium-extrusion/"
          },
          "titanium fabricated parts": {
            "href": "/parts/titanium-fabricated-parts/"
          },
          "Titanium Fabrication Services": {
            "href": "/titanium-fabrication-services/"
          },
          "titanium fasteners": {
            "href": "/products/capabilities/cnc-turning-of-bolt-heads-and-threads/"
          },
          "titanium flanges": {
            "href": "/products/capabilities/cnc-machining-of-mating-flanges/"
          },
          "Titanium Forging": {
            "href": "/titanium-forming-heavy-manufacturing/titanium-forging/"
          },
          "Titanium Forming": {
            "href": "/titanium-forming-heavy-manufacturing/"
          },
          "Titanium Forming & Heavy Manufacturing": {
            "href": "/titanium-forming-heavy-manufacturing/"
          },
          "titanium industrial equipment components": {
            "href": "/industries/industrial-equipment/"
          },
          "titanium marine parts": {
            "href": "/parts/titanium-marine-parts/"
          },
          "titanium medical components": {
            "href": "/parts/titanium-medical-components/"
          },
          "titanium motorsport parts": {
            "href": "/parts/titanium-motorsport-parts/"
          },
          "titanium parts": {
            "href": "/parts/"
          },
          "titanium pipe components": {
            "href": "/parts/titanium-pipe-components/"
          },
          "Titanium Rapid Prototyping": {
            "href": "/titanium-additive-manufacturing/rapid-prototyping/"
          },
          "Titanium Surface Treatment": {
            "href": "/titanium-surface-treatment/"
          },
          "Titanium TIG (GTAW) Welding": {
            "href": "/titanium-fabrication-services/titanium-welding-assembly/"
          },
          "titanium UAV components": {
            "href": "/parts/titanium-uav-components/"
          },
          "Titanium Welding & Assembly": {
            "href": "/titanium-fabrication-services/titanium-welding-assembly/"
          },
          "Titanium Welding": {
            "href": "/titanium-fabrication-services/titanium-welding-assembly/"
          },
          "Turn-Mill CNC (Multi-Tasking Machine)": {
            "href": "/equipment/turn-mill-cnc/"
          },
          "ultrasonic cleaning": {
            "href": "/products/capabilities/ultrasonic-cleaning/"
          },
          "Vacuum/Nitrogen Heat-Treat Furnace": {
            "href": "/equipment/vacuum-heat-treat-furnace/"
          },
          "Waterjet Cutting": {
            "href": "/titanium-fabrication-services/waterjet-cutting/"
          },
          "waterjet cutting of titanium": {
            "href": "/titanium-fabrication-services/waterjet-cutting/"
          },
          "Wire EDM": {
            "href": "/titanium-cnc-machining-services/wire-edm-machining/"
          },
          "Wire EDM Machine": {
            "href": "/equipment/wire-edm/"
          },
          "Wire EDM Machining": {
            "href": "/titanium-cnc-machining-services/wire-edm-machining/"
          },
          "3/5-Achsen-CNC-Bearbeitung": {
            "href": "/de/titanium-cnc-machining-services/3-5-axis-cnc-machining/"
          },
          "3D-Druck SLM": {
            "href": "/de/titanium-additive-manufacturing/3d-printing-slm/"
          },
          "3D-Druck SLM/DMLS": {
            "href": "/de/titanium-additive-manufacturing/3d-printing-slm/"
          },
          "Additive Fertigung von Titan": {
            "href": "/de/titanium-additive-manufacturing/"
          },
          "Chemische Passivierung": {
            "href": "/de/titanium-surface-treatment/chemical-passivation/"
          },
          "Titan-Oberfl鐩瞔henbehandlung": {
            "href": "/de/titanium-surface-treatment/"
          },
          "Titanschwei鑴絜n": {
            "href": "/de/titanium-fabrication-services/titanium-welding-assembly/"
          },
          "CNC-Fr鐩瞫en & Drehen": {
            "href": "/de/titanium-cnc-machining-services/cnc-milling-turning/"
          },
          "Titanschwei鑴絜n & Montage": {
            "href": "/de/titanium-fabrication-services/titanium-welding-assembly/"
          },
          "CNC-Fr鐩瞫en": {
            "href": "/de/titanium-cnc-machining-services/cnc-milling-turning/"
          },
          "Drahterodieren (Wire EDM)": {
            "href": "/de/titanium-cnc-machining-services/wire-edm-machining/"
          },
          "Eloxieren (Typ II": {
            "href": "/de/titanium-surface-treatment/anodizing/"
          },
          "Eloxieren (Typ II & Typ III)": {
            "href": "/de/titanium-surface-treatment/anodizing/"
          },
          "Kleinserienproduktion": {
            "href": "/de/titanium-additive-manufacturing/low-volume-production/"
          },
          "Kundenspezifische Industriekomponenten": {
            "href": "/de/titanium-cnc-machining-services/custom-industrial-components/"
          },
          "Laserschneiden (Blech": {
            "href": "/de/titanium-fabrication-services/laser-cutting/"
          },
          "Laserschneiden (Blech & Rohr)": {
            "href": "/de/titanium-fabrication-services/laser-cutting/"
          },
          "Polieren": {
            "href": "/de/titanium-surface-treatment/polishing-sandblasting/"
          },
          "Polieren & Sandstrahlen": {
            "href": "/de/titanium-surface-treatment/polishing-sandblasting/"
          },
          "Rohmaterialvorbereitung": {
            "href": "/de/titanium-forming-heavy-manufacturing/raw-material-preparation-sizing/"
          },
          "Rohmaterialvorbereitung & Zuschnitt": {
            "href": "/de/titanium-forming-heavy-manufacturing/raw-material-preparation-sizing/"
          },
          "Titan-Blechverarbeitungsdienste": {
            "href": "/de/titanium-fabrication-services/"
          },
          "Titan-CNC-Bearbeitungsdienste": {
            "href": "/de/titanium-cnc-machining-services/"
          },
          "Titan-Strangpressen": {
            "href": "/de/titanium-forming-heavy-manufacturing/titanium-extrusion/"
          },
          "Titan-Umformung": {
            "href": "/de/titanium-forming-heavy-manufacturing/"
          },
          "Titan-Umformung & Schwerindustriefertigung": {
            "href": "/de/titanium-forming-heavy-manufacturing/"
          },
          "Titanschmieden": {
            "href": "/de/titanium-forming-heavy-manufacturing/titanium-forging/"
          },
          "Umfassende Titanverarbeitungs- und Fertigungsdienstleistungen": {
            "href": "/de/"
          },
          "Wasserstrahlschneiden": {
            "href": "/de/titanium-fabrication-services/waterjet-cutting/"
          },
          "legacy-ja-titanium-surface-treatment-chemical-passivation": {
            "href": "/ja/titanium-surface-treatment/chemical-passivation/"
          },
          "legacy-ja-titanium-cnc-machining-services-custom-industrial-components": {
            "href": "/ja/titanium-cnc-machining-services/custom-industrial-components/"
          },
          "legacy-ja-titanium-cnc-machining-services-cnc-milling-turning": {
            "href": "/ja/titanium-cnc-machining-services/cnc-milling-turning/"
          },
          "閵変降鍋妷鍐差暭閺夋劘锛濋柅鐙呯礄3D閵夋ぜ鍎堕妷鐐藉剱閵堬絻鍏傞妶甯礆": {
            "href": "/ja/titanium-additive-manufacturing/"
          },
          "legacy-ja-titanium-forming-heavy-manufacturing-titanium-extrusion": {
            "href": "/ja/titanium-forming-heavy-manufacturing/titanium-extrusion/"
          },
          "legacy-ja-titanium-cnc-machining-services-wire-edm-machining": {
            "href": "/ja/titanium-cnc-machining-services/wire-edm-machining/"
          },
          "legacy-ja": {
            "href": "/ja/"
          },
          "legacy-ja-titanium-additive-manufacturing-3d-printing-slm": {
            "href": "/ja/titanium-additive-manufacturing/3d-printing-slm/"
          },
          "legacy-ja-titanium-fabrication-services": {
            "href": "/ja/titanium-fabrication-services/"
          },
          "legacy-ja-titanium-surface-treatment": {
            "href": "/ja/titanium-surface-treatment/"
          },
          "legacy-ja-titanium-surface-treatment-polishing-sandblasting": {
            "href": "/ja/titanium-surface-treatment/polishing-sandblasting/"
          },
          "閵夆斂鍎熼妷鍐﹀剶閵夋ぜ鍎归妷鍫涘仾閵堛們鍎熼妷鐐藉仒": {
            "href": "/ja/titanium-additive-manufacturing/rapid-prototyping/"
          },
          "閵変降鍋妷铏喚閹恒儯鍏撶徊鍕彌": {
            "href": "/ja/titanium-fabrication-services/titanium-welding-assembly/"
          },
          "legacy-ja-titanium-forming-heavy-manufacturing-titanium-forging": {
            "href": "/ja/titanium-forming-heavy-manufacturing/titanium-forging/"
          },
          "legacy-ja-titanium-surface-treatment-anodizing": {
            "href": "/ja/titanium-surface-treatment/anodizing/"
          },
          "legacy-ja-titanium-cnc-machining-services": {
            "href": "/ja/titanium-cnc-machining-services/"
          },
          "鐏忔垿鍣洪悽鐔烘暁": {
            "href": "/ja/titanium-additive-manufacturing/low-volume-production/"
          },
          "legacy-ja-titanium-forming-heavy-manufacturing-raw-material-preparation-sizing": {
            "href": "/ja/titanium-forming-heavy-manufacturing/raw-material-preparation-sizing/"
          },
          "legacy-ja-titanium-additive-manufacturing-3d-printing-slm-2": {
            "href": "/ja/titanium-additive-manufacturing/3d-printing-slm/"
          },
          "閵夘兙鍏楅妶韬插厳閸掑洦鏌囬敍鍫涘仭閵夌鍎撻敍鍡愬剨閵夈儯鍏楅妷鏍电礆": {
            "href": "/ja/titanium-fabrication-services/laser-cutting/"
          },
          "legacy-ja-titanium-fabrication-services-waterjet-cutting": {
            "href": "/ja/titanium-fabrication-services/waterjet-cutting/"
          },
          "legacy-ja-titanium-forming-heavy-manufacturing": {
            "href": "/ja/titanium-forming-heavy-manufacturing/"
          },
          "legacy-ja-titanium-cnc-machining-services-3-5-axis-cnc-machining": {
            "href": "/ja/titanium-cnc-machining-services/3-5-axis-cnc-machining/"
          },
          "Anodisation (Type II et Type III)": {
            "href": "/fr/titanium-surface-treatment/anodizing/"
          },
          "Extrusion du Titane": {
            "href": "/fr/titanium-forming-heavy-manufacturing/titanium-extrusion/"
          },
          "Fabrication Additive de Titane": {
            "href": "/fr/titanium-additive-manufacturing/"
          },
          "Forgeage du Titane": {
            "href": "/fr/titanium-forming-heavy-manufacturing/titanium-forging/"
          },
          "Formage du Titane et Fabrication Lourde": {
            "href": "/fr/titanium-forming-heavy-manufacturing/"
          },
          "D鑼卌oupe Laser (T涔坙e et Tube)": {
            "href": "/fr/titanium-fabrication-services/laser-cutting/"
          },
          "Usinage par 鑴ectro鑼卹osion au Fil": {
            "href": "/fr/titanium-cnc-machining-services/wire-edm-machining/"
          },
          "Services de Fabrication de T涔坙erie Titane": {
            "href": "/fr/titanium-fabrication-services/"
          },
          "Composants Industriels Personnalis鑼卻": {
            "href": "/fr/titanium-cnc-machining-services/custom-industrial-components/"
          },
          "Pr鑼卲aration et Dimensionnement des Mati鐚玶es Premi鐚玶es": {
            "href": "/fr/titanium-forming-heavy-manufacturing/raw-material-preparation-sizing/"
          },
          "D鑼卌oupe au Jet d'Eau": {
            "href": "/fr/titanium-fabrication-services/waterjet-cutting/"
          },
          "Fraisage et Tournage CNC": {
            "href": "/fr/titanium-cnc-machining-services/cnc-milling-turning/"
          },
          "Impression 3D SLM/DMLS": {
            "href": "/fr/titanium-additive-manufacturing/3d-printing-slm/"
          },
          "Impression 3D SLM": {
            "href": "/fr/titanium-additive-manufacturing/3d-printing-slm/"
          },
          "Passivation Chimique": {
            "href": "/fr/titanium-surface-treatment/chemical-passivation/"
          },
          "Polissage et Sablage": {
            "href": "/fr/titanium-surface-treatment/polishing-sandblasting/"
          },
          "Production en Faible Volume": {
            "href": "/fr/titanium-additive-manufacturing/low-volume-production/"
          },
          "Prototypage Rapide": {
            "href": "/fr/titanium-additive-manufacturing/rapid-prototyping/"
          },
          "Services Complets de Fabrication et de Traitement du Titane": {
            "href": "/fr/"
          },
          "Services d'Usinage CNC du Titane": {
            "href": "/fr/titanium-cnc-machining-services/"
          },
          "Soudage et Assemblage du Titane": {
            "href": "/fr/titanium-fabrication-services/titanium-welding-assembly/"
          },
          "Traitement de Surface du Titane": {
            "href": "/fr/titanium-surface-treatment/"
          },
          "Usinage CNC 3/5 Axes": {
            "href": "/fr/titanium-cnc-machining-services/3-5-axis-cnc-machining/"
          },
          "Usinage CNC 3": {
            "href": "/fr/titanium-cnc-machining-services/3-5-axis-cnc-machining/"
          },
          "Anodizado (Tipo II y Tipo III)": {
            "href": "/es/titanium-surface-treatment/anodizing/"
          },
          "Componentes Industriales Personalizados": {
            "href": "/es/titanium-cnc-machining-services/custom-industrial-components/"
          },
          "Corte por Chorro de Agua": {
            "href": "/es/titanium-fabrication-services/waterjet-cutting/"
          },
          "Impresi璐竛 3D SLM/DMLS": {
            "href": "/es/titanium-additive-manufacturing/3d-printing-slm/"
          },
          "Preparaci璐竛 y Dimensionamiento de Materias Primas": {
            "href": "/es/titanium-forming-heavy-manufacturing/raw-material-preparation-sizing/"
          },
          "Impresi璐竛 3D SLM": {
            "href": "/es/titanium-additive-manufacturing/3d-printing-slm/"
          },
          "Conformado de Titanio y Fabricaci璐竛 Pesada": {
            "href": "/es/titanium-forming-heavy-manufacturing/"
          },
          "Producci璐竛 de Bajo Volumen": {
            "href": "/es/titanium-additive-manufacturing/low-volume-production/"
          },
          "Prototipado R璋﹑ido": {
            "href": "/es/titanium-additive-manufacturing/rapid-prototyping/"
          },
          "Extrusi璐竛 de Titanio": {
            "href": "/es/titanium-forming-heavy-manufacturing/titanium-extrusion/"
          },
          "Mecanizado por Electroerosi璐竛 por Hilo": {
            "href": "/es/titanium-cnc-machining-services/wire-edm-machining/"
          },
          "Fabricaci璐竛 Aditiva de Titanio": {
            "href": "/es/titanium-additive-manufacturing/"
          },
          "Servicios de Fabricaci璐竛 de Titanio": {
            "href": "/es/titanium-fabrication-services/"
          },
          "Pasivaci璐竛 Qu閾唌ica": {
            "href": "/es/titanium-surface-treatment/chemical-passivation/"
          },
          "Servicios Integrales de Fabricaci璐竛 y Procesamiento de Titanio": {
            "href": "/es/"
          },
          "Corte L璋﹕er (Chapa y Tubo)": {
            "href": "/es/titanium-fabrication-services/laser-cutting/"
          },
          "Forja de Titanio": {
            "href": "/es/titanium-forming-heavy-manufacturing/titanium-forging/"
          },
          "Fresado y Torneado CNC": {
            "href": "/es/titanium-cnc-machining-services/cnc-milling-turning/"
          },
          "Mecanizado CNC de 3/5 Ejes": {
            "href": "/es/titanium-cnc-machining-services/3-5-axis-cnc-machining/"
          },
          "Mecanizado CNC de 3": {
            "href": "/es/titanium-cnc-machining-services/3-5-axis-cnc-machining/"
          },
          "Pulido y Chorreado de Arena": {
            "href": "/es/titanium-surface-treatment/polishing-sandblasting/"
          },
          "Servicios de Mecanizado CNC de Titanio": {
            "href": "/es/titanium-cnc-machining-services/"
          },
          "Soldadura y Ensamblaje de Titanio": {
            "href": "/es/titanium-fabrication-services/titanium-welding-assembly/"
          },
          "Tratamiento de Superficie de Titanio": {
            "href": "/es/titanium-surface-treatment/"
          },
          "Componentes Industriais Personalizados": {
            "href": "/pt/titanium-cnc-machining-services/custom-industrial-components/"
          },
          "Corte a Laser (Chapa e Tubo)": {
            "href": "/pt/titanium-fabrication-services/laser-cutting/"
          },
          "Fresamento e Torneamento CNC": {
            "href": "/pt/titanium-cnc-machining-services/cnc-milling-turning/"
          },
          "Polimento e Jateamento de Areia": {
            "href": "/pt/titanium-surface-treatment/polishing-sandblasting/"
          },
          "Impress鑼玱 3D SLM/DMLS": {
            "href": "/pt/titanium-additive-manufacturing/3d-printing-slm/"
          },
          "Prepara鑾借尗o e Dimensionamento de Mat鑼卹ia-Prima": {
            "href": "/pt/titanium-forming-heavy-manufacturing/raw-material-preparation-sizing/"
          },
          "Servi鑾給s de Usinagem CNC de Tit鑺抧io": {
            "href": "/pt/titanium-cnc-machining-services/"
          },
          "Usinagem por Eletroeros鑼玱 a Fio": {
            "href": "/pt/titanium-cnc-machining-services/wire-edm-machining/"
          },
          "Produ鑾借尗o de Baixo Volume": {
            "href": "/pt/titanium-additive-manufacturing/low-volume-production/"
          },
          "Passiva鑾借尗o Qu閾唌ica": {
            "href": "/pt/titanium-surface-treatment/chemical-passivation/"
          },
          "Soldagem e Montagem de Tit鑺抧io": {
            "href": "/pt/titanium-fabrication-services/titanium-welding-assembly/"
          },
          "Manufatura Aditiva de Tit鑺抧io": {
            "href": "/pt/titanium-additive-manufacturing/"
          },
          "Extrus鑼玱 de Tit鑺抧io": {
            "href": "/pt/titanium-forming-heavy-manufacturing/titanium-extrusion/"
          },
          "Forjamento de Tit鑺抧io": {
            "href": "/pt/titanium-forming-heavy-manufacturing/titanium-forging/"
          },
          "Tratamento de Superf閾哻ie de Tit鑺抧io": {
            "href": "/pt/titanium-surface-treatment/"
          },
          "Prototipagem R璋﹑ida": {
            "href": "/pt/titanium-additive-manufacturing/rapid-prototyping/"
          },
          "Anodiza鑾借尗o (Tipo II e Tipo III)": {
            "href": "/pt/titanium-surface-treatment/anodizing/"
          },
          "Corte a Jato de 鑴昰ua": {
            "href": "/pt/titanium-fabrication-services/waterjet-cutting/"
          },
          "Servi鑾給s Abrangentes de Fabrica鑾借尗o e Processamento de Tit鑺抧io": {
            "href": "/pt/"
          },
          "Servi鑾給s de Fabrica鑾借尗o de Tit鑺抧io": {
            "href": "/pt/titanium-fabrication-services/"
          },
          "Impress鑼玱 3D SLM": {
            "href": "/pt/titanium-additive-manufacturing/3d-printing-slm/"
          },
          "Conforma鑾借尗o de Tit鑺抧io e Fabrica鑾借尗o Pesada": {
            "href": "/pt/titanium-forming-heavy-manufacturing/"
          },
          "Usinagem CNC de 3/5 Eixos": {
            "href": "/pt/titanium-cnc-machining-services/3-5-axis-cnc-machining/"
          },
          "Usinagem CNC de 3": {
            "href": "/pt/titanium-cnc-machining-services/3-5-axis-cnc-machining/"
          },
          "Anodizzazione (Tipo II e Tipo III)": {
            "href": "/it/titanium-surface-treatment/anodizing/"
          },
          "Componenti Industriali Personalizzati": {
            "href": "/it/titanium-cnc-machining-services/custom-industrial-components/"
          },
          "Estrusione del Titanio": {
            "href": "/it/titanium-forming-heavy-manufacturing/titanium-extrusion/"
          },
          "Forgiatura del Titanio": {
            "href": "/it/titanium-forming-heavy-manufacturing/titanium-forging/"
          },
          "Formatura del Titanio e Produzione Pesante": {
            "href": "/it/titanium-forming-heavy-manufacturing/"
          },
          "Fresatura e Tornitura CNC": {
            "href": "/it/titanium-cnc-machining-services/cnc-milling-turning/"
          },
          "Lavorazione CNC a 3/5 Assi": {
            "href": "/it/titanium-cnc-machining-services/3-5-axis-cnc-machining/"
          },
          "Lavorazione CNC a 3": {
            "href": "/it/titanium-cnc-machining-services/3-5-axis-cnc-machining/"
          },
          "Lavorazione per Elettroerosione a Filo": {
            "href": "/it/titanium-cnc-machining-services/wire-edm-machining/"
          },
          "Lucidatura e Sabbiatura": {
            "href": "/it/titanium-surface-treatment/polishing-sandblasting/"
          },
          "Passivazione Chimica": {
            "href": "/it/titanium-surface-treatment/chemical-passivation/"
          },
          "Preparazione e Dimensionamento delle Materie Prime": {
            "href": "/it/titanium-forming-heavy-manufacturing/raw-material-preparation-sizing/"
          },
          "Produzione a Basso Volume": {
            "href": "/it/titanium-additive-manufacturing/low-volume-production/"
          },
          "Produzione Additiva di Titanio": {
            "href": "/it/titanium-additive-manufacturing/"
          },
          "Prototipazione Rapida": {
            "href": "/it/titanium-additive-manufacturing/rapid-prototyping/"
          },
          "Saldatura e Assemblaggio del Titanio": {
            "href": "/it/titanium-fabrication-services/titanium-welding-assembly/"
          },
          "Servizi Complete di Produzione e Lavorazione del Titanio": {
            "href": "/it/"
          },
          "Servizi di Fabbricazione del Titanio": {
            "href": "/it/titanium-fabrication-services/"
          },
          "Servizi di Lavorazione CNC del Titanio": {
            "href": "/it/titanium-cnc-machining-services/"
          },
          "Stampa 3D SLM/DMLS": {
            "href": "/it/titanium-additive-manufacturing/3d-printing-slm/"
          },
          "Stampa 3D SLM": {
            "href": "/it/titanium-additive-manufacturing/3d-printing-slm/"
          },
          "Taglio a Getto d'Acqua": {
            "href": "/it/titanium-fabrication-services/waterjet-cutting/"
          },
          "Taglio Laser (Lamiera e Tubo)": {
            "href": "/it/titanium-fabrication-services/laser-cutting/"
          },
          "Trattamento Superficiale del Titanio": {
            "href": "/it/titanium-surface-treatment/"
          },
          "legacy-ko-titanium-additive-manufacturing-low-volume-production": {
            "href": "/ko/titanium-additive-manufacturing/low-volume-production/"
          },
          "legacy-ko-titanium-fabrication-services-titanium-welding-assembly": {
            "href": "/ko/titanium-fabrication-services/titanium-welding-assembly/"
          },
          "legacy-ko-titanium-forming-heavy-manufacturing-titanium-forging": {
            "href": "/ko/titanium-forming-heavy-manufacturing/titanium-forging/"
          },
          "legacy-ko-titanium-forming-heavy-manufacturing-titanium-extrusion": {
            "href": "/ko/titanium-forming-heavy-manufacturing/titanium-extrusion/"
          },
          "legacy-ko-titanium-surface-treatment-anodizing": {
            "href": "/ko/titanium-surface-treatment/anodizing/"
          },
          "legacy-ko-titanium-additive-manufacturing-3d-printing-slm": {
            "href": "/ko/titanium-additive-manufacturing/3d-printing-slm/"
          },
          "legacy-ko-titanium-cnc-machining-services-wire-edm-machining": {
            "href": "/ko/titanium-cnc-machining-services/wire-edm-machining/"
          },
          "legacy-ko-titanium-surface-treatment": {
            "href": "/ko/titanium-surface-treatment/"
          },
          "legacy-ko-titanium-additive-manufacturing-rapid-prototyping": {
            "href": "/ko/titanium-additive-manufacturing/rapid-prototyping/"
          },
          "legacy-ko-titanium-forming-heavy-manufacturing-raw-material-preparation-sizing": {
            "href": "/ko/titanium-forming-heavy-manufacturing/raw-material-preparation-sizing/"
          },
          "legacy-ko-titanium-surface-treatment-polishing-sandblasting": {
            "href": "/ko/titanium-surface-treatment/polishing-sandblasting/"
          },
          "legacy-ko": {
            "href": "/ko/"
          },
          "legacy-ko-titanium-additive-manufacturing": {
            "href": "/ko/titanium-additive-manufacturing/"
          },
          "legacy-ko-titanium-fabrication-services": {
            "href": "/ko/titanium-fabrication-services/"
          },
          "legacy-ko-titanium-cnc-machining-services-custom-industrial-components": {
            "href": "/ko/titanium-cnc-machining-services/custom-industrial-components/"
          },
          "legacy-ko-titanium-cnc-machining-services": {
            "href": "/ko/titanium-cnc-machining-services/"
          },
          "legacy-ko-titanium-forming-heavy-manufacturing": {
            "href": "/ko/titanium-forming-heavy-manufacturing/"
          },
          "legacy-ko-titanium-fabrication-services-laser-cutting": {
            "href": "/ko/titanium-fabrication-services/laser-cutting/"
          },
          "legacy-ko-titanium-cnc-machining-services-3-5-axis-cnc-machining": {
            "href": "/ko/titanium-cnc-machining-services/3-5-axis-cnc-machining/"
          },
          "legacy-ko-titanium-cnc-machining-services-cnc-milling-turning": {
            "href": "/ko/titanium-cnc-machining-services/cnc-milling-turning/"
          },
          "legacy-ko-titanium-additive-manufacturing-3d-printing-slm-2": {
            "href": "/ko/titanium-additive-manufacturing/3d-printing-slm/"
          },
          "legacy-ko-titanium-surface-treatment-chemical-passivation": {
            "href": "/ko/titanium-surface-treatment/chemical-passivation/"
          },
          "legacy-ko-titanium-fabrication-services-waterjet-cutting": {
            "href": "/ko/titanium-fabrication-services/waterjet-cutting/"
          },
          "3/5-Assige CNC-bewerking": {
            "href": "/nl/titanium-cnc-machining-services/3-5-axis-cnc-machining/"
          },
          "3D-printen SLM/DMLS": {
            "href": "/nl/titanium-additive-manufacturing/3d-printing-slm/"
          },
          "3D-printen SLM": {
            "href": "/nl/titanium-additive-manufacturing/3d-printing-slm/"
          },
          "Additieve Productie van Titanium": {
            "href": "/nl/titanium-additive-manufacturing/"
          },
          "Anodiseren (Type II": {
            "href": "/nl/titanium-surface-treatment/anodizing/"
          },
          "Anodiseren (Type II & Type III)": {
            "href": "/nl/titanium-surface-treatment/anodizing/"
          },
          "Chemische Passivering": {
            "href": "/nl/titanium-surface-treatment/chemical-passivation/"
          },
          "CNC Frezen en Draaien": {
            "href": "/nl/titanium-cnc-machining-services/cnc-milling-turning/"
          },
          "Draadvonken (Wire EDM)": {
            "href": "/nl/titanium-cnc-machining-services/wire-edm-machining/"
          },
          "Grondstofvoorbereiding en -bepaling": {
            "href": "/nl/titanium-forming-heavy-manufacturing/raw-material-preparation-sizing/"
          },
          "Lasersnijden (Plaat & Buis)": {
            "href": "/nl/titanium-fabrication-services/laser-cutting/"
          },
          "Lasersnijden (Plaat": {
            "href": "/nl/titanium-fabrication-services/laser-cutting/"
          },
          "Op maat gemaakte industri姣沴e componenten": {
            "href": "/nl/titanium-cnc-machining-services/custom-industrial-components/"
          },
          "Oppervlaktebehandeling van Titanium": {
            "href": "/nl/titanium-surface-treatment/"
          },
          "Polijsten en Zandstralen": {
            "href": "/nl/titanium-surface-treatment/polishing-sandblasting/"
          },
          "Productie in kleine oplage": {
            "href": "/nl/titanium-additive-manufacturing/low-volume-production/"
          },
          "Titanium CNC-bewerkingsdiensten": {
            "href": "/nl/titanium-cnc-machining-services/"
          },
          "Titanium Extrusie": {
            "href": "/nl/titanium-forming-heavy-manufacturing/titanium-extrusion/"
          },
          "Titanium Fabricagediensten": {
            "href": "/nl/titanium-fabrication-services/"
          },
          "Titanium Smeden": {
            "href": "/nl/titanium-forming-heavy-manufacturing/titanium-forging/"
          },
          "Titanium Vormen en Zware Productie": {
            "href": "/nl/titanium-forming-heavy-manufacturing/"
          },
          "Titaniumlassen en Assemblage": {
            "href": "/nl/titanium-fabrication-services/titanium-welding-assembly/"
          },
          "Uitgebreide Titanium Productie- en Verwerkingsdiensten": {
            "href": "/nl/"
          },
          "Waterjetsnijden": {
            "href": "/nl/titanium-fabrication-services/waterjet-cutting/"
          },
          "Anodowanie (Typ II i Typ III)": {
            "href": "/pl/titanium-surface-treatment/anodizing/"
          },
          "Druk 3D SLM/DMLS": {
            "href": "/pl/titanium-additive-manufacturing/3d-printing-slm/"
          },
          "Druk 3D SLM": {
            "href": "/pl/titanium-additive-manufacturing/3d-printing-slm/"
          },
          "Frezowanie i Toczenie CNC": {
            "href": "/pl/titanium-cnc-machining-services/cnc-milling-turning/"
          },
          "Kucie Tytanu": {
            "href": "/pl/titanium-forming-heavy-manufacturing/titanium-forging/"
          },
          "Pasywacja Chemiczna": {
            "href": "/pl/titanium-surface-treatment/chemical-passivation/"
          },
          "Us鑹倁gi Obr璐竍ki CNC Tytanu": {
            "href": "/pl/titanium-cnc-machining-services/"
          },
          "Ci鑷媍ie Laserowe (Blacha i Rura)": {
            "href": "/pl/titanium-fabrication-services/laser-cutting/"
          },
          "Obr璐竍ka Powierzchniowa Tytanu": {
            "href": "/pl/titanium-surface-treatment/"
          },
          "Obr璐竍ka Elektroerozyjna Drutowa (EDM)": {
            "href": "/pl/titanium-cnc-machining-services/wire-edm-machining/"
          },
          "Niestandardowe Komponenty Przemys鑹俹we": {
            "href": "/pl/titanium-cnc-machining-services/custom-industrial-components/"
          },
          "legacy-pl-titanium-fabrication-services-titanium-welding-assembly": {
            "href": "/pl/titanium-fabrication-services/titanium-welding-assembly/"
          },
          "Produkcja Niskonak鑹俛dowa": {
            "href": "/pl/titanium-additive-manufacturing/low-volume-production/"
          },
          "Us鑹倁gi Obr璐竍ki Plastycznej Tytanu": {
            "href": "/pl/titanium-fabrication-services/"
          },
          "Obr璐竍ka CNC 3": {
            "href": "/pl/titanium-cnc-machining-services/3-5-axis-cnc-machining/"
          },
          "Formowanie Tytanu i Produkcja Ci鑷嬪伓ka": {
            "href": "/pl/titanium-forming-heavy-manufacturing/"
          },
          "Obr璐竍ka CNC 3/5-osiowa": {
            "href": "/pl/titanium-cnc-machining-services/3-5-axis-cnc-machining/"
          },
          "Ci鑷媍ie Wodne": {
            "href": "/pl/titanium-fabrication-services/waterjet-cutting/"
          },
          "Kompleksowe Us鑹倁gi Produkcji i Obr璐竍ki Tytanu": {
            "href": "/pl/"
          },
          "Polerowanie i Piaskowanie": {
            "href": "/pl/titanium-surface-treatment/polishing-sandblasting/"
          },
          "Przygotowanie i Wymiarowanie Surowca": {
            "href": "/pl/titanium-forming-heavy-manufacturing/raw-material-preparation-sizing/"
          },
          "Szybkie Prototypowanie": {
            "href": "/pl/titanium-additive-manufacturing/rapid-prototyping/"
          },
          "Wyciskanie Tytanu": {
            "href": "/pl/titanium-forming-heavy-manufacturing/titanium-extrusion/"
          },
          "Wytwarzanie Addytywne Tytanu": {
            "href": "/pl/titanium-additive-manufacturing/"
          }
      }
      }]
    ]
  },
  vite: {
    plugins: [tailwindcss(), devDashboardApi()],
    // P2-7: Exclude vitest + @testing-library/* from Vite dep optimizer so dev server can start when these packages are not installed.
    optimizeDeps: {
      exclude: [
        'vitest',
        '@testing-library/react',
        '@testing-library/user-event',
        '@testing-library/dom',
        'jsdom',
      ],
    },
    build: {
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('node_modules/react-remove-scroll') ||
                id.includes('node_modules/@radix-ui/react-dialog') ||
                id.includes('node_modules/react-style-singleton') ||
                id.includes('node_modules/use-callback-ref') ||
                id.includes('node_modules/use-sidecar') ||
                id.includes('node_modules/@radix-ui/react-dismissable-layer') ||
                id.includes('node_modules/@radix-ui/react-focus-scope') ||
                id.includes('node_modules/@radix-ui/react-focus-guards') ||
                id.includes('node_modules/@radix-ui/react-presence') ||
                id.includes('node_modules/@radix-ui/react-primitive') ||
                id.includes('node_modules/@radix-ui/react-portal') ||
                id.includes('node_modules/@radix-ui/react-use-escape-keydown') ||
                id.includes('node_modules/@radix-ui/react-use-callback-ref') ||
                id.includes('node_modules/@radix-ui/react-use-controllable-state') ||
                id.includes('node_modules/@radix-ui/react-use-layout-effect') ||
                id.includes('node_modules/@radix-ui/react-compose-refs') ||
                id.includes('node_modules/@radix-ui/react-context') ||
                id.includes('node_modules/@radix-ui/react-slot') ||
                id.includes('node_modules/detect-node-es') ||
                id.includes('node_modules/tslib')) {
              return 'vendor-dialog';
            }
            if (id.includes('node_modules/motion') ||
                id.includes('node_modules/framer-motion') ||
                id.includes('node_modules/motion-dom') ||
                id.includes('node_modules/motion-utils')) {
              return 'vendor-motion';
            }
            if (id.includes('node_modules/lucide-react')) {
              return 'vendor-icons';
            }
            if (id.includes('node_modules/react-dom') ||
                id.includes('node_modules/scheduler')) {
              return 'vendor-react';
            }
          }
        }
      }
    }
  }
});
