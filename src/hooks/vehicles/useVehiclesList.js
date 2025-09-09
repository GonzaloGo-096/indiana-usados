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
 * @version 1.0.0 - Hook unificado optimizado
 */

import React from 'react'
import { useQuery } from '@tanstack/react-query'
import { vehiclesApi } from '../../services/vehiclesApi'
import { mapListResponse } from '../../mappers/vehicleMapper'

export const useVehiclesList = (filters = {}) => {
  // ✅ QUERY SIMPLE - sin complicaciones
  const query = useQuery({
    queryKey: ['vehicles', JSON.stringify(filters)],
    queryFn: async () => {
      const result = await vehiclesApi.getMainVehicles({ filters, limit: 50 });
      return result;
    },
    staleTime: 1000 * 60 * 5, // 5 minutos
  });

  // ✅ APLICAR MAPPER A LOS DATOS
  const mappedData = query.data ? mapListResponse(query.data) : {
    vehicles: [],
    total: 0,
    hasNextPage: false
  }

  // ✅ RETORNAR DATOS MAPEADOS
  return {
    vehicles: mappedData.vehicles || [],
    total: mappedData.total || 0,
    hasNextPage: mappedData.hasNextPage || false,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch
  };
}; 