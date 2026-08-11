// Module registry — maps the `module` name used in site.config.js
// homeSections to its component. Add your own modules here.
//
// Premium modules aren't part of this repo — a premium package (e.g.
// lodestar-pro-modules) installs into modules/pro/registry.js, and the
// glob below picks it up automatically if that file exists. Nothing
// to wire up by hand, and nothing breaks in projects that never
// install it — import.meta.glob just returns no matches.
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
}

// Optional — resolves to {} if modules/pro/registry.js isn't installed.
const proMatches = import.meta.glob('./pro/registry.js', { eager: true })
const proModuleRegistry = Object.values(proMatches)[0]?.proModuleRegistry || {}

export const moduleRegistry = { ...baseModuleRegistry, ...proModuleRegistry }
