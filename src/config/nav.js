// ============================================================
// config/nav.js — navigation bar: style, links, and (if you're
// using lodestar-pro-modules) mega-nav settings.
// ============================================================

export const nav = {
  style:  'classic',          // classic | centered | minimal | mega (mega needs lodestar-pro-modules installed — see README)
  sticky: true,

  // Shared across every style (classic/centered/minimal/mega):
  // hoverBg:      '#f4efe6',        // link background on hover — omit for transparent
  // hoverText:    '#c0392b',        // link text color on hover — omit to use the theme's --primary
  // bgImage:      'nav-texture.jpg',// optional background image behind the whole nav bar
  // iconPosition: 'left',           // 'left' | 'right' — where a link's icon (if it has one) sits

  // Mega only (ignored by classic/centered/minimal):
  // trigger:    'click',   // 'click' | 'hover' — 'hover' only applies when overlay is true (see below)
  // overlay:    true,      // true = panel floats over the page; false = pushes content down inline
  // megaLayout: 'wide',    // 'wide' | 'stacked' — panel shape; grouping (below) is independent of this

  // Links are derived from pages (config/home.js + config/pages/*.js) if
  // left null, but you can override here. Any link — top-level or nested
  // — can carry an `icon` (resolved the same way module images are, via
  // src/assets/images/).
  //
  // For the 'mega' style, a top-level link can carry `children` in
  // either shape — your choice per link, not decided automatically:
  //   flat:    a plain list of links, no headings
  //   grouped: links broken into headed columns/sections — use this
  //            only when it genuinely helps (e.g. a furniture site's
  //            "Our Collection" split into Couches / Tables / etc.,
  //            each with its own sub-items). Most dropdowns don't need it.
  //
  //   links: [
  //     { label: 'Our Collection', to: '/collection', icon: 'sofa.svg', children: [
  //       // grouped — array of { heading?, links: [...] }
  //       { heading: 'Couches', links: [
  //         { label: 'Sofa', to: '/collection/sofa' },
  //         { label: 'Love Seat', to: '/collection/loveseat' },
  //         { label: 'Ottoman', to: '/collection/ottoman' },
  //         { label: 'Recliner', to: '/collection/recliner' },
  //       ]},
  //       { heading: 'Tables', links: [
  //         { label: 'Kitchen', to: '/collection/kitchen' },
  //         { label: 'Dining', to: '/collection/dining' },
  //         { label: 'Bedside', to: '/collection/bedside' },
  //       ]},
  //     ]},
  //     { label: 'Shop', to: '/shop', children: [
  //       // flat — plain array of links, no headings
  //       { label: 'Tableware', to: '/shop/tableware' },
  //       { label: 'Linens',    to: '/shop/linens' },
  //     ]},
  //     { label: 'About', to: '/about' },
  //   ],
  links:  null,
}
