/**
 * FilterContainer - Componente contenedor para filtros
 * 
 * Coordina la lógica de filtros sin manejar presentación específica.
 * Punto de entrada principal para el sistema de filtros.
 * 
 * @author Indiana Usados
 * @version 1.0.0 - Modular
 */

import React, { useState, lazy, Suspense, useEffect } from 'react'
import { useDeviceDetection } from '@hooks/useDeviceDetection'
import { useScrollDetection } from '@hooks/useScrollDetection'
import FilterLayout from './FilterLayout'
import FilterForm from './FilterForm'

// ✅ LAZY LOADING: Cargar FilterForm y sus dependencias pesadas
const FilterFormLazy = lazy(async () => {
  const [FilterForm, RangeSlider, MultiSelect] = await Promise.all([
    import('./FilterForm'),
    import('@ui/RangeSlider'),
    import('@ui/MultiSelect')
  ])
  return FilterForm
})

// ✅ SKELETON: Componente de carga con altura fija para evitar CLS
const FilterFormSkeleton = () => (
  <div style={{
    height: '400px',
    background: '#f8f9fa',
    border: '1px solid #dee2e6',
    borderRadius: '8px',
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '15px',
    animation: 'fadeIn 0.2s ease-in'
  }}>
    <div style={{
      width: '100%',
      height: '40px',
      background: '#e9ecef',
      borderRadius: '4px',
      animation: 'pulse 1.5s ease-in-out infinite'
    }} />
    <div style={{
      width: '80%',
      height: '30px',
      background: '#e9ecef',
      borderRadius: '4px',
      animation: 'pulse 1.5s ease-in-out infinite'
    }} />
    <div style={{
      width: '60%',
      height: '30px',
      background: '#e9ecef',
      borderRadius: '4px',
      animation: 'pulse 1.5s ease-in-out infinite'
    }} />
    <div style={{
      width: '100%',
      height: '50px',
      background: '#e9ecef',
      borderRadius: '4px',
      animation: 'pulse 1.5s ease-in-out infinite'
    }} />
    <style>{`
      @keyframes pulse {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.5; }
      }
      @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
      }
    `}</style>
  </div>
)

const FilterContainer = React.forwardRef(({ onApplyFilters, isLoading }, ref) => {
  // Estados locales
  const [showFilters, setShowFilters] = useState(false)
  const [isPreloading, setIsPreloading] = useState(false)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)

  // Hooks modulares
  const { isMobile, isDesktop } = useDeviceDetection()
  const { isVisible } = useScrollDetection()

  // ✅ PREFETCH: Cargar en background cuando el usuario hace hover
  const handleMouseEnter = () => {
    if (!showFilters && !isPreloading) {
      setIsPreloading(true)
      import('./FilterForm')
    }
  }

  // Handlers para mostrar/ocultar filtros
  const handleShowFilters = () => {
    setShowFilters(true)
  }

  const handleHideFilters = () => {
    setShowFilters(false)
  }

  const handleToggleFilters = () => {
    setShowFilters(!showFilters)
  }

  // Handlers para drawer mobile
  const handleToggleDrawer = () => {
    setIsDrawerOpen(prev => !prev)
  }

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false)
  }

  // Handler para aplicar desde el formulario y cerrar
  const handleApplyAndClose = async (filters) => {
    try {
      await onApplyFilters(filters)
    } finally {
      if (isDesktop) {
        handleHideFilters()
      }
    }
  }

  // ✅ Exponer funciones para uso externo
  React.useImperativeHandle(ref, () => ({
    showFilters: handleShowFilters,
    hideFilters: handleHideFilters,
    toggleFilters: handleToggleFilters,
    isFiltersVisible: showFilters
  }), [showFilters])

  // Renderizado condicional basado en dispositivo
  if (isMobile) {
    return (
      <div style={{ marginBottom: '20px' }}>
        <Suspense fallback={<FilterFormSkeleton />}>
          <FilterForm 
            onApplyFilters={onApplyFilters}
            isLoading={isLoading}
            showMobileActions={isVisible}
            onToggleDrawer={handleToggleDrawer}
            onCloseDrawer={handleCloseDrawer}
            isDrawerOpen={isDrawerOpen}
          />
        </Suspense>
      </div>
    )
  }

  if (isDesktop) {
    if (showFilters) {
      return (
        <div 
          style={{
            animation: 'slideDown 0.3s ease-out',
            marginTop: '0',
            marginBottom: '20px',
            overflow: 'visible',
            position: 'relative'
          }}
        >
          <FilterLayout 
            variant="desktop" 
            isVisible={showFilters} 
            onClose={handleHideFilters}
          >
            <Suspense fallback={<FilterFormSkeleton />}>
              <FilterForm 
                onApplyFilters={handleApplyAndClose}
                isLoading={isLoading}
                showMobileActions={false}
                onToggleDrawer={handleToggleDrawer}
                onCloseDrawer={handleCloseDrawer}
                isDrawerOpen={isDrawerOpen}
              />
            </Suspense>
          </FilterLayout>
        </div>
      )
    }

    // En desktop, no mostrar nada hasta que se active desde el botón del título
    return null
  }

  // Fallback mientras se detecta el dispositivo
  return null
})

FilterContainer.displayName = 'FilterContainer'

export default FilterContainer
