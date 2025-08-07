/**
 * useVehiclesData - Hook base para datos de vehículos
 * 
 * Responsabilidades:
 * - Obtener datos de vehículos de la API
 * - Manejar cache y estados de carga
 * - Formatear datos para consumo
 * - SIN lógica de UI (infinite scroll, paginación)
 * 
 * @author Indiana Usados
 * @version 1.0.0 - Hook base especializado
 */

import { useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'
import vehiclesApi from '../../api/vehiclesApi'
import { createFiltersHash } from '../../utils/dataHelpers'

/**
 * Hook base para obtener datos de vehículos
 * 
 * @param {Object} filters - Filtros a aplicar
 * @param {Object} options - Opciones del hook
 * @param {boolean} options.enabled - Si la query debe ejecutarse
 * @param {number} options.staleTime - Tiempo antes de considerar datos obsoletos
 * @param {number} options.gcTime - Tiempo para mantener en cache
 * @param {number} options.limit - Límite de vehículos por página
 * @param {number} options.page - Página a obtener
 * 
 * @returns {Object} - Datos y estados del hook
 */
export const useVehiclesData = (filters = {}, options = {}) => {
    const {
        enabled = true,
        staleTime = 1000 * 60 * 5, // 5 minutos
        gcTime = 1000 * 60 * 30, // 30 minutos
        retry = 2,
        refetchOnWindowFocus = false,
        limit = 6,
        page = 1
    } = options

    // Hash de filtros para cache consistente
    const filtersHash = useMemo(() => createFiltersHash(filters), [filters])

    // Detectar si hay filtros activos
    const hasActiveFilters = useMemo(() => {
        return filters && Object.keys(filters).length > 0
    }, [filters])

    // Query principal
    const {
        data,
        isLoading,
        isError,
        error,
        refetch,
        remove
    } = useQuery({
        queryKey: ['vehicles-data', filtersHash, limit, page],
        queryFn: () => vehiclesApi.getVehicles({
            limit,
            page,
            filters
        }),
        enabled,
        staleTime,
        gcTime,
        retry,
        refetchOnWindowFocus,
        refetchOnMount: false,
        refetchOnReconnect: false
    })

    // Datos formateados
    const formattedData = useMemo(() => {
        if (!data) {
            return {
                vehicles: [],
                total: 0,
                currentPage: page,
                hasNextPage: false,
                nextPage: null
            }
        }

        return {
            vehicles: data.data || [],
            total: data.total || 0,
            currentPage: page,
            hasNextPage: data.hasNextPage || false,
            nextPage: data.nextPage || null
        }
    }, [data, page])

    // Función para limpiar cache
    const clearCache = () => {
        remove()
    }

    return {
        // Datos
        vehicles: formattedData.vehicles,
        total: formattedData.total,
        currentPage: formattedData.currentPage,
        hasNextPage: formattedData.hasNextPage,
        nextPage: formattedData.nextPage,
        
        // Estados
        isLoading,
        isError,
        error,
        
        // Funciones
        refetch,
        clearCache,
        
        // Metadatos
        hasActiveFilters,
        filtersHash,
        
        // Datos raw (para casos especiales)
        rawData: data
    }
} 