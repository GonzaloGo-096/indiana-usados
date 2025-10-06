/**
 * extractPublicId.js - Extrae public_id de URLs de Cloudinary
 * 
 * Convierte URLs de Cloudinary a public_id para usar con transformaciones
 * 
 * @author Indiana Usados
 * @version 1.0.0
 */

/**
 * Extrae public_id de una URL de Cloudinary
 * @param {string} url - URL de Cloudinary
 * @returns {string|null} - Public ID extraído o null si no es válida
 */
export function extractPublicIdFromUrl(url) {
  if (!url || typeof url !== 'string') return null
  
  // Encontrar /upload/ y extraer todo después hasta la extensión
  const uploadIndex = url.indexOf('/upload/')
  if (uploadIndex === -1) return null
  
  // Extraer todo después de /upload/
  let afterUpload = url.substring(uploadIndex + 8)
  
  // Remover extensión si existe
  afterUpload = afterUpload.replace(/\.[^.]+$/, '')
  
  // Tomar el path completo, no solo la última parte
  // Esto es crucial para public_ids con carpetas como "photo-bioteil/paqhetfzonahkzecnutx"
  return afterUpload
}

/**
 * Verifica si una URL es de Cloudinary
 * @param {string} url - URL a verificar
 * @returns {boolean} - True si es URL de Cloudinary
 */
export function isCloudinaryUrl(url) {
  return url && typeof url === 'string' && url.includes('res.cloudinary.com')
}
