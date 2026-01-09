/**
 * DimensionsSection - Sección de dimensiones (imagen fija)
 * 
 * Sección simple que muestra una imagen de dimensiones.
 * Aparece en todos los modelos 0km.
 * 
 * @author Indiana Usados
 * @version 1.0.0
 */

import React, { memo } from 'react'
import styles from './DimensionsSection.module.css'

export const DimensionsSection = memo(() => {
  // URLs directas - mantener publicIds tal cual (pueden incluir .webp en el nombre)
  const mobileUrl = 'https://res.cloudinary.com/drbeomhcu/image/upload/v1767202547/DIMENSIONES1dk2_gjbvwq.webp'
  const desktopUrl = 'https://res.cloudinary.com/drbeomhcu/image/upload/DIMENSIONES1dk2_ow36om.webp'

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <h2 className={styles.title}>Dimensiones</h2>
        <img
          src={mobileUrl}
          alt="Dimensiones del vehículo"
          className={`${styles.image} ${styles.imageMobile}`}
          loading="lazy"
          decoding="async"
        />
        <img
          src={desktopUrl}
          alt="Dimensiones del vehículo"
          className={`${styles.image} ${styles.imageDesktop}`}
          loading="lazy"
          decoding="async"
        />
      </div>
    </section>
  )
})

DimensionsSection.displayName = 'DimensionsSection'

export default DimensionsSection

