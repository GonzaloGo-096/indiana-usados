/**
 * images.js - Configuración de imágenes
 * 
 * Centraliza las rutas de imágenes para facilitar el mantenimiento
 * y asegurar que funcionen correctamente con Vite
 * 
 * @author Indiana Usados
 * @version 2.0.0
 */

// Importar imagen por defecto (esto funciona en Vite)
import { defaultCarImage } from '@assets'

// Configuración del entorno
const ENVIRONMENT = import.meta.env.VITE_ENVIRONMENT || 'development'

// Configuración de imágenes locales (usando rutas públicas)
const LOCAL_IMAGES = {
    defaultCarImage: defaultCarImage, // Esta sí funciona porque está importada
}

/**
 * Obtener imagen optimizada según el entorno
 * @param {string} imageKey - Clave de la imagen
 * @param {Object} options - Opciones de optimización
 * @returns {string} - URL de la imagen
 */
export const getOptimizedImage = (imageKey, options = {}) => {
    // Usar imágenes locales
    return LOCAL_IMAGES[imageKey] || LOCAL_IMAGES.defaultCarImage
}

/**
 * Obtener array de imágenes para carrusel
 * @param {Object} options - Opciones de optimización
 * @returns {Array} - Array de URLs de imágenes
 */
export const getCarouselImages = (options = {}) => {
    // Usar imágenes locales
    return [LOCAL_IMAGES.defaultCarImage]
}

// Configuración de imágenes (compatibilidad hacia atrás)
export const IMAGES = {
    defaultCarImage: getOptimizedImage('defaultCarImage'),
    
    // Array de imágenes para carrusel
    carouselImages: getCarouselImages()
}

// Función hash determinística (djb2) para selección estable
function djb2(str) {
    let h = 5381
    for (let i = 0; i < str.length; i++) {
        h = ((h << 5) + h) + str.charCodeAt(i)
    }
    return h >>> 0
}

// Función para seleccionar elemento de array de forma determinística
export function pickStable(arr, seedStr) {
    if (!arr?.length) return null
    const idx = djb2(seedStr) % arr.length
    return arr[idx]
}

// Función para obtener imagen del carrusel de forma determinística
// Evita Math.random() para mantener caché efectivo y URLs consistentes
export const getRandomCarouselImage = (options = {}) => {
    const images = getCarouselImages(options)
    // Usar seed determinístico para mantener consistencia entre recargas
    const seed = options.seed || options.vehicleId || images[0]?.public_id || 'default'
    return pickStable(images, String(seed))
}

// Funciones eliminadas: getCarouselImageByIndex, getImageWithSize (no usadas)

// Función para obtener imagen responsive
export const getResponsiveImage = (imageKey, breakpoints = [300, 600, 800, 1200], options = {}) => {
    const srcSet = breakpoints
        .map(width => {
            const url = getOptimizedImage(imageKey, { ...options, width })
            return `${url} ${width}w`
        })
        .join(', ')
    
    return {
        src: getOptimizedImage(imageKey, options),
        srcSet
    }
}

export default IMAGES 