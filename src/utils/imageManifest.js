/**
 * imageManifest.js - Sistema de imágenes estáticas WebP optimizadas
 * 
 * PROPÓSITO:
 * - Mapea vehicle_id + tipo de imagen → rutas WebP locales
 * - Imágenes pre-optimizadas: 1400px, quality ~75, formato WebP
 * - Elimina transformaciones on-demand de Cloudinary
 * - Base para preload X+1 (siguiente vehículo en lista)
 * 
 * ESTRUCTURA DEL MANIFEST:
 * {
 *   "vehicle_id": {
 *     principal: "/images/vehicles/vehicle_id-principal.webp",
 *     hover: "/images/vehicles/vehicle_id-hover.webp",
 *     extra1: "/images/vehicles/vehicle_id-extra1.webp",
 *     ...
 *   }
 * }
 * 
 * FLUJO DE USO:
 * 1. Script .bat genera WebP optimizados (1400px, q~75)
 * 2. imageManifest mapea IDs → rutas locales
 * 3. cloudinaryUrl.js consulta manifest primero
 * 4. Si existe → sirve WebP estático
 * 5. Si NO existe → fallback a Cloudinary (legacy)
 * 
 * @author Indiana Usados
 * @version 1.0.0 - Sistema de imágenes estáticas WebP
 */

/**
 * MANIFEST DE IMÁGENES ESTÁTICAS
 * 
 * Este objeto mapea vehicle_id a sus imágenes WebP optimizadas.
 * Las imágenes deben estar en /public/images/vehicles/
 * 
 * Formato esperado:
 * - Ubicación: /public/images/vehicles/
 * - Naming: {vehicle_id}-{tipo}.webp
 * - Tamaño: 1400px (ancho máximo)
 * - Quality: ~75%
 * - Formato: WebP
 */
export const IMAGE_MANIFEST = {
  // Ejemplo de estructura:
  // "673ce5f4aa297cb9e041a26f": {
  //   principal: "/images/vehicles/673ce5f4aa297cb9e041a26f-principal.webp",
  //   hover: "/images/vehicles/673ce5f4aa297cb9e041a26f-hover.webp",
  //   extra1: "/images/vehicles/673ce5f4aa297cb9e041a26f-extra1.webp",
  //   extra2: "/images/vehicles/673ce5f4aa297cb9e041a26f-extra2.webp",
  // }
  
  // ✅ NOTA: Este manifest se auto-genera con el script de conversión
  // Por ahora está vacío - se llenará con el script .bat del usuario
}

/**
 * Obtiene la URL de una imagen estática desde el manifest
 * 
 * @param {string} vehicleId - ID del vehículo (MongoDB ObjectId o similar)
 * @param {string} imageType - Tipo de imagen: 'principal', 'hover', 'extra1', etc.
 * @returns {string|null} - Ruta estática o null si no existe
 * 
 * @example
 * getStaticImageUrl('673ce5f4aa297cb9e041a26f', 'principal')
 * // → "/images/vehicles/673ce5f4aa297cb9e041a26f-principal.webp"
 */
export function getStaticImageUrl(vehicleId, imageType = 'principal') {
  if (!vehicleId || !imageType) return null
  
  const vehicleImages = IMAGE_MANIFEST[vehicleId]
  if (!vehicleImages) return null
  
  return vehicleImages[imageType] || null
}

/**
 * Verifica si un vehículo tiene imágenes en el manifest
 * 
 * @param {string} vehicleId - ID del vehículo
 * @returns {boolean} - true si existe en manifest
 */
export function hasStaticImages(vehicleId) {
  return vehicleId && IMAGE_MANIFEST[vehicleId] !== undefined
}

/**
 * Obtiene todas las imágenes de un vehículo desde el manifest
 * Útil para carruseles y galerías
 * 
 * @param {string} vehicleId - ID del vehículo
 * @returns {Array<string>} - Array de rutas estáticas
 * 
 * @example
 * getAllStaticImages('673ce5f4aa297cb9e041a26f')
 * // → ["/images/.../principal.webp", "/images/.../hover.webp", ...]
 */
export function getAllStaticImages(vehicleId) {
  if (!vehicleId) return []
  
  const vehicleImages = IMAGE_MANIFEST[vehicleId]
  if (!vehicleImages) return []
  
  // Retornar todas las imágenes disponibles en orden
  return Object.values(vehicleImages).filter(Boolean)
}

/**
 * Extrae vehicle_id de un public_id de Cloudinary
 * Formato esperado: "vehicles/673ce5f4aa297cb9e041a26f/principal"
 * 
 * @param {string} publicId - Public ID de Cloudinary
 * @returns {Object} - { vehicleId, imageType }
 * 
 * @example
 * parseCloudinaryPublicId('vehicles/673ce5f4aa297cb9e041a26f/principal')
 * // → { vehicleId: '673ce5f4aa297cb9e041a26f', imageType: 'principal' }
 */
export function parseCloudinaryPublicId(publicId) {
  if (!publicId || typeof publicId !== 'string') {
    return { vehicleId: null, imageType: null }
  }
  
  // Normalizar: remover slashes iniciales/finales
  const cleanId = publicId.replace(/^\/+|\/+$/g, '')
  
  // Intentar extraer vehicle_id e imageType
  // Formatos esperados:
  // - "vehicles/673ce5f4aa297cb9e041a26f/principal"
  // - "673ce5f4aa297cb9e041a26f/principal"
  // - "673ce5f4aa297cb9e041a26f-principal" (alternativo)
  
  const parts = cleanId.split('/')
  
  // Caso 1: formato "vehicles/ID/tipo"
  if (parts.length === 3 && parts[0] === 'vehicles') {
    return {
      vehicleId: parts[1],
      imageType: parts[2]
    }
  }
  
  // Caso 2: formato "ID/tipo"
  if (parts.length === 2) {
    return {
      vehicleId: parts[0],
      imageType: parts[1]
    }
  }
  
  // Caso 3: formato "ID-tipo" (con guión)
  if (parts.length === 1 && cleanId.includes('-')) {
    const dashParts = cleanId.split('-')
    if (dashParts.length >= 2) {
      return {
        vehicleId: dashParts[0],
        imageType: dashParts.slice(1).join('-')
      }
    }
  }
  
  // Caso 4: solo ID (asumir 'principal')
  if (parts.length === 1) {
    return {
      vehicleId: cleanId,
      imageType: 'principal'
    }
  }
  
  return { vehicleId: null, imageType: null }
}

/**
 * HELPER: Genera srcset estático para una imagen
 * Como solo tenemos 1400px, retornamos ese tamaño
 * 
 * @param {string} staticUrl - URL de la imagen estática
 * @returns {string} - Srcset string
 */
export function generateStaticSrcset(staticUrl) {
  if (!staticUrl) return ''
  
  // Solo tenemos 1400px optimizado
  // Retornar el mismo archivo para todos los tamaños
  // El browser descargará una vez y reutilizará
  return `${staticUrl} 1400w`
}

/**
 * HELPER: Genera sizes attribute para responsive
 * Mobile-first approach
 */
export const STATIC_IMAGE_SIZES = {
  card: '(max-width: 576px) 100vw, (max-width: 768px) 50vw, (max-width: 992px) 33vw, 350px',
  carousel: '100vw',
  thumbnail: '100px',
  hero: '100vw'
}

