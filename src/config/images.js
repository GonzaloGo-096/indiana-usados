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

// Función para obtener imagen aleatoria del carrusel
export const getRandomCarouselImage = (options = {}) => {
    const images = getCarouselImages(options)
    return images[Math.floor(Math.random() * images.length)]
}

// Función para obtener imagen por índice
export const getCarouselImageByIndex = (index, options = {}) => {
    const images = getCarouselImages(options)
    return images[index % images.length]
}

// Función para obtener imagen con tamaño específico
export const getImageWithSize = (imageKey, size, options = {}) => {
    return getOptimizedImage(imageKey, { ...options, size })
}

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