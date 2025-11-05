/**
 * vehiclesAdminService.js - Servicio exclusivo para operaciones de Admin (Dashboard)
 * - Usa authAxiosInstance para todas las operaciones
 * - Endpoints de creación/actualización/eliminación
 * - NOTA: GET detalle usa vehiclesService (público) por diseño
 */

import { authAxiosInstance } from '@api/axiosInstance'
import { logger } from '@utils/logger'

const vehiclesAdminService = {
  async createVehicle(formData) {
    const response = await authAxiosInstance.post('/photos/create', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      timeout: 30000
    })
    return response.data
  },

  async updateVehicle(id, formData) {
    try {
      logger.debug('admin:vehicles', 'updateVehicle', { id })
      const response = await authAxiosInstance.put(`/photos/updatephoto/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        timeout: 60000
      })
      return response.data
    } catch (error) {
      logger.error('admin:vehicles', 'update error', { status: error.response?.status, message: error.message })
      throw error
    }
  },

  async deleteVehicle(id) {
    const response = await authAxiosInstance.delete(`/photos/deletephoto/${id}`)
    return response.data
  }
}

export default vehiclesAdminService


