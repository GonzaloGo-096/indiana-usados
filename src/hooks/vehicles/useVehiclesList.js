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
 * @version 2.0.0 - Migrado a useInfiniteQuery
 */

import { useInfiniteQuery } from '@tanstack/react-query'
import { getMainVehicles } from '@services/vehiclesApi'
import { normalizeVehiclesPage } from '@api/vehicles.normalizer'
import { mapListResponse } from '@mappers/vehicleMapper'

export const useVehiclesList = (filters = {}) => {
  // ✅ PAGE SIZE FIJO
  const PAGE_SIZE = 8;
  
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
    getNextPageParam: (lastRaw) => {
      const page = normalizeVehiclesPage(lastRaw);
      return page.hasNextPage ? page.next : undefined;
    },
    select: (data) => {
      const pages = data.pages.map(mapListResponse);
      return {
        vehicles: pages.flatMap(p => p.vehicles),
        total: pages[0]?.total ?? 0
      };
    },
    placeholderData: (prev) => prev,
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000, // 5 minutos
    gcTime: 30 * 60 * 1000, // 30 minutos
    retry: 2
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