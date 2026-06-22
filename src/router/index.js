// ============================================================
// router/index.js — builds routes from site.config.pages.
// Each page declares a `view`: 'home' | 'contact' | 'page'.
// History mode needs the .htaccess (Apache) or Nginx try_files
// rule from /deploy when you go live.
// ============================================================
import { createRouter, createWebHistory } from 'vue-router'
import { site } from '@/site.config.js'

import HomeView    from '@/views/HomeView.vue'
import ContactView from '@/views/ContactView.vue'
import PageView    from '@/views/PageView.vue'

const viewMap = { home: HomeView, contact: ContactView, page: PageView }

const routes = site.pages.map(page => ({
  path: '/' + page.slug,
  name: page.slug || 'home',
  component: viewMap[page.view] || PageView,
  // PageView reads its content from this prop
  props: page.view === 'page' ? { content: page.content } : false,
}))

// Catch-all → home
routes.push({ path: '/:pathMatch(.*)*', redirect: '/' })

export default createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior() { return { top: 0 } },
})
