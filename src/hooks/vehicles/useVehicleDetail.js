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
 * @version 2.0.0 - Simplificado: usa mapper para consistencia
 */

import { useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'
import { vehiclesApi } from '@services/vehiclesApi'
import { logger } from '@utils/logger'
import { mapVehicle } from '@mappers'

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
        // ✅ Usa defaults globales de src/config/reactQuery.js (staleTime: 5min, gcTime: 30min, retry: 1)
        // Solo override lo específico de detalles:
        staleTime = 1000 * 60 * 10, // Override: 10 min (detalles necesitan más cache)
        gcTime = 1000 * 60 * 60, // Override: 1 hora (detalles más persistentes)
        retry = 3, // Override: 3 reintentos (detalles más críticos)
        refetchOnWindowFocus = false,
        placeholderData = undefined
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
        refetchOnReconnect: false,
        placeholderData
    })

    // ✅ Datos transformados usando mapper (consistencia con lista)
    const vehicle = useMemo(() => {
        if (!data) return null
        
        // ✅ Usar mapper para consistencia con useVehiclesList
        const mapped = mapVehicle(data)
        
        if (!mapped || !mapped.id || !mapped.marca || !mapped.modelo) {
            logger.warn('vehicle:detail', 'Datos de vehículo incompletos', { data })
            return null
        }
        
        return mapped
    }, [data])

    // ✅ Función para invalidar cache (nomenclatura React Query estándar)
    const invalidate = () => {
        remove()
    }

    return {
        // Datos
        vehicle,
        // Alias para compatibilidad con páginas que esperan `auto`
        auto: vehicle,
        
        // Estados
        isLoading: isLoading || !isValidId,
        isError: isError || (!isValidId && enabled),
        error: !isValidId ? new Error('ID de vehículo inválido') : error,
        
        // Funciones
        refetch,
        invalidate, // ✅ Renombrado de clearCache (mejor semántica)
        
        // Metadatos
        isValidId,
        id
    }
} 