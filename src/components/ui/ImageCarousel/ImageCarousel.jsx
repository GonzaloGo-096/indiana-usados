/**
 * ImageCarousel - Componente de carrusel de imágenes
 * 
 * Funcionalidades:
 * - Mostrar imagen principal grande
 * - Miniaturas navegables abajo
 * - Navegación con flechas
 * - Indicadores de posición
 * - Lazy loading de imágenes
 * - Responsive design
 * 
 * @author Indiana Usados
 * @version 1.0.0
 */

import React, { useState, useCallback, useMemo, useEffect, useRef } from 'react'
import { ChevronLeftIcon, ChevronRightIcon } from './icons.jsx'
import defaultCarImage from '@assets/auto1.jpg'
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
    autoPlayInterval = 5000
}) => {
    const [currentIndex, setCurrentIndex] = useState(0)
    const thumbnailRefs = useRef([])

    // Si no hay imágenes, usar imagen por defecto
    const allImages = useMemo(() => {
        if (!images || images.length === 0) return [defaultCarImage]
        return images
    }, [images])

    useEffect(() => {
        thumbnailRefs.current = thumbnailRefs.current.slice(0, allImages.length)
    }, [allImages.length])

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

    // Auto-scroll miniatura activa (solo desktop)
    useEffect(() => {
        const isDesktop = window.matchMedia('(min-width: 769px)').matches
        if (!isDesktop) return
        const activeThumbnail = thumbnailRefs.current[currentIndex]
        if (!activeThumbnail) return
        let scrollAlign = 'center'
        if (currentIndex === 0) scrollAlign = 'start'
        else if (currentIndex === allImages.length - 1) scrollAlign = 'end'
        activeThumbnail.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: scrollAlign })
    }, [currentIndex, allImages.length])

    // ===== SOLUCIÓN A MEJORADA: Crossfade sin gaps =====
    const [displayIndex, setDisplayIndex] = useState(0)
    const [overlayIndex, setOverlayIndex] = useState(null)
    const [isFading, setIsFading] = useState(false)

    // Cuando cambia currentIndex, preparar overlay e iniciar fade inmediatamente
    useEffect(() => {
        if (currentIndex === displayIndex) return
        setOverlayIndex(currentIndex)
        // Iniciar fade inmediatamente (mostrará placeholder borroso mientras carga)
        setIsFading(true)
    }, [currentIndex, displayIndex])

    // Handler cuando overlay carga: completar el fade
    const handleOverlayLoad = useCallback(() => {
        // En mobile, usar setTimeout directamente para evitar problemas de timing
        const isMobile = window.matchMedia('(max-width: 768px)').matches
        
        if (isMobile) {
            // Mobile: timing más largo para dispositivos más lentos
            setTimeout(() => {
                if (overlayIndex !== null) {
                    setDisplayIndex(overlayIndex)
                    // Delay más largo en mobile para asegurar render completo
                    setTimeout(() => {
                        setOverlayIndex(null)
                        setIsFading(false)
                    }, 100)
                }
            }, 200)
        } else {
            // Desktop: usar requestAnimationFrame para mejor sincronización
            setTimeout(() => {
                if (overlayIndex !== null) {
                    setDisplayIndex(overlayIndex)
                    requestAnimationFrame(() => {
                        requestAnimationFrame(() => {
                            requestAnimationFrame(() => {
                                setOverlayIndex(null)
                                setIsFading(false)
                            })
                        })
                    })
                }
            }, 200)
        }
    }, [overlayIndex])

    return (
        <div className={styles.carouselContainer}>
            {/* Imagen principal */}
            <div className={styles.mainImageContainer}>
                {/* Capa base: imagen display (fade-out cuando overlay está haciendo fade-in) */}
                <CloudinaryImage
                    image={allImages[displayIndex]}
                    alt={`${altText} ${displayIndex + 1} de ${allImages.length}`}
                    variant="fluid"
                    widths={IMAGE_WIDTHS.carousel}
                    sizes={IMAGE_SIZES.carousel}
                    loading={displayIndex === 0 ? 'eager' : 'lazy'}
                    fetchpriority={displayIndex === 0 ? 'high' : 'auto'}
                    qualityMode="auto"
                    className={styles.mainImage}
                    style={{ 
                        position: 'relative', 
                        zIndex: 1, 
                        opacity: overlayIndex !== null && isFading ? 0 : 1, 
                        transition: overlayIndex !== null && isFading ? 'opacity 200ms ease-out' : 'none' 
                    }}
                />

                {/* Capa overlay: nueva imagen (fade-in cuando está lista) */}
                {overlayIndex !== null && (
                    <CloudinaryImage
                        image={allImages[overlayIndex]}
                        alt={`${altText} ${overlayIndex + 1} de ${allImages.length}`}
                        variant="fluid"
                        widths={IMAGE_WIDTHS.carousel}
                        sizes={IMAGE_SIZES.carousel}
                        loading="eager"
                        fetchpriority="high"
                        qualityMode="auto"
                        className={styles.mainImage}
                        style={{
                            position: 'absolute',
                            inset: 0,
                            zIndex: 2,
                            opacity: isFading ? 1 : 0,
                            transition: 'opacity 200ms ease-out'
                        }}
                        onLoad={handleOverlayLoad}
                    />
                )}

                {/* Flechas de navegación */}
                {showArrows && allImages.length > 1 && (
                    <>
                        <button 
                            className={`${styles.arrow} ${styles.arrowLeft}`}
                            onClick={goToPrevious}
                            aria-label="Imagen anterior"
                            type="button"
                        >
                            <ChevronLeftIcon />
                        </button>
                        <button 
                            className={`${styles.arrow} ${styles.arrowRight}`}
                            onClick={goToNext}
                            aria-label="Imagen siguiente"
                            type="button"
                        >
                            <ChevronRightIcon />
                        </button>
                    </>
                )}

                {/* Indicadores */}
                {showIndicators && allImages.length > 1 && (
                    <div className={styles.indicators}>
                        <div className={styles.positionCounter}>
                            {displayIndex + 1} / {allImages.length}
                        </div>
                    </div>
                )}
            </div>

            {/* Miniaturas */}
            {allImages.length > 1 && (
                <div className={styles.thumbnailsContainer}>
                    <div className={styles.thumbnails}>
                        {allImages.map((image, index) => (
                            <button
                                key={index}
                                ref={(el) => (thumbnailRefs.current[index] = el)}
                                className={`${styles.thumbnail} ${index === displayIndex ? styles.active : ''}`}
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