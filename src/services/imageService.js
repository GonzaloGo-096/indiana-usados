/**
 * imageService.js - Servicio consolidado para manejo de imágenes
 * 
 * Funcionalidades:
 * - Manejo de imágenes desde backend, CDN y locales
 * - Configuración flexible de CDN
 * - Transformación de URLs
 * - Optimización automática
 * - Fallback a imágenes locales
 * 
 * @author Indiana Usados
 * @version 2.0.0
 */

// Configuración del entorno
const ENVIRONMENT = import.meta.env.VITE_ENVIRONMENT || 'development'
const USE_CDN = import.meta.env.VITE_USE_CDN === 'true'

// Configuración de CDN
const CDN_CONFIG = {
    // CDN principal (ejemplo: Cloudinary, AWS CloudFront, etc.)
    primary: {
        baseUrl: 'https://res.cloudinary.com/indiana-usados/image/upload',
        transformations: {
            quality: 'auto',
            format: 'auto',
            fetchFormat: 'auto'
        }
    },
    
    // CDN de respaldo
    fallback: {
        baseUrl: 'https://backup-cdn.indiana-usados.com',
        transformations: {
            quality: '85',
            format: 'webp'
        }
    },
    
    // Configuración de tamaños predefinidos
    sizes: {
        thumbnail: { width: 150, height: 150, crop: 'fill' },
        small: { width: 300, height: 300, crop: 'fill' },
        medium: { width: 600, height: 600, crop: 'fill' },
        large: { width: 800, height: 800, crop: 'fill' },
        xlarge: { width: 1200, height: 1200, crop: 'fill' }
    }
}

/**
 * Generar URL optimizada para CDN
 * @param {string} imagePath - Ruta de la imagen
 * @param {Object} options - Opciones de transformación
 * @param {string} options.size - Tamaño predefinido
 * @param {number} options.width - Ancho personalizado
 * @param {number} options.height - Alto personalizado
 * @param {string} options.format - Formato de salida
 * @param {number} options.quality - Calidad (1-100)
 * @param {string} options.cdn - CDN a usar ('primary' o 'fallback')
 * @returns {string} - URL optimizada
 */
export const generateCdnUrl = (imagePath, options = {}) => {
    const {
        size,
        width,
        height,
        format = 'auto',
        quality = 'auto',
        cdn = 'primary'
    } = options

    // Si no hay imagen, devolver null
    if (!imagePath) return null

    // Si es una imagen local, mantener la URL original
    if (imagePath.startsWith('/src/assets/') || imagePath.startsWith('./') || imagePath.startsWith('../')) {
        return imagePath
    }

    // Si ya es una URL completa, devolverla
    if (imagePath.startsWith('http')) {
        return imagePath
    }

    const cdnConfig = CDN_CONFIG[cdn]
    if (!cdnConfig) {
        console.warn(`CDN '${cdn}' no configurado, usando primary`)
        return imagePath
    }

    // Construir parámetros de transformación
    const transformations = []
    
    // Agregar tamaño
    if (size && CDN_CONFIG.sizes[size]) {
        const sizeConfig = CDN_CONFIG.sizes[size]
        transformations.push(`w_${sizeConfig.width},h_${sizeConfig.height},c_${sizeConfig.crop}`)
    } else if (width || height) {
        if (width) transformations.push(`w_${width}`)
        if (height) transformations.push(`h_${height}`)
        transformations.push('c_fill')
    }
    
    // Agregar formato y calidad
    if (format !== 'auto') transformations.push(`f_${format}`)
    if (quality !== 'auto') transformations.push(`q_${quality}`)
    
    // Agregar optimizaciones adicionales
    transformations.push('fl_progressive')
    transformations.push('fl_force_strip')

    // Construir URL final
    const transformationString = transformations.join(',')
    return `${cdnConfig.baseUrl}/${transformationString}/${imagePath}`
}

/**
 * Generar srcset para imágenes responsive desde CDN
 * @param {string} imagePath - Ruta de la imagen
 * @param {Array} breakpoints - Array de breakpoints
 * @param {Object} options - Opciones adicionales
 * @returns {string} - Srcset string
 */
export const generateCdnSrcSet = (imagePath, breakpoints = [300, 600, 800, 1200], options = {}) => {
    if (!imagePath) return ''

    const srcSet = breakpoints
        .map(width => {
            const optimizedUrl = generateCdnUrl(imagePath, { ...options, width })
            return `${optimizedUrl} ${width}w`
        })
        .join(', ')

    return srcSet
}

/**
 * Preload imagen desde CDN
 * @param {string} imagePath - Ruta de la imagen
 * @param {Object} options - Opciones de preload
 * @param {string} options.size - Tamaño de la imagen
 * @param {string} options.type - Tipo de preload ('preload' o 'prefetch')
 */
export const preloadCdnImage = (imagePath, options = {}) => {
    const { size = 'medium', type = 'preload' } = options
    
    const optimizedUrl = generateCdnUrl(imagePath, { size })
    if (!optimizedUrl) return

    const link = document.createElement('link')
    link.rel = type
    link.as = 'image'
    link.href = optimizedUrl
    
    // Agregar crossorigin si es necesario
    if (optimizedUrl.startsWith('http')) {
        link.crossOrigin = 'anonymous'
    }
    
    document.head.appendChild(link)
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
        cdn = 'primary'
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
 * Optimizar imagen para diferentes dispositivos
 * @param {string} imageUrl - URL de la imagen
 * @param {Object} options - Opciones de optimización
 * @returns {Object} - URLs optimizadas
 */
export const optimizeImageForDevices = (imageUrl, options = {}) => {
    const {
        mobile = { width: 300, height: 200 },
        tablet = { width: 600, height: 400 },
        desktop = { width: 800, height: 600 }
    } = options

    return {
        mobile: processImageUrl(imageUrl, { ...mobile, ...options }),
        tablet: processImageUrl(imageUrl, { ...tablet, ...options }),
        desktop: processImageUrl(imageUrl, { ...desktop, ...options }),
        original: imageUrl
    }
}

/**
 * Validar si una imagen existe
 * @param {string} imageUrl - URL de la imagen
 * @returns {Promise<boolean>} - True si la imagen existe
 */
export const validateImage = async (imageUrl) => {
    if (!imageUrl) return false

    try {
        const response = await fetch(imageUrl, { method: 'HEAD' })
        return response.ok
    } catch (error) {
        console.warn(`Error validando imagen: ${imageUrl}`, error)
        return false
    }
}

/**
 * Configuración de CDN exportada
 */
export { CDN_CONFIG }

/**
 * Ejemplo de uso con diferentes CDNs:
 * 
 * // Cloudinary
 * const cloudinaryUrl = generateCdnUrl('vehicles/toyota-corolla.jpg', {
 *     size: 'medium',
 *     format: 'webp',
 *     quality: 85
 * })
 * 
 * // AWS CloudFront
 * const awsUrl = generateCdnUrl('vehicles/honda-civic.jpg', {
 *     width: 600,
 *     height: 400,
 *     format: 'webp'
 * })
 * 
 * // Imagen local (fallback)
 * const localUrl = generateCdnUrl('/src/assets/fotos/auto-prueba-principal.webp')
 */ 