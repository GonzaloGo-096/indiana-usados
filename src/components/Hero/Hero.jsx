/**
 * Hero - Componente principal del Home
 * 
 * Hero moderno con imagen de fondo, overlay y CTAs
 * Diseño minimalista y premium para Indiana Usados
 * 
 * @author Indiana Usados
 * @version 2.0.0 - Migración a Cloudinary
 */

import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import styles from './Hero.module.css'
import { staticImages } from '@config/cloudinaryStaticImages'

const Hero = () => {
  const [isVisible, setIsVisible] = useState(false)

  // Fade-in al cargar
  useEffect(() => {
    // Pequeño delay para que la animación se note
    const timer = setTimeout(() => {
      setIsVisible(true)
    }, 100)
    return () => clearTimeout(timer)
  }, [])

  return (
    <section 
      className={`${styles.hero} ${isVisible ? styles.visible : ''}`}
      aria-label="Sección principal"
    >
      {/* Imagen de fondo responsive con <picture> */}
      <picture className={styles.backgroundPicture}>
        <source media="(min-width: 768px)" srcSet={staticImages.home.heroDesktop.src} />
        <img 
          src={staticImages.home.heroMobile.src} 
          alt={staticImages.home.heroMobile.alt}
          className={styles.backgroundImage}
          loading="eager"
          fetchpriority="high"
        />
      </picture>
      
      {/* Overlay oscuro */}
      <div className={styles.overlay} />
      
      {/* Contenido */}
      <div className={styles.content}>
        <h1 className={styles.title}>
          Vehículos seleccionados para cada necesidad
        </h1>
        
        <p className={styles.subtitle}>
          Financiación a medida y asesoramiento profesional
        </p>
        
        <div className={styles.ctaContainer}>
          <Link to="/0km" className={`${styles.cta} ${styles.ctaPrimary}`}>
            Peugeot <span className={styles.ctaDivider}>|</span> 0 KM
          </Link>
          <Link to="/vehiculos" className={`${styles.cta} ${styles.ctaSecondary}`}>
            Usados <span className={styles.ctaDivider}>|</span> Multimarca
          </Link>
        </div>
      </div>
    </section>
  )
}

export default Hero
