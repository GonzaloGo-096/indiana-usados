/**
 * imageOptimizationService.js - Servicio para optimización de imágenes
 * 
 * Funcionalidades:
 * - Conversión de formatos (WebP, AVIF, JPEG)
 * - Redimensionamiento automático
 * - Compresión inteligente
 * - Generación de thumbnails
 * - Cache de imágenes optimizadas
 * 
 * @author Indiana Usados
 * @version 1.0.0
 */

/**
 * Configuración de optimización
 */
const OPTIMIZATION_CONFIG = {
    // Formatos soportados
    formats: {
        webp: {
            quality: 85,
            supported: true
        },
        avif: {
            quality: 80,
            supported: false // Por ahora no soportado en todos los navegadores
        },
        jpeg: {
            quality: 90,
            supported: true
        }
    },
    
    // Tamaños predefinidos
    sizes: {
        thumbnail: { width: 150, height: 150 },
        small: { width: 300, height: 300 },
        medium: { width: 600, height: 600 },
        large: { width: 800, height: 800 },
        xlarge: { width: 1200, height: 1200 }
    },
    
    // Configuración de lazy loading
    lazyLoading: {
        rootMargin: '50px 0px',
        threshold: 0.1
    }
}

/**
 * Detectar soporte de formatos en el navegador
 * @returns {Object} - Formatos soportados
 */
export const detectFormatSupport = () => {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    
    const formats = {
        webp: false,
        avif: false,
        jpeg: true // Siempre soportado
    }
    
    // Detectar WebP
    canvas.width = 1
    canvas.height = 1
    try {
        const webpData = canvas.toDataURL('image/webp')
        formats.webp = webpData.indexOf('data:image/webp') === 0
    } catch (e) {
        formats.webp = false
    }
    
    // Detectar AVIF (experimental)
    try {
        const avifData = canvas.toDataURL('image/avif')
        formats.avif = avifData.indexOf('data:image/avif') === 0
    } catch (e) {
        formats.avif = false
    }
    
    return formats
}

/**
 * Obtener el mejor formato disponible
 * @param {string} preferredFormat - Formato preferido
 * @returns {string} - Mejor formato disponible
 */
export const getBestFormat = (preferredFormat = 'webp') => {
    const supportedFormats = detectFormatSupport()
    
    // Prioridad: AVIF > WebP > JPEG
    if (preferredFormat === 'avif' && supportedFormats.avif) {
        return 'avif'
    }
    
    if (preferredFormat === 'webp' && supportedFormats.webp) {
        return 'webp'
    }
    
    return 'jpeg'
}

/**
 * Generar URL optimizada para imagen
 * @param {string} originalUrl - URL original de la imagen
 * @param {Object} options - Opciones de optimización
 * @param {number} options.width - Ancho deseado
 * @param {number} options.height - Alto deseado
 * @param {string} options.format - Formato deseado
 * @param {number} options.quality - Calidad (1-100)
 * @returns {string} - URL optimizada
 */
export const generateOptimizedUrl = (originalUrl, options = {}) => {
    if (!originalUrl) return null
    
    const {
        width,
        height,
        format = 'webp',
        quality = 85
    } = options
    
    // Si es una imagen local, mantener la URL original
    if (originalUrl.startsWith('/src/assets/')) {
        return originalUrl
    }
    
    // Para imágenes externas, agregar parámetros de optimización
    try {
        const url = new URL(originalUrl)
        
        if (width) url.searchParams.set('w', width.toString())
        if (height) url.searchParams.set('h', height.toString())
        if (format) url.searchParams.set('f', format)
        if (quality) url.searchParams.set('q', quality.toString())
        
        url.searchParams.set('fit', 'crop')
        url.searchParams.set('auto', 'format')
        
        return url.toString()
    } catch (error) {
        console.warn('Error generating optimized URL:', error)
        return originalUrl
    }
}

/**
 * Generar srcset para imágenes responsive
 * @param {string} originalUrl - URL original
 * @param {Array} breakpoints - Array de breakpoints
 * @param {string} format - Formato preferido
 * @returns {string} - Srcset string
 */
export const generateSrcSet = (originalUrl, breakpoints = [300, 600, 800, 1200], format = 'webp') => {
    if (!originalUrl) return ''
    
    const srcSet = breakpoints
        .map(width => {
            const optimizedUrl = generateOptimizedUrl(originalUrl, { width, format })
            return `${optimizedUrl} ${width}w`
        })
        .join(', ')
    
    return srcSet
}

/**
 * Preload imagen crítica
 * @param {string} imageUrl - URL de la imagen
 * @param {string} type - Tipo de preload ('preload', 'prefetch')
 */
export const preloadImage = (imageUrl, type = 'preload') => {
    if (!imageUrl) return
    
    const link = document.createElement('link')
    link.rel = type
    link.as = 'image'
    link.href = imageUrl
    
    // Agregar crossorigin si es necesario
    if (imageUrl.startsWith('http')) {
        link.crossOrigin = 'anonymous'
    }
    
    document.head.appendChild(link)
}

/**
 * Optimizar imagen con Canvas API
 * @param {HTMLImageElement} img - Elemento imagen
 * @param {Object} options - Opciones de optimización
 * @returns {Promise<string>} - Data URL optimizada
 */
export const optimizeImageWithCanvas = (img, options = {}) => {
    return new Promise((resolve, reject) => {
        const {
            width = img.naturalWidth,
            height = img.naturalHeight,
            format = 'webp',
            quality = 0.85
        } = options
        
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')
        
        canvas.width = width
        canvas.height = height
        
        // Dibujar imagen en canvas
        ctx.drawImage(img, 0, 0, width, height)
        
        // Convertir a formato optimizado
        try {
            const mimeType = `image/${format}`
            const dataUrl = canvas.toDataURL(mimeType, quality)
            resolve(dataUrl)
        } catch (error) {
            reject(error)
        }
    })
}

/**
 * Cache de imágenes optimizadas
 */
class ImageCache {
    constructor(maxSize = 100) {
        this.cache = new Map()
        this.maxSize = maxSize
    }
    
    /**
     * Obtener imagen del cache
     * @param {string} key - Clave de cache
     * @returns {string|null} - URL de imagen cacheada
     */
    get(key) {
        return this.cache.get(key)
    }
    
    /**
     * Guardar imagen en cache
     * @param {string} key - Clave de cache
     * @param {string} value - URL de imagen
     */
    set(key, value) {
        if (this.cache.size >= this.maxSize) {
            const firstKey = this.cache.keys().next().value
            this.cache.delete(firstKey)
        }
        
        this.cache.set(key, value)
    }
    
    /**
     * Limpiar cache
     */
    clear() {
        this.cache.clear()
    }
}

// Instancia global del cache
export const imageCache = new ImageCache()

/**
 * Configuración exportada
 */
export { OPTIMIZATION_CONFIG } 