#!/usr/bin/env node
// ============================================================
// Lodestar setup — stamps out a new client site from this template.
//   node setup.mjs           interactive
//   node setup.mjs --yes     non-interactive (defaults + demo content)
// Creates a sibling folder next to this template and writes ready-to-
// edit src/config/* files, the chosen theme, and matching fonts.
// ============================================================
import { createInterface } from 'node:readline/promises'
import { stdin, stdout } from 'node:process'
import { fileURLToPath } from 'node:url'
import fs from 'node:fs'
import path from 'node:path'
import { THEMES as THEME_REGISTRY, DEFAULT_THEME } from './src/themes/registry.js'

const TEMPLATE_DIR = path.dirname(fileURLToPath(import.meta.url))
const AUTO = process.argv.includes('--yes')
const rl = AUTO ? null : createInterface({ input: stdin, output: stdout })

// Colors only on a real terminal, and never when NO_COLOR is set
const COLOR = stdout.isTTY && !process.env.NO_COLOR
const C = COLOR
  ? { dim:'\x1b[2m', b:'\x1b[1m', g:'\x1b[32m', c:'\x1b[36m', y:'\x1b[33m', r:'\x1b[0m' }
  : { dim:'', b:'', g:'', c:'', y:'', r:'' }
const log = (s='') => stdout.write(s + '\n')

// ── Intro banner ────────────────────────────────────────────
// "LodeStar" in pixel letters: every lit pixel prints as ##, with a
// ** drop shadow down-right. "Lode" in cyan, "Star" in gold.
// Edit WELCOME to change the message under it.
const WELCOME = [
  'Welcome to Lodestar, and thanks for building with it.',
  "Let's set up a new site. Press Enter to take the default in (brackets).",
]
const GLYPHS = {
  L:['#...','#...','#...','#...','#...','#...','####'],
  o:['....','....','.##.','#..#','#..#','#..#','.##.'],
  d:['...#','...#','.###','#..#','#..#','#..#','.###'],
  e:['....','....','.##.','#..#','####','#...','.###'],
  S:['.###','#...','#...','.##.','...#','...#','###.'],
  t:['.#.','.#.','###','.#.','.#.','.#.','.##'],
  a:['....','....','.##.','...#','.###','#..#','.###'],
  r:['....','....','#.##','##..','#...','#...','#...'],
}
function banner() {
  const word = 'LodeStar', split = 4            // letters before `split` are "Lode"
  const H = 7
  // grid of cells: 0 empty, 1 = Lode pixel, 2 = Star pixel
  const grid = Array.from({ length: H + 1 }, () => [])
  ;[...word].forEach((ch, i) => {
    const g = GLYPHS[ch]
    for (let r = 0; r <= H; r++) {
      for (let c = 0; c < g[0].length; c++) grid[r].push(r < H && g[r][c] === '#' ? (i < split ? 1 : 2) : 0)
      grid[r].push(0)                            // 1-pixel gap / room for the shadow
    }
  })
  const W = grid[0].length
  const wide = (stdout.columns || 80) >= W * 2 + 2
  const lode = COLOR ? '\x1b[1;36m' : '', star = COLOR ? '\x1b[1;33m' : '', shade = COLOR ? '\x1b[2;37m' : ''

  log()
  for (let r = 0; r <= H; r++) {
    if (!wide && r === H) break                  // compact version has no shadow row
    let line = '', cur = null
    for (let c = 0; c < W; c++) {
      const v = grid[r][c]
      const shadow = wide && !v && r > 0 && c > 0 && grid[r - 1][c - 1]
      const color = v === 1 ? lode : v === 2 ? star : shadow ? shade : ''
      if (color !== cur) { line += (cur ? C.r : '') + color; cur = color }
      line += wide ? (v ? '##' : shadow ? '**' : '  ') : (v ? '#' : ' ')
    }
    log('  ' + (line + (cur ? C.r : '')).replace(/\s+$/, ''))
  }
  log()
  for (const w of WELCOME) log(`  ${C.b}${w}${C.r}`)
  log(`  ${C.dim}${'─'.repeat(Math.min(W * (wide ? 2 : 1), 60))}${C.r}`)
}

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

// ── Theme data (src/themes/registry.js is the source of truth) ──
const THEMES = Object.keys(THEME_REGISTRY)
const THEME_LABELS = THEMES.map(t => `${t.padEnd(Math.max(...THEMES.map(n => n.length)))} — ${THEME_REGISTRY[t].label}`)
const RECOMMENDED = Object.fromEntries(THEMES.map(t => [t, THEME_REGISTRY[t].recommended]))
const NAV_STYLES = ['classic — logo left, links right', 'centered — logo centered', 'minimal — drawer menu always']
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
function toJs(data) { return JSON.stringify(data, null, 2).replace(/^/gm, '  ').trim() }

function genSiteJs(a) {
  const data = {
    brand: { name:a.brandName, tagline:a.tagline, logoText:a.brandName, logoImage:'' },
    theme: a.theme,
    contact: { email:a.email, phone:a.phone, address:a.address, mapQuery:a.address, formspree:a.formspree },
    social: [ {label:'Instagram', url:''}, {label:'Facebook', url:''} ],
    seo: { titleSuffix: ` — ${a.brandName}`, defaultDescription: a.tagline },
  }
  return `// config/site.js — generated by setup.mjs. Edit freely.\n` +
    `export const brand = ${toJs(data.brand)}\n\n` +
    `// Change any time: colors, type and fonts all follow (dev reloads on save).\n` +
    `// Per-site tweaks like an accent color live in src/themes/overrides.css.\n` +
    `export const theme = ${JSON.stringify(data.theme)} // ${THEMES.join(' | ')}\n\n` +
    `export const contact = ${toJs(data.contact)}\n\n` +
    `export const social = ${toJs(data.social)}\n\n` +
    `export const seo = ${toJs(data.seo)}\n`
}

function genNavJs(a) {
  return `// config/nav.js — generated by setup.mjs. Edit freely.\n` +
    `export const nav = ${toJs({ style: a.navStyle, sticky: true, links: null })}\n`
}

function genFooterJs(a, pages) {
  const data = { style:'columns', blurb:a.tagline,
    columns:[ {heading:'Explore', links:pages.map(p => ({label:p.name, to:'/'+p.slug}))} ],
    legal:`© {year} ${a.brandName}. All rights reserved.`, fineprint:'' }
  return `// config/footer.js — generated by setup.mjs. Edit freely.\n` +
    `export const footer = ${toJs(data)}\n`
}

function genHomeJs(a, homeSections) {
  const homePage = { slug:'', name:'Home', view:'home', seo: {
    title: a.tagline ? `${a.brandName} — ${a.tagline}` : a.brandName,
    description: a.tagline,
  }}
  return `// config/home.js — generated by setup.mjs. Edit freely.\n` +
    `// homePage is its pages[]/nav/SEO entry; homeSections is its module list.\n` +
    `export const homePage = ${toJs(homePage)}\n\n` +
    `export const homeSections = ${toJs(homeSections)}\n`
}

function genPageJs(page) {
  return `// config/pages/${page.slug}.js — generated by setup.mjs. Edit freely.\n` +
    `export const page = ${toJs(page)}\n`
}

function genIndexJs(pageEntries) {
  // pageEntries: [{ slug, varName }]
  const imports = pageEntries.map(p => `import { page as ${p.varName} } from './pages/${p.slug}.js'`).join('\n')
  const list = ['homePage', ...pageEntries.map(p => p.varName)].join(', ')
  return `// config/index.js — generated by setup.mjs. Adding a page later?\n` +
    `// Add its file in pages/, then one import + one entry below — see the\n` +
    `// comment in the template's own config/index.js for why this isn't\n` +
    `// auto-discovered (this file loads under plain Node during the build,\n` +
    `// not just Vite, so import.meta.glob isn't usable here).\n` +
    `import { brand, theme, contact, social, seo } from './site.js'\n` +
    `import { nav } from './nav.js'\n` +
    `import { footer } from './footer.js'\n` +
    `import { homePage, homeSections } from './home.js'\n\n` +
    `${imports}\n\n` +
    `export const moduleDefaults = {\n  // add sitewide module defaults here — see config/modules/README.md\n}\n\n` +
    `export const site = {\n` +
    `  brand, theme, contact, social, seo, nav, footer,\n` +
    `  pages: [${list}],\n` +
    `  homeSections,\n` +
    `}\n`
}

// ── Copy template → new project ─────────────────────────────
const SKIP = new Set(['node_modules', '.git', 'public', 'dist', 'setup.mjs', 'README.md', 'package-lock.json', '.lodestar-template'])
function copyTemplate(dest) {
  fs.cpSync(TEMPLATE_DIR, dest, { recursive: true, filter: (src) => {
    const rel = path.relative(TEMPLATE_DIR, src)
    if (!rel) return true
    return !rel.split(path.sep).some(seg => SKIP.has(seg))
  }})
}

// ── Main ────────────────────────────────────────────────────
async function main() {
  banner()
  if (AUTO) log(`  ${C.dim}--yes: using defaults for everything${C.r}`)
  log()

  const projectName = (await ask('Project folder name', 'my-site')).replace(/[^a-z0-9-_]/gi, '-').toLowerCase()
  const brandName   = await ask('Brand / business name', 'Acme Studio')
  const tagline     = await ask('Tagline', 'A short line about what you do.')
  const theme       = THEMES[await askChoice('Pick a base style (you can switch later in src/config/site.js)', THEME_LABELS, Math.max(0, THEMES.indexOf(DEFAULT_THEME)))]
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
  const siteUrl   = (await ask('Production site URL (e.g. https://acmestudio.com)', 'https://example.com')).replace(/\/+$/, '')

  const answers = { projectName, brandName, tagline, theme, navStyle, about, contactPage, modules, email, phone, address, formspree, siteUrl }

  // Write everything
  const dest = path.resolve(TEMPLATE_DIR, '..', projectName)
  if (fs.existsSync(dest)) { log(`\n${C.y}! ${dest} already exists — choose another name.${C.r}`); rl?.close(); return }

  log(`\n${C.dim}Creating ${dest} …${C.r}`)
  copyTemplate(dest)

  // config/ — site.config.js itself is untouched (already the stable
  // one-line re-export, copied as-is by copyTemplate above)
  const s = starters(brandName)
  const homeSections = modules.map(m => ({ module: m, props: s[m] }))
  const pages = []
  if (about) pages.push({ slug:'about', name:'About', view:'page', content:{
    eyebrow:'Our story', title:`About ${brandName}`,
    body:['Tell your story here. Where you started, what you believe, who you serve.','A second paragraph keeps it human. Edit freely in config/pages/about.js.'],
    cta:{ label:'Get in touch', to:'/contact' } } })
  if (contactPage) pages.push({ slug:'contact', name:'Contact', view:'contact' })

  const cfgDir = path.join(dest, 'src/config')
  fs.writeFileSync(path.join(cfgDir, 'site.js'), genSiteJs(answers))
  fs.writeFileSync(path.join(cfgDir, 'nav.js'), genNavJs(answers))
  fs.writeFileSync(path.join(cfgDir, 'footer.js'), genFooterJs(answers, [{slug:'',name:'Home'}, ...pages]))
  fs.writeFileSync(path.join(cfgDir, 'home.js'), genHomeJs(answers, homeSections))
  fs.rmSync(path.join(cfgDir, 'pages'), { recursive: true, force: true })
  fs.mkdirSync(path.join(cfgDir, 'pages'))
  const pageEntries = pages.map(p => ({ slug: p.slug, varName: p.slug + 'Page' }))
  for (const p of pages) fs.writeFileSync(path.join(cfgDir, 'pages', `${p.slug}.js`), genPageJs(p))
  fs.writeFileSync(path.join(cfgDir, 'index.js'), genIndexJs(pageEntries))

  // optional accent override — the theme itself is picked by `theme` in
  // config/site.js (above); overrides.css layers on top of whichever it is
  if (accent && /^#?[0-9a-f]{6}$/i.test(accent)) {
    const hex = accent.startsWith('#') ? accent : '#' + accent
    fs.writeFileSync(path.join(dest, 'src/themes/overrides.css'),
      `/* overrides.css — per-site token tweaks, layered on top of the theme\n` +
      `   chosen in src/config/site.js. These stay when you switch themes;\n` +
      `   delete the block to get the theme's own accent back. */\n` +
      `:root {\n  --primary:    ${hex};\n  --primary-2:  ${darken(hex)};\n  --on-primary: ${onColor(hex)};\n}\n`)
  } else if (accent) {
    log(`${C.y}! "${accent}" isn't a 6-digit hex color — keeping the ${theme} accent.${C.r}`)
  }

  // index.html — title + description (fonts are injected at dev/build
  // time from the theme in config/site.js — see scripts/vite-plugin-theme.mjs)
  const idxPath = path.join(dest, 'index.html')
  let idx = fs.readFileSync(idxPath, 'utf8')
  idx = idx.replace(/<title>.*?<\/title>/, `<title>${brandName}</title>`)
   .replace(/<meta name="description" content=".*?">/, `<meta name="description" content="${tagline.replace(/"/g, '&quot;')}">`)
  fs.writeFileSync(idxPath, idx)

  // .env.production — site URL feeds sitemap.xml + robots.txt at build time
  const envPath = path.join(dest, '.env.production')
  if (fs.existsSync(envPath) && siteUrl) {
    fs.writeFileSync(envPath, fs.readFileSync(envPath, 'utf8')
      .replace(/^VITE_SITE_URL=.*$/m, `VITE_SITE_URL=${siteUrl}`))
  }

  // package.json name
  const pkgPath = path.join(dest, 'package.json')
  const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'))
  pkg.name = projectName; delete pkg.description
  fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + '\n')

  // client README
  fs.writeFileSync(path.join(dest, 'README.md'),
    `# ${brandName}\n\nBuilt from the Lodestar starter.\n\n## Develop\n\n\`\`\`\nnpm install\nnpm run dev\n\`\`\`\n\n` +
    `Edit files in **src/config/** to change content, pages, and the home page ` +
    `(\`site.js\` for brand/contact, \`nav.js\`, \`footer.js\`, \`home.js\`, \`pages/<slug>.js\` for other pages).\n` +
    `Switch the look by changing \`theme\` in **src/config/site.js** (${THEMES.join(', ')}); ` +
    `colors, type and fonts all follow. Per-site tweaks like an accent color go in **src/themes/overrides.css**. ` +
    `Drop images into **src/assets/images/**.\n\n` +
    `## Build & deploy\n\n\`\`\`\nnpm run build   # outputs to /public\n\`\`\`\n\n` +
    `Upload /public to your host. For SPA routing, copy **deploy/.htaccess** (Apache/Bluehost) ` +
    `into the web root, or use the Nginx rule in **deploy/nginx.conf.txt** (Forge/Vultr).\n\n` +
    `The build also writes **robots.txt**, **sitemap.xml**, and a fully-rendered ` +
    `\`index.html\` per page (so search engines see real content, not an empty shell) — ` +
    `no extra step needed. If the domain changes, update \`VITE_SITE_URL\` in **.env.production**.\n`)

  rl?.close()
  log(`\n${C.g}✓ Done.${C.r}\n`)
  log(`${C.b}${projectName}${C.r} created with the ${C.b}${theme}${C.r} theme, ${C.b}${navStyle}${C.r} nav, ${modules.length} home sections.\n`)
  log('Next:')
  log(`  ${C.c}cd ../${projectName}${C.r}`)
  log(`  ${C.c}npm install${C.r}`)
  log(`  ${C.c}npm run dev${C.r}\n`)
  log(`Then edit files in ${C.b}src/config/${C.r} to make it yours.`)
  log(`${C.dim}Changed your mind on the look? Set \`theme\` in src/config/site.js: ${THEMES.join(', ')}.${C.r}\n`)
}

main().catch(e => { console.error(e); rl?.close(); process.exit(1) })
