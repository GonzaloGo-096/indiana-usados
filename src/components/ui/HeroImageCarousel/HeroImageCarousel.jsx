/**
 * HeroImageCarousel - Componente de carrusel de imágenes para Hero
 * 
 * Características:
 * - Máximo 3 imágenes
 * - Navegación con flechas sutiles
 * - Autoplay opcional
 * - Transiciones suaves
 * - Accesibilidad completa
 * 
 * @author Indiana Usados
 * @version 1.0.0
 */

import { useState, useEffect, useCallback } from 'react'
import { ChevronIcon } from '@components/ui/icons'
import styles from './HeroImageCarousel.module.css'

const HeroImageCarousel = ({ 
  images = [], 
  autoplay = true, 
  interval = 5000,
  className = '',
  ...props 
}) => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isHovered, setIsHovered] = useState(false)

  // Validar que tenemos imágenes
  if (!images || images.length === 0) {
    return null
  }

  // Función para ir a la siguiente imagen
  const nextImage = useCallback(() => {
    setCurrentIndex((prevIndex) => 
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    )
  }, [images.length])

  // Función para ir a la imagen anterior
  const prevImage = useCallback(() => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    )
  }, [images.length])

  // Autoplay effect - OPTIMIZADO para performance
  useEffect(() => {
    // Solo autoplay si:
    // 1. Está habilitado
    // 2. Hay más de una imagen
    // 3. No está en hover
    // 4. El usuario no prefiere movimiento reducido
    if (!autoplay || images.length <= 1 || isHovered) return

    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => 
        prevIndex === images.length - 1 ? 0 : prevIndex + 1
      )
    }, interval)
    
    // Cleanup obligatorio para evitar memory leaks
    return () => clearInterval(timer)
  }, [autoplay, interval, images.length, isHovered])

  // Manejar navegación por teclado
  const handleKeyDown = useCallback((e) => {
    if (e.key === 'ArrowLeft') {
      e.preventDefault()
      prevImage()
    } else if (e.key === 'ArrowRight') {
      e.preventDefault()
      nextImage()
    }
  }, [nextImage, prevImage])

  // Solo mostrar flechas si hay más de una imagen
  const showArrows = images.length > 1

  return (
    <div 
      className={`${styles.carousel} ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="region"
      aria-label="Carrusel de imágenes"
      {...props}
    >
      {/* Contenedor de imágenes */}
      <div className={styles.imageContainer}>
        {images.map((image, index) => (
          <img
            key={index}
            src={image.src}
            srcSet={image.srcSet}
            sizes={image.sizes || "(min-width: 768px) 50vw, 100vw"}
            alt={image.alt}
            className={`${styles.image} ${
              index === currentIndex ? styles.active : styles.inactive
            }`}
            decoding="async"
            fetchpriority={index === 0 ? "high" : "low"}
            loading={index === 0 ? "eager" : "lazy"}
          />
        ))}
      </div>

      {/* Flechas de navegación */}
      {showArrows && (
        <>
          <button
            className={`${styles.arrow} ${styles.arrowLeft}`}
            onClick={prevImage}
            aria-label="Imagen anterior"
            type="button"
          >
            <ChevronIcon direction="left" size={24} />
          </button>
          
          <button
            className={`${styles.arrow} ${styles.arrowRight}`}
            onClick={nextImage}
            aria-label="Siguiente imagen"
            type="button"
          >
            <ChevronIcon direction="right" size={24} />
          </button>
        </>
      )}

      {/* Indicadores eliminados por solicitud del usuario */}
    </div>
  )
}

export default HeroImageCarousel
