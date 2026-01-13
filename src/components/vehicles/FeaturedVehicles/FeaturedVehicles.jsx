/**
 * FeaturedVehicles - Sección de preview de vehículos para Home
 * 
 * Características:
 * - Muestra solo 3 vehículos destacados
 * - Usa CardSimilar (misma card que similares)
 * - Desktop: 3 cards alineadas
 * - Mobile: Scroll horizontal con 1 card completa + 2 asomando
 * - Botón "Ver todos" centrado
 * - Skeleton loading profesional (visible inmediatamente)
 * - Animación staggered solo para cards reales
 * 
 * @author Indiana Usados
 * @version 5.0.0 - Migrado a CardSimilar (misma card que similares)
 */

import { useMemo, useRef, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useVehiclesList } from '@hooks'
import { CardSimilar } from '@vehicles'
import styles from './FeaturedVehicles.module.css'

/**
 * Skeleton card para loading state (similar a SimilarVehiclesCarousel)
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
 * Componente FeaturedVehicles
 */
export const FeaturedVehicles = () => {
    const navigate = useNavigate()
    const cardsContainerRef = useRef(null)
    
    // ✅ FASE 1: Estado para animación de cards reales (desacoplado de isLoading)
    const [isVisible, setIsVisible] = useState(false)
    
    // ✅ Petición de solo 3 vehículos
    const { vehicles, isLoading, isError } = useVehiclesList({}, { pageSize: 3 })
    
    // ✅ Tomar solo los primeros 3
    const featuredVehicles = useMemo(() => {
        return vehicles.slice(0, 3)
    }, [vehicles])
    
    // ✅ FASE 1: Activar animación solo cuando las cards reales están listas
    // Desacoplado del skeleton - el skeleton se muestra inmediatamente
    useEffect(() => {
        // Solo activar cuando hay datos reales (no durante loading)
        if (isLoading || featuredVehicles.length === 0) {
            return
        }
        
        // requestAnimationFrame + delay para asegurar render completo de cards
        const raf = requestAnimationFrame(() => {
            const timer = setTimeout(() => {
                setIsVisible(true)
            }, 50)
            
            return () => clearTimeout(timer)
        })
        
        return () => cancelAnimationFrame(raf)
    }, [isLoading, featuredVehicles.length])
    
    // ✅ Handler para botón "Ver todos"
    const handleVerTodos = () => {
        navigate('/usados')
    }
    
    // ✅ MOBILE: Centrar segunda card al cargar
    useEffect(() => {
        if (!cardsContainerRef.current || featuredVehicles.length < 3 || !isVisible) return
        
        const isMobile = window.innerWidth < 992
        if (!isMobile) return
        
        const centerMiddleCard = () => {
            const container = cardsContainerRef.current
            if (!container) return
            
            const secondCard = container.children[1]
            if (!secondCard) return
            
            const scrollPosition = secondCard.offsetLeft - (container.offsetWidth / 2) + (secondCard.offsetWidth / 2)
            container.scrollLeft = scrollPosition
        }
        
        const timer = setTimeout(centerMiddleCard, 200)
        return () => clearTimeout(timer)
    }, [featuredVehicles.length, isVisible])
    
    // ✅ Error state
    if (isError) {
        return null
    }
    
    return (
        <section 
            className={`${styles.featuredSection} ${isVisible ? styles.visible : ''}`} 
            aria-label="Vehículos destacados"
        >
            <div className="container">
                {/* ✅ FASE 1: Título siempre visible (sin depender de isVisible) */}
                <div className={styles.sectionTitle}>
                    <h2 className={styles.title}>Nuestros Usados</h2>
                </div>
                
                {/* Cards Container */}
                <div className={styles.cardsContainer} ref={cardsContainerRef}>
                    {isLoading ? (
                        // ✅ Skeleton con dimensiones IDÉNTICAS a card real (CLS = 0)
                        <>
                            <div className={styles.skeletonWrapper}>
                                <SkeletonCard />
                            </div>
                            <div className={styles.skeletonWrapper}>
                                <SkeletonCard />
                            </div>
                            <div className={styles.skeletonWrapper}>
                                <SkeletonCard />
                            </div>
                        </>
                    ) : (
                        // ✅ Cards reales con animación staggered (usa cardWrapper)
                        featuredVehicles.map((vehicle, index) => (
                            <div 
                                key={vehicle.id || vehicle._id} 
                                className={styles.cardWrapper}
                                style={{ '--card-index': index }}
                            >
                                <CardSimilar auto={vehicle} />
                            </div>
                        ))
                    )}
                </div>
                
                {/* ✅ FASE 1: Botón siempre visible (sin depender de isVisible) */}
                <div className={styles.buttonContainer}>
                    <button 
                        onClick={handleVerTodos}
                        className={styles.verTodosButton}
                        disabled={isLoading}
                    >
                        Ver todos
                    </button>
                </div>
            </div>
        </section>
    )
}

export default FeaturedVehicles
