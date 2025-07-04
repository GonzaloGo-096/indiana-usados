/**
 * FilterContext - Contexto general para manejo de filtros y responsive
 * 
 * Responsabilidades:
 * - Estado unificado de filtros
 * - Detección de pantalla responsive
 * - Control del drawer mobile
 * - Persistencia de estado
 * 
 * @author Indiana Usados
 * @version 1.0.0
 */

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react'
import { useFilters } from '../hooks/useFilters'

// Crear el contexto con valores por defecto
const FilterContext = createContext({
    // Estado de filtros
    currentFilters: {},
    isSubmitting: false,
    activeFiltersCount: 0,
    queryParams: {},
    
    // Estado responsive
    isMobile: false,
    isTablet: false,
    isDesktop: false,
    isDrawerOpen: false,
    
    // Acciones de filtros
    handleFiltersChange: () => {},
    clearFilter: () => {},
    clearAllFilters: () => {},
    
    // Acciones responsive
    openDrawer: () => {},
    closeDrawer: () => {},
    
    // Utilidades
    breakpoints: {}
})

// Hook personalizado para usar el contexto
export const useFilterContext = () => {
    const context = useContext(FilterContext)
    if (!context) {
        throw new Error('useFilterContext debe usarse dentro de FilterProvider')
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
export const FilterProvider = ({ children }) => {
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

    // ===== ESTADO DE FILTROS =====
    const [currentFilters, setCurrentFilters] = useState(() => {
        // Recuperar filtros del sessionStorage
        if (typeof window !== 'undefined') {
            const saved = sessionStorage.getItem('currentFilters')
            return saved ? JSON.parse(saved) : {}
        }
        return {}
    })

    // ===== HOOKS EXTERNOS =====
    const {
        isSubmitting,
        handleFiltersChange: handleFiltersChangeFromHook,
        getQueryParams,
        getActiveFiltersCount
    } = useFilters()

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

    // Persistir filtros
    useEffect(() => {
        if (typeof window !== 'undefined') {
            sessionStorage.setItem('currentFilters', JSON.stringify(currentFilters))
        }
    }, [currentFilters])

    // ===== ACCIONES DE FILTROS =====
    
    const handleFiltersChange = useCallback((filters) => {
        setCurrentFilters(filters)
        handleFiltersChangeFromHook(filters)
    }, [handleFiltersChangeFromHook])

    const clearFilter = useCallback((filterKey) => {
        const newFilters = { ...currentFilters }
        delete newFilters[filterKey]
        setCurrentFilters(newFilters)
        handleFiltersChangeFromHook(newFilters)
    }, [currentFilters, handleFiltersChangeFromHook])

    const clearAllFilters = useCallback(() => {
        setCurrentFilters({})
        handleFiltersChangeFromHook({})
    }, [handleFiltersChangeFromHook])

    // ===== ACCIONES RESPONSIVE =====
    
    const openDrawer = useCallback(() => {
        if (screenSize.isMobile) {
            setIsDrawerOpen(true)
        }
    }, [screenSize.isMobile])

    const closeDrawer = useCallback(() => {
        setIsDrawerOpen(false)
    }, [])

    // ===== VALORES DERIVADOS =====
    
    const activeFiltersCount = useMemo(() => 
        getActiveFiltersCount(currentFilters), 
        [currentFilters, getActiveFiltersCount]
    )
    
    const queryParams = useMemo(() => 
        getQueryParams(currentFilters), 
        [currentFilters, getQueryParams]
    )

    // ===== VALOR DEL CONTEXTO =====
    
    const contextValue = useMemo(() => ({
        // Estado de filtros
        currentFilters,
        isSubmitting,
        activeFiltersCount,
        queryParams,
        
        // Estado responsive
        ...screenSize,
        isDrawerOpen,
        
        // Acciones de filtros
        handleFiltersChange,
        clearFilter,
        clearAllFilters,
        
        // Acciones responsive
        openDrawer,
        closeDrawer,
        
        // Utilidades
        breakpoints: BREAKPOINTS
    }), [
        currentFilters,
        isSubmitting,
        activeFiltersCount,
        queryParams,
        screenSize,
        isDrawerOpen,
        handleFiltersChange,
        clearFilter,
        clearAllFilters,
        openDrawer,
        closeDrawer
    ])

    return (
        <FilterContext.Provider value={contextValue}>
            {children}
        </FilterContext.Provider>
    )
}

export default FilterContext 