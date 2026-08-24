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

It creates a **sibling folder** next to this template, writes `src/config/*`
from your answers, sets the theme + matching Google Fonts, and prints next steps:

```
cd ../your-site
npm install
npm run dev
```

Keep this `lodestar/` folder as the master template; never deploy it directly.

## Config: `src/config/`

Everything about a site — brand, theme, contact info, navigation, pages,
footer, home page — lives in `src/config/`, split into small files so no
single one becomes unbearable to read or edit as a site grows (Laravel's
`config/` folder was the direct inspiration):

```
src/config/
  site.js       brand, theme, contact, social, SEO defaults
  nav.js        nav style, links, mega-nav settings (if using lodestar-pro-modules)
  footer.js     footer content and layout
  home.js       the home page — its nav/SEO entry (homePage) + its module list (homeSections)
  pages/        one file per other page — about.js, contact.js, ...
  modules/      optional — sitewide defaults for a specific module (see modules/README.md)
  index.js      assembles all of the above into the final `site` object
```

`src/site.config.js` still exists — it's now a one-line re-export of
`config/index.js` — because it's the stable import path every component,
the router, `useSeo.js`, and any installed `lodestar-pro-modules` package
already use. You'll never need to touch it; edit whichever file under
`config/` actually holds what you're changing.

**Adding a page:** create `config/pages/<slug>.js` (copy an existing one),
then add one import + one entry to the `pages` array in `config/index.js`.
That two-step isn't an oversight — `config/index.js` is also loaded by
plain Node during the build (`scripts/prerender.mjs`), not just by Vite, so
the auto-discovery trick used elsewhere in this codebase (`import.meta.glob`)
isn't usable here. `setup.mjs` does this wiring for you when it scaffolds
a new project.

Each page (and the home page) has an ordered list of modules:

```js
// config/home.js
export const homeSections = [
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

- **`collection`** — a listing page + one detail page per item, from a single
  `items[]` list — a shop, a team roster, a portfolio, whatever a project
  needs (not retail-specific despite the name). Router generates exactly two
  routes regardless of catalog size (`/shop` and `/shop/:itemSlug`), and
  `scripts/prerender.mjs` expands `items[]` into real URLs at build time so
  every item still gets its own prerendered page and sitemap entry, same as
  any other page. `indexSections` renders on the listing page with `items`
  threaded in; `itemSections` renders on each detail page with the single
  matched `item` threaded in — same module mechanism as `homeSections`, via
  `SectionRenderer`'s `context` prop. Only `slug` and `name` are required per
  item; the built-in `collectionGrid`/`itemHero`/`itemDetail` modules read
  `image`/`price`/`tagline`/`description`/`meta`/`cta` if present, skip what
  isn't there. See `config/pages/shop.js` for a fully worked example.

  `collectionGrid` can also group the listing by any field your items
  carry — `groupBy: 'category'` for a shop, `groupBy: 'author'` for a book
  list, whatever fits — no fixed "category" concept, and items don't need
  any new required field. Groups sort alphabetically by default; pass
  `groupOrder: [...]` to pin a specific order instead. Items missing the
  field land in an "Other" group. This is purely how the listing displays
  — the collection is still one route, one prerendered page; nothing about
  routing, the sitemap, or validation changes based on grouping.

Nav links are derived from `pages`, so adding a page adds it to the nav — for
a collection, that's just its index page (`/shop`); individual items were
never nav entries. To keep a page out of the nav while it still gets a real,
crawlable URL (a privacy policy, terms of service), set `showInNav: false`
on it. Doesn't apply if `nav.links` is set by hand in `config/nav.js` — that
list is already exactly what you wrote.

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
`pricing` · `team` · `faq` · `map` · `contact` · `cta` ·
`collectionGrid` · `itemHero` · `itemDetail` (see Pages → collection)

Add your own: build a `*.vue` that reads props, register it in `registry.js`,
reference it in `homeSections`.

Want a module's settings to default the same way everywhere unless a specific
instance overrides them? See `src/config/modules/README.md` — optional,
most modules don't need it.

Two modules ship with layout **variants**, set per-instance via a `variant`
prop in the section's `props`:

- **hero** — `center` (default) · `split` · `minimal` · `overlay` · `panel`
- **gallery** — `grid` (default) · `masonry` · `carousel` · `mosaic`

## Premium add-ons

Advanced modules and nav styles (parallax sections, the full mega-nav, and
whatever gets added later) don't live in this repo — they ship separately
from **`lodestar-pro-modules`**, and only exist in a project once you install
that package into it. Nothing to flip on, nothing baked into every clone by
default: the base scaffold stays exactly as lean as it looks above.

**How it plugs in:** `modules/registry.js` and `App.vue` each check for an
optional file (`modules/pro/registry.js`, `components/pro/MegaNav.vue`) via
Vite's `import.meta.glob`. If lodestar-pro-modules hasn't been installed into
a given project, those globs just resolve to nothing and everything behaves
exactly like the base template — no error, no dead code path. Once you *do*
install it, whatever it registers (a `parallax` module, the `mega` nav style)
becomes usable immediately, same as any built-in module.

**Installing it into a project:**
```
git clone <lodestar-pro-modules repo url> /tmp/lodestar-pro
cp -r /tmp/lodestar-pro/modules/pro     src/modules/pro
cp -r /tmp/lodestar-pro/components/pro  src/components/pro
```
Then reference `module: 'parallax'` in `homeSections`, or set `nav.style: 'mega'`
— see the commented example in `site.config.js`'s `nav` block.

If a page or nav config references a premium module/style that isn't
installed, `npm run build` fails with a clear message rather than shipping a
page with a silently-missing section or a silently-downgraded nav.

## Images

Put files in `src/assets/images/` and reference them by filename in the config
(`image: 'hero.jpg'`). Full URLs pass through untouched. Resolution is handled by
`src/composables/useAssets.js`.

## Build & deploy

```
npm run build           # vite build + prerender → outputs to /public
npm run build:staging   # same, using .env.staging
```

Upload `/public` to the host. For SPA history-mode routing:
- **Apache / Bluehost** — copy `deploy/.htaccess` into the web root.
- **Nginx / Forge** — use the `try_files` rule in `deploy/nginx.conf.txt`.

`.env.staging` sets `noindex`, `.env.production` sets `index` (via the
`%VITE_ROBOTS%` token in `index.html`).

Running `npm run build` in *this* repo (the template, not a generated
project) still runs `vite build` for a quick local check, but skips
robots.txt/sitemap/page prerendering entirely — pointless for placeholder
content that's never deployed. That's controlled by the `.lodestar-template`
marker file at the repo root: `setup.mjs` excludes it from every generated
project, so a real client site always gets the full build.

### SEO — indexable by default

`npm run build` runs `vite build` and then `scripts/prerender.mjs`, which:
- writes `public/robots.txt` from `VITE_ROBOTS` (plus a `Sitemap:` line when indexable),
- writes `public/sitemap.xml` from `site.pages`, using `VITE_SITE_URL` (set by `setup.mjs`,
  or edit `.env.production` directly),
- visits every route from `site.pages` in a headless browser and writes the fully-rendered
  HTML to `public/<slug>/index.html` (`public/index.html` for home), so crawlers get real
  content on first request instead of an empty `#app` shell.

The existing `.htaccess` / `try_files` rules already serve a matching folder's `index.html`
before falling back to the SPA shell, so nothing in `/deploy` needs to change. Real visitors
still get the normal Vue app — it mounts over the prerendered markup like always, it just no
longer starts from a blank page. Requires `puppeteer` (a devDependency); if it's ever missing,
`robots.txt`/`sitemap.xml` still get written and prerendering is skipped with a warning.

## Layout

```
setup.mjs                 the CLI (Node built-ins only, no install needed)
index.html                fonts + title injected by setup
src/
  site.config.js          stable re-export — the real content lives in config/
  config/
    site.js                 brand, theme, contact, social, SEO defaults
    nav.js                  nav style, links, mega-nav settings
    footer.js               footer content and layout
    home.js                 home page — homePage entry + homeSections
    pages/<slug>.js         one file per other page
    modules/<n>.js          optional — sitewide module defaults
    index.js                assembles all of the above into `site`
  themes/                  base.css + _tokens.css + 4 themes + active.css
  modules/                 swappable home sections + registry.js + manifest.js
  modules/pro/              (not in this repo — created by installing lodestar-pro-modules)
  components/              AppNav, AppFooter, ui/ContactForm
  views/                   HomeView, PageView, ContactView, ModuleView, CollectionView, CollectionItemView
  components/SectionRenderer.vue  renders a list of modules (home, module, and collection pages)
  composables/useAssets.js image resolver
deploy/                    .htaccess + nginx snippet
scripts/prerender.mjs     robots.txt + sitemap.xml + per-page prerender (runs after build)
```
