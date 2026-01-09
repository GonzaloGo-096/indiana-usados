/**
 * SimilarVehiclesCarousel - Carrusel horizontal de vehículos similares
 * 
 * Muestra vehículos de la misma marca en un carrusel horizontal.
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
import { useSimilarVehicles } from '@hooks'
import styles from './SimilarVehiclesCarousel.module.css'

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
export const SimilarVehiclesCarousel = ({ currentVehicle }) => {
  const { vehicles, isLoading, isError } = useSimilarVehicles(currentVehicle)

  // ✅ No mostrar si no hay vehículos similares
  const shouldShow = useMemo(() => {
    if (isLoading) return true // Mostrar skeleton mientras carga
    return vehicles && vehicles.length > 0
  }, [vehicles, isLoading])

  if (!shouldShow && !isLoading) {
    return null
  }

  return (
    <section className={styles.section} data-testid="similar-vehicles-carousel">
      <div className={styles.container}>
        {/* Título de la sección */}
        <div className={styles.header}>
          <h2 className={styles.title}>
            Más vehículos {currentVehicle?.marca || ''}
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
                <p>No se pudieron cargar los vehículos similares</p>
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

export default SimilarVehiclesCarousel
