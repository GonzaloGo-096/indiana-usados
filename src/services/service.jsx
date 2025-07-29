// Importar datos mock locales
import { 
    mockVehicles, 
    filterVehicles, 
    simulateNetworkDelay 
} from './mockData'

// URL base para las peticiones (mantener para compatibilidad)
const BASE_URL = 'https://c65a35e4-099e-4f66-a282-1f975219d583.mock.pstmn.io'
const BASE_URL_2 = 'https://0ce757d8-1c7a-4cec-9872-b3e45dd2d032.mock.pstmn.io'

const ITEMS_PER_PAGE = 6

const queryKeys = {
    autos: 'autos',
    auto: (id) => ['auto', id]
}

/**
 * Función para obtener autos con paginación y filtros (usando mock local)
 * @param {Object} params - Parámetros de la petición
 * @param {number} params.page - Página actual
 * @param {Object} params.filters - Objeto de filtros
 * @returns {Promise<Object>} - Datos de vehículos
 */
const getAutos = async ({ filters = {}, page = 1 } = {}) => {
    try {
        // Simular delay de red
        await simulateNetworkDelay(300)
        
        // Filtrar vehículos según los filtros
        let filteredVehicles = mockVehicles
        
        if (Object.keys(filters).length > 0) {
            filteredVehicles = filterVehicles(mockVehicles, filters)
        }
        
        // Simular paginación por páginas (compatible con backend real)
        const limit = 6
        const startIndex = (page - 1) * limit
        const endIndex = startIndex + limit
        const paginatedVehicles = filteredVehicles.slice(startIndex, endIndex)
        
        return {
            data: paginatedVehicles,           // ✅ Compatible con backend real
            docs: paginatedVehicles,           // ✅ Fallback para backend real
            items: paginatedVehicles,          // ✅ Fallback para compatibilidad
            hasNextPage: endIndex < filteredVehicles.length,  // ✅ Nueva estructura
            nextPage: endIndex < filteredVehicles.length ? page + 1 : null,  // ✅ Nueva estructura
            total: filteredVehicles.length,    // ✅ Total de elementos filtrados
            totalDocs: filteredVehicles.length, // ✅ Fallback para backend real
            currentPage: page,                 // ✅ Página actual
            page: page                         // ✅ Fallback para backend real
        }
    } catch (error) {
        console.error('❌ Error en getAutos:', error)
        throw new Error(`No se pudieron cargar los vehículos: ${error.message}`)
    }
}

/**
 * Función para aplicar filtros via POST al backend
 * @param {Object} filters - Filtros a aplicar
 * @param {Object} options - Opciones de paginación
 * @param {number} options.page - Página actual
 * @param {number} options.limit - Elementos por página
 * @returns {Promise<Object>} - Datos filtrados del backend
 */
const applyFilters = async (filters, { page = 1, limit = 6 } = {}) => {
    try {
        // Simular petición POST al backend
        await simulateNetworkDelay(500)
        
        // Por ahora, simulamos la respuesta del backend
        const filteredVehicles = filterVehicles(mockVehicles, filters)
        
        // ✅ AGREGADO: Simular paginación por páginas
        const startIndex = (page - 1) * limit
        const endIndex = startIndex + limit
        const paginatedVehicles = filteredVehicles.slice(startIndex, endIndex)
        
        return {
            // ✅ COMPATIBLE: Estructura nueva
            data: paginatedVehicles,
            docs: paginatedVehicles,
            items: paginatedVehicles,
            hasNextPage: endIndex < filteredVehicles.length,
            nextPage: endIndex < filteredVehicles.length ? page + 1 : null,
            total: filteredVehicles.length,
            totalDocs: filteredVehicles.length,
            currentPage: page,
            page: page,
            
            // ✅ MANTENER: Compatibilidad con estructura anterior
            filteredCount: filteredVehicles.length,
            totalCount: mockVehicles.length,
            filters: filters,
            timestamp: new Date().toISOString()
        }
    } catch (error) {
        console.error('❌ Error al aplicar filtros:', error)
        throw new Error(`Error al aplicar filtros: ${error.message}`)
    }
}

/**
 * Función para obtener la lista completa (sin filtros)
 * @returns {Promise<Object>} - Lista completa de vehículos
 */
const getAllVehicles = async () => {
    try {
        // Simular petición GET al backend
        await simulateNetworkDelay(200)
        
        // En el futuro, esto será una petición GET real:
        // const response = await fetch(`${API_BASE_URL}/vehicles`)
        // return response.json()
        
        return {
            items: mockVehicles,
            total: mockVehicles.length,
            timestamp: new Date().toISOString()
        }
    } catch (error) {
        console.error('❌ Error al obtener lista completa:', error)
        throw new Error(`Error al obtener lista completa: ${error.message}`)
    }
}

// Función para obtener un auto por ID (usando mock local)
const getAutoById = async (id) => {
    if (!id) {
        throw new Error('ID de vehículo no proporcionado')
    }

    try {
        // Simular delay de red
        await simulateNetworkDelay(200)
        
        // Buscar vehículo en mock data
        const vehicle = mockVehicles.find(v => v.id === parseInt(id))
        
        if (!vehicle) {
            throw new Error('Auto no encontrado')
        }
        
        return vehicle
    } catch (error) {
        console.error(`Error al cargar auto ${id}:`, error)
        throw error
    }
}

// Exportar todas las funciones y claves de consulta
const autoService = {
    getAutos,
    applyFilters, // Nueva función para aplicar filtros
    getAllVehicles, // Nueva función para obtener lista completa
    getAutoById,
    queryKeys,
    ITEMS_PER_PAGE
}

export { queryKeys }
export default autoService
