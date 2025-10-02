/**
 * useDeviceDetection - Hook y contexto para detección de dispositivo
 */

import React, { useState, useEffect, useContext, createContext } from 'react'

export const useDeviceDetection = () => {
  const [isMobile, setIsMobile] = useState(false)
  const [isDesktop, setIsDesktop] = useState(false)

  useEffect(() => {
    const checkIsMobile = () => {
      const mobile = window.innerWidth <= 768
      setIsMobile(mobile)
      setIsDesktop(!mobile)
    }
    
    // Verificación inicial
    checkIsMobile()
    
    // Listener para cambios de tamaño
    window.addEventListener('resize', checkIsMobile)
    
    return () => window.removeEventListener('resize', checkIsMobile)
  }, [])

  return { 
    isMobile, 
    isDesktop,
    // Utilidades adicionales
    deviceType: isMobile ? 'mobile' : 'desktop',
    breakpoint: 768
  }
}

// ===== CONTEXTO GLOBAL DE DISPOSITIVO =====
const DeviceContext = createContext({
  isMobile: false,
  isDesktop: true,
  deviceType: 'desktop',
  breakpoint: 768
})

export const DeviceProvider = ({ children }) => {
  const [isMobile, setIsMobile] = useState(false)
  const [isDesktop, setIsDesktop] = useState(true)

  useEffect(() => {
    const checkIsMobile = () => {
      const mobile = window.innerWidth <= 768
      setIsMobile(mobile)
      setIsDesktop(!mobile)
    }
    checkIsMobile()
    window.addEventListener('resize', checkIsMobile)
    return () => window.removeEventListener('resize', checkIsMobile)
  }, [])

  const value = React.useMemo(() => ({
    isMobile,
    isDesktop,
    deviceType: isMobile ? 'mobile' : 'desktop',
    breakpoint: 768
  }), [isMobile, isDesktop])

  return (
    <DeviceContext.Provider value={value}>
      {children}
    </DeviceContext.Provider>
  )
}

export const useDevice = () => useContext(DeviceContext)


