// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

// https://astro.build
export default defineConfig({
  site: 'https://cnc.bozemetal.com',
  output: 'static',
  integrations: [
    react(),
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
        },
      },
    }),
  ],
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'de', 'ja', 'fr', 'es', 'pt', 'it', 'ko', 'nl', 'pl'],
    routing: {
      prefixDefaultLocale: false,
    },
  },
  vite: {
    plugins: [tailwindcss()]
  }
});

