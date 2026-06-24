// ============================================================
// router/index.js — builds routes from site.config.pages.
// Each page declares a `view`:
//   'home'     → HomeView (renders site.homeSections)
//   'page'     → PageView (prose: eyebrow/title/body/cta)
//   'contact'  → ContactView (the contact form)
//   'sections' → ModuleView (an ordered list of modules, e.g. a menu page)
// History mode needs the .htaccess (Apache) or Nginx try_files
// rule from /deploy when you go live.
// ============================================================
import { createRouter, createWebHistory } from 'vue-router'
import { site } from '@/site.config.js'

import HomeView    from '@/views/HomeView.vue'
import ContactView from '@/views/ContactView.vue'
import PageView    from '@/views/PageView.vue'
import ModuleView  from '@/views/ModuleView.vue'

const viewMap = { home: HomeView, contact: ContactView, page: PageView, sections: ModuleView }

function propsFor(page) {
  if (page.view === 'page')     return { content: page.content }   // prose page
  if (page.view === 'sections') return { sections: page.sections } // module page
  return false
}

const routes = site.pages.map(page => ({
  path: '/' + page.slug,
  name: page.slug || 'home',
  component: viewMap[page.view] || PageView,
  props: propsFor(page),
}))

// Catch-all → home
routes.push({ path: '/:pathMatch(.*)*', redirect: '/' })

export default createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior() { return { top: 0 } },
})
