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
  site.config.js          ← the site definition (edit this)
  themes/                  base.css + _tokens.css + 4 themes + active.css
  modules/                 swappable home sections + registry.js + manifest.js
  modules/pro/              (not in this repo — created by installing lodestar-pro-modules)
  components/              AppNav, AppFooter, ui/ContactForm
  views/                   HomeView, PageView, ContactView, ModuleView
  components/SectionRenderer.vue  renders a list of modules (home + module pages)
  composables/useAssets.js image resolver
deploy/                    .htaccess + nginx snippet
scripts/prerender.mjs     robots.txt + sitemap.xml + per-page prerender (runs after build)
```
