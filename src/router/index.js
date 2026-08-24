// ============================================================
// router/index.js — builds routes from site.config.pages.
// Each page declares a `view`:
//   'home'       → HomeView (renders site.homeSections)
//   'page'       → PageView (prose: eyebrow/title/body/cta)
//   'contact'    → ContactView (the contact form)
//   'sections'   → ModuleView (an ordered list of modules, e.g. a menu page)
//   'collection' → CollectionView (index, e.g. /shop) +
//                  CollectionItemView (one item, e.g. /shop/:itemSlug) —
//                  two routes from one page entry. See config/pages/
//                  for the shape (indexSections/itemSections/items).
// History mode needs the .htaccess (Apache) or Nginx try_files
// rule from /deploy when you go live.
// Also applies each page's title/meta/OG tags on navigation — see
// composables/useSeo.js and the `seo` field on each page (and each
// collection item) in site.config.js.
// ============================================================
import { createRouter, createWebHistory } from 'vue-router'
import { site } from '@/site.config.js'
import { applySeo } from '@/composables/useSeo.js'

import HomeView           from '@/views/HomeView.vue'
import ContactView        from '@/views/ContactView.vue'
import PageView           from '@/views/PageView.vue'
import ModuleView         from '@/views/ModuleView.vue'
import CollectionView     from '@/views/CollectionView.vue'
import CollectionItemView from '@/views/CollectionItemView.vue'

const viewMap = { home: HomeView, contact: ContactView, page: PageView, sections: ModuleView }

function propsFor(page) {
  if (page.view === 'page')     return { content: page.content }   // prose page
  if (page.view === 'sections') return { sections: page.sections } // module page
  return false
}

const routes = []
for (const page of site.pages) {
  const name = page.slug || 'home'
  if (page.view === 'collection') {
    routes.push({ path: '/' + page.slug, name, component: CollectionView, props: { page } })
    routes.push({
      path: '/' + page.slug + '/:itemSlug',
      name: name + '-item',
      component: CollectionItemView,
      props: route => ({ page, itemSlug: route.params.itemSlug }),
    })
  } else {
    routes.push({ path: '/' + page.slug, name, component: viewMap[page.view] || PageView, props: propsFor(page) })
  }
}

// Catch-all → home
routes.push({ path: '/:pathMatch(.*)*', redirect: '/' })

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior() { return { top: 0 } },
})

// Keep <title>, meta description, and OG/Twitter tags in sync with
// the page navigated to — see composables/useSeo.js.
router.afterEach(to => {
  const routeName = String(to.name || '')
  if (routeName.endsWith('-item')) {
    const collection = site.pages.find(p => (p.slug || 'home') === routeName.slice(0, -5) && p.view === 'collection')
    const item = collection?.items?.find(i => i.slug === to.params.itemSlug)
    if (collection && item) {
      applySeo({
        slug: `${collection.slug}/${item.slug}`,
        name: item.name,
        seo: item.seo || { description: item.description },
      })
      return
    }
  }
  applySeo(site.pages.find(p => (p.slug || 'home') === to.name))
})

export default router
