/**
 * useVehiclePrefetch - Hook para prefetch inteligente de vehículos
 * 
 * Responsabilidades:
 * - Prefetch de detalle de vehículo al hover
 * - Prefetch de listas de vehículos
 * - Evitar duplicar requests si ya están cacheados
 * 
 * @author Indiana Usados
 * @version 1.0.0 - Prefetch inteligente
 */

import { useQueryClient } from '@tanstack/react-query'
import { useCallback } from 'react'
import vehiclesService from '@services/vehiclesApi'
import { mapVehicle } from '@mappers'
import { logger } from '@utils/logger'

/**
 * Hook para prefetch de vehículos
 */
export const useVehiclePrefetch = () => {
  const queryClient = useQueryClient()

  /**
   * Prefetch de detalle de vehículo
   * Solo hace prefetch si no está en cache o está stale
   */
  const prefetchVehicleDetail = useCallback((vehicleId) => {
    if (!vehicleId) return

    const queryKey = ['vehicle-detail', vehicleId]
    
    // Verificar si ya está en cache y no está stale
    const cachedData = queryClient.getQueryData(queryKey)
    if (cachedData) {
      logger.debug('prefetch:vehicle', `Vehicle ${vehicleId} already cached, skipping prefetch`)
      return
    }

    // Prefetch con opciones optimizadas
    queryClient.prefetchQuery({
      queryKey,
      queryFn: async () => {
        const data = await vehiclesService.getVehicleById(vehicleId)
        return mapVehicle(data) // Usar mapper para consistencia
      },
      staleTime: 1000 * 60 * 10, // 10 minutos (mismo que useVehicleDetail)
    }).catch((error) => {
      // Silenciar errores de prefetch (no críticos)
      logger.debug('prefetch:vehicle', `Prefetch failed for vehicle ${vehicleId}`, error)
    })
  }, [queryClient])

  /**
   * Prefetch de lista de vehículos
   * Solo hace prefetch si no está en cache o está stale
   * Usa prefetchInfiniteQuery porque useVehiclesList usa useInfiniteQuery
   */
  const prefetchVehiclesList = useCallback((filters = {}, limit = 8, cursor = 1) => {
    const queryKey = ['vehicles', JSON.stringify({ filters, limit })]
    
    // Verificar si ya está en cache y no está stale
    const cachedData = queryClient.getQueryData(queryKey)
    if (cachedData) {
      logger.debug('prefetch:vehicles', 'Vehicles list already cached, skipping prefetch')
      return
    }

    // Prefetch con opciones optimizadas (usar prefetchInfiniteQuery para infinite queries)
    queryClient.prefetchInfiniteQuery({
      queryKey,
      queryFn: async ({ pageParam, signal }) => {
        const result = await vehiclesService.getVehicles({
          filters,
          limit,
          cursor: pageParam || cursor,
          signal
        })
        return result
      },
      initialPageParam: cursor,
      getNextPageParam: (lastPage) => {
        const hasNext = lastPage?.allPhotos?.hasNextPage
        const next = lastPage?.allPhotos?.nextPage
        return hasNext ? next : undefined
      },
      staleTime: 1000 * 60 * 5, // 5 minutos (mismo que useVehiclesList)
    }).catch((error) => {
      // Silenciar errores de prefetch (no críticos)
      logger.debug('prefetch:vehicles', 'Prefetch failed for vehicles list', error)
    })
  }, [queryClient])

  return {
    prefetchVehicleDetail,
    prefetchVehiclesList
  }
}

