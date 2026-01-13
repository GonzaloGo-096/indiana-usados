/**
 * usePriceRangeVehicles - Hook para obtener vehículos en rango de precio similar
 * 
 * Reutiliza la misma petición que los filtros, pero con parámetros dinámicos
 * basados en el precio del vehículo actual (±2 millones).
 * 
 * Características:
 * - Usa useVehiclesList internamente (misma infraestructura)
 * - Filtra por rango de precio (precio actual ± 1.000.000)
 * - Excluye el vehículo actual de los resultados
 * - No interfiere con los filtros globales (queryKey diferente)
 * - Limitado a 5 vehículos (carrusel)
 * 
 * @author Indiana Usados
 * @version 1.0.0
 */

import { useMemo } from 'react'
import { useVehiclesList } from './useVehiclesList'

// Rango de precio: ±1 millón
const PRICE_RANGE = 1000000

export const usePriceRangeVehicles = (currentVehicle) => {
  // ✅ Verificar si hay precio antes de hacer la petición
  const currentPrice = currentVehicle?.precio
  const hasValidPrice = typeof currentPrice === 'number' && currentPrice > 0
  
  // ✅ Construir filtro de precio dinámicamente desde el vehículo actual
  const filters = useMemo(() => {
    if (!hasValidPrice) {
      return {}
    }
    
    // Calcular rango: precio - 1M hasta precio + 1M
    const minPrice = Math.max(0, currentPrice - PRICE_RANGE)
    const maxPrice = currentPrice + PRICE_RANGE
    
    return {
      precio: [minPrice, maxPrice]
    }
  }, [currentPrice, hasValidPrice])

  // ✅ Reutilizar el hook existente con filtro de precio
  // Pedir 6 para asegurar 5 después de excluir el actual
  const result = useVehiclesList(filters, { pageSize: 6 })

  // ✅ Excluir el vehículo actual de los resultados y limitar a 5 máximo
  const priceRangeVehicles = useMemo(() => {
    if (!currentVehicle) return []
    
    const currentId = currentVehicle.id || currentVehicle._id
    if (!currentId) return result.vehicles.slice(0, 5) // ✅ Limitar a 5 máximo

    const filtered = result.vehicles.filter(vehicle => {
      const vehicleId = vehicle.id || vehicle._id
      return vehicleId !== currentId
    })
    
    return filtered.slice(0, 5) // ✅ Limitar a 5 máximo después de filtrar
  }, [result.vehicles, currentVehicle])

  // ✅ Formatear el rango de precio para mostrar en UI
  const priceRange = useMemo(() => {
    if (!hasValidPrice) return null
    
    const minPrice = Math.max(0, currentPrice - PRICE_RANGE)
    const maxPrice = currentPrice + PRICE_RANGE
    
    return {
      min: minPrice,
      max: maxPrice,
      formatted: {
        min: new Intl.NumberFormat('es-AR', { 
          style: 'currency', 
          currency: 'ARS',
          maximumFractionDigits: 0 
        }).format(minPrice),
        max: new Intl.NumberFormat('es-AR', { 
          style: 'currency', 
          currency: 'ARS',
          maximumFractionDigits: 0 
        }).format(maxPrice)
      }
    }
  }, [currentPrice, hasValidPrice])

  return {
    vehicles: priceRangeVehicles,
    priceRange,
    isLoading: result.isLoading,
    isError: result.isError,
    error: result.error,
    refetch: result.refetch
  }
}
