/**
 * generateSitemap.js - Generador de sitemap dinámico mejorado
 * 
 * Genera sitemap.xml incluyendo:
 * - Páginas estáticas (home, vehiculos, nosotros, postventa)
 * - Vehículos dinámicos (desde API)
 * 
 * Mejoras:
 * - Usa configuración centralizada de SEO
 * - Normaliza URLs de imágenes
 * - Maneja paginación completa
 * - Valida datos antes de procesar
 * 
 * Uso:
 * 1. Como script: node src/utils/seo/generateSitemap.js
 * 2. Como endpoint: Crear ruta en backend que llame a esta función
 * 
 * @author Indiana Usados
 * @version 2.1.0 - Logger con detección de ambiente (browser/Node.js)
 */

// Helper para logging compatible con browser y Node.js
// Nota: Este archivo puede ejecutarse en Node.js (serverless), donde el logger del browser
// no está disponible. Usamos logger cuando está disponible, console.error como fallback
const logError = (message, error) => {
  const errorDetails = error instanceof Error 
    ? { message: error.message, stack: error.stack }
    : error
  
  // Intentar usar logger si está disponible (browser)
  // Primero verificar logger global (si fue asignado en main.jsx)
  if (typeof window !== 'undefined' && window.logger && typeof window.logger.error === 'function') {
    window.logger.error('sitemap', message, errorDetails)
    return
  }
  
  // Fallback para Node.js o cuando logger no está disponible
  // Usar formato consistente con logger para mantener uniformidad
  const timestamp = new Date().toISOString()
  console.error(`[${timestamp}] ERROR [sitemap] ${message}:`, errorDetails)
}

/**
 * Obtiene configuración del sitemap (compatible con Node.js y browser)
 */
const getSitemapConfig = () => {
  // En Node.js (serverless functions)
  if (typeof process !== 'undefined' && process.env) {
    return {
      siteUrl: process.env.VITE_SITE_URL || process.env.VERCEL_URL 
        ? `https://${process.env.VERCEL_URL}` 
        : 'https://indianausados.com',
      staticPages: {
        '/': { changefreq: 'daily', priority: '1.0' },
        '/vehiculos': { changefreq: 'daily', priority: '0.9' },
        '/nosotros': { changefreq: 'monthly', priority: '0.6' },
        '/postventa': { changefreq: 'monthly', priority: '0.8' }
      },
      vehicles: {
        changefreq: 'weekly',
        priority: '0.8'
      },
      maxVehiclesPerSitemap: 50000
    }
  }
  
  // En browser, intentar importar configuración centralizada
  // (fallback si no está disponible)
  return {
    siteUrl: 'https://indianausados.com',
    staticPages: {
      '/': { changefreq: 'daily', priority: '1.0' },
      '/vehiculos': { changefreq: 'daily', priority: '0.9' },
      '/nosotros': { changefreq: 'monthly', priority: '0.6' },
      '/postventa': { changefreq: 'monthly', priority: '0.8' }
    },
    vehicles: {
      changefreq: 'weekly',
      priority: '0.8'
    },
    maxVehiclesPerSitemap: 50000
  }
}

const SITEMAP_CONFIG = getSitemapConfig()

/**
 * Genera fecha en formato ISO 8601 (YYYY-MM-DD)
 */
const getCurrentDate = () => {
  return new Date().toISOString().split('T')[0]
}

/**
 * Escapa caracteres especiales para XML
 */
const escapeXml = (str) => {
  if (!str) return ''
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

/**
 * Normaliza URL de imagen para sitemap (debe ser absoluta)
 * Versión inline para compatibilidad con Node.js (no puede usar import dinámico fácilmente)
 * 
 * Nota: En browser, se podría importar desde @utils/seo/normalizeImageUrl
 * pero para mantener compatibilidad con Node.js, usamos versión inline
 */
const normalizeImageUrl = (imageUrl, siteUrl = SITEMAP_CONFIG.siteUrl) => {
  if (!imageUrl) return null
  
  // Si es objeto con URL, extraer la URL
  if (typeof imageUrl === 'object' && imageUrl?.url) {
    imageUrl = imageUrl.url
  }
  
  // Si ya es URL absoluta (http/https), usar directamente
  if (typeof imageUrl === 'string' && (imageUrl.startsWith('http://') || imageUrl.startsWith('https://'))) {
    return imageUrl
  }
  
  // Si es relativa, convertir a absoluta
  if (typeof imageUrl === 'string' && imageUrl.startsWith('/')) {
    return `${siteUrl}${imageUrl}`
  }
  
  // Si es string pero no empieza con /, asumir que es relativa
  if (typeof imageUrl === 'string') {
    return `${siteUrl}/${imageUrl}`
  }
  
  return null
}

/**
 * Valida que un vehículo tenga datos mínimos para incluir en sitemap
 */
const isValidVehicle = (vehicle) => {
  if (!vehicle || typeof vehicle !== 'object') return false
  
  const id = vehicle.id || vehicle._id
  if (!id) return false
  
  // Al menos debe tener marca o modelo para ser válido
  const marca = vehicle.marca || ''
  const modelo = vehicle.modelo || ''
  
  return marca.trim() !== '' || modelo.trim() !== ''
}

/**
 * Genera entrada de URL para el sitemap
 */
const generateUrlEntry = (url, options = {}) => {
  const {
    lastmod = getCurrentDate(),
    changefreq = 'weekly',
    priority = '0.5',
    images = []
  } = options

  const fullUrl = url.startsWith('http') ? url : `${SITEMAP_CONFIG.siteUrl}${url}`
  
  // Usar array y join para mejor performance
  const parts = []
  parts.push(`  <url>`)
  parts.push(`    <loc>${escapeXml(fullUrl)}</loc>`)
  parts.push(`    <lastmod>${lastmod}</lastmod>`)
  parts.push(`    <changefreq>${changefreq}</changefreq>`)
  parts.push(`    <priority>${priority}</priority>`)
  
  // Agregar imágenes si existen (máximo 5 recomendado por Google)
  const validImages = images
    .map(img => normalizeImageUrl(img))
    .filter(Boolean)
    .slice(0, 5) // Máximo 5 imágenes por URL
  
  validImages.forEach(imageUrl => {
    parts.push(`    <image:image>`)
    parts.push(`      <image:loc>${escapeXml(imageUrl)}</image:loc>`)
    parts.push(`    </image:image>`)
  })
  
  parts.push(`  </url>`)
  return parts.join('\n')
}

/**
 * Genera sitemap completo
 * 
 * @param {Array} vehicles - Array de vehículos (opcional, para generación dinámica)
 * @param {Object} options - Opciones adicionales
 * @param {string} options.siteUrl - URL del sitio (override)
 * @returns {string} XML del sitemap
 */
export const generateSitemap = (vehicles = [], options = {}) => {
  const siteUrl = options.siteUrl || SITEMAP_CONFIG.siteUrl
  const currentDate = getCurrentDate()
  
  // Validar que vehicles sea un array
  const vehiclesList = Array.isArray(vehicles) ? vehicles : []
  
  // Filtrar vehículos válidos
  const validVehicles = vehiclesList.filter(isValidVehicle)
  
  // Limitar cantidad de vehículos (Google recomienda max 50,000 por sitemap)
  const limitedVehicles = validVehicles.slice(0, SITEMAP_CONFIG.maxVehiclesPerSitemap)
  
  // Usar array para mejor performance
  const xmlParts = []
  
  // Header del XML
  xmlParts.push(`<?xml version="1.0" encoding="UTF-8"?>`)
  xmlParts.push(`<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"`)
  xmlParts.push(`        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"`)
  xmlParts.push(`        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"`)
  xmlParts.push(`        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9`)
  xmlParts.push(`        http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">`)
  xmlParts.push('')
  
  // Páginas estáticas
  Object.entries(SITEMAP_CONFIG.staticPages).forEach(([path, config]) => {
    xmlParts.push(generateUrlEntry(path, {
      lastmod: currentDate,
      changefreq: config.changefreq,
      priority: config.priority
    }))
    xmlParts.push('')
  })
  
  // Vehículos dinámicos
  limitedVehicles.forEach(vehicle => {
    const vehicleId = vehicle.id || vehicle._id
    if (!vehicleId) return
    
    const vehicleUrl = `/vehiculo/${vehicleId}`
    const vehicleImages = []
    
    // Agregar imagen principal si existe
    if (vehicle.fotoPrincipal) {
      vehicleImages.push(vehicle.fotoPrincipal)
    }
    
    // Agregar imágenes extras (máximo 4 más para llegar a 5 total)
    if (vehicle.fotosExtras && Array.isArray(vehicle.fotosExtras)) {
      const maxExtras = 5 - vehicleImages.length
      vehicle.fotosExtras.slice(0, maxExtras).forEach(img => {
        if (img) vehicleImages.push(img)
      })
    }
    
    // Usar fecha de actualización del vehículo si existe
    let lastmod = currentDate
    if (vehicle.updatedAt) {
      try {
        const updateDate = new Date(vehicle.updatedAt)
        if (!isNaN(updateDate.getTime())) {
          lastmod = updateDate.toISOString().split('T')[0]
        }
      } catch (e) {
        // Si hay error parseando fecha, usar fecha actual
        lastmod = currentDate
      }
    }
    
    xmlParts.push(generateUrlEntry(vehicleUrl, {
      lastmod,
      changefreq: SITEMAP_CONFIG.vehicles.changefreq,
      priority: SITEMAP_CONFIG.vehicles.priority,
      images: vehicleImages
    }))
  })
  
  // Footer del XML
  xmlParts.push(`</urlset>`)
  
  return xmlParts.join('\n')
}

/**
 * Obtiene todos los vehículos paginando si es necesario
 * 
 * @param {Function} fetchVehicles - Función que retorna promesa con vehículos
 * @param {Object} options - Opciones
 * @param {number} options.limitPerPage - Límite por página (default: 100)
 * @returns {Promise<Array>} Array completo de vehículos
 */
const fetchAllVehicles = async (fetchVehicles, options = {}) => {
  const { limitPerPage = 100 } = options
  const allVehicles = []
  let cursor = 1
  let hasMore = true
  
  try {
    while (hasMore && allVehicles.length < SITEMAP_CONFIG.maxVehiclesPerSitemap) {
      const response = await fetchVehicles({ limit: limitPerPage, cursor })
      
      // Extraer vehículos de la respuesta (diferentes estructuras posibles)
      let vehicles = []
      if (response?.allPhotos?.docs) {
        vehicles = response.allPhotos.docs
        hasMore = response.allPhotos.hasNextPage || false
        cursor = response.allPhotos.nextPage || cursor + 1
      } else if (response?.data) {
        vehicles = Array.isArray(response.data) ? response.data : []
        hasMore = false // Asumir que no hay más si no hay estructura de paginación
      } else if (Array.isArray(response)) {
        vehicles = response
        hasMore = false
      } else {
        hasMore = false
      }
      
      if (vehicles.length === 0) {
        hasMore = false
        break
      }
      
      allVehicles.push(...vehicles)
      
      // Si recibimos menos vehículos que el límite, no hay más páginas
      if (vehicles.length < limitPerPage) {
        hasMore = false
      }
    }
  } catch (error) {
    logError('Error obteniendo vehículos para sitemap', error)
    // Retornar lo que se haya obtenido hasta ahora
  }
  
  return allVehicles
}

/**
 * Genera sitemap desde API (para uso en backend/endpoint)
 * 
 * @param {Function} fetchVehicles - Función que retorna promesa con vehículos
 * @param {Object} options - Opciones adicionales
 * @returns {Promise<string>} XML del sitemap
 */
export const generateSitemapFromAPI = async (fetchVehicles, options = {}) => {
  try {
    // Obtener todos los vehículos paginando si es necesario
    const allVehicles = await fetchAllVehicles(fetchVehicles, options)
    
    return generateSitemap(allVehicles, options)
  } catch (error) {
    logError('Error generando sitemap desde API', error)
    // Retornar sitemap solo con páginas estáticas en caso de error
    return generateSitemap([], options)
  }
}

export default generateSitemap

