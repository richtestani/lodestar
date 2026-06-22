// ============================================================
// site.config.js — THE definition of this site.
// Edit this one file (in TextMate, with comments) to change
// brand, theme, navigation, pages, footer, and the home page.
// `node setup.mjs` generates this from your answers; after that,
// everything below is fair game to hand-tune.
// ============================================================

export const site = {

  // ── BRAND ───────────────────────────────────────────────
  brand: {
    name:      'Dovetail & Co.',
    tagline:   'Considered goods for everyday rituals.',
    logoText:  'Dovetail',     // text logo (used when logoImage is empty)
    logoImage: '',              // optional: a filename in src/assets/images/
  },

  // ── THEME ───────────────────────────────────────────────
  // Visual identity lives in src/themes/<theme>.css. setup.mjs writes
  // the matching font <link> into index.html and points active.css here.
  theme: 'north',               // north | fresh | pulse | harvest

  // ── BUSINESS INFO (feeds footer, contact form, map) ─────
  contact: {
    email:    'hello@dovetail.co',
    phone:    '(555) 016-2200',
    address:  '48 Harbor Lane, Beaufort, NC 28516',
    mapQuery: '48 Harbor Lane, Beaufort, NC',   // used by the map module
    formspree:'',               // paste your https://formspree.io/f/xxxx endpoint
  },

  social: [
    { label: 'Instagram', url: 'https://instagram.com' },
    { label: 'Facebook',  url: 'https://facebook.com' },
  ],

  // ── NAVIGATION ──────────────────────────────────────────
  nav: {
    style:  'classic',          // classic | centered | minimal
    sticky: true,
    // Links are derived from `pages` below, but you can override here.
    links:  null,
  },

  // ── PAGES (drives the router) ───────────────────────────
  // view: 'home' | 'contact' | 'page'
  pages: [
    { slug: '',        name: 'Home',    view: 'home' },
    { slug: 'about',   name: 'About',   view: 'page', content: {
        eyebrow: 'Our Story',
        title:   'Made by hand, on the coast',
        body: [
          'Dovetail began in a small workshop with a simple belief — that the things we use every day deserve to be made with care.',
          'We design and produce in small batches, choosing materials that age well and partners who share our standards.',
          'Whether it is a gift or something for your own table, we want it to mean a little more.',
        ],
        cta: { label: 'Get in touch', to: '/contact' },
    }},
    { slug: 'contact', name: 'Contact', view: 'contact' },
  ],

  // ── HOME PAGE — ordered list of modules ─────────────────
  // Reorder, remove, or duplicate freely. Each entry's `props` is the
  // content for that section. Available modules: hero, features, stats,
  // gallery, testimonials, menu, pricing, team, faq, map, contact, cta.
  homeSections: [

    { module: 'hero', props: {
        variant:  'center',      // center | split
        eyebrow:  'Dovetail & Co.',
        title:    'Considered goods for everyday rituals.',
        subtitle: 'Small-batch homewares, made by hand and built to last.',
        image:    'https://picsum.photos/seed/dovetail-hero/1600/900',
        primaryCta:   { label: 'Shop the collection', to: '/about' },
        secondaryCta: { label: 'Our story',           to: '/about' },
    }},

    { module: 'features', props: {
        eyebrow: 'Why Dovetail',
        title:   'Small details, done properly',
        columns: 3,
        items: [
          { icon: '✦', title: 'Made in small batches', text: 'Limited runs mean every piece gets real attention, not a production line.' },
          { icon: '◈', title: 'Materials that age well', text: 'Solid woods, natural fibers, and finishes that look better with use.' },
          { icon: '❖', title: 'Designed to be used', text: 'Beautiful is good. Beautiful and useful every single day is better.' },
        ],
    }},

    { module: 'stats', props: {
        items: [
          { value: '12yrs', label: 'On the coast' },
          { value: '40+',   label: 'Makers & partners' },
          { value: '9k',    label: 'Homes served' },
          { value: '100%',  label: 'Made to order' },
        ],
    }},

    { module: 'gallery', props: {
        eyebrow: 'The Collection',
        title:   'A look at recent work',
        images: [
          { src: 'https://picsum.photos/seed/nw1/800/800', alt: 'Ceramic mugs' },
          { src: 'https://picsum.photos/seed/nw2/800/800', alt: 'Linen napkins' },
          { src: 'https://picsum.photos/seed/nw3/800/800', alt: 'Cutting board' },
          { src: 'https://picsum.photos/seed/nw4/800/800', alt: 'Glassware' },
          { src: 'https://picsum.photos/seed/nw5/800/800', alt: 'Woven basket' },
          { src: 'https://picsum.photos/seed/nw6/800/800', alt: 'Brass utensils' },
        ],
    }},

    { module: 'testimonials', props: {
        eyebrow: 'Kind Words',
        title:   'What people say',
        items: [
          { quote: 'The craftsmanship is genuinely a step above. These pieces have become the ones we reach for first.', author: 'Maren H.', role: 'Beaufort, NC' },
          { quote: 'Gave a set as a wedding gift and got a phone call about it. That never happens.', author: 'Daniel P.', role: 'Repeat customer' },
          { quote: 'You can feel the difference the moment you pick something up. Worth every penny.', author: 'Priya N.', role: 'Designer' },
        ],
    }},

    { module: 'map', props: {
        eyebrow: 'Visit',
        title:   'Find the workshop',
        hours: [
          { day: 'Mon – Fri', time: '9am – 5pm' },
          { day: 'Saturday',  time: '10am – 4pm' },
          { day: 'Sunday',    time: 'Closed' },
        ],
    }},

    { module: 'faq', props: {
        eyebrow: 'Good to Know',
        title:   'Questions, answered',
        items: [
          { q: 'How long does an order take?', a: 'Most made-to-order pieces ship within two to three weeks. We will always confirm a timeline before you pay.' },
          { q: 'Do you ship nationwide?', a: 'Yes. Flat-rate shipping across the continental US, with options at checkout for everywhere else.' },
          { q: 'Can I commission something custom?', a: 'Often, yes. Send us a note through the contact page with what you have in mind.' },
        ],
    }},

    { module: 'cta', props: {
        title: 'Ready to bring something home?',
        text:  'Browse the collection or reach out about a custom commission.',
        cta:   { label: 'Get in touch', to: '/contact' },
    }},

  ],

  // ── FOOTER ──────────────────────────────────────────────
  footer: {
    style: 'columns',           // columns | minimal
    blurb: 'Considered goods for everyday rituals, made by hand on the North Carolina coast.',
    columns: [
      { heading: 'Explore', links: [
        { label: 'Home',    to: '/' },
        { label: 'About',   to: '/about' },
        { label: 'Contact', to: '/contact' },
      ]},
    ],
    legal: '© {year} Dovetail & Co. All rights reserved.',
    fineprint: '',
  },
}
