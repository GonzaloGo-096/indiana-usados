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
 * @version 2.0.0
 */

import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { useCallback, useMemo } from "react";
import autoService, { queryKeys } from "../services/service";
import { filterVehicles } from "../utils/filterUtils";
import vehiclesApi from "../api/vehiclesApi";

/**
 * Hook para obtener vehículos con paginación infinita
 * 
 * @param {Object} filters - Filtros a aplicar (marca, año, precio, etc.)
 * @param {Object} options - Opciones adicionales del hook
 * @param {boolean} options.enabled - Si la query debe ejecutarse
 * @param {number} options.staleTime - Tiempo en ms antes de considerar datos obsoletos
 * @param {number} options.cacheTime - Tiempo en ms para mantener en cache
 * @param {number} options.limit - Número de elementos por página
 * @param {boolean} options.useRealApi - Si usar API real o mock data
 * 
 * @returns {Object} - Objeto con datos y funciones del hook
 * @returns {Array} returns.autos - Lista de vehículos
 * @returns {Function} returns.loadMore - Función para cargar más vehículos
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
        limit = 6,
        useRealApi = false // Temporalmente solo mock data
    } = options;

    // ===== QUERY INFINITA CON PAGINACIÓN REAL =====
    const {
        data,
        error,
        fetchNextPage,
        hasNextPage,
        isFetching,
        isFetchingNextPage,
        isLoading,
        isError,
        refetch,
        remove
    } = useInfiniteQuery({
        queryKey: ['vehicles-infinite', { filters, limit }],
        queryFn: async ({ pageParam = null }) => {
            if (useRealApi) {
                try {
                    console.log('🔄 Intentando conectar con backend real...');
                    
                    // Si hay filtros, usar el endpoint de filtros
                    if (Object.keys(filters).length > 0) {
                        return await vehiclesApi.applyFilters(filters, {
                            limit,
                            cursor: pageParam
                        });
                    }
                    
                    // Si no hay filtros, usar el endpoint normal
                    return await vehiclesApi.getVehicles({
                        limit,
                        cursor: pageParam,
                        filters
                    });
                } catch (error) {
                    console.log('⚠️ Fallback a mock data:', error.message);
                    // Fallback al servicio mock si la API real falla
                    return await autoService.getAutos({ filters, pageParam });
                }
            } else {
                // Usar directamente mock data
                return await autoService.getAutos({ filters, pageParam });
            }
        },
        getNextPageParam: (lastPage) => {
            return lastPage.nextCursor || undefined;
        },
        initialPageParam: null,
        enabled,
        staleTime,
        gcTime: cacheTime,
        retry,
        refetchOnWindowFocus,
        refetchOnMount: true,
        refetchOnReconnect: true,
    });

    // ===== PROCESAR DATOS DE TODAS LAS PÁGINAS =====
    const vehicles = useMemo(() => {
        if (!data?.pages) return [];
        
        return data.pages.flatMap(page => page.data || page.items || []);
    }, [data?.pages]);

    // ===== ESTADÍSTICAS =====
    const totalVehicles = useMemo(() => {
        if (!data?.pages?.length) return 0;
        
        const lastPage = data.pages[data.pages.length - 1];
        return lastPage.total || vehicles.length;
    }, [data?.pages, vehicles.length]);

    const totalPages = useMemo(() => {
        return data?.pages?.length || 0;
    }, [data?.pages]);

    // ===== FUNCIONES =====
    
    /**
     * Función para cargar más vehículos
     */
    const loadMore = useCallback(() => {
        if (hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
        }
    }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

    /**
     * Función para recargar datos
     */
    const reload = useCallback(() => {
        remove(); // Limpiar cache
        return refetch();
    }, [remove, refetch]);

    return {
        // Datos (mantener compatibilidad con tu código existente)
        autos: vehicles,
        allVehicles: vehicles,
        filteredCount: vehicles.length,
        totalCount: totalVehicles,
        
        // Funciones
        loadMore,
        refetch,
        reload,
        
        // Estados de paginación
        hasNextPage: hasNextPage || false,
        isFetchingNextPage,
        
        // Estados de carga
        isLoading,
        isFetching,
        isError,
        error,
        
        // Estados adicionales
        hasActiveFilters: Object.keys(filters).length > 0,
        activeFiltersCount: Object.keys(filters).length,
        
        // Datos adicionales
        totalPages,
        totalVehicles
    };
};
