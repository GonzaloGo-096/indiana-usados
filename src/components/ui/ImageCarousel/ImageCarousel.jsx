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

import React, { useState, useCallback, useMemo, useEffect } from 'react'
import { ChevronLeftIcon, ChevronRightIcon } from './icons.jsx'
import { processImages } from '@utils/imageUtils'
import defaultCarImage from '@assets/auto1.jpg'


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
        console.log('🖼️ ImageCarousel: images recibidas', images)
        console.log('🖼️ ImageCarousel: images.length', images?.length)
        
        if (!images || images.length === 0) {
            console.log('⚠️ ImageCarousel: No hay imágenes, usando default')
            return [defaultCarImage]
        }
        
        // Procesar imágenes que pueden ser objetos o URLs
        const processedImages = processImages(images);
        console.log('🖼️ ImageCarousel: Imágenes procesadas', processedImages)
        
        return processedImages;
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

    // Preload de imágenes para mejor rendimiento
    useEffect(() => {
        allImages.forEach((imageSrc) => {
            if (imageSrc && imageSrc !== defaultCarImage) {
                const img = new Image()
                img.src = imageSrc
            }
        })
    }, [allImages])

    return (
        <div className={styles.carouselContainer}>
            {/* Imagen principal */}
            <div className={styles.mainImageContainer}>
                <img 
                    src={allImages[currentIndex]} 
                    alt={`${altText} ${currentIndex + 1} de ${allImages.length}`}
                    className={styles.mainImage}
                    loading="lazy"
                    decoding="async"
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

                {/* Indicadores de posición */}
                {showIndicators && allImages.length > 1 && (
                    <div className={styles.indicators}>
                        {allImages.map((_, index) => (
                            <button
                                key={index}
                                className={`${styles.indicator} ${index === currentIndex ? styles.active : ''}`}
                                onClick={() => goToImage(index)}
                                aria-label={`Ir a imagen ${index + 1}`}
                                aria-current={index === currentIndex ? 'true' : 'false'}
                                type="button"
                            />
                        ))}
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
                                <img 
                                    src={image} 
                                    alt={`Miniatura ${index + 1}`}
                                    className={styles.thumbnailImage}
                                    loading="lazy"
                                    decoding="async"
                                />
                            </button>
                        ))}
                    </div>
                </div>
            )}
            

        </div>
    )
} 