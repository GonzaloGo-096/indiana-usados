/**
 * PriceRangeCarousel - Carrusel horizontal de vehículos en rango de precio similar
 * 
 * Muestra vehículos con precio similar (±2 millones) en un carrusel horizontal.
 * Diseñado mobile-first para excelente UX en dispositivos móviles.
 * 
 * Características:
 * - Scroll horizontal suave con snap points
 * - Cards más pequeñas adaptadas del diseño existente
 * - Mobile-first responsive design
 * - Skeleton loading states
 * - Manejo de estados vacíos
 * 
 * @author Indiana Usados
 * @version 1.0.0
 */

import React, { useMemo, useRef, useCallback, useState, useEffect } from 'react'
import { CardSimilar } from '@vehicles'
import { usePriceRangeVehicles } from '@hooks'
import { ChevronIcon } from '@components/ui/icons'
import styles from './PriceRangeCarousel.module.css'

/**
 * Skeleton card para loading state
 */
const SkeletonCard = () => (
  <div className={styles.skeletonCard}>
    <div className={styles.skeletonImage} />
    <div className={styles.skeletonContent}>
      <div className={styles.skeletonText} style={{ width: '60%' }} />
      <div className={styles.skeletonText} style={{ width: '80%' }} />
      <div className={styles.skeletonText} style={{ width: '50%' }} />
    </div>
  </div>
)

/**
 * Componente principal del carrusel
 */
export const PriceRangeCarousel = ({ currentVehicle }) => {
  const { vehicles, priceRange, isLoading, isError } = usePriceRangeVehicles(currentVehicle)
  const carouselRef = useRef(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(false) // ✅ Inicializar en false, se actualizará al cargar

  // ✅ Función para actualizar el estado de las flechas
  const updateArrowVisibility = useCallback(() => {
    if (!carouselRef.current) return
    
    const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current
    
    // Verificar si hay scroll disponible (con tolerancia de 5px para evitar problemas de redondeo)
    const hasScroll = scrollWidth > clientWidth + 5
    
    if (!hasScroll) {
      // No hay scroll disponible, ocultar ambas flechas
      setCanScrollLeft(false)
      setCanScrollRight(false)
      return
    }
    
    // Hay scroll disponible, verificar posición
    const isAtStart = scrollLeft <= 5 // Tolerancia de 5px
    const isAtEnd = Math.abs(scrollLeft + clientWidth - scrollWidth) <= 5 // Tolerancia de 5px
    
    setCanScrollLeft(!isAtStart)
    setCanScrollRight(!isAtEnd)
  }, [])

  // ✅ Efecto para actualizar visibilidad al cargar y al cambiar vehículos
  useEffect(() => {
    if (!isLoading && vehicles && vehicles.length > 0) {
      // Múltiples intentos para asegurar que el DOM esté renderizado
      const timer1 = setTimeout(() => {
        updateArrowVisibility()
      }, 100)
      const timer2 = setTimeout(() => {
        updateArrowVisibility()
      }, 300)
      const timer3 = setTimeout(() => {
        updateArrowVisibility()
      }, 500)
      return () => {
        clearTimeout(timer1)
        clearTimeout(timer2)
        clearTimeout(timer3)
      }
    }
  }, [isLoading, vehicles, updateArrowVisibility])

  // ✅ Listener de scroll para actualizar flechas
  useEffect(() => {
    const carousel = carouselRef.current
    if (!carousel) return

    carousel.addEventListener('scroll', updateArrowVisibility)
    // También actualizar al redimensionar
    window.addEventListener('resize', updateArrowVisibility)

    return () => {
      carousel.removeEventListener('scroll', updateArrowVisibility)
      window.removeEventListener('resize', updateArrowVisibility)
    }
  }, [updateArrowVisibility])

  // ✅ Funciones de scroll
  const scrollLeft = useCallback(() => {
    if (carouselRef.current) {
      const cardWidth = carouselRef.current.querySelector(`.${styles.cardWrapper}`)?.offsetWidth || 320
      // Calcular gap desde el estilo computado
      const computedStyle = window.getComputedStyle(carouselRef.current)
      const gap = parseFloat(computedStyle.gap) || 24
      carouselRef.current.scrollBy({
        left: -(cardWidth + gap),
        behavior: 'smooth'
      })
    }
  }, [])

  const scrollRight = useCallback(() => {
    if (carouselRef.current) {
      const cardWidth = carouselRef.current.querySelector(`.${styles.cardWrapper}`)?.offsetWidth || 320
      // Calcular gap desde el estilo computado
      const computedStyle = window.getComputedStyle(carouselRef.current)
      const gap = parseFloat(computedStyle.gap) || 24
      carouselRef.current.scrollBy({
        left: cardWidth + gap,
        behavior: 'smooth'
      })
    }
  }, [])

  // ✅ No mostrar si no hay vehículos en el rango de precio
  const shouldShow = useMemo(() => {
    if (isLoading) return true // Mostrar skeleton mientras carga
    return vehicles && vehicles.length > 0
  }, [vehicles, isLoading])

  if (!shouldShow && !isLoading) {
    return null
  }

  return (
    <section className={styles.section} data-testid="price-range-carousel">
      <div className={styles.container}>
        {/* Título de la sección */}
        <div className={styles.header}>
          <h2 className={styles.title}>
            Precio similar
          </h2>
        </div>

        {/* Carrusel horizontal */}
        <div className={styles.carouselWrapper}>
          {/* Flecha izquierda - Solo desktop y solo si se puede desplazar a la izquierda */}
          <button
            className={`${styles.arrowButton} ${!canScrollLeft ? styles.arrowButtonHidden : ''}`}
            onClick={scrollLeft}
            aria-label="Desplazar hacia la izquierda"
            type="button"
          >
            <ChevronIcon direction="left" size={24} />
          </button>
          
          <div ref={carouselRef} className={styles.carouselContainer}>
            {isLoading ? (
              // Skeleton loading
              <>
                {[...Array(3)].map((_, index) => (
                  <SkeletonCard key={`skeleton-${index}`} />
                ))}
              </>
            ) : isError ? (
              // Error state
              <div className={styles.errorState}>
                <p>No se pudieron cargar los vehículos</p>
              </div>
            ) : (
              // Cards de vehículos
              vehicles.map((vehicle) => (
                <div key={vehicle.id || vehicle._id} className={styles.cardWrapper}>
                  <CardSimilar auto={vehicle} />
                </div>
              ))
            )}
          </div>
          
          {/* Flecha derecha - Solo desktop y solo si se puede desplazar a la derecha */}
          <button
            className={`${styles.arrowButton} ${styles.arrowButtonRight} ${!canScrollRight ? styles.arrowButtonHidden : ''}`}
            onClick={scrollRight}
            aria-label="Desplazar hacia la derecha"
            type="button"
          >
            <ChevronIcon direction="right" size={24} />
          </button>
        </div>
      </div>
    </section>
  )
}

export default PriceRangeCarousel
