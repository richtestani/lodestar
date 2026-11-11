# Lodestar — client-site starter kit

A reusable Vue 3 + Vite template for spinning up client marketing sites fast.
One command stamps out a new project with a theme, navigation, pages, and a
home page assembled from swappable modules — roughly 90% built, ready to fill in.

Builds to `/public` for the usual deploy workflow (Vite → `/public` →
Forge/Vultr staging, Bluehost production).

## Start a new site

```
node setup.mjs                      # interactive — asks name, template, theme, nav, pages, contact
node setup.mjs --yes                # non-interactive, all defaults (handy for a quick look)
node setup.mjs --template service   # skip the template question (combines with --yes)
```

### Site templates

The first real question is which **site template** to start from. A
template decides the starting pages, the home page's module list, nav
extras and footer columns, and suggests a theme. Both the theme and nav
style are still asked afterwards, so any template works with any theme.

| template   | pages | home page | suggested theme |
|------------|-------|-----------|-----------------|
| `standard` | About, Contact | the theme's recommended modules (or your own list) | your pick |
| `service`  | Features, Pricing, Customers (case-study collection), About, Contact | stacked hero + product shot → stats → feature grid → alternating feature rows → testimonials → pricing → FAQ → CTA | `press` |

`service` is aimed at a company selling a service or subscription, in the
style of modern creator-platform / SaaS sites. Home and Contact are kept out
of the nav links (the logo goes home; a **Get started** button goes to
Contact).

Templates live in `templates/<name>.mjs` and are only used by setup; the
folder isn't copied into generated projects. Once a site is generated there
is nothing template-specific left in it, only ordinary `src/config/` files.
To add one, copy `templates/service.mjs`; its header comment documents the
shape (`name`, `label`, `theme`, `navStyle`, `nav`, and a `build()` that
returns `homeSections`, `pages`, `homePage` and `footerColumns`).

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
- **`contact`** — a form page. With no extra keys it's the standard contact
  form. Give it `eyebrow` / `title` / `intro` and a `form` object to make any
  other form page — booking, quotes, catering orders — without a new view:

```js
// config/pages/booking.js  (+ an import and an entry in config/index.js)
export const page = {
  slug: 'booking', name: 'Booking', view: 'contact',
  eyebrow: 'Book a show', title: 'Bring live music to your venue',
  intro: 'Bars, clubs, private events — tell me about your night.',
  form: {
    subject: 'Booking inquiry',          // email subject line (Formspree _subject)
    // endpoint: 'https://formspree.io/f/…', // optional — defaults to contact.formspree
    submitLabel: 'Send inquiry',
    success: { title: 'Thanks!', text: "I'll get back to you within a couple of days." },
    fields: [
      { name: 'name',  label: 'Your name', type: 'text',  required: true, half: true },
      { name: 'email', label: 'Email',     type: 'email', required: true, half: true },
      { name: 'venue', label: 'Venue / event', type: 'text', required: true },
      { name: 'date',  label: 'Preferred date', type: 'date', half: true },
      { name: 'type',  label: 'Event type', type: 'select', half: true,
        options: ['Bar / club', 'Private event', 'Festival', 'Other'] },
      { name: 'message', label: 'Details', type: 'textarea', rows: 5 },
    ],
  },
}
```

  Field types: `text` · `email` · `tel` · `date` · `time` · `number` · `url` ·
  `select` · `textarea` · `checkbox`. Per field: `name` (the key sent to
  Formspree), `label`, `required`, `placeholder`, `half` (two-up on wide
  screens), `rows`, `options` (strings or `{ label, value }`), `min`/`max`,
  `autocomplete`, `value` (initial). Keep a field named `email` — Formspree
  uses it as the reply-to. Optional fields get an "(optional)" hint. The
  `contact` module takes the same `form` prop, so the same form can also sit
  as a section on any page.
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

## Docs (optional)

A documentation section for manuals, help centers or policies. Each Markdown
file in `src/content/docs/` becomes a page at `/docs/<file-name>`
(`getting-started.md` → `/docs/getting-started`), rendered with a sidebar of all
docs and an "on this page" list built from its `##`/`###` headings. `/docs`
redirects to the first doc. Set `title:` and `order:` in each file's frontmatter.

Setup asks whether a site needs docs. If not, it removes the placeholder docs,
and with no `.md` files in that folder the router doesn't register `/docs` at
all, so the URL behaves like any other unknown path. To add docs later, drop a
`.md` file in `src/content/docs/`. Docs pages are prerendered and listed in the
sitemap like every other page.

## Themes

Four token-based base styles. A theme is just a set of CSS variables in
`src/themes/<name>.css`; no component touches color or fonts directly.

| theme   | for                              | look                         |
|---------|----------------------------------|------------------------------|
| north   | the default — simple & modular   | clean light + cobalt, mono labels |
| fresh   | service / trades / professional  | light + blue                 |
| pulse   | tech / SaaS / startup            | deep slate + indigo→cyan     |
| harvest | food / restaurant / cafe         | warm cream + serif           |
| press   | publishing / SaaS / service co.  | white, ink pill buttons, tight bold type, pink labels |

`north` is the default and is deliberately vertical-neutral: a single grotesk
family with monospace section labels, so it sits under any kind of business.
The other three are opinionated starting points for common verticals.

Switch any time by changing `theme` in `src/config/site.js`. Colors, type and
the theme's Google Fonts all follow, and the dev server reloads on save. A
small Vite plugin (`scripts/vite-plugin-theme.mjs`) does this: it loads
`src/themes/<theme>.css` and writes that theme's font `<link>` (from
`src/themes/registry.js`) into `index.html` at dev and build time. A theme name
with no matching file fails the build instead of quietly doing nothing.

Per-site tweaks such as a brand accent go in `src/themes/overrides.css`, which
layers on top of whichever theme is active and survives a switch.

To make your own theme, copy a theme file, change the tokens listed in
`src/themes/_tokens.css` (that's the whole contract), and point `theme` at its
name. `_tokens.css` also lists **optional style tokens** (button case, radius
and size, heading weight and tracking, nav link case, label color, footer
accent). A theme that leaves them out looks exactly as before; `press` uses
them for its sentence-case pill buttons and tight headlines. Add an entry in `registry.js` if it needs different fonts.

## Modules

Drop-in home sections in `src/modules/`, wired up in `registry.js`:

`hero` · `features` · `stats` · `testimonials` · `gallery` · `menu` ·
`pricing` · `team` · `faq` · `map` · `contact` · `cta` ·
`collectionGrid` · `itemHero` · `itemDetail` (see Pages → collection) ·
`media` (video, audio and PDFs; see Media)

Add your own: build a `*.vue` that reads props, register it in `registry.js`,
reference it in `homeSections`.

Want a module's settings to default the same way everywhere unless a specific
instance overrides them? See `src/config/modules/README.md` — optional,
most modules don't need it.

Three modules ship with layout **variants**, set per-instance via a `variant`
prop in the section's `props`:

- **hero** — `center` (default) · `split` · `minimal` · `overlay` · `panel` · `stacked`
  (`stacked`: centered copy with the image framed below it, like a product
  screenshot; with no image it becomes a compact centered page header). Any
  variant also takes an optional `note`, a small line under the buttons.
  `center` and `overlay` take a background `video`; see Hero video.
- **features** — `grid` (default) · `rows` (one feature per row, image and
  copy alternating sides; items can also carry `label`, `points: []` and `cta`).
  `surface: true|false` overrides the tinted band (on for grid, off for rows).
- **gallery** — `grid` (default) · `masonry` · `carousel` · `mosaic`
  Click any image to open it in a full-screen **lightbox** (← / → or swipe to
  move, Esc or backdrop to close; `lightbox: false` turns it off). Images take
  `{ src, alt, caption, category, full }`: `full` is an optional larger file
  for the lightbox, `caption` shows in the lightbox (and on the thumbnail with
  `captions: true`), and `filter: true` adds category chips built from
  `category`. Also `intro` and `surface: false` (no tinted band).

**Gallery page.** A full-page gallery is just a `rows` page holding one
`gallery` module; see `src/config/pages/gallery.js`. The lightbox is also its
own component (`components/ui/Lightbox.vue`) if a custom module needs one.

**Nav button.** `cta: { label, to }` in `config/nav.js` adds a button after the
links ("Get started"), at the end of the drawer on mobile. Base nav styles
only; the pro mega nav doesn't read it.

**Flush rows.** On a `rows` page, `flush: true` on a row removes the gap below
it, so full-width section modules stack edge to edge like on the home page.

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

## Logo

Set `brand.logoImage` in `src/config/site.js` to a file in
`src/assets/images/` (SVG or PNG work best) and it replaces the brand name in
the nav. Setup asks for one and copies it in for you; you can drag the file
into the terminal. How it sits is `logo` in `src/config/nav.js`:

| `display`  | look |
|------------|------|
| `inline`   | fits inside the bar (default) |
| `overhang` | larger, hangs past the bar's bottom edge |
| `tab`      | overhang on a backing plate hung from the top edge; legible over any hero image |

Options: `height` (px; default 36 inline, 96 otherwise), `mobileHeight` (default
about two thirds of `height`), `withText: true` to show `brand.logoText` beside
the image (an icon mark plus the name), and `shrinkOnScroll` (default true):
overhang and tab logos tuck back into the bar once the page scrolls, on a
sticky nav. Every layout works with every nav style; with `centered`, a tall
overhang or tab covers the middle of the hero's top edge, so lower `height` or
leave room there.

**Footer.** The footer sits on a dark panel, so it uses
`brand.logoImageOnDark` (a light version of the logo) when you set one.
Otherwise it shows `brand.logoImage` on a light backing plate so a dark logo
stays readable, and with no image at all it shows the brand name as text. The
`minimal` footer style shows the logo centered above the legal line whenever
there's an image. Options are `logo` in `src/config/footer.js`: `height`
(default 44), `plate` (force the backing plate on or off), `plateColor`,
`withText` and `show: false` to leave the logo out.

## Images

Put files in `src/assets/images/` and reference them by filename in the config
(`image: 'hero.jpg'`). Full URLs pass through untouched. Resolution is handled by
`src/composables/useAssets.js`.

Photos (jpg, png, webp, avif) are resized at build time into 480 / 960 / 1600 /
2400px WebP versions (never upscaled) via `vite-imagetools`, so you can drop in
a full-size camera or phone photo without shipping megabytes. Images in prose
pages use these automatically through `srcset`; the widths live in
`useAssets.js`. SVG and GIF are left as-is.

### Images in prose pages

A `view: 'page'` page (and the `content` module) takes an `images` list.
Each image picks a layout preset:

```js
content: {
  title: 'About Elle',
  body: ['First paragraph…', 'Second…', 'Third…'],
  images: [
    { src: 'stage.jpg', alt: 'Elle on stage at The Pour House', layout: 'banner', focus: 'top' },
    { src: 'headshot.jpg', alt: 'Elle smiling', layout: 'portrait', size: 'sm' },
    { src: 'crowd.jpg', alt: 'A packed room', layout: 'full-bleed', after: 2, caption: 'Live in Raleigh' },
  ],
}
```

| layout        | what it does |
|---------------|--------------|
| `banner`      | across the text column. With no `after` it heads the page, above the title |
| `float-left` / `float-right` | text wraps around it. `size: 'sm'` is drop-cap scale |
| `portrait`    | round crop, text follows the curve; made for headshots |
| `split`       | image in one column, all the text in the other (`side: 'right'` to flip); stacks on phones |
| `full-bleed`  | breaks out to the full window width between paragraphs |
| `strip`       | a row of small images: `{ layout: 'strip', items: [{ src, alt }, …] }` |

Options: `size` (`sm` · `md` · `lg`, for floats and portrait), `after: N`
(place after paragraph N; default is before the first), `caption`,
`ratio`, `focus`.

**Cropping.** Every layout has a default shape (banner 21:9, 16:9 on phones;
floats 4:5; portrait and strip square; full-bleed 16:9) and the photo fills it,
trimming the edges. You never need to crop images by hand first, but you do
control what's kept:
- `focus` moves the crop window: `'top'` for faces in a portrait-format photo,
  `'left'`, `'bottom'`, or exact coordinates like `'50% 20%'`.
- `ratio` changes the shape (`'3/2'`, `'1'`, `'16/9'`), or `'natural'` for no
  crop at all.

`alt` is required: the build fails on a missing one (use `alt: ''` for a purely
decorative image) or an unknown layout name.

## Media

Video, audio and PDFs use the browser's own players: no library, and keyboard,
screen-reader and picture-in-picture support come for free. Put files in
`src/assets/media/` and reference them by filename; full URLs (a video CDN,
S3, Bunny) pass through. Posters and cover art can live in either
`src/assets/media/` or `src/assets/images/`.

Every item has a `type`, a `src` (or for YouTube/Vimeo, a `url`) and a
`title` (the accessible name, and the link text for a PDF):

```js
{ type: 'video', src: 'promo.mp4', title: 'Spring tour promo',
  poster: 'promo.jpg',                       // shown before play
  captions: [{ src: 'promo.en.vtt', lang: 'en', label: 'English' }],
  caption: 'Filmed at The Pour House' }      // text under the player

{ type: 'audio', src: 'single.mp3', title: 'Neon Rain', artist: 'Elle Sera', artwork: 'neon-rain.jpg' }

{ type: 'pdf', src: 'rider.pdf', title: 'Stage plot & tech rider',
  description: '2 pages · updated March 2026', display: 'inline' }

{ type: 'youtube', url: 'https://youtu.be/dQw4w9WgXcQ', title: 'Live at The Pour House' }

{ type: 'vimeo', url: 'https://vimeo.com/76979871', title: 'Studio session', poster: 'studio.jpg' }
```

| type    | options |
|---------|---------|
| `video` | `poster`, `captions` (WebVTT `.vtt` only), `defaultCaptions: true` (show the first track without the viewer turning it on), `ratio` (`'16/9'` default, `'9/16'` for vertical phone video, `'natural'`), `loop`, `sources` (several encodings, best first: `[{ src: 'clip.webm' }, { src: 'clip.mp4' }]`) |
| `audio` | `artist`, `artwork` (square image) |
| `pdf`   | `display`: `'link'` (default, a card that opens it in a new tab) or `'inline'` (the browser's PDF viewer in the page, with the card underneath), `description`, `height` (inline viewer, default `min(80vh, 900px)`) |
| `youtube` / `vimeo` | `url` (paste the link from the Share button; watch, `youtu.be`, Shorts and unlisted Vimeo links all work) or `id`, `poster` (your own thumbnail), `start` (seconds; a YouTube link's own `?t=90` also works), `ratio` (`'9/16'` for Shorts) |

Shared: `caption`, and for search engines `description`, `uploadDate`
(`'2026-03-14'`) and `duration` (`'3:45'` or seconds). See Structured data below.

**YouTube and Vimeo** load as a thumbnail with a play button; the real player
loads only when it's clicked. A normal YouTube embed pulls in over 500KB of
script and sets cookies on page load, for every video, watched or not; here
nothing from YouTube or Vimeo runs until someone presses play, and then it
comes from YouTube's privacy-enhanced domain (`youtube-nocookie.com`) or with
Vimeo's do-not-track flag. The thumbnail is a real link to the video, so it
still works with JavaScript off. YouTube supplies a thumbnail automatically;
set `poster` to use a better frame of your own (and make no request to Google
until the click). **Vimeo has no public thumbnail URL, so give Vimeo videos a
`poster`**, otherwise they show a plain dark panel with the title. Captions
for embeds are turned on in YouTube or Vimeo, not here.

**In a prose page** (`view: 'page'`, and the `content` module), add a `media`
list next to `images`. Placement works the same: `after: N` puts it after
paragraph N, and with both an image and media at the same spot the image comes
first. Layouts: `column` (default, the text width), `full-bleed`,
`float-left` / `float-right` with `size: 'sm' | 'md' | 'lg'`. Floats suit
audio cards and short clips; on phones they stack full-width.

```js
content: {
  title: 'New music',
  body: ['First paragraph…', 'Second…', 'Third…'],
  media: [
    { type: 'video', src: 'studio.mp4', title: 'In the studio', poster: 'studio.jpg', after: 1 },
    { type: 'audio', src: 'single.mp3', title: 'Neon Rain', layout: 'float-right', after: 2 },
  ],
}
```

**As a section,** use the `media` module on the home page or a `rows` page.
`columns: 2` or `3` makes a grid (phones always get one column); a single
audio track or PDF sits at text width instead of stretching:

```js
{ module: 'media', props: {
    eyebrow: 'Music', title: 'Listen', columns: 2, surface: true,
    media: [
      { type: 'audio', src: 'neon-rain.mp3', title: 'Neon Rain', artist: 'Elle Sera', artwork: 'neon-rain.jpg' },
      { type: 'audio', src: 'low-tide.mp3',  title: 'Low Tide',  artist: 'Elle Sera', artwork: 'low-tide.jpg' },
    ] } }
```

**In a `.md` doc or your own component,** use the player directly:
`<MediaEmbed :item="{ type: 'pdf', src: 'rider.pdf', title: 'Tech rider' }" />`
(import from `@/components/media/MediaEmbed.vue`).

**Behaviour.** Starting one video or track pauses any other on the page; an
embedded YouTube/Vimeo video goes back to its thumbnail when something else
starts.
Videos load only their first few KB (duration and size) and audio loads
nothing until play is pressed, so a page of ten players costs about what a
page of ten images does. Inline PDFs show only the link card on phones: most
mobile browsers draw just the first page inside a frame, which looks broken.

**Structured data.** Each video and audio item adds schema.org JSON-LD
(`VideoObject` / `AudioObject`) beside its player, captured into the static
HTML at build time, so search engines know what's on the page. URLs are made
absolute from `VITE_SITE_URL` in `.env.production`. Google only shows a video
in video results when it has a thumbnail and an `uploadDate`, so set
`uploadDate` on videos you want found (YouTube and posters cover the
thumbnail). A Vimeo video without a `poster` gets no structured data.

**Build checks.** The build fails on a missing `title`, an unknown `type`,
layout or `display`, a file whose extension doesn't match its type, captions
that aren't `.vtt` or have no `lang`, a bare filename that isn't in
`src/assets/media/` or `src/assets/images/`, a YouTube/Vimeo link that isn't a
video (a channel page, say), and a malformed `start`, `uploadDate` or
`duration`.

**Preparing files.** Keep video small for the web: H.264 MP4 at 1080p or
720p, `+faststart` so playback starts before the download finishes. With
ffmpeg:

```
ffmpeg -i input.mov -c:v libx264 -crf 23 -preset slow -vf "scale=-2:1080" -c:a aac -b:a 128k -movflags +faststart promo.mp4
```

Anything long or heavily watched belongs on a video host or CDN rather than
your server; point `src` at its URL and add the host to `media-src` in the
CSP (see `deploy/nginx.conf.txt`). Convert `.srt` captions to `.vtt` with any
subtitle tool, or `ffmpeg -i promo.srt promo.en.vtt`.

**Servers.** `deploy/nginx.conf.txt`'s CSP allows `media-src 'self'`, and
`frame-src` allows `'self'` (inline PDFs) plus `youtube-nocookie.com` and
`player.vimeo.com` (embeds). Nginx and Apache both serve
byte ranges for static files, which is what makes seeking work. Captions must
be served as `text/vtt`; `deploy/.htaccess` sets that for Apache, and the
nginx file shows the line to add if an older `mime.types` lacks it.

### Hero video

The hero's `center` and `overlay` variants take a muted, looping background
video. The hero's `image` is its poster: it shows first, the video fades in
over it once playing, and the variant's tint stays on top so the text reads
the same as on a photo.

```js
{ module: 'hero', props: {
    variant: 'overlay',
    title: 'Elle Sera',
    image: 'stage.jpg',   // poster — always set one
    video: 'stage-loop.mp4',
} }
```

Or with options:

```js
video: {
  sources: [{ src: 'stage-loop.webm' }, { src: 'stage-loop.mp4' }], // first one the browser can play
  mobile: 'stage-loop-small.mp4', // a lighter file for phones, or false for the poster only
  focus: 'center 30%',            // what stays in frame when the edges are cropped
}
```

It's built to cost as little as possible:

- **No video at all** (nothing downloaded) for visitors with reduced motion
  turned on, or with Data Saver on, and on phones when `mobile: false`.
- **Loads last**, after the page has finished loading, so it never delays the
  poster, fonts or text.
- **Plays only while on screen**; scrolled past, it pauses.
- **A pause button** in the corner, which accessibility guidelines require for
  motion longer than five seconds.
- **Never in the static HTML.** The build's prerender skips it, so the download
  can't start before those checks run.

**The file.** Short (10–20s, looped), no audio, 720p is plenty under a tint,
and small: aim for under 3–5MB. With ffmpeg, from any longer clip (`-ss` is
where to start, `-t` how long):

```
ffmpeg -ss 00:01:10 -t 15 -i input.mp4 -an -vf "scale=1280:-2" -c:v libx264 -crf 28 -preset slow -movflags +faststart stage-loop.mp4
ffmpeg -ss 00:01:10 -t 15 -i input.mp4 -an -vf "scale=640:-2"  -c:v libx264 -crf 30 -preset slow -movflags +faststart stage-loop-small.mp4
```

`-an` drops the audio track. A WebM version is optional (often smaller):
`-c:v libvpx-vp9 -crf 38 -b:v 0` in place of the `libx264` options, saved as
`.webm`.

YouTube and Vimeo links don't work as backgrounds (their players can't be
styled or kept quiet reliably); download the clip you're allowed to use, trim
it as above, and host the file. The build fails on a YouTube/Vimeo link, a
missing file, or `video` on a variant other than `center` / `overlay`.

## Build & deploy

```
npm run build           # vite build + prerender → outputs to /public
npm run build:staging   # same, using .env.staging
```

Upload `/public` to the host, then set up routing:
- **Apache / Bluehost** — copy `deploy/.htaccess` into the web root.
- **Nginx / Forge** — use the `location` and `error_page` rules in `deploy/nginx.conf.txt`.

Both serve each prerendered page as a plain file and return the site's own
Not Found page (`public/404.html`) with a real 404 status for anything else.
If prerendering can't run on your build machine, each config has a
commented-out fallback that sends unknown paths to the app instead.

### Not Found page

Any URL that isn't a page shows `src/views/NotFoundView.vue`: a large 404 in
the theme's accent, a heading, a button home, and links to the nav's pages.
It's styled only with theme tokens, so it matches whichever theme is active.
The wording is `notFound` in `src/config/site.js`. The build saves it as
`public/404.html` with `noindex`, so search engines don't index broken links.

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
  themes/                  base.css + _tokens.css + 4 themes + registry.js + overrides.css
  modules/                 swappable home sections + registry.js + manifest.js
  modules/pro/              (not in this repo — created by installing lodestar-pro-modules)
  components/              AppNav, AppFooter, ui/ContactForm
  views/                   HomeView, PageView, ContactView, ModuleView, CollectionView, CollectionItemView
  components/SectionRenderer.vue  renders a list of modules (home, module, and collection pages)
  composables/useAssets.js image resolver
deploy/                    .htaccess + nginx snippet
scripts/prerender.mjs     robots.txt + sitemap.xml + per-page prerender (runs after build)
```
