/**
 * imageTiming.js - Métricas de performance para imágenes CDN
 * 
 * Captura métricas de carga de imágenes usando Performance API
 * y envía datos agregados via sendBeacon para análisis
 * 
 * @author Indiana Usados
 * @version 1.0.0
 */

// Feature flag para habilitar métricas
const METRICS_ENABLED = import.meta.env.VITE_IMG_METRICS === 'true'

// Configuración de métricas
const METRICS_CONFIG = {
  batchSize: 10, // Enviar cada 10 imágenes
  batchTimeout: 5000, // O cada 5 segundos
  maxPayloadSize: 8192, // 8KB máximo por payload
  rateLimitWindow: 60000, // 1 minuto
  maxRequestsPerWindow: 20, // Máximo 20 requests por minuto
  endpoint: '/metrics/images'
}

// Almacenamiento temporal de métricas
let metricsBuffer = []
let batchTimeout = null

// Control de rate limiting
let requestTimestamps = []

/**
 * Inicializa el sistema de métricas de imágenes
 */
export function initImageMetrics() {
  if (!METRICS_ENABLED) return

  // Observar recursos de Cloudinary
  const observer = new PerformanceObserver((list) => {
    const entries = list.getEntries()
    
    entries.forEach(entry => {
      if (entry.name.includes('res.cloudinary.com')) {
        processImageEntry(entry)
      }
    })
  })

  observer.observe({ entryTypes: ['resource'] })

  // También procesar entradas existentes
  const existingEntries = performance.getEntriesByType('resource')
  existingEntries.forEach(entry => {
    if (entry.name.includes('res.cloudinary.com')) {
      processImageEntry(entry)
    }
  })
}

/**
 * Procesa una entrada de performance de imagen
 * @param {PerformanceResourceTiming} entry - Entrada de performance
 */
function processImageEntry(entry) {
  if (!METRICS_ENABLED) return

  // Extraer información de la URL
  const url = new URL(entry.name)
  const transformPath = url.pathname.split('/').slice(3).join('/') // Remover /image/upload/
  
  // Inferir si viene de caché
  const fromCache = entry.transferSize === 0 || entry.responseStart < 10

  // Extraer información adicional para análisis
  const widthHint = extractWidthFromTransform(transformPath)
  const wasPlaceholder = transformPath.includes('w_24') && transformPath.includes('e_blur')
  const imageRole = inferImageRole(entry, transformPath)
  const route = inferRouteFromReferrer()

  // Crear métrica enriquecida
  const metric = {
    k: hashTransformPath(transformPath), // Hash para privacidad
    ts: Math.round(entry.startTime), // Timestamp
    eb: entry.encodedBodySize, // Encoded body size
    db: entry.decodedBodySize, // Decoded body size
    dur: Math.round(entry.duration), // Duration
    cache: fromCache, // From cache hint
    route, // Ruta lógica
    role: imageRole, // hero/card/thumbnail
    width: widthHint, // Ancho pedido
    placeholder: wasPlaceholder, // Si es placeholder
    format: inferFormatFromUrl(entry.name) // Formato inferido
  }

  metricsBuffer.push(metric)

  // Enviar si alcanzamos el límite
  if (metricsBuffer.length >= METRICS_CONFIG.batchSize) {
    sendMetrics()
  } else {
    // Programar envío por timeout
    scheduleBatchSend()
  }
}

/**
 * Programa el envío de métricas por timeout
 */
function scheduleBatchSend() {
  if (batchTimeout) return

  batchTimeout = setTimeout(() => {
    if (metricsBuffer.length > 0) {
      sendMetrics()
    }
  }, METRICS_CONFIG.batchTimeout)
}

/**
 * Envía métricas agregadas via sendBeacon
 */
function sendMetrics() {
  if (!METRICS_ENABLED || metricsBuffer.length === 0) return

  // Verificar rate limiting
  if (!checkRateLimit()) {
    // Si estamos rate limited, descartar métricas más antiguas
    metricsBuffer = metricsBuffer.slice(-5) // Mantener solo las 5 más recientes
    return
  }

  const payload = {
    t: Math.round(Date.now() / 1000), // Timestamp Unix
    items: [...metricsBuffer] // Copia del buffer
  }

  const payloadString = JSON.stringify(payload)
  
  // Verificar tamaño del payload
  if (payloadString.length > METRICS_CONFIG.maxPayloadSize) {
    // Reducir número de items si el payload es muy grande
    const maxItems = Math.floor(METRICS_CONFIG.maxPayloadSize / (payloadString.length / metricsBuffer.length))
    payload.items = metricsBuffer.slice(-maxItems)
  }

  // Usar sendBeacon para envío no bloqueante
  if (navigator.sendBeacon) {
    navigator.sendBeacon(
      METRICS_CONFIG.endpoint,
      JSON.stringify(payload)
    )
  } else {
    // Fallback para navegadores sin sendBeacon
    fetch(METRICS_CONFIG.endpoint, {
      method: 'POST',
      body: JSON.stringify(payload),
      headers: {
        'Content-Type': 'application/json'
      },
      keepalive: true
    }).catch(() => {
      // Ignorar errores de envío para no afectar UX
    })
  }

  // Registrar timestamp de request para rate limiting
  requestTimestamps.push(Date.now())
  cleanupOldTimestamps()

  // Limpiar buffer y timeout
  metricsBuffer = []
  if (batchTimeout) {
    clearTimeout(batchTimeout)
    batchTimeout = null
  }
}

/**
 * Verifica si podemos enviar request según rate limiting
 * @returns {boolean} - Si podemos enviar
 */
function checkRateLimit() {
  const now = Date.now()
  const windowStart = now - METRICS_CONFIG.rateLimitWindow
  
  // Filtrar timestamps dentro de la ventana
  const recentRequests = requestTimestamps.filter(ts => ts > windowStart)
  
  return recentRequests.length < METRICS_CONFIG.maxRequestsPerWindow
}

/**
 * Limpia timestamps antiguos para rate limiting
 */
function cleanupOldTimestamps() {
  const now = Date.now()
  const windowStart = now - METRICS_CONFIG.rateLimitWindow
  
  requestTimestamps = requestTimestamps.filter(ts => ts > windowStart)
}

/**
 * Obtiene estadísticas actuales de métricas
 * @returns {Object} Estadísticas de métricas
 */
export function getMetricsStats() {
  return {
    enabled: METRICS_ENABLED,
    bufferSize: metricsBuffer.length,
    config: METRICS_CONFIG
  }
}

/**
 * Limpia métricas (para testing)
 */
export function clearMetrics() {
  metricsBuffer = []
  if (batchTimeout) {
    clearTimeout(batchTimeout)
    batchTimeout = null
  }
}

/**
 * Extrae ancho de transformaciones Cloudinary
 * @param {string} transformPath - Path de transformaciones
 * @returns {number|null} - Ancho extraído o null
 */
function extractWidthFromTransform(transformPath) {
  const match = transformPath.match(/w_(\d+)/)
  return match ? parseInt(match[1], 10) : null
}

/**
 * Infiere el rol de la imagen basado en contexto
 * @param {PerformanceResourceTiming} entry - Entrada de performance
 * @param {string} transformPath - Path de transformaciones
 * @returns {string} - Rol de la imagen
 */
function inferImageRole(entry, transformPath) {
  // Hero: imágenes grandes y tempranas
  if (entry.startTime < 1000 && extractWidthFromTransform(transformPath) >= 800) {
    return 'hero'
  }
  // Thumbnail: imágenes pequeñas
  if (extractWidthFromTransform(transformPath) <= 300) {
    return 'thumbnail'
  }
  // Card: resto
  return 'card'
}

/**
 * Infiere la ruta actual desde referrer
 * @returns {string} - Ruta lógica
 */
function inferRouteFromReferrer() {
  const pathname = window.location.pathname
  if (pathname === '/' || pathname === '/home') return 'home'
  if (pathname.includes('/detalle/')) return 'detalle'
  if (pathname.includes('/lista')) return 'lista'
  if (pathname.includes('/admin')) return 'admin'
  return 'other'
}

/**
 * Infiere formato desde URL
 * @param {string} url - URL de la imagen
 * @returns {string} - Formato inferido
 */
function inferFormatFromUrl(url) {
  if (url.includes('f_auto')) return 'auto'
  if (url.includes('.avif')) return 'avif'
  if (url.includes('.webp')) return 'webp'
  if (url.includes('.jpg') || url.includes('.jpeg')) return 'jpeg'
  return 'unknown'
}

/**
 * Hash simple para transformPath (privacidad)
 * @param {string} str - String a hashear
 * @returns {string} - Hash de 8 caracteres
 */
function hashTransformPath(str) {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash // Convertir a 32bit
  }
  return Math.abs(hash).toString(16).substring(0, 8)
}
