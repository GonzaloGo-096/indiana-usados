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

// Configuración de imágenes (compatibilidad hacia atrás)
export const IMAGES = {
    defaultCarImage: getOptimizedImage('defaultCarImage')
}

// ⚠️ FUNCIONES LEGACY ELIMINADAS:
// - getCarouselImages() → Usar utils/imageUtils.js
// - getResponsiveImage() → Usar cloudinaryUrl.js (cldSrcset)
// - getRandomCarouselImage() → No se usaba
// - pickStable() → No se usaba
// Fecha: 2024

export default IMAGES 