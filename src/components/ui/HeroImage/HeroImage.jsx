/**
 * HeroImage - Componente optimizado para LCP
 * 
 * LCP Phase 1: Reemplazo de carrusel por imagen fija
 * - Sin JavaScript innecesario
 * - Preload en <head>
 * - srcSet y sizes correctos
 * - fetchpriority="high" y loading="eager"
 * 
 * @author Indiana Usados
 * @version 1.0.0 - LCP Phase 1
 */

import { memo } from 'react'
import styles from './HeroImage.module.css'

const HeroImage = memo(({ 
  src, 
  srcSet, 
  sizes, 
  alt,
  className = ''
}) => {
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
        width="1920"
        height="1080"
      />
    </div>
  )
})

HeroImage.displayName = 'HeroImage'

export default HeroImage





