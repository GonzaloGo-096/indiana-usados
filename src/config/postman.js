/**
 * postman.js - Configuración para Postman Mock
 * 
 * Características:
 * - URLs de endpoints de Postman dinámicas
 * - Configuración de headers
 * - Timeouts y reintentos configurables
 * 
 * @author Indiana Usados
 * @version 2.0.0 - Variables de entorno dinámicas
 */

// ✅ CONFIGURACIÓN DINÁMICA DE POSTMAN MOCK
export const POSTMAN_CONFIG = {
    // ✅ URL BASE DINÁMICA DE POSTMAN
    baseURL: import.meta.env.VITE_POSTMAN_MOCK_URL || 'https://c65a35e4-099e-4f66-a282-1f975219d583.mock.pstmn.io',
    
    // ✅ URL BASE PARA DETALLE (si existe)
    detailBaseURL: import.meta.env.VITE_POSTMAN_DETAIL_URL || import.meta.env.VITE_POSTMAN_MOCK_URL || 'https://0ce757d8-1c7a-4cec-9872-b3e45dd2d032.mock.pstmn.io',
    
    // ✅ ENDPOINTS PRINCIPALES
    endpoints: {
        // ✅ PEDIDO PRINCIPAL (GET sin filtros)
        vehicles: '/api/vehicles',
        
        // ✅ PEDIDO CON FILTROS (POST con filtros)
        vehiclesWithFilters: '/api/vehicles',
        
        // ✅ PEDIDO DE DETALLE (GET por ID)
        vehicleDetail: (id) => `/api/vehicles/${id}`
    },
    
    // ✅ HEADERS RECOMENDADOS
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Cache-Control': 'no-cache'
    },
    
    // ✅ CONFIGURACIÓN DE TIMEOUT DINÁMICA
    timeout: parseInt(import.meta.env.VITE_API_TIMEOUT) || 10000, // 10 segundos
    
    // ✅ CONFIGURACIÓN DE REINTENTOS
    retries: parseInt(import.meta.env.VITE_API_RETRIES) || 3,
    retryDelay: parseInt(import.meta.env.VITE_API_RETRY_DELAY) || 1000 // 1 segundo
}

// ✅ DATOS DE PRUEBA PARA POSTMAN (actualizados dinámicamente)
export const POSTMAN_TEST_DATA = {
    // ✅ PEDIDO PRINCIPAL - GET /api/vehicles?page=1&limit=6
    mainRequest: {
        method: 'GET',
        url: `${POSTMAN_CONFIG.baseURL}/api/vehicles`,
        params: {
            page: 1,
            limit: 6
        },
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        }
    },
    
    // ✅ PEDIDO CON FILTROS - POST /api/vehicles
    filterRequest: {
        method: 'POST',
        url: `${POSTMAN_CONFIG.baseURL}/api/vehicles`,
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: {
            filters: {
                marca: 'Toyota',
                precioMin: 5000000,
                precioMax: 12000000
            },
            pagination: {
                page: 1,
                limit: 6
            }
        }
    }
}

// ✅ LOGGING DE CONFIGURACIÓN (solo en desarrollo)
if (import.meta.env.DEV) {
    console.log('🔧 CONFIGURACIÓN POSTMAN:', {
        baseURL: POSTMAN_CONFIG.baseURL,
        detailBaseURL: POSTMAN_CONFIG.detailBaseURL,
        timeout: POSTMAN_CONFIG.timeout,
        retries: POSTMAN_CONFIG.retries,
        retryDelay: POSTMAN_CONFIG.retryDelay
    })
}

// ✅ FUNCIÓN PARA VALIDAR RESPUESTA DE POSTMAN
export const validatePostmanResponse = (response) => {
    try {
        // ✅ VERIFICAR QUE LA RESPUESTA SEA UN ARRAY
        if (!Array.isArray(response)) {
            console.warn('⚠️ Respuesta de Postman no es un array:', response)
            return false
        }
        
        // ✅ VERIFICAR QUE TENGA ELEMENTOS
        if (response.length === 0) {
            console.warn('⚠️ Respuesta de Postman está vacía')
            return false
        }
        
        // ✅ VERIFICAR ESTRUCTURA DEL PRIMER ELEMENTO
        const firstItem = response[0]
        if (!firstItem || typeof firstItem !== 'object') {
            console.warn('⚠️ Primer elemento no es un objeto válido:', firstItem)
            return false
        }
        
        // ✅ VERIFICAR CAMPOS REQUERIDOS
        const requiredFields = ['id', 'marca', 'modelo', 'precio']
        const missingFields = requiredFields.filter(field => !firstItem[field])
        
        if (missingFields.length > 0) {
            console.warn('⚠️ Campos requeridos faltantes:', missingFields)
            return false
        }
        
        console.log('✅ Respuesta de Postman válida')
        return true
        
    } catch (error) {
        console.error('❌ Error validando respuesta de Postman:', error)
        return false
    }
}

// ✅ FUNCIÓN PARA EXTRAER DATOS DE POSTMAN
export const extractPostmanData = (response, currentPage = 1) => {
    try {
        console.log('🔍 Extrayendo datos de Postman:', response)
        
        // ✅ POSTMAN: NUEVA ESTRUCTURA CON METADATOS DE PAGINACIÓN
        // El backend real debe devolver: { data: [...], total, currentPage, hasNextPage, nextPage }
        if (response && typeof response === 'object' && response.data) {
            console.log('✅ POSTMAN: Estructura con metadatos detectada')
            return {
                data: response.data || [],
                total: response.total || 0,
                currentPage: response.currentPage || currentPage,
                hasNextPage: response.hasNextPage || false,
                nextPage: response.nextPage || null
            }
        }
        
        // ✅ POSTMAN: ESTRUCTURA LEGACY (solo array)
        if (Array.isArray(response)) {
            console.log('⚠️ POSTMAN: Estructura legacy detectada, convirtiendo...')
            const vehicles = response.filter(item => 
                item && 
                typeof item === 'object' && 
                item.id && 
                item.marca && 
                item.modelo
            )
            
            console.log('📊 Vehículos extraídos:', vehicles.length)
            
            // ✅ POSTMAN LEGACY: SIMULAR PAGINACIÓN
            const totalVehicles = vehicles.length
            const limit = 6
            
            // ✅ POSTMAN LEGACY: SIEMPRE PRIMERA PÁGINA
            const hasNextPage = totalVehicles > limit
            const nextPage = hasNextPage ? 2 : null
            
            console.log('📈 Metadatos simulados para legacy:', {
                total: totalVehicles,
                currentPage: 1,
                hasNextPage,
                nextPage
            })
            
            return {
                data: vehicles,
                total: totalVehicles,
                currentPage: 1,
                hasNextPage,
                nextPage
            }
        }
        
        console.error('❌ POSTMAN: Estructura de respuesta desconocida')
        return {
            data: [],
            total: 0,
            currentPage: 1,
            hasNextPage: false,
            nextPage: null
        }
        
    } catch (error) {
        console.error('❌ Error extrayendo datos de Postman:', error)
        return {
            data: [],
            total: 0,
            currentPage: 1,
            hasNextPage: false,
            nextPage: null
        }
    }
} 