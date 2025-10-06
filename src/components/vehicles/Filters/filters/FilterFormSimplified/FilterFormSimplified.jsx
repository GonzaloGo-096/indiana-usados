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

import React, { useEffect, useState, useImperativeHandle, useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { useSearchParams } from 'react-router-dom'
import { RangeSlider } from '@ui'
import { MultiSelect } from '@ui'
import { marcas, combustibles, cajas, FILTER_DEFAULTS } from '@constants'
import { useScrollUnified, useRangeHandlers, useSelectHandlers, useSorting } from '@hooks'
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
  // ✅ SIMPLIFICADO: useState en lugar de useFilterReducer
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLocalError, setIsLocalError] = useState(false)
  const [localError, setLocalError] = useState(null)
  // ✅ OPTIMIZADO: Usar el hook unificado de sorting
  const sorting = useSorting({
    syncWithUrl: true,
    urlKey: 'sort',
    defaultSort: null
  })
  
  // ✅ NUEVO: Obtener filtros actuales de la URL
  const [searchParams] = useSearchParams()
  const currentFilters = parseFilters(searchParams)
  
  // Funciones simples para drawer
  const toggleDrawer = () => setIsDrawerOpen(prev => !prev)
  const closeDrawer = () => setIsDrawerOpen(false)

  // ✅ NUEVO: Valores por defecto que se sincronizan con la URL
  const getDefaultValues = () => ({
    marca: currentFilters.marca || [],
    caja: currentFilters.caja || [],
    combustible: currentFilters.combustible || [],
    año: currentFilters.año || [FILTER_DEFAULTS.AÑO.min, FILTER_DEFAULTS.AÑO.max],
    precio: currentFilters.precio || [FILTER_DEFAULTS.PRECIO.min, FILTER_DEFAULTS.PRECIO.max],
    kilometraje: currentFilters.kilometraje || [FILTER_DEFAULTS.KILOMETRAJE.min, FILTER_DEFAULTS.KILOMETRAJE.max]
  })

  // Configurar React Hook Form
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    watch,
    formState: { errors }
  } = useForm({
    defaultValues: getDefaultValues()
  })

  // ✅ NUEVO: Sincronizar formulario con cambios en la URL
  useEffect(() => {
    const newValues = getDefaultValues()
    reset(newValues)
  }, [searchParams, reset])

  // Watch específico por campo
  const marca = watch('marca')
  const combustible = watch('combustible')
  const caja = watch('caja')
  const año = watch('año') || [FILTER_DEFAULTS.AÑO.min, FILTER_DEFAULTS.AÑO.max]
  const precio = watch('precio') || [FILTER_DEFAULTS.PRECIO.min, FILTER_DEFAULTS.PRECIO.max]
  const kilometraje = watch('kilometraje') || [FILTER_DEFAULTS.KILOMETRAJE.min, FILTER_DEFAULTS.KILOMETRAJE.max]
  
  // Cálculo de filtros activos
  const activeFiltersCount = (() => {
    const hasMarca = marca?.length > 0
    const hasCombustible = combustible?.length > 0
    const hasCaja = caja?.length > 0
    const hasRanges = año[0] !== FILTER_DEFAULTS.AÑO.min || año[1] !== FILTER_DEFAULTS.AÑO.max || 
                     precio[0] !== FILTER_DEFAULTS.PRECIO.min || precio[1] !== FILTER_DEFAULTS.PRECIO.max || 
                     kilometraje[0] !== FILTER_DEFAULTS.KILOMETRAJE.min || kilometraje[1] !== FILTER_DEFAULTS.KILOMETRAJE.max
    
    return [hasMarca, hasCombustible, hasCaja, hasRanges].filter(Boolean).length
  })()

  // ✅ OPTIMIZADO: Hook unificado para scroll (solo detección)
  const scroll = useScrollUnified({
    enableDetection: true,  // Solo detección para mostrar/ocultar botones
    enablePosition: false,  // No necesitamos posición aquí
    enabled: true,
    hasActiveDropdown: sorting.isDropdownOpen,
    hasActiveDrawer: isDrawerOpen,
    hasActiveFilters: activeFiltersCount > 0
  })

  // Handlers optimizados
  const onSubmit = async (data) => {
    setIsSubmitting(true)
    try {
      // ✅ RESTRUCTURADO: Ranges como arrays únicos con validación
      const validData = {
        marca: data.marca || [],
        caja: data.caja || [],
        combustible: data.combustible || [],
        año: validateRange(data.año || [FILTER_DEFAULTS.AÑO.min, FILTER_DEFAULTS.AÑO.max]),
        precio: validateRange(data.precio || [FILTER_DEFAULTS.PRECIO.min, FILTER_DEFAULTS.PRECIO.max]),
        kilometraje: validateRange(data.kilometraje || [FILTER_DEFAULTS.KILOMETRAJE.min, FILTER_DEFAULTS.KILOMETRAJE.max])
      }

      await onApplyFilters(validData)
      
      // ✅ FIX: Cerrar drawer DESPUÉS del await con delay mínimo
      // Permite que React complete el render antes de cerrar
      setTimeout(() => closeDrawer(), 100)
    } catch (error) {
      setIsLocalError(true)
      setLocalError(error?.message || 'Error al aplicar filtros')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClear = () => {
    reset({
      marca: [],
      caja: [],
      combustible: [],
      año: [FILTER_DEFAULTS.AÑO.min, FILTER_DEFAULTS.AÑO.max],
      precio: [FILTER_DEFAULTS.PRECIO.min, FILTER_DEFAULTS.PRECIO.max],
      kilometraje: [FILTER_DEFAULTS.KILOMETRAJE.min, FILTER_DEFAULTS.KILOMETRAJE.max]
    })
  }


  // Ranges como arrays únicos
  const añoRange = año
  const precioRange = precio
  const kilometrajeRange = kilometraje

  // Handlers para ranges (modularizados)
  const { handleAñoChange, handlePrecioChange, handleKilometrajeChange } = useRangeHandlers(setValue)

  // Handlers para selects (modularizados)
  const { handleMarcaChange, handleCombustibleChange, handleCajaChange } = useSelectHandlers(setValue)

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
                formatValue={formatYear}
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
                formatValue={formatPrice}
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
                formatValue={(value) => value.toLocaleString()}
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