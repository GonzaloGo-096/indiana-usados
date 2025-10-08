/**
 * imageUtils.js - Utilidades para manejo de imágenes
 * 
 * ✅ PROPÓSITO: Procesamiento avanzado para carruseles (retorna objetos con public_id)
 * 
 * Centraliza la lógica de procesamiento de imágenes para carruseles
 * y validación de estructuras de imagen.
 * 
 * 📋 CASOS DE USO:
 * - Carruseles de imágenes (ImageCarousel component)
 * - Necesitas objetos completos (con public_id para Cloudinary)
 * - Búsqueda exhaustiva en múltiples propiedades
 * - Soporte para formato legacy (mostrar:true/false)
 * 
 * ⚠️ NOTA TÉCNICA:
 * - USA extractAllImageUrls() de imageExtractors como base
 * - AÑADE búsqueda adicional en: fotosExtras (plural), gallery, imagenes, etc.
 * - AÑADE soporte para objetos legacy con campo 'mostrar'
 * - RETORNA objetos (no solo URLs) para mantener public_id
 * 
 * 🔄 RELACIÓN CON imageExtractors.js:
 * - imageExtractors: Casos simples → Retorna URLs (strings)
 * - imageUtils: Casos complejos → Retorna objetos (con public_id)
 * - Duplicación parcial justificada por necesidades diferentes
 * 
 * 📌 TODO FUTURO (no urgente):
 * - Crear extractAllImageObjects() en imageExtractors para eliminar duplicación
 * - Requiere refactor de getCarouselImages() y testing exhaustivo
 * 
 * @author Indiana Usados
 * @version 2.0.0 - Limpieza: eliminado código muerto (255 líneas)
 */

import { defaultCarImage } from '@assets'
import { logger } from '@utils/logger'
import { extractAllImageUrls } from './imageExtractors'

/**
 * Obtener todas las imágenes para carrusel
 * Incluye fotoPrincipal, fotoHover, fotosExtra con deduplicación
 * 
 * @param {Object} auto - Objeto del vehículo
 * @returns {Array} - Array de URLs/objetos de imágenes
 */
export const getCarouselImages = (auto) => {
    // ✅ Validación robusta
    if (!auto || typeof auto !== 'object' || Array.isArray(auto)) {
        return [defaultCarImage]
    }
    
    try {
        // ✅ PASO 1: Extraer URLs básicas usando helper centralizado
        const basicUrls = extractAllImageUrls(auto, { includeExtras: true, filterDuplicates: false })
        
        // ✅ PASO 2: Buscar imágenes estructuradas con campos especiales (formato legacy con mostrar:true/false)
        const structuredImages = Object.values(auto)
            .filter(img => isValidImage(img))
            .map(img => img); // Mantener objeto completo (puede tener public_id)
        
        // ✅ PASO 3: Buscar en propiedades de array (fotosExtras, gallery, imagenes, etc.)
        const arrayProperties = ['fotosExtras', 'fotosExtra', 'gallery', 'imagenes', 'imágenes', 'photos', 'images']
        const fromArrays = []
        
        arrayProperties.forEach(prop => {
            const value = auto[prop]
            if (Array.isArray(value)) {
                value.forEach(img => {
                    if (typeof img === 'string' && img.trim() !== '') {
                        fromArrays.push(img.trim())
                    } else if (typeof img === 'object' && (img.public_id || img.url)) {
                        fromArrays.push(img) // Mantener objeto completo
                    }
                })
            }
        })
        
        // ✅ PASO 4: Combinar todas las fuentes
        const allImages = [...basicUrls, ...structuredImages, ...fromArrays]
        
        // ✅ PASO 5: Eliminar duplicados (comparar por URL o public_id)
        const uniqueImages = []
        const seenIds = new Set()
        
        allImages.forEach(img => {
            if (!img) return
            
            const identifier = typeof img === 'string' 
                ? img 
                : (img.public_id || img.url)
            
            if (identifier && !seenIds.has(identifier)) {
                seenIds.add(identifier)
                uniqueImages.push(img)
            }
        })
        
        // ✅ PASO 6: Filtrar valores inválidos
        const validImages = uniqueImages.filter(img => {
            if (typeof img === 'string') {
                return img.trim() !== '' && img !== 'undefined'
            }
            if (typeof img === 'object') {
                return (img.public_id || img.url) && img.url !== 'undefined'
            }
            return false
        })
        
        // ✅ PASO 7: Retornar imágenes o fallback
        if (validImages.length > 0) {
            return validImages
        }
        
        return auto.imagen ? [auto.imagen] : [defaultCarImage]
    } catch (error) {
        logger.warn('images:utils', 'Error al procesar imágenes del carrusel', { message: error.message })
        return auto.imagen ? [auto.imagen] : [defaultCarImage]
    }
}

/**
 * Validar estructura de imagen
 * @param {*} img - Objeto de imagen a validar
 * @returns {boolean} - True si es válido
 */
export const isValidImage = (img) => {
    return img && 
           typeof img === 'object' && 
           img.url && 
           typeof img.url === 'string' &&
           img.url.trim() !== ''
}
