/**
 * images.js - Configuración de imágenes
 * 
 * NOTA: Migrado a Cloudinary. Este archivo mantiene compatibilidad.
 * 
 * @author Indiana Usados
 * @version 3.0.0 - Migración a Cloudinary
 */

import { staticImages } from '@config/cloudinaryStaticImages'

// Imagen por defecto para vehículos (fallback)
const defaultCarImage = staticImages.usados.placeholder.src

// Configuración de imágenes locales (compatibilidad)
const LOCAL_IMAGES = {
    defaultCarImage: defaultCarImage,
}

/**
 * Obtener imagen optimizada según el entorno
 * @param {string} imageKey - Clave de la imagen
 * @param {Object} options - Opciones de optimización
 * @returns {string} - URL de la imagen
 */
export const getOptimizedImage = (imageKey, options = {}) => {
    return LOCAL_IMAGES[imageKey] || LOCAL_IMAGES.defaultCarImage
}

// Configuración de imágenes (compatibilidad hacia atrás)
export const IMAGES = {
    defaultCarImage: getOptimizedImage('defaultCarImage')
}

export { defaultCarImage }

export default IMAGES 