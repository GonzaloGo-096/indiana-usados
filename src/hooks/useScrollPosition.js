/**
 * useScrollPosition - Hook para preservar posición de scroll
 * 
 * Responsabilidades:
 * - Guardar posición de scroll en sessionStorage
 * - Restaurar posición al navegar
 * - Debounce optimizado
 * - Navegación con scroll preservado
 * 
 * @author Indiana Usados
 * @version 1.0.0
 */

import { useEffect, useRef, useCallback } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

export const useScrollPosition = (options = {}) => {
    const {
        key = 'default',
        debounceMs = 100,
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
            timestamp: Date.now(),
            path: location.pathname
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
                
                console.log(`✅ Posición de scroll restaurada: ${scrollData.position}px`)
            }
        } catch (error) {
            console.error('❌ Error al restaurar posición de scroll:', error)
        }
    }, [enabled, key, location.pathname])

    // ✅ FUNCIÓN: Limpiar posición guardada
    const clearScrollPosition = useCallback(() => {
        sessionStorage.removeItem(`scroll_${key}`)
        console.log(`🗑️ Posición de scroll limpiada para: ${key}`)
    }, [key])

    // ✅ FUNCIÓN: Navegar preservando scroll
    const navigateWithScroll = useCallback((to, options = {}) => {
        // Guardar posición actual antes de navegar
        saveScrollPosition()
        navigate(to, options)
    }, [navigate, saveScrollPosition])

    // ✅ EVENT LISTENER: Scroll con debounce
    useEffect(() => {
        if (!enabled) return

        const handleScroll = () => {
            if (scrollTimeout.current) {
                clearTimeout(scrollTimeout.current)
            }
            
            scrollTimeout.current = setTimeout(() => {
                saveScrollPosition()
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
            // Pequeño delay para asegurar que el DOM esté listo
            const timer = setTimeout(() => {
                restoreScrollPosition()
            }, 100)
            
            return () => clearTimeout(timer)
        }
    }, [enabled, restoreScrollPosition])

    return {
        saveScrollPosition,
        restoreScrollPosition,
        clearScrollPosition,
        navigateWithScroll,
        lastPosition: lastScrollPosition.current
    }
} 