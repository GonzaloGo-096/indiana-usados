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
import { processImages } from '@utils/imageUtils'
import defaultCarImage from '@assets/auto1.jpg'
import ResponsiveImage from '@/components/ui/ResponsiveImage/ResponsiveImage'
import { IMAGE_SIZES, IMAGE_WIDTHS } from '@/constants/imageSizes'

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
    const thumbnailsRef = useRef(null) // ✅ NUEVO: Ref para el contenedor de miniaturas
    
    // Si no hay imágenes, usar imagen por defecto - MEMOIZADO
    const allImages = useMemo(() => {
        console.log('🖼️ ImageCarousel: images recibidas', images)
        console.log('🖼️ ImageCarousel: images.length', images?.length)
        console.log('🖼️ ImageCarousel: Detalle de cada imagen:', images?.map((img, index) => ({
            index,
            img,
            type: typeof img,
            isObject: typeof img === 'object',
            hasUrl: img?.url
        })))
        
        if (!images || images.length === 0) {
            console.log('⚠️ ImageCarousel: No hay imágenes, usando default')
            return [defaultCarImage]
        }
        
        // Procesar imágenes que pueden ser objetos o URLs
        const processedImages = processImages(images);
        console.log('🖼️ ImageCarousel: Imágenes procesadas', processedImages)
        console.log('🖼️ ImageCarousel: Total de imágenes finales:', processedImages.length)
        
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

    // ✅ NUEVO: Estado para el offset del visor fijo
    const [thumbnailOffset, setThumbnailOffset] = useState(0)
    
    // ✅ NUEVO: Funciones para el slider de miniaturas con visor fijo
    const scrollThumbnailsLeft = useCallback(() => {
        const thumbnailWidth = 90 + 16 // width + gap (Netflix style)
        const visibleThumbnails = Math.floor(thumbnailsRef.current?.clientWidth / thumbnailWidth) || 3
        const maxOffset = Math.max(0, allImages.length - visibleThumbnails)
        
        setThumbnailOffset(prev => Math.max(0, prev - visibleThumbnails))
    }, [allImages.length])

    const scrollThumbnailsRight = useCallback(() => {
        const thumbnailWidth = 90 + 16 // width + gap (Netflix style)
        const visibleThumbnails = Math.floor(thumbnailsRef.current?.clientWidth / thumbnailWidth) || 3
        const maxOffset = Math.max(0, allImages.length - visibleThumbnails)
        
        setThumbnailOffset(prev => Math.min(maxOffset, prev + visibleThumbnails))
    }, [allImages.length])

    // ✅ NUEVO: Verificar si se puede hacer scroll con visor fijo
    const [canScrollLeft, setCanScrollLeft] = useState(false)
    const [canScrollRight, setCanScrollRight] = useState(false)

    const checkScrollButtons = useCallback(() => {
        const thumbnailWidth = 90 + 16 // width + gap (Netflix style)
        const visibleThumbnails = Math.floor(thumbnailsRef.current?.clientWidth / thumbnailWidth) || 3
        const maxOffset = Math.max(0, allImages.length - visibleThumbnails)
        
        setCanScrollLeft(thumbnailOffset > 0)
        setCanScrollRight(thumbnailOffset < maxOffset)
    }, [thumbnailOffset, allImages.length])

    // ✅ NUEVO: Efecto para verificar scroll al cambiar offset
    useEffect(() => {
        checkScrollButtons()
    }, [checkScrollButtons])

    // ✅ NUEVO: Efecto para aplicar transform al visor fijo
    useEffect(() => {
        if (thumbnailsRef.current) {
            const thumbnailWidth = 90 + 16 // width + gap (Netflix style)
            const translateX = -thumbnailOffset * thumbnailWidth
            thumbnailsRef.current.style.transform = `translateX(${translateX}px)`
        }
    }, [thumbnailOffset])


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
                {(() => {
                    const item = allImages[currentIndex];
                    const publicId   = typeof item === 'string' ? undefined : item?.public_id;
                    const fallbackUrl= typeof item === 'string' ? item      : item?.url;
                    return (
                        <ResponsiveImage
                            publicId={publicId}
                            fallbackUrl={fallbackUrl}
                            alt={`${altText} ${currentIndex + 1} de ${allImages.length}`}
                            variant="fluid"
                            widths={IMAGE_WIDTHS.carousel}
                            sizes={IMAGE_SIZES.carousel}
                            loading="lazy"
                            className={styles.mainImage}
                        />
                    );
                })()}
                
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
                    {/* ✅ NUEVO: Controles del slider de miniaturas */}
                    {canScrollLeft && (
                        <button
                            className={`${styles.thumbnailControls} ${styles.thumbnailControlsLeft}`}
                            onClick={scrollThumbnailsLeft}
                            aria-label="Scroll miniaturas izquierda"
                            type="button"
                        >
                            <ChevronLeftIcon />
                        </button>
                    )}
                    
                    {canScrollRight && (
                        <button
                            className={`${styles.thumbnailControls} ${styles.thumbnailControlsRight}`}
                            onClick={scrollThumbnailsRight}
                            aria-label="Scroll miniaturas derecha"
                            type="button"
                        >
                            <ChevronRightIcon />
                        </button>
                    )}

                    <div className={styles.thumbnails} ref={thumbnailsRef} style={{ transform: `translateX(${-thumbnailOffset * (90 + 16)}px)` }}>
                        {allImages.map((image, index) => (
                            <button
                                key={index}
                                className={`${styles.thumbnail} ${index === currentIndex ? styles.active : ''}`}
                                onClick={() => goToImage(index)}
                                aria-label={`Ver imagen ${index + 1}`}
                                type="button"
                            >
                                {(() => {
                                    const item = image;
                                    const publicId   = typeof item === 'string' ? undefined : item?.public_id;
                                    const fallbackUrl= typeof item === 'string' ? item      : item?.url;
                                    return (
                                        <ResponsiveImage
                                            publicId={publicId}
                                            fallbackUrl={fallbackUrl}
                                            alt={`Miniatura ${index + 1}`}
                                            variant="fluid"
                                            widths={IMAGE_WIDTHS.thumbnail}
                                            sizes={IMAGE_SIZES.thumbnail}
                                            loading="lazy"
                                            className={styles.thumbnailImage}
                                        />
                                    );
                                })()}
                            </button>
                        ))}
                    </div>
                </div>
            )}
            

        </div>
    )
} 