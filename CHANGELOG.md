# Changelog

All notable changes to Lodestar are documented here.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project aims to follow [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- **Hero layout variants** — `minimal` (text-only), `overlay` (copy on a
  full-bleed image), and `panel` (floating copy card over a contained image),
  alongside the existing `center` and `split`. Set per-instance via the hero
  section's `variant` prop.
- **Gallery layout variants** — `masonry` (staggered heights), `carousel`
  (horizontal swipe strip), and `mosaic` (large first image + tiles), alongside
  the default `grid`. Set per-instance via the gallery section's `variant` prop.

All variants are pure CSS (no new dependencies) and documented in the README
and the reference `site.config.js`.

### Security
- **Hardened deploy configs** — `deploy/.htaccess` and `deploy/nginx.conf.txt`
  now force HTTPS and set security headers: a Content-Security-Policy tuned to
  exactly what the template loads (self-hosted JS/CSS, Google Fonts, the Maps
  embed, the Formspree POST), HSTS, `X-Content-Type-Options`, `Referrer-Policy`,
  frame protection, and a restrictive `Permissions-Policy`.
- **Contact-form honeypot** — `ui/ContactForm.vue` adds an off-screen `_gotcha`
  field; filled submissions are silently dropped client-side and by Formspree.

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

[Unreleased]: https://github.com/richtestani/lodestar/compare/v0.1.0...HEAD
[0.1.0]: https://github.com/richtestani/lodestar/releases/tag/v0.1.0
