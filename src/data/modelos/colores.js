/**
 * colores.js - Catálogo de colores disponibles para modelos 0km
 * 
 * Centraliza todos los colores con sus imágenes de Cloudinary.
 * Cada color tiene un key único, label para UI, y publicId opcional.
 * 
 * @author Indiana Usados
 * @version 1.0.0
 */

/**
 * Catálogo de colores
 * - key: identificador único (usado en código)
 * - label: nombre para mostrar en UI
 * - hex: color para el selector visual
 * - publicId: ID de Cloudinary (null si no hay imagen)
 */
export const COLORES = {
  // Colores del 2008
  'gris-selenium': {
    key: 'gris-selenium',
    label: 'Gris Selenium',
    hex: '#6B7280',
    publicId: '2008-gris-_j05wjn',
    url: 'https://res.cloudinary.com/drbeomhcu/image/upload/v1766791873/2008-gris-_j05wjn.webp'
  },
  'blanco-nacre': {
    key: 'blanco-nacre',
    label: 'Blanco Nacre',
    hex: '#F5F5F0',
    publicId: '2008-blnaco_lkvtip',
    url: 'https://res.cloudinary.com/drbeomhcu/image/upload/v1766791875/2008-blnaco_lkvtip.webp'
  },
  'gris-artense': {
    key: 'gris-artense',
    label: 'Gris Artense',
    hex: '#9CA3AF',
    publicId: '2008-grisclaro_jnrtc9',
    url: 'https://res.cloudinary.com/drbeomhcu/image/upload/v1766791879/2008-grisclaro_jnrtc9.webp'
  },
  'negro': {
    key: 'negro',
    label: 'Negro',
    hex: '#1F2937',
    publicId: '2008-negro_utp7gx',
    url: 'https://res.cloudinary.com/drbeomhcu/image/upload/v1766786948/2008-negro_utp7gx.webp'
  }
}

/**
 * Obtener color por key
 * @param {string} colorKey - Key del color
 * @returns {Object|null} - Objeto color o null
 */
export const getColor = (colorKey) => COLORES[colorKey] || null

/**
 * Obtener imagen de un color (con fallback)
 * @param {string} colorKey - Key del color
 * @param {string} fallbackUrl - URL de fallback si no hay imagen
 * @returns {string|null} - URL de la imagen
 */
export const getColorImage = (colorKey, fallbackUrl = null) => {
  const color = COLORES[colorKey]
  return color?.url || fallbackUrl
}

