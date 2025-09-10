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
    variant = 'fluid'
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
  
  // Siempre agregar f_auto,q_auto al final
  transformations.push('f_auto', 'q_auto')
  
  const transformString = transformations.join(',')
  
  // Limpiar public_id (remover / inicial si existe)
  const cleanPublicId = publicId.startsWith('/') ? publicId.slice(1) : publicId
  
  // Agregar extensión .jpg por defecto si no tiene extensión
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
