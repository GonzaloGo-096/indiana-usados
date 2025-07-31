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
 * @version 3.0.0 - Migrado a useInfiniteQuery
 */

import { useInfiniteQuery, useQuery } from '@tanstack/react-query'
import { useMemo, useCallback } from 'react'
import vehiclesApi from '../api/vehiclesApi'
import autoService from '../services/service'

/**
 * Función para filtrar vehículos en memoria
 * @param {Array} vehicles - Lista de vehículos
 * @param {Object} filters - Filtros a aplicar
 * @returns {Array} - Vehículos filtrados
 */
const filterVehicles = (vehicles, filters) => {
    if (!vehicles || !Array.isArray(vehicles)) return []
    if (!filters || Object.keys(filters).length === 0) return vehicles

    return vehicles.filter(vehicle => {
        // Filtrar por marca
        if (filters.marca && filters.marca.length > 0) {
            if (!filters.marca.includes(vehicle.marca)) return false
        }

        // Filtrar por año
        if (filters.añoDesde && vehicle.año < filters.añoDesde) return false
        if (filters.añoHasta && vehicle.año > filters.añoHasta) return false

        // Filtrar por precio
        if (filters.precioDesde && vehicle.precio < filters.precioDesde) return false
        if (filters.precioHasta && vehicle.precio > filters.precioHasta) return false

        // Filtrar por kilometraje
        if (filters.kilometrajeDesde && vehicle.kilometraje < filters.kilometrajeDesde) return false
        if (filters.kilometrajeHasta && vehicle.kilometraje > filters.kilometrajeHasta) return false

        // Filtrar por combustible
        if (filters.combustible && filters.combustible.length > 0) {
            if (!filters.combustible.includes(vehicle.combustible)) return false
        }

        // Filtrar por transmisión
        if (filters.transmision && filters.transmision.length > 0) {
            if (!filters.transmision.includes(vehicle.transmision)) return false
        }

        return true
    })
}

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
        gcTime: cacheTime,
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
        gcTime: 1000 * 60 * 30, // 30 minutos
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

        // Estados
        isLoading: finalIsLoading,
        isError: finalIsError,
        error: finalError,
        hasNextPage: useInfiniteScroll ? hasNextPage : false,
        isFetchingNextPage: useInfiniteScroll ? isFetchingNextPage : false,

        // Compatibilidad con nombres anteriores
        cars: allAutos,
        onLoadMore: loadMore
    }
} 