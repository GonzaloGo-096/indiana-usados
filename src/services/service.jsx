// Importar datos mock locales
import { 
    mockVehicles, 
    simulateNetworkDelay 
} from './mockData'

// Importar función de filtrado centralizada
import { filterVehicles } from '../utils/filterUtils'

// URL base para las peticiones (mantener para compatibilidad)
const BASE_URL = 'https://c65a35e4-099e-4f66-a282-1f975219d583.mock.pstmn.io'
const BASE_URL_2 = 'https://0ce757d8-1c7a-4cec-9872-b3e45dd2d032.mock.pstmn.io'

const ITEMS_PER_PAGE = 6

const queryKeys = {
    autos: 'autos',
    auto: (id) => ['auto', id]
}

/**
 * 🚀 NUEVA FUNCIÓN: Obtener vehículos con paginación real desde Postman mock
 * @param {Object} params - Parámetros de la petición
 * @param {number} params.page - Página actual (1, 2, 3...)
 * @param {number} params.limit - Cantidad de autos por página
 * @param {Object} params.filters - Objeto de filtros
 * @returns {Promise<Object>} - Datos de vehículos con paginación
 */
const getVehiclesWithPagination = async ({ page = 1, limit = 6, filters = {} }) => {
    try {
        console.log('🌐 Petición a Postman mock con paginación:', { page, limit, filters })
        
        // Simular delay de red
        await simulateNetworkDelay(300)
        
        // Filtrar vehículos según los filtros
        let filteredVehicles = mockVehicles
        
        if (Object.keys(filters).length > 0) {
            filteredVehicles = filterVehicles(mockVehicles, filters)
            console.log(`📊 Vehículos filtrados: ${filteredVehicles.length} de ${mockVehicles.length}`)
        }
        
        // Calcular paginación real
        const total = filteredVehicles.length
        const totalPages = Math.ceil(total / limit)
        const startIndex = (page - 1) * limit
        const endIndex = startIndex + limit
        const items = filteredVehicles.slice(startIndex, endIndex)
        
        // Determinar si hay más páginas
        const hasNextPage = page < totalPages
        
        console.log(`📄 Página ${page}/${totalPages}, mostrando ${items.length} autos`)
        
        return {
            items: items,
            total: total,
            page: page,
            limit: limit,
            totalPages: totalPages,
            hasNextPage: hasNextPage,
            hasMore: hasNextPage, // Compatibilidad con código existente
            nextPage: hasNextPage ? page + 1 : undefined
        }
    } catch (error) {
        console.error('❌ Error en getVehiclesWithPagination:', error)
        throw new Error(`No se pudieron cargar los vehículos: ${error.message}`)
    }
}

/**
 * 🔄 FUNCIÓN FUTURA: Para conectar con backend real
 * Solo cambiar la URL cuando tengas el backend real
 */
const getVehiclesFromRealBackend = async ({ page = 1, limit = 6, filters = {} }) => {
    try {
        // Construir parámetros de query
        const params = new URLSearchParams({
            page: page.toString(),
            limit: limit.toString(),
            ...filters
        })
        
        const response = await fetch(`${BASE_URL}/vehicles?${params}`)
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`)
        }
        
        return response.json()
    } catch (error) {
        console.error('❌ Error en getVehiclesFromRealBackend:', error)
        throw error
    }
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
        
        // Filtrar vehículos según los filtros usando función centralizada
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
        
        // Por ahora, simulamos la respuesta del backend usando función centralizada
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
    ITEMS_PER_PAGE,
    getVehiclesWithPagination, // Nueva función para paginación real
    getVehiclesFromRealBackend // Nueva función para backend real
}

export { queryKeys }
export default autoService
