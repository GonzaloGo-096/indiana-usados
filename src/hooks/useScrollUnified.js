/**
 * useScrollUnified - Hook unificado para gestión de scroll
 * 
 * Responsabilidades:
 * - Combina useScrollDetection y useScrollPosition
 * - Evita conflictos entre hooks
 * - Performance optimizada
 * - API consistente
 * 
 * @author Indiana Usados
 * @version 1.0.0 - Arquitectura unificada
 */

import { useScrollDetection } from './useScrollDetection'
import { useScrollPosition } from './useScrollPosition'

export const useScrollUnified = (options = {}) => {
  const {
    // Opciones para useScrollDetection
    enableDetection = true,
    hasActiveDropdown = false,
    hasActiveFilters = false,
    hasActiveDrawer = false,
    preventHide = false,
    
    // Opciones para useScrollPosition  
    enablePosition = true,
    key = 'default',
    debounceMs = 100,
    
    // Configuración general
    enabled = true
  } = options

  // ✅ Hooks condicionales para evitar conflictos
  const scrollDetection = useScrollDetection({
    hasActiveDropdown,
    hasActiveFilters,
    hasActiveDrawer,
    preventHide
  })
  const scrollPosition = useScrollPosition({
    key,
    debounceMs,
    enabled: enabled && enablePosition
  })

  // ✅ API UNIFICADA
  return {
    // Detección de scroll (mobile actions)
    isVisible: enableDetection ? scrollDetection.isVisible : false,
    showActions: scrollDetection.showActions,
    hideActions: scrollDetection.hideActions,
    toggleActions: scrollDetection.toggleActions,
    
    // Posición de scroll (navegación)
    saveScrollPosition: scrollPosition.saveScrollPosition,
    restoreScrollPosition: scrollPosition.restoreScrollPosition,
    clearScrollPosition: scrollPosition.clearScrollPosition,
    navigateWithScroll: scrollPosition.navigateWithScroll,
    lastPosition: scrollPosition.lastPosition,
    
    // Utilidades
    isEnabled: enabled,
    hasDetection: enableDetection,
    hasPosition: enablePosition
  }
}

export default useScrollUnified
