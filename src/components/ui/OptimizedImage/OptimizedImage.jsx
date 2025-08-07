/**
 * OptimizedImage - Componente de imagen optimizada
 * 
 * Funcionalidades:
 * - Lazy loading automático
 * - Imágenes responsive
 * - Fallback para errores
 * - Skeleton de carga
 * - Optimización de formatos
 * - Soporte para CDN
 * 
 * @author Indiana Usados
 * @version 2.0.0
 */

import React, { memo, useState, useEffect, useCallback } from 'react'
import { getOptimizedImage, getResponsiveImage } from '@config/images'
import styles from './OptimizedImage.module.css'

/**
 * Componente OptimizedImage
 * @param {Object} props - Propiedades del componente
 * @param {string} props.src - URL de la imagen o clave de imagen
 * @param {string} props.alt - Texto alternativo
 * @param {string} props.fallback - URL de imagen de respaldo
 * @param {boolean} props.lazy - Si debe usar lazy loading
 * @param {Object} props.sizes - Tamaños responsive
 * @param {string} props.format - Formato preferido
 * @param {string} props.className - Clases CSS adicionales
 * @param {Object} props.style - Estilos inline
 * @param {Function} props.onLoad - Callback cuando la imagen carga
 * @param {Function} props.onError - Callback cuando hay error
 * @param {boolean} props.showSkeleton - Si mostrar skeleton de carga
 * @param {Object} props.optimizationOptions - Opciones de optimización para CDN
 * @param {boolean} props.useCdn - Forzar uso de CDN
 */
export const OptimizedImage = memo(({
    src,
    alt = '',
    fallback = null,
    lazy = true,
    sizes = {
        sm: '300px',
        md: '600px',
        lg: '800px',
        xl: '1200px'
    },
    format = 'webp',
    className = '',
    style = {},
    onLoad,
    onError,
    showSkeleton = true,
    optimizationOptions = {},
    useCdn = false,
    ...props
}) => {
    const [state, setState] = useState({
        isLoading: true,
        isLoaded: false,
        isError: false,
        currentSrc: null
    })

    // Determinar si src es una clave de imagen o una URL
    const isImageKey = !src?.startsWith('http') && !src?.startsWith('/') && !src?.startsWith('./')
    
    // Obtener URL optimizada
    const getOptimizedSrc = useCallback(() => {
        if (isImageKey) {
            // Es una clave de imagen, usar el sistema de configuración
            return getOptimizedImage(src, {
                format,
                ...optimizationOptions,
                forceCdn: useCdn
            })
        }
        
        // Es una URL directa
        return src
    }, [isImageKey, src, format, optimizationOptions, useCdn])

    // Obtener srcset si es necesario
    const getSrcSet = () => {
        if (isImageKey) {
            const responsive = getResponsiveImage(src, Object.values(sizes).map(s => parseInt(s)), {
                format,
                ...optimizationOptions,
                forceCdn: useCdn
            })
            return responsive.srcSet
        }
        return ''
    }

    // Manejar carga de imagen
    const handleLoad = () => {
        setState(prev => ({
            ...prev,
            isLoading: false,
            isLoaded: true,
            isError: false
        }))
        onLoad?.()
    }

    // Manejar error de imagen
    const handleError = () => {
        if (fallback && state.currentSrc !== fallback) {
            setState(prev => ({
                ...prev,
                isLoading: true,
                isLoaded: false,
                isError: false,
                currentSrc: fallback
            }))
        } else {
            setState(prev => ({
                ...prev,
                isLoading: false,
                isLoaded: false,
                isError: true
            }))
        }
        onError?.()
    }

    // Actualizar src cuando cambie
    useEffect(() => {
        const optimizedSrc = getOptimizedSrc()
        setState(prev => ({
            ...prev,
            isLoading: true,
            isLoaded: false,
            isError: false,
            currentSrc: optimizedSrc
        }))
    }, [src, format, useCdn, optimizationOptions, getOptimizedSrc])

    // Renderizar skeleton de carga
    if (state.isLoading && showSkeleton) {
        return (
            <div 
                className={`${styles.skeleton} ${className}`}
                style={style}
                {...props}
            >
                <div className={styles.skeletonContent} />
            </div>
        )
    }

    // Renderizar imagen con error
    if (state.isError && !state.currentSrc) {
        return (
            <div 
                className={`${styles.errorContainer} ${className}`}
                style={style}
                {...props}
            >
                <div className={styles.errorContent}>
                    <svg className={styles.errorIcon} viewBox="0 0 24 24">
                        <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/>
                    </svg>
                    <span className={styles.errorText}>Error al cargar imagen</span>
                </div>
            </div>
        )
    }

    return (
        <img
            src={state.currentSrc}
            alt={alt}
            srcSet={getSrcSet()}
            className={`${styles.image} ${className} ${state.isLoaded ? styles.loaded : ''}`}
            style={style}
            loading={lazy ? 'lazy' : 'eager'}
            onLoad={handleLoad}
            onError={handleError}
            {...props}
        />
    )
})

OptimizedImage.displayName = 'OptimizedImage' 