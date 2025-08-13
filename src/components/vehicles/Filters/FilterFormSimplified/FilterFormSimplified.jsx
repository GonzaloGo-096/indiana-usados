/**
 * FilterFormSimplified - Formulario de filtros simplificado
 * 
 * Componente optimizado para filtros de vehículos
 * 
 * @author Indiana Usados
 * @version 2.0.0
 */

import React from 'react'

const FilterFormSimplified = ({ 
    onApplyFilters, 
    onClearFilters, 
    isLoading, 
    currentFilters, 
    hasActiveFilters 
}) => {
    const handleApplyFilters = () => {
        // Lógica básica de filtros
        onApplyFilters(currentFilters)
    }

    const handleClearFilters = () => {
        onClearFilters()
    }

    return (
        <div className="filter-form-simplified">
            <h3>Filtros</h3>
            <div className="filter-controls">
                <button 
                    onClick={handleApplyFilters}
                    disabled={isLoading}
                    className="apply-filters-btn"
                >
                    {isLoading ? 'Aplicando...' : 'Aplicar Filtros'}
                </button>
                
                {hasActiveFilters && (
                    <button 
                        onClick={handleClearFilters}
                        disabled={isLoading}
                        className="clear-filters-btn"
                    >
                        Limpiar Filtros
                    </button>
                )}
            </div>
            
            <div className="filter-status">
                {hasActiveFilters && (
                    <span className="active-filters-indicator">
                        Filtros activos
                    </span>
                )}
            </div>
        </div>
    )
}

export default FilterFormSimplified 