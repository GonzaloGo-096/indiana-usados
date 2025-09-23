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

import React, { memo, useState, useMemo } from 'react'
import { getOptimizedImage, getResponsiveImage } from '@config/images'
import { cldUrl, cldSrcset } from '@utils/cloudinaryUrl'
import { extractPublicIdFromUrl, isCloudinaryUrl } from '@utils/extractPublicId'
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
    fallbackUrl = null,
    publicId = null,
    lazy = true,
    sizes = {
        sm: '300px',
        md: '600px',
        lg: '800px',
        xl: '1200px'
    },
    widths = [],
    variant = 'fluid',
    format = 'webp',
    className = '',
    style = {},
    onLoad,
    onError,
    showSkeleton = true,
    optimizationOptions = {},
    useCdn = false,
    isCritical = false,
    fetchpriority,
    ...props
}) => {
    const [state, setState] = useState({
        isLoading: true,
        isLoaded: false,
        isError: false
    })

    // Determinar public_id efectivo
    const effectivePublicId = publicId ?? (isCloudinaryUrl(fallbackUrl || src) ? extractPublicIdFromUrl(fallbackUrl || src) : null)
    
    // Configuración base para Cloudinary
    const base = { variant: variant || 'fluid' }
    
    // Memoizar opciones de optimización para estabilidad
    const stableOpts = useMemo(() => optimizationOptions || {}, [optimizationOptions])

    // Generar URL optimizada con useMemo (sin useEffect)
    const optimizedSrc = useMemo(() => {
        if (effectivePublicId) {
            return cldUrl(effectivePublicId, { ...base, ...stableOpts })
        }
        
        // Fallback: determinar si src es una clave de imagen o URL directa
        const isImageKey = !src?.startsWith('http') && !src?.startsWith('/') && !src?.startsWith('./')
        
        if (isImageKey) {
            // Es una clave de imagen, usar el sistema de configuración
            return getOptimizedImage(src, {
                format,
                ...stableOpts,
                forceCdn: useCdn
            })
        }
        
        // Es una URL directa o fallbackUrl
        return fallbackUrl || src || ''
    }, [effectivePublicId, base.variant, stableOpts, src, fallbackUrl, format, useCdn])

    // Generar srcset si hay widths definidos
    const optimizedSrcSet = useMemo(() => {
        if (!effectivePublicId || !widths?.length) {
            // Fallback al sistema anterior si no hay public_id
            const isImageKey = !src?.startsWith('http') && !src?.startsWith('/') && !src?.startsWith('./')
            if (isImageKey) {
                const responsive = getResponsiveImage(src, Object.values(sizes).map(s => parseInt(s)), {
                    format,
                    ...stableOpts,
                    forceCdn: useCdn
                })
                return responsive.srcSet
            }
            return ''
        }
        
        return cldSrcset(effectivePublicId, widths, { ...base, ...stableOpts })
    }, [effectivePublicId, widths, base.variant, stableOpts, src, sizes, format, useCdn])

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
        if (fallback && optimizedSrc !== fallback) {
            setState(prev => ({
                ...prev,
                isLoading: true,
                isLoaded: false,
                isError: false
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

    // Determinar fetchpriority para imágenes críticas (paridad con ResponsiveImage)
    const finalFetchpriority = isCritical ? 'high' : (fetchpriority || 'auto')

    return (
        <img
            src={optimizedSrc}
            alt={alt}
            srcSet={optimizedSrcSet}
            className={`${styles.image} ${className} ${state.isLoaded ? styles.loaded : ''}`}
            style={style}
            loading={lazy ? 'lazy' : 'eager'}
            decoding="async"
            fetchpriority={finalFetchpriority}
            onLoad={handleLoad}
            onError={handleError}
            {...props}
        />
    )
})

OptimizedImage.displayName = 'OptimizedImage' 