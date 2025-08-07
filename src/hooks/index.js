/**
 * Hooks - Exportaciones centralizadas
 * 
 * Agrupa todos los hooks personalizados
 * para facilitar las importaciones
 * 
 * @author Indiana Usados
 * @version 3.1.0 - LAZY LOADING INTELIGENTE
 */

// ✅ HOOKS DE VEHÍCULOS
export { useVehiclesQuery } from './vehicles/useVehiclesQuery'
export { useAutoDetail } from './useAutoDetail'

// ✅ HOOKS DE ERROR HANDLING
export { 
    useErrorHandler, 
    useApiErrorHandler, 
    useValidationErrorHandler 
} from './useErrorHandler'

// ✅ HOOKS DE FILTROS
export { useFilterReducer } from './filters/useFilterReducer'

// ✅ HOOKS DE SCROLL
export { useScrollPosition } from './useScrollPosition'
export { useIntersectionObserver } from './useIntersectionObserver'
export { useScrollOptimization } from './useScrollOptimization'

// ✅ HOOKS DE IMÁGENES
export { useImageOptimization } from './useImageOptimization'
export { useCarouselImages } from './useImageOptimization'

// ✅ HOOKS DE UI
export { useDropdownMulti } from './useDropdownMulti'
export { useAuth } from './useAuth'
export { useAuthMutation } from './useAuthMutation'

// ✅ HOOKS DE LAZY LOADING
export { usePreloadRoute } from './usePreloadRoute' 