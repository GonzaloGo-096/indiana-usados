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

import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useFilterReducer } from '@hooks/filters/useFilterReducer'
import RangeSlider from '@ui/RangeSlider/RangeSlider'
import MultiSelect from '@ui/MultiSelect/MultiSelect'
import { marcas, combustibles, transmisiones } from '@constants'
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
      añoDesde: 1990,
      añoHasta: 2024,
      precioDesde: 5000000,
      precioHasta: 100000000,
      kilometrajeDesde: 0,
      kilometrajeHasta: 200000,
      combustible: [],
      transmision: []
    }
  })

  // Watch específico por campo
  const marca = watch('marca')
  const combustible = watch('combustible')
  const transmision = watch('transmision')
  const añoDesde = watch('añoDesde')
  const precioDesde = watch('precioDesde')
  const kilometrajeDesde = watch('kilometrajeDesde')
  
  // Cálculo de filtros activos
  const activeFiltersCount = (() => {
    const hasMarca = marca?.length > 0
    const hasCombustible = combustible?.length > 0
    const hasTransmision = transmision?.length > 0
    const hasRanges = añoDesde !== 1990 || precioDesde !== 5000000 || kilometrajeDesde !== 0
    
    return [hasMarca, hasCombustible, hasTransmision, hasRanges].filter(Boolean).length
  })()

  // Handlers optimizados
  const onSubmit = async (data) => {
    setSubmitting(true)
    try {
      const validData = Object.entries(data).reduce((acc, [key, value]) => {
        if (Array.isArray(value) && value.length > 0) {
          acc[key] = value
        } else if (value && value !== '' && value !== 0 && value !== '0') {
          acc[key] = value
        }
        return acc
      }, {})

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
      añoDesde: 1990,
      añoHasta: 2024,
      precioDesde: 5000000,
      precioHasta: 100000000,
      kilometrajeDesde: 0,
      kilometrajeHasta: 200000,
      combustible: [],
      transmision: []
    })
  }

  // Formateadores
  const formatPrice = (value) => `$${value.toLocaleString()}`
  const formatKms = (value) => `${value.toLocaleString()} km`
  const formatYear = (value) => value.toString()

  // Arrays simples sin memoización innecesaria
  const añoHasta = watch('añoHasta')
  const precioHasta = watch('precioHasta')
  const kilometrajeHasta = watch('kilometrajeHasta')
  
  const añoRange = [añoDesde || 1990, añoHasta || 2024]
  const precioRange = [precioDesde || 5000000, precioHasta || 100000000]
  const kilometrajeRange = [kilometrajeDesde || 0, kilometrajeHasta || 200000]

  // Handlers simples
  const handleAñoChange = ([min, max]) => {
    setValue('añoDesde', min)
    setValue('añoHasta', max)
  }

  const handlePrecioChange = ([min, max]) => {
    setValue('precioDesde', min)
    setValue('precioHasta', max)
  }

  const handleKilometrajeChange = ([min, max]) => {
    setValue('kilometrajeDesde', min)
    setValue('kilometrajeHasta', max)
  }

  const handleMarcaChange = (values) => {
    setValue('marca', values)
  }

  const handleCombustibleChange = (values) => {
    setValue('combustible', values)
  }

  const handleTransmisionChange = (values) => {
    setValue('transmision', values)
  }

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
        {/* Header mobile */}
        <div className={styles.formHeaderMobile}>
          <h2>Filtrar Vehículos</h2>
          <button 
            type="button"
            onClick={closeDrawer} 
            className={styles.closeButton}
            aria-label="Cerrar formulario"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
          {/* Título del formulario */}
          <div className={styles.formTitle}>
            <h3>Filtros de Búsqueda</h3>
            <div className={styles.titleActions}>
              <button 
                type="submit" 
                className={styles.applyButton}
                disabled={isLoading || isSubmitting}
              >
                {isSubmitting ? 'Aplicando...' : 'Aplicar'}
              </button>
              
              <button 
                type="button" 
                onClick={handleClear}
                className={styles.clearButton}
                disabled={isLoading || isSubmitting}
              >
                Limpiar
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
                options={transmisiones}
                value={transmision || []}
                onChange={handleTransmisionChange}
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
            >
              {isSubmitting ? 'Aplicando...' : 'Aplicar Filtros'}
            </button>
            
            <button 
              type="button" 
              onClick={handleClear}
              className={styles.clearButton}
              disabled={isLoading || isSubmitting}
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