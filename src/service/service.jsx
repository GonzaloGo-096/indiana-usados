// URL base para las peticiones
const BASE_URL = 'https://c65a35e4-099e-4f66-a282-1f975219d583.mock.pstmn.io'
const BASE_URL_2 = 'https://0ce757d8-1c7a-4cec-9872-b3e45dd2d032.mock.pstmn.io'

const ITEMS_PER_PAGE = 6

const queryKeys = {
    autos: 'autos',
    auto: (id) => ['auto', id]
}

// Función para obtener autos con paginación
const getAutos = async ({ pageParam = 1 }) => {
    try {
        // Primero intentamos obtener los datos paginados del servidor
        const url = `${BASE_URL}/autos?page=${pageParam}&limit=${ITEMS_PER_PAGE}`
        const response = await fetch(url)
        
        if (!response.ok) {
            // Si la API no soporta paginación, fallamos silenciosamente
            // y usamos la implementación del cliente
            console.warn('La API no soporta paginación, usando paginación del cliente')
            return getAutosClientSide(pageParam)
        }
        
        const data = await response.json()
        
        // Verificamos si la API devolvió datos en el formato esperado
        if (Array.isArray(data)) {
            // Si la API devuelve un array, usamos paginación del cliente
            return getAutosClientSide(pageParam, data)
        }

        // Si la API devuelve un objeto con la estructura esperada
        if (data.items && Array.isArray(data.items)) {
            return {
                items: data.items,
                nextPage: data.hasMore ? pageParam + 1 : undefined,
                total: data.total || data.items.length,
                currentPage: pageParam
            }
        }

        throw new Error('Formato de respuesta no válido')
    } catch (error) {
        console.error('Error en getAutos:', error)
        // Si hay un error, intentamos con la paginación del cliente
        return getAutosClientSide(pageParam)
    }
}

// Función auxiliar para paginación del lado del cliente
const getAutosClientSide = async (pageParam, cachedData = null) => {
    try {
        // Si no tenemos datos en caché, los obtenemos
        if (!cachedData) {
            const response = await fetch(`${BASE_URL}/autos`)
            if (!response.ok) {
                throw new Error(`Error HTTP: ${response.status}`)
            }
            cachedData = await response.json()
        }

        if (!Array.isArray(cachedData)) {
            throw new Error('Los datos recibidos no son un array')
        }

        // Implementamos la paginación en el cliente
        const start = (pageParam - 1) * ITEMS_PER_PAGE
        const end = start + ITEMS_PER_PAGE
        const items = cachedData.slice(start, end)
        const hasMore = end < cachedData.length

        return {
            items,
            nextPage: hasMore ? pageParam + 1 : undefined,
            total: cachedData.length,
            currentPage: pageParam
        }
    } catch (error) {
        console.error('Error en getAutosClientSide:', error)
        throw new Error('No se pudieron cargar los vehículos')
    }
}

// Función para obtener un auto por ID
const getAutoById = async (id) => {
    if (!id) {
        throw new Error('ID de vehículo no proporcionado')
    }

    try {
        const url = `${BASE_URL_2}/autos/${id}`
        const response = await fetch(url)
        
        if (response.status === 404) {
            throw new Error('Auto no encontrado')
        }
        
        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`)
        }

        const data = await response.json()
        
        if (!data || !Array.isArray(data) || data.length === 0) {
            throw new Error('No se recibieron datos del auto')
        }

        return data[0]
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
