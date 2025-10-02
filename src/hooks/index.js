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
export { useFilterForm } from './useFilterForm'
export { useScrollDetection } from './useScrollDetection'
export { useRangeHandlers } from './useRangeHandlers'
export { useSelectHandlers } from './useSelectHandlers'

// ===== HOOKS EXISTENTES =====
export { useAuth } from './useAuth'
export { useAutoLogout } from './useAutoLogout'
export { useCarMutation } from './useCarMutation'
export { useImageOptimization } from './useImageOptimization'
export { usePreloadImages } from './usePreloadImages'
export { usePreloadRoute } from './usePreloadRoute'
export { useScrollPosition } from './useScrollPosition'
export { useVehicleData } from './useVehicleData'
export { useVehicleImage } from './useVehicleImage'
export { useAdminMutations } from './useAdminMutations'

// ===== HOOKS DE VEHICULOS =====
export * from './vehicles'

// ===== HOOKS DE FILTROS =====
// export { useFilterReducer } from './filters/useFilterReducer' // Removed