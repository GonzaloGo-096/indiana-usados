/**
 * useVehiclesQuery - Hook unificador para vehículos (MANTIENE COMPATIBILIDAD)
 * 
 * Este hook ahora usa hooks especializados internamente:
 * - useVehiclesData: Para datos básicos
 * - useVehiclesInfinite: Para infinite scroll
 * - useVehicleDetail: Para detalle individual
 * 
 * @author Indiana Usados
 * @version 6.0.0 - Refactorizado con hooks especializados
 */

import { useVehiclesData } from './useVehiclesData'
import { useVehiclesInfinite } from './useVehiclesInfinite'
import { useVehicleDetail } from './useVehicleDetail'

/**
 * Hook unificador para obtener vehículos (MANTIENE COMPATIBILIDAD)
 *
 * @param {Object} filters - Filtros a aplicar
 * @param {Object} options - Opciones del hook
 * @param {boolean} options.enabled - Si la query debe ejecutarse
 * @param {number} options.staleTime - Tiempo antes de considerar datos obsoletos
 * @param {number} options.gcTime - Tiempo para mantener en cache
 * @param {boolean} options.useInfiniteScroll - Si usar paginación infinita
 * @param {number} options.maxPages - Límite de páginas acumuladas
 * @param {string|number} options.id - ID para detalle individual
 * 
 * @returns {Object} - Datos y funciones del hook
 */
export const useVehiclesQuery = (filters = {}, options = {}) => {
    const {
        enabled = true,
        staleTime = 1000 * 60 * 5, // 5 minutos
        gcTime = 1000 * 60 * 30, // 30 minutos
        retry = 2,
        refetchOnWindowFocus = false,
        maxPages = 3, // Limitado a 3 páginas
        useInfiniteScroll = true,
        id = null // Para detalle individual
    } = options

    // Si se proporciona ID, usar hook de detalle
    if (id) {
        const detailHook = useVehicleDetail(id, {
            enabled,
            staleTime,
            gcTime,
            retry,
            refetchOnWindowFocus
        })

        return {
            // Datos
            vehicle: detailHook.vehicle,
            vehicles: detailHook.vehicle ? [detailHook.vehicle] : [],
            total: detailHook.vehicle ? 1 : 0,
            currentPage: 1,
            hasNextPage: false,
            nextPage: null,
            
            // Estados
            isLoading: detailHook.isLoading,
            isError: detailHook.isError,
            error: detailHook.error,
            isFetchingNextPage: false,
            
            // Funciones
            refetch: detailHook.refetch,
            loadMore: () => {}, // No aplica para detalle
            clearCache: detailHook.clearCache,
            
            // Metadatos
            hasActiveFilters: false,
            filtersHash: `detail-${id}`
        }
    }

    // Usar infinite scroll o datos simples según configuración
    if (useInfiniteScroll) {
        return useVehiclesInfinite(filters, {
            enabled,
            staleTime,
            gcTime,
            retry,
            refetchOnWindowFocus,
            maxPages
        })
    } else {
        return useVehiclesData(filters, {
            enabled,
            staleTime,
            gcTime,
            retry,
            refetchOnWindowFocus
        })
    }
} 