import { vehiclesApi } from '@api';

/**
 * Servicio para operaciones con vehículos
 */
export const carsService = {
  /**
   * Obtiene página de vehículos con paginación por cursor
   * @param {number} cursor - Cursor de paginación (default: 1)
   * @param {number} limit - Límite de elementos por página (default: 8)
   * @returns {Promise} Respuesta del backend con vehículos y metadatos de paginación
   */
  getAllCarsPage: async (cursor = 1, limit = 8) => {
    try {
      const response = await vehiclesApi.getVehicles({});
      return response;
    } catch (error) {
      // Propagar error para que lo maneje el hook de error
      throw error;
    }
  },
};

export default carsService; 