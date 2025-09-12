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
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    return response.data
  },
  
  /**
   * Actualizar vehículo (admin)
   */
  async updateVehicle(id, formData) {
    const response = await authAxiosInstance.post(`/photos/updatephoto/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    return response.data
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
