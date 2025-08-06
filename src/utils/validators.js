/**
 * validators.js - Validaciones centralizadas
 * 
 * Características:
 * - Validación de datos de vehículos
 * - Validación de filtros
 * - Validación de respuestas de API
 * - Sanitización de datos
 * 
 * @author Indiana Usados
 * @version 1.0.0
 */

/**
 * Valida datos de un vehículo
 * @param {Object} vehicle - Vehículo a validar
 * @returns {Object} - Resultado de validación
 */
export const validateVehicleData = (vehicle) => {
    const errors = []

    // ✅ VALIDAR OBJETO
    if (!vehicle || typeof vehicle !== 'object') {
        errors.push('Vehículo debe ser un objeto válido')
        return { isValid: false, errors }
    }

    // ✅ CAMPOS REQUERIDOS
    const requiredFields = ['id', 'marca', 'modelo', 'precio']
    const missingFields = requiredFields.filter(field => !vehicle[field])
    
    if (missingFields.length > 0) {
        errors.push(`Campos requeridos faltantes: ${missingFields.join(', ')}`)
    }

    // ✅ VALIDAR TIPOS DE DATOS
    if (vehicle.precio && typeof vehicle.precio !== 'number' && typeof vehicle.precio !== 'string') {
        errors.push('Precio debe ser número o string')
    }

    if (vehicle.kms && typeof vehicle.kms !== 'number' && typeof vehicle.kms !== 'string') {
        errors.push('Kilometraje debe ser número o string')
    }

    if (vehicle.año && typeof vehicle.año !== 'number' && typeof vehicle.año !== 'string') {
        errors.push('Año debe ser número o string')
    }

    // ✅ VALIDAR RANGOS
    if (vehicle.precio) {
        const price = parseFloat(vehicle.precio)
        if (!isNaN(price) && (price < 0 || price > 1000000000)) {
            errors.push('Precio debe estar entre 0 y 1.000.000.000')
        }
    }

    if (vehicle.kms) {
        const kms = parseInt(vehicle.kms)
        if (!isNaN(kms) && (kms < 0 || kms > 1000000)) {
            errors.push('Kilometraje debe estar entre 0 y 1.000.000')
        }
    }

    if (vehicle.año) {
        const year = parseInt(vehicle.año)
        if (!isNaN(year) && (year < 1900 || year > new Date().getFullYear() + 1)) {
            errors.push(`Año debe estar entre 1900 y ${new Date().getFullYear() + 1}`)
        }
    }

    return {
        isValid: errors.length === 0,
        errors
    }
}

/**
 * Valida filtros de búsqueda
 * @param {Object} filters - Filtros a validar
 * @returns {Object} - Resultado de validación
 */
export const validateFilters = (filters) => {
    const errors = []

    if (!filters || typeof filters !== 'object') {
        errors.push('Filtros deben ser un objeto válido')
        return { isValid: false, errors }
    }

    // ✅ VALIDAR RANGOS NUMÉRICOS
    if (filters.precioMin && filters.precioMax) {
        const min = parseFloat(filters.precioMin)
        const max = parseFloat(filters.precioMax)
        
        if (!isNaN(min) && !isNaN(max) && min > max) {
            errors.push('Precio mínimo no puede ser mayor al máximo')
        }
    }

    if (filters.añoMin && filters.añoMax) {
        const min = parseInt(filters.añoMin)
        const max = parseInt(filters.añoMax)
        
        if (!isNaN(min) && !isNaN(max) && min > max) {
            errors.push('Año mínimo no puede ser mayor al máximo')
        }
    }

    if (filters.kilometrosMin && filters.kilometrosMax) {
        const min = parseInt(filters.kilometrosMin)
        const max = parseInt(filters.kilometrosMax)
        
        if (!isNaN(min) && !isNaN(max) && min > max) {
            errors.push('Kilometraje mínimo no puede ser mayor al máximo')
        }
    }

    // ✅ VALIDAR VALORES INDIVIDUALES
    if (filters.precioMin && parseFloat(filters.precioMin) < 0) {
        errors.push('Precio mínimo no puede ser negativo')
    }

    if (filters.precioMax && parseFloat(filters.precioMax) < 0) {
        errors.push('Precio máximo no puede ser negativo')
    }

    if (filters.añoMin && (parseInt(filters.añoMin) < 1900 || parseInt(filters.añoMin) > new Date().getFullYear() + 1)) {
        errors.push('Año mínimo fuera de rango válido')
    }

    if (filters.añoMax && (parseInt(filters.añoMax) < 1900 || parseInt(filters.añoMax) > new Date().getFullYear() + 1)) {
        errors.push('Año máximo fuera de rango válido')
    }

    return {
        isValid: errors.length === 0,
        errors
    }
}

/**
 * Valida respuesta de API
 * @param {Object} response - Respuesta a validar
 * @returns {Object} - Resultado de validación
 */
export const validateApiResponse = (response) => {
    const errors = []

    if (!response || typeof response !== 'object') {
        errors.push('Respuesta de API debe ser un objeto válido')
        return { isValid: false, errors }
    }

    if (!response.data && !response.vehicles && !response.items && !response.docs) {
        errors.push('Respuesta de API debe contener datos')
    }

    // ✅ VALIDAR ESTRUCTURA DE PAGINACIÓN
    if (response.total !== undefined && typeof response.total !== 'number') {
        errors.push('Total debe ser un número')
    }

    if (response.currentPage !== undefined && typeof response.currentPage !== 'number') {
        errors.push('CurrentPage debe ser un número')
    }

    if (response.hasNextPage !== undefined && typeof response.hasNextPage !== 'boolean') {
        errors.push('HasNextPage debe ser un booleano')
    }

    return {
        isValid: errors.length === 0,
        errors
    }
}

/**
 * Sanitiza filtros eliminando valores vacíos
 * @param {Object} filters - Filtros a sanitizar
 * @returns {Object} - Filtros sanitizados
 */
export const sanitizeFilters = (filters) => {
    if (!filters || typeof filters !== 'object') {
        return {}
    }

    const sanitized = {}
    
    Object.entries(filters).forEach(([key, value]) => {
        // ✅ INCLUIR SOLO VALORES VÁLIDOS
        if (value !== null && 
            value !== undefined && 
            value !== '' && 
            value !== 'null' && 
            value !== 'undefined') {
            sanitized[key] = value
        }
    })
    
    return sanitized
}

/**
 * Valida y sanitiza datos de vehículo
 * @param {Object} vehicle - Vehículo a procesar
 * @returns {Object} - Vehículo validado y sanitizado
 */
export const validateAndSanitizeVehicle = (vehicle) => {
    const validation = validateVehicleData(vehicle)
    
    if (!validation.isValid) {
        console.warn('⚠️ Vehículo inválido:', validation.errors)
        return null
    }

    // ✅ SANITIZAR DATOS
    const sanitized = {
        id: vehicle.id?.toString() || '',
        marca: vehicle.marca?.toString().trim() || '',
        modelo: vehicle.modelo?.toString().trim() || '',
        version: vehicle.version?.toString().trim() || '',
        precio: vehicle.precio || 0,
        año: vehicle.año || '',
        kms: vehicle.kms || '',
        transmisión: vehicle.transmisión?.toString().trim() || '',
        combustible: vehicle.combustible?.toString().trim() || '',
        color: vehicle.color?.toString().trim() || '',
        cilindrada: vehicle.cilindrada?.toString().trim() || '',
        categoría: vehicle.categoría?.toString().trim() || '',
        imagen: vehicle.imagen?.toString().trim() || '',
        imágenes: Array.isArray(vehicle.imágenes) ? vehicle.imágenes : [],
        detalle: vehicle.detalle?.toString().trim() || ''
    }

    return sanitized
}

/**
 * Valida y sanitiza filtros
 * @param {Object} filters - Filtros a procesar
 * @returns {Object} - Filtros validados y sanitizados
 */
export const validateAndSanitizeFilters = (filters) => {
    const validation = validateFilters(filters)
    
    if (!validation.isValid) {
        console.warn('⚠️ Filtros inválidos:', validation.errors)
        return {}
    }

    return sanitizeFilters(filters)
}

/**
 * Valida respuesta de API y extrae datos
 * @param {Object} response - Respuesta a procesar
 * @returns {Object} - Datos extraídos y validados
 */
export const validateAndExtractApiData = (response) => {
    const validation = validateApiResponse(response)
    
    if (!validation.isValid) {
        console.warn('⚠️ Respuesta de API inválida:', validation.errors)
        return { data: [], total: 0, currentPage: 1, hasNextPage: false }
    }

    // ✅ EXTRAER DATOS DE DIFERENTES FORMATOS
    let vehicles = []
    if (Array.isArray(response.data)) {
        vehicles = response.data
    } else if (response.data && Array.isArray(response.data.vehicles)) {
        vehicles = response.data.vehicles
    } else if (response.data && Array.isArray(response.data.items)) {
        vehicles = response.data.items
    } else if (response.data && Array.isArray(response.data.docs)) {
        vehicles = response.data.docs
    } else if (Array.isArray(response.vehicles)) {
        vehicles = response.vehicles
    } else if (Array.isArray(response.items)) {
        vehicles = response.items
    } else if (Array.isArray(response.docs)) {
        vehicles = response.docs
    }

    return {
        data: vehicles,
        total: response.total || response.data?.total || vehicles.length,
        currentPage: response.currentPage || response.data?.currentPage || 1,
        hasNextPage: response.hasNextPage || response.data?.hasNextPage || false,
        nextPage: response.nextPage || response.data?.nextPage || null
    }
} 