/**
 * VersionTabs - Tabs de versiones para desktop
 * 
 * Muestra botones/tabs para seleccionar versión.
 * Componente presentacional.
 * 
 * @author Indiana Usados
 * @version 1.0.0
 */

import React, { memo } from 'react'
import styles from './VersionTabs.module.css'

/**
 * @param {Object} props
 * @param {Array} props.versiones - Array de objetos versión
 * @param {string} props.versionActivaId - ID de la versión activa
 * @param {Function} props.onVersionChange - Callback al cambiar versión
 */
export const VersionTabs = memo(({
  versiones = [],
  versionActivaId,
  onVersionChange
}) => {
  if (!versiones.length) return null

  return (
    <nav className={styles.container} role="tablist" aria-label="Versiones disponibles">
      {versiones.map((version) => {
        const isActive = version.id === versionActivaId
        
        // Formatear nombre: GT en rojo, siglas en mayúsculas, resto capitalizado
        const renderNombre = () => {
          const nombre = version.nombreCorto || ''
          
          // Formatear una palabra: siglas/códigos en mayúscula, resto capitalizado
          const formatWord = (word) => {
            const upper = word.toUpperCase()
            // Códigos alfanuméricos (T200, AM24, GT) o siglas cortas
            if (word.length <= 2 || /^[A-Z]+\d+$/i.test(word)) {
              return upper
            }
            return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
          }
          
          // Dividir por espacios, formatear cada palabra
          const palabras = nombre.split(' ')
          
          return palabras.map((palabra, i) => {
            const formatted = formatWord(palabra)
            const upperWord = palabra.toUpperCase()
            
            // Si es GT, ponerlo en rojo
            if (upperWord === 'GT') {
              return (
                <span key={i}>
                  {i > 0 && ' '}
                  <span className={styles.gtText}>{formatted}</span>
                </span>
              )
            }
            
            return (i > 0 ? ' ' : '') + formatted
          })
        }
        
        return (
          <button
            key={version.id}
            type="button"
            className={`${styles.tab} ${isActive ? styles.active : ''}`}
            onClick={() => onVersionChange(version.id)}
            role="tab"
            aria-selected={isActive}
            aria-controls={`panel-${version.id}`}
          >
            {renderNombre()}
          </button>
        )
      })}
    </nav>
  )
})

VersionTabs.displayName = 'VersionTabs'

export default VersionTabs


