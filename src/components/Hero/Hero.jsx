/**
 * Hero - Componente principal del Home
 * 
 * Hero moderno con imagen de fondo, overlay y CTAs
 * Diseño minimalista y premium para Indiana Usados
 * 
 * @author Indiana Usados
 * @version 1.0.0
 */

import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import styles from './Hero.module.css'
import heroMobile from '../../assets/home/indiana-hero-1-mobile.webp'
import heroDesktop from '../../assets/home/indiana-hero-1-desktop.webp'

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
        <source media="(min-width: 768px)" srcSet={heroDesktop} />
        <img 
          src={heroMobile} 
          alt="Vehículos de calidad en Indiana Usados"
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
          <a 
            href="https://peugeotindiana.com.ar/" 
            target="_blank" 
            rel="noopener noreferrer"
            className={`${styles.cta} ${styles.ctaPrimary}`}
          >
            Peugeot <span className={styles.ctaDivider}>|</span> 0 KM
          </a>
          <Link to="/vehiculos" className={`${styles.cta} ${styles.ctaSecondary}`}>
            Usados <span className={styles.ctaDivider}>|</span> Multimarca
          </Link>
        </div>
      </div>
    </section>
  )
}

export default Hero


