/**
 * useVehicleDetail - Hook especializado para detalle de vehículo
 * 
 * Responsabilidades:
 * - Obtener datos de un vehículo específico por ID
 * - Manejar cache específico para detalles
 * - Validación de ID
 * - Estados de carga específicos para detalle
 * 
 * @author Indiana Usados
 * @version 1.0.0 - Hook especializado para detalle
 */

import { useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'
import { vehiclesApi } from '@services/vehiclesApi'

/**
 * Hook para obtener detalle de un vehículo
 * 
 * @param {string|number} id - ID del vehículo
 * @param {Object} options - Opciones del hook
 * @param {boolean} options.enabled - Si la query debe ejecutarse
 * @param {number} options.staleTime - Tiempo antes de considerar datos obsoletos
 * @param {number} options.gcTime - Tiempo para mantener en cache
 * @param {number} options.retry - Número de reintentos
 * 
 * @returns {Object} - Datos y estados del detalle
 */
export const useVehicleDetail = (id, options = {}) => {
    const {
        enabled = true,
        staleTime = 1000 * 60 * 10, // 10 minutos para detalles
        gcTime = 1000 * 60 * 60, // 1 hora para detalles
        retry = 3, // Más reintentos para detalles
        refetchOnWindowFocus = false
    } = options

    // Validar ID
    const isValidId = useMemo(() => {
        return id && (typeof id === 'string' || typeof id === 'number') && id !== ''
    }, [id])

    // Query para detalle
    const {
        data,
        isLoading,
        isError,
        error,
        refetch,
        remove
    } = useQuery({
        queryKey: ['vehicle-detail', id],
        queryFn: () => vehiclesApi.getVehicleById(id),
        enabled: enabled && isValidId,
        staleTime,
        gcTime,
        retry,
        refetchOnWindowFocus,
        refetchOnMount: false,
        refetchOnReconnect: false
    })

    // Datos formateados
    const vehicle = useMemo(() => {
        if (!data) return null
        
        // Validar estructura básica del vehículo
        if (!data.id || !data.marca || !data.modelo) {
            console.warn('⚠️ useVehicleDetail: Datos de vehículo incompletos', data)
            return null
        }
        
        return data
    }, [data])

    // Función para limpiar cache
    const clearCache = () => {
        remove()
    }

    return {
        // Datos
        vehicle,
        
        // Estados
        isLoading: isLoading || !isValidId,
        isError: isError || (!isValidId && enabled),
        error: !isValidId ? new Error('ID de vehículo inválido') : error,
        
        // Funciones
        refetch,
        clearCache,
        
        // Metadatos
        isValidId,
        id
    }
} 