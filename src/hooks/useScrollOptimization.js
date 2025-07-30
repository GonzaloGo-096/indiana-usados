/**
 * useScrollOptimization - Hook para optimizar el scroll y reducir lag
 * 
 * Responsabilidades:
 * - Throttling de eventos de scroll
 * - Optimización de re-renders durante scroll
 * - Detección de scroll suave
 * - Performance monitoring
 * 
 * @author Indiana Usados
 * @version 1.0.0
 */

import { useCallback, useRef, useEffect } from 'react'

/**
 * Hook para optimizar el scroll y reducir lag
 * @param {Object} options - Opciones de configuración
 * @param {number} options.throttleMs - Milisegundos para throttling (default: 16ms = 60fps)
 * @param {boolean} options.enabled - Si el hook está habilitado
 * @returns {Object} - Funciones y estado del hook
 */
export const useScrollOptimization = (options = {}) => {
    const {
        throttleMs = 16, // 60fps
        enabled = true
    } = options

    const lastScrollTime = useRef(0)
    const scrollTimeout = useRef(null)
    const isScrolling = useRef(false)

    // ✅ OPTIMIZADO: Throttling de scroll
    const throttledScrollHandler = useCallback((callback) => {
        const now = Date.now()
        
        if (now - lastScrollTime.current >= throttleMs) {
            lastScrollTime.current = now
            callback()
        } else {
            // Cancelar timeout anterior si existe
            if (scrollTimeout.current) {
                clearTimeout(scrollTimeout.current)
            }
            
            // Programar ejecución después del throttle
            scrollTimeout.current = setTimeout(() => {
                lastScrollTime.current = Date.now()
                callback()
            }, throttleMs - (now - lastScrollTime.current))
        }
    }, [throttleMs])

    // ✅ OPTIMIZADO: Detectar cuando el scroll termina
    const handleScrollEnd = useCallback((callback, delay = 150) => {
        isScrolling.current = true
        
        if (scrollTimeout.current) {
            clearTimeout(scrollTimeout.current)
        }
        
        scrollTimeout.current = setTimeout(() => {
            isScrolling.current = false
            callback()
        }, delay)
    }, [])

    // ✅ OPTIMIZADO: Optimizar re-renders durante scroll
    const optimizeDuringScroll = useCallback((callback) => {
        if (!isScrolling.current) {
            callback()
        } else {
            // Usar requestAnimationFrame para mejor performance
            requestAnimationFrame(() => {
                if (!isScrolling.current) {
                    callback()
                }
            })
        }
    }, [])

    // ✅ OPTIMIZADO: Cleanup al desmontar
    useEffect(() => {
        return () => {
            if (scrollTimeout.current) {
                clearTimeout(scrollTimeout.current)
            }
        }
    }, [])

    return {
        throttledScrollHandler,
        handleScrollEnd,
        optimizeDuringScroll,
        isScrolling: isScrolling.current
    }
}

/**
 * Hook para optimizar el scroll de listas con muchos elementos
 * @param {Object} options - Opciones de configuración
 * @param {number} options.itemHeight - Altura estimada de cada elemento
 * @param {number} options.containerHeight - Altura del contenedor
 * @param {number} options.bufferSize - Número de elementos extra a renderizar
 * @returns {Object} - Configuración de virtualización
 */
export const useListScrollOptimization = (options = {}) => {
    const {
        itemHeight = 400,
        containerHeight = 800,
        bufferSize = 3
    } = options

    const scrollTop = useRef(0)
    const containerRef = useRef(null)

    // ✅ OPTIMIZADO: Calcular elementos visibles
    const getVisibleRange = useCallback((totalItems) => {
        if (!containerRef.current) return { start: 0, end: totalItems }

        const start = Math.floor(scrollTop.current / itemHeight)
        const visibleCount = Math.ceil(containerHeight / itemHeight)
        const end = Math.min(start + visibleCount + bufferSize, totalItems)

        return {
            start: Math.max(0, start - bufferSize),
            end
        }
    }, [itemHeight, containerHeight, bufferSize])

    // ✅ OPTIMIZADO: Handler de scroll optimizado
    const handleScroll = useCallback((event) => {
        scrollTop.current = event.target.scrollTop
    }, [])

    return {
        containerRef,
        getVisibleRange,
        handleScroll,
        scrollTop: scrollTop.current
    }
} 