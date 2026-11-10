// @ts-check
import { defineConfig } from 'astro/config';

export default defineConfig({
  // Replace with the real domain once registered
  site: 'https://prevenzioneesalute.it',
  i18n: {
    locales: ['it', 'en'],
    defaultLocale: 'it',
    routing: { prefixDefaultLocale: false }, // IT at /, EN at /en/
  },
});
