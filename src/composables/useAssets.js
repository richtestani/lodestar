// Resolves an image reference to a usable URL.
//  · full URLs (http...) pass through untouched
//  · bare filenames resolve against src/assets/images/ at build time
// Drop client images into src/assets/images/ and reference them by filename
// in site.config.js, e.g. image: 'hero.jpg'.
const files = import.meta.glob('../assets/images/*', { eager: true, query: '?url', import: 'default' })

const byName = {}
for (const path in files) {
  const name = path.split('/').pop()
  byName[name] = files[path]
}

// Dev-only: a bare filename that isn't in src/assets/images/ used to pass
// through silently, 404 in the browser, and leave a module looking "broken"
// with no clue why. Warn once per name instead. Stripped from production
// builds by Vite (import.meta.env.DEV is statically false there).
const warned = new Set()

export function asset(ref) {
  if (!ref) return ''
  if (/^(https?:)?\/\//.test(ref) || ref.startsWith('data:')) return ref
  // Root-relative paths ('/og.png') point at public/ — not ours to check.
  if (ref.startsWith('/')) return ref
  if (byName[ref]) return byName[ref]

  if (import.meta.env.DEV && !warned.has(ref)) {
    warned.add(ref)
    const known = Object.keys(byName)
    console.warn(
      `[lodestar] image "${ref}" isn't in src/assets/images/ — it will 404.\n` +
      `  Add the file there (then restart \`npm run dev\` so the glob picks it up), or use a full URL.\n` +
      `  Available: ${known.length ? known.join(', ') : '(folder is empty)'}`
    )
  }
  return ref
}
