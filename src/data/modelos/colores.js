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
  // ═══════════════════════════════════════════════════════════════
  // COLORES DEL 2008
  // ═══════════════════════════════════════════════════════════════
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
  },

  // ═══════════════════════════════════════════════════════════════
  // COLORES DEL 3008
  // ═══════════════════════════════════════════════════════════════
  '3008-azul-ingaro': {
    key: '3008-azul-ingaro',
    label: 'Azul Ingaro',
    hex: '#2C3E50',
    publicId: '008-azul-ingaro_fubtjn',
    url: 'https://res.cloudinary.com/drbeomhcu/image/upload/v1767025052/008-azul-ingaro_fubtjn.webp'
  },
  '3008-gris-titanium': {
    key: '3008-gris-titanium',
    label: 'Gris Titanium',
    hex: '#4A4A4A',
    publicId: '3008-gris-oscura_uyljgd',
    url: 'https://res.cloudinary.com/drbeomhcu/image/upload/v1767025049/3008-gris-oscura_uyljgd.webp'
  },
  '3008-azul-obsession': {
    key: '3008-azul-obsession',
    label: 'Azul Obsession',
    hex: '#1E3A5F',
    publicId: '3008-azul_anat7b',
    url: 'https://res.cloudinary.com/drbeomhcu/image/upload/v1766786949/3008-azul_anat7b.webp'
  },
  '3008-gris-artense': {
    key: '3008-gris-artense',
    label: 'Gris Artense',
    hex: '#9CA3AF',
    publicId: '3008-gris_ynqfxd',
    url: 'https://res.cloudinary.com/drbeomhcu/image/upload/v1767025050/3008-gris_ynqfxd.webp'
  },
  '3008-negro-perla': {
    key: '3008-negro-perla',
    label: 'Negro Perla',
    hex: '#1C1C1C',
    publicId: '3008-negro_q9uqka',
    url: 'https://res.cloudinary.com/drbeomhcu/image/upload/v1767025051/3008-negro_q9uqka.webp'
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

