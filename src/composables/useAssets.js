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

export function asset(ref) {
  if (!ref) return ''
  if (/^(https?:)?\/\//.test(ref) || ref.startsWith('data:')) return ref
  return byName[ref] || ref
}
