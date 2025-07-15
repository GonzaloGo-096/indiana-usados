// Importar datos mock locales
import { 
    mockVehicles, 
    filterVehicles, 
    paginateVehicles, 
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
 * @param {number} params.pageParam - Página actual
 * @param {Object} params.filters - Objeto de filtros
 * @returns {Promise<Object>} - Datos de vehículos
 */
const getAutos = async ({ pageParam = 1, filters = {} }) => {
    try {
        console.log('🌐 Simulando petición al backend con filtros:', filters)
        console.log('🔍 Filtros aplicados:', filters)
        
        // Simular delay de red
        await simulateNetworkDelay(300)
        
        // Filtrar vehículos según los filtros
        let filteredVehicles = mockVehicles
        
        if (Object.keys(filters).length > 0) {
            filteredVehicles = filterVehicles(mockVehicles, filters)
            console.log(`📊 Vehículos filtrados: ${filteredVehicles.length} de ${mockVehicles.length}`)
        }
        
        // Paginar resultados
        const paginatedData = paginateVehicles(filteredVehicles, pageParam, ITEMS_PER_PAGE)
        
        console.log('📦 Respuesta del mock:', paginatedData)
        
        return paginatedData
    } catch (error) {
        console.error('❌ Error en getAutos:', error)
        throw new Error(`No se pudieron cargar los vehículos: ${error.message}`)
    }
}

// Función para obtener un auto por ID (usando mock local)
const getAutoById = async (id) => {
    if (!id) {
        throw new Error('ID de vehículo no proporcionado')
    }

    try {
        console.log(`🔍 Buscando vehículo con ID: ${id}`)
        
        // Simular delay de red
        await simulateNetworkDelay(200)
        
        // Buscar vehículo en mock data
        const vehicle = mockVehicles.find(v => v.id === parseInt(id))
        
        if (!vehicle) {
            throw new Error('Auto no encontrado')
        }
        
        console.log('📦 Vehículo encontrado:', vehicle)
        return vehicle
    } catch (error) {
        console.error(`Error al cargar auto ${id}:`, error)
        throw error
    }
}

// Exportar todas las funciones y claves de consulta
const autoService = {
    getAutos,
    getAutoById,
    queryKeys,
    ITEMS_PER_PAGE
}

export { queryKeys }
export default autoService
