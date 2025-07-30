/**
 * useGetCars - Hook personalizado para obtener vehículos con paginación infinita
 * 
 * Responsabilidades:
 * - Obtener vehículos con paginación infinita
 * - Manejar estados de carga y error
 * - Aplicar filtros
 * - Optimizar re-renders
 * - ULTRA OPTIMIZADO PARA PERFORMANCE
 * 
 * @author Indiana Usados
 * @version 2.1.0 - ULTRA OPTIMIZADO PARA PERFORMANCE
 */

import { useInfiniteQuery } from '@tanstack/react-query'
import { useMemo, useCallback } from 'react'
import vehiclesApi from '../api/vehiclesApi'
import autoService from '../services/service'

/**
 * Hook para obtener vehículos con paginación infinita optimizada
 * @param {Object} filters - Filtros aplicados
 * @param {number} pageSize - Tamaño de página (default: 12)
 * @returns {Object} - Datos y estados de la query
 */
export const useGetCars = (filters = {}, pageSize = 12) => {
    // ✅ ULTRA OPTIMIZADO: Memoización de filtros para evitar re-renders innecesarios
    const memoizedFilters = useMemo(() => {
        // ✅ OPTIMIZADO: Solo incluir filtros con valores válidos
        const validFilters = {}
        
        Object.entries(filters).forEach(([key, value]) => {
            if (value !== null && value !== undefined && value !== '') {
                if (Array.isArray(value) && value.length > 0) {
                    validFilters[key] = value
                } else if (!Array.isArray(value)) {
                    validFilters[key] = value
                }
            }
        })
        
        return validFilters
    }, [filters])

    // ✅ ULTRA OPTIMIZADO: Query key memoizada
    const queryKey = useMemo(() => {
        return ['vehicles', memoizedFilters, pageSize]
    }, [memoizedFilters, pageSize])

    // ✅ ULTRA OPTIMIZADO: Función de query optimizada
    const queryFn = useCallback(async ({ pageParam = 1 }) => {
        try {
            // ✅ OPTIMIZADO: Usar requestAnimationFrame para throttling
            await new Promise(resolve => requestAnimationFrame(resolve))
            
            const response = await autoService.getAutos({
                page: pageParam,
                limit: pageSize,
                ...memoizedFilters
            })
            
            return {
                data: response.data || response.items || [],
                nextPage: response.nextPage || null,
                hasMore: response.hasMore || false,
                total: response.total || 0
            }
        } catch (error) {
            throw new Error(`Error al obtener vehículos: ${error.message}`)
        }
    }, [memoizedFilters, pageSize])

    // ✅ ULTRA OPTIMIZADO: Configuración de React Query optimizada
    const query = useInfiniteQuery({
        queryKey,
        queryFn,
        getNextPageParam: (lastPage) => lastPage.nextPage,
        initialPageParam: 1,
        staleTime: 5 * 60 * 1000, // ✅ OPTIMIZADO: 5 minutos
        gcTime: 10 * 60 * 1000,   // ✅ OPTIMIZADO: 10 minutos
        refetchOnWindowFocus: false, // ✅ OPTIMIZADO: Evitar refetch innecesario
        refetchOnMount: true,
        refetchOnReconnect: true,
        retry: 2, // ✅ OPTIMIZADO: Solo 2 reintentos
        retryDelay: 1000, // ✅ OPTIMIZADO: Delay de 1 segundo
        // ✅ ULTRA OPTIMIZADO: Mantener datos anteriores durante carga
        keepPreviousData: true,
        // ✅ OPTIMIZADO: Configuración de placeholder
        placeholderData: (previousData) => previousData
    })

    // ✅ ULTRA OPTIMIZADO: Procesamiento de datos optimizado
    const vehicles = useMemo(() => {
        if (!query.data?.pages) return []
        
        // ✅ OPTIMIZADO: Procesamiento más eficiente
        const allVehicles = []
        
        for (const page of query.data.pages) {
            if (page?.data && Array.isArray(page.data)) {
                allVehicles.push(...page.data)
            } else if (page?.items && Array.isArray(page.items)) {
                allVehicles.push(...page.items)
            }
        }
        
        return allVehicles
    }, [query.data?.pages])

    // ✅ ULTRA OPTIMIZADO: Callback para cargar más optimizado
    const loadMore = useCallback(() => {
        if (query.hasNextPage && !query.isFetchingNextPage) {
            // ✅ OPTIMIZADO: Usar requestAnimationFrame para throttling
            requestAnimationFrame(() => {
                query.fetchNextPage()
            })
        }
    }, [query.hasNextPage, query.isFetchingNextPage, query.fetchNextPage])

    // ✅ ULTRA OPTIMIZADO: Estados memoizados
    const isLoading = query.isLoading
    const isError = query.isError
    const error = query.error
    const hasNextPage = query.hasNextPage
    const isFetchingNextPage = query.isFetchingNextPage

    return {
        // ✅ OPTIMIZADO: Datos procesados
        cars: vehicles,
        // ✅ OPTIMIZADO: Estados
        isLoading,
        isError,
        error,
        hasNextPage,
        isFetchingNextPage,
        // ✅ OPTIMIZADO: Acciones
        onLoadMore: loadMore,
        // ✅ OPTIMIZADO: Estados adicionales
        isRefetching: query.isRefetching,
        isStale: query.isStale,
        // ✅ OPTIMIZADO: Métodos de control
        refetch: query.refetch,
        remove: query.remove
    }
}
