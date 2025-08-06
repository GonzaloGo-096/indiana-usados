/**
 * ImageCarousel - Exportaciones
 * 
 * ✅ IMPLEMENTADO: Soporte para lazy loading
 * 
 * @author Indiana Usados
 * @version 2.0.0 - LAZY LOADING
 */

import React from 'react'

// ✅ EXPORTACIÓN NORMAL: Para uso directo
export { ImageCarousel } from './ImageCarousel'

// ✅ EXPORTACIÓN LAZY: Para carga bajo demanda
export const LazyImageCarousel = React.lazy(() => import('./ImageCarousel')) 