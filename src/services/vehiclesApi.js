/**
 * vehiclesApi.js - Servicio unificado de vehículos
 * 
 * Maneja TODAS las operaciones de vehículos (públicas y admin)
 * Usa las instancias de axios existentes optimizadas
 * 
 * @author Indiana Usados
 * @version 2.1.0 - Simplificado y optimizado
 */

import axiosInstance, { authAxiosInstance } from '@api/axiosInstance'
import { buildFiltersForBackend } from '@utils/filters'
import { logger } from '@utils/logger'

/**
 * Servicio de vehículos unificado
 */
export const vehiclesService = {
  /**
   * Obtener lista de vehículos (público)
   */
  async getVehicles({ filters = {}, limit = 12, cursor = null, signal } = {}) {
    const urlParams = buildFiltersForBackend(filters)
    urlParams.set('limit', String(limit))
    
    if (!cursor) cursor = 1
    urlParams.set('cursor', String(cursor))
    
    const endpoint = `/photos/getallphotos?${urlParams.toString()}`
    logger.log('Fetching vehicles:', endpoint)
    
    const response = await axiosInstance.get(endpoint, { signal })
    return response.data
  },
  
  /**
   * Obtener vehículo por ID (público)
   */
  async getVehicleById(id) {
    const response = await axiosInstance.get(`/photos/getonephoto/${id}`)
    return response.data
  },
  
  /**
   * Crear vehículo (admin)
   */
  async createVehicle(formData) {
    const response = await authAxiosInstance.post('/photos/create', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      timeout: 30000 // ✅ 30 segundos para subir múltiples imágenes
    })
    return response.data
  },
  
  /**
   * Actualizar vehículo (admin)
   */
  async updateVehicle(id, formData) {
    try {
      logger.debug('vehicles:update', 'Actualizando vehículo', { id, endpoint: '/photos/updatephoto/' })
      
      // ✅ LOGGING DETALLADO DEL FORMDATA
      const fileCount = Array.from(formData.entries()).filter(([key, value]) => value instanceof File).length
      logger.debug('vehicles:update', 'FormData contiene archivos', { fileCount })
      
      const response = await authAxiosInstance.put(`/photos/updatephoto/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        timeout: 60000 // ✅ 60 segundos para actualizar con múltiples imágenes
      })
      logger.info('vehicles:update', 'Vehículo actualizado exitosamente', { status: response.status })
      return response.data
    } catch (error) {
      const status = error.response?.status || 'Sin respuesta'
      const isTimeout = error.code === 'ECONNABORTED' || error.message?.includes('timeout')
      
      logger.error('vehicles:update', 'Error al actualizar vehículo', {
        status,
        message: error.message,
        isTimeout,
        code: error.code
      })
      throw error
    }
  },
  
  /**
   * Eliminar vehículo (admin)
   */
  async deleteVehicle(id) {
    const response = await authAxiosInstance.delete(`/photos/deletephoto/${id}`)
    return response.data
  }
}

// ✅ MANTENER COMPATIBILIDAD
export const getMainVehicles = vehiclesService.getVehicles
export const getVehicleById = vehiclesService.getVehicleById
export const vehiclesApi = {
  getMainVehicles,
  getVehicles: getMainVehicles,
  getVehicleById,
  ...vehiclesService
}

export default vehiclesService
