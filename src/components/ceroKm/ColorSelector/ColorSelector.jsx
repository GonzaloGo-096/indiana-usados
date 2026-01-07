/**
 * ColorSelector - Selector de colores para modelos 0km
 * 
 * Muestra círculos de colores clickeables.
 * Componente presentacional, recibe props del hook.
 * 
 * @author Indiana Usados
 * @version 1.0.0
 */

import React, { memo } from 'react'
import styles from './ColorSelector.module.css'

/**
 * @param {Object} props
 * @param {Array} props.colores - Array de objetos color { key, label, hex, url }
 * @param {string} props.colorActivo - Key del color activo
 * @param {Function} props.onColorChange - Callback al cambiar color
 * @param {string} props.size - Tamaño: 'sm' | 'md' | 'lg'
 */
export const ColorSelector = memo(({
  colores = [],
  colorActivo,
  onColorChange,
  size = 'md'
}) => {
  if (!colores.length) return null

  return (
    <div className={styles.container} role="radiogroup" aria-label="Selector de color">
      {colores.map((color) => {
        const isActive = color.key === colorActivo
        const hasImage = !!color.url
        
        return (
          <button
            key={color.key}
            type="button"
            className={`${styles.colorButton} ${styles[size]} ${isActive ? styles.active : ''} ${!hasImage ? styles.noImage : ''}`}
            onClick={() => onColorChange(color.key)}
            aria-checked={isActive}
            aria-label={`${color.label}${!hasImage ? ' (imagen no disponible)' : ''}`}
            role="radio"
            title={color.label}
          >
            <span 
              className={styles.colorCircle}
              style={{ backgroundColor: color.hex }}
            />
            {!hasImage && <span className={styles.noImageIndicator} />}
          </button>
        )
      })}
    </div>
  )
})

ColorSelector.displayName = 'ColorSelector'

export default ColorSelector



