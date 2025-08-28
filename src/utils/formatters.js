/**
 * formatters.js - Funciones de formateo de datos
 * 
 * Funciones básicas para formatear precios, kilómetros, años, etc.
 * 
 * @author Indiana Usados
 * @version 1.0.0
 */

/**
 * Formatear precio en formato de moneda
 * @param {number|string} price - Precio a formatear
 * @returns {string} - Precio formateado
 */
export const formatPrice = (price) => {
    if (!price || price === 0) return 'Consultar'
    
    const numPrice = typeof price === 'string' ? parseFloat(price) : price
    if (isNaN(numPrice)) return 'Consultar'
    
    return new Intl.NumberFormat('es-AR', {
        style: 'currency',
        currency: 'ARS',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(numPrice)
}

/**
 * Formatear kilómetros
 * @param {number|string} kilometers - Kilómetros a formatear
 * @returns {string} - Kilómetros formateados
 */
export const formatKilometraje = (kilometers) => {
    if (!kilometers || kilometers === 0) return '0'
    
    const numKm = typeof kilometers === 'string' ? parseFloat(kilometers) : kilometers
    if (isNaN(numKm)) return '0'
    
    return new Intl.NumberFormat('es-AR').format(numKm)
}

/**
 * Formatear año
 * @param {number|string} year - Año a formatear
 * @returns {string} - Año formateado
 */
export const formatYear = (year) => {
    if (!year) return '-'
    
    const numYear = typeof year === 'string' ? parseInt(year) : year
    if (isNaN(numYear)) return '-'
    
    return numYear.toString()
}

/**
 * Formatear tipo de caja
 * @param {string} caja - Tipo de caja
 * @returns {string} - Caja formateada
 */
export const formatCaja = (caja) => {
    if (!caja) return '-'
    
    const cajaLower = caja.toLowerCase()
    
    if (cajaLower.includes('manual')) return 'Manual'
    if (cajaLower.includes('automatic')) return 'Automática'
    if (cajaLower.includes('cvt')) return 'CVT'
    
    return caja.charAt(0).toUpperCase() + caja.slice(1).toLowerCase()
}

/**
 * Formatear marca y modelo
 * @param {string} marca - Marca del vehículo
 * @param {string} modelo - Modelo del vehículo
 * @returns {string} - Marca y modelo formateados
 */
export const formatBrandModel = (marca, modelo) => {
    const marcaFormatted = marca ? marca.charAt(0).toUpperCase() + marca.slice(1).toLowerCase() : ''
    const modeloFormatted = modelo ? modelo.charAt(0).toUpperCase() + modelo.slice(1).toLowerCase() : ''
    
    if (marcaFormatted && modeloFormatted) {
        return `${marcaFormatted} ${modeloFormatted}`
    }
    
    return marcaFormatted || modeloFormatted || '-'
}
