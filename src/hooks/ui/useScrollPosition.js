import { useEffect, useRef, useCallback } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { logger } from '@utils/logger'

export const useScrollPosition = (options = {}) => {
    const {
        key = 'default',
        debounceMs = 100,
        restoreDelay = 100, // ✅ NUEVO: delay configurable para restauración
        enabled = true
    } = options

    const location = useLocation()
    const navigate = useNavigate()
    const lastScrollPosition = useRef(0)
    const scrollTimeout = useRef(null)

    // ✅ FUNCIÓN: Guardar posición de scroll
    const saveScrollPosition = useCallback(() => {
        if (!enabled) return
        
        const position = window.scrollY
        const scrollData = {
            position,
            path: location.pathname
            // ✅ OPTIMIZADO: timestamp eliminado (no se usaba)
        }
        
        sessionStorage.setItem(`scroll_${key}`, JSON.stringify(scrollData))
        lastScrollPosition.current = position
    }, [enabled, key, location.pathname])

    // ✅ FUNCIÓN: Restaurar posición de scroll
    const restoreScrollPosition = useCallback(() => {
        if (!enabled) return
        
        try {
            const savedData = sessionStorage.getItem(`scroll_${key}`)
            if (!savedData) return
            
            const scrollData = JSON.parse(savedData)
            
            // ✅ VERIFICAR: Solo restaurar si es la misma ruta
            if (scrollData.path === location.pathname) {
                requestAnimationFrame(() => {
                    window.scrollTo({
                        top: scrollData.position,
                        behavior: 'instant' // Sin animación para evitar saltos
                    })
                })
                
                logger.debug('hooks:scroll', `Posición de scroll restaurada: ${scrollData.position}px`)
            }
        } catch (error) {
            logger.error('hooks:scroll', 'Error al restaurar posición de scroll', error)
        }
    }, [enabled, key, location.pathname])

    // ✅ FUNCIÓN: Limpiar posición guardada
    const clearScrollPosition = useCallback(() => {
        sessionStorage.removeItem(`scroll_${key}`)
        logger.debug('hooks:scroll', `Posición de scroll limpiada para: ${key}`)
    }, [key])

    // ✅ FUNCIÓN: Navegar preservando scroll
    const navigateWithScroll = useCallback((to, options = {}) => {
        // Guardar posición actual antes de navegar
        saveScrollPosition()
        navigate(to, options)
    }, [navigate, saveScrollPosition])

    // ✅ EVENT LISTENER: Scroll con debounce + requestAnimationFrame
    useEffect(() => {
        if (!enabled) return

        const handleScroll = () => {
            if (scrollTimeout.current) {
                clearTimeout(scrollTimeout.current)
            }
            
            // ✅ OPTIMIZADO: rAF para sincronizar con repaint
            scrollTimeout.current = setTimeout(() => {
                requestAnimationFrame(saveScrollPosition)
            }, debounceMs)
        }

        window.addEventListener('scroll', handleScroll, { passive: true })
        
        return () => {
            window.removeEventListener('scroll', handleScroll)
            if (scrollTimeout.current) {
                clearTimeout(scrollTimeout.current)
            }
        }
    }, [enabled, debounceMs, saveScrollPosition])

    // ✅ RESTAURAR: Posición al montar componente
    useEffect(() => {
        if (enabled) {
            // ✅ CONFIGURABLE: delay para asegurar que el DOM esté listo
            const timer = setTimeout(() => {
                restoreScrollPosition()
            }, restoreDelay)
            
            return () => clearTimeout(timer)
        }
    }, [enabled, restoreDelay, restoreScrollPosition])

    return {
        saveScrollPosition,
        restoreScrollPosition,
        clearScrollPosition,
        navigateWithScroll,
        lastPosition: lastScrollPosition.current
    }
}


