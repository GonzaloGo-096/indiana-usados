/**
 * FilterButton - Botón flotante para abrir filtros en dispositivos móviles
 * 
 * Se muestra solo en pantallas pequeñas y abre el drawer de filtros
 * Incluye indicador de filtros activos
 * 
 * @author Indiana Usados
 * @version 1.0.0
 */

import React from 'react'
import styles from './FilterButton.module.css'

const FilterButton = ({ 
    onClick, 
    activeFiltersCount = 0,
    isSubmitting = false 
}) => {
    return (
        <button 
            onClick={onClick}
            className={styles.filterButton}
            disabled={isSubmitting}
            aria-label="Abrir filtros de vehículos"
        >
            {/* Icono de filtro */}
            <svg 
                width="20" 
                height="20" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2"
                className={styles.filterIcon}
            >
                <polygon points="22,3 2,3 10,12.46 10,19 14,21 14,12.46"></polygon>
            </svg>
            
            <span className={styles.buttonText}>Filtrar</span>
            
            {/* Indicador de filtros activos */}
            {activeFiltersCount > 0 && (
                <span className={styles.badge}>
                    {activeFiltersCount}
                </span>
            )}
        </button>
    )
}

export default FilterButton 