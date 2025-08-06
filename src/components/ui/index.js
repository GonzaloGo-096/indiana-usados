/**
 * UI Components - Exportaciones centralizadas
 * 
 * Agrupa todos los componentes UI base
 * para facilitar las importaciones
 * 
 * @author Indiana Usados
 * @version 3.0.0 - CODE SPLITTING IMPLEMENTADO
 */

export { FormInput } from './FormInput'
export { Button } from './Button'
export { Modal } from './Modal'
export { Alert } from './Alert'
export { ErrorState } from './ErrorState'
export { ImageCarousel } from './ImageCarousel'
export { OptimizedImage } from './OptimizedImage' 
export { default as RangeSlider } from './RangeSlider/RangeSlider' 
export { default as MultiSelect } from './MultiSelect/MultiSelect'

// ✅ NUEVOS: Componentes para Code Splitting
export { LoadingSpinner } from './LoadingSpinner'
export { LazyComponent } from './LazyComponent' 