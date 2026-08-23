// ============================================================
// config/footer.js — footer content and layout.
// ============================================================

export const footer = {
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
}
