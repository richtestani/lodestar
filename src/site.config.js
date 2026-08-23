// ============================================================
// site.config.js — stable import path. Every component, the
// router, useSeo.js, and lodestar-pro-modules all import from
// here (`@/site.config.js`) — that path is not going to move.
//
// The actual content lives in config/ now, split up so no single
// file becomes unbearable to edit as a site grows — see config/index.js
// for how it's assembled, or just go edit the file for whatever
// you're changing: config/site.js (brand/contact/SEO), config/nav.js,
// config/footer.js, config/home.js, config/pages/<slug>.js, or
// config/modules/<name>.js (optional sitewide module defaults).
// ============================================================
export { site, moduleDefaults } from './config/index.js'
