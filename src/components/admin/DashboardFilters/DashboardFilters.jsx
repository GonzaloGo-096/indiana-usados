/**
 * DashboardFilters - Filtros simples para el panel administrativo
 * 
 * Filtros automáticos: Marca y Rango de Años
 * Se actualizan automáticamente sin botón de aplicar
 * 
 * @author Indiana Usados
 * @version 1.0.0
 */

import React, { useState, useEffect, useCallback } from 'react'
import { marcas, FILTER_DEFAULTS } from '@constants'
import { RangeSlider } from '@ui'
import styles from './DashboardFilters.module.css'

/**
 * DashboardFilters - Componente de filtros
 * @param {Object} filters - Filtros actuales
 * @param {function} onFiltersChange - Callback cuando cambian los filtros
 */
const DashboardFilters = ({ filters = {}, onFiltersChange }) => {
    const [selectedMarca, setSelectedMarca] = useState(filters.marca?.[0] || '')
    const [yearRange, setYearRange] = useState({
        min: filters.año?.[0] || FILTER_DEFAULTS.AÑO.min,
        max: filters.año?.[1] || FILTER_DEFAULTS.AÑO.max
    })

    // ✅ ACTUALIZAR FILTROS AUTOMÁTICAMENTE CON DEBOUNCE
    useEffect(() => {
        const timer = setTimeout(() => {
            const newFilters = {}
            
            // Agregar marca si está seleccionada
            if (selectedMarca) {
                newFilters.marca = [selectedMarca]
            }
            
            // Agregar rango de años si no es el default
            if (yearRange.min !== FILTER_DEFAULTS.AÑO.min || yearRange.max !== FILTER_DEFAULTS.AÑO.max) {
                newFilters.año = [yearRange.min, yearRange.max]
            }
            
            onFiltersChange(newFilters)
        }, 300) // Debounce de 300ms

        return () => clearTimeout(timer)
    }, [selectedMarca, yearRange, onFiltersChange])

    // ✅ HANDLERS
    const handleMarcaChange = useCallback((e) => {
        setSelectedMarca(e.target.value)
    }, [])

    const handleYearRangeChange = useCallback((newRange) => {
        setYearRange({
            min: newRange[0],
            max: newRange[1]
        })
    }, [])

    const handleClearFilters = useCallback(() => {
        setSelectedMarca('')
        setYearRange({
            min: FILTER_DEFAULTS.AÑO.min,
            max: FILTER_DEFAULTS.AÑO.max
        })
    }, [])

    const hasActiveFilters = selectedMarca || 
        yearRange.min !== FILTER_DEFAULTS.AÑO.min || 
        yearRange.max !== FILTER_DEFAULTS.AÑO.max

    return (
        <div className={styles.filtersContainer}>
            <div className={styles.filtersHeader}>
                <h3 className={styles.filtersTitle}>Filtros</h3>
                {hasActiveFilters && (
                    <button 
                        onClick={handleClearFilters}
                        className={styles.clearButton}
                        aria-label="Limpiar filtros"
                    >
                        Limpiar
                    </button>
                )}
            </div>
            
            <div className={styles.filtersGrid}>
                {/* Select de Marca */}
                <div className={styles.filterGroup}>
                    <label htmlFor="marca-filter" className={styles.filterLabel}>
                        Marca
                    </label>
                    <select
                        id="marca-filter"
                        value={selectedMarca}
                        onChange={handleMarcaChange}
                        className={styles.filterSelect}
                    >
                        <option value="">Todas las marcas</option>
                        {marcas.map(marca => (
                            <option key={marca} value={marca}>
                                {marca}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Rango de Años */}
                <div className={styles.filterGroup}>
                    <label className={styles.filterLabel}>
                        Año
                    </label>
                    <div className={styles.yearSliderContainer}>
                        <RangeSlider
                            min={FILTER_DEFAULTS.AÑO.min}
                            max={FILTER_DEFAULTS.AÑO.max}
                            step={1}
                            value={[yearRange.min, yearRange.max]}
                            onChange={handleYearRangeChange}
                            formatValue={(val) => val}
                            className={styles.yearSlider}
                            aria-label="Rango de años"
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default DashboardFilters

