/**
 * filterUtils.js - Utilidades centralizadas para filtros
 * 
 * Responsabilidades:
 * - Validación de filtros
 * - Transformación de filtros para backend
 * - Lógica de filtrado de vehículos
 * - Constantes de filtros
 * 
 * @author Indiana Usados
 * @version 1.0.0
 */

// ===== CONSTANTES DE FILTROS =====
export const FILTER_DEFAULTS = {
    añoDesde: '1990',
    añoHasta: '2024',
    precioDesde: '0',
    precioHasta: '10000000',
    kilometrajeDesde: '0',
    kilometrajeHasta: '500000'
}

export const FILTER_LABELS = {
    marca: 'Marca',
    añoDesde: 'Año desde',
    añoHasta: 'Año hasta',
    precioDesde: 'Precio desde',
    precioHasta: 'Precio hasta',
    combustible: 'Combustible',
    transmision: 'Transmisión',
    kilometrajeDesde: 'KM desde',
    kilometrajeHasta: 'KM hasta',
    color: 'Color'
}

// ===== VALIDACIÓN DE FILTROS =====

/**
 * Valida si un valor de filtro es válido
 * @param {any} value - Valor a validar
 * @returns {boolean} - Si el valor es válido
 */
export const isValidFilterValue = (value) => {
    // Excluir valores vacíos, null, undefined
    if (!value || value === '' || value === null || value === undefined) {
        return false
    }
    
    // Excluir valores numéricos 0
    if (typeof value === 'number' && value === 0) {
        return false
    }
    
    // Excluir strings '0'
    if (typeof value === 'string' && value === '0') {
        return false
    }
    
    // Excluir arrays vacíos
    if (Array.isArray(value) && value.length === 0) {
        return false
    }
    
    // Excluir valores por defecto de ranges
    if (typeof value === 'string') {
        const defaults = Object.values(FILTER_DEFAULTS)
        if (defaults.includes(value)) {
            return false
        }
    }
    
    return true
}

/**
 * Filtra un objeto de filtros para obtener solo los válidos
 * @param {Object} filters - Objeto de filtros
 * @returns {Object} - Filtros válidos
 */
export const getValidFilters = (filters) => {
    return Object.entries(filters || {}).reduce((acc, [key, value]) => {
        if (isValidFilterValue(value)) {
            acc[key] = value
        }
        return acc
    }, {})
}

// ===== TRANSFORMACIÓN PARA BACKEND =====

/**
 * Transforma filtros del frontend al formato del backend
 * @param {Object} filters - Filtros del frontend
 * @returns {Object} - Filtros para backend
 */
export const transformFiltersToBackend = (filters) => {
    const validFilters = getValidFilters(filters)
    const backendFilters = {}
    
    Object.entries(validFilters).forEach(([key, value]) => {
        switch (key) {
            case 'marca':
                backendFilters.brand = value
                break
            case 'modelo':
                backendFilters.model = value
                break
            case 'añoDesde':
                backendFilters.yearFrom = parseInt(value)
                break
            case 'añoHasta':
                backendFilters.yearTo = parseInt(value)
                break
            case 'precioDesde':
                backendFilters.priceFrom = parseInt(value)
                break
            case 'precioHasta':
                backendFilters.priceTo = parseInt(value)
                break
            case 'combustible':
                backendFilters.fuel = value
                break
            case 'transmision':
                backendFilters.transmission = value
                break
            case 'color':
                backendFilters.color = value
                break
            default:
                backendFilters[key] = value
        }
    })
    
    return backendFilters
}

// ===== FILTRADO DE VEHÍCULOS =====

/**
 * Filtra vehículos según los filtros aplicados
 * @param {Array} vehicles - Lista de vehículos
 * @param {Object} filters - Filtros a aplicar
 * @returns {Array} - Vehículos filtrados
 */
export const filterVehicles = (vehicles, filters) => {
    if (!vehicles || !Array.isArray(vehicles)) return []
    
    const validFilters = getValidFilters(filters)
    
    if (Object.keys(validFilters).length === 0) {
        return vehicles
    }
    
    return vehicles.filter(vehicle => {
        return Object.entries(validFilters).every(([key, value]) => {
            switch (key) {
                case 'marca':
                    return vehicle.marca?.toLowerCase().includes(value.toLowerCase())
                case 'modelo':
                    return vehicle.modelo?.toLowerCase().includes(value.toLowerCase())
                case 'añoDesde':
                    return vehicle.año >= parseInt(value)
                case 'añoHasta':
                    return vehicle.año <= parseInt(value)
                case 'precioDesde':
                    return vehicle.precio >= parseInt(value)
                case 'precioHasta':
                    return vehicle.precio <= parseInt(value)
                case 'combustible':
                    return vehicle.combustible?.toLowerCase() === value.toLowerCase()
                case 'transmision':
                    return vehicle.transmision?.toLowerCase() === value.toLowerCase()
                case 'color':
                    return vehicle.color?.toLowerCase().includes(value.toLowerCase())
                default:
                    return vehicle[key]?.toString().toLowerCase().includes(value.toLowerCase())
            }
        })
    })
}

// ===== UTILIDADES DE UI =====

/**
 * Obtiene la etiqueta legible de un filtro
 * @param {string} key - Clave del filtro
 * @returns {string} - Etiqueta legible
 */
export const getFilterLabel = (key) => {
    return FILTER_LABELS[key] || key
}

/**
 * Formatea el valor de un filtro para mostrar en UI
 * @param {any} value - Valor del filtro
 * @returns {string} - Valor formateado
 */
export const formatFilterValue = (value) => {
    if (Array.isArray(value)) {
        return value.join(' ')
    }
    return value?.toString() || ''
} 