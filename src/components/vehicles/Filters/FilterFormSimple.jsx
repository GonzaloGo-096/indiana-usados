/**
 * FilterFormSimple - Formulario de filtros unificado
 * 
 * Maneja tanto mobile (drawer) como desktop (visibilidad)
 * 
 * Principios:
 * - Sin over-engineering
 * - Lógica directa y clara
 * - Misma funcionalidad, menos código
 * - Performance optimizada
 * 
 * @author Indiana Usados
 * @version 2.0.0 - Unificado: elimina necesidad de LazyFilterFormSimple
 */

import React, { useState, useEffect, useCallback, useRef } from 'react'
import { useSearchParams } from 'react-router-dom'
import { RangeSlider } from '@ui'
import { MultiSelect } from '@ui'
import { marcas, combustibles, cajas, FILTER_DEFAULTS, SORT_OPTIONS } from '@constants'
import { parseFilters } from '@utils'
import { logger } from '@utils/logger'
import { useDevice } from '@hooks'
import styles from './FilterFormSimple.module.css'

// ✅ COMPONENTE CON forwardRef
const FilterFormSimpleComponent = React.forwardRef(({
  onApplyFilters,
  isLoading = false,
  isError = false,
  error = null,
  onRetry = null,
}, ref) => {
  const { isMobile } = useDevice()
  
  // ✅ ESTADOS SIMPLES
  // Estado para visibilidad en desktop
  const [isVisibleDesktop, setIsVisibleDesktop] = useState(false)
  // Estado para drawer en mobile
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showMobileActions, setShowMobileActions] = useState(false)
  const triggerRef = useRef(null)
  const [isSortDropdownOpen, setIsSortDropdownOpen] = useState(false)
  const sortDropdownRef = useRef(null)
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
  const selectedSort = searchParams.get('sort')

  // ✅ SINCRONIZACIÓN DE ESTADOS AL CAMBIAR DISPOSITIVO
  useEffect(() => {
    if (isMobile) {
      // En mobile, cerrar visibilidad desktop
      setIsVisibleDesktop(false)
    } else {
      // En desktop, cerrar drawer mobile
      setIsDrawerOpen(false)
    }
  }, [isMobile])

  // ✅ BLOQUEAR SCROLL DEL BODY CUANDO EL DRAWER ESTÁ ABIERTO
  useEffect(() => {
    if (!isDrawerOpen) return
    
    // Guardar posición actual del scroll
    const scrollY = window.scrollY
    const body = document.body
    
    // Aplicar estilos para bloquear scroll (compatible con iOS)
    body.style.position = 'fixed'
    body.style.top = `-${scrollY}px`
    body.style.left = '0'
    body.style.right = '0'
    body.style.overflow = 'hidden'
    
    // Cleanup: restaurar scroll al cerrar
    return () => {
      body.style.position = ''
      body.style.top = ''
      body.style.left = ''
      body.style.right = ''
      body.style.overflow = ''
      // Restaurar posición del scroll
      window.scrollTo(0, scrollY)
    }
  }, [isDrawerOpen])

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
    // sort se maneja en la página Vehiculos
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

  // ✅ HANDLERS UNIFICADOS (funcionan en ambos contextos)
  const toggleVisibility = useCallback(() => {
    if (isMobile) {
      setIsDrawerOpen(prev => !prev)
    } else {
      setIsVisibleDesktop(prev => !prev)
    }
  }, [isMobile])

  const closeVisibility = useCallback(() => {
    if (isMobile) {
      setIsDrawerOpen(false)
    } else {
      setIsVisibleDesktop(false)
    }
  }, [isMobile])

  // ✅ HANDLERS SIMPLES (mantener para compatibilidad)
  const toggleDrawer = useCallback(() => setIsDrawerOpen(prev => !prev), [])
  const closeDrawer = useCallback(() => setIsDrawerOpen(false), [])
  const toggleSortDropdown = useCallback(() => setIsSortDropdownOpen(prev => !prev), [])
  const handleSortChange = useCallback((sortOption) => {
    setIsSortDropdownOpen(false)
    const newParams = new URLSearchParams(searchParams)
    if (sortOption) {
      newParams.set('sort', sortOption)
    } else {
      newParams.delete('sort')
    }
    setSearchParams(newParams)
  }, [searchParams, setSearchParams])

  // Cerrar dropdown si cambia el sort desde la URL (evita quedarse abierto)
  useEffect(() => {
    if (isSortDropdownOpen) {
      setIsSortDropdownOpen(false)
    }
  }, [selectedSort])

  // Cerrar dropdown al hacer click fuera
  useEffect(() => {
    if (!isSortDropdownOpen) return
    const handleClickOutside = (e) => {
      if (sortDropdownRef.current && !sortDropdownRef.current.contains(e.target)) {
        setIsSortDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isSortDropdownOpen])

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
    setSearchParams({})
  }, [setSearchParams])

  // Cerrar con Escape y devolver foco al trigger
  useEffect(() => {
    if (!isDrawerOpen) return
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setIsDrawerOpen(false)
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isDrawerOpen])

  // Devolver foco al trigger al cerrar
  useEffect(() => {
    if (!isDrawerOpen && triggerRef.current) {
      try { triggerRef.current.focus() } catch (_) {}
    }
  }, [isDrawerOpen])

  // ✅ SUBMIT
  const onSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Cerrar según dispositivo (desktop o mobile)
      closeVisibility()
      await onApplyFilters(filters)
    } catch (error) {
      logger.error('filters:apply', 'Error applying filters', { error: error.message })
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

  // ✅ REF INTERFACE UNIFICADA (compatibilidad con ambos sistemas)
  React.useImperativeHandle(ref, () => ({
    // Métodos originales (para mobile - compatibilidad)
    toggleDrawer,
    closeDrawer,
    isDrawerOpen: isMobile ? isDrawerOpen : isVisibleDesktop,
    
    // Métodos de LazyFilterFormSimple (para desktop - compatibilidad)
    toggleFilters: toggleVisibility,
    showFilters: () => setIsVisibleDesktop(true),
    hideFilters: () => setIsVisibleDesktop(false),
    isFiltersVisible: isMobile ? isDrawerOpen : isVisibleDesktop,
  }), [isMobile, isDrawerOpen, isVisibleDesktop, toggleDrawer, closeDrawer, toggleVisibility])

  // ✅ CONTEO DE FILTROS ACTIVOS
  const activeFiltersCount = [
    filters.marca?.length > 0,
    filters.caja?.length > 0,
    filters.combustible?.length > 0,
    filters.año[0] !== FILTER_DEFAULTS.AÑO.min || filters.año[1] !== FILTER_DEFAULTS.AÑO.max,
    filters.precio[0] !== FILTER_DEFAULTS.PRECIO.min || filters.precio[1] !== FILTER_DEFAULTS.PRECIO.max,
    filters.kilometraje[0] !== FILTER_DEFAULTS.KILOMETRAJE.min || filters.kilometraje[1] !== FILTER_DEFAULTS.KILOMETRAJE.max
  ].filter(Boolean).length

  // ✅ CONTENIDO DEL FORMULARIO (reutilizable)
  const formContent = (
    <div className={`${styles.filterContainer} ${isDrawerOpen ? styles.open : ''}`}>
      {/* Mobile Actions */}
      <div className={`${styles.mobileActionsContainer} ${showMobileActions ? styles.visible : ''}`}>
          <div className={styles.actionItem}>
            <button
              className={`${styles.mobileActionButton} ${selectedSort ? styles.active : ''}`}
              onClick={toggleSortDropdown}
              disabled={isLoading || isSubmitting}
              type="button"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 6h18"></path><path d="M6 12h12"></path><path d="M9 18h6"></path>
              </svg>
              <span>Ordenar</span>
            </button>
            {isSortDropdownOpen && (
              <div className={styles.sortDropdown} ref={sortDropdownRef}>
                <button onClick={() => handleSortChange(null)} className={!selectedSort ? styles.active : ''} type="button">
                  Sin ordenamiento
                </button>
                {SORT_OPTIONS.map(option => (
                  <button
                    key={option.value}
                    onClick={() => handleSortChange(option.value)}
                    className={selectedSort === option.value ? styles.active : ''}
                    type="button"
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            )}
          </div>
          <div className={styles.actionItem}>
            <button
              ref={triggerRef}
              className={styles.mobileActionButton}
              onClick={toggleDrawer}
              disabled={isLoading || isSubmitting}
              type="button"
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
        <form id="filterForm" onSubmit={onSubmit} className={styles.form}>
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
                placeholder="Seleccionar combustibles"
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

          {/* Botones */}
          <div className={styles.mobileButtons}>
            <button type="button" onClick={handleClear} className={styles.clearButton} disabled={isLoading || isSubmitting}>
              Limpiar
            </button>
            <button type="submit" className={styles.applyButton} disabled={isLoading || isSubmitting}>
              Aplicar
            </button>
          </div>
        </form>
      </div>
    </div>
  )

  // ✅ EN DESKTOP: No mostrar nada hasta que se active
  if (!isMobile && !isVisibleDesktop) {
    return null
  }

  // ✅ EN DESKTOP: Wrapper con animación slideDown
  if (!isMobile && isVisibleDesktop) {
    return (
      <div style={{
        animation: 'slideDown 0.3s ease-out',
        marginTop: '0',
        marginBottom: '20px',
      }}>
        <style>{`
          @keyframes slideDown {
            from {
              opacity: 0;
              transform: translateY(-20px);
              max-height: 0;
            }
            to {
              opacity: 1;
              transform: translateY(0);
              max-height: 1000px;
            }
          }
        `}</style>
        {formContent}
      </div>
    )
  }

  // ✅ EN MOBILE: Renderizar directamente (comportamiento original)
  return formContent
})

FilterFormSimpleComponent.displayName = 'FilterFormSimple'

// ✅ ENVOLVER CON memo PARA OPTIMIZACIÓN
const FilterFormSimple = React.memo(FilterFormSimpleComponent)
FilterFormSimple.displayName = 'FilterFormSimple'

export default FilterFormSimple
