/**
 * Hooks - Exportaciones centralizadas
 * 
 * Agrupa todas las exportaciones de hooks para facilitar las importaciones
 * 
 * @author Indiana Usados
 * @version 2.0.0 - Modular
 */

// ===== HOOKS MODULARES =====
export { useDeviceDetection, DeviceProvider, useDevice } from './useDeviceDetection'
export { useScrollDetection } from './useScrollDetection'
export { useScrollPosition } from './useScrollPosition'
export { useRangeHandlers } from './useRangeHandlers'
export { useSelectHandlers } from './useSelectHandlers'

// ===== HOOKS EXISTENTES =====
export { useAuth } from './useAuth'
export { useAutoLogout } from './useAutoLogout'
export { useCarMutation } from './useCarMutation'
export { useImageOptimization } from './useImageOptimization'
export { usePreloadImages } from './usePreloadImages'
export { usePreloadRoute } from './usePreloadRoute'
export { useVehicleData } from './useVehicleData'
export { useVehicleImage } from './useVehicleImage'
export { useAdminMutations } from './useAdminMutations'

// ===== HOOKS DE VEHICULOS =====
export * from './vehicles'

// ===== HOOKS DE FILTROS =====
// ✅ LIMPIADO: useFilterReducer obsoleto eliminado