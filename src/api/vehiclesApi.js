import axiosInstance, { createEndpoint, handleApiError, validateResponse } from './axiosInstance';

// Endpoints de la API - ADAPTAR A TU BACKEND REAL
const ENDPOINTS = {
    VEHICLES: '/api/autos',           // GET - Lista de vehículos
    VEHICLE_DETAIL: (id) => `/api/autos/${id}`, // GET - Detalle de vehículo
    VEHICLES_FILTER: '/api/autos/filter', // POST - Aplicar filtros
};

/**
 * Servicio de API para vehículos
 * Maneja todas las operaciones relacionadas con vehículos
 */
class VehiclesApiService {
    /**
     * Obtener lista de vehículos con paginación
     * @param {Object} params - Parámetros de paginación
     * @param {number} params.limit - Número de elementos por página
     * @param {number} params.page - Número de página
     * @param {Object} params.filters - Filtros opcionales
     * @returns {Promise<Object>} - Respuesta con datos y paginación
     */
    async getVehicles({ limit = 6, page = 1, filters = {} } = {}) {
        try {
            const params = {
                limit,
                page,
                // Si hay filtros, enviarlos como query params
                ...(Object.keys(filters).length > 0 && { 
                    ...filters 
                })
            };

            const response = await axiosInstance.get(ENDPOINTS.VEHICLES, { params });
            const data = validateResponse(response);

            // Adaptar respuesta a formato esperado
            return {
                data: data.docs || data.data || data.items || [],
                hasNextPage: data.hasNextPage || false,
                nextPage: data.nextPage || null,
                total: data.totalDocs || data.total || 0,
                currentPage: data.page || page,
            };
        } catch (error) {
            const errorMessage = handleApiError(error);
            throw new Error(`Error al obtener vehículos: ${errorMessage}`);
        }
    }

    /**
     * Obtener vehículo por ID
     * @param {string|number} id - ID del vehículo
     * @returns {Promise<Object>} - Datos del vehículo
     */
    async getVehicleById(id) {
        try {
            if (!id) {
                throw new Error('ID de vehículo no proporcionado');
            }

            const response = await axiosInstance.get(ENDPOINTS.VEHICLE_DETAIL(id));
            const data = validateResponse(response);

            return data;
        } catch (error) {
            const errorMessage = handleApiError(error);
            throw new Error(`Error al obtener vehículo ${id}: ${errorMessage}`);
        }
    }

    /**
     * Aplicar filtros a vehículos via POST
     * @param {Object} filters - Filtros a aplicar
     * @param {Object} options - Opciones adicionales
     * @param {number} options.limit - Número de elementos por página
     * @param {number} options.page - Número de página
     * @returns {Promise<Object>} - Respuesta con datos filtrados
     */
    async applyFilters(filters, { limit = 6, page = 1 } = {}) {
        try {
            const payload = {
                filters,
                pagination: {
                    limit,
                    page
                }
            };

            const response = await axiosInstance.post(ENDPOINTS.VEHICLES_FILTER, payload);
            const data = validateResponse(response);

            return {
                data: data.docs || data.data || data.items || [],
                hasNextPage: data.hasNextPage || false,
                nextPage: data.nextPage || null,
                total: data.totalDocs || data.total || 0,
                filteredCount: data.filteredCount || 0,
                currentPage: data.page || page,
                filters: filters,
                timestamp: new Date().toISOString()
            };
        } catch (error) {
            const errorMessage = handleApiError(error);
            throw new Error(`Error al aplicar filtros: ${errorMessage}`);
        }
    }

    /**
     * Obtener lista completa de vehículos (sin paginación)
     * @returns {Promise<Object>} - Lista completa de vehículos
     */
    async getAllVehicles() {
        try {
            const response = await axiosInstance.get(ENDPOINTS.VEHICLES, {
                params: { limit: 1000 } // Obtener todos los vehículos
            });
            const data = validateResponse(response);

            return {
                items: data.data || data.items || [],
                total: data.total || 0,
                timestamp: new Date().toISOString()
            };
        } catch (error) {
            const errorMessage = handleApiError(error);
            throw new Error(`Error al obtener lista completa: ${errorMessage}`);
        }
    }

    /**
     * Buscar vehículos por término de búsqueda
     * @param {string} searchTerm - Término de búsqueda
     * @param {Object} options - Opciones adicionales
     * @returns {Promise<Object>} - Resultados de búsqueda
     */
    async searchVehicles(searchTerm, { limit = 6, page = 1 } = {}) {
        try {
            const params = {
                q: searchTerm,
                limit,
                page
            };

            const response = await axiosInstance.get(ENDPOINTS.VEHICLES, { params });
            const data = validateResponse(response);

            return {
                data: data.docs || data.data || data.items || [],
                hasNextPage: data.hasNextPage || false,
                nextPage: data.nextPage || null,
                total: data.totalDocs || data.total || 0,
                currentPage: data.page || page,
                searchTerm
            };
        } catch (error) {
            const errorMessage = handleApiError(error);
            throw new Error(`Error en búsqueda: ${errorMessage}`);
        }
    }
}

// Crear instancia del servicio
const vehiclesApi = new VehiclesApiService();

export default vehiclesApi; 