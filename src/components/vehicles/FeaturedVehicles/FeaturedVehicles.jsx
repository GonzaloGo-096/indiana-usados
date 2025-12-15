/**
 * FeaturedVehicles - Sección de preview de vehículos para Home
 * 
 * Características:
 * - Muestra solo 3 vehículos destacados
 * - Cards compactas sin footer
 * - Desktop: 3 cards alineadas
 * - Mobile: Scroll horizontal con 1 card completa + 2 asomando
 * - Botón "Ver todos" centrado
 * - Skeleton loading profesional (visible inmediatamente)
 * - Animación staggered solo para cards reales
 * 
 * @author Indiana Usados
 * @version 4.2.0 - FASE 2: CLS = 0, skeleton con dimensiones idénticas a card real
 */

import { useMemo, useRef, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useVehiclesList } from '@hooks'
import { CardAutoCompact } from '@vehicles'
import { CardAutoCompactSkeleton } from '@components/skeletons'
import styles from './FeaturedVehicles.module.css'

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
        navigate('/vehiculos')
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
                        // ✅ FASE 2: Skeleton con dimensiones IDÉNTICAS a card real (CLS = 0)
                        <>
                            <div className={styles.skeletonWrapper}>
                                <CardAutoCompactSkeleton />
                            </div>
                            <div className={styles.skeletonWrapper}>
                                <CardAutoCompactSkeleton />
                            </div>
                            <div className={styles.skeletonWrapper}>
                                <CardAutoCompactSkeleton />
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
                                <CardAutoCompact auto={vehicle} />
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
