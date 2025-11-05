/**
 * extractPublicId.js - Extrae public_id de URLs de Cloudinary
 * 
 * Convierte URLs de Cloudinary a public_id para usar con transformaciones
 * 
 * @author Indiana Usados
 * @version 1.1.0 - Extracción robusta con soporte para transformaciones y versionado
 */

/**
 * Extrae public_id limpio de una URL de Cloudinary
 * 
 * Maneja URLs con transformaciones y versionado:
 * - /upload/w_800,c_limit/photo/xyz → photo/xyz
 * - /upload/v1234/photo/xyz → photo/xyz
 * - /upload/w_800,c_limit/v1234/photo/xyz → photo/xyz
 * - /upload/photo/xyz → photo/xyz (compatibilidad hacia atrás)
 * 
 * @param {string} url - URL de Cloudinary
 * @returns {string|null} - Public ID extraído o null si no es válida
 */
export function extractPublicIdFromUrl(url) {
  if (!url || typeof url !== 'string') return null
  
  // Encontrar /upload/ y extraer todo después
  const uploadIndex = url.indexOf('/upload/')
  if (uploadIndex === -1) return null
  
  // Extraer parte después de /upload/ (índice + 8 por "/upload/")
  let afterUpload = url.substring(uploadIndex + 8)
  
  // Remover query params y hash si existen
  afterUpload = afterUpload.split('?')[0].split('#')[0]
  
  // Remover extensión si existe (.jpg, .png, etc.)
  afterUpload = afterUpload.replace(/\.[^.]+$/, '')
  
  // Separar en segmentos para procesar
  const segments = afterUpload.split('/').filter(Boolean)
  if (segments.length === 0) return null
  
  // Detectar y saltar segmentos de transformaciones y versión
  // Transformaciones: c_limit, w_800, q_auto, f_auto, dpr_auto, fl_progressive, etc.
  // Versión: v1234 (patrón: v seguido de dígitos)
  const isTransformSegment = (seg) => {
    // Si contiene comas o empieza con transformaciones comunes
    if (seg.includes(',')) return true
    // Patrones comunes: c_, w_, h_, ar_, g_, fl_, q_, dpr_, e_
    return /^[cwhargfqd][_=]/.test(seg) || /^(crop|width|height|aspect|gravity|format|quality|dpr|effect)/.test(seg)
  }
  
  const isVersionSegment = (seg) => /^v\d+$/.test(seg)
  
  // Encontrar índice donde empieza el public_id real
  let startIdx = 0
  while (startIdx < segments.length) {
    const seg = segments[startIdx]
    // Saltar transformaciones
    if (isTransformSegment(seg)) {
      startIdx++
      continue
    }
    // Saltar versión
    if (isVersionSegment(seg)) {
      startIdx++
      continue
    }
    // Si llegamos aquí, es el inicio del public_id
    break
  }
  
  // Construir public_id desde el índice encontrado
  const publicId = segments.slice(startIdx).join('/')
  
  return publicId || null
}

/**
 * Verifica si una URL es de Cloudinary
 * @param {string} url - URL a verificar
 * @returns {boolean} - True si es URL de Cloudinary
 */
export function isCloudinaryUrl(url) {
  return url && typeof url === 'string' && url.includes('res.cloudinary.com')
}
