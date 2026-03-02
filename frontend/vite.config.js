/**
 * @file vite.config.js
 * @description Konfigurasi Vite untuk aplikasi frontend Dashboard EMP.
 * Mengaktifkan plugin React dan Tailwind CSS, serta mengatur
 * manual chunks untuk optimasi ukuran bundle produksi.
 *
 * Manual chunks:
 * - vendor → react, react-dom, react-router-dom
 * - chart  → recharts
 * - icons  → lucide-react
 */

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          chart: ['recharts'],
          icons: ['lucide-react']
        }
      }
    }
  }
})
