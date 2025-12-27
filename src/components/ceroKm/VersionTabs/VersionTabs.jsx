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
            {version.nombreCorto}
          </button>
        )
      })}
    </nav>
  )
})

VersionTabs.displayName = 'VersionTabs'

export default VersionTabs


