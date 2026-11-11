// ============================================================
// config/pages/gallery.js — a full-page gallery. Just a 'rows' page
// with one gallery module: no special view, so it prerenders and gets
// SEO like any other page.
//
// Click any image to open the lightbox (← / → / swipe to move, Esc to
// close). `filter: true` adds category chips from each image's
// `category`; the lightbox steps through only what's showing.
//
// Image fields: src (required), alt, caption, category, and full — an
// optional larger file for the lightbox, so the grid can load smaller
// thumbnails. Filenames resolve against src/assets/images/; full URLs
// pass through.
//
// Videos can go in the same list — { type: 'youtube' | 'vimeo' | 'video',
// url or src, title, poster, category } — with a play badge on the tile,
// playing in the lightbox. README → Video in the gallery.
//
// Gallery props worth knowing for a page like this:
//   variant  grid | masonry | carousel | mosaic   (masonry suits mixed shapes)
//   surface  false — no tinted band behind a standalone page
//   captions true  — print captions on the thumbnails too
//   lightbox false — turn the overlay off
// ============================================================

const shot = (seed, w, h, alt, category, caption) => ({
  src:  `https://picsum.photos/seed/${seed}/${Math.round(w / 2)}/${Math.round(h / 2)}`,
  full: `https://picsum.photos/seed/${seed}/${w}/${h}`,
  alt, category, caption,
})

export const page = {
  slug: 'gallery', name: 'Gallery', view: 'rows',
  seo: { title: 'Gallery — Dovetail & Co.', description: 'A look inside the workshop and at recent pieces.' },

  rows: [
    { modules: [
      { module: 'gallery', props: {
          eyebrow: 'Gallery',
          title:   'From the workshop',
          intro:   'Recent pieces, works in progress, and the place they come from.',
          variant: 'masonry',
          filter:  true,
          surface: false,
          images: [
            shot('dv-mug',    1200, 1500, 'Stack of glazed stoneware mugs', 'Ceramics', 'Speckled glaze, fired in small batches.'),
            shot('dv-bench',  1600, 1067, 'Workbench with hand tools',      'Workshop', 'Where most of it starts.'),
            shot('dv-linen',  1200, 1200, 'Folded linen napkins',           'Textiles', 'Stonewashed linen in four colors.'),
            shot('dv-bowl',   1600, 1200, 'Serving bowl on a table',        'Ceramics', 'A wide serving bowl, glazed inside only.'),
            shot('dv-board',  1200, 1600, 'Walnut cutting board',           'Wood',     'End-grain walnut, oiled and ready.'),
            shot('dv-kiln',   1600, 1067, 'Kiln shelves loaded with pots',  'Workshop', 'Loading the kiln for a glaze firing.'),
            shot('dv-throw',  1200, 1500, 'Hands throwing a pot',           'Workshop'),
            shot('dv-spoon',  1600, 1200, 'Carved wooden spoons',           'Wood',     'Cherry spoons, carved by hand.'),
            shot('dv-weave',  1200, 1200, 'Woven table runner',             'Textiles'),
            shot('dv-vase',   1200, 1600, 'Tall vase with dried flowers',   'Ceramics', 'Tall bud vase in ash glaze.'),
            shot('dv-shelf',  1600, 1067, 'Shelves of finished pieces',     'Workshop', 'Finished and waiting to ship.'),
            shot('dv-tray',   1600, 1200, 'Oak serving tray',               'Wood'),
          ],
      }},
    ]},
  ],
}
