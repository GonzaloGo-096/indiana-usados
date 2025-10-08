/**
 * hooks/vehicles/index.js - Exportaciones de hooks de vehículos
 * 
 * Hooks disponibles:
 * - useVehiclesList: Hook unificado para listas con paginación infinita
 * - useVehicleDetail: Hook para detalle individual de vehículo
 * 
 * Utilidades:
 * - getVehicleImageUrl: Función para obtener URL de imagen de vehículo
 * 
 * @author Indiana Usados
 * @version 3.0.0 - Hooks consolidados y optimizados
 */

// ✅ Hook unificado para listas con paginación infinita
export { useVehiclesList } from './useVehiclesList'

// ✅ Hook para detalle individual
export { useVehicleDetail } from './useVehicleDetail'

// ✅ Función utilitaria para imágenes (no es hook)
export { getVehicleImageUrl } from './useVehicleImage'