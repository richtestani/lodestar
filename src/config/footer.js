// ============================================================
// config/footer.js — footer content and layout.
// ============================================================

export const footer = {
  style: 'columns',           // columns | minimal

  // Logo — the image is set in config/site.js (brand.logoImageOnDark, or
  // brand.logoImage); this only controls how it shows here. With no image
  // the columns style shows the brand name as text. Delete for defaults.
  logo: {
    // height:     44,        // px
    // plate:      true,      // light backing plate behind the image. Default: on when
    //                        // using logoImage, off when using logoImageOnDark
    // plateColor: '#ffffff', // plate color
    // withText:   true,      // brand.logoText beside the image
    // show:       false,     // hide the logo in the footer entirely
  },
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
