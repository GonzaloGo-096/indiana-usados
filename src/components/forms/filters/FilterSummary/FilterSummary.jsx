/**
 * FilterSummary - Componente para mostrar resumen de filtros activos
 * 
 * Muestra los filtros que están actualmente aplicados
 * Permite limpiar filtros individuales o todos
 * 
 * @author Indiana Usados
 * @version 1.0.0
 */

import React from 'react'
import { getFilterLabel } from '../../../../constants'
import styles from './FilterSummary.module.css'

const FilterSummary = ({ 
    activeFilters, 
    onClearFilter, 
    onClearAll,
    isSubmitting = false 
}) => {
    // Filtrar solo los filtros que tienen valor
    const filtersWithValues = Object.entries(activeFilters || {}).filter(([key, value]) => value !== '')

    // Si no hay filtros activos, no mostrar nada
    if (filtersWithValues.length === 0) {
        return null
    }

    return (
        <div className={styles.summary}>
            <div className={styles.summaryHeader}>
                <h4 className={styles.summaryTitle}>
                    Filtros seleccionados ({filtersWithValues.length})
                </h4>
                <button 
                    onClick={onClearAll}
                    className={styles.clearAllButton}
                    disabled={isSubmitting}
                >
                    Limpiar todos
                </button>
            </div>
            
            <div className={styles.filtersList}>
                {filtersWithValues.map(([key, value]) => (
                    <div key={key} className={styles.filterTag}>
                        <span className={styles.filterLabel}>
                            {getFilterLabel(key)}: {value}
                        </span>
                        <button 
                            onClick={() => onClearFilter(key)}
                            className={styles.removeFilter}
                            disabled={isSubmitting}
                            aria-label={`Remover filtro ${getFilterLabel(key)}`}
                        >
                            <svg 
                                width="12" 
                                height="12" 
                                viewBox="0 0 24 24" 
                                fill="none" 
                                stroke="currentColor" 
                                strokeWidth="2"
                            >
                                <line x1="18" y1="6" x2="6" y2="18"></line>
                                <line x1="6" y1="6" x2="18" y2="18"></line>
                            </svg>
                        </button>
                    </div>
                ))}
            </div>
        </div>
    )
}



export default FilterSummary 