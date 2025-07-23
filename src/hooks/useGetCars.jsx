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

/**
 * Hook para obtener vehículos con paginación infinita
 * 
 * @param {Object} filters - Filtros a aplicar (marca, año, precio, etc.)
 * @param {Object} options - Opciones adicionales del hook
 * @param {boolean} options.enabled - Si la query debe ejecutarse
 * @param {number} options.staleTime - Tiempo en ms antes de considerar datos obsoletos
 * @param {number} options.cacheTime - Tiempo en ms para mantener en cache
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
        refetchOnWindowFocus = false
    } = options;

    // ===== QUERY PARA LISTA COMPLETA (CACHE) =====
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
        enabled: enabled,
        retry: retry,
        refetchOnWindowFocus: refetchOnWindowFocus
    });

    // ===== FILTRAR DATOS DESDE CACHE =====
    const filteredVehicles = useMemo(() => {
        if (!allVehiclesData?.items) return [];
        
        return filterVehicles(allVehiclesData.items, filters);
    }, [allVehiclesData?.items, filters]);

    // ===== PAGINACIÓN DE RESULTADOS FILTRADOS =====
    const ITEMS_PER_PAGE = 6;
    const totalPages = Math.ceil(filteredVehicles.length / ITEMS_PER_PAGE);
    
    // Simular paginación infinita con los datos filtrados
    const paginatedVehicles = useMemo(() => {
        return filteredVehicles.slice(0, ITEMS_PER_PAGE);
    }, [filteredVehicles]);

    // ===== ESTADOS DE CARGA =====
    const isLoading = isLoadingAll;
    const isError = !!errorAll;
    const error = errorAll;

    // ===== FUNCIONES =====
    
    /**
     * Función para cargar más vehículos (simulada)
     * En el futuro, esto se conectará con paginación real del backend
     */
    const loadMore = useCallback(() => {
        console.log('⏭️ Load more - Implementación futura para paginación real');
        // Por ahora, no hacemos nada ya que mostramos todos los filtrados
    }, []);

    /**
     * Función para recargar datos
     */
    const refetch = useCallback(() => {
        return refetchAll();
    }, [refetchAll]);

    return {
        // Datos
        autos: paginatedVehicles,
        allVehicles: allVehiclesData?.items || [],
        filteredCount: filteredVehicles.length,
        totalCount: allVehiclesData?.total || 0,
        
        // Funciones
        loadMore,
        refetch,
        
        // Estados de paginación (simulados)
        hasNextPage: false, // Por ahora no hay paginación real
        isFetchingNextPage: false,
        
        // Estados de carga
        isLoading,
        isError,
        error,
        
        // Estados adicionales
        hasActiveFilters: Object.keys(filters).length > 0,
        activeFiltersCount: Object.keys(filters).length
    };
};
