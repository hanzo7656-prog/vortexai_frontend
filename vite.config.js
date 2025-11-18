import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    open: true
  },
  // تنظیمات مخصوص GitHub Pages
  base: '/vortexai-frontend/',
  build: {
    outDir: 'dist',
    sourcemap: false
  }
})
