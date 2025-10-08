/**
 * useImageOptimization - Hook para optimizar manejo de imágenes
 * 
 * ✅ REFACTORIZADO v2.0: Solo mantiene hooks realmente utilizados
 * Eliminados 4 subhooks no utilizados (useMainImage, useVisibleImages, useAllValidImages, useImageValidation)
 * Eliminado hook compuesto useImageOptimization (no se usaba)
 * 
 * Responsabilidades:
 * - Memoizar procesamiento de imágenes para carrusel
 * - Optimizar re-renders
 */

import { useMemo } from 'react'
import { getCarouselImages } from '@utils/imageUtils'

/**
 * Hook para obtener imágenes del carrusel
 * @param {Object} auto - Objeto del vehículo
 * @returns {Array} - Array de imágenes para carrusel
 */
export const useCarouselImages = (auto) => {
    return useMemo(() => {
        if (!auto || typeof auto !== 'object') {
            return getCarouselImages(null)
        }
        return getCarouselImages(auto)
    }, [auto])
}



