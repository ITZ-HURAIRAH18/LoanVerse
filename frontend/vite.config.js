// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  base: '', // ✅ Leave empty to avoid double `/assets/assets/`
  plugins: [react(), tailwindcss()],
  build: {
    outDir: '../app/dist',    // ✅ Your Django app's static folder
    emptyOutDir: true,
    assetsDir: 'assets',      // ✅ Keep assets in /assets folder inside dist
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        secure: false,
      }
    }
  }
})