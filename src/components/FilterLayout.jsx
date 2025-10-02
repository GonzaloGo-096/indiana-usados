/**
 * FilterLayout - Componente para layout de filtros
 * 
 * Maneja la presentación visual (drawer mobile, overlay desktop)
 * sin lógica de negocio.
 * 
 * @author Indiana Usados
 * @version 1.0.0 - Modular
 */

import React from 'react'
import styles from './FilterLayout.module.css'

const FilterLayout = ({ 
  variant, 
  isVisible, 
  children, 
  onClose,
  className = '' 
}) => {
  if (variant === 'mobile') {
    return (
      <div className={`${styles.mobileContainer} ${className}`}>
        {isVisible && (
          <div 
            className={styles.overlay}
            onClick={onClose}
            role="presentation"
            aria-label="Cerrar formulario"
          />
        )}
        <div className={`${styles.mobileDrawer} ${isVisible ? styles.open : ''}`}>
          {children}
        </div>
      </div>
    )
  }

  if (variant === 'desktop') {
    return (
      <div className={`${styles.desktopContainer} ${className}`}>
        {isVisible && (
          <div 
            className={styles.overlay}
            onClick={onClose}
            role="presentation"
            aria-label="Cerrar formulario"
          />
        )}
        <div className={`${styles.desktopForm} ${isVisible ? styles.visible : ''}`}>
          {children}
        </div>
      </div>
    )
  }

  return null
}

FilterLayout.displayName = 'FilterLayout'

export default FilterLayout
