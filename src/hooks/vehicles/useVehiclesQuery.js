/**
 * useVehiclesQuery - Hook unificado para vehículos optimizado
 * 
 * Estrategia unificada:
 * 1. GET /api/vehicles - Página principal (sin filtros)
 * 2. POST /api/vehicles - Filtros complejos
 * 3. GET /api/vehicles/:id - Detalle de vehículo
 * 
 * @author Indiana Usados
 * @version 5.1.0 - Performance optimizada
 */

import { useInfiniteQuery, useQuery } from '@tanstack/react-query'
import { useMemo, useCallback } from 'react'
import vehiclesApi from '../../api/vehiclesApi'
import { createFiltersHash } from '../../utils/dataHelpers'

/**
 * Hook unificado para obtener vehículos
 *
 * @param {Object} filters - Filtros a aplicar
 * @param {Object} options - Opciones del hook
 * @param {boolean} options.enabled - Si la query debe ejecutarse
 * @param {number} options.staleTime - Tiempo antes de considerar datos obsoletos
 * @param {number} options.gcTime - Tiempo para mantener en cache
 * @param {boolean} options.useInfiniteScroll - Si usar paginación infinita
 * @param {number} options.maxPages - Límite de páginas acumuladas
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
        useInfiniteScroll = true
    } = options

    // Hash de filtros para cache consistente
    const filtersHash = useMemo(() => createFiltersHash(filters), [filters])

    // Detectar si hay filtros activos
    const hasActiveFilters = filters && Object.keys(filters).length > 0

    // Query infinita para paginación
    const {
        data, isLoading, isError, error, fetchNextPage, hasNextPage,
        isFetchingNextPage, refetch, remove
    } = useInfiniteQuery({
        queryKey: [`vehicles-infinite`, filtersHash],
        queryFn: ({ pageParam = 1 }) => {
            return vehiclesApi.getVehicles({
                limit: 6,
                page: pageParam,
                filters
            })
        },
        getNextPageParam: (lastPage, allPages) => {
            // Limitar a máximo 3 páginas
            if (allPages.length >= 3) {
                return undefined
            }
            if (lastPage?.hasNextPage && lastPage?.nextPage) {
                return lastPage.nextPage
            }
            return undefined
        },
        initialPageParam: 1,
        enabled: enabled && useInfiniteScroll,
        staleTime, gcTime, retry, refetchOnWindowFocus,
        refetchOnMount: false, refetchOnReconnect: false,
        refetchOnWindowFocus: false
    })

    // Query simple para casos sin infinite scroll
    const {
        data: simpleData,
        isLoading: isLoadingSimple,
        isError: isErrorSimple,
        error: errorSimple,
        refetch: refetchSimple
    } = useQuery({
        queryKey: [`vehicles-simple`, filtersHash],
        queryFn: () => vehiclesApi.getVehicles({
            limit: 6,
            page: 1,
            filters
        }),
        enabled: enabled && !useInfiniteScroll,
        staleTime, gcTime, retry, refetchOnWindowFocus,
        refetchOnMount: false, refetchOnReconnect: false
    })

    // Datos unificados
    const unifiedData = useMemo(() => {
        if (useInfiniteScroll && data) {
            return {
                vehicles: data.pages.flatMap(page => page.data || []),
                total: data.pages.reduce((total, page) => total + (page.total || 0), 0),
                currentPage: data.pages.length,
                hasNextPage: hasNextPage,
                nextPage: data.pages.length + 1
            }
        }
        
        if (!useInfiniteScroll && simpleData) {
            return {
                vehicles: simpleData.data || [],
                total: simpleData.total || 0,
                currentPage: 1,
                hasNextPage: false,
                nextPage: null
            }
        }
        
        return {
            vehicles: [],
            total: 0,
            currentPage: 1,
            hasNextPage: false,
            nextPage: null
        }
    }, [useInfiniteScroll, data, simpleData, hasNextPage])

    // Estados unificados
    const unifiedIsLoading = useInfiniteScroll ? isLoading : isLoadingSimple
    const unifiedIsError = useInfiniteScroll ? isError : isErrorSimple
    const unifiedError = useInfiniteScroll ? error : errorSimple
    const unifiedRefetch = useInfiniteScroll ? refetch : refetchSimple

    // Función para cargar más datos
    const loadMore = useCallback(() => {
        if (useInfiniteScroll && hasNextPage && !isFetchingNextPage) {
            fetchNextPage()
        }
    }, [useInfiniteScroll, hasNextPage, isFetchingNextPage, fetchNextPage])

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
        
        // Estados
        isLoading: unifiedIsLoading,
        isError: unifiedIsError,
        error: unifiedError,
        isFetchingNextPage,
        
        // Funciones
        refetch: unifiedRefetch,
        loadMore,
        clearCache,
        
        // Metadatos
        hasActiveFilters,
        filtersHash
    }
} 