/**
 * FilterContext - Contexto simplificado para manejo de filtros
 * 
 * Responsabilidades:
 * - Estado de filtros
 * - Acciones básicas de filtros
 * - Integración con hook externo
 * 
 * @author Indiana Usados
 * @version 2.0.0
 */

import React, { createContext, useContext, useState, useCallback, useMemo } from 'react'
import { useFilters } from '../hooks/useFilters'

// Crear el contexto con valores por defecto
const FilterContext = createContext({
    // Estado de filtros
    currentFilters: {},
    isSubmitting: false,
    activeFiltersCount: 0,
    queryParams: {},
    
    // Acciones de filtros
    handleFiltersChange: () => {},
    clearFilter: () => {},
    clearAllFilters: () => {},
})

// Hook personalizado para usar el contexto
export const useFilterContext = () => {
    const context = useContext(FilterContext)
    if (!context) {
        throw new Error('useFilterContext debe usarse dentro de FilterProvider')
    }
    return context
}

// Provider del contexto
export const FilterProvider = ({ children }) => {
    // ===== ESTADO DE FILTROS =====
    const [currentFilters, setCurrentFilters] = useState({})

    // ===== HOOKS EXTERNOS =====
    const {
        isSubmitting,
        handleFiltersChange: handleFiltersChangeFromHook,
        getQueryParams,
        getActiveFiltersCount
    } = useFilters()

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
        
        // Acciones de filtros
        handleFiltersChange,
        clearFilter,
        clearAllFilters,
    }), [
        currentFilters,
        isSubmitting,
        activeFiltersCount,
        queryParams,
        handleFiltersChange,
        clearFilter,
        clearAllFilters,
    ])

    return (
        <FilterContext.Provider value={contextValue}>
            {children}
        </FilterContext.Provider>
    )
}

export default FilterContext 