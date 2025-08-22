/**
 * vehiclesApi.js - API Service para vehículos con configuración dinámica
 * 
 * Características:
 * - Configuración dinámica basada en variables de entorno
 * - Estrategia GET/POST unificada
 * - Validación de respuestas
 * - Mock local implementado
 * - Logging específico para debugging
 * 
 * @author Indiana Usados
 * @version 5.0.0 - Mock local implementado
 */

import axiosInstance, { detailAxiosInstance } from './axiosInstance'
import { validatePostmanResponse, extractPostmanData } from '@config/postman'
import { getMockVehicles, getMockVehicleById } from './mockData'

// ✅ CONFIGURACIÓN DINÁMICA DE ENTORNO
const USE_MOCK_API = import.meta.env.VITE_USE_MOCK_API === 'true'
const USE_POSTMAN_MOCK = import.meta.env.VITE_USE_POSTMAN_MOCK === 'true'
const IS_DEVELOPMENT = import.meta.env.DEV

// ✅ LOGGING DE CONFIGURACIÓN (solo en desarrollo)
if (IS_DEVELOPMENT) {
    console.log('🔧 CONFIGURACIÓN VEHICLES API:', {
        useMock: USE_MOCK_API,
        usePostman: USE_POSTMAN_MOCK,
        environment: import.meta.env.MODE
    })
}

/**
 * Servicio principal para vehículos
 */
class VehiclesApiService {
    /**
     * Obtener vehículos (GET sin filtros)
     * @param {Object} params - Parámetros de paginación
     * @returns {Promise<Object>} - Respuesta con datos y metadatos
     */
    async getVehiclesMain({ limit = 6, cursor = null } = {}) {
        console.log('🚀 DEBUG: getVehiclesMain ejecutándose', { limit, cursor, USE_MOCK_API, USE_POSTMAN_MOCK })
        
        // ✅ DETECTAR ENTORNO Y USAR ESTRATEGIA APROPIADA
        if (USE_MOCK_API && !USE_POSTMAN_MOCK) {
            // ✅ MOCK LOCAL IMPLEMENTADO
            console.log('🔄 MOCK LOCAL: Obteniendo vehículos sin filtros', { limit, cursor })
            const result = getMockVehicles(cursor ? 1 : 1, limit) // Mantener compatibilidad con mock
            console.log('✅ MOCK LOCAL: Vehículos obtenidos', result)
            return result
        }
        
        console.log('🔗 DEBUG: Llamando al BACKEND REAL')
        console.log('🌐 DEBUG: URL completa:', `${axiosInstance.defaults.baseURL}/photos/getallphotos`)
        console.log('📡 DEBUG: Parámetros enviados:', { limit, cursor })
        
        try {
            // ✅ POSTMAN MOCK O BACKEND REAL
            const response = await axiosInstance.get('/photos/getallphotos', {
                params: { limit, ...(cursor && { cursor }) }
            })
            
            console.log('✅ DEBUG: Respuesta del backend recibida:', {
                status: response.status,
                statusText: response.statusText,
                data: response.data,
                headers: response.headers
            })
            
            // ✅ VALIDAR RESPUESTA SEGÚN ENTORNO
            if (USE_POSTMAN_MOCK) {
                if (validatePostmanResponse(response.data)) {
                    const result = extractPostmanData(response.data, page)
                    return result
                }
                throw new Error('Respuesta inválida de Postman')
            }
            
            // ✅ BACKEND REAL - asumir estructura estándar
            return response.data
            
        } catch (error) {
            console.error('❌ DEBUG: Error en llamada al backend:', {
                message: error.message,
                status: error.response?.status,
                statusText: error.response?.statusText,
                data: error.response?.data,
                config: error.config
            })
            throw error
        }
    }

    /**
     * Obtener vehículos con filtros (POST con filtros)
     * @param {Object} params - Parámetros de filtros y paginación
     * @returns {Promise<Object>} - Respuesta con datos filtrados
     */
    async getVehiclesWithFilters({ limit = 6, cursor = null, filters = {} } = {}) {
        if (IS_DEVELOPMENT) {
            console.log('🔍 API: Intentando obtener vehículos con filtros', { filters, limit, cursor })
        }
        
        // ✅ DETECTAR ENTORNO Y USAR ESTRATEGIA APROPIADA
        if (USE_MOCK_API && !USE_POSTMAN_MOCK) {
            // ✅ MOCK LOCAL IMPLEMENTADO CON FILTROS
            console.log('🔄 MOCK LOCAL: Aplicando filtros', filters)
            const result = getMockVehicles(cursor ? 1 : 1, limit, filters) // Mantener compatibilidad con mock
            if (IS_DEVELOPMENT) {
                console.log('✅ MOCK LOCAL: Vehículos filtrados obtenidos', result)
            }
            return result
        }
        
        // ✅ POSTMAN MOCK O BACKEND REAL
        const response = await axiosInstance.post('/photos/getallphotos', {
            filters,
            pagination: { limit, ...(cursor && { cursor }) }
        })
        
        if (IS_DEVELOPMENT) {
            console.log('📦 API: Respuesta con filtros recibida', response.data)
        }
        
        // ✅ VALIDAR RESPUESTA SEGÚN ENTORNO
        if (USE_POSTMAN_MOCK) {
            if (validatePostmanResponse(response.data)) {
                const result = extractPostmanData(response.data, page)
                if (IS_DEVELOPMENT) {
                    console.log('✅ API: Datos filtrados extraídos correctamente', result)
                }
                return result
            }
            console.error('❌ API: Respuesta con filtros inválida')
            throw new Error('Respuesta inválida de Postman con filtros')
        }
        
        // ✅ BACKEND REAL - asumir estructura estándar
        return response.data
    }

    /**
     * Obtener vehículo por ID (GET por ID)
     * @param {string|number} id - ID del vehículo
     * @returns {Promise<Object>} - Datos del vehículo
     */
    async getVehicleById(id) {
        try {
            if (IS_DEVELOPMENT) {
                console.log('🔍 DEBUG: Iniciando getVehicleById con ID:', id)
            }
            
            // ✅ DETECTAR ENTORNO Y USAR ESTRATEGIA APROPIADA
            if (USE_MOCK_API && !USE_POSTMAN_MOCK) {
                // ✅ MOCK LOCAL IMPLEMENTADO
                console.log('🔄 MOCK LOCAL: Buscando vehículo por ID', id)
                const vehicle = getMockVehicleById(id)
                if (vehicle) {
                    if (IS_DEVELOPMENT) {
                        console.log('✅ MOCK LOCAL: Vehículo encontrado', vehicle)
                    }
                    return vehicle
                } else {
                    throw new Error(`Vehículo con ID ${id} no encontrado en mock local`)
                }
            }
            
            // ✅ POSTMAN MOCK O BACKEND REAL
            if (IS_DEVELOPMENT) {
                console.log('🔗 DEBUG: URL completa:', `${detailAxiosInstance.defaults.baseURL}/photos/getonephoto/${id}`)
            }
            
            const response = await detailAxiosInstance.get(`/photos/getonephoto/${id}`)
            
            if (IS_DEVELOPMENT) {
                console.log('✅ DEBUG: Respuesta recibida:', response)
                console.log('📦 DEBUG: response.data:', response.data)
                console.log('📦 DEBUG: response.status:', response.status)
            }
            
            // ✅ VALIDAR RESPUESTA SEGÚN ENTORNO
            if (USE_POSTMAN_MOCK) {
                // Validar respuesta de Postman
                if (response.data && response.data.id) {
                    if (IS_DEVELOPMENT) {
                        console.log('✅ DEBUG: Vehículo encontrado:', response.data)
                        console.log('🔍 DEBUG: Campos especiales:', {
                            frenos: response.data.frenos,
                            turbo: response.data.turbo,
                            llantas: response.data.llantas,
                            HP: response.data.HP
                        })
                    }
                    return response.data
                }
                
                // Manejar caso donde Postman devuelve array
                if (Array.isArray(response.data) && response.data.length > 0) {
                    const vehicle = response.data.find(item => item.id === parseInt(id))
                    if (vehicle) {
                        if (IS_DEVELOPMENT) {
                            console.log('✅ DEBUG: Vehículo encontrado en array:', vehicle)
                        }
                        return vehicle
                    }
                }
                
                console.error('❌ DEBUG: Vehículo no encontrado')
                throw new Error(`Vehículo con ID ${id} no encontrado en Postman`)
            }
            
            // ✅ BACKEND REAL - asumir estructura estándar
            return response.data
            
        } catch (error) {
            if (IS_DEVELOPMENT) {
                console.error('❌ DEBUG: Error en getVehicleById:', error)
                console.error('❌ DEBUG: Error completo:', {
                    message: error.message,
                    status: error.response?.status,
                    statusText: error.response?.statusText,
                    data: error.response?.data,
                    config: error.config
                })
            }
            throw error
        }
    }

    /**
     * Método unificado para obtener vehículos
     * @param {Object} params - Parámetros de consulta
     * @returns {Promise<Object>} - Respuesta con datos
     */
    async getVehicles({ limit = 6, cursor = null, filters = {} } = {}) {
        if (Object.keys(filters).length === 0) {
            return this.getVehiclesMain({ limit, cursor })
        } else {
            return this.getVehiclesWithFilters({ limit, cursor, filters })
        }
    }

    /**
     * Aplicar filtros a vehículos
     * @param {Object} filters - Filtros a aplicar
     * @param {Object} pagination - Parámetros de paginación
     * @returns {Promise<Object>} - Respuesta con datos filtrados
     */
    async applyFilters(filters, pagination = { limit: 6, cursor: null }) {
        return this.getVehiclesWithFilters({
            limit: pagination.limit,
            cursor: pagination.cursor,
            filters
        })
    }
}

export default new VehiclesApiService() 