import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    proxy: {
      // The todo API in server/ (started alongside Vite by `npm run dev`). Use
      // 127.0.0.1 rather than localhost: the API only listens on IPv4 loopback,
      // and localhost can resolve to ::1.
      '/api': `http://127.0.0.1:${process.env.PORT ?? 3001}`,
    },
  },
})
