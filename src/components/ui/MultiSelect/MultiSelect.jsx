/**
 * MultiSelect - Componente ultra simple y eficiente
 * 
 * Principios: Simplicidad, Performance, Mantenibilidad
 * - Sin over-engineering
 * - Lógica mínima y clara
 * - Performance optimizada sin complejidad
 * 
 * @author Indiana Usados
 * @version 3.0.0
 */

import React, { useState, useRef, useEffect, useMemo } from 'react'
import styles from './MultiSelect.module.css'

const MultiSelect = React.memo(({
  options = [],
  value = [],
  onChange,
  label,
  placeholder = "Seleccionar opciones",
  className = '',
  disabled = false,
  error = false,
  required = false
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef(null)

  // Validación simple y eficiente
  const validOptions = useMemo(() => 
    Array.isArray(options) ? options.filter(Boolean) : [], 
    [options]
  )

  const validValue = useMemo(() => 
    Array.isArray(value) ? value.filter(Boolean) : [], 
    [value]
  )

  // Set para O(1) lookups - ÚNICA optimización crítica
  const selectedSet = useMemo(() => new Set(validValue), [validValue])

  // Click outside - Lógica simple
  useEffect(() => {
    if (!isOpen) return

    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isOpen])

  // Toggle option - Lógica ultra simple
  const handleToggleOption = (option) => {
    if (disabled) return

    const newValues = selectedSet.has(option)
      ? validValue.filter(val => val !== option)
      : [...validValue, option]
    
    onChange?.(newValues)
  }

  // Toggle dropdown - Lógica simple
  const handleToggleDropdown = () => {
    if (disabled) return
    setIsOpen(!isOpen)
  }

  // Keyboard navigation - Lógica simple
  const handleKeyDown = (event) => {
    if (disabled) return

    switch (event.key) {
      case 'Enter':
      case ' ':
        event.preventDefault()
        handleToggleDropdown()
        break
      case 'Escape':
        setIsOpen(false)
        break
    }
  }

  return (
    <div className={`${styles.multiSelect} ${className}`}>
      {label && (
        <label className={styles.label}>
          {label}
          {required && <span className={styles.required}> *</span>}
        </label>
      )}
      
      <div className={styles.container} ref={dropdownRef}>
        <button
          type="button"
          className={`${styles.trigger} ${isOpen ? styles.open : ''} ${error ? styles.error : ''} ${disabled ? styles.disabled : ''}`}
          onClick={handleToggleDropdown}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          aria-expanded={isOpen}
          aria-haspopup="listbox"
          aria-label={placeholder}
          tabIndex={disabled ? -1 : 0}
        >
          <span className={styles.text}>{placeholder}</span>
          <svg 
            className={styles.arrow} 
            width="16" 
            height="16" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2"
            aria-hidden="true"
          >
            <polyline points="6,9 12,15 18,9"></polyline>
          </svg>
        </button>

        {isOpen && (
          <div 
            className={styles.dropdown}
            role="listbox"
            aria-multiselectable="true"
          >
            <div className={styles.options}>
              {validOptions.length > 0 ? (
                validOptions.map((option) => (
                  <label 
                    key={option} 
                    className={styles.option}
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault()
                        handleToggleOption(option)
                      }
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={selectedSet.has(option)}
                      onChange={() => handleToggleOption(option)}
                      className={styles.checkbox}
                      disabled={disabled}
                    />
                    <span className={styles.optionText}>{option}</span>
                  </label>
                ))
              ) : (
                <div className={styles.emptyState}>
                  No hay opciones disponibles
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      
      {error && (
        <div className={styles.errorMessage}>
          {error}
        </div>
      )}
    </div>
  )
})

MultiSelect.displayName = 'MultiSelect'

export default MultiSelect 