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

// ✅ CONFIGURACIÓN DE ENTORNO
const IS_DEVELOPMENT = import.meta.env.DEV

// ✅ LOGGING DE CONFIGURACIÓN (solo en desarrollo)
if (IS_DEVELOPMENT) {
    console.log('🔧 CONFIGURACIÓN VEHICLES API:', {
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
        // ✅ DEBUG TEMPORALMENTE DESACTIVADO PARA INVESTIGAR BUCLE INFINITO
        
        try {
            const response = await axiosInstance.get('/photos/getallphotos', {
                params: { limit, ...(cursor && { cursor }) }
            })
            
            // ✅ DEBUG TEMPORALMENTE DESACTIVADO PARA INVESTIGAR BUCLE INFINITO
            
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
        
        const response = await axiosInstance.post('/photos/getallphotos', {
            filters,
            pagination: { limit, ...(cursor && { cursor }) }
        })
        
        if (IS_DEVELOPMENT) {
            console.log('📦 API: Respuesta con filtros recibida', response.data)
        }
        
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
            
            if (IS_DEVELOPMENT) {
                console.log('🔗 DEBUG: URL completa:', `${detailAxiosInstance.defaults.baseURL}/photos/getonephoto/${id}`)
            }
            
            const response = await detailAxiosInstance.get(`/photos/getonephoto/${id}`)
            
            if (IS_DEVELOPMENT) {
                console.log('✅ DEBUG: Respuesta recibida:', response)
                console.log('📦 DEBUG: response.data:', response.data)
                console.log('📦 DEBUG: response.status:', response.status)
            }
            
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