/**
 * BrandsCarousel - Carrusel de logos de marcas con navegación manual
 * 
 * Muestra las marcas disponibles en un carrusel horizontal
 * con flechas de navegación y logos seleccionables.
 * 
 * @author Indiana Usados
 * @version 1.1.0
 */

import React, { useRef, useState, useEffect } from 'react'
import { BRAND_LOGOS } from '@config/brandLogos'
import { ChevronIcon } from '@components/ui/icons'
import styles from './BrandsCarousel.module.css'

const BrandsCarousel = ({ onBrandSelect }) => {
  // Obtener solo las marcas que tienen logos reales (no el logo genérico)
  const brands = Object.values(BRAND_LOGOS).filter(
    brand => !brand.src.includes('logo-negro.webp')
  )

  const scrollContainerRef = useRef(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)

  // Verificar si se puede scrollear
  const checkScrollability = () => {
    if (!scrollContainerRef.current) return
    
    const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current
    setCanScrollLeft(scrollLeft > 0)
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10) // 10px de tolerancia
  }

  useEffect(() => {
    checkScrollability()
    const container = scrollContainerRef.current
    if (container) {
      container.addEventListener('scroll', checkScrollability)
      window.addEventListener('resize', checkScrollability)
      return () => {
        container.removeEventListener('scroll', checkScrollability)
        window.removeEventListener('resize', checkScrollability)
      }
    }
  }, [])

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: -300,
        behavior: 'smooth'
      })
    }
  }

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: 300,
        behavior: 'smooth'
      })
    }
  }

  const handleBrandClick = (brand) => {
    if (onBrandSelect) {
      onBrandSelect(brand)
    }
  }

  return (
    <div className={styles.carouselContainer}>
      {/* Flecha izquierda */}
      {canScrollLeft && (
        <button 
          className={styles.arrowButton}
          onClick={scrollLeft}
          aria-label="Marca anterior"
        >
          <ChevronIcon direction="left" />
        </button>
      )}

      {/* Contenedor de logos con scroll */}
      <div 
        ref={scrollContainerRef}
        className={styles.carouselTrack}
      >
        {brands.map((brand, index) => {
          // Obtener el nombre de la marca desde el alt text
          const brandName = brand.alt.replace('Logo ', '')
          return (
            <div 
              key={index} 
              className={styles.brandItem}
              onClick={() => handleBrandClick(brand)}
            >
              <img
                src={brand.src}
                alt={brand.alt}
                className={styles.brandLogo}
                loading="lazy"
              />
            </div>
          )
        })}
      </div>

      {/* Flecha derecha */}
      {canScrollRight && (
        <button 
          className={`${styles.arrowButton} ${styles.arrowRight}`}
          onClick={scrollRight}
          aria-label="Marca siguiente"
        >
          <ChevronIcon direction="right" />
        </button>
      )}
    </div>
  )
}

export default BrandsCarousel
