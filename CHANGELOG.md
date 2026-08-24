# Changelog

All notable changes to Lodestar are documented here.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project aims to follow [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.4.0] — 2026-08-23

### Added
- **`collection` page type** — a listing page + one detail page per item,
  from a single `items[]` list (a shop, team roster, portfolio, whatever a
  project needs — not retail-specific despite the example). Router
  generates exactly two routes regardless of catalog size (`/shop` and
  `/shop/:itemSlug`); `scripts/prerender.mjs` expands `items[]` into real
  URLs at build time so every item gets its own prerendered page and
  sitemap entry like any other page. New `CollectionView`/`CollectionItemView`
  render `indexSections`/`itemSections` through the same `SectionRenderer`
  every other page type uses — `SectionRenderer` gained a `context` prop
  for threading `items`/`item` into whichever modules ask for them, so no
  parallel rendering system was needed for this.
- Three new base modules: `collectionGrid`, `itemHero`, `itemDetail` —
  deliberately domain-neutral (a `price` line is just an optional line
  under the item name, not retail-specific machinery). See
  `config/pages/shop.js` for a fully worked example.
- `collectionGrid` can group its listing by any field an item carries —
  `groupBy: 'category'`, `groupBy: 'author'`, whatever fits — sorted
  alphabetically by default, or pinned with `groupOrder: [...]`. Purely a
  display concern: still one route, one prerendered page; grouping
  doesn't touch routing, the sitemap, or validation.
- Build-time validation for collections: every item needs a slug, slugs
  must be unique within a collection, and (as with every other page)
  referencing an unregistered module fails the build with a clear message
  instead of shipping a broken page.
- Per-item SEO — an item can set its own `seo: { title, description }`;
  the router builds a synthetic page-shaped object for `useSeo.js` so item
  pages get correct title/meta/OG tags the same way every other page does.
- **`showInNav: false`** on any page — keeps it out of the nav's
  auto-derived link list while it still gets a real, crawlable URL (a
  privacy policy, terms of service). Doesn't apply if `nav.links` is set
  by hand — that list is already exactly what you wrote.

## [0.3.0] — 2026-08-16

### Added
- **`src/config/` split** — `site.config.js` is now a one-line stable
  re-export; the actual content lives in `config/site.js`, `nav.js`,
  `footer.js`, `home.js`, `pages/<slug>.js` (one file per page), and
  optional `modules/<name>.js` (sitewide module defaults, merged under a
  module instance's own props by `SectionRenderer`). Nothing importing
  `@/site.config.js` — including an installed `lodestar-pro-modules`
  package — needed to change. `setup.mjs` generates the split files for
  every new project. Adding a page is one file + one import/entry in
  `config/index.js` — deliberately not auto-discovered, since that file
  is also loaded by plain Node during the build (`scripts/prerender.mjs`),
  where `import.meta.glob` isn't available.
- **Mega-nav settings** — `trigger` (click/hover), `overlay` (floating vs.
  inline), `megaLayout` (wide/stacked), plus `hoverBg`/`hoverText`/`bgImage`/
  `iconPosition`, shared across the base nav styles too. See
  `lodestar-pro-modules`' own changelog for the mega-nav side of this.

## [0.2.0] — 2026-08-10

### Added
- **`sections` page type** — pages can now be built from an ordered list of
  modules (like the home page), not just prose. Set `view: 'sections'` and a
  `sections: [...]` array on a page — e.g. a standalone menu page. Backed by a
  new `ModuleView` and a shared `SectionRenderer` component that the home page
  now also uses.
- **Hero layout variants** — `minimal` (text-only), `overlay` (copy on a
  full-bleed image), and `panel` (floating copy card over a contained image),
  alongside the existing `center` and `split`. Set per-instance via the hero
  section's `variant` prop.
- **Gallery layout variants** — `masonry` (staggered heights), `carousel`
  (horizontal swipe strip), and `mosaic` (large first image + tiles), alongside
  the default `grid`. Set per-instance via the gallery section's `variant` prop.
- **SEO by default** — `npm run build` now runs `vite build` and then
  `scripts/prerender.mjs`, which writes `public/robots.txt` and
  `public/sitemap.xml` (from `VITE_ROBOTS`/`VITE_SITE_URL`), and visits every
  route from `site.pages` in a headless browser to write fully-rendered HTML to
  `public/<slug>/index.html` — real content for crawlers instead of an empty
  `#app` shell. Falls back gracefully (with a clear message) if no browser is
  available, trying a locally-installed Chrome/Brave/Chromium/Edge before
  giving up. `setup.mjs` now also asks for the production site URL.
- **Per-page title/meta/OG tags** — `site.config.js` gained a `seo` block
  (site-level defaults + optional per-page `title`/`description` overrides,
  right on the same page entries that already drive routing and nav).
  `composables/useSeo.js`, wired into the router, sets `<title>`, meta
  description, canonical link, and Open Graph/Twitter Card tags on every
  navigation — captured into the prerendered HTML above, so link-unfurlers
  (which mostly don't run JS) see the right tags too.
- **Premium add-on support** — `modules/registry.js` and `App.vue` use
  `import.meta.glob` to optionally pick up `modules/pro/registry.js` and
  `components/pro/MegaNav.vue` if a premium package (e.g.
  `lodestar-pro-modules`) has been installed into a project; resolves to
  nothing and changes nothing otherwise. `scripts/prerender.mjs` fails the
  build with a clear message if `site.config.js` references a module or nav
  style that isn't actually installed.
- **`.lodestar-template` marker** — `npm run build` in this repo (not a
  generated project) still runs `vite build` for a quick local check, but
  skips robots.txt/sitemap/page prerendering, which are meaningless for
  placeholder content that's never deployed. `setup.mjs` excludes the marker
  from every generated project.

### Security
- **Hardened deploy configs** — `deploy/.htaccess` and `deploy/nginx.conf.txt`
  now force HTTPS and set security headers: a Content-Security-Policy tuned to
  exactly what the template loads (self-hosted JS/CSS, Google Fonts, the Maps
  embed, the Formspree POST), HSTS, `X-Content-Type-Options`, `Referrer-Policy`,
  frame protection, and a restrictive `Permissions-Policy`.
- **Contact-form honeypot** — `ui/ContactForm.vue` adds an off-screen `_gotcha`
  field; filled submissions are silently dropped client-side and by Formspree.

All layout variants are pure CSS (no new dependencies) and documented in the
README and the reference `site.config.js`.

## [0.1.0] — 2026-06-23

First working version: a reusable Vue 3 + Vite starter that scaffolds a new
client site from a single interactive command.

### Added
- **Setup CLI** (`setup.mjs`) — dependency-free Node script that stamps out a
  new site into a sibling folder, asking for project name, brand, theme, nav
  style, pages, home-page sections, and contact details. Includes a `--yes`
  flag for a non-interactive default build.
- **Config-driven architecture** — a single commented `src/site.config.js`
  defines brand, theme, contact info, navigation, pages, footer, and the
  ordered list of home-page modules.
- **Theme system** — token-based themes (`src/themes/*.css`) with a documented
  variable contract in `_tokens.css`; switch by re-pointing `active.css`.
  Four themes: `north` (default, simple & modular — clean light + cobalt with
  monospace labels), `fresh` (service/professional), `pulse` (tech/SaaS), and
  `harvest` (food/restaurant).
- **Module library** — 12 swappable home-page sections wired through
  `src/modules/registry.js`: hero, features, stats, testimonials, gallery,
  menu, pricing, team, faq, map, contact, cta.
- **Configurable nav and footer** — `AppNav` supports classic / centered /
  minimal styles; `AppFooter` supports columns / minimal.
- **Shared contact form** — Formspree-backed `ui/ContactForm.vue` used by both
  the contact page and the contact module.
- **Asset resolver** — `composables/useAssets.js` maps bare filenames in config
  to bundled images and passes through full URLs.
- **Deploy helpers** — `deploy/.htaccess` (Apache/Bluehost) and
  `deploy/nginx.conf.txt` (Nginx/Forge) for SPA history-mode routing; build
  outputs to `/public`; `%VITE_ROBOTS%` toggles indexing via `.env.staging`
  and `.env.production`.

[Unreleased]: https://github.com/richtestani/lodestar/compare/v0.2.0...HEAD
[0.2.0]: https://github.com/richtestani/lodestar/compare/v0.1.0...v0.2.0
[0.1.0]: https://github.com/richtestani/lodestar/releases/tag/v0.1.0
