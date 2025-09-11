/**
 * LazyFilterForm - Componente wrapper para lazy loading del FilterForm
 * 
 * Carga el FilterFormSimplified y sus dependencias pesadas de manera diferida
 * para mejorar el rendimiento inicial de la página.
 * 
 * @author Indiana Usados
 * @version 1.0.0
 */

import React, { useState, lazy, Suspense, useEffect } from 'react'

// ✅ LAZY LOADING: Cargar FilterFormSimplified y sus dependencias pesadas
const FilterFormSimplified = lazy(async () => {
  const [FilterForm, RangeSlider, MultiSelect] = await Promise.all([
    import('@vehicles/Filters/filters/FilterFormSimplified'),
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
    gap: '15px'
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
    `}</style>
  </div>
)

// ✅ COMPONENTE PRINCIPAL
const LazyFilterForm = ({ onApplyFilters, isLoading }) => {
  const [showFilters, setShowFilters] = useState(false)
  const [isPreloading, setIsPreloading] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  // ✅ DETECTAR SI ES MOBILE
  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth <= 768)
    }
    
    checkIsMobile()
    window.addEventListener('resize', checkIsMobile)
    
    return () => window.removeEventListener('resize', checkIsMobile)
  }, [])

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

  // ✅ Si ya se mostró una vez, siempre mostrar
  if (showFilters) {
    return (
      <Suspense fallback={<FilterFormSkeleton />}>
        <FilterFormSimplified 
          onApplyFilters={onApplyFilters}
          isLoading={isLoading}
        />
      </Suspense>
    )
  }

  // ✅ EN MOBILE: Cargar directamente el FilterFormSimplified (que tiene su propio botón móvil)
  if (isMobile) {
    return (
      <Suspense fallback={<FilterFormSkeleton />}>
        <FilterFormSimplified 
          onApplyFilters={onApplyFilters}
          isLoading={isLoading}
        />
      </Suspense>
    )
  }

  // ✅ EN DESKTOP: Mostrar botón para lazy loading
  return (
    <div style={{ textAlign: 'center', marginBottom: '20px' }}>
      <button
        onClick={handleShowFilters}
        onMouseEnter={handleMouseEnter}
        style={{
          padding: '12px 24px',
          fontSize: '16px',
          fontWeight: '500',
          color: '#fff',
          background: '#007bff',
          border: 'none',
          borderRadius: '6px',
          cursor: 'pointer',
          transition: 'background-color 0.2s ease'
        }}
        onMouseOver={(e) => e.target.style.background = '#0056b3'}
        onMouseOut={(e) => e.target.style.background = '#007bff'}
      >
        Mostrar Filtros
      </button>
      <p style={{ 
        marginTop: '8px', 
        fontSize: '14px', 
        color: '#6c757d' 
      }}>
        Haz clic para ver las opciones de filtrado avanzado
      </p>
    </div>
  )
}

export default LazyFilterForm
