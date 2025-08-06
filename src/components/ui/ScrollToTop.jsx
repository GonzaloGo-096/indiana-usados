/**
 * ScrollToTop - Componente para botón "Subir al principio"
 * 
 * Responsabilidades:
 * - Mostrar/ocultar botón inteligentemente
 * - Scroll suave al inicio
 * - Animaciones optimizadas
 * - Responsive design
 * 
 * @author Indiana Usados
 * @version 1.0.0
 */

import React, { useState, useEffect, useCallback, useRef } from 'react'
import styles from './ScrollToTop.module.css'

export const ScrollToTop = ({ 
    threshold = 300, 
    smooth = true,
    showCondition = () => true,
    children 
}) => {
    const [isVisible, setIsVisible] = useState(false)
    const [isScrolling, setIsScrolling] = useState(false)
    const scrollTimeout = useRef(null)
    const lastScrollY = useRef(0)

    // ✅ DETECTAR: Si mostrar el botón
    const shouldShow = useCallback(() => {
        const scrollY = window.scrollY
        return scrollY > threshold && showCondition()
    }, [threshold, showCondition])

    // ✅ MANEJAR: Scroll con throttling
    const handleScroll = useCallback(() => {
        if (scrollTimeout.current) return

        scrollTimeout.current = requestAnimationFrame(() => {
            const currentScrollY = window.scrollY
            const shouldShowButton = shouldShow()
            
            setIsVisible(shouldShowButton)
            lastScrollY.current = currentScrollY
            
            scrollTimeout.current = null
        })
    }, [shouldShow])

    // ✅ FUNCIÓN: Scroll hacia arriba
    const scrollToTop = useCallback(() => {
        setIsScrolling(true)
        
        if (smooth) {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            })
            
            // ✅ DETECTAR: Cuando termina el scroll
            const checkScrollEnd = () => {
                if (window.scrollY === 0) {
                    setIsScrolling(false)
                } else {
                    requestAnimationFrame(checkScrollEnd)
                }
            }
            
            requestAnimationFrame(checkScrollEnd)
        } else {
            window.scrollTo(0, 0)
            setIsScrolling(false)
        }
    }, [smooth])

    // ✅ EVENT LISTENERS
    useEffect(() => {
        window.addEventListener('scroll', handleScroll, { passive: true })
        
        return () => {
            window.removeEventListener('scroll', handleScroll)
            if (scrollTimeout.current) {
                cancelAnimationFrame(scrollTimeout.current)
            }
        }
    }, [handleScroll])

    // ✅ RENDERIZADO CONDICIONAL
    if (!isVisible) {
        return null
    }

    return (
        <button
            className={`${styles.scrollToTop} ${isScrolling ? styles.scrolling : ''}`}
            onClick={scrollToTop}
            disabled={isScrolling}
            aria-label="Subir al principio"
            title="Subir al principio"
        >
            {children || (
                <>
                    <svg 
                        className={styles.icon} 
                        viewBox="0 0 24 24" 
                        fill="none" 
                        stroke="currentColor"
                    >
                        <path 
                            strokeLinecap="round" 
                            strokeLinejoin="round" 
                            strokeWidth={2} 
                            d="M5 10l7-7m0 0l7 7m-7-7v18" 
                        />
                    </svg>
                    <span className={styles.text}>Subir</span>
                </>
            )}
        </button>
    )
} 