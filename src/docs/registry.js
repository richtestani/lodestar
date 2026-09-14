// Tiny dependency-free frontmatter parser. gray-matter was dropped here —
// it relies on Node's Buffer API, but this file's parsing runs in the
// browser at runtime (not at build time), so gray-matter throws
// "Buffer is not defined". Our frontmatter is simple key: value pairs,
// so a small regex parser covers it without pulling in a Node-oriented lib.
function parseFrontmatter(raw) {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/)
  if (!match) return { data: {}, content: raw }

  const [, frontmatterBlock, content] = match
  const data = {}
  for (const line of frontmatterBlock.split(/\r?\n/)) {
    const lineMatch = line.match(/^(\w+):\s*(.*)$/)
    if (!lineMatch) continue
    const [, key, rawValue] = lineMatch
    const value = rawValue.trim().replace(/^["']|["']$/g, '')
    data[key] = /^\d+$/.test(value) ? Number(value) : value
  }
  return { data, content }
}

// eager: true gives synchronous access at build time — fine for docs,
// there's no need to lazy-load a small, known set of doc pages
const rawFiles = import.meta.glob('/src/content/docs/*.md', {
  eager: true,
  query: '?raw',
  import: 'default',
})

const compiledFiles = import.meta.glob('/src/content/docs/*.md', { eager: true })

function slugFromPath(path) {
  return path.split('/').pop().replace('.md', '')
}

export const docsRegistry = Object.entries(rawFiles)
  .map(([path, raw]) => {
    const { data } = parseFrontmatter(raw)
    const slug = slugFromPath(path)
    return {
      slug,
      path: `/docs/${slug}`,
      title: data.title ?? slug,
      order: data.order ?? 999,
      component: compiledFiles[path].default, // the compiled Vue component
    }
  })
  .sort((a, b) => a.order - b.order)