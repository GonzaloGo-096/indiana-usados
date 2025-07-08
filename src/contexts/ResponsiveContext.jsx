/**
 * ResponsiveContext - Contexto para manejo de responsive y drawer
 * 
 * Responsabilidades:
 * - Detección de pantalla responsive
 * - Control del drawer mobile
 * - Persistencia de estado del drawer
 * 
 * @author Indiana Usados
 * @version 1.0.0
 */

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'

// Crear el contexto con valores por defecto
const ResponsiveContext = createContext({
    // Estado responsive
    isMobile: false,
    isTablet: false,
    isDesktop: false,
    isDrawerOpen: false,
    
    // Acciones responsive
    openDrawer: () => {},
    closeDrawer: () => {},
    
    // Utilidades
    breakpoints: {}
})

// Hook personalizado para usar el contexto
export const useResponsiveContext = () => {
    const context = useContext(ResponsiveContext)
    if (!context) {
        throw new Error('useResponsiveContext debe usarse dentro de ResponsiveProvider')
    }
    return context
}

// Breakpoints para responsive
const BREAKPOINTS = {
    mobile: 768,
    tablet: 1024,
    desktop: 1200
}

// Provider del contexto
export const ResponsiveProvider = ({ children }) => {
    // ===== ESTADO RESPONSIVE =====
    const [screenSize, setScreenSize] = useState({
        isMobile: false,
        isTablet: false,
        isDesktop: false,
        width: typeof window !== 'undefined' ? window.innerWidth : 1200
    })
    
    const [isDrawerOpen, setIsDrawerOpen] = useState(() => {
        // Recuperar estado del drawer del sessionStorage
        if (typeof window !== 'undefined') {
            const saved = sessionStorage.getItem('filterDrawerOpen')
            return saved ? JSON.parse(saved) : false
        }
        return false
    })

    // ===== DETECCIÓN DE TAMAÑO DE PANTALLA =====
    const checkScreenSize = useCallback(() => {
        if (typeof window === 'undefined') return
        
        const width = window.innerWidth
        const newScreenSize = {
            isMobile: width <= BREAKPOINTS.mobile,
            isTablet: width > BREAKPOINTS.mobile && width <= BREAKPOINTS.tablet,
            isDesktop: width > BREAKPOINTS.tablet,
            width
        }
        

        
        setScreenSize(newScreenSize)
        
        // Cerrar drawer automáticamente al cambiar a desktop
        if (newScreenSize.isDesktop && isDrawerOpen) {
            setIsDrawerOpen(false)
            sessionStorage.removeItem('filterDrawerOpen')
        }
    }, [isDrawerOpen])

    // Configurar listener de resize
    useEffect(() => {
        if (typeof window === 'undefined') return
        

        checkScreenSize()
        
        const handleResize = () => {
            checkScreenSize()
        }
        
        window.addEventListener('resize', handleResize)
        
        return () => {
            window.removeEventListener('resize', handleResize)
        }
    }, [checkScreenSize])

    // ===== PERSISTENCIA DE ESTADO =====
    
    // Persistir estado del drawer
    useEffect(() => {
        if (typeof window !== 'undefined') {
            if (isDrawerOpen) {
                sessionStorage.setItem('filterDrawerOpen', JSON.stringify(isDrawerOpen))
            } else {
                sessionStorage.removeItem('filterDrawerOpen')
            }
        }
    }, [isDrawerOpen])

    // ===== ACCIONES RESPONSIVE =====
    
    const openDrawer = useCallback(() => {
        if (screenSize.isMobile) {
            setIsDrawerOpen(true)
        }
    }, [screenSize.isMobile])

    const closeDrawer = useCallback(() => {
        setIsDrawerOpen(false)
    }, [])

    // ===== VALOR DEL CONTEXTO =====
    
    const contextValue = {
        // Estado responsive
        ...screenSize,
        isDrawerOpen,
        
        // Acciones responsive
        openDrawer,
        closeDrawer,
        
        // Utilidades
        breakpoints: BREAKPOINTS
    }

    return (
        <ResponsiveContext.Provider value={contextValue}>
            {children}
        </ResponsiveContext.Provider>
    )
}

export default ResponsiveContext 