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

import React, { useMemo } from 'react'
import { CardSimilar } from '@vehicles'
import { usePriceRangeVehicles } from '@hooks'
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
          <div className={styles.carouselContainer}>
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
        </div>
      </div>
    </section>
  )
}

export default PriceRangeCarousel
