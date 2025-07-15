/**
 * Hooks - Exportaciones centralizadas
 * 
 * Agrupa todos los hooks relacionados con el sistema de filtros
 * para facilitar las importaciones
 * 
 * @author Indiana Usados
 * @version 1.0.0
 */

// Hook principal del sistema de filtros
export { useFilterSystem } from './useFilterSystem'

// Hook de notificaciones
export { useFilterNotifications } from './useFilterNotifications'

// Hook alternativo con composition pattern
export { useFilterComposition } from './useFilterComposition'

// Hook simple sin React Query (para casos básicos)
export { useSimpleFilter } from './useSimpleFilter' 