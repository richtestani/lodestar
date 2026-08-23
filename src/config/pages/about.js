// ============================================================
// config/pages/about.js — one page. Every file in this folder is
// picked up automatically (config/index.js globs this folder) —
// drop a new file in to add a page, no other wiring needed.
//
// view: 'page' | 'contact' | 'sections'
//   'page'     → prose: { eyebrow, title, body: [...], cta }  (this file)
//   'contact'  → the contact form, no extra fields needed
//   'sections' → a list of modules, e.g. a standalone menu page:
//                { slug:'menu', name:'Menu', view:'sections',
//                  sections:[ { module:'menu', props:{...} } ] }
//                (same module system as config/home.js's homeSections)
//
// seo (optional) → { title, description }; omit to fall back to
// `${name}${seo.titleSuffix}` / `seo.defaultDescription` (site.js).
// ============================================================

export const page = {
  slug: 'about', name: 'About', view: 'page', content: {
    eyebrow: 'Our Story',
    title:   'Made by hand, on the coast',
    body: [
      'Dovetail began in a small workshop with a simple belief — that the things we use every day deserve to be made with care.',
      'We design and produce in small batches, choosing materials that age well and partners who share our standards.',
      'Whether it is a gift or something for your own table, we want it to mean a little more.',
    ],
    cta: { label: 'Get in touch', to: '/contact' },
  },
}
