// ============================================================
// modules/manifest.js — names only, no component imports, so this
// is readable from plain Node (scripts/prerender.mjs) as well as
// the Vue app.
//
// Premium modules aren't listed here — they don't live in this repo.
// A premium package (e.g. lodestar-pro-modules) installs into
// modules/pro/ and ships its own modules/pro/manifest.js exporting
// PRO_MODULES, which registry.js and prerender.mjs pick up
// automatically if that file exists. See the README's "Premium
// add-ons" section.
// ============================================================

export const BASE_MODULES = [
  'hero', 'features', 'stats', 'testimonials', 'gallery',
  'menu', 'pricing', 'team', 'faq', 'map', 'contact', 'cta',
  'collectionGrid', 'itemHero', 'itemDetail', 'content',
]

export const BASE_NAV_STYLES = ['classic', 'centered', 'minimal']
