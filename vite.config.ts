import { svelte } from "@sveltejs/vite-plugin-svelte";
import autoprefixer from "autoprefixer";
import { defineConfig } from "vite";
import paths from "vite-tsconfig-paths";

export default defineConfig({
  root: './src',
  publicDir: '../public',
  server: {
    host: '0.0.0.0',
    port: 3000
  },
  build: {
    target: 'esnext',
    outDir: '../dist',
    assetsInlineLimit: 3000
  },
  plugins: [
    svelte({ configFile: '../svelte.config.js' }),
    paths({ projects: ['../tsconfig.json'] })
  ],
  css: {
    postcss: {
      plugins: [
        autoprefixer({})
      ]
    }
  }
});
