import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import svgLoader from 'vite-svg-loader'
import { fileURLToPath, URL } from 'node:url'

import Markdown from 'unplugin-vue-markdown/vite'
import anchor from 'markdown-it-anchor'

// outDir 'public' matches the Forge/Bluehost deploy convention.
// Change to 'dist' if you prefer the Vite default.
export default defineConfig({
  plugins: [
	  vue({ include: [/\.vue$/, /\.md$/] }), 
      Markdown({
        // wraps compiled markdown output in a class for typography styling
        wrapperClasses: 'prose',
        markdownItSetup(md) {
          md.use(anchor, {
            // controls exactly how "Browser Support" -> "browser-support"
            slugify: (s) =>
              s.toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-'),
            level: [2, 3], // only h2/h3 get anchors — matches ScrollSpyNav's query
          })
        },
      }),
	  svgLoader()
  ],
  resolve: {
    alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
  },
  build: { outDir: 'public', emptyOutDir: true },
})
