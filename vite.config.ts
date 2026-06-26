import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import vueRouter from 'vue-router/vite'
import vueLayouts from 'vite-plugin-vue-layouts'
import autoImport from 'unplugin-auto-import/vite'
import vueComponents from 'unplugin-vue-components/vite'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  base: '/animore/',
  plugins: [
    vue(),
    vueDevTools(),
    vueRouter(),
    vueLayouts(),
    autoImport({
      imports: ['vue', 'vue-router', 'pinia'],
      dirs: ['src/composables'],
    }),
    vueComponents({
      dirs: ['src/components'],
    }),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})
