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
import { useForm } from 'react-hook-form'
import { useFilterReducer } from '@hooks'
import { RangeSlider } from '@ui'
import { MultiSelect } from '@ui'
import { marcas, combustibles, cajas } from '@constants'
import styles from './FilterFormSimplified.module.css'

const FilterFormSimplified = React.memo(React.forwardRef(({ 
  onApplyFilters,
  isLoading = false 
}, ref) => {
  const {
    isSubmitting,
    isDrawerOpen,
    isError,
    error,
    setSubmitting,
    toggleDrawer,
    closeDrawer
  } = useFilterReducer()

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

  // Configurar React Hook Form
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    watch,
    formState: { errors }
  } = useForm({
    defaultValues: {
      marca: [],
      caja: [],
      combustible: [],
      año: [1990, 2024],           // ✅ RANGO ÚNICO
      precio: [5000000, 100000000], // ✅ RANGO ÚNICO
      kilometraje: [0, 200000]      // ✅ RANGO ÚNICO
    }
  })

  // Watch específico por campo
  const marca = watch('marca')
  const combustible = watch('combustible')
  const caja = watch('caja')
  const año = watch('año') || [1990, 2024]
  const precio = watch('precio') || [5000000, 100000000]
  const kilometraje = watch('kilometraje') || [0, 200000]
  
  // Cálculo de filtros activos
  const activeFiltersCount = (() => {
    const hasMarca = marca?.length > 0
    const hasCombustible = combustible?.length > 0
    const hasCaja = caja?.length > 0
    const hasRanges = año[0] !== 1990 || año[1] !== 2024 || 
                     precio[0] !== 5000000 || precio[1] !== 100000000 || 
                     kilometraje[0] !== 0 || kilometraje[1] !== 200000
    
    return [hasMarca, hasCombustible, hasCaja, hasRanges].filter(Boolean).length
  })()

  // Handlers optimizados
  const onSubmit = async (data) => {
    setSubmitting(true)
    try {
      // ✅ RESTRUCTURADO: Ranges como arrays únicos
      const validData = {
        marca: data.marca || [],
        caja: data.caja || [],
        combustible: data.combustible || [],
        año: data.año || [1990, 2024],
        precio: data.precio || [5000000, 100000000],
        kilometraje: data.kilometraje || [0, 200000]
      }

      console.log('🔍 FilterFormSimplified - Datos transformados (onSubmit):', JSON.stringify(validData, null, 2));
      await onApplyFilters(validData)
      closeDrawer()
    } catch (error) {
      console.error('Error al aplicar filtros:', error)
    } finally {
      setSubmitting(false)
    }
  }

  const handleClear = () => {
    reset({
      marca: [],
      caja: [],
      combustible: [],
      año: [1990, 2024],
      precio: [5000000, 100000000],
      kilometraje: [0, 200000]
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
          onClick={() => console.log('Ordenar por')}
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
                min={1990}
                max={2024}
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
                min={5000000}
                max={100000000}
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
                min={0}
                max={200000}
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