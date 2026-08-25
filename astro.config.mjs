// @ts-check
import { defineConfig } from 'astro/config';

// Custom domain (see public/CNAME) — served from the root, not a GitHub
// Pages project subpath, so base stays "/".
export default defineConfig({
  base: '/',
  trailingSlash: 'always',
  site: 'https://ocdtattoo.com',
});
