/**
 * useScrollDetection - Hook para detección de scroll en mobile
 * 
 * Extrae la lógica de scroll detection del FilterFormSimplified
 * para reutilización y testing independiente.
 * 
 * @author Indiana Usados
 * @version 1.0.0 - Modular
 */

import { useState, useEffect, useCallback } from 'react'

export const useScrollDetection = (options = {}) => {
  const {
    hasActiveDropdown = false,
    hasActiveFilters = false,
    hasActiveDrawer = false,
    preventHide = false
  } = options
  
  const [isVisible, setIsVisible] = useState(false)

  // ✅ OPTIMIZADO: useCallback para evitar recreaciones
  const handleScroll = useCallback(() => {
    const scrollTop = window.pageYOffset || 
                     document.documentElement.scrollTop || 
                     document.body.scrollTop || 0
    
    const shouldShow = scrollTop > 50
    setIsVisible(shouldShow)
  }, [])

  const handleScrollEnd = useCallback(() => {
    // ✅ CORREGIDO: Solo verificar interacciones al intentar ocultar
    const hideTimeout = setTimeout(() => {
      // Verificar si hay interacciones activas antes de ocultar
      const hasActiveInteractions = hasActiveDropdown || hasActiveFilters || hasActiveDrawer || preventHide
      
      if (!hasActiveInteractions) {
        setIsVisible(false)
      }
    }, 10000)
    
    return hideTimeout
  }, [hasActiveDropdown, hasActiveFilters, hasActiveDrawer, preventHide])

  useEffect(() => {
    let scrollTimeout
    let hideTimeout

    const handleScrollWithDelay = () => {
      handleScroll()
      if (scrollTimeout) {
        clearTimeout(scrollTimeout)
      }
      const delay = 'ontouchstart' in window ? 100 : 150
      scrollTimeout = setTimeout(() => {
        hideTimeout = handleScrollEnd()
      }, delay)
    }

    // ✅ OPTIMIZADO: Throttling para mejor performance
    let ticking = false
    const throttledScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          handleScrollWithDelay()
          ticking = false
        })
        ticking = true
      }
    }

    window.addEventListener('scroll', throttledScroll, { passive: true })
    
    return () => {
      window.removeEventListener('scroll', throttledScroll)
      if (scrollTimeout) clearTimeout(scrollTimeout)
      if (hideTimeout) clearTimeout(hideTimeout)
    }
  }, [handleScroll, handleScrollEnd])

  return {
    isVisible,
    // Utilidades adicionales
    showActions: () => setIsVisible(true),
    hideActions: () => setIsVisible(false),
    toggleActions: () => setIsVisible(prev => !prev)
  }
}
