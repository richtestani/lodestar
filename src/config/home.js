// ============================================================
// config/home.js — the home page. Kept separate from
// config/pages/ (rather than folded in as just another page)
// because it works a little differently: `homePage` is its
// pages[]/nav/SEO entry, and `homeSections` is its own
// top-level list, the same shape `sections` takes on a
// 'sections'-view page — see modules/registry.js for the
// available module names.
// ============================================================

export const homePage = {
  slug: '', name: 'Home', view: 'home', seo: {
    title:       'Dovetail & Co. — Considered goods for everyday rituals.',
    description: 'Small-batch homewares, made by hand and built to last.',
  },
}

// Reorder, remove, or duplicate freely. Each entry's `props` is the
// content for that section. Available modules: hero, features, stats,
// gallery, testimonials, menu, pricing, team, faq, map, contact, cta.
// Premium modules (e.g. parallax) become available automatically once
// lodestar-pro-modules is installed into modules/pro/ — see README.
export const homeSections = [

  { module: 'hero', props: {
      variant:  'center',      // center | split | minimal | overlay | panel
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
      variant: 'grid',         // grid | masonry | carousel | mosaic
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

]
