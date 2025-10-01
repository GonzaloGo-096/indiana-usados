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
import { parseFilters } from '@utils'
import styles from './FilterFormSimplified.module.css'

const FilterFormSimplified = React.memo(React.forwardRef(({ 
  onApplyFilters,
  isLoading = false 
}, ref) => {
  // ✅ SIMPLIFICADO: useState en lugar de useFilterReducer
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isError, setIsError] = useState(false)
  const [error, setError] = useState(null)
  
  // ✅ NUEVO: Obtener filtros actuales de la URL
  const [searchParams] = useSearchParams()
  const currentFilters = parseFilters(searchParams)
  
  // Funciones simples para drawer
  const toggleDrawer = () => setIsDrawerOpen(prev => !prev)
  const closeDrawer = () => setIsDrawerOpen(false)

  // Estados para contenedor fijo mobile
  const [isVisible, setIsVisible] = useState(false)

  // Detectar scroll optimizado para mobile
  useEffect(() => {
    let scrollTimeout
    let hideTimeout
    let lastScrollTop = 0

    const handleScroll = () => {
      const scrollTop = window.pageYOffset || 
                       document.documentElement.scrollTop || 
                       document.body.scrollTop || 0
      
      // Solo procesar cambios significativos
      if (Math.abs(scrollTop - lastScrollTop) < 10) return
      
      lastScrollTop = scrollTop
      const shouldShow = scrollTop > 50
      
      if (shouldShow) {
        setIsVisible(true)
        if (hideTimeout) {
          clearTimeout(hideTimeout)
          hideTimeout = null
        }
      } else {
        setIsVisible(false)
      }
    }

    const handleScrollEnd = () => {
      if (hideTimeout) {
        clearTimeout(hideTimeout)
      }
      hideTimeout = setTimeout(() => setIsVisible(false), 2000)
    }

    const handleScrollWithDelay = () => {
      handleScroll()
      if (scrollTimeout) {
        clearTimeout(scrollTimeout)
      }
      const delay = 'ontouchstart' in window ? 100 : 150
      scrollTimeout = setTimeout(handleScrollEnd, delay)
    }

    window.addEventListener('scroll', handleScrollWithDelay, { passive: true })
    
    return () => {
      window.removeEventListener('scroll', handleScrollWithDelay)
      if (scrollTimeout) clearTimeout(scrollTimeout)
      if (hideTimeout) clearTimeout(hideTimeout)
    }
  }, [])

  // ✅ NUEVO: Función para validar rangos (min siempre <= max)
  const validateRange = ([min, max]) => [Math.min(min, max), Math.max(min, max)]

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
      setIsError(true)
      setError(error?.message || 'Error al aplicar filtros')
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

  // Formateadores
  const formatPrice = (value) => `$${value.toLocaleString()}`
  const formatKms = (value) => `${value.toLocaleString()} km`
  const formatYear = (value) => value.toString()

  // Ranges como arrays únicos
  const añoRange = año
  const precioRange = precio
  const kilometrajeRange = kilometraje

  // Handlers simples para ranges únicos
  const handleAñoChange = ([min, max]) => {
    setValue('año', [min, max])
  }

  const handlePrecioChange = ([min, max]) => {
    setValue('precio', [min, max])
  }

  const handleKilometrajeChange = ([min, max]) => {
    setValue('kilometraje', [min, max])
  }

  const handleMarcaChange = (values) => {
    setValue('marca', values)
  }

  const handleCombustibleChange = (values) => {
    setValue('combustible', values)
  }

  const handleCajaChange = (values) => {
    setValue('caja', values)
  }

  // ✅ NUEVO: Exponer toggleDrawer para uso externo
  useImperativeHandle(ref, () => ({
    toggleDrawer,
    closeDrawer,
    isDrawerOpen
  }), [toggleDrawer, closeDrawer, isDrawerOpen])

  return (
    <div className={`${styles.filterContainer} ${isDrawerOpen ? styles.open : ''}`}>
      {/* Contenedor fijo mobile */}
      <div className={`${styles.mobileActionsContainer} ${isVisible ? styles.visible : ''}`}>
        <button 
          className={styles.mobileActionButton}
          onClick={() => {}} // TODO: Implementar ordenamiento
          disabled={isLoading || isSubmitting}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 6h18"></path>
            <path d="M6 12h12"></path>
            <path d="M9 18h6"></path>
          </svg>
          <span>Ordenar por</span>
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

      {/* Error message */}
      {isError && error && (
        <div className={styles.errorMessage}>
          Error: {error}
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