/**
 * imageService.js - Servicio para manejo de imágenes
 * 
 * Maneja imágenes desde backend, CDN y locales
 * 
 * @author Indiana Usados
 * @version 1.0.0
 */

import { generateCdnUrl } from './cdnService'

// Configuración del entorno
const ENVIRONMENT = import.meta.env.VITE_ENVIRONMENT || 'development'
const USE_CDN = import.meta.env.VITE_USE_CDN === 'true'

// Configuración de CDN
const CDN_CONFIG = {
    cloudinary: {
        baseUrl: 'https://res.cloudinary.com/indiana-usados/image/upload',
        transformations: {
            quality: 'auto',
            format: 'auto'
        }
    },
    cloudfront: {
        baseUrl: 'https://d1234567890.cloudfront.net',
        transformations: {
            quality: '85',
            format: 'webp'
        }
    }
}

/**
 * Procesar imagen desde backend
 * @param {Object} vehicleData - Datos del vehículo del backend
 * @param {string} vehicleData.imagen - URL o ruta de imagen
 * @param {Array} vehicleData.imagenes - Array de URLs o rutas
 * @param {Object} options - Opciones de optimización
 * @returns {Object} - Datos procesados
 */
export const processVehicleImages = (vehicleData, options = {}) => {
    const {
        width = 800,
        height = 600,
        quality = 85,
        format = 'webp'
    } = options

    // Procesar imagen principal
    const imagen = processImageUrl(vehicleData.imagen, { width, height, quality, format })
    
    // Procesar array de imágenes
    const imagenes = vehicleData.imagenes?.map(img => 
        processImageUrl(img, { width, height, quality, format })
    ) || []

    return {
        ...vehicleData,
        imagen,
        imagenes
    }
}

/**
 * Procesar URL de imagen
 * @param {string} imageUrl - URL o ruta de imagen
 * @param {Object} options - Opciones de optimización
 * @returns {string} - URL procesada
 */
export const processImageUrl = (imageUrl, options = {}) => {
    if (!imageUrl) return null

    const {
        width,
        height,
        quality = 85,
        format = 'webp',
        cdn = 'cloudinary'
    } = options

    // Si es una URL completa (http/https), mantenerla
    if (imageUrl.startsWith('http')) {
        return imageUrl
    }

    // Si es una imagen local, mantenerla
    if (imageUrl.startsWith('/src/assets/') || imageUrl.startsWith('./') || imageUrl.startsWith('../')) {
        return imageUrl
    }

    // Si es una ruta de CDN (sin http), procesarla
    if (USE_CDN && ENVIRONMENT === 'production') {
        return generateCdnUrl(imageUrl, {
            width,
            height,
            quality,
            format,
            cdn
        })
    }

    // Fallback: devolver la URL original
    return imageUrl
}

/**
 * Generar URL de CDN
 * @param {string} imagePath - Ruta de la imagen
 * @param {Object} options - Opciones
 * @returns {string} - URL de CDN
 */
export const generateCdnUrl = (imagePath, options = {}) => {
    const {
        width,
        height,
        quality = 85,
        format = 'webp',
        cdn = 'cloudinary'
    } = options

    const cdnConfig = CDN_CONFIG[cdn]
    if (!cdnConfig) {
        console.warn(`CDN '${cdn}' no configurado`)
        return imagePath
    }

    // Construir parámetros según el CDN
    if (cdn === 'cloudinary') {
        const transformations = []
        if (width) transformations.push(`w_${width}`)
        if (height) transformations.push(`h_${height}`)
        if (quality) transformations.push(`q_${quality}`)
        if (format) transformations.push(`f_${format}`)
        
        transformations.push('c_fill', 'fl_progressive')
        
        const transformationString = transformations.join(',')
        return `${cdnConfig.baseUrl}/${transformationString}/${imagePath}`
    }

    if (cdn === 'cloudfront') {
        const params = new URLSearchParams()
        if (width) params.set('w', width)
        if (height) params.set('h', height)
        if (quality) params.set('q', quality)
        if (format) params.set('f', format)
        
        return `${cdnConfig.baseUrl}/${imagePath}?${params.toString()}`
    }

    return imagePath
}

/**
 * Ejemplo de uso con backend real:
 * 
 * // Backend devuelve:
 * {
 *   id: 1,
 *   marca: "Toyota",
 *   imagen: "vehicles/toyota-corolla.jpg",
 *   imagenes: ["vehicles/toyota-corolla-1.jpg", "vehicles/toyota-corolla-2.jpg"]
 * }
 * 
 * // Frontend procesa:
 * const processedVehicle = processVehicleImages(vehicleData, {
 *   width: 800,
 *   height: 600,
 *   quality: 85,
 *   format: 'webp'
 * })
 * 
 * // Resultado:
 * {
 *   id: 1,
 *   marca: "Toyota",
 *   imagen: "https://res.cloudinary.com/indiana-usados/image/upload/w_800,h_600,q_85,f_webp,c_fill,fl_progressive/vehicles/toyota-corolla.jpg",
 *   imagenes: [...]
 * }
 */

export { CDN_CONFIG } 