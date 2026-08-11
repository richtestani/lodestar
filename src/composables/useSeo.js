// ============================================================
// composables/useSeo.js — sets <title>, <meta description>, Open
// Graph, and Twitter Card tags for the active route, plus a
// canonical <link>. Wired up once in router/index.js (afterEach).
//
// Why this matters beyond a browser tab title: link-unfurling bots
// (Slack, iMessage, Discord, X, Facebook) read these tags straight
// out of the raw HTML — they generally do NOT run JavaScript. The
// build's prerender step (scripts/prerender.mjs) captures the DOM
// *after* this runs, so the tags land in the static HTML each of
// those bots actually fetches, not just in the live browser.
// ============================================================
import { site } from '@/site.config.js'

const SITE_URL = (import.meta.env.VITE_SITE_URL || '').replace(/\/+$/, '')

function upsertMeta(attr, key, content) {
  if (!content) return
  let el = document.head.querySelector(`meta[${attr}="${key}"]`)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, key)
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
}

function upsertLink(rel, href) {
  if (!href) return
  let el = document.head.querySelector(`link[rel="${rel}"]`)
  if (!el) {
    el = document.createElement('link')
    el.setAttribute('rel', rel)
    document.head.appendChild(el)
  }
  el.setAttribute('href', href)
}

export function applySeo(page) {
  if (!page) return
  const seo = site.seo || {}
  const title = page.seo?.title || `${page.name}${seo.titleSuffix || ''}`
  const description = page.seo?.description || seo.defaultDescription || site.brand?.tagline || ''
  const path = page.slug ? `/${page.slug}` : '/'
  const url = SITE_URL ? SITE_URL + path : ''

  document.title = title
  upsertMeta('name', 'description', description)
  upsertMeta('property', 'og:site_name', site.brand?.name || '')
  upsertMeta('property', 'og:title', title)
  upsertMeta('property', 'og:description', description)
  upsertMeta('property', 'og:type', 'website')
  upsertMeta('name', 'twitter:card', 'summary_large_image')
  upsertMeta('name', 'twitter:title', title)
  upsertMeta('name', 'twitter:description', description)
  if (url) {
    upsertMeta('property', 'og:url', url)
    upsertLink('canonical', url)
  }
}
