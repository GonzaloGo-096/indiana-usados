/**
 * Hooks - Exportaciones centralizadas
 * 
 * Agrupa todos los hooks personalizados
 * para facilitar las importaciones
 * 
 * @author Indiana Usados
 * @version 3.4.0 - Hook unificado de vehículos agregado
 */

// ✅ HOOKS DE VEHÍCULOS
export { useVehiclesList } from './vehicles/useVehiclesList'
export { useVehiclesFeed } from './useVehiclesFeed'
export { useAutoDetail } from './useAutoDetail'

// ✅ HOOKS DE MUTACIONES
export { useCarMutation } from './useCarMutation'

// ✅ HOOKS DE ERROR HANDLING
export { useErrorBase } from './useErrorBase'
export { 
    useErrorHandler, 
    useApiErrorHandler, 
    useValidationErrorHandler 
} from './useErrorHandler'

// ✅ HOOKS DE FILTROS
export { useFilterReducer } from './filters/useFilterReducer'

// ✅ HOOKS DE CONFIGURACIÓN
export { useConfig } from './useConfig'

// ✅ HOOKS DE SCROLL
export { useScrollPosition } from './useScrollPosition'

// ✅ HOOKS DE IMÁGENES
export { useImageOptimization } from './useImageOptimization'
export { useCarouselImages } from './useImageOptimization'

// ✅ HOOKS DE UI
export { useAuth } from './useAuth'
export { useAutoLogout } from './useAutoLogout'
export { useVehicleImage, getVehicleImageUrl } from './useVehicleImage'
export { useVehicleData } from './useVehicleData'

// ✅ HOOKS DE LAZY LOADING
export { usePreloadRoute } from './usePreloadRoute' 