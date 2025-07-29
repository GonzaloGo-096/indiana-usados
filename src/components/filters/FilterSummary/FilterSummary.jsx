/**
 * FilterSummary - Componente para mostrar resumen de filtros activos
 * 
 * Muestra los filtros que están actualmente configurados (pendientes)
 * Permite limpiar filtros individuales o todos
 * 
 * @author Indiana Usados
 * @version 2.0.0
 */

import React from 'react'
import { getFilterLabel, formatFilterValue, isValidFilterValue } from '../../../utils/filterUtils'
import styles from './FilterSummary.module.css'

const FilterSummary = ({ 
    pendingFilters, // Cambiado de activeFilters a pendingFilters
    onClearFilter, 
    isSubmitting = false 
}) => {

    // Filtrar solo los filtros que tienen valor válido
    const filtersWithValues = Object.entries(pendingFilters || {}).filter(([, value]) => {
        return isValidFilterValue(value)
    })

    // Si no hay filtros activos, no mostrar nada
    if (filtersWithValues.length === 0) {
        return null
    }

    return (
        <div className={styles.summary}>
            <div className={styles.filtersList}>
                {filtersWithValues.map(([key, value]) => (
                    <div key={key} className={styles.filterTag}>
                        <span className={styles.filterLabel}>
                            {getFilterLabel(key)}: {formatFilterValue(value)}
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