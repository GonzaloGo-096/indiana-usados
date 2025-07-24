/**
 * useImageOptimization - Hook para optimización de imágenes
 * 
 * Funcionalidades:
 * - Lazy loading con Intersection Observer
 * - Preloading de imágenes críticas
 * - Manejo de diferentes tamaños (responsive)
 * - Fallback para imágenes que fallan
 * - Optimización de formatos (WebP, AVIF, JPEG)
 * 
 * @author Indiana Usados
 * @version 1.0.0
 */

import { useState, useEffect, useRef, useCallback } from 'react'

/**
 * Hook para optimización de imágenes
 * @param {Object} options - Opciones de configuración
 * @param {string} options.src - URL de la imagen
 * @param {string} options.alt - Texto alternativo
 * @param {string} options.fallback - URL de imagen de respaldo
 * @param {boolean} options.lazy - Si debe usar lazy loading
 * @param {Object} options.sizes - Tamaños responsive
 * @param {string} options.format - Formato preferido (webp, avif, jpeg)
 * @returns {Object} - Estado y métodos del hook
 */
export const useImageOptimization = ({
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
    format = 'webp'
} = {}) => {
    const [state, setState] = useState({
        isLoading: true,
        isLoaded: false,
        isError: false,
        currentSrc: null,
        error: null
    })

    const imgRef = useRef(null)
    const observerRef = useRef(null)

    // Función para generar URLs optimizadas
    const generateOptimizedUrl = useCallback((originalSrc, size, format) => {
        if (!originalSrc) return null

        // Si es una imagen local, mantener la URL original
        if (originalSrc.startsWith('/src/assets/') || originalSrc.startsWith('./') || originalSrc.startsWith('../')) {
            return originalSrc
        }

        // Para imágenes externas, agregar parámetros de optimización
        try {
            const url = new URL(originalSrc)
            url.searchParams.set('w', size)
            url.searchParams.set('q', '85')
            url.searchParams.set('f', format)
            url.searchParams.set('fit', 'crop')
            
            return url.toString()
        } catch (error) {
            // Si no es una URL válida, devolver la original
            return originalSrc
        }
    }, [])

    // Función para manejar carga de imagen
    const handleImageLoad = useCallback(() => {
        setState(prev => ({
            ...prev,
            isLoading: false,
            isLoaded: true,
            isError: false
        }))
    }, [])

    // Función para manejar errores de imagen
    const handleImageError = useCallback(() => {
        setState(prev => ({
            ...prev,
            isLoading: false,
            isLoaded: false,
            isError: true,
            currentSrc: fallback || prev.currentSrc
        }))
    }, [fallback])

    // Función para cargar imagen
    const loadImage = useCallback((imageSrc) => {
        if (!imageSrc) return

        setState(prev => ({
            ...prev,
            isLoading: true,
            isLoaded: false,
            isError: false,
            currentSrc: imageSrc
        }))

        const img = new Image()
        img.onload = handleImageLoad
        img.onerror = handleImageError
        img.src = imageSrc
    }, [handleImageLoad, handleImageError])

    // Configurar Intersection Observer para lazy loading
    useEffect(() => {
        if (!lazy || !src) {
            loadImage(src)
            return
        }

        if (!imgRef.current) return

        observerRef.current = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        loadImage(src)
                        observerRef.current?.unobserve(entry.target)
                    }
                })
            },
            {
                rootMargin: '50px 0px',
                threshold: 0.1
            }
        )

        observerRef.current.observe(imgRef.current)

        return () => {
            if (observerRef.current) {
                observerRef.current.disconnect()
            }
        }
    }, [src, lazy, loadImage])

    // Limpiar observer al desmontar
    useEffect(() => {
        return () => {
            if (observerRef.current) {
                observerRef.current.disconnect()
            }
        }
    }, [])

    // Generar srcset para imágenes responsive
    const generateSrcSet = useCallback(() => {
        if (!src) return ''

        const srcSet = Object.entries(sizes)
            .map(([breakpoint, size]) => {
                const optimizedUrl = generateOptimizedUrl(src, size, format)
                return `${optimizedUrl} ${size}`
            })
            .join(', ')

        return srcSet
    }, [src, sizes, format, generateOptimizedUrl])

    // Función para precargar imagen
    const preloadImage = useCallback((imageSrc) => {
        if (!imageSrc) return

        const link = document.createElement('link')
        link.rel = 'preload'
        link.as = 'image'
        link.href = imageSrc
        document.head.appendChild(link)
    }, [])

    return {
        ...state,
        imgRef,
        srcSet: generateSrcSet(),
        preloadImage,
        reload: () => loadImage(src)
    }
} 