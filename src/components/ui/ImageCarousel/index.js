/**
 * ImageCarousel - Exportaciones
 * 
 * ✅ IMPLEMENTADO: Soporte para lazy loading
 * 
 * @author Indiana Usados
 * @version 2.0.0 - LAZY LOADING
 */


// ✅ EXPORTACIÓN NORMAL: Para uso directo
export { ImageCarousel } from './ImageCarousel'

// ✅ EXPORTACIÓN LAZY: Para carga bajo demanda
import { lazy } from 'react'
export const LazyImageCarousel = lazy(() => import('./ImageCarousel')) 