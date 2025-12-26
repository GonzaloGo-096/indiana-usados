/**
 * CeroKilometroDetalle - Página de detalle de auto 0km
 * 
 * Placeholder inicial - Fase 1
 * 
 * @author Indiana Usados
 * @version 1.0.0
 */

import React from 'react'
import { useParams, Link } from 'react-router-dom'
import { SEOHead } from '@components/SEO'
import styles from './CeroKilometroDetalle.module.css'

const CeroKilometroDetalle = () => {
  const { autoSlug } = useParams()

  return (
    <>
      <SEOHead
        title={`Peugeot ${autoSlug?.toUpperCase() || ''} 0KM`}
        description={`Conocé el nuevo Peugeot ${autoSlug}. Especificaciones, colores, versiones y precio.`}
        url={`/0km/${autoSlug}`}
        type="product"
      />
      <div className={styles.container}>
        <Link to="/0km" className={styles.backLink}>← Volver al catálogo</Link>
        
        <h1 className={styles.title}>Peugeot {autoSlug?.toUpperCase()}</h1>
        <p className={styles.subtitle}>Detalle del modelo (Fase 1 - Placeholder)</p>
        
        <div className={styles.info}>
          <p><strong>Slug recibido:</strong> {autoSlug}</p>
          <p>Aquí irá: galería, selector de colores, specs, versiones...</p>
        </div>
      </div>
    </>
  )
}

export default CeroKilometroDetalle

