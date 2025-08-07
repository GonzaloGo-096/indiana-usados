/**
 * hooks/vehicles/index.js - Exportaciones de hooks de vehículos
 * 
 * Hooks especializados:
 * - useVehiclesData: Hook base para datos
 * - useVehiclesInfinite: Hook para infinite scroll
 * - useVehicleDetail: Hook para detalle individual
 * - useVehiclesQuery: Hook unificador (mantiene compatibilidad)
 * 
 * @author Indiana Usados
 * @version 1.0.0
 */

// Hooks especializados
export { useVehiclesData } from './useVehiclesData'
export { useVehiclesInfinite } from './useVehiclesInfinite'
export { useVehicleDetail } from './useVehicleDetail'

// Hook unificador (mantiene compatibilidad)
export { useVehiclesQuery } from './useVehiclesQuery' 