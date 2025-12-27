/**
 * ModeloSpecs - Especificaciones técnicas del modelo
 * 
 * Muestra specs en formato tabla/lista.
 * Componente presentacional.
 * 
 * @author Indiana Usados
 * @version 1.0.0
 */

import React, { memo } from 'react'
import styles from './ModeloSpecs.module.css'

// Labels para las specs (evitar strings mágicos en UI)
const SPEC_LABELS = {
  motor: 'Motor',
  transmision: 'Transmisión',
  traccion: 'Tracción',
  combustible: 'Combustible',
  consumo: 'Consumo',
  potencia: 'Potencia',
  torque: 'Torque'
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
    <dl className={`${styles.container} ${styles[variant]}`}>
      {specEntries.map(([key, value]) => (
        <div key={key} className={styles.item}>
          <dt className={styles.label}>{SPEC_LABELS[key]}</dt>
          <dd className={styles.value}>{value}</dd>
        </div>
      ))}
    </dl>
  )
})

ModeloSpecs.displayName = 'ModeloSpecs'

export default ModeloSpecs


