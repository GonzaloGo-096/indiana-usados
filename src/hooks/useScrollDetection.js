/**
 * useScrollDetection - Hook para detección de scroll en mobile
 * 
 * Extrae la lógica de scroll detection del FilterFormSimplified
 * para reutilización y testing independiente.
 * 
 * @author Indiana Usados
 * @version 1.0.0 - Modular
 */

import { useState, useEffect } from 'react'

export const useScrollDetection = () => {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    let scrollTimeout
    let hideTimeout
    let lastScrollTop = 0

    const handleScroll = () => {
      const scrollTop = window.pageYOffset || 
                       document.documentElement.scrollTop || 
                       document.body.scrollTop || 0
      
      // Solo procesar cambios significativos
      if (Math.abs(scrollTop - lastScrollTop) < 10) return
      
      lastScrollTop = scrollTop
      const shouldShow = scrollTop > 50
      
      if (shouldShow) {
        setIsVisible(true)
        if (hideTimeout) {
          clearTimeout(hideTimeout)
          hideTimeout = null
        }
      } else {
        setIsVisible(false)
      }
    }

    const handleScrollEnd = () => {
      if (hideTimeout) {
        clearTimeout(hideTimeout)
      }
      hideTimeout = setTimeout(() => setIsVisible(false), 2000)
    }

    const handleScrollWithDelay = () => {
      handleScroll()
      if (scrollTimeout) {
        clearTimeout(scrollTimeout)
      }
      const delay = 'ontouchstart' in window ? 100 : 150
      scrollTimeout = setTimeout(handleScrollEnd, delay)
    }

    window.addEventListener('scroll', handleScrollWithDelay, { passive: true })
    
    return () => {
      window.removeEventListener('scroll', handleScrollWithDelay)
      if (scrollTimeout) clearTimeout(scrollTimeout)
      if (hideTimeout) clearTimeout(hideTimeout)
    }
  }, [])

  return {
    isVisible,
    // Utilidades adicionales
    showActions: () => setIsVisible(true),
    hideActions: () => setIsVisible(false),
    toggleActions: () => setIsVisible(prev => !prev)
  }
}
