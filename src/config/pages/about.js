// ============================================================
// config/pages/about.js — one page. To add a page, create a file in
// this folder, then register it in config/index.js: an import plus an
// entry in `pages: [...]`. Pages aren't picked up automatically —
// config/index.js explains why (prerender loads it in plain Node,
// where Vite's import.meta.glob doesn't exist). The order of `pages`
// is the order of the nav's auto-derived links (unless config/nav.js
// sets nav.links by hand).
//
// view: 'page' | 'contact' | 'rows' | 'collection'
//   'page'       → prose: { eyebrow, title, body: [...], cta, images, media }  (this file)
//   'contact'    → a form page. No extra keys → the standard contact form.
//                  Optional: eyebrow, title, intro, and form: { fields,
//                  subject, endpoint, submitLabel, success } — see
//                  README → Pages → contact for a booking example
//   'rows'       → rows of modules, each row 1–3 columns, e.g. a
//                  standalone menu page:
//                  { slug:'menu', name:'Menu', view:'rows',
//                    rows:[ { modules:[ { module:'menu', props:{...} } ] } ] }
//                  (same modules as config/home.js's homeSections; see
//                  config/pages/gallery.js, and layouts/RowLayout.vue for
//                  multi-column rows).
//   Any other view name (a typo, or the old 'sections') renders a blank
//   page with no error, so check the spelling if a page comes up empty.
//   'collection' → a listing + one page per item — see config/pages/shop.js
//
// seo (optional) → { title, description }; omit to fall back to
// `${name}${seo.titleSuffix}` / `seo.defaultDescription` (site.js).
//
// showInNav (optional) → set to `false` to keep a page out of the nav's
// auto-derived link list (e.g. a privacy policy nobody should have to
// hunt for in the header, but that still needs a real URL). Doesn't
// apply if nav.links is set by hand in config/nav.js — that list is
// already exactly what you wrote.
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
    // images (optional) — drop files in src/assets/images/ and pick a layout.
    // banner · float-left · float-right · portrait · split · full-bleed · strip
    // Photos are cropped to fit each layout; `focus` picks what's kept.
    // README → Images in prose pages has the full list.
    // images: [
    //   { src: 'workshop.jpg', alt: 'The workshop bench', layout: 'banner', focus: 'top' },
    //   { src: 'founder.jpg', alt: 'Our founder, Sam', layout: 'portrait', size: 'sm' },
    //   { src: 'kiln.jpg', alt: 'Firing the kiln', layout: 'full-bleed', after: 2 },
    // ],
    // media (optional) — video, audio or PDFs from src/assets/media/,
    // placed with `after` the same way. README → Media has every option.
    // media: [
    //   { type: 'video', src: 'workshop.mp4', title: 'A day in the workshop', poster: 'workshop.jpg', after: 1 },
    //   { type: 'pdf', src: 'care-guide.pdf', title: 'Care guide', description: '1 page' },
    // ],
  },
}