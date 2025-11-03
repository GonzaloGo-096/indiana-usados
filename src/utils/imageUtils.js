/**
 * imageUtils.js - CAPA 3: Procesamiento avanzado de imágenes
 * 
 * 🏗️ ARQUITECTURA DEL SISTEMA:
 * ┌─────────────────────────────────────────────────────────┐
 * │ CAPA 1: imageExtractors.js                             │
 * │ → Extracción rápida: URLs como strings                 │
 * └─────────────────────────────────────────────────────────┘
 *                          ↓ Usa cuando necesita objetos
 * ┌─────────────────────────────────────────────────────────┐
 * │ CAPA 2: imageNormalizerOptimized.js                   │
 * │ → Normalización completa: {url, public_id, original_name}│
 * └─────────────────────────────────────────────────────────┘
 *                          ↓ Usa para procesamiento avanzado
 * ┌─────────────────────────────────────────────────────────┐
 * │ CAPA 3: imageUtils.js (ESTE ARCHIVO)                   │
 * │ → Procesamiento avanzado: carruseles, validación        │
 * │ → USA normalizador (CAPA 2) como base                  │
 * └─────────────────────────────────────────────────────────┘
 * 
 * ✅ PROPÓSITO: Procesamiento avanzado para casos complejos
 * - Carruseles que necesitan objetos completos (public_id para Cloudinary)
 * - Validación de estructuras de imagen
 * - Manejo de casos edge (fallbacks, arrays vacíos)
 * 
 * 📋 RESPONSABILIDADES:
 * - Obtener imágenes para carrusel con normalización completa
 * - Validar estructuras de imagen (isValidImage)
 * - Manejar fallbacks cuando no hay imágenes
 * - Combinar fotoPrincipal, fotoHover y fotosExtra
 * 
 * 🔄 FLUJO DE USO:
 * Vehículo → getCarouselImages(vehicle)
 *   ├─ normalizeVehicleImages(vehicle) [CAPA 2]
 *   ├─ Combinar fotoPrincipal + fotoHover + fotosExtra
 *   ├─ Filtrar imágenes inválidas
 *   └─ Retorna: Array<{url, public_id, original_name}>
 * 
 * 📍 USO POR COMPONENTE:
 * - ImageCarousel (actualmente no usado directamente - recibe strings del mapper)
 * - useCarouselImages hook → getCarouselImages() (potencial uso futuro)
 * 
 * ⚠️ NOTA IMPORTANTE:
 * - Actualmente ImageCarousel recibe strings directamente del mapper
 * - Este archivo está disponible para casos que necesiten objetos completos
 * - Si ImageCarousel necesita public_id para optimizaciones Cloudinary, usar esta función
 * 
 * 🔗 DEPENDENCIAS:
 * - @utils/imageNormalizerOptimized → normalizeVehicleImages, normalizeImageField
 * - @assets/defaultCarImage → fallback cuando no hay imágenes
 * - @utils/logger → logging de errores
 * 
 * 🔗 USADO POR:
 * - useCarouselImages hook → getCarouselImages() (potencial)
 * - Casos futuros que necesiten objetos completos para carruseles
 * 
 * @author Indiana Usados
 * @version 4.1.0 - Documentación mejorada: orden arquitectónico y flujos
 */

import { defaultCarImage } from '@assets'
import { logger } from '@utils/logger'
import { normalizeVehicleImages, normalizeImageField } from './imageNormalizerOptimized'

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
        // ✅ OPTIMIZADO: Normalización específica (solo busca en campos que el backend usa)
        const normalizedImages = normalizeVehicleImages(auto)
        
        // ✅ Combinar imágenes normalizadas (fotoPrincipal, fotoHover, fotosExtra)
        const allImages = []
        
        // Agregar principales normalizadas
        if (normalizedImages.fotoPrincipal) {
            allImages.push(normalizedImages.fotoPrincipal)
        }
        if (normalizedImages.fotoHover) {
            allImages.push(normalizedImages.fotoHover)
        }
        
        // Agregar extras normalizadas
        allImages.push(...normalizedImages.fotosExtra)
        
        // ✅ Filtrar valores inválidos
        const validImages = allImages.filter(img => {
            if (!img || typeof img !== 'object') return false
            return img.url && img.url.trim() !== '' && img.url !== 'undefined'
        })
        
        // ✅ Retornar imágenes normalizadas o fallback
        if (validImages.length > 0) {
            return validImages
        }
        
        // Fallback a imagen simple si existe
        const fallbackImg = normalizeImageField(auto.imagen)
        return fallbackImg ? [fallbackImg] : [defaultCarImage]
    } catch (error) {
        logger.warn('images:utils', 'Error al procesar imágenes del carrusel', { message: error.message })
        const fallbackImg = normalizeImageField(auto?.imagen)
        return fallbackImg ? [fallbackImg] : [defaultCarImage]
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
