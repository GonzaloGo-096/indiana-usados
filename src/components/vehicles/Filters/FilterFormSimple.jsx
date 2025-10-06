/**
 * FilterFormSimple - Formulario de filtros ultra simplificado
 * 
 * Principios:
 * - Sin over-engineering
 * - Lógica directa y clara
 * - Misma funcionalidad, menos código
 * - Performance optimizada
 * 
 * @author Indiana Usados
 * @version 1.0.0 - Ultra simplificado
 */

import React, { useState, useEffect, useCallback, useRef } from 'react'
import { useSearchParams } from 'react-router-dom'
import { RangeSlider } from '@ui'
import { MultiSelect } from '@ui'
import { marcas, combustibles, cajas, FILTER_DEFAULTS, SORT_OPTIONS } from '@constants'
import { parseFilters, buildFiltersForBackend } from '@utils'
import styles from './FilterFormSimple.module.css'

const FilterFormSimple = React.memo(React.forwardRef(({
  onApplyFilters,
  isLoading = false,
  isError = false,
  error = null,
  onRetry = null,
}, ref) => {
  // ✅ ESTADOS SIMPLES
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showMobileActions, setShowMobileActions] = useState(false)
  const [isSortDropdownOpen, setIsSortDropdownOpen] = useState(false)
  const [selectedSort, setSelectedSort] = useState(null)
  const timeoutRef = useRef(null)

  // ✅ FILTROS - ESTADO SIMPLE
  const [filters, setFilters] = useState({
    marca: [],
    caja: [],
    combustible: [],
    año: [FILTER_DEFAULTS.AÑO.min, FILTER_DEFAULTS.AÑO.max],
    precio: [FILTER_DEFAULTS.PRECIO.min, FILTER_DEFAULTS.PRECIO.max],
    kilometraje: [FILTER_DEFAULTS.KILOMETRAJE.min, FILTER_DEFAULTS.KILOMETRAJE.max]
  })

  const [searchParams, setSearchParams] = useSearchParams()

  // ✅ SINCRONIZACIÓN CON URL
  useEffect(() => {
    const urlFilters = parseFilters(searchParams)
    setFilters(prevFilters => ({
      marca: urlFilters.marca || [],
      caja: urlFilters.caja || [],
      combustible: urlFilters.combustible || [],
      año: urlFilters.año || [FILTER_DEFAULTS.AÑO.min, FILTER_DEFAULTS.AÑO.max],
      precio: urlFilters.precio || [FILTER_DEFAULTS.PRECIO.min, FILTER_DEFAULTS.PRECIO.max],
      kilometraje: urlFilters.kilometraje || [FILTER_DEFAULTS.KILOMETRAJE.min, FILTER_DEFAULTS.KILOMETRAJE.max]
    }))
    setSelectedSort(searchParams.get('sort'))
  }, [searchParams])

  // ✅ DETECCIÓN DE SCROLL PARA BOTONES MÓVILES
  useEffect(() => {
    const handleScroll = () => {
      setShowMobileActions(window.scrollY > 100)
    }
    // Inicializar estado
    handleScroll()
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // ✅ HANDLERS SIMPLES
  const toggleDrawer = useCallback(() => setIsDrawerOpen(prev => !prev), [])
  const closeDrawer = useCallback(() => setIsDrawerOpen(false), [])
  const toggleSortDropdown = useCallback(() => setIsSortDropdownOpen(prev => !prev), [])

  // ✅ HANDLERS DE FILTROS
  const handleFilterChange = useCallback((key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }, [])

  const handleClear = useCallback(() => {
    setFilters({
      marca: [],
      caja: [],
      combustible: [],
      año: [FILTER_DEFAULTS.AÑO.min, FILTER_DEFAULTS.AÑO.max],
      precio: [FILTER_DEFAULTS.PRECIO.min, FILTER_DEFAULTS.PRECIO.max],
      kilometraje: [FILTER_DEFAULTS.KILOMETRAJE.min, FILTER_DEFAULTS.KILOMETRAJE.max]
    })
    setSelectedSort(null)
    setSearchParams({})
  }, [setSearchParams])

  const handleSortChange = useCallback((sortOption) => {
    setSelectedSort(sortOption)
    setIsSortDropdownOpen(false)
    const newParams = new URLSearchParams(searchParams)
    if (sortOption) {
      newParams.set('sort', sortOption)
    } else {
      newParams.delete('sort')
    }
    setSearchParams(newParams)
  }, [searchParams, setSearchParams])

  // ✅ SUBMIT
  const onSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      await onApplyFilters(filters)
      
      // Cerrar drawer con cleanup
      timeoutRef.current = setTimeout(() => {
        closeDrawer()
        timeoutRef.current = null
      }, 100)
    } catch (error) {
      console.error('Error applying filters:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  // ✅ CLEANUP
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
        timeoutRef.current = null
      }
    }
  }, [])

  // ✅ REF INTERFACE
  React.useImperativeHandle(ref, () => ({
    toggleDrawer,
    closeDrawer,
    isDrawerOpen
  }), [toggleDrawer, closeDrawer, isDrawerOpen])

  // ✅ CONTEO DE FILTROS ACTIVOS
  const activeFiltersCount = [
    filters.marca?.length > 0,
    filters.caja?.length > 0,
    filters.combustible?.length > 0,
    filters.año[0] !== FILTER_DEFAULTS.AÑO.min || filters.año[1] !== FILTER_DEFAULTS.AÑO.max,
    filters.precio[0] !== FILTER_DEFAULTS.PRECIO.min || filters.precio[1] !== FILTER_DEFAULTS.PRECIO.max,
    filters.kilometraje[0] !== FILTER_DEFAULTS.KILOMETRAJE.min || filters.kilometraje[1] !== FILTER_DEFAULTS.KILOMETRAJE.max
  ].filter(Boolean).length

  return (
    <div className={`${styles.filterContainer} ${isDrawerOpen ? styles.open : ''}`}>
      {/* Mobile Actions */}
      <div className={`${styles.mobileActionsContainer} ${showMobileActions ? styles.visible : ''}`}>
          <button
            className={`${styles.mobileActionButton} ${selectedSort ? styles.active : ''}`}
            onClick={toggleSortDropdown}
            disabled={isLoading || isSubmitting}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 6h18"></path><path d="M6 12h12"></path><path d="M9 18h6"></path>
            </svg>
            <span>Ordenar por</span>
            {isSortDropdownOpen && (
              <div className={styles.sortDropdown}>
                <button
                  onClick={() => handleSortChange(null)}
                  className={!selectedSort ? styles.active : ''}
                >
                  Sin ordenamiento
                </button>
                {SORT_OPTIONS.map(option => (
                  <button
                    key={option.value}
                    onClick={() => handleSortChange(option.value)}
                    className={selectedSort === option.value ? styles.active : ''}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            )}
          </button>
          <button
            className={styles.mobileActionButton}
            onClick={toggleDrawer}
            disabled={isLoading || isSubmitting}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polygon points="22,3 2,3 10,12.46 10,19 14,21 14,12.46"></polygon>
            </svg>
            <span>Filtrar</span>
            {activeFiltersCount > 0 && (
              <span className={styles.badge}>{activeFiltersCount}</span>
            )}
          </button>
        </div>

      {/* Error Messages */}
      {isError && error && (
        <div className={styles.errorMessage}>
          ⚠️ Error: {error.message || error}
          {onRetry && (
            <button onClick={onRetry} className={styles.retryButton} disabled={isLoading}>
              Reintentar
            </button>
          )}
        </div>
      )}

      {/* Filter Form */}
      {isDrawerOpen && (
        <div className={styles.overlay} onClick={closeDrawer} />
      )}
      
      <div className={styles.formWrapper}>
        <form onSubmit={onSubmit} className={styles.form}>
          <div className={styles.formTitle}>
            <h3>Filtros de Búsqueda</h3>
            <div className={styles.titleActions}>
              <button type="button" onClick={closeDrawer} className={styles.closeButtonMobile}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
              <button type="button" onClick={handleClear} className={styles.clearButton} disabled={isLoading || isSubmitting}>
                Limpiar
              </button>
              <button type="submit" className={styles.applyButton} disabled={isLoading || isSubmitting}>
                {isSubmitting ? 'Aplicando...' : 'Aplicar'}
              </button>
            </div>
          </div>

          {/* Range Sliders */}
          <div className={styles.rangesSection}>
            <div className={styles.formGroup}>
              <RangeSlider
                label="Año"
                min={FILTER_DEFAULTS.AÑO.min}
                max={FILTER_DEFAULTS.AÑO.max}
                step={1}
                value={filters.año}
                onChange={(val) => handleFilterChange('año', val)}
                formatValue={(val) => val.toString()}
              />
            </div>
            <div className={styles.formGroup}>
              <RangeSlider
                label="Precio"
                min={FILTER_DEFAULTS.PRECIO.min}
                max={FILTER_DEFAULTS.PRECIO.max}
                step={1000000}
                value={filters.precio}
                onChange={(val) => handleFilterChange('precio', val)}
                formatValue={(val) => `$${val.toLocaleString()}`}
              />
            </div>
            <div className={styles.formGroup}>
              <RangeSlider
                label="Kms"
                min={FILTER_DEFAULTS.KILOMETRAJE.min}
                max={FILTER_DEFAULTS.KILOMETRAJE.max}
                step={5000}
                value={filters.kilometraje}
                onChange={(val) => handleFilterChange('kilometraje', val)}
                formatValue={(val) => `${val.toLocaleString()} km`}
              />
            </div>
          </div>

          {/* MultiSelects */}
          <div className={styles.selectsSection}>
            <div className={styles.formGroup}>
              <MultiSelect
                label="Marca"
                options={marcas}
                value={filters.marca}
                onChange={(val) => handleFilterChange('marca', val)}
                placeholder="Todas las marcas"
              />
            </div>
            <div className={styles.formGroup}>
              <MultiSelect
                label="Combustible"
                options={combustibles}
                value={filters.combustible}
                onChange={(val) => handleFilterChange('combustible', val)}
                placeholder="Todos los combustibles"
              />
            </div>
            <div className={styles.formGroup}>
              <MultiSelect
                label="Caja"
                options={cajas}
                value={filters.caja}
                onChange={(val) => handleFilterChange('caja', val)}
                placeholder="Todas las cajas"
              />
            </div>
          </div>

          {/* Mobile Buttons */}
          <div className={styles.mobileButtons}>
            <button type="submit" className={styles.applyButton} disabled={isLoading || isSubmitting}>
              {isSubmitting ? 'Aplicando...' : 'Aplicar Filtros'}
            </button>
            <button type="button" onClick={handleClear} className={styles.clearButton} disabled={isLoading || isSubmitting}>
              Limpiar Filtros
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}))

FilterFormSimple.displayName = 'FilterFormSimple'
export default FilterFormSimple
