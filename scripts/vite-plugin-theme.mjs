// ============================================================
// vite-plugin-theme.mjs — makes `theme` in src/config/site.js the
// one place a site's look is chosen.
//
//   • `import 'virtual:lodestar-theme.css'` (in main.js) resolves to
//     src/themes/<theme>.css
//   • the <!-- LODESTAR:FONTS --> block in index.html is rewritten with
//     that theme's Google Fonts link (from src/themes/registry.js)
//   • in dev, editing `theme` in site.js reloads the page with the new
//     theme and fonts, no restart needed
//   • a theme name with no matching .css file stops the build (and
//     shows the error overlay in dev) instead of silently doing nothing
// ============================================================
import fs from 'node:fs'
import path from 'node:path'
import { pathToFileURL } from 'node:url'

const VIRTUAL_ID = 'virtual:lodestar-theme.css'
// Files in src/themes/ that aren't selectable themes
const NOT_THEMES = new Set(['base', 'overrides'])

export default function lodestarTheme() {
  let root, siteFile, themesDir, logger
  let theme = null     // current theme name from site.js
  let problem = null   // error message when the theme can't be used

  const available = () => fs.readdirSync(themesDir)
    .filter(f => f.endsWith('.css') && !f.startsWith('_'))
    .map(f => f.slice(0, -4))
    .filter(n => !NOT_THEMES.has(n))

  const themeFile = (name) => path.join(themesDir, `${name}.css`)

  // site.js is plain ESM with no imports (the prerender step already
  // loads config/ under plain Node), so importing it is safe. The query
  // string busts Node's module cache so edits are picked up in dev.
  async function readTheme() {
    try {
      const mod = await import(pathToFileURL(siteFile).href + `?t=${Date.now()}`)
      return { name: mod.theme }
    } catch (err) {
      return { error: `couldn't load src/config/site.js to read the theme: ${err.message}` }
    }
  }

  async function refresh() {
    const { name, error } = await readTheme()
    if (error) { problem = error; return }
    theme = name
    if (typeof name !== 'string' || !name) {
      problem = `src/config/site.js must export a theme name, e.g. export const theme = 'north'. Available: ${available().join(', ')}`
    } else if (NOT_THEMES.has(name) || name.startsWith('_') || !fs.existsSync(themeFile(name))) {
      problem = `theme "${name}" (src/config/site.js) has no src/themes/${name}.css. Available: ${available().join(', ')}`
    } else {
      problem = null
    }
  }

  async function fontsFor(name) {
    const reg = await import(pathToFileURL(path.join(themesDir, 'registry.js')).href + `?t=${Date.now()}`)
    return reg.THEMES?.[name]?.fonts || null
  }

  return {
    name: 'lodestar-theme',

    configResolved(config) {
      root = config.root
      siteFile = path.join(root, 'src/config/site.js')
      themesDir = path.join(root, 'src/themes')
      logger = config.logger
    },

    async buildStart() {
      await refresh()
      if (problem) {
        if (this.meta?.watchMode) logger.error(`[lodestar] ${problem}`)
        else this.error(problem)
      }
    },

    resolveId(id) {
      if (id !== VIRTUAL_ID) return null
      if (problem) throw new Error(`[lodestar] ${problem}`)
      return themeFile(theme)
    },

    async transformIndexHtml(html) {
      if (problem || !theme) return html
      const fonts = await fontsFor(theme)
      if (!fonts) return html
      return html.replace(
        /<!-- LODESTAR:FONTS -->[\s\S]*?<!-- LODESTAR:FONTS:END -->/,
        `<!-- LODESTAR:FONTS -->\n    <link href="${fonts}" rel="stylesheet">\n    <!-- LODESTAR:FONTS:END -->`,
      )
    },

    configureServer(server) {
      const onChange = async (file) => {
        const f = path.resolve(file)
        const newThemeFile = problem && path.dirname(f) === themesDir && f.endsWith('.css')
        if (f !== siteFile && f !== path.join(themesDir, 'registry.js') && !newThemeFile) return
        const before = `${theme}|${problem}`
        await refresh()
        if (f === siteFile && `${theme}|${problem}` === before) return
        if (problem) logger.error(`[lodestar] ${problem}`)
        else logger.info(`[lodestar] theme → ${theme}`, { timestamp: true })
        // The theme import is resolved once per module; drop the cache
        // so main.js re-resolves it, then reload for the new fonts too.
        const graph = server.environments?.client?.moduleGraph || server.moduleGraph
        graph.invalidateAll()
        const hot = server.environments?.client?.hot || server.ws
        hot.send({ type: 'full-reload' })
      }
      server.watcher.on('change', onChange)
      server.watcher.on('add', onChange)
    },
  }
}
