// Lodestar — app entry. Mounts Vue, registers the router.
import { createApp } from 'vue'
import App    from './App.vue'
import router from './router'

createApp(App).use(router).mount('#app')
