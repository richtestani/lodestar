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

// Bundled placeholders in mixed shapes (portrait, photo, square, card), so
// the masonry layout has something to do. Swap in your own files by name.
const shot = (image, alt, category, caption) => ({ src: image, alt, category, caption })

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
            shot('ph-portrait-01.webp', 'Stack of glazed stoneware mugs', 'Ceramics', 'Speckled glaze, fired in small batches.'),
            shot('ph-photo-01.webp', 'Workbench with hand tools',      'Workshop', 'Where most of it starts.'),
            shot('ph-square-01.webp', 'Folded linen napkins',           'Textiles', 'Stonewashed linen in four colors.'),
            shot('ph-card-01.webp', 'Serving bowl on a table',        'Ceramics', 'A wide serving bowl, glazed inside only.'),
            shot('ph-portrait-02.webp', 'Walnut cutting board',           'Wood',     'End-grain walnut, oiled and ready.'),
            shot('ph-photo-02.webp', 'Kiln shelves loaded with pots',  'Workshop', 'Loading the kiln for a glaze firing.'),
            shot('ph-portrait-03.webp', 'Hands throwing a pot',           'Workshop'),
            shot('ph-card-02.webp', 'Carved wooden spoons',           'Wood',     'Cherry spoons, carved by hand.'),
            shot('ph-square-02.webp', 'Woven table runner',             'Textiles'),
            shot('ph-portrait-04.webp', 'Tall vase with dried flowers',   'Ceramics', 'Tall bud vase in ash glaze.'),
            shot('ph-photo-03.webp', 'Shelves of finished pieces',     'Workshop', 'Finished and waiting to ship.'),
            shot('ph-card-03.webp', 'Oak serving tray',               'Wood'),
          ],
      }},
    ]},
  ],
}
