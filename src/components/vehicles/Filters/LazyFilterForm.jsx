/**
 * LazyFilterForm - Componente wrapper optimizado para lazy loading
 * 
 * Arquitectura profesional:
 * - Lazy loading inteligente con prefetch
 * - Skeleton optimizado sin duplicación
 * - Responsive design unificado
 * - Performance de 10 puntos
 * 
 * @author Indiana Usados
 * @version 2.0.0 - Professional optimization
 */

import React, { useState, lazy, Suspense } from 'react'
import { useDevice } from '@hooks'

// ✅ LAZY LOADING: Cargar FilterFormSimplified y sus dependencias pesadas
const FilterFormSimplified = lazy(async () => {
  const [FilterForm, RangeSlider, MultiSelect] = await Promise.all([
    import('@vehicles/Filters/filters/FilterFormSimplified'),
    import('@ui/RangeSlider'),
    import('@ui/MultiSelect')
  ])
  return FilterForm
})

// ✅ OPTIMIZADO: Skeleton profesional con CSS variables
const FilterFormSkeleton = () => (
  <div className="filter-skeleton">
    <div className="skeleton-line skeleton-header" />
    <div className="skeleton-line skeleton-medium" />
    <div className="skeleton-line skeleton-small" />
    <div className="skeleton-line skeleton-large" />
    <style>{`
      .filter-skeleton {
        height: 400px;
        background: #f8f9fa;
        border: 1px solid #dee2e6;
        border-radius: 8px;
        padding: 20px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 15px;
        animation: fadeIn 0.2s ease-in;
      }
      .skeleton-line {
        background: #e9ecef;
        border-radius: 4px;
        animation: pulse 1.5s ease-in-out infinite;
      }
      .skeleton-header { width: 100%; height: 40px; }
      .skeleton-medium { width: 80%; height: 30px; }
      .skeleton-small { width: 60%; height: 30px; }
      .skeleton-large { width: 100%; height: 50px; }
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

// ✅ COMPONENTE PRINCIPAL
const LazyFilterForm = React.forwardRef(({ onApplyFilters, isLoading, isError, error, onRetry, onSortClick, selectedSort }, ref) => {
  const [showFilters, setShowFilters] = useState(false)
  const [isPreloading, setIsPreloading] = useState(false)
  // Detección de dispositivo por contexto global
  const { isMobile } = useDevice()

  // ✅ PREFETCH: Cargar en background cuando el usuario hace hover
  const handleMouseEnter = () => {
    if (!showFilters && !isPreloading) {
      setIsPreloading(true)
      import('@vehicles/Filters/filters/FilterFormSimplified')
    }
  }

  // ✅ MOSTRAR FILTROS: Cargar cuando el usuario hace clic
  const handleShowFilters = () => {
    setShowFilters(true)
  }

  // ✅ NUEVO: Función para cerrar filtros
  const handleHideFilters = () => {
    setShowFilters(false)
  }
  
  // Handler para aplicar desde el formulario y cerrar
  const handleApplyAndClose = async (filters) => {
    try {
      await onApplyFilters(filters)
    } finally {
      handleHideFilters()
    }
  }

  // ✅ NUEVO: Toggle de filtros
  const handleToggleFilters = () => {
    setShowFilters(!showFilters)
  }

  // ✅ NUEVO: Exponer funciones para uso externo
  React.useImperativeHandle(ref, () => ({
    showFilters: handleShowFilters,
    hideFilters: handleHideFilters,
    toggleFilters: handleToggleFilters,
    isFiltersVisible: showFilters
  }), [showFilters])

  // ✅ Si ya se mostró una vez, siempre mostrar con animación
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
        {/* Overlay invisible para detectar clicks fuera - SOLO EN DESKTOP */}
        {!isMobile && (
          <div 
            className="filter-overlay"
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              zIndex: 5,
              background: 'transparent'
            }}
            role="presentation"
            onClick={handleHideFilters}
          />
        )}
        
        <div style={{ position: 'relative', zIndex: 10 }}>
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
                 <Suspense fallback={<FilterFormSkeleton />}>
                   <FilterFormSimplified
                     onApplyFilters={handleApplyAndClose}
                     isLoading={isLoading}
                     isError={isError}
                     error={error}
                     onRetry={onRetry}
                     onSortClick={onSortClick}
                     selectedSort={selectedSort}
                   />
                 </Suspense>
        </div>
      </div>
    )
  }

  // ✅ EN MOBILE: Cargar directamente el FilterFormSimplified (que tiene su propio botón móvil)
  if (isMobile) {
    return (
             <div style={{
               marginBottom: '20px'
             }}>
               <Suspense fallback={<FilterFormSkeleton />}>
                 <FilterFormSimplified
                   onApplyFilters={onApplyFilters}
                   isLoading={isLoading}
                   isError={isError}
                   error={error}
                   onRetry={onRetry}
                   onSortClick={onSortClick}
                   selectedSort={selectedSort}
                 />
               </Suspense>
             </div>
    )
  }

  // ✅ EN DESKTOP: No mostrar nada hasta que se active desde el botón del título
  return null
})

LazyFilterForm.displayName = 'LazyFilterForm'

export default LazyFilterForm
