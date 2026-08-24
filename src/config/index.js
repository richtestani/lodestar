// ============================================================
// config/index.js — assembles the final `site` object from every
// file in this folder. src/site.config.js re-exports what's built
// here, so it stays the one stable import path everything else in
// the app (and lodestar-pro-modules) already uses — nothing else
// needs to know this folder exists.
//
// IMPORTANT — no import.meta.glob in this file or anything it
// imports: unlike modules/registry.js or App.vue (which only ever
// load through Vite), this exact file is also loaded by plain Node in
// scripts/prerender.mjs (`await import(pathToFileURL(...))`) to
// validate the config and expand routes at build time — import.meta.glob
// only exists inside Vite's transform, so using it here would crash
// `npm run build` outright, not just misbehave. Adding a page or a
// module default is a two-line change (an import + an entry below) for
// this reason — that's deliberate, not an oversight.
//
// Home is assembled separately (see home.js for why); every other page
// gets one file in pages/ and one line each below.
// ============================================================
import { brand, theme, contact, social, seo } from './site.js'
import { nav } from './nav.js'
import { footer } from './footer.js'
import { homePage, homeSections } from './home.js'

import { page as aboutPage }   from './pages/about.js'
import { page as contactPage } from './pages/contact.js'
import { page as shopPage }    from './pages/shop.js'

// Sitewide module defaults (optional) — add an import + an entry here
// only for a module that actually needs one. See modules/README.md.
// import gallery from './modules/gallery.js'
export const moduleDefaults = {
  // gallery,
}

export const site = {
  brand, theme, contact, social, seo, nav, footer,
  pages: [homePage, aboutPage, shopPage, contactPage],
  homeSections,
}
