// useScrollSpy — tracks which of a list of element ids is "current" as the
// page scrolls. Shared by ScrollSpyNav (docs headings) and AppNav (in-page
// links like `/#services`).
//
//   const { activeId } = useScrollSpy(() => ['services', 'approach'], {
//     topOffset: () => 90,  // px hidden under a fixed header (number or fn)
//     keepLast: false,      // keep the last id when none is in the band
//     bottomLast: true,     // at the very bottom, the last id wins
//   })
//
// An id is "in the band" while its element overlaps the area from
// `topOffset` down to 30% of the viewport. The current id is the last one,
// in list order, that's in the band. Ids not on the page are ignored, and
// the observer rebuilds when the list (or the page under it) changes.
import { ref, watch, onMounted, onBeforeUnmount, toValue } from 'vue'

export function useScrollSpy(ids, { topOffset = 0, keepLast = true, bottomLast = false } = {}) {
  const activeId = ref(null)
  const visible = new Set()
  let observer = null
  let list = []

  function pick() {
    if (bottomLast && list.length && atBottom()) {
      const last = [...list].reverse().find((id) => document.getElementById(id))
      if (last) return (activeId.value = last)
    }
    // the lowest one in the band wins: a section whose top has just reached
    // the band beats the one above whose bottom edge is still touching it
    const current = [...list].reverse().find((id) => visible.has(id))
    if (current || !keepLast) activeId.value = current ?? null
  }

  function atBottom() {
    const doc = document.documentElement
    return window.innerHeight + window.scrollY >= doc.scrollHeight - 2
  }

  function setup() {
    observer?.disconnect()
    visible.clear()
    list = [...(toValue(ids) || [])]
    activeId.value = null
    if (!list.length || typeof IntersectionObserver === 'undefined') return

    const top = Math.round(Number(toValue(topOffset)) || 0)
    observer = new IntersectionObserver(
      (entries) => {
        for (const e of entries) e.isIntersecting ? visible.add(e.target.id) : visible.delete(e.target.id)
        pick()
      },
      { rootMargin: `-${top}px 0px -70% 0px` },
    )
    attached.clear()
    attach(observer, performance.now())
  }

  // Observe each id's element. On a first page load the nav can mount before
  // the page's sections exist, so keep looking for missing ones for ~2s.
  const attached = new Set()
  function attach(obs, started) {
    if (obs !== observer) return // a newer setup() replaced this one
    for (const id of list) {
      if (attached.has(id)) continue
      const el = document.getElementById(id)
      if (el) { obs.observe(el); attached.add(id) }
    }
    if (attached.size < list.length && performance.now() - started < 2000) {
      requestAnimationFrame(() => attach(obs, started))
    }
  }

  const onScroll = () => { if (bottomLast) pick() }

  onMounted(() => {
    // flush: 'post' — rebuild after the DOM for a new list/page is in place
    watch(() => [...(toValue(ids) || [])].join('|'), setup, { immediate: true, flush: 'post' })
    if (bottomLast) window.addEventListener('scroll', onScroll, { passive: true })
  })
  onBeforeUnmount(() => {
    observer?.disconnect()
    window.removeEventListener('scroll', onScroll)
  })

  return { activeId, refresh: setup }
}
