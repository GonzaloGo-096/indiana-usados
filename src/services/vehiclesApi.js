/**
 * vehiclesApi.js - Servicio unificado de vehículos
 * 
 * Maneja TODAS las operaciones de vehículos (públicas y admin)
 * Usa las instancias de axios existentes optimizadas
 * 
 * @author Indiana Usados
 * @version 2.1.0 - Simplificado y optimizado
 */

import axiosInstance from '@api/axiosInstance'
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
    // Validaciones y normalizaciones ligeras
    const safeLimit = Number.isFinite(Number(limit)) && Number(limit) > 0 ? Number(limit) : 12
    const safeCursor = Number.isFinite(Number(cursor)) && Number(cursor) > 0 ? Number(cursor) : 1
    const urlParams = buildFiltersForBackend(filters)
    urlParams.set('limit', String(safeLimit))
    urlParams.set('cursor', String(safeCursor))
    
    const endpoint = `/photos/getallphotos?${urlParams.toString()}`
    logger.log('Fetching vehicles:', endpoint)
    
    const response = await axiosInstance.get(endpoint, { signal })
    return response.data
  },
  
  /**
   * Obtener vehículo por ID (público)
   */
  async getVehicleById(id) {
    const isValidId = (id !== null && id !== undefined && `${id}`.trim() !== '')
    if (!isValidId) {
      throw new Error('ID de vehículo inválido')
    }
    const response = await axiosInstance.get(`/photos/getonephoto/${id}`)
    const data = response?.data && response.data.getOnePhoto ? response.data.getOnePhoto : response?.data
    return data
  },
  
}

export default vehiclesService
