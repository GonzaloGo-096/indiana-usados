/**
 * MultiSelect - Componente de selección múltiple optimizado
 * 
 * Versión ultra simple y eficiente con optimizaciones de performance
 * 
 * @author Indiana Usados
 * @version 1.2.0
 */

import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react'
import styles from './MultiSelect.module.css'

const MultiSelect = React.memo(({
  options = [],
  value = [],
  onChange,
  label,
  placeholder = "Seleccionar opciones",
  className = ''
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedValues, setSelectedValues] = useState(value)
  const dropdownRef = useRef(null)

  // Sincronizar con props externas
  useEffect(() => {
    setSelectedValues(value)
  }, [value])

  // Memoizar event listener para evitar recreaciones
  const handleClickOutside = useCallback((event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsOpen(false)
    }
  }, [])

  // Cerrar dropdown al hacer clic fuera - OPTIMIZADO
  useEffect(() => {
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen, handleClickOutside])

  // Manejar selección/deselección - OPTIMIZADO
  const handleToggleOption = useCallback((option) => {
    setSelectedValues(prev => {
      const newValues = prev.includes(option)
        ? prev.filter(val => val !== option)
        : [...prev, option]
      
      onChange?.(newValues)
      return newValues
    })
  }, [onChange])

  // Memoizar opciones renderizadas
  const renderedOptions = useMemo(() => (
    options.map((option) => (
      <label key={option} className={styles.option}>
        <input
          type="checkbox"
          checked={selectedValues.includes(option)}
          onChange={() => handleToggleOption(option)}
          className={styles.checkbox}
        />
        <span className={styles.optionText}>{option}</span>
      </label>
    ))
  ), [options, selectedValues, handleToggleOption])

  return (
    <div className={`${styles.multiSelect} ${className}`}>
      {label && <label className={styles.label}>{label}</label>}
      
      <div className={styles.container} ref={dropdownRef}>
        <button
          type="button"
          className={`${styles.trigger} ${isOpen ? styles.open : ''}`}
          onClick={() => setIsOpen(!isOpen)}
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
          >
            <polyline points="6,9 12,15 18,9"></polyline>
          </svg>
        </button>

        {isOpen && (
          <div className={styles.dropdown}>
            <div className={styles.options}>
              {renderedOptions}
            </div>
          </div>
        )}
      </div>
    </div>
  )
})

MultiSelect.displayName = 'MultiSelect'

export default MultiSelect 