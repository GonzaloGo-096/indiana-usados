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
<<<<<<< HEAD
 * @version 3.0.0 - Migrado a useInfiniteQuery
=======
 * @version 2.1.0 - ULTRA OPTIMIZADO PARA PERFORMANCE
>>>>>>> documentando
 */

import { useInfiniteQuery } from '@tanstack/react-query'
import { useMemo, useCallback } from 'react'
import vehiclesApi from '../api/vehiclesApi'
import autoService from '../services/service'

/**
<<<<<<< HEAD
 * Hook para obtener vehículos con paginación infinita REAL
 * 
 * @param {Object} filters - Filtros a aplicar (marca, año, precio, etc.)
 * @param {Object} options - Opciones adicionales del hook
 * @param {boolean} options.enabled - Si la query debe ejecutarse
 * @param {number} options.staleTime - Tiempo en ms antes de considerar datos obsoletos
 * @param {number} options.cacheTime - Tiempo en ms para mantener en cache
 * @param {boolean} options.useInfiniteScroll - Si usar paginación infinita (default: true)
 * 
 * @returns {Object} - Objeto con datos y funciones del hook
 * @returns {Array} returns.autos - Lista de vehículos (acumulados si infinite scroll)
 * @returns {Function} returns.fetchNextPage - Función para cargar más vehículos
 * @returns {boolean} returns.hasNextPage - Si hay más páginas disponibles
 * @returns {boolean} returns.isLoading - Si está cargando la primera página
 * @returns {boolean} returns.isError - Si hay error
 * @returns {Error} returns.error - Objeto de error si existe
 * @returns {boolean} returns.isFetchingNextPage - Si está cargando más páginas
 * @returns {Function} returns.refetch - Función para recargar datos
 */
export const useGetCars = (filters = {}, options = {}) => {
    const {
        enabled = true,
        staleTime = 1000 * 60 * 5, // 5 minutos
        cacheTime = 1000 * 60 * 30, // 30 minutos
        retry = 1,
        refetchOnWindowFocus = false,
        useInfiniteScroll = true // Nueva opción para habilitar/deshabilitar infinite scroll
    } = options;

    // ===== QUERY INFINITA CON PAGINACIÓN REAL =====
    const {
        data,
        isLoading,
        isError,
        error,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        refetch: refetchInfinite
    } = useInfiniteQuery({
        queryKey: ['vehicles-infinite', filters],
        queryFn: ({ pageParam = 1 }) => 
            autoService.getVehiclesWithPagination({ 
                page: pageParam, 
                limit: 6, 
                filters 
            }),
        getNextPageParam: (lastPage) => 
            lastPage.hasNextPage ? lastPage.page + 1 : undefined,
        initialPageParam: 1,
        enabled: enabled && useInfiniteScroll,
        staleTime: staleTime,
        cacheTime: cacheTime,
        retry: retry,
        refetchOnWindowFocus: refetchOnWindowFocus
    });

    // ===== QUERY TRADICIONAL (FALLBACK) =====
    const {
        data: allVehiclesData,
        isLoading: isLoadingAll,
        error: errorAll,
        refetch: refetchAll
    } = useQuery({
        queryKey: ['all-vehicles'],
        queryFn: () => autoService.getAllVehicles(),
        staleTime: 1000 * 60 * 1, // 1 minuto (más fresco)
        cacheTime: 1000 * 60 * 30, // 30 minutos
        enabled: enabled && !useInfiniteScroll,
        retry: retry,
        refetchOnWindowFocus: refetchOnWindowFocus
    });

    // ===== ACUMULAR TODOS LOS AUTOS DE TODAS LAS PÁGINAS =====
    const allAutos = useMemo(() => {
        if (useInfiniteScroll && data?.pages) {
            return data.pages.flatMap(page => page.items);
        } else if (!useInfiniteScroll && allVehiclesData?.items) {
            // Filtrar en memoria para compatibilidad
            return filterVehicles(allVehiclesData.items, filters);
        }
        return [];
    }, [useInfiniteScroll, data?.pages, allVehiclesData?.items, filters]);

    // ===== ESTADOS UNIFICADOS =====
    const finalIsLoading = useInfiniteScroll ? isLoading : isLoadingAll;
    const finalIsError = useInfiniteScroll ? isError : !!errorAll;
    const finalError = useInfiniteScroll ? error : errorAll;

    // ===== FUNCIONES =====
    
    /**
     * Función para cargar más vehículos (REAL)
     */
    const loadMore = useCallback(() => {
        if (useInfiniteScroll && hasNextPage && !isFetchingNextPage) {
            console.log('🔄 Cargando más vehículos...');
            fetchNextPage();
        } else if (!useInfiniteScroll) {
            console.log('⏭️ Load more - No disponible en modo tradicional');
        }
    }, [useInfiniteScroll, hasNextPage, isFetchingNextPage, fetchNextPage]);

    /**
     * Función para recargar datos
     */
    const refetch = useCallback(() => {
        if (useInfiniteScroll) {
            return refetchInfinite();
        } else {
            return refetchAll();
        }
    }, [useInfiniteScroll, refetchInfinite, refetchAll]);

    return {
        // Datos
        autos: allAutos,
        allVehicles: allAutos, // Compatibilidad
        filteredCount: allAutos.length,
        totalCount: useInfiniteScroll 
            ? (data?.pages?.[0]?.total || 0)
            : (allVehiclesData?.total || 0),
        
        // Funciones
        loadMore,
        fetchNextPage: useInfiniteScroll ? fetchNextPage : loadMore, // Compatibilidad
        refetch,
        
        // Estados de paginación
        hasNextPage: useInfiniteScroll ? hasNextPage : false,
        isFetchingNextPage: useInfiniteScroll ? isFetchingNextPage : false,
        
        // Estados de carga
        isLoading: finalIsLoading,
        isError: finalIsError,
        error: finalError,
        
        // Estados adicionales
        hasActiveFilters: Object.keys(filters).length > 0,
        activeFiltersCount: Object.keys(filters).length,
        
        // Información de paginación
        currentPage: useInfiniteScroll 
            ? (data?.pages?.length || 0)
            : 1,
        totalPages: useInfiniteScroll 
            ? (data?.pages?.[0]?.totalPages || 0)
            : 1
    };
};
=======
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
>>>>>>> documentando
