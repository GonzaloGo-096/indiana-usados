/**
 * SortDropdown - Dropdown simple para ordenamiento
 * 
 * Características:
 * - Dropdown simple que se despliega desde el botón
 * - Mismos estilos que el dropdown de navegación
 * - Se posiciona debajo del botón que lo activa
 * - No es invasivo, no bloquea la pantalla
 * 
 * @author Indiana Usados
 * @version 1.0.0
 */

import React, { useEffect, useRef } from 'react'
import { SORT_OPTIONS } from '@constants'
import { isValidSortOption } from '@utils'

const SortDropdown = React.memo(({ 
  isOpen = false, 
  selectedSort = null,
  onSortChange = () => {},
  onClose = () => {},
  disabled = false,
  preventAutoClose = false
}) => {
  const dropdownRef = useRef(null)

  // ✅ Accesibilidad: Cerrar con ESC
  useEffect(() => {
    if (!isOpen) return

    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [isOpen, onClose])

  // ✅ Click outside para cerrar
  useEffect(() => {
    if (!isOpen) return

    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        onClose()
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isOpen, onClose])

  // ✅ Handler para seleccionar opción
  const handleSortSelect = (sortOption) => {
    if (disabled || !isValidSortOption(sortOption)) return
    
    onSortChange(sortOption)
    
    // ✅ NUEVO: Solo cerrar si no está en modo preventAutoClose
    if (!preventAutoClose) {
      onClose()
    }
  }

  // ✅ Handler para limpiar sorting
  const handleClearSort = () => {
    if (disabled) return
    
    onSortChange(null)
    
    // ✅ NUEVO: Solo cerrar si no está en modo preventAutoClose
    if (!preventAutoClose) {
      onClose()
    }
  }

  if (!isOpen) return null

  return (
    <div 
      ref={dropdownRef}
      style={{
        position: 'absolute',
        top: '100%',
        left: '0',
        right: '0',
        backgroundColor: 'rgba(18, 18, 18, 0.95)',
        backdropFilter: 'blur(12px)',
        border: '1px solid rgba(255, 255, 255, 0.15)',
        borderRadius: '8px',
        minWidth: '200px',
        padding: '8px 0',
        marginTop: '8px',
        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.4)',
        zIndex: 1300,
        animation: 'fadeInDown 0.2s ease-out'
      }}
      role="listbox"
      aria-label="Opciones de ordenamiento"
    >
      {/* Opción "Sin ordenamiento" */}
      <button
        onClick={handleClearSort}
        disabled={disabled}
        style={{
          width: '100%',
          padding: '12px 20px',
          backgroundColor: selectedSort === null ? 'rgba(255, 255, 255, 0.08)' : 'transparent',
          border: 'none',
          color: 'white',
          fontSize: '16px',
          fontFamily: 'Barlow Condensed, sans-serif',
          fontWeight: selectedSort === null ? '600' : '400',
          textAlign: 'left',
          cursor: disabled ? 'not-allowed' : 'pointer',
          opacity: disabled ? 0.5 : 1,
          transition: 'all 0.2s ease',
          whiteSpace: 'nowrap',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}
        className={`sort-option ${disabled ? 'disabled' : ''} ${selectedSort === null ? 'selected' : ''}`}
        role="option"
        aria-selected={selectedSort === null}
      >
        <span>Sin ordenamiento</span>
        {selectedSort === null && (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="20,6 9,17 4,12"></polyline>
          </svg>
        )}
      </button>

      {/* Opciones de ordenamiento */}
      {SORT_OPTIONS.map((option) => {
        const isSelected = selectedSort === option.value
        
        return (
          <button
            key={option.value}
            onClick={() => handleSortSelect(option.value)}
            disabled={disabled}
            style={{
              width: '100%',
              padding: '12px 20px',
              backgroundColor: isSelected ? 'rgba(255, 255, 255, 0.08)' : 'transparent',
              border: 'none',
              color: 'white',
              fontSize: '16px',
              fontFamily: 'Barlow Condensed, sans-serif',
              fontWeight: isSelected ? '600' : '400',
              textAlign: 'left',
              cursor: disabled ? 'not-allowed' : 'pointer',
              opacity: disabled ? 0.5 : 1,
              transition: 'all 0.2s ease',
              whiteSpace: 'nowrap',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
            className={`sort-option ${disabled ? 'disabled' : ''} ${isSelected ? 'selected' : ''}`}
            role="option"
            aria-selected={isSelected}
          >
            <span>{option.label}</span>
            {isSelected && (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="20,6 9,17 4,12"></polyline>
              </svg>
            )}
          </button>
        )
      })}

      {/* Estilos CSS optimizados */}
      <style>{`
        @keyframes fadeInDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .sort-option:hover:not(.disabled):not(.selected) {
          background-color: rgba(255, 255, 255, 0.08) !important;
        }
        
        .sort-option.selected {
          background-color: rgba(255, 255, 255, 0.08);
        }
        
        .sort-option.disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
      `}</style>
    </div>
  )
})

SortDropdown.displayName = 'SortDropdown'

export default SortDropdown
