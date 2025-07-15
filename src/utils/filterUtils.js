/**
 * filterUtils - Funciones utilitarias para manejo de filtros
 * 
 * Responsabilidades:
 * - Construir query parameters
 * - Validar filtros
 * - Transformar datos de filtros
 * 
 * @author Indiana Usados
 * @version 1.0.0
 */

/**
 * Construye query parameters a partir de un objeto de filtros
 * @param {Object} filters - Objeto con filtros { marca: "Toyota", año: 2020 }
 * @returns {string} - Query string "marca=Toyota&año=2020"
 */
export const buildQueryParams = (filters) => {
    if (!filters || typeof filters !== 'object') {
        return ''
    }

    const queryParams = new URLSearchParams()
    
    Object.entries(filters).forEach(([key, value]) => {
        if (value && value !== '' && value !== null && value !== undefined) {
            queryParams.append(key, value.toString())
        }
    })
    
    return queryParams.toString()
}

/**
 * Valida si un objeto de filtros tiene valores válidos
 * @param {Object} filters - Objeto de filtros a validar
 * @returns {boolean} - true si tiene al menos un filtro válido
 */
export const hasValidFilters = (filters) => {
    if (!filters || typeof filters !== 'object') {
        return false
    }
    
    return Object.values(filters).some(value => 
        value && value !== '' && value !== null && value !== undefined
    )
}

/**
 * Cuenta el número de filtros activos
 * @param {Object} filters - Objeto de filtros
 * @returns {number} - Número de filtros con valores válidos
 */
export const countActiveFilters = (filters) => {
    if (!filters || typeof filters !== 'object') {
        return 0
    }
    
    return Object.values(filters).filter(value => 
        value && value !== '' && value !== null && value !== undefined
    ).length
}

/**
 * Limpia un objeto de filtros removiendo valores vacíos
 * @param {Object} filters - Objeto de filtros a limpiar
 * @returns {Object} - Objeto con solo filtros válidos
 */
export const cleanFilters = (filters) => {
    if (!filters || typeof filters !== 'object') {
        return {}
    }
    
    const cleaned = {}
    
    Object.entries(filters).forEach(([key, value]) => {
        if (value && value !== '' && value !== null && value !== undefined) {
            cleaned[key] = value
        }
    })
    
    return cleaned
}

/**
 * Compara dos objetos de filtros para ver si son iguales
 * @param {Object} filters1 - Primer objeto de filtros
 * @param {Object} filters2 - Segundo objeto de filtros
 * @returns {boolean} - true si son iguales
 */
export const areFiltersEqual = (filters1, filters2) => {
    const clean1 = cleanFilters(filters1)
    const clean2 = cleanFilters(filters2)
    
    const keys1 = Object.keys(clean1)
    const keys2 = Object.keys(clean2)
    
    if (keys1.length !== keys2.length) {
        return false
    }
    
    return keys1.every(key => clean1[key] === clean2[key])
} 