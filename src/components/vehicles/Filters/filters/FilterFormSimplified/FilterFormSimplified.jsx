/**
 * FilterFormSimplified - Formulario de filtros optimizado
 * 
 * Características:
 * - Contenedor fijo mobile con scroll detection
 * - Optimizado para touch devices
 * - Performance profesional
 * - Compatibilidad completa mobile/desktop
 * 
 * @author Indiana Usados
 * @version 4.2.0 - Mobile optimized
 */

import React, { useEffect, useState, useImperativeHandle } from 'react'
import { useSearchParams } from 'react-router-dom'
import { RangeSlider } from '@ui'
import { MultiSelect } from '@ui'
import { marcas, combustibles, cajas, FILTER_DEFAULTS } from '@constants'
import { useFilterForm } from '@hooks/useFilterForm'
import { useScrollUnified, useSorting } from '@hooks'
import { parseFilters, validateRange, formatPrice, formatYear } from '@utils'
import SortDropdown from '../../SortDropdown'
import styles from './FilterFormSimplified.module.css'

const FilterFormSimplified = React.memo(React.forwardRef(({ 
  onApplyFilters,
  isLoading = false,
  isError = false,
  error = null,
  onRetry = null,
  onSortClick = () => {}, // ✅ NUEVO: Handler para sorting
  selectedSort = null // ✅ NUEVO: Sort seleccionado
}, ref) => {
  // ✅ SIMPLIFICADO: Usar el hook unificado
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLocalError, setIsLocalError] = useState(false)
  const [localError, setLocalError] = useState(null)
  
  // ✅ NUEVO: Obtener filtros actuales de la URL
  const [searchParams] = useSearchParams()
  const currentFilters = parseFilters(searchParams)
  
  // Funciones simples para drawer
  const toggleDrawer = () => setIsDrawerOpen(prev => !prev)
  const closeDrawer = () => setIsDrawerOpen(false)

  // ✅ OPTIMIZADO: Usar el hook unificado de formulario
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    watch,
    errors,
    marca,
    combustible,
    caja,
    año,
    precio,
    kilometraje,
    activeFiltersCount,
    defaultValues,
    prepareSubmitData,
    handleClear,
    handleAñoChange,
    handlePrecioChange,
    handleKilometrajeChange,
    handleMarcaChange,
    handleCombustibleChange,
    handleCajaChange,
    formatPrice: formatPriceHook,
    formatKms,
    formatYear: formatYearHook
  } = useFilterForm(currentFilters)

  // ✅ OPTIMIZADO: Usar el hook unificado de sorting
  const sorting = useSorting({
    syncWithUrl: true,
    urlKey: 'sort',
    defaultSort: null
  })

  // ✅ FIX DEFINITIVO: Sincronización controlada solo cuando cambian los parámetros
  useEffect(() => {
    // Solo resetear cuando realmente cambien los filtros de la URL
    const urlFilters = parseFilters(searchParams)
    const hasUrlChanges = JSON.stringify(urlFilters) !== JSON.stringify(currentFilters)
    
    if (hasUrlChanges) {
      reset(urlFilters)
    }
  }, [searchParams.toString()]) // Solo dependencia de URL string

  // ✅ OPTIMIZADO: Hook unificado para scroll (solo detección)
  const scroll = useScrollUnified({
    enableDetection: true,  // Solo detección para mostrar/ocultar botones
    enablePosition: false,  // No necesitamos posición aquí
    enabled: true,
    hasActiveDropdown: sorting.isDropdownOpen,
    hasActiveDrawer: isDrawerOpen,
    hasActiveFilters: activeFiltersCount > 0
  })

  // ✅ SIMPLIFICADO: Usar handlers del hook
  const onSubmit = async (data) => {
    setIsSubmitting(true)
    setIsLocalError(false)
    setLocalError(null)
    
    try {
      const validData = prepareSubmitData(data)
      await onApplyFilters(validData)
      
      // ✅ FIX: Cerrar drawer DESPUÉS del await con delay mínimo
      setTimeout(() => closeDrawer(), 100)
    } catch (error) {
      setIsLocalError(true)
      setLocalError(error?.message || 'Error al aplicar filtros')
    } finally {
      setIsSubmitting(false)
    }
  }


  // Ranges como arrays únicos
  const añoRange = año
  const precioRange = precio
  const kilometrajeRange = kilometraje

  // ✅ NUEVO: Exponer toggleDrawer para uso externo
  useImperativeHandle(ref, () => ({
    toggleDrawer,
    closeDrawer,
    isDrawerOpen
  }), [toggleDrawer, closeDrawer, isDrawerOpen])

  return (
    <div className={`${styles.filterContainer} ${isDrawerOpen ? styles.open : ''}`}>
      {/* Contenedor fijo mobile */}
      <div className={`${styles.mobileActionsContainer} ${scroll.isVisible ? styles.visible : ''}`}>
        <button 
          className={`${styles.mobileActionButton} ${sorting.hasActiveSort ? styles.active : ''}`}
          onClick={(e) => {
            e.stopPropagation()
            sorting.toggleDropdown()
          }}
          disabled={isLoading || isSubmitting}
          style={{ position: 'relative' }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 6h18"></path>
            <path d="M6 12h12"></path>
            <path d="M9 18h6"></path>
          </svg>
          <span>Ordenar por</span>
          
          <SortDropdown
            isOpen={sorting.isDropdownOpen}
            selectedSort={sorting.selectedSort}
            onSortChange={sorting.handleSortChange}
            onClose={sorting.closeDropdown}
            disabled={isLoading || isSubmitting}
            preventAutoClose={true}
          />
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

      {/* Botón mobile (oculto en desktop) */}
      <button 
        className={styles.filterButtonMobile}
        onClick={toggleDrawer}
        disabled={isLoading || isSubmitting}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polygon points="22,3 2,3 10,12.46 10,19 14,21 14,12.46"></polygon>
        </svg>
        Filtrar
        {activeFiltersCount > 0 && (
          <span className={styles.badge}>{activeFiltersCount}</span>
        )}
      </button>

      {/* Error message - API errors */}
      {isError && error && (
        <div className={styles.errorMessage}>
          ⚠️ Error: {error.message || error}
          {onRetry && (
            <button 
              onClick={onRetry}
              className={styles.retryButton}
              disabled={isLoading}
            >
              Reintentar
            </button>
          )}
        </div>
      )}

      {/* Error message - Local errors */}
      {isLocalError && localError && (
        <div className={styles.errorMessage}>
          ⚠️ Error: {localError}
        </div>
      )}

      {/* Formulario */}
      {isDrawerOpen && (
        <div 
          className={styles.overlay} 
          onClick={closeDrawer}
          aria-label="Cerrar formulario"
        />
      )}
      <div className={styles.formWrapper}>
        <form onSubmit={handleSubmit(onSubmit)} className={styles.form} data-testid="filters-form">
          {/* Título del formulario con botón cerrar */}
          <div className={styles.formTitle}>
            <h3>Filtros de Búsqueda</h3>
            <div className={styles.titleActions}>
              <button 
                type="button"
                onClick={closeDrawer} 
                className={styles.closeButtonMobile}
                aria-label="Cerrar formulario"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
              <button 
                type="button" 
                onClick={handleClear}
                className={styles.clearButton}
                disabled={isLoading || isSubmitting}
                data-testid="clear-filters"
              >
                Limpiar
              </button>
              <button 
                type="submit" 
                className={styles.applyButton}
                disabled={isLoading || isSubmitting}
                data-testid="apply-filters"
              >
                {isSubmitting ? 'Aplicando...' : 'Aplicar'}
              </button>
            </div>
          </div>

          {/* SECCIÓN 1: RANGOS */}
          <div className={styles.rangesSection}>
            {/* Año */}
            <div className={styles.formGroup}>
              <RangeSlider
                label="Año"
                min={FILTER_DEFAULTS.AÑO.min}
                max={FILTER_DEFAULTS.AÑO.max}
                step={1}
                value={añoRange}
                onChange={handleAñoChange}
                formatValue={formatYearHook}
                aria-label="Rango de años"
                aria-describedby="año-description"
              />
            </div>

            {/* Precio */}
            <div className={styles.formGroup}>
              <RangeSlider
                label="Precio"
                min={FILTER_DEFAULTS.PRECIO.min}
                max={FILTER_DEFAULTS.PRECIO.max}
                step={1000000}
                value={precioRange}
                onChange={handlePrecioChange}
                formatValue={formatPriceHook}
                aria-label="Rango de precios"
                aria-describedby="precio-description"
              />
            </div>

            {/* Kms */}
            <div className={styles.formGroup}>
              <RangeSlider
                label="Kms"
                min={FILTER_DEFAULTS.KILOMETRAJE.min}
                max={FILTER_DEFAULTS.KILOMETRAJE.max}
                step={5000}
                value={kilometrajeRange}
                onChange={handleKilometrajeChange}
                formatValue={formatKms}
                aria-label="Rango de kilometraje"
                aria-describedby="kilometraje-description"
              />
            </div>
          </div>

          {/* SECCIÓN 2: SELECTS */}
          <div className={styles.selectsSection}>
            {/* Marca */}
            <div className={styles.formGroup}>
              <MultiSelect
                label="Marca"
                options={marcas}
                value={marca || []}
                onChange={handleMarcaChange}
                placeholder="Todas las marcas"
                aria-label="Seleccionar marcas"
                aria-describedby="marca-description"
              />
            </div>

            {/* Combustible */}
            <div className={styles.formGroup}>
              <MultiSelect
                label="Combustible"
                options={combustibles}
                value={combustible || []}
                onChange={handleCombustibleChange}
                placeholder="Todos los combustibles"
                aria-label="Seleccionar combustibles"
                aria-describedby="combustible-description"
              />
            </div>

            {/* Caja */}
            <div className={styles.formGroup}>
              <MultiSelect
                label="Caja"
                options={cajas}
                value={caja || []}
                onChange={handleCajaChange}
                placeholder="Todas las cajas"
                aria-label="Seleccionar cajas"
                aria-describedby="caja-description"
              />
            </div>
          </div>

          {/* Botones mobile (solo visibles en mobile) */}
          <div className={styles.mobileButtons}>
            <button 
              type="submit" 
              className={styles.applyButton}
              disabled={isLoading || isSubmitting}
              data-testid="apply-filters"
            >
              {isSubmitting ? 'Aplicando...' : 'Aplicar Filtros'}
            </button>
            
            <button 
              type="button" 
              onClick={handleClear}
              className={styles.clearButton}
              disabled={isLoading || isSubmitting}
              data-testid="clear-filters"
            >
              Limpiar Filtros
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}))

FilterFormSimplified.displayName = 'FilterFormSimplified'

export default FilterFormSimplified 