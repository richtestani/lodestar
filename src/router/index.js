// ============================================================
// router/index.js — builds routes from site.config.pages.
// Each page declares a `view`:
//   'home'    → HomeView (renders site.homeSections)
//   'page'    → PageView (prose: eyebrow/title/body/cta)
//   'contact' → ContactView (the contact form)
//   'rows'    → RowsPageView (an ordered list of rows, each row with
//               1-3 columns of modules — replaces the old 'sections'
//               view / ModuleView.vue)
//   'collection' → CollectionView (index, e.g. /shop) +
//                  CollectionItemView (one item, e.g. /shop/:itemSlug) —
//                  two routes from one page entry. See config/pages/
//                  for the shape (indexSections/itemSections/items).
// Docs (/docs/*) are generated separately from src/docs/registry.js,
// not from site.pages — see docRoutes below.
// History mode needs the .htaccess (Apache) or Nginx try_files
// rule from /deploy when you go live.
// Also applies each page's title/meta/OG tags on navigation — see
// composables/useSeo.js and the `seo` field on each page (and each
// collection item) in site.config.js.
// ============================================================
import { createRouter, createWebHistory } from 'vue-router'
import { site } from '@/site.config.js'
import { applySeo, applyNotFoundSeo } from '@/composables/useSeo.js'
import HomeView           from '@/views/HomeView.vue'
import ContactView        from '@/views/ContactView.vue'
import PageView           from '@/views/PageView.vue'
import RowsPageView       from '@/views/RowsPageView.vue'
import CollectionView     from '@/views/CollectionView.vue'
import CollectionItemView from '@/views/CollectionItemView.vue'
import NotFoundView       from '@/views/NotFoundView.vue'
import { docsRegistry } from '@/docs/registry'
import DocLayout from '@/layouts/DocLayout.vue'

const viewMap = { home: HomeView, contact: ContactView, page: PageView, rows: RowsPageView }

function propsFor(page) {
  if (page.view === 'page') return { content: page.content } // prose page
  if (page.view === 'rows') return { rows: page.rows }        // row/column page
  return false
}

const docRoutes = docsRegistry.map((doc) => ({
  path: doc.path,
  name: `doc-${doc.slug}`,
  component: doc.component,
  meta: { title: doc.title },
}))

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

// docs section — one route per markdown file in src/content/docs/.
// Only registered when there's at least one doc, so a site without docs
// has no /docs at all (it falls through to the catch-all below).
if (docsRegistry.length) {
  routes.push({
    path: '/docs',
    component: DocLayout,
    redirect: docsRegistry[0].path,
    children: docRoutes,
  })
}

// Catch-all → Not Found page (must stay last, after all real routes).
// The build also saves it as public/404.html; see scripts/prerender.mjs.
routes.push({ path: '/:pathMatch(.*)*', name: 'not-found', component: NotFoundView })

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior() { return { top: 0 } },
})

// Dev-only hint: a nav link or page that lands on Not Found is usually a
// slug mismatch in config/, not a missing page.
router.beforeEach((to) => {
  if (import.meta.env.DEV && to.name === 'not-found') {
    console.warn(`[router] No page matches "${to.fullPath}", showing Not Found. If it should exist, check the slugs in src/config/.`)
  }
})

// Keep <title>, meta description, and OG/Twitter tags in sync with
// the page navigated to — see composables/useSeo.js.
router.afterEach(to => {
  if (to.name === 'not-found') {
    applyNotFoundSeo()
    return
  }
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
