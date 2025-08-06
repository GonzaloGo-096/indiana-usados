/**
 * dataHelpers - Utilidades para manipulación de datos
 * 
 * Funciones:
 * - createFiltersHash: Crear hash consistente de filtros
 * - separateVehiclesFromMetadata: Separar vehículos de metadatos
 * - validateVehicleData: Validar estructura de vehículo
 * - normalizeVehicleData: Normalizar datos de vehículo
 * - cleanEmptyFilters: Limpiar filtros vacíos
 * - areFiltersEqual: Comparar filtros
 * - getActiveFilters: Obtener filtros activos
 * 
 * @author Indiana Usados
 * @version 1.0.0
 */

/**
 * ✅ CREAR HASH DE FILTROS: Para cache consistente
 * 
 * @param {Object} filters - Filtros a procesar
 * @returns {string} - Hash consistente de filtros
 */
export const createFiltersHash = (filters) => {
    if (!filters || typeof filters !== 'object') {
        return 'no-filters'
    }
    
    // ✅ ORDENAR: Claves para consistencia
    const sortedKeys = Object.keys(filters).sort()
    const sortedFilters = {}
    
    sortedKeys.forEach(key => {
        const value = filters[key]
        // ✅ IGNORAR: Valores vacíos, null, undefined
        if (value !== null && value !== undefined && value !== '') {
            sortedFilters[key] = value
        }
    })
    
    return JSON.stringify(sortedFilters)
}

/**
 * ✅ SEPARAR VEHÍCULOS DE METADATOS
 * 
 * @param {Array} data - Datos de la API
 * @returns {Object} - Vehículos y metadatos separados
 */
export const separateVehiclesFromMetadata = (data) => {
    if (!Array.isArray(data)) {
        return { vehicles: [], metadata: null }
    }
    
    const vehicles = []
    const metadata = {}
    
    data.forEach(item => {
        if (item && typeof item === 'object') {
            // ✅ DETECTAR: Metadatos por propiedades específicas
            if (item.hasNextPage !== undefined || 
                item.currentPage !== undefined || 
                item.total !== undefined) {
                Object.assign(metadata, item)
            } else if (item.id && item.marca && item.modelo) {
                // ✅ VEHÍCULO VÁLIDO
                vehicles.push(item)
            }
        }
    })
    
    return { vehicles, metadata }
}

/**
 * ✅ VALIDAR DATOS DE VEHÍCULO
 * 
 * @param {Object} vehicle - Vehículo a validar
 * @returns {boolean} - Si es válido
 */
export const validateVehicleData = (vehicle) => {
    if (!vehicle || typeof vehicle !== 'object') {
        return false
    }
    
    // ✅ CAMPOS OBLIGATORIOS
    const requiredFields = ['id', 'marca', 'modelo']
    const hasRequiredFields = requiredFields.every(field => 
        vehicle[field] !== null && 
        vehicle[field] !== undefined && 
        vehicle[field] !== ''
    )
    
    if (!hasRequiredFields) {
        return false
    }
    
    // ✅ VALIDAR TIPOS
    if (typeof vehicle.id !== 'number' && typeof vehicle.id !== 'string') {
        return false
    }
    
    if (typeof vehicle.marca !== 'string' || typeof vehicle.modelo !== 'string') {
        return false
    }
    
    return true
}

/**
 * ✅ NORMALIZAR DATOS DE VEHÍCULO
 * 
 * @param {Object} vehicle - Vehículo a normalizar
 * @returns {Object} - Vehículo normalizado
 */
export const normalizeVehicleData = (vehicle) => {
    if (!validateVehicleData(vehicle)) {
        return null
    }
    
    return {
        id: parseInt(vehicle.id) || vehicle.id,
        marca: vehicle.marca.trim(),
        modelo: vehicle.modelo.trim(),
        version: vehicle.version?.trim() || '',
        año: parseInt(vehicle.año) || vehicle.año || null,
        precio: parseFloat(vehicle.precio) || vehicle.precio || 0,
        kilometros: parseInt(vehicle.kilometros) || vehicle.kilometros || 0,
        transmision: vehicle.transmision || '',
        combustible: vehicle.combustible || '',
        color: vehicle.color || '',
        imagenes: Array.isArray(vehicle.imagenes) ? vehicle.imagenes : [],
        descripcion: vehicle.descripcion || '',
        features: Array.isArray(vehicle.features) ? vehicle.features : [],
        ubicacion: vehicle.ubicacion || '',
        estado: vehicle.estado || 'disponible',
        fechaCreacion: vehicle.fechaCreacion || new Date().toISOString()
    }
}

/**
 * ✅ LIMPIAR FILTROS VACÍOS
 * 
 * @param {Object} filters - Filtros a limpiar
 * @returns {Object} - Filtros limpios
 */
export const cleanEmptyFilters = (filters) => {
    if (!filters || typeof filters !== 'object') {
        return {}
    }
    
    const cleanFilters = {}
    
    Object.entries(filters).forEach(([key, value]) => {
        // ✅ IGNORAR: Valores vacíos
        if (value !== null && 
            value !== undefined && 
            value !== '' && 
            value !== 0) {
            cleanFilters[key] = value
        }
    })
    
    return cleanFilters
}

/**
 * ✅ COMPARAR FILTROS
 * 
 * @param {Object} filters1 - Primer conjunto de filtros
 * @param {Object} filters2 - Segundo conjunto de filtros
 * @returns {boolean} - Si son iguales
 */
export const areFiltersEqual = (filters1, filters2) => {
    const hash1 = createFiltersHash(filters1)
    const hash2 = createFiltersHash(filters2)
    
    return hash1 === hash2
}

/**
 * ✅ OBTENER FILTROS ACTIVOS
 * 
 * @param {Object} filters - Filtros a analizar
 * @returns {Object} - Solo filtros con valores
 */
export const getActiveFilters = (filters) => {
    return cleanEmptyFilters(filters)
}

/**
 * ✅ CONTAR FILTROS ACTIVOS
 * 
 * @param {Object} filters - Filtros a contar
 * @returns {number} - Cantidad de filtros activos
 */
export const countActiveFilters = (filters) => {
    const activeFilters = getActiveFilters(filters)
    return Object.keys(activeFilters).length
}

/**
 * ✅ FORMATEAR PRECIO
 * 
 * @param {number} price - Precio a formatear
 * @returns {string} - Precio formateado
 */
export const formatPrice = (price) => {
    if (!price || isNaN(price)) {
        return '$0'
    }
    
    return new Intl.NumberFormat('es-AR', {
        style: 'currency',
        currency: 'ARS',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(price)
}

/**
 * ✅ FORMATEAR KILOMETRAJE
 * 
 * @param {number} kilometers - Kilometraje a formatear
 * @returns {string} - Kilometraje formateado
 */
export const formatKilometers = (kilometers) => {
    if (!kilometers || isNaN(kilometers)) {
        return '0 km'
    }
    
    return new Intl.NumberFormat('es-AR').format(kilometers) + ' km'
}

/**
 * ✅ OBTENER AÑO ACTUAL
 * 
 * @returns {number} - Año actual
 */
export const getCurrentYear = () => {
    return new Date().getFullYear()
}

/**
 * ✅ GENERAR RANGO DE AÑOS
 * 
 * @param {number} startYear - Año de inicio
 * @param {number} endYear - Año de fin
 * @returns {Array} - Array de años
 */
export const generateYearRange = (startYear, endYear) => {
    const years = []
    for (let year = startYear; year <= endYear; year++) {
        years.push(year)
    }
    return years
} 