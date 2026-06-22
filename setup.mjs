#!/usr/bin/env node
// ============================================================
// Lodestar setup — stamps out a new client site from this template.
//   node setup.mjs           interactive
//   node setup.mjs --yes     non-interactive (defaults + demo content)
// Creates a sibling folder next to this template and writes a ready-to-
// edit src/site.config.js, the chosen theme, and matching fonts.
// ============================================================
import { createInterface } from 'node:readline/promises'
import { stdin, stdout } from 'node:process'
import { fileURLToPath } from 'node:url'
import fs from 'node:fs'
import path from 'node:path'

const TEMPLATE_DIR = path.dirname(fileURLToPath(import.meta.url))
const AUTO = process.argv.includes('--yes')
const rl = AUTO ? null : createInterface({ input: stdin, output: stdout })

const C = { dim:'\x1b[2m', b:'\x1b[1m', g:'\x1b[32m', c:'\x1b[36m', y:'\x1b[33m', r:'\x1b[0m' }
const log = (s='') => stdout.write(s + '\n')

async function ask(q, def='') {
  if (AUTO) return def
  const a = (await rl.question(`${C.c}${q}${C.r}${def ? C.dim+' ('+def+')'+C.r : ''}: `)).trim()
  return a || def
}
async function askYN(q, defYes=true) {
  if (AUTO) return defYes
  const a = (await ask(q + (defYes ? ' [Y/n]' : ' [y/N]'))).toLowerCase()
  if (!a) return defYes
  return a.startsWith('y')
}
async function askChoice(q, options, def=0) {
  if (AUTO) return def
  log(`\n${C.c}${q}${C.r}`)
  options.forEach((o, i) => log(`  ${C.b}${i + 1}${C.r}. ${o}`))
  const a = (await ask('Choose', String(def + 1)))
  const n = parseInt(a, 10)
  return Number.isInteger(n) && n >= 1 && n <= options.length ? n - 1 : def
}

// ── Theme data ──────────────────────────────────────────────
const THEMES = ['north', 'fresh', 'pulse', 'harvest']
const THEME_LABELS = [
  'north   — simple & modular, works for anything (clean light, cobalt accent)',
  'fresh   — service / trades / professional (light + blue)',
  'pulse   — tech / SaaS / startup (deep slate + indigo)',
  'harvest — food / restaurant / cafe (warm + serif)',
]
const FONT_LINKS = {
  north:   'https://fonts.googleapis.com/css2?family=Hanken+Grotesk:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500&family=Space+Mono:wght@400;700&display=swap',
  fresh:   'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Lora:ital@0;1&display=swap',
  pulse:   'https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Inter:wght@300;400;500;600&display=swap',
  harvest: 'https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,600;1,9..144,400&family=Karla:wght@300;400;500;600;700&display=swap',
}
const NAV_STYLES = ['classic — logo left, links right', 'centered — logo centered', 'minimal — drawer menu always']
const RECOMMENDED = {
  north:   ['hero', 'features', 'stats', 'gallery', 'testimonials', 'faq', 'cta'],
  fresh:   ['hero', 'features', 'stats', 'testimonials', 'faq', 'map', 'cta'],
  pulse:   ['hero', 'features', 'stats', 'pricing', 'testimonials', 'faq', 'cta'],
  harvest: ['hero', 'features', 'menu', 'gallery', 'testimonials', 'map', 'cta'],
}
const ALL_MODULES = ['hero','features','stats','testimonials','gallery','menu','pricing','team','faq','map','contact','cta']

// ── Color helpers (for optional accent override) ────────────
function darken(hex, amt = 0.14) {
  const n = parseInt(hex.replace('#', ''), 16)
  let r = (n >> 16) & 255, g = (n >> 8) & 255, b = n & 255
  r = Math.round(r * (1 - amt)); g = Math.round(g * (1 - amt)); b = Math.round(b * (1 - amt))
  return '#' + [r, g, b].map(v => v.toString(16).padStart(2, '0')).join('')
}
function onColor(hex) {
  const n = parseInt(hex.replace('#', ''), 16)
  const r = (n >> 16) & 255, g = (n >> 8) & 255, b = n & 255
  const lum = (0.299 * r + 0.587 * g + 0.114 * b) / 255
  return lum > 0.6 ? '#10100f' : '#ffffff'
}

// ── Module starter content (so the generated site renders) ──
function starters(brand) {
  return {
    hero: { variant:'center', eyebrow:brand, title:'A clear headline about what you do.', subtitle:'One sentence that says who it is for and why it matters.', image:'https://picsum.photos/seed/hero/1600/900', primaryCta:{label:'Get started',to:'/contact'}, secondaryCta:{label:'Learn more',to:'/about'} },
    features: { eyebrow:'Why us', title:'What we do well', columns:3, items:[
      {icon:'✦', title:'First benefit', text:'Describe a concrete thing you do better than anyone else.'},
      {icon:'◈', title:'Second benefit', text:'Keep it specific and customer-facing, not internal jargon.'},
      {icon:'❖', title:'Third benefit', text:'Three is plenty for a glance; add more items if you need them.'},
    ]},
    stats: { items:[ {value:'10yrs', label:'In business'}, {value:'500+', label:'Happy clients'}, {value:'24/7', label:'Support'}, {value:'100%', label:'Satisfaction'} ]},
    testimonials: { eyebrow:'Kind words', title:'What clients say', items:[
      {quote:'A short, specific quote beats a long vague one. Swap these for real ones.', author:'Client Name', role:'Title / Company'},
      {quote:'Mention a result or a feeling. Real names build trust.', author:'Client Name', role:'Title / Company'},
      {quote:'Three quotes fill the row nicely on desktop.', author:'Client Name', role:'Title / Company'},
    ]},
    gallery: { eyebrow:'Our work', title:'Recent highlights', images:[1,2,3,4,5,6].map(i => ({ src:`https://picsum.photos/seed/g${i}/800/800`, alt:'Replace with your image' })) },
    menu: { eyebrow:'Menu', title:'A taste of what we offer', groups:[
      {name:'Starters', items:[ {name:'Dish name', desc:'A few words about it.', price:'$9'}, {name:'Dish name', desc:'A few words about it.', price:'$11'} ]},
      {name:'Mains', items:[ {name:'Dish name', desc:'A few words about it.', price:'$18'}, {name:'Dish name', desc:'A few words about it.', price:'$22'} ]},
    ]},
    pricing: { eyebrow:'Pricing', title:'Simple, honest plans', tiers:[
      {name:'Starter', price:'$0', period:'mo', features:['Feature one','Feature two','Feature three'], cta:{label:'Choose',to:'/contact'}},
      {name:'Pro', price:'$29', period:'mo', featured:true, features:['Everything in Starter','Feature four','Feature five'], cta:{label:'Choose',to:'/contact'}},
      {name:'Team', price:'$79', period:'mo', features:['Everything in Pro','Feature six','Priority support'], cta:{label:'Choose',to:'/contact'}},
    ]},
    team: { eyebrow:'Our team', title:'The people behind it', members:[1,2,3].map(i => ({ name:'Full Name', role:'Role / Title', image:`https://picsum.photos/seed/t${i}/400/400`, bio:'One line about this person.' })) },
    faq: { eyebrow:'Good to know', title:'Frequently asked', items:[
      {q:'A common question?', a:'A clear, friendly answer in your own voice.'},
      {q:'Another one?', a:'Keep answers short; link out for detail when needed.'},
      {q:'And a third?', a:'FAQs cut down on repetitive emails. Use real ones.'},
    ]},
    map: { eyebrow:'Visit', title:'Find us', hours:[ {day:'Mon – Fri', time:'9am – 5pm'}, {day:'Saturday', time:'10am – 4pm'}, {day:'Sunday', time:'Closed'} ]},
    contact: { eyebrow:'Get in touch', title:'Send us a note', text:'We usually reply within one business day.' },
    cta: { title:'Ready to get started?', text:'A short nudge toward the one action you want visitors to take.', cta:{label:'Get in touch',to:'/contact'} },
  }
}

// ── Serialize the config ────────────────────────────────────
function buildConfig(a) {
  const s = starters(a.brandName)
  const homeSections = a.modules.map(m => ({ module: m, props: s[m] }))
  const pages = [{ slug:'', name:'Home', view:'home' }]
  if (a.about) pages.push({ slug:'about', name:'About', view:'page', content:{
    eyebrow:'Our story', title:`About ${a.brandName}`,
    body:['Tell your story here. Where you started, what you believe, who you serve.','A second paragraph keeps it human. Edit freely in site.config.js.'],
    cta:{ label:'Get in touch', to:'/contact' } } })
  if (a.contactPage) pages.push({ slug:'contact', name:'Contact', view:'contact' })

  const data = {
    brand: { name:a.brandName, tagline:a.tagline, logoText:a.brandName, logoImage:'' },
    theme: a.theme,
    contact: { email:a.email, phone:a.phone, address:a.address, mapQuery:a.address, formspree:a.formspree },
    social: [ {label:'Instagram', url:''}, {label:'Facebook', url:''} ],
    nav: { style:a.navStyle, sticky:true, links:null },
    pages,
    homeSections,
    footer: { style:'columns', blurb:a.tagline,
      columns:[ {heading:'Explore', links:pages.map(p => ({label:p.name, to:'/'+p.slug}))} ],
      legal:`© {year} ${a.brandName}. All rights reserved.`, fineprint:'' },
  }
  const json = JSON.stringify(data, null, 2).replace(/^/gm, '  ').trim()
  return `// ============================================================\n` +
         `// site.config.js — generated by setup.mjs. Edit freely.\n` +
         `// One file defines brand, theme, nav, pages, footer, and the\n` +
         `// home page (homeSections). See the template README for the\n` +
         `// full field reference and the list of available modules.\n` +
         `// ============================================================\n\n` +
         `export const site = ${json}\n`
}

// ── Copy template → new project ─────────────────────────────
const SKIP = new Set(['node_modules', '.git', 'public', 'dist', 'setup.mjs', 'README.md', 'package-lock.json'])
function copyTemplate(dest) {
  fs.cpSync(TEMPLATE_DIR, dest, { recursive: true, filter: (src) => {
    const rel = path.relative(TEMPLATE_DIR, src)
    if (!rel) return true
    return !rel.split(path.sep).some(seg => SKIP.has(seg))
  }})
}

// ── Main ────────────────────────────────────────────────────
async function main() {
  log(`\n${C.b}✶ Lodestar${C.r} — new site setup${AUTO ? C.dim + ' (--yes)' + C.r : ''}\n`)

  const projectName = (await ask('Project folder name', 'my-site')).replace(/[^a-z0-9-_]/gi, '-').toLowerCase()
  const brandName   = await ask('Brand / business name', 'Acme Studio')
  const tagline     = await ask('Tagline', 'A short line about what you do.')
  const theme       = THEMES[await askChoice('Pick a base style', THEME_LABELS, 0)]
  const navStyle    = ['classic','centered','minimal'][await askChoice('Navigation style', NAV_STYLES, 0)]

  let accent = ''
  if (!AUTO && await askYN(`Override the ${theme} accent color?`, false)) {
    accent = await ask('Accent hex (e.g. #c0392b)', '')
  }

  const about       = await askYN('Include an About page?', true)
  const contactPage = await askYN('Include a Contact page?', true)

  let modules = RECOMMENDED[theme]
  if (!AUTO && !await askYN(`Use the recommended home sections for "${theme}" (${RECOMMENDED[theme].join(', ')})?`, true)) {
    log(`\nAvailable modules: ${ALL_MODULES.join(', ')}`)
    const raw = await ask('List the ones you want, in order (comma-separated)', RECOMMENDED[theme].join(','))
    modules = raw.split(',').map(s => s.trim()).filter(m => ALL_MODULES.includes(m))
    if (!modules.length) modules = RECOMMENDED[theme]
  }

  const email     = await ask('Contact email', 'hello@example.com')
  const phone     = await ask('Phone', '(555) 555-5555')
  const address   = await ask('Address', '123 Main St, Town, ST')
  const formspree = await ask('Formspree endpoint (optional)', '')

  const answers = { projectName, brandName, tagline, theme, navStyle, about, contactPage, modules, email, phone, address, formspree }

  // Write everything
  const dest = path.resolve(TEMPLATE_DIR, '..', projectName)
  if (fs.existsSync(dest)) { log(`\n${C.y}! ${dest} already exists — choose another name.${C.r}`); rl?.close(); return }

  log(`\n${C.dim}Creating ${dest} …${C.r}`)
  copyTemplate(dest)

  // site.config.js
  fs.writeFileSync(path.join(dest, 'src/site.config.js'), buildConfig(answers))

  // active theme (+ optional accent override)
  let active = `/* active theme — set by setup.mjs. Re-point to switch. */\n@import './${theme}.css';\n`
  if (accent && /^#?[0-9a-f]{6}$/i.test(accent)) {
    const hex = accent.startsWith('#') ? accent : '#' + accent
    active += `\n:root {\n  --primary: ${hex};\n  --primary-2: ${darken(hex)};\n  --on-primary: ${onColor(hex)};\n}\n`
  }
  fs.writeFileSync(path.join(dest, 'src/themes/active.css'), active)

  // index.html — fonts + title
  const idxPath = path.join(dest, 'index.html')
  let idx = fs.readFileSync(idxPath, 'utf8')
  idx = idx.replace(
    /<!-- LODESTAR:FONTS -->[\s\S]*?<!-- LODESTAR:FONTS:END -->/,
    `<!-- LODESTAR:FONTS -->\n    <link href="${FONT_LINKS[theme]}" rel="stylesheet">\n    <!-- LODESTAR:FONTS:END -->`
  ).replace(/<title>.*?<\/title>/, `<title>${brandName}</title>`)
  fs.writeFileSync(idxPath, idx)

  // package.json name
  const pkgPath = path.join(dest, 'package.json')
  const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'))
  pkg.name = projectName; delete pkg.description
  fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + '\n')

  // client README
  fs.writeFileSync(path.join(dest, 'README.md'),
    `# ${brandName}\n\nBuilt from the Lodestar starter.\n\n## Develop\n\n\`\`\`\nnpm install\nnpm run dev\n\`\`\`\n\n` +
    `Edit **src/site.config.js** to change content, pages, and the home page.\n` +
    `Switch the look in **src/themes/active.css**. Drop images into **src/assets/images/**.\n\n` +
    `## Build & deploy\n\n\`\`\`\nnpm run build   # outputs to /public\n\`\`\`\n\n` +
    `Upload /public to your host. For SPA routing, copy **deploy/.htaccess** (Apache/Bluehost) ` +
    `into the web root, or use the Nginx rule in **deploy/nginx.conf.txt** (Forge/Vultr).\n`)

  rl?.close()
  log(`\n${C.g}✓ Done.${C.r}\n`)
  log(`${C.b}${projectName}${C.r} created with the ${C.b}${theme}${C.r} theme, ${C.b}${navStyle}${C.r} nav, ${modules.length} home sections.\n`)
  log('Next:')
  log(`  ${C.c}cd ../${projectName}${C.r}`)
  log(`  ${C.c}npm install${C.r}`)
  log(`  ${C.c}npm run dev${C.r}\n`)
  log(`Then edit ${C.b}src/site.config.js${C.r} to make it yours.\n`)
}

main().catch(e => { console.error(e); rl?.close(); process.exit(1) })
