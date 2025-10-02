/**
 * FilterForm - Componente para formulario de filtros
 * 
 * Maneja la lógica del formulario sin layout específico.
 * Reutilizable en diferentes contextos.
 * 
 * @author Indiana Usados
 * @version 1.0.0 - Modular
 */

import React, { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { RangeSlider } from '@ui'
import { MultiSelect } from '@ui'
import { marcas, combustibles, cajas, FILTER_DEFAULTS } from '@constants'
import { parseFilters } from '@utils'
import { useFilterForm } from '@hooks/useFilterForm'
import styles from './FilterForm.module.css'

const FilterForm = ({ 
  onApplyFilters,
  isLoading = false,
  showMobileActions = false,
  onToggleDrawer,
  onCloseDrawer,
  isDrawerOpen = false
}) => {
  // Estados locales
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isError, setIsError] = useState(false)
  const [error, setError] = useState(null)
  
  // Obtener filtros actuales de la URL
  const [searchParams] = useSearchParams()
  const currentFilters = parseFilters(searchParams)
  
  // Hook del formulario
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
    getDefaultValues,
    prepareSubmitData,
    handleClear,
    handleAñoChange,
    handlePrecioChange,
    handleKilometrajeChange,
    handleMarcaChange,
    handleCombustibleChange,
    handleCajaChange,
    formatPrice,
    formatKms,
    formatYear
  } = useFilterForm(currentFilters)

  // Sincronizar formulario con cambios en la URL
  useEffect(() => {
    const newValues = getDefaultValues()
    reset(newValues)
  }, [searchParams, reset, getDefaultValues])

  // Handlers
  const onSubmit = async (data) => {
    setIsSubmitting(true)
    setIsError(false)
    setError(null)
    
    try {
      const validData = prepareSubmitData(data)
      await onApplyFilters(validData)
      
      // Cerrar drawer después de aplicar (solo en mobile)
      if (onCloseDrawer) {
        setTimeout(() => onCloseDrawer(), 100)
      }
    } catch (error) {
      setIsError(true)
      setError(error?.message || 'Error al aplicar filtros')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClearClick = () => {
    handleClear()
    // No cerrar drawer, solo limpiar
  }

  return (
    <div className={styles.filterForm}>
      {/* Contenedor fijo mobile */}
      {showMobileActions && (
        <div className={styles.mobileActionsContainer}>
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
            onClick={onToggleDrawer}
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
      )}

      {/* Botón mobile (oculto en desktop) */}
      <button 
        className={styles.filterButtonMobile}
        onClick={onToggleDrawer}
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
      <div className={styles.formWrapper}>
        <form onSubmit={handleSubmit(onSubmit)} className={styles.form} data-testid="filters-form">
          {/* Título del formulario con botón cerrar */}
          <div className={styles.formTitle}>
            <h3>Filtros de Búsqueda</h3>
            <div className={styles.titleActions}>
              <button 
                type="button"
                onClick={onCloseDrawer} 
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
                onClick={handleClearClick}
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
                value={año}
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
                value={precio}
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
                value={kilometraje}
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
              onClick={handleClearClick}
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
}

FilterForm.displayName = 'FilterForm'

export default FilterForm
