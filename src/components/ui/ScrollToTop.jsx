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
    children 
}) => {
    const [isVisible, setIsVisible] = useState(false)

    // ✅ FUNCIÓN: Scroll hacia arriba ULTRA SIMPLE
    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    // ✅ MANEJAR: Scroll SIMPLE Y DIRECTO
    useEffect(() => {
        const handleScroll = () => {
            const shouldShow = window.scrollY > threshold
            setIsVisible(shouldShow)
        }
        
        window.addEventListener('scroll', handleScroll, { passive: true })
        return () => window.removeEventListener('scroll', handleScroll)
    }, [threshold])

    // ✅ RENDERIZADO CONDICIONAL
    if (!isVisible) {
        return null
    }

    return (
        <button
            className={styles.scrollToTop}
            onClick={scrollToTop}
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