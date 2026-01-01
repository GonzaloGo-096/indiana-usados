/**
 * FeatureSection - Sección de características destacadas
 * 
 * Mobile-first:
 * - Mobile: altura automática, sin centrado vertical
 * - Desktop: altura escénica con contenido centrado
 * 
 * @author Indiana Usados
 * @version 1.1.0 - Agregado botón 3D para 208 en mobile
 */

import React, { useState, useEffect, memo } from 'react'
import styles from './FeatureSection.module.css'

/**
 * @param {Object} props
 * @param {Object} props.feature - Objeto con datos de la feature
 * @param {string} props.feature.title - Título de la característica
 * @param {string} props.feature.description - Descripción
 * @param {Object} props.feature.images - { mobile, desktop } con URLs completas optimizadas
 * @param {boolean} props.reverse - Invertir orden imagen/texto en desktop
 * @param {string} props.modeloNombre - Nombre del modelo (ej: '208')
 */
export const FeatureSection = memo(({
  feature,
  reverse = false,
  modeloNombre = ''
}) => {
  const [isMobile, setIsMobile] = useState(() => {
    if (typeof window === 'undefined') return true
    return window.matchMedia('(max-width: 767px)').matches
  })

  useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 767px)')
    
    const handleChange = (e) => {
      setIsMobile(e.matches)
    }

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange)
    } else {
      mediaQuery.addListener(handleChange)
    }

    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener('change', handleChange)
      } else {
        mediaQuery.removeListener(handleChange)
      }
    }
  }, [])

  if (!feature) return null

  const { title, description, images, items } = feature

  // Verificar si es la sección de Realidad Aumentada del 208 o 2008 en mobile
  const isRealidadAumentada = isMobile && (modeloNombre === '208' || modeloNombre === '2008') && title === 'REALIDAD AUMENTADA 3D'

  return (
    <section className={`${styles.section} ${reverse ? styles.reverse : ''}`}>
      <div className={styles.container}>
        {/* Imagen - URLs directas optimizadas (mobile y desktop separados) */}
        {(images?.mobile || images?.desktop) && (
          <div className={styles.imageWrapper}>
            {images?.mobile && (
              <img
                src={images.mobile}
                alt={title}
                className={`${styles.image} ${styles.imageMobile}`}
                loading="lazy"
                decoding="async"
              />
            )}
            {images?.desktop && (
              <img
                src={images.desktop}
                alt={title}
                className={`${styles.image} ${styles.imageDesktop}`}
                loading="lazy"
                decoding="async"
              />
            )}
          </div>
        )}

        {/* Contenido */}
        <div className={styles.content}>
          <h2 className={styles.title}>
            {title === 'REALIDAD AUMENTADA 3D' ? (
              <>
                REALIDAD AUMENTADA <span className={styles.titleDivider}>|</span> 3D
              </>
            ) : (
              title
            )}
          </h2>
          
          {isRealidadAumentada ? (
            <>
              <h3 className={styles.threeDTitle}>CONOCÉ EL {modeloNombre} EN 3D</h3>
              <p className={styles.threeDDescription}>
                Una experiencia inmersiva en 3D y realidad aumentada para ver el auto desde todos los ángulos.
              </p>
              <a
                href={`https://mtr.center/stellantis-argentina/peugeot-${modeloNombre.toLowerCase()}/`}
                className={styles.threeDButton}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Explorar el ${modeloNombre} en 3D y realidad aumentada`}
              >
                <svg 
                  width="20" 
                  height="20" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2"
                  className={styles.threeDIcon}
                >
                  <path d="M12 2L2 7l10 5 10-5-10-5z" />
                  <path d="M2 17l10 5 10-5" />
                  <path d="M2 12l10 5 10-5" />
                </svg>
                <span>Explorar en 3D</span>
              </a>
            </>
          ) : (
            <>
              {description && <p className={styles.description}>{description}</p>}
              {items && items.length > 0 && (
                <ul className={styles.itemsList}>
                  {items.map((item, index) => (
                    <li key={index} className={styles.item}>{item}</li>
                  ))}
                </ul>
              )}
            </>
          )}
        </div>
      </div>
    </section>
  )
})

FeatureSection.displayName = 'FeatureSection'

export default FeatureSection

