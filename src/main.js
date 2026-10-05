// Lodestar — app entry. Mounts Vue, registers the router.
// The theme named in config/site.js (resolved by scripts/vite-plugin-theme.mjs).
// Imported before App so App's overrides.css + base.css layer on top of it.
import 'virtual:lodestar-theme.css'
import { createApp } from 'vue'
import App    from './App.vue'
import router from './router'

createApp(App).use(router).mount('#app')
