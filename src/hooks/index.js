/**
 * Hooks - Exportaciones centralizadas
 * 
 * Agrupa todas las exportaciones de hooks para facilitar las importaciones
 * 
 * @author Indiana Usados
 * @version 2.0.0 - Modular
 */

// ===== HOOKS MODULARES (actualizados a rutas de dominio) =====
export { DeviceProvider, useDevice } from './ui/useDeviceDetection'
export { useScrollPosition } from './ui/useScrollPosition'

// ===== REEXPORTS POR DOMINIO =====
export * from './auth'
export * from './ui'
export * from './images'
export * from './forms'
export * from './perf'

// ===== HOOKS EXISTENTES (redirigidos a rutas de dominio) =====
export { useCarMutation } from './admin/useCarMutation'
export { useCarouselImages } from './images/useImageOptimization'
export { usePreloadImages } from './perf/usePreloadImages'
export { usePreloadRoute } from './perf/usePreloadRoute'

// ===== HOOKS DE VEHICULOS =====
export * from './vehicles'

// ===== HOOKS DE FILTROS =====
// ✅ LIMPIADO: useFilterReducer obsoleto eliminado

// ===== HOOKS DE SEO =====
export * from './seo/useSEO'