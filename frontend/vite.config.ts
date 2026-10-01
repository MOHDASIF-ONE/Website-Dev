import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
  },
  server: {
    host: '0.0.0.0',
    port: 5000,
    strictPort: true,
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:8080',
        changeOrigin: true,
      },
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks(id) {
          const path = id.replaceAll('\\', '/')
          if (/node_modules\/(react|react-dom|scheduler|react-router|@remix-run)\//.test(path)) return 'react-core'
          if (path.includes('node_modules/@tanstack/')) return 'data-client'
          if (path.includes('node_modules/zod/')) return 'validation'
          if (path.includes('node_modules/motion/')) return 'motion'
          if (path.includes('node_modules/lucide-react/')) return 'icons'
        },
      },
    },
  },
})
