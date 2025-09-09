/**
 * useAutoDetail - Hook optimizado para obtener detalle de vehículo desde vehiclesApi
 * 
 * Responsabilidades:
 * - Obtener datos de un vehículo específico
 * - Manejar estados de carga y error
 * - Cachear datos para evitar peticiones innecesarias
 * - Performance optimizada
 * 
 * @author Indiana Usados
 * @version 3.1.0 - Performance optimizada
 */

import { useQuery } from '@tanstack/react-query'
import { vehiclesApi } from '@api'

/**
 * Hook optimizado para obtener detalle de vehículo
 * 
 * @param {string|number} id - ID del vehículo
 * @param {Object} options - Opciones adicionales
 * @param {boolean} options.enabled - Si la query debe ejecutarse
 * @param {number} options.staleTime - Tiempo en ms antes de considerar datos obsoletos
 * @param {number} options.cacheTime - Tiempo en ms para mantener en cache
 * 
 * @returns {Object} - Objeto con datos y estados del hook
 * @returns {Object} returns.vehicle - Datos del vehículo
 * @returns {boolean} returns.isLoading - Si está cargando
 * @returns {boolean} returns.isError - Si hay error
 * @returns {Error} returns.error - Objeto de error si existe
 * @returns {Function} returns.refetch - Función para recargar datos
 */
export const useAutoDetail = (id, options = {}) => {
    const {
        enabled = true,
        staleTime = 1000 * 60 * 30, // 30 minutos (aumentado)
        cacheTime = 1000 * 60 * 60, // 1 hora
        retry = 1,
        refetchOnWindowFocus = false,
        refetchOnMount = false,
        refetchOnReconnect = false
    } = options;

    const {
        data: vehicle,
        isLoading,
        isError,
        error,
        refetch
    } = useQuery({
        queryKey: ['vehicle-detail', id],
        queryFn: () => vehiclesApi.getVehicleById(id),
        enabled: enabled && !!id,
        staleTime: staleTime,
        gcTime: cacheTime,
        retry: retry,
        refetchOnWindowFocus: false,
        refetchOnMount: false,
        refetchOnReconnect: false,
        retryDelay: 1000,
        networkMode: 'online'
    });


    // Formatear datos para compatibilidad
    const formattedData = vehicle ? {
        contactInfo: {
            email: 'info@indianausados.com',
            whatsapp: '5491112345678',
            whatsappMessage: `Hola, me interesa el vehículo ${vehicle.marca || ''} ${vehicle.modelo || ''}`
        }
    } : null;

    return {
        auto: vehicle,
        vehicle,
        formattedData,
        isLoading,
        isError,
        error,
        refetch
    };
}; 