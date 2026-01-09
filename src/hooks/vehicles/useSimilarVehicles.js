/**
 * useSimilarVehicles - Hook para obtener vehículos similares por marca
 * 
 * Reutiliza la misma petición que los filtros, pero con parámetros dinámicos
 * basados en la marca del vehículo actual.
 * 
 * Características:
 * - Usa useVehiclesList internamente (misma infraestructura)
 * - Filtra por marca del vehículo actual
 * - Excluye el vehículo actual de los resultados
 * - No interfiere con los filtros globales (queryKey diferente)
 * - Limitado a 6 vehículos (carrusel)
 * 
 * @author Indiana Usados
 * @version 1.0.0
 */

import { useMemo } from 'react'
import { useVehiclesList } from './useVehiclesList'

export const useSimilarVehicles = (currentVehicle) => {
  // ✅ Verificar si hay marca antes de hacer la petición
  const hasBrand = Boolean(currentVehicle?.marca)
  
  // ✅ Construir filtro de marca dinámicamente desde el vehículo actual
  const filters = useMemo(() => {
    if (!hasBrand) {
      return {}
    }
    return {
      marca: [currentVehicle.marca]
    }
  }, [currentVehicle?.marca, hasBrand])

  // ✅ Reutilizar el hook existente con filtro de marca
  // React Query manejará el disabled automáticamente si los filtros están vacíos
  const result = useVehiclesList(filters, { pageSize: 6 })

  // ✅ Excluir el vehículo actual de los resultados
  const similarVehicles = useMemo(() => {
    if (!currentVehicle) return []
    
    const currentId = currentVehicle.id || currentVehicle._id
    if (!currentId) return result.vehicles

    return result.vehicles.filter(vehicle => {
      const vehicleId = vehicle.id || vehicle._id
      return vehicleId !== currentId
    })
  }, [result.vehicles, currentVehicle])

  return {
    vehicles: similarVehicles,
    isLoading: result.isLoading,
    isError: result.isError,
    error: result.error,
    refetch: result.refetch
  }
}
