/**
 * ModeloSpecs - Especificaciones técnicas del modelo
 * 
 * Grid con íconos centrados y valores debajo.
 * Distribución uniforme del espacio.
 * 
 * @author Indiana Usados
 * @version 2.0.0
 */

import React, { memo } from 'react'
import { SPEC_ICONS } from '@components/ui/icons/specs'
import styles from './ModeloSpecs.module.css'

// Labels para las specs
const SPEC_LABELS = {
  llantas: 'Llantas',
  faros: 'Faros',
  motor: 'Motor',
  caja: 'Caja',
  sensores: 'Sensores',
  acceso: 'Acceso',
  airbags: 'Airbags'
}

/**
 * @param {Object} props
 * @param {Object} props.specs - Objeto con especificaciones
 * @param {string} props.variant - Variante: 'compact' | 'full'
 */
export const ModeloSpecs = memo(({
  specs = {},
  variant = 'compact'
}) => {
  const specEntries = Object.entries(specs).filter(([key]) => SPEC_LABELS[key])
  
  if (!specEntries.length) return null

  return (
    <div className={styles.wrapper}>
      <dl className={`${styles.container} ${styles[variant]}`}>
        {specEntries.map(([key, value]) => {
          const Icon = SPEC_ICONS[key]
          
          return (
            <div key={key} className={styles.item}>
              {Icon && (
                <div className={styles.iconWrapper}>
                  <Icon className={styles.icon} />
                </div>
              )}
              <div className={styles.content}>
                <dt className={styles.label}>{SPEC_LABELS[key]}</dt>
                <dd className={styles.value}>{value}</dd>
              </div>
            </div>
          )
        })}
      </dl>
    </div>
  )
})

ModeloSpecs.displayName = 'ModeloSpecs'

export default ModeloSpecs
