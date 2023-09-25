import { svelte } from "@sveltejs/vite-plugin-svelte";
import autoprefixer from "autoprefixer";
import { defineConfig } from "vite";
import { ViteMinifyPlugin } from "vite-plugin-minify";
import { viteSingleFile } from "vite-plugin-singlefile";
import paths from "vite-tsconfig-paths";

export default defineConfig({
  root: './src',
  publicDir: '../public',
  base: './',
  server: {
    host: '0.0.0.0',
    port: 3000
  },
  build: {
    target: 'esnext',
    outDir: '../dist',
    minify: true,
  },
  plugins: [
    svelte({ configFile: '../svelte.config.js' }),
    paths({ projects: ['../tsconfig.json'] }),
    viteSingleFile(),
    ViteMinifyPlugin()
  ],
  css: {
    postcss: {
      plugins: [
        autoprefixer({})
      ]
    }
  }
});
