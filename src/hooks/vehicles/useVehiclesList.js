/**
 * useVehiclesList - Hook unificado para listas de vehículos
 * 
 * Características:
 * - Query única para lista y filtros
 * - Botón "Cargar más" con acumulación
 * - Cache invalidation al aplicar filtros
 * - Backend maneja paginación automáticamente
 * 
 * @author Indiana Usados
 * @version 3.0.0 - Simplificado: mapper único, sin duplicación
 */

import { useInfiniteQuery } from '@tanstack/react-query'
import { getMainVehicles } from '@services/vehiclesApi'
import { mapVehiclesPage } from '@mappers'

export const useVehiclesList = (filters = {}, options = {}) => {
  // ✅ PAGE SIZE CONFIGURABLE (default: 8 para página pública)
  const PAGE_SIZE = options.pageSize ?? 8;
  
  // ✅ QUERY INFINITA - con paginación
  const query = useInfiniteQuery({
    queryKey: ['vehicles', JSON.stringify({ filters, limit: PAGE_SIZE })],
    queryFn: async ({ pageParam, signal }) => {
      const result = await getMainVehicles({
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