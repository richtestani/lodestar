// ============================================================
// config/pages/shop.js — a 'collection' page: one listing page
// (indexSections) + one detail page per item (itemSections), from a
// single items[] list. Router generates exactly two routes regardless
// of how many items there are: /shop and /shop/:itemSlug.
//
// Only `slug` and `name` are required per item — everything else
// (price, tagline, image, description, meta, cta) is read by the
// collectionGrid/itemHero/itemDetail modules if present, ignored if
// not. None of it is retail-specific despite the shop example: a team
// page would use the same shape with name/role/bio instead.
// ============================================================

export const page = {
  slug: 'shop', name: 'Shop', view: 'collection',
  seo: { title: 'Shop — Dovetail & Co.', description: 'Small-batch homewares, made to order.' },

  indexSections: [
    { module: 'collectionGrid', props: { eyebrow: 'The Collection', title: 'Shop everything', groupBy: 'category' } },
  ],
  itemSections: [
    { module: 'itemHero' },
    { module: 'itemDetail' },
  ],

  items: [
    { slug: 'ceramic-mug', name: 'Ceramic Mug', price: '$28', category: 'Kitchen',
      tagline: 'Hand-thrown stoneware, glazed in small batches.',
      image: 'https://picsum.photos/seed/mug/1200/900',
      description: [
        'Each mug is thrown by hand on the wheel, so no two are exactly alike — expect small variations in glaze and shape.',
        'Holds 12oz. Dishwasher and microwave safe.',
      ],
      meta: [ { label: 'Material', value: 'Stoneware' }, { label: 'Capacity', value: '12oz' } ],
      cta: { label: 'Get in touch to order', to: '/contact' },
    },
    { slug: 'linen-napkins', name: 'Linen Napkin Set', price: '$44', category: 'Textiles',
      tagline: 'A set of four, stonewashed for softness.',
      image: 'https://picsum.photos/seed/napkins/1200/900',
      description: 'Pure linen, stonewashed for a soft hand-feel that only gets better with washing. Set of four.',
      meta: [ { label: 'Material', value: '100% linen' }, { label: 'Set size', value: '4 napkins' } ],
      cta: { label: 'Get in touch to order', to: '/contact' },
    },
    { slug: 'cutting-board', name: 'Walnut Cutting Board', price: '$85', category: 'Kitchen',
      tagline: 'End-grain walnut, oiled and ready to use.',
      image: 'https://picsum.photos/seed/board/1200/900',
      description: 'Solid walnut, end-grain construction for durability. Finished with food-safe mineral oil — re-oil every month or so with regular use.',
      meta: [ { label: 'Material', value: 'Walnut' }, { label: 'Size', value: '16" x 10"' } ],
      cta: { label: 'Get in touch to order', to: '/contact' },
    },
	  { slug: 'chrome-cutting-board', name: 'Chrome Cutting Board', price: '$85', category: 'Dining',
	    tagline: 'End-grain walnut, oiled and ready to use.',
	    image: 'https://picsum.photos/seed/board/1200/900',
	    description: 'Solid walnut, end-grain construction for durability. Finished with food-safe mineral oil — re-oil every month or so with regular use.',
	    meta: [ { label: 'Material', value: 'Walnut' }, { label: 'Size', value: '16" x 10"' } ],
	    cta: { label: 'Get in touch to order', to: '/contact' },
	  },
  ],
}
