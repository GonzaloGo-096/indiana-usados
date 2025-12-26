/**
 * ModelCard - Card de modelo 0km con imagen y título
 * 
 * Diseño: Card con imagen del modelo, hover sutil
 * Mobile-first, fondo blanco, borde sutil
 * 
 * @author Indiana Usados
 * @version 1.1.0 - Cards más grandes, hover simplificado
 */

import React, { memo } from 'react'
import { Link } from 'react-router-dom'
import styles from './ModelCard.module.css'

/**
 * Componente ModelCard
 * @param {Object} props - Propiedades del componente
 * @param {string} props.src - URL de la imagen
 * @param {string} props.alt - Texto alternativo
 * @param {string} props.titulo - Nombre del modelo
 * @param {string} props.slug - Slug para la URL (ej: "208", "2008")
 */
export const ModelCard = memo(({
  src,
  alt,
  titulo,
  slug
}) => {
  return (
    <Link to={`/0km/${slug}`} className={styles.card}>
      <div className={styles.imageContainer}>
        <img
          src={src}
          alt={alt}
          className={styles.image}
          loading="lazy"
          decoding="async"
        />
      </div>
      
      <div className={styles.content}>
        <h3 className={styles.title}>{titulo}</h3>
      </div>
    </Link>
  )
})

ModelCard.displayName = 'ModelCard'

export default ModelCard
