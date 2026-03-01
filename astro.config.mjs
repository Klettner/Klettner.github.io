// @ts-check
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  // REPLACE with your GitHub Pages URL
  site: 'https://Klettner.github.io',
  // REPLACE with your repository name (e.g., '/my-portfolio')
  // If you are using a custom domain or a user/org site (username.github.io), 
  // you can remove or set base to '/'
  base: '/',
  trailingSlash: 'always',
  build: {
    format: 'directory',
  },
});
