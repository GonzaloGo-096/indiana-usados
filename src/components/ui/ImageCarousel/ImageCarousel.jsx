/**
 * ImageCarousel - Componente de carrusel de imágenes
 * 
 * Funcionalidades:
 * - Mostrar imagen principal grande
 * - Miniaturas navegables abajo
 * - Navegación por swipe/touch
 * - Lazy loading de imágenes
 * - Responsive design
 * 
 * @author Indiana Usados
 * @version 1.1.0 - Sin indicadores visuales de navegación
 */

import React, { useState, useCallback, useMemo, useEffect, useRef } from 'react'
import { defaultCarImage } from '@assets'
import CloudinaryImage from '@/components/ui/CloudinaryImage/CloudinaryImage'
import { IMAGE_SIZES, IMAGE_WIDTHS } from '@constants/imageSizes'

import styles from './ImageCarousel.module.css'

/**
 * Componente ImageCarousel
 */
export const ImageCarousel = ({ 
    images = [],
    altText = 'Imagen del vehículo',
    showArrows = true,
    showIndicators = true,
    autoPlay = false,
    autoPlayInterval = 5000,
    onMainImageClick
}) => {
    const [currentIndex, setCurrentIndex] = useState(0)
    const thumbnailRefs = useRef([])
    const thumbnailsContainerRef = useRef(null) // ✅ Ref para el contenedor de miniaturas
    const touchStartX = useRef(0) // ✅ Para detectar swipe
    const touchEndX = useRef(0) // ✅ Para detectar swipe
    const mainImageContainerRef = useRef(null) // ✅ Ref para el contenedor de imagen principal

    // Si no hay imágenes, usar imagen por defecto
    const allImages = useMemo(() => {
        if (!images || images.length === 0) return [defaultCarImage]
        return images
    }, [images])

    // ===== Navegación =====
    const goToPrevious = useCallback(() => {
        setCurrentIndex((prevIndex) => prevIndex === 0 ? allImages.length - 1 : prevIndex - 1)
    }, [allImages.length])

    const goToNext = useCallback(() => {
        setCurrentIndex((prevIndex) => prevIndex === allImages.length - 1 ? 0 : prevIndex + 1)
    }, [allImages.length])

    const goToImage = useCallback((index) => {
        setCurrentIndex(index)
    }, [])

    // ✅ Handlers para swipe/touch estándar (solo detección, sin seguimiento visual)
    const handleTouchStart = useCallback((e) => {
        touchStartX.current = e.touches[0].clientX
    }, [])

    const handleTouchMove = useCallback((e) => {
        touchEndX.current = e.touches[0].clientX
    }, [])

    const handleTouchEnd = useCallback(() => {
        if (!touchStartX.current || !touchEndX.current) return
        
        const distance = touchStartX.current - touchEndX.current
        const minSwipeDistance = 50 // ✅ Distancia mínima para considerar swipe
        
        if (Math.abs(distance) > minSwipeDistance) {
            if (distance > 0) {
                // Swipe izquierda -> siguiente imagen
                goToNext()
            } else {
                // Swipe derecha -> imagen anterior
                goToPrevious()
            }
        }
        
        // Reset
        touchStartX.current = 0
        touchEndX.current = 0
    }, [goToNext, goToPrevious])



    // AutoPlay
    useEffect(() => {
        if (!autoPlay || allImages.length <= 1) return
        const interval = setInterval(goToNext, autoPlayInterval)
        return () => clearInterval(interval)
    }, [autoPlay, autoPlayInterval, goToNext, allImages.length])

    // Teclado
    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.key === 'ArrowLeft') { event.preventDefault(); goToPrevious() }
            else if (event.key === 'ArrowRight') { event.preventDefault(); goToNext() }
        }
        window.addEventListener('keydown', handleKeyDown)
        return () => window.removeEventListener('keydown', handleKeyDown)
    }, [goToPrevious, goToNext])


    return (
        <div className={styles.carouselContainer}>
            {/* Imagen principal */}
            <div 
                ref={mainImageContainerRef}
                className={`${styles.mainImageContainer} ${onMainImageClick ? styles.mainImageClickable : ''}`}
                onClick={onMainImageClick ? () => onMainImageClick(currentIndex) : undefined}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
                role={onMainImageClick ? 'button' : undefined}
                tabIndex={onMainImageClick ? 0 : undefined}
                onKeyDown={onMainImageClick ? (e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault()
                        onMainImageClick(currentIndex)
                    }
                } : undefined}
                aria-label={onMainImageClick ? 'Abrir galería en pantalla completa' : undefined}
            >
                {/* Imagen con efecto fade estándar */}
                <CloudinaryImage
                    key={currentIndex} // ✅ Key para reiniciar animación al cambiar imagen
                    image={allImages[currentIndex]}
                    alt={`${altText} ${currentIndex + 1} de ${allImages.length}`}
                    variant="fluid"
                    widths={IMAGE_WIDTHS.carousel}
                    sizes={IMAGE_SIZES.carousel}
                    loading={currentIndex === 0 ? 'eager' : 'lazy'}
                    fetchpriority={currentIndex === 0 ? 'high' : 'auto'}
                    qualityMode="auto"
                    className={styles.mainImage}
                />

            </div>

            {/* Miniaturas */}
            {allImages.length > 1 && (
                <div className={styles.thumbnailsContainer}>
                    <div 
                        ref={thumbnailsContainerRef}
                        className={styles.thumbnails}
                    >
                        {allImages.map((image, index) => (
                            <button
                                key={index}
                                ref={(el) => (thumbnailRefs.current[index] = el)}
                                className={`${styles.thumbnail} ${index === currentIndex ? styles.active : ''}`}
                                onClick={() => goToImage(index)}
                                aria-label={`Ver imagen ${index + 1}`}
                                type="button"
                            >
                                <CloudinaryImage
                                    image={image}
                                    alt={`Miniatura ${index + 1}`}
                                    variant="fluid"
                                    widths={IMAGE_WIDTHS.thumbnail}
                                    sizes={IMAGE_SIZES.thumbnail}
                                    loading="lazy"
                                    className={styles.thumbnailImage}
                                />
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
} 