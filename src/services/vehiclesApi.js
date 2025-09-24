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
    logger.debug('vehicles:list', 'Fetching vehicles', endpoint)
    
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
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    return response.data
  },
  
  /**
   * Actualizar vehículo (admin)
   */
  async updateVehicle(id, formData) {
    // ✅ Probar variaciones de endpoint y método (algunos backends usan POST para actualizar)
    const endpointsToTry = [
      `/photos/updatephoto/${id}`,  // más probable
      `/photos/update/${id}`,
      `/photos/${id}`,
      `/photos/edit/${id}`,
      `/updatephoto/${id}`
    ]

    const methodsToTry = ['post', 'put'] // probar POST primero

    for (let e = 0; e < endpointsToTry.length; e++) {
      const endpoint = endpointsToTry[e]

      for (let m = 0; m < methodsToTry.length; m++) {
        const method = methodsToTry[m]
        try {
          logger.debug('vehicles:update', `Probando ${method.toUpperCase()} ${endpoint}`)
          const response = await authAxiosInstance[method](endpoint, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
          })
          if (response.status >= 200 && response.status < 300) {
            logger.info('vehicles:update', `ÉXITO ${method.toUpperCase()} ${endpoint}`, { status: response.status })
            return response.data
          }
          throw new Error(`Status no exitoso: ${response.status}`)
        } catch (error) {
          const status = error.response?.status || 'Sin respuesta'
          logger.warn('vehicles:update', `Falló ${method.toUpperCase()} ${endpoint}`, { status })
          // Continuar con siguiente método o endpoint
          if (e === endpointsToTry.length - 1 && m === methodsToTry.length - 1) {
            logger.error('vehicles:update', 'TODOS LOS ENDPOINTS/MÉTODOS FALLARON', { message: error.message })
            throw error
          }
        }
      }
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
