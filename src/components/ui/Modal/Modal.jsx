/**
 * Modal - Componente modal optimizado con lazy loading
 * 
 * Características:
 * - Modal responsive
 * - Backdrop con blur
 * - Animaciones suaves
 * - ✅ NUEVO: Lazy loading inteligente
 * 
 * @author Indiana Usados
 * @version 2.0.0 - Lazy loading inteligente
 */

import React, { useEffect, useCallback, lazy, Suspense } from 'react'
import { LoadingSpinner } from '@ui'
import styles from './Modal.module.css'

// ✅ NUEVO: Lazy loading del contenido del modal
const ModalContent = lazy(() => import('./ModalContent'))

const Modal = ({ 
    isOpen, 
    onClose, 
    title, 
    children, 
    size = 'medium',
    showCloseButton = true,
    closeOnBackdrop = true,
    closeOnEscape = true
}) => {
    // ✅ ESCAPE KEY: Cerrar con ESC
    const handleEscape = useCallback((event) => {
        if (event.key === 'Escape' && closeOnEscape) {
            onClose()
        }
    }, [onClose, closeOnEscape])

    // ✅ EVENT LISTENERS: Agregar/remover listeners
    useEffect(() => {
        if (isOpen) {
            document.addEventListener('keydown', handleEscape)
            document.body.style.overflow = 'hidden' // Prevenir scroll
        }

        return () => {
            document.removeEventListener('keydown', handleEscape)
            document.body.style.overflow = 'unset' // Restaurar scroll
        }
    }, [isOpen, handleEscape])

    // ✅ BACKDROP CLICK: Cerrar al hacer clic fuera
    const handleBackdropClick = useCallback((event) => {
        if (event.target === event.currentTarget && closeOnBackdrop) {
            onClose()
        }
    }, [onClose, closeOnBackdrop])

    if (!isOpen) return null

    return (
        <div className={styles.modalOverlay} onClick={handleBackdropClick}>
            <div className={`${styles.modal} ${styles[size]}`}>
                {/* Header */}
                <div className={styles.modalHeader}>
                    {title && <h2 className={styles.modalTitle}>{title}</h2>}
                    {showCloseButton && (
                        <button 
                            className={styles.closeButton}
                            onClick={onClose}
                            aria-label="Cerrar modal"
                        >
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <line x1="18" y1="6" x2="6" y2="18"></line>
                                <line x1="6" y1="6" x2="18" y2="18"></line>
                            </svg>
                        </button>
                    )}
                </div>

                {/* Content con lazy loading */}
                <div className={styles.modalContent}>
                    <Suspense fallback={
                        <div className={styles.loadingContainer}>
                            <LoadingSpinner 
                                message="Cargando contenido..." 
                                size="small" 
                                fullScreen={false}
                            />
                        </div>
                    }>
                        <ModalContent>
                            {children}
                        </ModalContent>
                    </Suspense>
                </div>
            </div>
        </div>
    )
}

export default Modal 