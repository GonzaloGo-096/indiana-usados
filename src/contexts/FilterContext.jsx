/**
 * FilterContext - Contexto optimizado usando hook personalizado
 * 
 * Responsabilidades:
 * - Proporcionar datos del sistema de filtros
 * - Mantener compatibilidad con componentes existentes
 * - Optimización de performance con memoización
 * 
 * @author Indiana Usados
 * @version 9.0.0
 */

import React, { createContext, useContext, useMemo } from 'react'
import { useFilterSystem } from '../hooks/useFilterSystem'

// Crear el contexto
const FilterContext = createContext()

// Hook personalizado para usar el contexto
export const useFilterContext = () => {
    const context = useContext(FilterContext)
    if (!context) {
        throw new Error('useFilterContext debe usarse dentro de FilterProvider')
    }
    return context
}

// Provider del contexto optimizado
export const FilterProvider = ({ children }) => {
    // Usar el hook personalizado
    const filterSystem = useFilterSystem()
    
    // Memoizar el valor del contexto para evitar re-renders innecesarios
    const contextValue = useMemo(() => filterSystem, [filterSystem])

    return (
        <FilterContext.Provider value={contextValue}>
            {children}
        </FilterContext.Provider>
    )
}

// Exportar el contexto para uso directo si es necesario
export { FilterContext } 