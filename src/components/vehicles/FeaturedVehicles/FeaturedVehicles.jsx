/**
 * FeaturedVehicles - Sección de preview de vehículos para Home
 * 
 * Características:
 * - Muestra solo 3 vehículos destacados
 * - Cards compactas sin footer
 * - Desktop: 3 cards alineadas
 * - Mobile: Scroll horizontal con 1 card completa + 2 asomando
 * - Botón "Ver todos" centrado
 * - Skeleton loading profesional
 * - Animación staggered al cargar
 * 
 * @author Indiana Usados
 * @version 4.0.0 - Skeleton loading + animación profesional
 */

import { useMemo, useRef, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useVehiclesList } from '@hooks'
import { CardAutoCompact } from '@vehicles'
import { CardAutoSkeleton } from '@components/skeletons'
import styles from './FeaturedVehicles.module.css'

/**
 * Componente FeaturedVehicles
 */
export const FeaturedVehicles = () => {
    const navigate = useNavigate()
    const cardsContainerRef = useRef(null)
    
    // ✅ Estado para controlar animación
    const [isVisible, setIsVisible] = useState(false)
    
    // ✅ Petición de solo 3 vehículos
    const { vehicles, isLoading, isError } = useVehiclesList({}, { pageSize: 3 })
    
    // ✅ Tomar solo los primeros 3
    const featuredVehicles = useMemo(() => {
        return vehicles.slice(0, 3)
    }, [vehicles])
    
    // ✅ Determinar si hay contenido para mostrar
    const hasContent = !isLoading && featuredVehicles.length > 0
    
    // ✅ Activar animación después de que el contenido esté listo
    useEffect(() => {
        if (!hasContent) {
            setIsVisible(false)
            return
        }
        
        // requestAnimationFrame + delay para asegurar render completo
        const raf = requestAnimationFrame(() => {
            const timer = setTimeout(() => {
                setIsVisible(true)
            }, 50)
            
            return () => clearTimeout(timer)
        })
        
        return () => cancelAnimationFrame(raf)
    }, [hasContent])
    
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
                {/* Título - siempre visible */}
                <div className={styles.sectionTitle}>
                    <h2 className={styles.title}>Nuestros Usados</h2>
                </div>
                
                {/* Cards Container */}
                <div className={styles.cardsContainer} ref={cardsContainerRef}>
                    {isLoading ? (
                        // ✅ Skeleton loading - 3 cards
                        <>
                            <div className={styles.cardWrapper}>
                                <CardAutoSkeleton />
                            </div>
                            <div className={styles.cardWrapper}>
                                <CardAutoSkeleton />
                            </div>
                            <div className={styles.cardWrapper}>
                                <CardAutoSkeleton />
                            </div>
                        </>
                    ) : (
                        // ✅ Cards reales con animación
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
                
                {/* Botón "Ver todos" */}
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
