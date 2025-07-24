/**
 * images.js - Configuración de imágenes
 * 
 * Centraliza las rutas de imágenes para facilitar el mantenimiento
 * y asegurar que funcionen correctamente con Vite y CDN
 * 
 * @author Indiana Usados
 * @version 2.0.0
 */

import { generateCdnUrl } from '../services/cdnService'

// Importar imagen por defecto (esto funciona en Vite)
import defaultCarImage from '../assets/auto1.jpg'

// Configuración del entorno
const ENVIRONMENT = import.meta.env.VITE_ENVIRONMENT || 'development'
const USE_CDN = import.meta.env.VITE_USE_CDN === 'true'

// Rutas de imágenes en CDN (ejemplo)
const CDN_IMAGE_PATHS = {
    // Imágenes de vehículos en CDN
    autoPruebaPrincipal: 'vehicles/auto-prueba-principal.webp',
    autoPrueba2: 'vehicles/auto-pueba-2.webp',
    autoPrueba3: 'vehicles/auto-prueba-3.webp',
    defaultCarImage: 'vehicles/default-car.jpg'
}

// Configuración de imágenes locales (usando rutas públicas)
const LOCAL_IMAGES = {
    autoPruebaPrincipal: '/src/assets/fotos/auto-prueba-principal.webp',
    autoPrueba2: '/src/assets/fotos/auto-pueba-2.webp',
    autoPrueba3: '/src/assets/fotos/auto-prueba-3.webp',
    defaultCarImage: defaultCarImage, // Esta sí funciona porque está importada
    
    // Array de imágenes para carrusel
    carouselImages: [
        '/src/assets/fotos/auto-prueba-principal.webp',
        '/src/assets/fotos/auto-pueba-2.webp',
        '/src/assets/fotos/auto-prueba-3.webp'
    ]
}

/**
 * Obtener imagen optimizada según el entorno
 * @param {string} imageKey - Clave de la imagen
 * @param {Object} options - Opciones de optimización
 * @returns {string} - URL de la imagen
 */
export const getOptimizedImage = (imageKey, options = {}) => {
    if (USE_CDN && ENVIRONMENT === 'production') {
        // Usar CDN en producción
        const cdnPath = CDN_IMAGE_PATHS[imageKey]
        if (cdnPath) {
            return generateCdnUrl(cdnPath, options)
        }
    }
    
    // Usar imágenes locales en desarrollo o como fallback
    return LOCAL_IMAGES[imageKey] || LOCAL_IMAGES.defaultCarImage
}

/**
 * Obtener array de imágenes para carrusel
 * @param {Object} options - Opciones de optimización
 * @returns {Array} - Array de URLs de imágenes
 */
export const getCarouselImages = (options = {}) => {
    if (USE_CDN && ENVIRONMENT === 'production') {
        // Usar CDN en producción
        return Object.values(CDN_IMAGE_PATHS)
            .filter(path => path !== CDN_IMAGE_PATHS.defaultCarImage)
            .map(path => generateCdnUrl(path, options))
    }
    
    // Usar imágenes locales
    return LOCAL_IMAGES.carouselImages
}

// Configuración de imágenes (compatibilidad hacia atrás)
export const IMAGES = {
    // Imágenes WebP
    autoPruebaPrincipal: getOptimizedImage('autoPruebaPrincipal'),
    autoPrueba2: getOptimizedImage('autoPrueba2'),
    autoPrueba3: getOptimizedImage('autoPrueba3'),
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