// Only one Lodestar player plays at a time: starting a video, track or
// embedded YouTube/Vimeo video stops whatever else is playing.
//
// Native <video>/<audio>: one capture-phase listener on the document
// covers every player (media `play` events don't bubble, but they do pass
// through the capture phase). Embeds can't be paused from outside without
// loading each site's player API, so an active embed registers a stop()
// that swaps it back to its thumbnail — which also frees the iframe.
let installed = false
const embeds = new Set()

function pauseNative(except) {
  for (const el of document.querySelectorAll('[data-lodestar-player]')) {
    if (el !== except && !el.paused) el.pause()
  }
}

function stopEmbeds(except) {
  for (const stop of embeds) if (stop !== except) stop()
}

export function useSinglePlayback() {
  if (installed || typeof document === 'undefined') return
  installed = true
  document.addEventListener('play', (e) => {
    const started = e.target
    if (!started?.hasAttribute?.('data-lodestar-player')) return
    pauseNative(started)
    stopEmbeds()
  }, true)
}

// Called by an embed when it starts. Returns a cleanup for when it stops
// or unmounts.
export function claimPlayback(stop) {
  if (typeof document !== 'undefined') pauseNative()
  stopEmbeds(stop)
  embeds.add(stop)
  return () => embeds.delete(stop)
}
