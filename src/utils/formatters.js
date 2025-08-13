/**
 * formatters.js - Utilidades de formateo centralizadas
 * 
 * Características:
 * - Formateo de precios con moneda argentina
 * - Formateo de kilometraje
 * - Formateo de años
 * - Formateo de transmisión
 * - Validación de datos
 * 
 * @author Indiana Usados
 * @version 1.0.0
 */

/**
 * Formatea precio con moneda argentina
 * @param {number|string} price - Precio a formatear
 * @returns {string} - Precio formateado
 */
export const formatPrice = (price) => {
    if (!price) return '-'
    
    // ✅ CONVERTIR A NÚMERO
    const numericPrice = parseFloat(price.toString().replace(/[^\d]/g, ''))
    if (isNaN(numericPrice)) return price.toString()
    
    // ✅ FORMATEAR CON MONEDA ARGENTINA
    return new Intl.NumberFormat('es-AR', {
        style: 'currency',
        currency: 'ARS',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(numericPrice)
}

/**
 * Formatea kilometraje con separadores de miles
 * @param {number|string} kms - Kilometraje a formatear
 * @returns {string} - Kilometraje formateado
 */
export const formatKilometraje = (kms) => {
    if (!kms) return '-'
    
    // ✅ CONVERTIR A NÚMERO
    const numericKms = parseInt(kms.toString().replace(/[^\d]/g, ''))
    if (isNaN(numericKms)) return kms.toString()
    
    // ✅ FORMATEAR CON SEPARADORES
    return new Intl.NumberFormat('es-AR').format(numericKms)
}

/**
 * Formatea año
 * @param {number|string} year - Año a formatear
 * @returns {string} - Año formateado
 */
export const formatYear = (year) => {
    if (!year) return '-'
    return year.toString()
}

/**
 * Formatea caja con primera letra mayúscula
 * @param {string} caja - Caja a formatear
 * @returns {string} - Caja formateada
 */
export const formatCaja = (caja) => {
    if (!caja) return '-'
    return caja.charAt(0).toUpperCase() + caja.slice(1).toLowerCase()
}

/**
 * Formatea combustible
 * @param {string} fuel - Combustible a formatear
 * @returns {string} - Combustible formateado
 */
export const formatFuel = (fuel) => {
    if (!fuel) return '-'
    return fuel.charAt(0).toUpperCase() + fuel.slice(1).toLowerCase()
}

/**
 * Formatea color
 * @param {string} color - Color a formatear
 * @returns {string} - Color formateado
 */
export const formatColor = (color) => {
    if (!color) return '-'
    return color.charAt(0).toUpperCase() + color.slice(1).toLowerCase()
}

/**
 * Formatea cilindrada
 * @param {string} engine - Cilindrada a formatear
 * @returns {string} - Cilindrada formateada
 */
export const formatEngine = (engine) => {
    if (!engine) return '-'
    return engine
}

/**
 * Formatea versión del vehículo
 * @param {string} version - Versión a formatear
 * @returns {string} - Versión formateada
 */
export const formatVersion = (version) => {
    if (!version) return '-'
    return version
}

/**
 * Formatea marca y modelo
 * @param {string} marca - Marca del vehículo
 * @param {string} modelo - Modelo del vehículo
 * @returns {string} - Marca y modelo formateados
 */
export const formatBrandModel = (marca, modelo) => {
    if (!marca && !modelo) return '-'
    if (!marca) return modelo
    if (!modelo) return marca
    return `${marca} ${modelo}`
}

/**
 * Formatea fecha
 * @param {string|Date} date - Fecha a formatear
 * @returns {string} - Fecha formateada
 */
export const formatDate = (date) => {
    if (!date) return '-'
    
    try {
        const dateObj = new Date(date)
        return new Intl.DateTimeFormat('es-AR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        }).format(dateObj)
    } catch (error) {
        return date.toString()
    }
}

/**
 * Formatea rango de precios
 * @param {number|string} min - Precio mínimo
 * @param {number|string} max - Precio máximo
 * @returns {string} - Rango formateado
 */
export const formatPriceRange = (min, max) => {
    if (!min && !max) return '-'
    if (!min) return `Hasta ${formatPrice(max)}`
    if (!max) return `Desde ${formatPrice(min)}`
    return `${formatPrice(min)} - ${formatPrice(max)}`
}

/**
 * Formatea rango de años
 * @param {number|string} min - Año mínimo
 * @param {number|string} max - Año máximo
 * @returns {string} - Rango formateado
 */
export const formatYearRange = (min, max) => {
    if (!min && !max) return '-'
    if (!min) return `Hasta ${formatYear(max)}`
    if (!max) return `Desde ${formatYear(min)}`
    return `${formatYear(min)} - ${formatYear(max)}`
}

/**
 * Formatea rango de kilometraje
 * @param {number|string} min - Kilometraje mínimo
 * @param {number|string} max - Kilometraje máximo
 * @returns {string} - Rango formateado
 */
export const formatKilometrajeRange = (min, max) => {
    if (!min && !max) return '-'
    if (!min) return `Hasta ${formatKilometraje(max)}`
    if (!max) return `Desde ${formatKilometraje(min)}`
    return `${formatKilometraje(min)} - ${formatKilometraje(max)}`
} 