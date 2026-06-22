// Module registry — maps the `module` name used in site.config.js
// homeSections to its component. Add your own modules here.
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

export const moduleRegistry = {
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
