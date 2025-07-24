/**
 * useGetCars - Hook para obtener vehículos con paginación infinita
 * 
 * Responsabilidades:
 * - Obtener vehículos del backend con paginación infinita
 * - Manejar filtros dinámicos
 * - Gestionar estados de carga y error
 * - Proporcionar función para cargar más vehículos
 * 
 * Preparado para:
 * - Conectar con endpoints reales del backend
 * - Manejo robusto de errores
 * - Cache inteligente con React Query
 * - Filtros dinámicos
 * 
 * @author Indiana Usados
 * @version 3.0.0 - Migrado a useInfiniteQuery
 */

import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { useCallback, useMemo } from "react";
import autoService, { queryKeys } from "../services/service";
import { filterVehicles } from "../utils/filterUtils";

/**
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
