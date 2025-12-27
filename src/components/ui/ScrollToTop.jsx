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

import React, { useState, useEffect } from 'react'
import { ArrowUpIcon } from '@components/ui/icons'
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
                    <ArrowUpIcon className={styles.icon} />
                    <span className={styles.text}>Subir</span>
                </>
            )}
        </button>
    )
} 