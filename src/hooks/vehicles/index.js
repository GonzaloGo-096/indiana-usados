/**
 * hooks/vehicles/index.js - Exportaciones de hooks de vehículos
 * 
 * Hooks disponibles:
 * - useVehiclesList: Hook unificado para listas con paginación infinita
 * - useVehicleDetail: Hook para detalle individual de vehículo
 * 
 * @author Indiana Usados
 * @version 3.1.0 - Limpieza: eliminado getVehicleImageUrl (usar extractFirstImageUrl de @utils/imageExtractors)
 */

// ✅ Hook unificado para listas con paginación infinita
export { useVehiclesList } from './useVehiclesList'

// ✅ Hook para detalle individual
export { useVehicleDetail } from './useVehicleDetail'

// ✅ Hook para prefetch inteligente
export { useVehiclePrefetch } from './useVehiclePrefetch'

// ✅ Hook para vehículos similares por marca
export { useSimilarVehicles } from './useSimilarVehicles'

// ✅ Hook para vehículos en rango de precio similar
export { usePriceRangeVehicles } from './usePriceRangeVehicles'