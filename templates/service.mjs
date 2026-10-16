// ============================================================
// templates/service.mjs — the "service" site template.
//
// A starting point for a company that sells a service or a product
// subscription: a long-scroll home page in the style of modern
// creator-platform / SaaS sites (big centered headline, product shot,
// social-proof numbers, alternating feature rows, testimonials,
// pricing, FAQ, closing CTA), plus the interior pages that kind of
// site needs: Features, Pricing, Customers (case studies), About,
// Contact.
//
// Everything here is built from the stock Lodestar modules — nothing
// template-specific gets copied into the project. setup.mjs writes the
// result into src/config/ exactly like the standard flow, so once a
// site is generated there is no trace of "which template" left to
// maintain: it's just config.
//
// Shape every template exports (see setup.mjs → loadTemplates):
//   name, label         id + one-line pitch shown in setup
//   theme, navStyle     defaults setup offers (both still changeable)
//   nav                 extra keys merged into config/nav.js
//   build({ brandName, tagline }) → { homeSections, homePage, pages, footerColumns }
//     homePage   extra keys merged into the home page entry (e.g. showInNav)
//     pages      array of page objects, written one per file to config/pages/
// ============================================================

const img = (seed, w = 1600, h = 900) => `https://picsum.photos/seed/${seed}/${w}/${h}`

export default {
  name: 'service',
  label: 'service company — long-scroll home, Features / Pricing / Customers / About',
  theme: 'press',
  navStyle: 'classic',
  nav: { cta: { label: 'Get started', to: '/contact' } },

  build({ brandName: brand, tagline }) {

    // ── reusable blocks (used on more than one page) ───────────
    const stats = { module: 'stats', props: { items: [
      { value: '2,400+', label: 'Businesses served' },
      { value: '98%',    label: 'Client retention' },
      { value: '4.9/5',  label: 'Average rating' },
      { value: '<2hrs',  label: 'Support response' },
    ]}}

    const testimonials = { module: 'testimonials', props: {
      eyebrow: 'Customers', title: `Teams who switched to ${brand}`,
      items: [
        { quote: 'We replaced three tools and a spreadsheet. Onboarding took an afternoon, and nobody has asked to go back.', author: 'Jordan Ellis', role: 'Operations Lead, Northwind' },
        { quote: 'The difference is the people. Every question gets a real answer from someone who knows our account.', author: 'Priya Raman', role: 'Founder, Fieldnote' },
        { quote: 'Revenue from repeat clients is up 30% since we moved over. That paid for the next five years.', author: 'Marcus Webb', role: 'Director, Harbor & Co.' },
      ],
    }}

    const pricing = (title = 'Simple pricing that grows with you', eyebrow = 'Pricing') => ({ module: 'pricing', props: {
      eyebrow, title,
      tiers: [
        { name: 'Starter', price: '$29', period: 'mo', cta: { label: 'Start with Starter', to: '/contact' },
          features: ['Everything to get going', 'Up to 3 team members', 'Email support', 'Monthly reporting'] },
        { name: 'Growth', price: '$79', period: 'mo', featured: true, cta: { label: 'Choose Growth', to: '/contact' },
          features: ['Everything in Starter', 'Up to 15 team members', 'Priority support', 'Custom integrations', 'Quarterly strategy call'] },
        { name: 'Scale', price: 'Custom', cta: { label: 'Talk to us', to: '/contact' },
          features: ['Everything in Growth', 'Unlimited team members', 'Dedicated account manager', 'SLA + onboarding'] },
      ],
    }})

    const faq = { module: 'faq', props: {
      eyebrow: 'FAQ', title: 'Questions, answered',
      items: [
        { q: 'How long does it take to get started?', a: 'Most teams are fully set up within a week. We handle the migration and walk your team through everything.' },
        { q: 'Can I change plans later?', a: 'Any time. Upgrades take effect immediately; downgrades apply at the start of your next billing cycle.' },
        { q: 'Is there a contract?', a: 'No long-term contracts. Plans are month to month, and annual billing is optional with a discount.' },
        { q: 'What does support look like?', a: 'Real people, not a ticket queue. Every plan includes email support; Growth and Scale get priority response times.' },
      ],
    }}

    const cta = { module: 'cta', props: {
      title: `Ready to see what ${brand} can do?`,
      text:  'Book a free 20-minute call. No pressure, just a straight answer about whether we fit.',
      cta:   { label: 'Get started', to: '/contact' },
    }}

    // interior page header: stacked with no image = centered title block
    const pageHero = (eyebrow, title, subtitle, primaryCta) => ({ module: 'hero', props: {
      variant: 'stacked', eyebrow, title, subtitle,
      ...(primaryCta ? { primaryCta } : {}),
    }})

    // full-width rows for 'rows'-view pages; flush = sections butt up
    // against each other like they do on the home page
    const rows = (...modules) => modules.map(m => ({ flush: true, modules: [m] }))

    // ── home ───────────────────────────────────────────────────
    const homeSections = [
      { module: 'hero', props: {
          variant:  'stacked',      // centered copy, product shot below
          title:    'Everything your business needs to grow, in one place.',
          subtitle: tagline || `${brand} gives small teams the tools and the people to win more work and keep the clients they have.`,
          image:    img('service-hero', 1920, 1080),
          primaryCta:   { label: 'Get started', to: '/contact' },
          secondaryCta: { label: 'See how it works', to: '/features' },
          note:     'Free consultation · No long-term contracts',
      }},

      stats,

      { module: 'features', props: {
          eyebrow: `Why ${brand}`,
          title:   'Built for teams who would rather be doing the work',
          intro:   'The everyday busywork, handled — so your time goes to clients, not admin.',
          columns: 3,
          items: [
            { icon: '◎', title: 'One place for everything', text: 'Clients, projects, billing and messages live together instead of in five tabs.' },
            { icon: '↗', title: 'Grows with you',           text: 'Start small and add people, locations and services without starting over.' },
            { icon: '✦', title: 'Looks like you',            text: 'Your brand on every page, invoice and email your customers see.' },
            { icon: '⌁', title: 'Fast by default',           text: 'Pages load instantly and work on any device, even on a weak signal.' },
            { icon: '◈', title: 'Secure and backed up',      text: 'Encrypted, monitored, and backed up every night. Your data stays yours.' },
            { icon: '☏', title: 'Humans on call',            text: 'A real person who knows your account, a message away.' },
          ],
      }},

      { module: 'features', props: {
          variant: 'rows',          // alternating image + copy
          items: [
            { label: 'Win work', title: 'Turn interest into booked clients',
              text:  'Clear service pages, instant quotes and online booking mean fewer back-and-forth emails and more signed jobs.',
              points: ['Online booking and quotes', 'Automatic follow-ups', 'Works on every device'],
              image: img('service-row-1', 1200, 900), cta: { label: 'Explore features', to: '/features' } },
            { label: 'Keep clients', title: 'Give every customer a great experience',
              text:  'A private portal for each client with their history, files and invoices — so they never have to ask twice.',
              points: ['Client portal', 'Shared files and approvals', 'Branded emails'],
              image: img('service-row-2', 1200, 900), cta: { label: 'See customer stories', to: '/customers' } },
            { label: 'Get paid', title: 'Billing that runs itself',
              text:  'Recurring invoices, card and bank payments, and reminders that go out on their own. Cash flow stops being a chore.',
              points: ['Recurring billing', 'Card + ACH payments', 'Real-time reporting'],
              image: img('service-row-3', 1200, 900), cta: { label: 'Compare plans', to: '/pricing' } },
          ],
      }},

      testimonials,
      pricing(),
      faq,
      cta,
    ]

    // ── interior pages ─────────────────────────────────────────
    const featuresPage = {
      slug: 'features', name: 'Features', view: 'rows',
      seo: { title: `Features — ${brand}`, description: `Everything ${brand} does, in one place.` },
      rows: rows(
        pageHero('Features', 'All the tools. None of the busywork.',
          `A closer look at how ${brand} helps you win work, keep clients and get paid.`,
          { label: 'Get started', to: '/contact' }),
        { module: 'features', props: {
            variant: 'rows',
            items: [
              { label: 'Booking', title: 'Let clients book themselves',
                text: 'Share a link or embed it on your site. Availability, reminders and rescheduling are all handled for you.',
                points: ['Live availability', 'SMS + email reminders', 'Buffer times and limits'], image: img('feat-1', 1200, 900) },
              { label: 'Projects', title: 'Every job, start to finish',
                text: 'Track tasks, files and conversations per client so nothing slips through the cracks when the team gets busy.',
                points: ['Task boards', 'File sharing', 'Internal notes'], image: img('feat-2', 1200, 900) },
              { label: 'Reporting', title: 'Know where the business stands',
                text: 'Revenue, utilization and pipeline on one screen — updated live, exportable whenever your accountant asks.',
                points: ['Live dashboards', 'Scheduled reports', 'CSV export'], image: img('feat-3', 1200, 900) },
            ],
        }},
        { module: 'features', props: {
            eyebrow: 'And more', title: 'The details that add up', columns: 3,
            items: [
              { icon: '⌘', title: 'Integrations', text: 'Connects to the accounting, calendar and email tools you already use.' },
              { icon: '◐', title: 'Custom branding', text: 'Your logo, colors and domain on everything customers see.' },
              { icon: '⇅', title: 'Import anything', text: 'Bring clients and history over from spreadsheets or another system.' },
              { icon: '☰', title: 'Roles + permissions', text: 'Decide exactly who sees and edits what across your team.' },
              { icon: '✉', title: 'Email templates', text: 'Write it once, send it every time — personalized automatically.' },
              { icon: '◇', title: 'Audit log', text: 'A full history of who changed what, and when.' },
            ],
        }},
        cta,
      ),
    }

    const pricingPage = {
      slug: 'pricing', name: 'Pricing', view: 'rows',
      seo: { title: `Pricing — ${brand}`, description: `Plans for every stage of your business. No long-term contracts.` },
      rows: rows(
        pageHero('Pricing', 'Simple, transparent pricing.', 'Month to month, no setup fees, cancel any time. Every plan starts with a free consultation.'),
        pricing('Pick the plan that fits today', ''),
        { module: 'features', props: {
            eyebrow: 'Every plan', title: 'Included no matter what', columns: 3,
            items: [
              { icon: '✓', title: 'Free migration', text: 'We move your existing clients and data over for you.' },
              { icon: '✓', title: 'Unlimited clients', text: 'No per-client fees, ever. Grow without watching a meter.' },
              { icon: '✓', title: 'Real support', text: 'People who know your account, not a chatbot.' },
            ],
        }},
        faq,
        cta,
      ),
    }

    const customersPage = {
      slug: 'customers', name: 'Customers', view: 'collection',
      seo: { title: `Customers — ${brand}`, description: `How businesses like yours grow with ${brand}.` },
      indexSections: [
        pageHero('Customers', 'Businesses that grew with us.', `Real teams, real numbers. Here's what changed after they moved to ${brand}.`),
        { module: 'collectionGrid', props: { eyebrow: 'Case studies', title: 'Customer stories' } },
        stats,
        cta,
      ],
      itemSections: [
        { module: 'itemHero' },
        { module: 'itemDetail' },
        cta,
      ],
      // `price` renders as the highlighted line under each name — here
      // it carries each story's headline result
      items: [
        { slug: 'northwind', name: 'Northwind Logistics', price: '3× faster onboarding',
          tagline: 'How a 40-person team replaced three tools in a week.',
          image: img('case-northwind', 1200, 900),
          description: [
            'Northwind was running scheduling, billing and client messages in three separate systems, with a spreadsheet stitching them together.',
            `After moving to ${brand}, new clients go from signed contract to first job in two days instead of six — and the spreadsheet is gone.`,
          ],
          meta: [ { label: 'Industry', value: 'Logistics' }, { label: 'Team size', value: '40' }, { label: 'Plan', value: 'Scale' } ],
          cta: { label: 'Get results like this', to: '/contact' } },
        { slug: 'fieldnote', name: 'Fieldnote Studio', price: '+30% repeat revenue',
          tagline: 'A design studio that turned one-off projects into retainers.',
          image: img('case-fieldnote', 1200, 900),
          description: [
            'Fieldnote did great work, but most clients left after a single project.',
            'The client portal and recurring billing made it easy to offer ongoing retainers — within a year, a third of revenue was recurring.',
          ],
          meta: [ { label: 'Industry', value: 'Design' }, { label: 'Team size', value: '8' }, { label: 'Plan', value: 'Growth' } ],
          cta: { label: 'Get results like this', to: '/contact' } },
        { slug: 'harbor-co', name: 'Harbor & Co.', price: '12 hrs/week saved',
          tagline: 'Getting the owner out of the inbox and back on the job.',
          image: img('case-harbor', 1200, 900),
          description: [
            'Harbor\'s owner spent every evening answering scheduling emails and chasing invoices.',
            'Self-serve booking and automatic reminders now handle most of it. That\'s twelve hours a week back — and fewer missed payments.',
          ],
          meta: [ { label: 'Industry', value: 'Home services' }, { label: 'Team size', value: '5' }, { label: 'Plan', value: 'Starter' } ],
          cta: { label: 'Get results like this', to: '/contact' } },
      ],
    }

    const aboutPage = {
      slug: 'about', name: 'About', view: 'rows',
      seo: { title: `About — ${brand}`, description: `The people and the principles behind ${brand}.` },
      rows: rows(
        pageHero('About us', 'Small businesses deserve great tools too.',
          `${brand} started because the software we needed was built for companies a hundred times our size. So we built our own — and now we share it.`),
        stats,
        { module: 'features', props: {
            eyebrow: 'What we believe', title: 'How we work', columns: 3,
            items: [
              { icon: '①', title: 'Plain answers', text: 'No jargon, no upsell scripts. If we are not the right fit, we will say so.' },
              { icon: '②', title: 'Built to last', text: 'We would rather do fewer things properly than ship everything at once.' },
              { icon: '③', title: 'People first', text: 'Software helps. People make the difference. You will always reach a human.' },
            ],
        }},
        { module: 'team', props: {
            eyebrow: 'The team', title: 'The people you will talk to',
            members: [1, 2, 3, 4].map(i => ({ name: 'Full Name', role: 'Role / Title', image: img(`svc-team-${i}`, 400, 400), bio: 'One line about this person.' })),
        }},
        cta,
      ),
    }

    // Reached from the nav button and every CTA, so it stays out of the
    // nav links (it still gets a real URL and sitemap entry)
    const contactPage = { slug: 'contact', name: 'Contact', view: 'contact', showInNav: false }

    return {
      homeSections,
      // the logo already links home, so Home stays out of the nav links
      homePage: { showInNav: false },
      pages: [featuresPage, pricingPage, customersPage, aboutPage, contactPage],
      footerColumns: [
        { heading: 'Product', links: [
          { label: 'Features',  to: '/features' },
          { label: 'Pricing',   to: '/pricing' },
          { label: 'Customers', to: '/customers' },
        ]},
        { heading: 'Company', links: [
          { label: 'About',   to: '/about' },
          { label: 'Contact', to: '/contact' },
        ]},
      ],
    }
  },
}
