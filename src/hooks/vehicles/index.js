/**
 * hooks/vehicles/index.js - Exportaciones de hooks de vehículos
 * 
 * Hooks disponibles:
 * - useVehiclesList: Hook unificado para listas (reemplaza useVehiclesData + useVehiclesInfinite)
 * - useVehicleDetail: Hook para detalle individual
 * - useVehiclesQuery: Hook unificador (mantiene compatibilidad)
 * 
 * @author Indiana Usados
 * @version 2.0.0 - Hooks unificados y optimizados
 */

// ✅ Hook unificado para listas
export { useVehiclesList } from './useVehiclesList'

// ✅ Hook para detalle individual
export { useVehicleDetail } from './useVehicleDetail'

// ✅ Hook unificador (mantiene compatibilidad)
export { useVehiclesList as useVehiclesQuery } from './useVehiclesList' 