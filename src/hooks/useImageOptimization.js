/**
 * useImageOptimization - Hook para optimizar manejo de imágenes
 * 
 * Responsabilidades:
 * - Memoizar procesamiento de imágenes
 * - Validar estructura de datos
 * - Optimizar re-renders
 * - Proporcionar fallbacks
 * 
 * @author Indiana Usados
 * @version 1.0.0
 */

import { useMemo } from 'react'
import { 
    getMainImage, 
    getCarouselImages, 
    getVisibleImages, 
    getAllValidImages,
    isValidImage 
} from '@utils/imageUtils'

/**
 * Hook para optimizar imagen principal
 * @param {Object} auto - Objeto del vehículo
 * @returns {string} - URL de la imagen principal
 */
export const useMainImage = (auto) => {
    return useMemo(() => {
        // ✅ AGREGADO: Validación de entrada
        if (!auto || typeof auto !== 'object') {
            return getMainImage(null)
        }
        return getMainImage(auto)
    }, [auto])
}

/**
 * Hook para optimizar imágenes del carrusel
 * @param {Object} auto - Objeto del vehículo
 * @returns {Array} - Array de URLs de imágenes
 */
export const useCarouselImages = (auto) => {
    return useMemo(() => {
        // ✅ AGREGADO: Validación de entrada
        if (!auto || typeof auto !== 'object') {
            return getCarouselImages(null)
        }
        
        return getCarouselImages(auto)
    }, [auto])
}

/**
 * Hook para optimizar imágenes visibles
 * @param {Object} auto - Objeto del vehículo
 * @returns {Array} - Array de URLs de imágenes visibles
 */
export const useVisibleImages = (auto) => {
    return useMemo(() => {
        // ✅ AGREGADO: Validación de entrada
        if (!auto || typeof auto !== 'object') {
            return getVisibleImages(null)
        }
        return getVisibleImages(auto)
    }, [auto])
}

/**
 * Hook para optimizar todas las imágenes válidas
 * @param {Object} auto - Objeto del vehículo
 * @returns {Array} - Array de URLs de todas las imágenes válidas
 */
export const useAllValidImages = (auto) => {
    return useMemo(() => {
        // ✅ AGREGADO: Validación de entrada
        if (!auto || typeof auto !== 'object') {
            return getAllValidImages(null)
        }
        return getAllValidImages(auto)
    }, [auto])
}

/**
 * Hook para validar estructura de imagen
 * @param {*} img - Objeto de imagen
 * @returns {boolean} - True si es válido
 */
export const useImageValidation = (img) => {
    return useMemo(() => isValidImage(img), [img])
}

/**
 * Hook completo para manejo de imágenes
 * @param {Object} auto - Objeto del vehículo
 * @returns {Object} - Objeto con todas las utilidades de imágenes
 */
export const useImageOptimization = (auto) => {
    const mainImage = useMainImage(auto)
    const carouselImages = useCarouselImages(auto)
    const visibleImages = useVisibleImages(auto)
    const allValidImages = useAllValidImages(auto)
    
    return {
        mainImage,
        carouselImages,
        visibleImages,
        allValidImages,
        hasImages: allValidImages.length > 0,
        hasVisibleImages: visibleImages.length > 0,
        imageCount: allValidImages.length,
        visibleImageCount: visibleImages.length
    }
} 