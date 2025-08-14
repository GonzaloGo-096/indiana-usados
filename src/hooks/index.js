/**
 * Hooks - Exportaciones centralizadas
 * 
 * Agrupa todos los hooks personalizados
 * para facilitar las importaciones
 * 
 * @author Indiana Usados
 * @version 3.3.0 - SISTEMA DE CONFIGURACIÓN CENTRALIZADO
 */

// ✅ HOOKS DE VEHÍCULOS
export { useVehiclesQuery } from './vehicles/useVehiclesQuery'
export { useAutoDetail } from './useAutoDetail'

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
export { 
    useConfig, 
    useApiConfig, 
    useFeaturesConfig, 
    useAuthConfig, 
    useContactConfig 
} from './useConfig'

// ✅ HOOKS DE ENTORNO DE API
export { useApiEnvironment } from './useApiEnvironment'

// ✅ HOOKS DE SCROLL
export { useScrollPosition } from './useScrollPosition'
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