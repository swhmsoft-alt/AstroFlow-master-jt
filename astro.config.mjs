// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';
import normalizeTrailingSlash from '@reunmedia/astro-normalize-trailing-slash';
import compress from 'astro-compress';
import { rehypeAutoInternalLinksI18n } from './src/lib/rehype-auto-internal-links-i18n';

// https://astro.build
export default defineConfig({
  site: 'https://cnc.bozemetal.com',
  output: 'static',
  trailingSlash: 'always',
  integrations: [
    react(),
    normalizeTrailingSlash(),
    sitemap({
      filter: (page) => !page.includes('/theme-demo') && !page.includes('/admin'),
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
    // Post-build compression of HTML/CSS/JS/SVG
    compress({
      CSS: { engine: 'csso' },
      HTML: {
        'html-minifier-terser': {
          removeComments: true,
          collapseWhitespace: true,
          collapseBooleanAttributes: true,
          removeAttributeQuotes: false,
          removeEmptyAttributes: true,
          minifyJS: false, // JS already minified via Vite
          minifyCSS: false, // CSS already minified via Vite
        },
      },
      JavaScript: { engine: 'terser' },
      SVG: { engine: 'svgo' },
      Image: false, // Image handled separately by postbuild-images.mjs
    }),
  ],
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'de', 'ja', 'fr', 'es', 'pt', 'it', 'ko', 'nl', 'pl', 'ru', 'ar'],
    routing: {
      prefixDefaultLocale: false,
    },
  },
  markdown: {
    rehypePlugins: [
      [rehypeAutoInternalLinksI18n, {
        keywordMap: {
          "Comprehensive Titanium Manufacturing & Processing Services": {
            "href": "/"
          },
          "Comprehensive Titanium Manufacturing": {
            "href": "/"
          },
          "Titanium CNC Machining Services": {
            "href": "/titanium-cnc-machining-services/"
          },
          "3/5-Axis CNC Machining": {
            "href": "/titanium-cnc-machining-services/3-5-axis-cnc-machining/"
          },
          "5-Axis CNC Machining": {
            "href": "/titanium-cnc-machining-services/3-5-axis-cnc-machining/"
          },
          "CNC Milling & Turning": {
            "href": "/titanium-cnc-machining-services/cnc-milling-turning/"
          },
          "CNC Milling": {
            "href": "/titanium-cnc-machining-services/cnc-milling-turning/"
          },
          "Wire EDM Machining": {
            "href": "/titanium-cnc-machining-services/wire-edm-machining/"
          },
          "Wire EDM": {
            "href": "/titanium-cnc-machining-services/wire-edm-machining/"
          },
          "Custom Industrial Components": {
            "href": "/titanium-cnc-machining-services/custom-industrial-components/"
          },
          "Titanium Additive Manufacturing": {
            "href": "/titanium-additive-manufacturing/"
          },
          "3D Printing SLM/DMLS": {
            "href": "/titanium-additive-manufacturing/3d-printing-slm/"
          },
          "3D Printing SLM": {
            "href": "/titanium-additive-manufacturing/3d-printing-slm/"
          },
          "SLM": {
            "href": "/titanium-additive-manufacturing/3d-printing-slm/"
          },
          "Rapid Prototyping": {
            "href": "/nl/titanium-additive-manufacturing/rapid-prototyping/"
          },
          "Low-Volume Production": {
            "href": "/titanium-additive-manufacturing/low-volume-production/"
          },
          "Titanium Fabrication Services": {
            "href": "/titanium-fabrication-services/"
          },
          "Laser Cutting (Sheet & Tube)": {
            "href": "/titanium-fabrication-services/laser-cutting/"
          },
          "Laser Cutting (Sheet": {
            "href": "/titanium-fabrication-services/laser-cutting/"
          },
          "Waterjet Cutting": {
            "href": "/titanium-fabrication-services/waterjet-cutting/"
          },
          "Titanium Welding & Assembly": {
            "href": "/titanium-fabrication-services/titanium-welding-assembly/"
          },
          "Titanium Welding": {
            "href": "/titanium-fabrication-services/titanium-welding-assembly/"
          },
          "Titanium Forming & Heavy Manufacturing": {
            "href": "/titanium-forming-heavy-manufacturing/"
          },
          "Titanium Forming": {
            "href": "/titanium-forming-heavy-manufacturing/"
          },
          "Titanium Forging": {
            "href": "/titanium-forming-heavy-manufacturing/titanium-forging/"
          },
          "Titanium Extrusion": {
            "href": "/titanium-forming-heavy-manufacturing/titanium-extrusion/"
          },
          "Raw Material Preparation & Sizing": {
            "href": "/titanium-forming-heavy-manufacturing/raw-material-preparation-sizing/"
          },
          "Raw Material Preparation": {
            "href": "/titanium-forming-heavy-manufacturing/raw-material-preparation-sizing/"
          },
          "Titanium Surface Treatment": {
            "href": "/titanium-surface-treatment/"
          },
          "Anodizing": {
            "href": "/titanium-surface-treatment/anodizing/"
          },
          "Anodizing (Type II": {
            "href": "/titanium-surface-treatment/anodizing/"
          },
          "Chemical Passivation": {
            "href": "/titanium-surface-treatment/chemical-passivation/"
          },
          "Polishing & Sandblasting": {
            "href": "/titanium-surface-treatment/polishing-sandblasting/"
          }
      }
      }]
    ]
  },
  vite: {
    plugins: [tailwindcss()],
    build: {
      rollupOptions: {
        output: {
          // Split heavy dialog/scroll-lock dependencies into separate vendor chunk
          // to prevent 10.8 MB MobileMenu.js bundle
          manualChunks(id) {
            // Radix UI dialog and its heavy transitive dependencies
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
            // Split motion (framer-motion successor) - used by ImageReveal
            if (id.includes('node_modules/motion') ||
                id.includes('node_modules/framer-motion') ||
                id.includes('node_modules/motion-dom') ||
                id.includes('node_modules/motion-utils')) {
              return 'vendor-motion';
            }
            // Split lucide-react icons
            if (id.includes('node_modules/lucide-react')) {
              return 'vendor-icons';
            }
            // Split React itself into a stable vendor chunk
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
