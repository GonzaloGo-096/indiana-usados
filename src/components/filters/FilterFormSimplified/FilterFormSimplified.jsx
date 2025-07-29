/**
 * FilterFormSimplified - Formulario de filtros ultra simplificado
 * 
 * Combina:
 * - useReducer para estado mínimo
 * - React Hook Form para validación
 * - CSS-only responsive
 * - RangeSlider para rangos
 * - MultiSelect para selección múltiple
 * - Payload directo sin estado intermedio
 * 
 * @author Indiana Usados
 * @version 2.5.0
 */

import React, { useCallback, useMemo } from 'react'
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

  // Observar valores del formulario para mostrar en el botón
  const watchedValues = watch()
  
  // Memoizar el conteo de filtros activos
  const activeFiltersCount = useMemo(() => {
    return Object.entries(watchedValues).filter(([key, value]) => {
      if (Array.isArray(value)) {
        return value.length > 0
      }
      return value && value !== '' && value !== 0 && value !== '0'
    }).length
  }, [watchedValues])

  // Manejar envío del formulario - MEMOIZADO
  const onSubmit = useCallback(async (data) => {
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
  }, [onApplyFilters, setSubmitting, closeDrawer])

  // Manejar limpieza - MEMOIZADO
  const handleClear = useCallback(() => {
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
  }, [reset])

  // Formateadores para rangos - MEMOIZADOS
  const formatPrice = useCallback((value) => `$${value.toLocaleString()}`, [])
  const formatKms = useCallback((value) => `${value.toLocaleString()} km`, [])
  const formatYear = useCallback((value) => value.toString(), [])

  // Memoizar valores de los rangos
  const añoRange = useMemo(() => [
    watchedValues.añoDesde || 1990, 
    watchedValues.añoHasta || 2024
  ], [watchedValues.añoDesde, watchedValues.añoHasta])

  const precioRange = useMemo(() => [
    watchedValues.precioDesde || 5000000, 
    watchedValues.precioHasta || 100000000
  ], [watchedValues.precioDesde, watchedValues.precioHasta])

  const kilometrajeRange = useMemo(() => [
    watchedValues.kilometrajeDesde || 0, 
    watchedValues.kilometrajeHasta || 200000
  ], [watchedValues.kilometrajeDesde, watchedValues.kilometrajeHasta])

  // Handlers para rangos - MEMOIZADOS
  const handleAñoChange = useCallback(([min, max]) => {
    setValue('añoDesde', min)
    setValue('añoHasta', max)
  }, [setValue])

  const handlePrecioChange = useCallback(([min, max]) => {
    setValue('precioDesde', min)
    setValue('precioHasta', max)
  }, [setValue])

  const handleKilometrajeChange = useCallback(([min, max]) => {
    setValue('kilometrajeDesde', min)
    setValue('kilometrajeHasta', max)
  }, [setValue])

  // Handlers para MultiSelect - MEMOIZADOS
  const handleMarcaChange = useCallback((values) => {
    setValue('marca', values)
  }, [setValue])

  const handleCombustibleChange = useCallback((values) => {
    setValue('combustible', values)
  }, [setValue])

  const handleTransmisionChange = useCallback((values) => {
    setValue('transmision', values)
  }, [setValue])

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

            {/* Kilometraje */}
            <div className={styles.formGroup}>
              <RangeSlider
                label="Kilometraje"
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
                value={watchedValues.marca || []}
                onChange={handleMarcaChange}
                placeholder="Todas las marcas"
              />
            </div>

            {/* Combustible */}
            <div className={styles.formGroup}>
              <MultiSelect
                label="Combustible"
                options={FILTER_OPTIONS.combustibles}
                value={watchedValues.combustible || []}
                onChange={handleCombustibleChange}
                placeholder="Todos los combustibles"
              />
            </div>

            {/* Transmisión */}
            <div className={styles.formGroup}>
              <MultiSelect
                label="Transmisión"
                options={FILTER_OPTIONS.transmisiones}
                value={watchedValues.transmision || []}
                onChange={handleTransmisionChange}
                placeholder="Todas las transmisiones"
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