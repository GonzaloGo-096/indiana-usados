/**
 * ImageCarousel - Componente de carrusel de imágenes
 * 
 * Funcionalidades:
 * - Mostrar imagen principal grande
 * - Miniaturas navegables abajo
 * - Navegación con flechas
 * - Indicadores de posición
 * - Lazy loading de imágenes
 * - Preload inteligente (hover + siguiente imagen)
 * - Responsive design
 * 
 * @author Indiana Usados
 * @version 1.1.0 - Preload optimizado para fluidez
 */

import React, { useState, useCallback, useMemo, useEffect, useRef } from 'react'
import { ChevronLeftIcon, ChevronRightIcon } from './icons.jsx'
import defaultCarImage from '@assets/auto1.jpg'
import CloudinaryImage from '@/components/ui/CloudinaryImage/CloudinaryImage'
import { IMAGE_SIZES, IMAGE_WIDTHS } from '@constants/imageSizes'

import styles from './ImageCarousel.module.css'

/**
 * Componente ImageCarousel
 * @param {Object} props - Propiedades del componente
 * @param {Array} props.images - Array de URLs de imágenes
 * @param {string} props.altText - Texto alternativo para las imágenes
 * @param {boolean} props.showArrows - Si mostrar flechas de navegación
 * @param {boolean} props.showIndicators - Si mostrar indicadores de posición
 * @param {boolean} props.autoPlay - Si reproducir automáticamente
 * @param {number} props.autoPlayInterval - Intervalo en ms para autoPlay
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
    // ✅ NUEVO: Ref para las miniaturas (auto-scroll)
    const thumbnailRefs = useRef([])
    
    // Si no hay imágenes, usar imagen por defecto - MEMOIZADO
    const allImages = useMemo(() => {
        if (!images || images.length === 0) {
            return [defaultCarImage]
        }
        // ✅ Usar imágenes directamente (sin processImages)
        return images
    }, [images])

    // ✅ LIMPIEZA: Ajustar array de refs cuando cambian las imágenes
    useEffect(() => {
        thumbnailRefs.current = thumbnailRefs.current.slice(0, allImages.length)
    }, [allImages.length])

    // Función para ir a la imagen anterior - MEMOIZADA
    const goToPrevious = useCallback(() => {
        setCurrentIndex((prevIndex) => 
            prevIndex === 0 ? allImages.length - 1 : prevIndex - 1
        )
    }, [allImages.length])

    // Función para ir a la imagen siguiente - MEMOIZADA
    const goToNext = useCallback(() => {
        setCurrentIndex((prevIndex) => 
            prevIndex === allImages.length - 1 ? 0 : prevIndex + 1
        )
    }, [allImages.length])

    // Función para ir a una imagen específica - MEMOIZADA
    const goToImage = useCallback((index) => {
        setCurrentIndex(index)
    }, [])



    // AutoPlay effect - OPTIMIZADO
    useEffect(() => {
        if (!autoPlay || allImages.length <= 1) return

        const interval = setInterval(goToNext, autoPlayInterval)
        return () => clearInterval(interval)
    }, [autoPlay, autoPlayInterval, goToNext, allImages.length])

    // Navegación con teclado - OPTIMIZADO
    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.key === 'ArrowLeft') {
                event.preventDefault()
                goToPrevious()
            } else if (event.key === 'ArrowRight') {
                event.preventDefault()
                goToNext()
            }
        }

        window.addEventListener('keydown', handleKeyDown)
        return () => window.removeEventListener('keydown', handleKeyDown)
    }, [goToPrevious, goToNext])

    // ✅ NUEVO: Auto-scroll a la miniatura activa (solo desktop)
    useEffect(() => {
        // ✅ PROFESIONAL: matchMedia para detección precisa de dispositivo
        const isDesktop = window.matchMedia('(min-width: 769px)').matches
        if (!isDesktop) return // ⚡ PERFORMANCE: Cero overhead en mobile
        
        const activeThumbnail = thumbnailRefs.current[currentIndex]
        if (!activeThumbnail) return
        
        // ✅ LÓGICA INTELIGENTE: Primera y última foto alineadas a los bordes
        let scrollAlign = 'center'
        
        if (currentIndex === 0) {
            scrollAlign = 'start' // Primera foto: alineada a la izquierda
        } else if (currentIndex === allImages.length - 1) {
            scrollAlign = 'end' // Última foto: alineada a la derecha
        }
        
        activeThumbnail.scrollIntoView({
            behavior: 'smooth',
            block: 'nearest',
            inline: scrollAlign
        })
    }, [currentIndex, allImages.length])

    // ✅ PRELOAD: Precargar siguiente imagen cuando carga el detalle
    useEffect(() => {
        if (currentIndex !== 0 || allImages.length <= 1) return
        
        // Preload imagen siguiente (índice 1)
        const nextImage = allImages[1]
        if (!nextImage || typeof nextImage !== 'string') return
        
        // Crear preload link solo si no existe
        let link = document.querySelector(`link[data-preload="carousel-next"]`)
        if (!link) {
            link = document.createElement('link')
            link.rel = 'preload'
            link.as = 'image'
            link.setAttribute('data-preload', 'carousel-next')
            document.head.appendChild(link)
        }
        link.href = nextImage
        
        // Cleanup: remover después de 30 segundos (ya no necesario)
        const timeout = setTimeout(() => {
            link?.remove()
        }, 30000)
        
        return () => {
            clearTimeout(timeout)
            // NO remover link aquí, se limpia con timeout
        }
    }, [currentIndex, allImages])

    // ✅ PRELOAD: Precargar imagen en hover de miniatura (solo desktop)
    const handleThumbnailHover = useCallback((imageUrl, index) => {
        // Solo preload si es diferente a la actual
        if (index === currentIndex || typeof imageUrl !== 'string') return
        
        // Crear preload link solo si no existe
        let link = document.querySelector(`link[data-preload="carousel-hover-${index}"]`)
        if (!link) {
            link = document.createElement('link')
            link.rel = 'preload'
            link.as = 'image'
            link.setAttribute('data-preload', `carousel-hover-${index}`)
            document.head.appendChild(link)
        }
        link.href = imageUrl
        
        // Cleanup: remover después de 10 segundos
        setTimeout(() => {
            link?.remove()
        }, 10000)
    }, [currentIndex])

    return (
        <div className={styles.carouselContainer}>
            {/* Imagen principal */}
            <div className={styles.mainImageContainer}>
                <CloudinaryImage
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

                {/* ✅ NUEVO: Contador de posición elegante */}
                {showIndicators && allImages.length > 1 && (
                    <div className={styles.indicators}>
                        <div className={styles.positionCounter}>
                            {currentIndex + 1} / {allImages.length}
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
                                className={`${styles.thumbnail} ${index === currentIndex ? styles.active : ''}`}
                                onClick={() => goToImage(index)}
                                onMouseEnter={() => handleThumbnailHover(image, index)}
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