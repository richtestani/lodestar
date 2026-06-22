import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import svgLoader from 'vite-svg-loader'
import { fileURLToPath, URL } from 'node:url'

// outDir 'public' matches the Forge/Bluehost deploy convention.
// Change to 'dist' if you prefer the Vite default.
export default defineConfig({
  plugins: [vue(), svgLoader()],
  resolve: {
    alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
  },
  build: { outDir: 'public', emptyOutDir: true },
})
