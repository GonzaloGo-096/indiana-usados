/**
 * components/shared/index.js - Exportaciones de componentes compartidos
 * 
 * Componentes que se comparten entre diferentes módulos:
 * - ErrorBoundary: Manejo de errores
 * - Skeletons: Estados de carga
 * 
 * @author Indiana Usados
 * @version 1.0.0
 */

// ===== ERROR BOUNDARY =====
export { default as GlobalErrorBoundary } from '../ErrorBoundary/GlobalErrorBoundary'
export { default as VehiclesErrorBoundary } from '../ErrorBoundary/VehiclesErrorBoundary'

// ===== SKELETONS =====
export { ListAutosSkeleton } from '../skeletons/ListAutosSkeleton/ListAutosSkeleton'
export { CardAutoSkeleton } from '../skeletons/ListAutosSkeleton/CardAutoSkeleton'
export { default as DetalleSkeleton } from '../skeletons/DetalleSkeleton/DetalleSkeleton'
export { 
  SkeletonGrid, 
  Skeleton, 
  SkeletonButton, 
  SkeletonGroup,
  SkeletonImage,
  SkeletonTitle,
  SkeletonText
} from '../skeletons/Skeleton/index.js' 