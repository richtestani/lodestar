#!/usr/bin/env node
// ============================================================
// scripts/prerender.mjs — runs after `vite build`.
//
//   node scripts/prerender.mjs [mode]     mode: production | staging (default production)
//
// What it does:
//   1. Reads VITE_ROBOTS / VITE_SITE_URL from .env.<mode> and writes
//      public/robots.txt (+ public/sitemap.xml when indexable and a
//      site URL is set).
//   2. Serves the built /public folder locally, visits every route in
//      site.config.js's `pages` list with a real (headless) browser,
//      and writes the fully-rendered HTML to public/<slug>/index.html
//      (public/index.html for the home route). This is what actually
//      makes each page a real crawlable document instead of one empty
//      shell that only fills in after JS runs.
//
// Existing .htaccess / nginx try_files rules already serve a matching
// directory's index.html before falling back to the SPA shell, so
// nothing in /deploy needs to change for this to work. Real visitors
// still get the normal Vue app — it mounts over the prerendered markup
// exactly like it always did.
// ============================================================
import http from 'node:http'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const ROOT = path.dirname(path.dirname(fileURLToPath(import.meta.url)))
const OUT_DIR = path.join(ROOT, 'public')
const mode = process.argv[2] || 'production'

const C = { dim: '\x1b[2m', b: '\x1b[1m', g: '\x1b[32m', y: '\x1b[33m', r: '\x1b[0m' }
const log = (s = '') => process.stdout.write(s + '\n')

// ── tiny .env parser (no dependency — matches Vite's own file names) ──
function readEnv(mode) {
  const file = path.join(ROOT, `.env.${mode}`)
  const out = {}
  if (!fs.existsSync(file)) return out
  for (const line of fs.readFileSync(file, 'utf8').split('\n')) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/i)
    if (m) out[m[1]] = m[2].trim()
  }
  return out
}

// ── robots.txt + sitemap.xml ───────────────────────────────
function writeSeoFiles(routes) {
  const env = readEnv(mode)
  const robots = (env.VITE_ROBOTS || 'index, follow').toLowerCase()
  const indexable = !robots.includes('noindex')
  const siteUrl = (env.VITE_SITE_URL || '').replace(/\/+$/, '')

  let robotsTxt = indexable ? 'User-agent: *\nAllow: /\n' : 'User-agent: *\nDisallow: /\n'
  if (indexable && siteUrl) robotsTxt += `\nSitemap: ${siteUrl}/sitemap.xml\n`
  fs.writeFileSync(path.join(OUT_DIR, 'robots.txt'), robotsTxt)
  log(`${C.g}✓${C.r} public/robots.txt ${C.dim}(${indexable ? 'index, follow' : 'noindex, nofollow'})${C.r}`)

  if (indexable && siteUrl) {
    const today = new Date().toISOString().slice(0, 10)
    const urls = routes.map(r =>
      `  <url>\n    <loc>${siteUrl}${r === '/' ? '/' : r}</loc>\n    <lastmod>${today}</lastmod>\n  </url>`
    ).join('\n')
    const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`
    fs.writeFileSync(path.join(OUT_DIR, 'sitemap.xml'), xml)
    log(`${C.g}✓${C.r} public/sitemap.xml ${C.dim}(${routes.length} routes)${C.r}`)
  } else if (indexable && !siteUrl) {
    log(`${C.y}!${C.r} Skipping sitemap.xml — set VITE_SITE_URL in .env.${mode} to enable it.`)
  } else {
    log(`${C.dim}– sitemap.xml skipped (${mode} is set to noindex)${C.r}`)
  }
}

// ── minimal static file server for the built /public dir ──
const MIME = {
  '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css',
  '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg', '.webp': 'image/webp', '.gif': 'image/gif',
  '.woff2': 'font/woff2', '.woff': 'font/woff', '.ico': 'image/x-icon',
  '.json': 'application/json', '.txt': 'text/plain', '.xml': 'application/xml',
}
function startServer() {
  return new Promise(resolve => {
    const server = http.createServer((req, res) => {
      const urlPath = decodeURIComponent(req.url.split('?')[0])
      let filePath = path.join(OUT_DIR, urlPath)
      if (urlPath.endsWith('/')) filePath = path.join(filePath, 'index.html')
      if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
        // SPA fallback — same behavior as the .htaccess / nginx rules
        filePath = path.join(OUT_DIR, 'index.html')
      }
      const ext = path.extname(filePath)
      res.writeHead(200, { 'Content-Type': MIME[ext] || 'application/octet-stream' })
      fs.createReadStream(filePath).pipe(res)
    })
    server.listen(0, '127.0.0.1', () => resolve(server))
  })
}

// ── find a Chromium-based browser already on this machine ──
// puppeteer.launch() honors PUPPETEER_EXECUTABLE_PATH itself, so a
// custom path always wins. Below that, check common install spots —
// Brave included, since it's Chromium underneath and works exactly
// the same way for headless rendering as Chrome does.
function findLocalBrowser() {
  if (process.env.PUPPETEER_EXECUTABLE_PATH) return process.env.PUPPETEER_EXECUTABLE_PATH
  const home = process.env.HOME || process.env.USERPROFILE || ''
  const candidates = [
    // macOS
    '/Applications/Brave Browser.app/Contents/MacOS/Brave Browser',
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    '/Applications/Chromium.app/Contents/MacOS/Chromium',
    '/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge',
    // Linux
    '/usr/bin/brave-browser', '/usr/bin/brave',
    '/snap/bin/brave',
    '/usr/bin/google-chrome', '/usr/bin/google-chrome-stable',
    '/usr/bin/chromium', '/usr/bin/chromium-browser',
    '/usr/bin/microsoft-edge', '/usr/bin/microsoft-edge-stable',
    // Windows
    'C:\\Program Files\\BraveSoftware\\Brave-Browser\\Application\\brave.exe',
    'C:\\Program Files (x86)\\BraveSoftware\\Brave-Browser\\Application\\brave.exe',
    home && path.join(home, 'AppData\\Local\\BraveSoftware\\Brave-Browser\\Application\\brave.exe'),
    'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
  ].filter(Boolean)
  return candidates.find(p => fs.existsSync(p)) || null
}

// ── crawl each route with a real headless browser ──────────
async function prerenderRoutes(routes, baseUrl) {
  let puppeteer
  try {
    puppeteer = (await import('puppeteer')).default
  } catch {
    log(`${C.y}! puppeteer isn't installed — skipping page prerendering (robots.txt / sitemap.xml were still written).${C.r}`)
    log(`${C.dim}  Run: npm install -D puppeteer${C.r}`)
    return 0
  }

  let browser
  let firstError
  const LAUNCH_ARGS = ['--no-sandbox', '--disable-setuid-sandbox']
  try {
    browser = await puppeteer.launch({ headless: true, args: LAUNCH_ARGS })
  } catch (e) {
    firstError = e
    // Most common real-world failure: puppeteer's own Chrome download
    // got blocked, or the downloaded binary can't run on this machine
    // (macOS Gatekeeper quarantine is a frequent cause). Fall back to
    // whatever Chromium-based browser is already installed — Brave,
    // Chrome, Edge, whatever's found first.
    const localPath = findLocalBrowser()
    if (localPath) {
      try {
        browser = await puppeteer.launch({ headless: true, executablePath: localPath, args: LAUNCH_ARGS })
        log(`${C.dim}(using ${localPath} — puppeteer's own Chrome was unavailable)${C.r}`)
      } catch (e2) {
        firstError = e2
      }
    }
  }
  if (!browser) {
    log(`${C.y}! Couldn't launch a headless browser — skipping page prerendering (robots.txt / sitemap.xml were still written).${C.r}`)
    log(`${C.dim}  ${firstError.message.split('\n')[0]}${C.r}`)
    log(`${C.dim}  No local Chrome/Brave/Chromium/Edge found in the usual install locations.${C.r}`)
    log(`${C.dim}  Point at yours directly (e.g. Brave) and re-run:${C.r}`)
    log(`${C.dim}    macOS:   PUPPETEER_EXECUTABLE_PATH="/Applications/Brave Browser.app/Contents/MacOS/Brave Browser" npm run build${C.r}`)
    log(`${C.dim}    Linux:   PUPPETEER_EXECUTABLE_PATH="$(which brave-browser)" npm run build${C.r}`)
    log(`${C.dim}    Windows: set PUPPETEER_EXECUTABLE_PATH="C:\\Program Files\\BraveSoftware\\Brave-Browser\\Application\\brave.exe" && npm run build${C.r}`)
    return 0
  }
  try {
    for (const route of routes) {
      const page = await browser.newPage()
      await page.goto(baseUrl + route, { waitUntil: 'networkidle0' })
      await page.waitForSelector('#app', { timeout: 5000 }).catch(() => {})
      const html = await page.content()
      const outPath = route === '/'
        ? path.join(OUT_DIR, 'index.html')
        : path.join(OUT_DIR, route.replace(/^\//, ''), 'index.html')
      fs.mkdirSync(path.dirname(outPath), { recursive: true })
      fs.writeFileSync(outPath, html)
      log(`${C.g}✓${C.r} ${route === '/' ? '/' : route + '/'} ${C.dim}→ ${path.relative(ROOT, outPath)}${C.r}`)
      await page.close()
    }
  } finally {
    await browser.close()
  }
  return routes.length
}

// ── catch config/install mismatches before they ship ────────
// A module or nav style referenced in site.config.js that isn't
// actually installed would otherwise silently render nothing (module)
// or silently fall back (nav) — the console.warn in the app only shows
// up if someone happens to open devtools. Fail the build instead.
async function validateModules(site, baseManifest) {
  const { BASE_MODULES, BASE_NAV_STYLES } = baseManifest
  const errors = []

  const proManifestPath = path.join(ROOT, 'src/modules/pro/manifest.js')
  const proInstalled = fs.existsSync(proManifestPath)
  const PRO_MODULES = proInstalled
    ? (await import(pathToFileURL(proManifestPath))).PRO_MODULES || []
    : []

  const usedModules = new Set()
  for (const s of site.homeSections || []) usedModules.add(s.module)
  for (const p of site.pages || []) {
    for (const s of p.sections || []) usedModules.add(s.module)
    for (const s of p.indexSections || []) usedModules.add(s.module)
    for (const s of p.itemSections || []) usedModules.add(s.module)
  }

  for (const name of usedModules) {
    if (BASE_MODULES.includes(name) || PRO_MODULES.includes(name)) continue
    errors.push(proInstalled
      ? `module "${name}" isn't registered in modules/registry.js or the installed lodestar-pro-modules — check the name`
      : `module "${name}" isn't a base module — if it's premium, install lodestar-pro-modules into modules/pro/ (see README)`)
  }

  const navStyle = site.nav?.style
  if (navStyle && navStyle !== 'mega' && !BASE_NAV_STYLES.includes(navStyle)) {
    errors.push(`nav.style "${navStyle}" isn't recognized — expected one of: ${BASE_NAV_STYLES.join(', ')}, mega`)
  }
  if (navStyle === 'mega' && !fs.existsSync(path.join(ROOT, 'src/components/pro/MegaNav.vue'))) {
    errors.push(`nav.style is "mega" but components/pro/MegaNav.vue isn't installed — install lodestar-pro-modules (see README), or use classic/centered/minimal`)
  }

  for (const p of site.pages || []) {
    if (p.view !== 'collection') continue
    const items = p.items || []
    if (!items.length) errors.push(`collection "${p.slug}" has no items — it'll build fine, but /${p.slug} will be an empty listing`)
    const slugs = new Set()
    for (const item of items) {
      if (!item.slug) { errors.push(`collection "${p.slug}" has an item with no slug ("${item.name || '?'}") — every item needs a unique slug`); continue }
      if (slugs.has(item.slug)) errors.push(`collection "${p.slug}" has two items with slug "${item.slug}" — /${p.slug}/${item.slug} would only ever show one of them`)
      slugs.add(item.slug)
    }
  }

  if (errors.length) {
    log(`\n${C.y}${C.b}Config check failed:${C.r}`)
    for (const e of errors) log(`${C.y}  ✗ ${e}${C.r}`)
    log()
    process.exit(1)
  }
}

// ── main ─────────────────────────────────────────────────────
async function main() {
  if (fs.existsSync(path.join(ROOT, '.lodestar-template'))) {
    log(`\n${C.b}✶ Lodestar${C.r} — this is the template repo itself, not a generated project.`)
    log(`${C.dim}Skipping robots.txt / sitemap.xml / page prerendering — that's meaningless here`)
    log(`and only runs for projects setup.mjs creates. \`vite build\` still ran, for a quick`)
    log(`local check of the base scaffold.${C.r}\n`)
    return
  }

  if (!fs.existsSync(OUT_DIR)) {
    log(`${C.y}public/ not found — run "vite build" first.${C.r}`)
    process.exit(1)
  }

  const { site } = await import(pathToFileURL(path.join(ROOT, 'src/site.config.js')))
  const manifest = await import(pathToFileURL(path.join(ROOT, 'src/modules/manifest.js')))
  // Collections expand into one route per page + one per item — this is
  // the one thing that has to happen here rather than in the router:
  // vue-router's :itemSlug stays a genuine pattern (fast to add items,
  // no route-list to maintain by hand), but the crawl/sitemap need real,
  // concrete URLs, not a pattern.
  const rawRoutes = []
  for (const p of site.pages) {
    rawRoutes.push(p.slug ? '/' + p.slug : '/')
    if (p.view === 'collection') for (const item of p.items || []) if (item.slug) rawRoutes.push(`/${p.slug}/${item.slug}`)
  }
  const routes = [...new Set(rawRoutes)]

  log(`\n${C.b}✶ Lodestar${C.r} — prerender ${C.dim}(${mode})${C.r}\n`)

  await validateModules(site, manifest)
  writeSeoFiles(routes)

  const server = await startServer()
  const port = server.address().port
  const prerendered = await prerenderRoutes(routes, `http://127.0.0.1:${port}`)
  server.close()

  log(`\n${C.g}Done.${C.r} ${prerendered} of ${routes.length} route(s) prerendered.\n`)
}

main().catch(e => { console.error(e); process.exit(1) })
