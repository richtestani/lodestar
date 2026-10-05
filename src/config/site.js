// ============================================================
// config/site.js — brand identity, theme, business info, SEO
// defaults. The stuff that's short and rarely touched.
//
// Nav lives in nav.js, footer in footer.js, the home page in
// home.js, every other page in pages/<slug>.js, and per-module
// sitewide defaults (optional) in modules/<name>.js. See
// config/index.js for how it's all assembled back into `site`.
// ============================================================

export const brand = {
  name:      'Dovetail & Co.',
  tagline:   'Considered goods for everyday rituals.',
  logoText:  'Dovetail',     // text logo (used when logoImage is empty)
  logoImage: '',              // optional: a filename in src/assets/images/
}

// Visual identity lives in src/themes/<theme>.css. Change this any time:
// the theme's colors, type and Google Fonts all follow (dev reloads on
// save). Per-site tweaks such as an accent color go in themes/overrides.css.
export const theme = 'north' // north | fresh | pulse | harvest

// Feeds footer, contact form, map
export const contact = {
  email:    'hello@dovetail.co',
  phone:    '(555) 016-2200',
  address:  '48 Harbor Lane, Beaufort, NC 28516',
  mapQuery: '48 Harbor Lane, Beaufort, NC',   // used by the map module
  formspree:'',               // paste your https://formspree.io/f/xxxx endpoint
}

export const social = [
  { label: 'Instagram', url: 'https://instagram.com' },
  { label: 'Facebook',  url: 'https://facebook.com' },
]

// Applied per route on navigation (src/composables/useSeo.js) and
// baked into the prerendered HTML for each page by the build's
// prerender step — so both browser tabs and crawlers/link-unfurlers
// see the right <title>, description, and Open Graph tags.
// Per-page overrides live on the page's own file, right next to it.
export const seo = {
  titleSuffix:       ' — Dovetail & Co.',   // appended to a page's title unless it sets its own
  defaultDescription: 'Small-batch homewares, made by hand and built to last.',
}

// The Not Found page: shown for any URL that isn't a page, and saved as
// public/404.html at build so the server can return a real 404 (see
// deploy/). It's styled by the theme and also lists the nav's pages.
export const notFound = {
  eyebrow: 'Page not found',
  title:   "We couldn't find that page.",
  text:    'The link may be out of date, or the address may have a typo.',
  cta:     { label: 'Back to home', to: '/' },
}
