// ============================================================
// themes/registry.js — metadata for the built-in themes.
//
// The theme itself is just tokens in src/themes/<name>.css (see
// _tokens.css for the contract). This file holds what CSS can't:
// the Google Fonts <link> each theme needs, its one-line pitch, and
// the home sections setup.mjs suggests for it.
//
// Read by setup.mjs and by scripts/vite-plugin-theme.mjs (which
// injects `fonts` into index.html for whichever theme config/site.js
// names). Plain ESM with no imports, so plain Node can load it.
//
// Adding your own theme: drop src/themes/<name>.css next to the
// others, set `theme: '<name>'` in config/site.js, and add an entry
// here if it needs different fonts. A theme with no entry here still
// works; it just keeps whatever fonts are in index.html.
// ============================================================

export const THEMES = {
  north: {
    label: 'simple & modular, works for anything (clean light, cobalt accent)',
    fonts: 'https://fonts.googleapis.com/css2?family=Hanken+Grotesk:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500&family=Space+Mono:wght@400;700&display=swap',
    recommended: ['hero', 'features', 'stats', 'gallery', 'testimonials', 'faq', 'cta'],
  },
  fresh: {
    label: 'service / trades / professional (light + blue)',
    fonts: 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Lora:ital@0;1&display=swap',
    recommended: ['hero', 'features', 'stats', 'testimonials', 'faq', 'map', 'cta'],
  },
  pulse: {
    label: 'tech / SaaS / startup (deep slate + indigo)',
    fonts: 'https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Inter:wght@300;400;500;600&display=swap',
    recommended: ['hero', 'features', 'stats', 'pricing', 'testimonials', 'faq', 'cta'],
  },
  harvest: {
    label: 'food / restaurant / cafe (warm + serif)',
    fonts: 'https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,600;1,9..144,400&family=Karla:wght@300;400;500;600;700&display=swap',
    recommended: ['hero', 'features', 'menu', 'gallery', 'testimonials', 'map', 'cta'],
  },
}

export const DEFAULT_THEME = 'north'
