# Lodestar — client-site starter kit

A reusable Vue 3 + Vite template for spinning up client marketing sites fast.
One command stamps out a new project with a theme, navigation, pages, and a
home page assembled from swappable modules — roughly 90% built, ready to fill in.

Builds to `/public` for the usual deploy workflow (Vite → `/public` →
Forge/Vultr staging, Bluehost production).

## Start a new site

```
node setup.mjs          # interactive — asks name, theme, nav, pages, sections, contact
node setup.mjs --yes    # non-interactive, all defaults (handy for a quick look)
```

It creates a **sibling folder** next to this template, writes `src/site.config.js`
from your answers, sets the theme + matching Google Fonts, and prints next steps:

```
cd ../your-site
npm install
npm run dev
```

Keep this `lodestar/` folder as the master template; never deploy it directly.

## The one file you edit: `src/site.config.js`

Everything about a site lives here — brand, theme, contact info, navigation,
pages, footer, and the ordered list of home-page sections. It's plain JS, so it
takes comments and edits cleanly in TextMate. The copy in this template is a
fully worked demo ("Dovetail & Co.") showing every field.

```js
homeSections: [
  { module: 'hero',     props: { title: '…', image: '…', primaryCta: {…} } },
  { module: 'features', props: { items: [ {icon,title,text}, … ] } },
  { module: 'cta',      props: { title: '…', cta: {…} } },
]
```

Reorder, remove, or duplicate entries freely. Unknown module names warn in dev.

## Pages

Each entry in `pages` picks a `view`:

- **`home`** — the home page; renders `homeSections`.
- **`page`** — a prose page (`content: { eyebrow, title, body: [...], cta }`).
- **`contact`** — the contact form.
- **`sections`** — a page built from modules, just like the home page. Give it a
  `sections: [...]` array. This is how you make, say, a standalone menu page:

```js
{ slug: 'menu', name: 'Menu', view: 'sections', sections: [
  { module: 'menu', props: { /* … */ } },
  { module: 'cta',  props: { /* … */ } },
]}
```

Nav links are derived from `pages`, so adding a page adds it to the nav.

## Themes

Four token-based base styles. A theme is just a set of CSS variables in
`src/themes/<name>.css`; no component touches color or fonts directly.

| theme   | for                              | look                         |
|---------|----------------------------------|------------------------------|
| north   | the default — simple & modular   | clean light + cobalt, mono labels |
| fresh   | service / trades / professional  | light + blue                 |
| pulse   | tech / SaaS / startup            | deep slate + indigo→cyan     |
| harvest | food / restaurant / cafe         | warm cream + serif           |

`north` is the default and is deliberately vertical-neutral: a single grotesk
family with monospace section labels, so it sits under any kind of business.
The other three are opinionated starting points for common verticals.

Switch any time by re-pointing `src/themes/active.css`. To restyle, copy a theme
file and change the tokens listed in `src/themes/_tokens.css` — that's the whole
contract. (Re-running setup also injects the matching font `<link>`; if you swap
themes by hand, update the fonts in `index.html` too.)

## Modules

Drop-in home sections in `src/modules/`, wired up in `registry.js`:

`hero` · `features` · `stats` · `testimonials` · `gallery` · `menu` ·
`pricing` · `team` · `faq` · `map` · `contact` · `cta`

Add your own: build a `*.vue` that reads props, register it in `registry.js`,
reference it in `homeSections`.

Two modules ship with layout **variants**, set per-instance via a `variant`
prop in the section's `props`:

- **hero** — `center` (default) · `split` · `minimal` · `overlay` · `panel`
- **gallery** — `grid` (default) · `masonry` · `carousel` · `mosaic`

## Images

Put files in `src/assets/images/` and reference them by filename in the config
(`image: 'hero.jpg'`). Full URLs pass through untouched. Resolution is handled by
`src/composables/useAssets.js`.

## Build & deploy

```
npm run build      # outputs to /public (per vite.config.js)
```

Upload `/public` to the host. For SPA history-mode routing:
- **Apache / Bluehost** — copy `deploy/.htaccess` into the web root.
- **Nginx / Forge** — use the `try_files` rule in `deploy/nginx.conf.txt`.

`.env.staging` sets `noindex`, `.env.production` sets `index` (via the
`%VITE_ROBOTS%` token in `index.html`).

## Layout

```
setup.mjs                 the CLI (Node built-ins only, no install needed)
index.html                fonts + title injected by setup
src/
  site.config.js          ← the site definition (edit this)
  themes/                  base.css + _tokens.css + 4 themes + active.css
  modules/                 swappable home sections + registry.js
  components/              AppNav, AppFooter, ui/ContactForm
  views/                   HomeView, PageView, ContactView, ModuleView
  components/SectionRenderer.vue  renders a list of modules (home + module pages)
  composables/useAssets.js image resolver
deploy/                    .htaccess + nginx snippet
```
