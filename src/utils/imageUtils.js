/**
 * imageUtils.js - Utilidades para manejo de imágenes
 * 
 * Centraliza la lógica de procesamiento de imágenes para evitar duplicación
 * y mejorar la performance con memoización.
 * 
 * @author Indiana Usados
 * @version 1.0.0
 */

import { defaultCarImage } from '@assets'

/**
 * Función helper para mostrar "-" cuando el valor esté vacío
 * @param {*} value - Valor a formatear
 * @returns {string} - Valor formateado o "-"
 */
export const formatValue = (value) => {
    if (!value || value === '' || value === 'null' || value === 'undefined') {
        return '-'
    }
    return value
}

/**
 * Obtener imagen principal (solo mostrar: true)
 * @param {Object} auto - Objeto del vehículo
 * @returns {string} - URL de la imagen principal
 */
export const getMainImage = (auto) => {
    // ✅ MEJORADO: Validación más robusta
    if (!auto || typeof auto !== 'object' || Array.isArray(auto)) {
        return defaultCarImage
    }
    
    try {
        // Buscar imágenes con mostrar: true
        const visibleImages = Object.values(auto)
            .filter(img => isValidImage(img) && img.mostrar === true)
            .map(img => img.url);
        
        return visibleImages[0] || auto.imagen || defaultCarImage;
    } catch (error) {
        console.warn('⚠️ Error al procesar imagen principal:', error)
        return auto.imagen || defaultCarImage
    }
}

/**
 * Obtener todas las imágenes para carrusel (true y false)
 * @param {Object} auto - Objeto del vehículo
 * @returns {Array} - Array de URLs de imágenes
 */
export const getCarouselImages = (auto) => {
    // ✅ MEJORADO: Validación más robusta
    if (!auto || typeof auto !== 'object' || Array.isArray(auto)) {
        console.log('⚠️ getCarouselImages: auto inválido', auto)
        return [defaultCarImage]
    }
    
    try {
        console.log('🔍 getCarouselImages: auto.imágenes', auto.imágenes)
        // ✅ ARREGLADO: Manejar tanto objetos como arrays de URLs
        if (auto.imágenes && Array.isArray(auto.imágenes)) {
            // Si hay array de imágenes, usarlo
            console.log('✅ getCarouselImages: Usando array de imágenes', auto.imágenes)
            return auto.imágenes.length > 0 ? auto.imágenes : [defaultCarImage]
        }
        
        // ✅ ARREGLADO: Buscar imágenes en propiedades del objeto
        const allImages = Object.values(auto)
            .filter(img => isValidImage(img))
            .map(img => img.url);
        
        // ✅ ARREGLADO: Si no hay imágenes estructuradas, usar imagen principal
        if (allImages.length > 0) {
            return allImages
        }
        
        // ✅ ARREGLADO: Fallback a imagen principal
        return auto.imagen ? [auto.imagen] : [defaultCarImage]
    } catch (error) {
        console.warn('⚠️ Error al procesar imágenes del carrusel:', error)
        return auto.imagen ? [auto.imagen] : [defaultCarImage]
    }
}

/**
 * Procesar imágenes que pueden ser objetos o URLs
 * @param {Array} images - Array de imágenes (objetos o URLs)
 * @returns {Array} - Array de URLs procesadas
 */
export const processImages = (images = []) => {
    if (!images || images.length === 0) {
        return [defaultCarImage]
    }
    
    // Procesar imágenes que pueden ser objetos o URLs
    const processedImages = images.map(img => {
        if (typeof img === 'object' && img?.url) {
            return img.url;
        }
        return img;
    });
    
    return processedImages;
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

/**
 * Obtener imágenes visibles (mostrar: true)
 * @param {Object} auto - Objeto del vehículo
 * @returns {Array} - Array de URLs de imágenes visibles
 */
export const getVisibleImages = (auto) => {
    if (!auto) return []
    
    return Object.values(auto)
        .filter(isValidImage)
        .filter(img => img.mostrar === true)
        .map(img => img.url);
}

/**
 * Obtener todas las imágenes válidas
 * @param {Object} auto - Objeto del vehículo
 * @returns {Array} - Array de URLs de todas las imágenes válidas
 */
export const getAllValidImages = (auto) => {
    if (!auto) return []
    
    return Object.values(auto)
        .filter(isValidImage)
        .map(img => img.url);
} 