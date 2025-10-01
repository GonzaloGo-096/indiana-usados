/**
 * Hooks - Exportaciones centralizadas LIMPIAS
 * 
 * Solo hooks que realmente existen y se usan
 * 
 * @author Indiana Usados
 * @version 4.0.0 - Limpiado y consolidado
 */

// ✅ HOOKS DE VEHÍCULOS
export { useVehiclesList } from './vehicles/useVehiclesList'
export { useVehicleDetail } from './vehicles/useVehicleDetail'

// ✅ HOOKS DE MUTACIONES
export { useCarMutation } from './useCarMutation'

// ✅ HOOKS DE PRELOADING
export { usePreloadRoute } from './usePreloadRoute'
export { usePreloadImages } from './usePreloadImages'

// ✅ HOOKS DE CONFIGURACIÓN
export { useImageOptimization } from './useImageOptimization'
export { useScrollPosition } from './useScrollPosition'
export { useAutoLogout } from './useAutoLogout'
export { useVehicleData } from './useVehicleData'
export { useAdminMutations } from './useAdminMutations'
export { useAuth } from './useAuth'
export { useVehicleImage } from './useVehicleImage'