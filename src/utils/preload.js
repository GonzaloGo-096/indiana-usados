/**
 * preload.js - Utilidades para preloads inteligentes (idle-aware, network-aware)
 */

export function shouldPreloadOnIdle() {
  try {
    const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection
    if (connection) {
      if (connection.saveData) return false
      const slowTypes = ['slow-2g', '2g']
      if (slowTypes.includes(connection.effectiveType)) return false
    }
  } catch (_) {}
  return true
}

export function requestIdle(callback, { timeout = 2000 } = {}) {
  const ric = typeof window !== 'undefined' && window.requestIdleCallback
  if (typeof ric === 'function') {
    return ric(callback, { timeout })
  }
  return setTimeout(callback, Math.min(timeout, 1000))
}



