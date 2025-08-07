/**
 * useVehiclesInfinite - Hook especializado para infinite scroll
 * 
 * Responsabilidades:
 * - Paginación infinita de vehículos
 * - Carga automática de más datos
 * - Gestión de estados de carga incremental
 * - Usa useVehiclesData internamente
 * 
 * @author Indiana Usados
 * @version 1.0.0 - Hook especializado para infinite scroll
 */

import { useInfiniteQuery } from '@tanstack/react-query'
import { useMemo, useCallback } from 'react'
import vehiclesApi from '../../api/vehiclesApi'
import { createFiltersHash } from '../../utils/dataHelpers'

/**
 * Hook para infinite scroll de vehículos
 * 
 * @param {Object} filters - Filtros a aplicar
 * @param {Object} options - Opciones del hook
 * @param {boolean} options.enabled - Si la query debe ejecutarse
 * @param {number} options.staleTime - Tiempo antes de considerar datos obsoletos
 * @param {number} options.gcTime - Tiempo para mantener en cache
 * @param {number} options.limit - Límite de vehículos por página
 * @param {number} options.maxPages - Límite de páginas acumuladas
 * 
 * @returns {Object} - Datos y funciones del infinite scroll
 */
export const useVehiclesInfinite = (filters = {}, options = {}) => {
    const {
        enabled = true,
        staleTime = 1000 * 60 * 5, // 5 minutos
        gcTime = 1000 * 60 * 30, // 30 minutos
        retry = 2,
        refetchOnWindowFocus = false,
        limit = 6,
        maxPages = 3 // Limitado a 3 páginas por defecto
    } = options

    // Hash de filtros para cache consistente
    const filtersHash = useMemo(() => createFiltersHash(filters), [filters])

    // Detectar si hay filtros activos
    const hasActiveFilters = useMemo(() => {
        return filters && Object.keys(filters).length > 0
    }, [filters])

    // Query infinita
    const {
        data,
        isLoading,
        isError,
        error,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        refetch,
        remove
    } = useInfiniteQuery({
        queryKey: ['vehicles-infinite', filtersHash, limit],
        queryFn: ({ pageParam = 1 }) => {
            return vehiclesApi.getVehicles({
                limit,
                page: pageParam,
                filters
            })
        },
        getNextPageParam: (lastPage, allPages) => {
            // Limitar a máximo páginas configuradas
            if (allPages.length >= maxPages) {
                return undefined
            }
            
            // Verificar si hay más páginas
            if (lastPage?.hasNextPage && lastPage?.nextPage) {
                return lastPage.nextPage
            }
            
            return undefined
        },
        initialPageParam: 1,
        enabled,
        staleTime,
        gcTime,
        retry,
        refetchOnWindowFocus,
        refetchOnMount: false,
        refetchOnReconnect: false
    })

    // Datos unificados de todas las páginas
    const unifiedData = useMemo(() => {
        if (!data) {
            return {
                vehicles: [],
                total: 0,
                currentPage: 1,
                hasNextPage: false,
                nextPage: null,
                totalPages: 0
            }
        }

        const allVehicles = data.pages.flatMap(page => page.data || [])
        const totalPages = data.pages.length
        const total = data.pages.reduce((sum, page) => sum + (page.total || 0), 0)

        return {
            vehicles: allVehicles,
            total,
            currentPage: totalPages,
            hasNextPage: hasNextPage,
            nextPage: totalPages + 1,
            totalPages
        }
    }, [data, hasNextPage])

    // Función para cargar más datos
    const loadMore = useCallback(() => {
        if (hasNextPage && !isFetchingNextPage) {
            fetchNextPage()
        }
    }, [hasNextPage, isFetchingNextPage, fetchNextPage])

    // Función para limpiar cache
    const clearCache = useCallback(() => {
        remove()
    }, [remove])

    return {
        // Datos
        vehicles: unifiedData.vehicles,
        total: unifiedData.total,
        currentPage: unifiedData.currentPage,
        hasNextPage: unifiedData.hasNextPage,
        nextPage: unifiedData.nextPage,
        totalPages: unifiedData.totalPages,
        
        // Estados
        isLoading,
        isError,
        error,
        isFetchingNextPage,
        
        // Funciones
        refetch,
        loadMore,
        clearCache,
        
        // Metadatos
        hasActiveFilters,
        filtersHash,
        
        // Datos raw (para casos especiales)
        rawData: data
    }
} 