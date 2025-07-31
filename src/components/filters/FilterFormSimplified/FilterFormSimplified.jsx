/**
 * FilterFormSimplified - Formulario de filtros ultra optimizado
 * 
 * Optimizaciones profesionales aplicadas:
 * - Eliminación de memoización innecesaria
 * - Cálculo simplificado de filtros activos
 * - Imports optimizados
 * - Performance al nivel de estándares industria
 * 
 * @author Indiana Usados
 * @version 3.0.0 - PROFESIONALMENTE OPTIMIZADO
 */

import React, { useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { useFilterReducer } from '../../../hooks/filters/useFilterReducer'
import RangeSlider from '../../ui/RangeSlider/RangeSlider'
import MultiSelect from '../../ui/MultiSelect/MultiSelect'
import { FILTER_OPTIONS } from '../../../constants'
import styles from './FilterFormSimplified.module.css'

const FilterFormSimplified = React.memo(({ 
  onApplyFilters,
  isLoading = false 
}) => {
  const {
    isSubmitting,
    isDrawerOpen,
    setSubmitting,
    toggleDrawer,
    closeDrawer
  } = useFilterReducer()

  // Configurar React Hook Form con valores por defecto
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

  // OPTIMIZACIÓN PROFESIONAL: Watch específico por campo
  const marca = watch('marca')
  const combustible = watch('combustible')
  const transmision = watch('transmision')
  const añoDesde = watch('añoDesde')
  const añoHasta = watch('añoHasta')
  const precioDesde = watch('precioDesde')
  const precioHasta = watch('precioHasta')
  const kilometrajeDesde = watch('kilometrajeDesde')
  const kilometrajeHasta = watch('kilometrajeHasta')
  
  // OPTIMIZACIÓN PROFESIONAL: Cálculo simplificado y eficiente
  const activeFiltersCount = useMemo(() => {
    const hasMarca = marca?.length > 0
    const hasCombustible = combustible?.length > 0
    const hasTransmision = transmision?.length > 0
    const hasRanges = añoDesde !== 1990 || precioDesde !== 5000000 || kilometrajeDesde !== 0
    
    return [hasMarca, hasCombustible, hasTransmision, hasRanges].filter(Boolean).length
  }, [marca?.length, combustible?.length, transmision?.length, añoDesde, precioDesde, kilometrajeDesde])

  // OPTIMIZACIÓN PROFESIONAL: Funciones simples sin memoización
  const onSubmit = async (data) => {
    setSubmitting(true)
    try {
      // Filtrar solo valores válidos
      const validData = Object.entries(data).reduce((acc, [key, value]) => {
        if (Array.isArray(value)) {
          if (value.length > 0) {
            acc[key] = value
          }
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

  // OPTIMIZACIÓN PROFESIONAL: Función simple
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

  // OPTIMIZACIÓN PROFESIONAL: Formateadores simples sin memoización
  const formatPrice = (value) => `$${value.toLocaleString()}`
  const formatKms = (value) => `${value.toLocaleString()} km`
  const formatYear = (value) => value.toString()

  // OPTIMIZACIÓN PROFESIONAL: Memoización solo para arrays
  const añoRange = useMemo(() => [
    añoDesde || 1990, 
    añoHasta || 2024
  ], [añoDesde, añoHasta])

  const precioRange = useMemo(() => [
    precioDesde || 5000000, 
    precioHasta || 100000000
  ], [precioDesde, precioHasta])

  const kilometrajeRange = useMemo(() => [
    kilometrajeDesde || 0, 
    kilometrajeHasta || 200000
  ], [kilometrajeDesde, kilometrajeHasta])

  // OPTIMIZACIÓN PROFESIONAL: Handlers simples sin memoización
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
      {/* Botón mobile (solo visible en mobile via CSS) */}
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

      {/* Formulario */}
      <div className={styles.formWrapper}>
        {/* Header mobile */}
        <div className={styles.formHeaderMobile}>
          <h2>Filtrar Vehículos</h2>
          <button onClick={closeDrawer} className={styles.closeButton}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
          {/* Título del formulario con botones */}
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
                options={FILTER_OPTIONS.marcas}
                value={marca || []}
                onChange={handleMarcaChange}
                placeholder="Todas las marcas"
              />
            </div>

            {/* Combustible */}
            <div className={styles.formGroup}>
              <MultiSelect
                label="Combustible"
                options={FILTER_OPTIONS.combustibles}
                value={combustible || []}
                onChange={handleCombustibleChange}
                placeholder="Todos los combustibles"
              />
            </div>

            {/* Caja */}
            <div className={styles.formGroup}>
              <MultiSelect
                label="Caja"
                options={FILTER_OPTIONS.transmisiones}
                value={transmision || []}
                onChange={handleTransmisionChange}
                placeholder="Todas las cajas"
              />
            </div>
          </div>


        </form>
      </div>
    </div>
  )
})

FilterFormSimplified.displayName = 'FilterFormSimplified'

export default FilterFormSimplified 