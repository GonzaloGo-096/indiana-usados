/**
 * cloudinaryUrl.js - Utilidades para generar URLs de Cloudinary
 * 
 * Genera URLs optimizadas con transformaciones automáticas
 * 
 * @author Indiana Usados
 * @version 1.0.0
 */

// Cloud name desde variable de entorno o fallback
const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || 'duuwqmpmn'

// Feature flags para optimizaciones de imágenes
const PROGRESSIVE_JPEG_ENABLED = import.meta.env.VITE_IMG_PROGRESSIVE_JPEG === 'true'
const BLUR_PLACEHOLDER_ENABLED = import.meta.env.VITE_IMG_PLACEHOLDER_BLUR === 'true'

// Caché en memoria para URLs de Cloudinary (evita recomputes innecesarios)
const urlCache = new Map()
const URL_CACHE_MAX = 300

/**
 * Genera URL de Cloudinary con transformaciones
 * @param {string} publicId - Public ID de la imagen
 * @param {Object} options - Opciones de transformación
 * @returns {string} - URL completa de Cloudinary
 */
export function cldUrl(publicId, options = {}) {
  if (!publicId) return ''
  
  const {
    width,
    height,
    crop = 'limit',
    gravity,
    aspectRatio,
    variant = 'fluid',
    effects = []
  } = options
  
  const transformations = []
  
  // Aplicar transformaciones según variant
  if (width) transformations.push(`w_${width}`)
  if (height) transformations.push(`h_${height}`)
  if (crop) transformations.push(`c_${crop}`)
  
  // Solo agregar gravity si NO es c_limit
  if (gravity && crop !== 'limit') {
    transformations.push(`g_${gravity}`)
  }
  
  if (aspectRatio) transformations.push(`ar_${aspectRatio}`)
  
  // Aplicar efectos si están definidos
  if (effects && effects.length > 0) {
    effects.forEach(effect => {
      transformations.push(`e_${effect}`)
    })
  }
  
  // Siempre agregar f_auto,q_auto,dpr_auto al final
  transformations.push('f_auto', 'q_auto', 'dpr_auto')
  
  // Agregar Progressive JPEG si está habilitado
  if (PROGRESSIVE_JPEG_ENABLED) {
    transformations.push('fl_progressive')
  }
  
  const transformString = transformations.join(',')
  
  // Verificar caché antes de generar URL
  const key = `${publicId}|${transformString}`
  if (urlCache.has(key)) {
    return urlCache.get(key)
  }
  
  // Limpiar public_id (remover / inicial si existe)
  const cleanPublicId = publicId.startsWith('/') ? publicId.slice(1) : publicId
  
  // Agregar extensión .jpg por defecto si no tiene extensión
  const finalPublicId = cleanPublicId.includes('.') ? cleanPublicId : `${cleanPublicId}.jpg`
  
  // Generar URL final
  const url = `https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/image/upload/${transformString}/${finalPublicId}`
  
  // Guardar en caché con límite simple
  if (urlCache.size >= URL_CACHE_MAX) {
    const firstKey = urlCache.keys().next().value
    urlCache.delete(firstKey)
  }
  urlCache.set(key, url)
  
  return url
}

/**
 * Genera URL de placeholder borroso (LQIP) para loading states
 * @param {string} publicId - Public ID de la imagen
 * @param {Object} options - Opciones de transformación
 * @returns {string} - URL del placeholder borroso
 */
export function cldPlaceholderUrl(publicId, options = {}) {
  if (!publicId || !BLUR_PLACEHOLDER_ENABLED) return ''
  
  // Opciones específicas para placeholder borroso (sin Progressive JPEG)
  const placeholderOptions = {
    width: 24,
    crop: 'limit',
    quality: 10,
    effects: ['blur:200'],
    ...options
  }
  
  // Generar URL de placeholder sin usar cldUrl para evitar Progressive JPEG
  const transformations = []
  
  if (placeholderOptions.width) transformations.push(`w_${placeholderOptions.width}`)
  if (placeholderOptions.crop) transformations.push(`c_${placeholderOptions.crop}`)
  if (placeholderOptions.quality) transformations.push(`q_${placeholderOptions.quality}`)
  
  // Aplicar efectos
  if (placeholderOptions.effects && placeholderOptions.effects.length > 0) {
    placeholderOptions.effects.forEach(effect => {
      transformations.push(`e_${effect}`)
    })
  }
  
  // Solo agregar f_auto para formato, sin Progressive JPEG
  transformations.push('f_auto', 'q_auto', 'dpr_auto')
  
  const transformString = transformations.join(',')
  
  // Limpiar public_id
  const cleanPublicId = publicId.startsWith('/') ? publicId.slice(1) : publicId
  const finalPublicId = cleanPublicId.includes('.') ? cleanPublicId : `${cleanPublicId}.jpg`
  
  return `https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/image/upload/${transformString}/${finalPublicId}`
}

/**
 * Genera srcset para responsive images
 * @param {string} publicId - Public ID de la imagen
 * @param {Array} widths - Array de anchos para srcset
 * @param {Object} baseOptions - Opciones base para todas las variantes
 * @returns {string} - String srcset completo
 */
export function cldSrcset(publicId, widths = [], baseOptions = {}) {
  if (!publicId || !widths.length) return ''
  
  return widths
    .map(width => `${cldUrl(publicId, { ...baseOptions, width })} ${width}w`)
    .join(', ')
}
