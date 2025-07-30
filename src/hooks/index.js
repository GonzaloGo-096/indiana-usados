/**
 * Hooks - Exportaciones centralizadas
 * 
 * Organización de hooks por categorías para facilitar las importaciones
 * 
 * @author Indiana Usados
 * @version 2.0.0
 */

// Hooks principales
export { useAuth } from './useAuth'
export { useAuthMutation } from './useAuthMutation'
export { useAutoDetail } from './useAutoDetail'
export { useGetCars } from './useGetCars'
export { useImageOptimization } from './useImageOptimization'
export { useIntersectionObserver } from './useIntersectionObserver'
export { useDropdownMulti } from './useDropdownMulti'

// ✅ AGREGADO: Hook de optimización de scroll
export { useScrollOptimization, useListScrollOptimization } from './useScrollOptimization'

// Hooks de filtros
export * from './filters' 