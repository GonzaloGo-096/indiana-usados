/**
 * LazyFilterFormSimple - Wrapper ultra simplificado para lazy loading
 * 
 * Principios:
 * - Sin over-engineering
 * - Lazy loading simple y directo
 * - Skeleton minimalista
 * - Misma API externa
 * 
 * @author Indiana Usados
 * @version 1.0.0 - Ultra simplificado
 */

import React, { useState, lazy, Suspense } from 'react'
import { useDevice } from '@hooks'

// ✅ LAZY LOADING SIMPLE
const FilterFormSimple = lazy(() => import('./FilterFormSimple'))

// ✅ SKELETON MINIMALISTA
const SimpleSkeleton = () => (
  <div style={{
    height: 400,
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

// ✅ COMPONENTE PRINCIPAL SIMPLIFICADO
const LazyFilterFormSimple = React.forwardRef(({ 
  onApplyFilters, 
  isLoading, 
  isError, 
  error, 
  onRetry 
}, ref) => {
  const [showFilters, setShowFilters] = useState(false)
  const { isMobile } = useDevice()

  // ✅ HANDLERS SIMPLES
  const handleShowFilters = () => setShowFilters(true)
  const handleHideFilters = () => setShowFilters(false)
  const handleToggleFilters = () => setShowFilters(!showFilters)

  // ✅ HANDLER PARA APLICAR Y CERRAR
  const handleApplyAndClose = async (filters) => {
    try {
      await onApplyFilters(filters)
    } finally {
      handleHideFilters()
    }
  }

  // ✅ REF INTERFACE - MISMA API
  React.useImperativeHandle(ref, () => ({
    showFilters: handleShowFilters,
    hideFilters: handleHideFilters,
    toggleFilters: handleToggleFilters,
    isFiltersVisible: showFilters
  }), [showFilters])

  // ✅ EN MOBILE: Cargar directamente
  if (isMobile) {
    return (
      <div style={{ marginBottom: '20px' }}>
        <Suspense fallback={<SimpleSkeleton />}>
          <FilterFormSimple
            onApplyFilters={onApplyFilters}
            isLoading={isLoading}
            isError={isError}
            error={error}
            onRetry={onRetry}
          />
        </Suspense>
      </div>
    )
  }

  // ✅ EN DESKTOP: Mostrar cuando se active
  if (showFilters) {
    return (
      <div style={{
        animation: 'slideDown 0.3s ease-out',
        marginTop: '0',
        marginBottom: '20px',
        overflow: 'visible',
        position: 'relative'
      }}>
        {/* Overlay invisible para detectar clicks fuera - SOLO EN DESKTOP */}
        <div 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 5,
            background: 'transparent'
          }}
          onClick={handleHideFilters}
        />
        
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
          
          <Suspense fallback={<SimpleSkeleton />}>
            <FilterFormSimple
              onApplyFilters={handleApplyAndClose}
              isLoading={isLoading}
              isError={isError}
              error={error}
              onRetry={onRetry}
            />
          </Suspense>
        </div>
      </div>
    )
  }

  // ✅ EN DESKTOP: No mostrar nada hasta que se active
  return null
})

LazyFilterFormSimple.displayName = 'LazyFilterFormSimple'

export default LazyFilterFormSimple
