/**
 * FeaturedVehicles - Sección de preview de vehículos para Home
 * 
 * Características:
 * - Muestra solo 3 vehículos destacados
 * - Cards compactas sin footer
 * - Desktop: 3 cards alineadas
 * - Mobile: Scroll horizontal con 1 card completa + 2 asomando
 * - Botón "Ver todos" centrado
 * - Animación staggered al cargar datos (igual que Hero)
 * 
 * @author Indiana Usados
 * @version 2.1.0 - Animación corregida con delay
 */

import { useMemo, useRef, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useVehiclesList } from '@hooks'
import { CardAutoCompact } from '@vehicles'
import styles from './FeaturedVehicles.module.css'

/**
 * Componente FeaturedVehicles
 */
export const FeaturedVehicles = () => {
    const navigate = useNavigate()
    const cardsContainerRef = useRef(null)
    
    // ✅ Estado para controlar animación (igual que Hero)
    const [isVisible, setIsVisible] = useState(false)
    
    // ✅ Petición de solo 3 vehículos
    const { vehicles, isLoading, isError } = useVehiclesList({}, { pageSize: 3 })
    
    // ✅ Tomar solo los primeros 3
    const featuredVehicles = useMemo(() => {
        return vehicles.slice(0, 3)
    }, [vehicles])
    
    // ✅ Activar animación después de un delay cuando datos cargan (igual que Hero)
    useEffect(() => {
        // Solo activar cuando datos están listos
        if (isLoading || featuredVehicles.length === 0) {
            return
        }
        
        // Pequeño delay para que la animación se note (igual que Hero)
        const timer = setTimeout(() => {
            setIsVisible(true)
        }, 50)
        
        return () => clearTimeout(timer)
    }, [isLoading, featuredVehicles.length])
    
    // ✅ Handler para botón "Ver todos"
    const handleVerTodos = () => {
        navigate('/vehiculos')
    }
    
    // ✅ MOBILE: Centrar segunda card al cargar (solo scroll horizontal, sin afectar página)
    useEffect(() => {
        if (!cardsContainerRef.current || featuredVehicles.length < 3) return
        
        // ✅ Solo ejecutar en mobile (< 992px)
        const isMobile = window.innerWidth < 992
        if (!isMobile) return
        
        // ✅ Centrar segunda card usando scrollLeft (solo afecta scroll horizontal del container)
        const centerMiddleCard = () => {
            const container = cardsContainerRef.current
            if (!container) return
            
            const secondCard = container.children[1]
            if (!secondCard) return
            
            // ✅ Calcular posición para centrar la card horizontalmente
            const scrollPosition = secondCard.offsetLeft - (container.offsetWidth / 2) + (secondCard.offsetWidth / 2)
            container.scrollLeft = scrollPosition
        }
        
        // ✅ Pequeño delay para asegurar que el layout esté completo
        const timer = setTimeout(centerMiddleCard, 150)
        
        return () => clearTimeout(timer)
    }, [featuredVehicles.length])
    
    // ✅ Loading state
    if (isLoading) {
        return (
            <section className={styles.featuredSection}>
                <div className="container">
                    <div className={styles.loadingContainer}>
                        <p>Cargando vehículos destacados...</p>
                    </div>
                </div>
            </section>
        )
    }
    
    // ✅ Error state
    if (isError || !featuredVehicles || featuredVehicles.length === 0) {
        return null // ✅ No mostrar nada si hay error o no hay vehículos
    }
    
    return (
        <section 
            className={`${styles.featuredSection} ${isVisible ? styles.visible : ''}`} 
            aria-label="Vehículos destacados"
        >
            <div className="container">
                {/* Título "Nuestros Usados" */}
                <div className={styles.sectionTitle}>
                    <h2 className={styles.title}>Nuestros Usados</h2>
                </div>
                
                {/* Contenedor de cards con scroll horizontal en mobile */}
                <div className={styles.cardsContainer} ref={cardsContainerRef}>
                    {featuredVehicles.map((vehicle, index) => (
                        <div 
                            key={vehicle.id || vehicle._id} 
                            className={styles.cardWrapper}
                            style={{ '--card-index': index }}
                        >
                            <CardAutoCompact auto={vehicle} />
                        </div>
                    ))}
                </div>
                
                {/* Botón "Ver todos" centrado */}
                <div className={styles.buttonContainer}>
                    <button 
                        onClick={handleVerTodos}
                        className={styles.verTodosButton}
                    >
                        Ver todos
                    </button>
                </div>
            </div>
        </section>
    )
}

export default FeaturedVehicles
