/**
 * useVehiclesList - Hook unificado para listas de vehículos
 * 
 * Características:
 * - Query única para lista y filtros
 * - Botón "Cargar más" con acumulación
 * - Cache invalidation al aplicar filtros
 * - Backend maneja paginación automáticamente
 * 
 * Responsabilidades:
 * - Configuración de paginación (PAGE_SIZE, opciones)
 * - Lógica de query infinita (useInfiniteQuery)
 * - Lógica de filtros (serialización en queryKey)
 * - Lógica de mapeo (mapVehiclesPage + flatMap)
 * - Retorno de estado (datos, loading, error, funciones)
 * 
 * Nota sobre Testing:
 * - Este hook tiene múltiples responsabilidades por diseño
 * - Se recomienda testing de integración en lugar de unitario
 * - Testing unitario requeriría mocks complejos de React Query
 * - Testing de integración valida el flujo completo
 * 
 * @author Indiana Usados
 * @version 3.1.0 - Documentación mejorada: responsabilidades y testing
 */

import { useInfiniteQuery } from '@tanstack/react-query'
import vehiclesService from '@services/vehiclesApi'
import { mapVehiclesPage } from '@mappers'

export const useVehiclesList = (filters = {}, options = {}) => {
  // ✅ PAGE SIZE CONFIGURABLE (default: 8 para página pública)
  const PAGE_SIZE = options.pageSize ?? 8;
  
  // ✅ QUERY INFINITA - con paginación
  const query = useInfiniteQuery({
    queryKey: ['vehicles', JSON.stringify({ filters, limit: PAGE_SIZE })],
    queryFn: async ({ pageParam, signal }) => {
      const result = await vehiclesService.getVehicles({
        filters, 
        limit: PAGE_SIZE,
        cursor: pageParam,
        signal 
      });
      return result;
    },
    initialPageParam: 1,
    
    // ✅ SIMPLIFICADO: Extrae hasNextPage directo del backend (sin normalizer)
    getNextPageParam: (lastPage) => {
      const hasNext = lastPage?.allPhotos?.hasNextPage
      const next = lastPage?.allPhotos?.nextPage
      return hasNext ? next : undefined
    },
    
    // ✅ SIMPLIFICADO: Usa mapper único (sin duplicación)
    select: (data) => {
      const pages = data.pages.map(mapVehiclesPage)
      return {
        vehicles: pages.flatMap(p => p.vehicles),
        total: pages[0]?.total ?? 0
      }
    },
    placeholderData: (prev) => prev,
    // ✅ Usa defaults globales de src/config/reactQuery.js (staleTime: 5min, gcTime: 30min, retry: 1)
    retry: 2 // Override: 2 reintentos para listas (más tolerante que el default de 1)
  });

  // ✅ RETORNAR DATOS MAPEADOS
  return {
    vehicles: query.data?.vehicles ?? [],
    total: query.data?.total ?? 0,
    hasNextPage: query.hasNextPage,
    loadMore: query.fetchNextPage,
    isLoadingMore: query.isFetchingNextPage,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch
  };
};