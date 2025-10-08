import { useEffect, useRef, useCallback, useState } from 'react'
import { extractVehicleImageUrls } from '@utils/imageExtractors'

/**
 * Hook para preload de imágenes críticas
 * @param {Array} vehicles - Array de vehículos
 * @param {Object} options - Opciones de preload
 * @returns {Object} - Estado y funciones de preload
 */
export const usePreloadImages = (vehicles = [], options = {}) => {
  const {
    preloadDistance = 200, // px antes de entrar en viewport
    maxPreload = 6, // máximo de imágenes a preload
    enablePreload = true
  } = options

  // Estado para detección de puntero fino
  const [hasFinePointer, setHasFinePointer] = useState(false)

  // Detectar velocidad de conexión
  const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection
  const isSlowConnection = connection && (
    connection.effectiveType === 'slow-2g' || 
    connection.effectiveType === '2g' ||
    connection.saveData === true
  )
  
  // Ajustar configuración según conexión
  const adjustedMaxPreload = isSlowConnection ? Math.min(maxPreload, 3) : maxPreload
  const adjustedPreloadDistance = isSlowConnection ? Math.min(preloadDistance, 100) : preloadDistance

  const preloadedImages = useRef(new Set())
  const observerRef = useRef(null)
  const abortControllers = useRef(new Map()) // Para cancelar requests en curso

  // Detectar puntero fino (mouse/trackpad) vs touch
  useEffect(() => {
    const mediaQuery = window.matchMedia('(pointer: fine)')
    
    const handlePointerChange = (e) => {
      setHasFinePointer(e.matches)
    }
    
    // Verificar estado inicial
    setHasFinePointer(mediaQuery.matches)
    
    // Escuchar cambios
    mediaQuery.addEventListener('change', handlePointerChange)
    
    return () => {
      mediaQuery.removeEventListener('change', handlePointerChange)
    }
  }, [])

  // ✅ OPTIMIZADO: Usa helper centralizado para extracción de URLs
  // Eliminada función generatePreloadUrl (25 líneas) → Reemplazada por extractVehicleImageUrls

  // Función para preload de imagen con AbortController
  const preloadImage = useCallback((url) => {
    if (!url || preloadedImages.current.has(url)) return

    // Crear AbortController para esta imagen
    const abortController = new AbortController()
    abortControllers.current.set(url, abortController)

    const img = new Image()
    
    // Configurar event listeners
    const handleLoad = () => {
      preloadedImages.current.add(url)
      abortControllers.current.delete(url)
    }
    
    const handleError = () => {
      abortControllers.current.delete(url)
    }

    img.addEventListener('load', handleLoad, { once: true })
    img.addEventListener('error', handleError, { once: true })
    
    // Iniciar carga
    img.src = url
  }, [])

  // ✅ OPTIMIZADO: Función para preload de vehículo usando helper centralizado
  const preloadVehicle = useCallback((vehicle) => {
    if (!vehicle || !enablePreload) return

    // Extraer URLs usando helper centralizado
    const { principal, hover } = extractVehicleImageUrls(vehicle)
    
    // Siempre preload imagen principal
    if (principal) preloadImage(principal)
    
    // Solo preload hover en dispositivos con puntero fino
    if (hasFinePointer && hover && hover !== principal) {
      preloadImage(hover)
    }
  }, [preloadImage, enablePreload, hasFinePointer])

  // Función para limpiar preloads y cancelar requests en curso
  const clearPreloads = useCallback(() => {
    // Cancelar requests en curso
    abortControllers.current.forEach((controller) => {
      controller.abort()
    })
    abortControllers.current.clear()
    
    // Limpiar lista de preloads
    preloadedImages.current.clear()
  }, [])

  // Función para obtener estadísticas
  const getStats = useCallback(() => {
    return {
      preloadedCount: preloadedImages.current.size,
      preloadedUrls: Array.from(preloadedImages.current),
      pendingRequests: abortControllers.current.size,
      hasFinePointer,
      isSlowConnection
    }
  }, [hasFinePointer, isSlowConnection])

  // Effect para setup del observer
  useEffect(() => {
    if (!enablePreload || !vehicles.length) return

    // Crear observer para detectar vehículos en viewport
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const vehicleId = entry.target.dataset.vehicleId
            const vehicle = vehicles.find(v => (v.id || v._id) === vehicleId)
            
            if (vehicle && preloadedImages.current.size < adjustedMaxPreload) {
              // Preload con prioridad basada en proximidad al viewport
              const priority = entry.intersectionRatio > 0.5 ? 'high' : 'low'
              preloadVehicle(vehicle, { priority })
            }
          }
        })
      },
      {
        rootMargin: `${adjustedPreloadDistance}px`,
        threshold: [0, 0.25, 0.5, 0.75, 1] // Múltiples thresholds para mejor control
      }
    )

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect()
      }
      // Cancelar requests pendientes al desmontar
      clearPreloads()
    }
  }, [vehicles, preloadDistance, maxPreload, preloadVehicle, enablePreload, clearPreloads])

  return {
    preloadVehicle,
    clearPreloads,
    getStats,
    observer: observerRef.current
  }
}

export default usePreloadImages


