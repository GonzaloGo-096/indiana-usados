/**
 * normalizeImageUrl.js - Utilidad para normalizar URLs de imágenes
 * 
 * Normaliza URLs de imágenes para uso en SEO, sitemaps y meta tags.
 * Convierte URLs relativas a absolutas y maneja diferentes formatos.
 * 
 * @author Indiana Usados
 * @version 1.0.0
 */

/**
 * Normaliza URL de imagen para uso en SEO/sitemaps (debe ser absoluta)
 * 
 * @param {string|Object} imageUrl - URL de imagen (string o objeto con propiedad url)
 * @param {string} siteUrl - URL base del sitio (default: desde SEO_CONFIG)
 * @returns {string|null} URL absoluta normalizada o null si no es válida
 * 
 * @example
 * normalizeImageUrl('/images/hero.jpg', 'https://example.com')
 * // => 'https://example.com/images/hero.jpg'
 * 
 * normalizeImageUrl('https://res.cloudinary.com/...')
 * // => 'https://res.cloudinary.com/...'
 * 
 * normalizeImageUrl({ url: '/images/hero.jpg' }, 'https://example.com')
 * // => 'https://example.com/images/hero.jpg'
 */
export const normalizeImageUrl = (imageUrl, siteUrl = null) => {
  if (!imageUrl) return null
  
  // Si es objeto con URL, extraer la URL
  if (typeof imageUrl === 'object' && imageUrl?.url) {
    imageUrl = imageUrl.url
  }
  
  // Si ya es URL absoluta (http/https), usar directamente
  if (typeof imageUrl === 'string' && (imageUrl.startsWith('http://') || imageUrl.startsWith('https://'))) {
    return imageUrl
  }
  
  // Si no tenemos siteUrl, usar valor por defecto
  // (la configuración SEO se pasa desde useSEO.js)
  if (!siteUrl) {
    siteUrl = 'https://indiana.com.ar'
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
 * Versión síncrona de normalizeImageUrl (para uso en Node.js)
 * 
 * @param {string|Object} imageUrl - URL de imagen
 * @param {string} siteUrl - URL base del sitio (requerida)
 * @returns {string|null} URL absoluta normalizada
 */
export const normalizeImageUrlSync = (imageUrl, siteUrl) => {
  if (!imageUrl) return null
  
  // Si es objeto con URL, extraer la URL
  if (typeof imageUrl === 'object' && imageUrl?.url) {
    imageUrl = imageUrl.url
  }
  
  // Si ya es URL absoluta, usar directamente
  if (typeof imageUrl === 'string' && (imageUrl.startsWith('http://') || imageUrl.startsWith('https://'))) {
    return imageUrl
  }
  
  // siteUrl es requerida para versión síncrona
  if (!siteUrl) {
    return null
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

export default normalizeImageUrl

