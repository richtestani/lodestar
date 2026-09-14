// Module registry — maps the `module` name used in site.config.js
// homeSections (and RowLayout column `modules`) to its component.
// Add your own modules here.
//
// Premium modules aren't part of this repo — a premium package (e.g.
// lodestar-pro-modules) installs into modules/pro/registry.js, and the
// glob below picks it up automatically if that file exists. Nothing
// to wire up by hand, and nothing breaks in projects that never
// install it — import.meta.glob just returns no matches.
//
// pageNav / scrollSpyNav / routerView below are structural, not content
// modules — DocLayout wires these up itself rather than an author
// picking them from a module list, so they're intentionally NOT listed
// in modules/manifest.js's BASE_MODULES. They still need an entry here
// though, since SectionRenderer resolves every module (structural or
// content) through this same registry.
import HeroModule         from './HeroModule.vue'
import FeaturesModule     from './FeaturesModule.vue'
import StatsModule        from './StatsModule.vue'
import TestimonialsModule from './TestimonialsModule.vue'
import GalleryModule      from './GalleryModule.vue'
import MenuModule         from './MenuModule.vue'
import PricingModule      from './PricingModule.vue'
import TeamModule         from './TeamModule.vue'
import FaqModule          from './FaqModule.vue'
import MapModule          from './MapModule.vue'
import ContactModule      from './ContactModule.vue'
import CtaModule          from './CtaModule.vue'
import CollectionGridModule from './CollectionGridModule.vue'
import ItemHeroModule       from './ItemHeroModule.vue'
import ItemDetailModule     from './ItemDetailModule.vue'
import ContentModule        from './ContentModule.vue'

// structural, non-content modules — see note above
import { RouterView } from 'vue-router'
import PageNav       from '@/components/PageNav.vue'
import ScrollSpyNav  from '@/components/ScrollSpyNav.vue'

const baseModuleRegistry = {
  hero:         HeroModule,
  features:     FeaturesModule,
  stats:        StatsModule,
  testimonials: TestimonialsModule,
  gallery:      GalleryModule,
  menu:         MenuModule,
  pricing:      PricingModule,
  team:         TeamModule,
  faq:          FaqModule,
  map:          MapModule,
  contact:      ContactModule,
  cta:          CtaModule,
  collectionGrid: CollectionGridModule,
  itemHero:       ItemHeroModule,
  itemDetail:     ItemDetailModule,
  content:        ContentModule,

  // structural — see note above
  pageNav:      PageNav,
  scrollSpyNav: ScrollSpyNav,
  routerView:   RouterView,
}

// Optional — resolves to {} if modules/pro/registry.js isn't installed.
const proMatches = import.meta.glob('./pro/registry.js', { eager: true })
const proModuleRegistry = Object.values(proMatches)[0]?.proModuleRegistry || {}

export const moduleRegistry = { ...baseModuleRegistry, ...proModuleRegistry }
