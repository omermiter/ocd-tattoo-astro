// @ts-check
import { defineConfig } from 'astro/config';

// GitHub Pages project-site base path. Update BASE_PATH once the repo is
// created if the repo name differs from "ocd-tattoo" (see README.md).
const BASE_PATH = '/ocd-tattoo';

export default defineConfig({
  base: BASE_PATH,
  trailingSlash: 'always',
  i18n: {
    locales: ['he', 'en'],
    defaultLocale: 'he',
    routing: {
      prefixDefaultLocale: false,
    },
  },
});
