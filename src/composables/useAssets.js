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

// Responsive versions of raster images (vite-imagetools, see vite.config.js).
// Each photo in src/assets/images/ is resized to these widths and converted
// to WebP at build time, so a 5MB phone photo never ships as-is. SVG and GIF
// are left alone. Change the widths (w) here if a site needs bigger banners —
// they must stay a literal string: Vite reads glob options statically.
const sets = import.meta.glob('../assets/images/*.{jpg,jpeg,png,webp,avif,JPG,JPEG,PNG}', {
  eager: true,
  query: '?w=480;960;1600;2400&format=webp&withoutEnlargement&as=srcset',
  import: 'default',
})
const setByName = {}
for (const path in sets) setByName[path.split('/').pop()] = sets[path]

// srcset string for a local raster image, or '' (full URLs, SVGs, unknown
// files). Pair it with a `sizes` attribute describing the rendered width.
export function srcset(ref) {
  return (ref && setByName[ref]) || ''
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
