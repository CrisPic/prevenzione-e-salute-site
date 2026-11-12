// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { site as info } from './src/data/site.js';

export default defineConfig({
  // Replace with the real domain once registered
  site: 'https://prevenzioneesalute.it',
  // Every page lives at /page/: links without the slash cost a redirect
  trailingSlash: 'always',
  i18n: {
    locales: ['it', 'en'],
    defaultLocale: 'it',
    routing: { prefixDefaultLocale: false }, // IT at /, EN at /en/
  },
  integrations: [
    sitemap({
      // Leave out the EN placeholder until the English pages exist
      filter: (page) => info.showEnglish || !page.includes('/en/'),
    }),
  ],
});
