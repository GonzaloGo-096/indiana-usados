/**
 * usePreloadImages - Hook para preload inteligente de imágenes críticas
 * 
 * Funcionalidades:
 * - Detecta vehículos en viewport
 * - Preload fotoPrincipal y fotoHover
 * - Evita preload innecesario
 * - Medible y efectivo
 * 
 * @author Indiana Usados
 * @version 1.0.0
 */

import { useEffect, useRef, useCallback } from 'react'

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

  // Función para generar URL de preload
  const generatePreloadUrl = useCallback((vehicle) => {
    if (!vehicle) return null

    // Obtener fotoPrincipal
    const fotoPrincipal = vehicle.fotoPrincipal
    let principalUrl = null
    
    if (typeof fotoPrincipal === 'object' && fotoPrincipal?.url) {
      principalUrl = fotoPrincipal.url
    } else if (typeof fotoPrincipal === 'string') {
      principalUrl = fotoPrincipal
    }

    // Obtener fotoHover
    const fotoHover = vehicle.fotoHover
    let hoverUrl = null
    
    if (typeof fotoHover === 'object' && fotoHover?.url) {
      hoverUrl = fotoHover.url
    } else if (typeof fotoHover === 'string') {
      hoverUrl = fotoHover
    }

    return { principalUrl, hoverUrl }
  }, [])

  // Función para preload de imagen
  const preloadImage = useCallback((url) => {
    if (!url || preloadedImages.current.has(url)) return

    const img = new Image()
    img.src = url
    preloadedImages.current.add(url)
    
    console.log('🚀 Preload:', url)
  }, [])

  // Función para preload de vehículo
  const preloadVehicle = useCallback((vehicle) => {
    if (!vehicle || !enablePreload) return

    const { principalUrl, hoverUrl } = generatePreloadUrl(vehicle)
    
    if (principalUrl) preloadImage(principalUrl)
    if (hoverUrl && hoverUrl !== principalUrl) preloadImage(hoverUrl)
  }, [generatePreloadUrl, preloadImage, enablePreload])

  // Función para limpiar preloads
  const clearPreloads = useCallback(() => {
    preloadedImages.current.clear()
    console.log('🧹 Preloads limpiados')
  }, [])

  // Función para obtener estadísticas
  const getStats = useCallback(() => {
    return {
      preloadedCount: preloadedImages.current.size,
      preloadedUrls: Array.from(preloadedImages.current)
    }
  }, [])

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
    }
  }, [vehicles, preloadDistance, maxPreload, preloadVehicle, enablePreload])

  return {
    preloadVehicle,
    clearPreloads,
    getStats,
    observer: observerRef.current
  }
}

export default usePreloadImages
