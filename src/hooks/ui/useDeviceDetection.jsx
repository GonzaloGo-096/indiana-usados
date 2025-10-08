/**
 * DeviceProvider - Context para detección de dispositivo responsive
 * 
 * Características:
 * - Detecta mobile vs desktop basado en breakpoint configurable
 * - Usa matchMedia API (consistente con CSS media queries)
 * - Debounce configurable para optimizar performance en resize
 * - SSR-safe (no crashea en server-side rendering)
 * 
 * @author Indiana Usados
 * @version 3.0.0 - Refactor completo: elimina hook duplicado, añade matchMedia, debounce
 */

import React, { useState, useEffect, useContext, createContext } from 'react'

// ===== CONTEXTO GLOBAL DE DISPOSITIVO =====
const DeviceContext = createContext({
  isMobile: false,
  isDesktop: true,
  deviceType: 'desktop',
  breakpoint: 768
})

/**
 * DeviceProvider - Proveedor de contexto para detección de dispositivo
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.children - Componentes hijos
 * @param {number} [props.breakpoint=768] - Breakpoint en px para mobile/desktop
 * @param {number} [props.debounceMs=150] - Delay en ms para debounce de resize
 * 
 * @example
 * // Uso por defecto (breakpoint 768px, debounce 150ms)
 * <DeviceProvider>
 *   <App />
 * </DeviceProvider>
 * 
 * @example
 * // Customizado
 * <DeviceProvider breakpoint={640} debounceMs={200}>
 *   <App />
 * </DeviceProvider>
 */
export const DeviceProvider = ({ 
  children, 
  breakpoint = 768,
  debounceMs = 150 
}) => {
  // ✅ ESTADO ÚNICO: Solo isMobile, isDesktop se deriva
  const [isMobile, setIsMobile] = useState(() => {
    // ✅ SSR-SAFE: Verificar que estamos en el cliente
    if (typeof window === 'undefined') return false
    
    // ✅ INICIALIZACIÓN: Usar matchMedia desde el inicio
    return window.matchMedia(`(max-width: ${breakpoint}px)`).matches
  })

  useEffect(() => {
    // ✅ MEJOR PRÁCTICA: matchMedia en vez de window.innerWidth
    // Consistente con CSS media queries, considera zoom del browser
    const mediaQuery = window.matchMedia(`(max-width: ${breakpoint}px)`)
    
    // ✅ HANDLER: Actualizar estado basado en matchMedia
    const handleChange = (event) => {
      setIsMobile(event.matches)
    }
    
    // ✅ DEBOUNCE: Evitar renders excesivos durante resize
    let debounceTimeout
    const debouncedChange = (event) => {
      clearTimeout(debounceTimeout)
      debounceTimeout = setTimeout(() => {
        handleChange(event)
      }, debounceMs)
    }
    
    // ✅ VERIFICACIÓN INICIAL: Sincronizar estado con realidad actual
    setIsMobile(mediaQuery.matches)
    
    // ✅ LISTENER MODERNO: matchMedia.addEventListener (más eficiente que window.resize)
    mediaQuery.addEventListener('change', debouncedChange)
    
    // ✅ CLEANUP: Remover listener y cancelar timeout pendiente
    return () => {
      mediaQuery.removeEventListener('change', debouncedChange)
      clearTimeout(debounceTimeout)
    }
  }, [breakpoint, debounceMs])

  // ✅ MEMOIZACIÓN: Evitar re-crear objeto en cada render
  const value = React.useMemo(() => ({
    isMobile,
    isDesktop: !isMobile, // ✅ DERIVADO: No es estado, se calcula desde isMobile
    deviceType: isMobile ? 'mobile' : 'desktop',
    breakpoint
  }), [isMobile, breakpoint])

  return (
    <DeviceContext.Provider value={value}>
      {children}
    </DeviceContext.Provider>
  )
}

/**
 * useDevice - Hook para consumir contexto de dispositivo
 * 
 * @returns {Object} Información del dispositivo actual
 * @returns {boolean} return.isMobile - Es dispositivo móvil (≤ breakpoint)
 * @returns {boolean} return.isDesktop - Es dispositivo desktop (> breakpoint)
 * @returns {string} return.deviceType - 'mobile' | 'desktop'
 * @returns {number} return.breakpoint - Breakpoint configurado en px
 * 
 * @example
 * const { isMobile, isDesktop, deviceType } = useDevice()
 * 
 * if (isMobile) {
 *   return <MobileLayout />
 * }
 * return <DesktopLayout />
 */
export const useDevice = () => {
  const context = useContext(DeviceContext)
  
  // ✅ VALIDACIÓN: Asegurar que el hook se usa dentro del Provider
  if (!context) {
    throw new Error('useDevice debe usarse dentro de DeviceProvider')
  }
  
  return context
}
