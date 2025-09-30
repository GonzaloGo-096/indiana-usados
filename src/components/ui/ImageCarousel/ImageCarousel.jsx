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
    
    // Si no hay imágenes, usar imagen por defecto - MEMOIZADO
    const allImages = useMemo(() => {
        if (!images || images.length === 0) {
            return [defaultCarImage]
        }
        // ✅ Usar imágenes directamente (sin processImages)
        return images
    }, [images])

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