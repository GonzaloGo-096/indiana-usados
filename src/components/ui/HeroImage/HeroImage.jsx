/**
 * HeroImage - Componente optimizado para LCP
 * 
 * LCP Phase 1: Reemplazo de carrusel por imagen fija
 * - Sin JavaScript innecesario
 * - Preload en <head>
 * - srcSet y sizes correctos
 * - fetchpriority="high" y loading="eager"
 * 
 * Soporta imágenes responsivas con srcMobile y srcDesktop
 * 
 * @author Indiana Usados
 * @version 1.1.0 - Soporte para imágenes responsivas
 */

import { memo } from 'react'
import styles from './HeroImage.module.css'

const HeroImage = memo(({ 
  src, 
  srcSet, 
  sizes, 
  alt,
  srcMobile,
  srcDesktop,
  className = ''
}) => {
  // Si se proporcionan srcMobile y srcDesktop, usar elemento <picture> para imágenes responsivas
  if (srcMobile && srcDesktop) {
    return (
      <div className={`${styles.heroImageContainer} ${className}`}>
        <picture>
          <source media="(min-width: 768px)" srcSet={srcDesktop} />
          <img
            src={srcMobile}
            alt={alt}
            className={styles.heroImage}
            loading="eager"
            fetchpriority="high"
            decoding="async"
            width="1200"
            height="400"
          />
        </picture>
      </div>
    )
  }

  // Comportamiento original con src y srcSet
  return (
    <div className={`${styles.heroImageContainer} ${className}`}>
      <img
        src={src}
        srcSet={srcSet}
        sizes={sizes}
        alt={alt}
        className={styles.heroImage}
        loading="eager"
        fetchpriority="high"
        decoding="async"
        width="1200"
        height="400"
      />
    </div>
  )
})

HeroImage.displayName = 'HeroImage'

export default HeroImage






