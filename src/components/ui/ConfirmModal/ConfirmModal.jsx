/**
 * ConfirmModal - Modal de confirmación profesional
 * 
 * Reemplaza window.confirm con un modal personalizado y estilizado
 * 
 * @author Indiana Usados
 * @version 1.0.0
 */

import React, { useEffect } from 'react'
import styles from './ConfirmModal.module.css'

/**
 * ConfirmModal - Componente de confirmación
 * @param {boolean} isOpen - Si el modal está abierto
 * @param {string} title - Título del modal
 * @param {string} message - Mensaje de confirmación
 * @param {string} confirmText - Texto del botón de confirmar (default: "Confirmar")
 * @param {string} cancelText - Texto del botón de cancelar (default: "Cancelar")
 * @param {string} variant - Variante del botón de confirmar (danger, warning, primary)
 * @param {function} onConfirm - Función a ejecutar al confirmar
 * @param {function} onCancel - Función a ejecutar al cancelar
 */
const ConfirmModal = ({
    isOpen,
    title = "Confirmar acción",
    message,
    confirmText = "Confirmar",
    cancelText = "Cancelar",
    variant = "danger",
    onConfirm,
    onCancel
}) => {
    // ✅ Cerrar con ESC
    useEffect(() => {
        if (!isOpen) return

        const handleEsc = (e) => {
            if (e.key === 'Escape') {
                onCancel?.()
            }
        }

        document.addEventListener('keydown', handleEsc)
        // ✅ Prevenir scroll del body cuando el modal está abierto
        document.body.style.overflow = 'hidden'

        return () => {
            document.removeEventListener('keydown', handleEsc)
            document.body.style.overflow = ''
        }
    }, [isOpen, onCancel])

    if (!isOpen) return null

    return (
        <div 
            className={styles.overlay}
            onClick={onCancel}
            role="dialog"
            aria-modal="true"
            aria-labelledby="confirm-modal-title"
            aria-describedby="confirm-modal-message"
        >
            <div 
                className={styles.modal}
                onClick={(e) => e.stopPropagation()}
            >
                <div className={styles.header}>
                    <h2 id="confirm-modal-title" className={styles.title}>
                        {title}
                    </h2>
                </div>
                
                <div className={styles.body}>
                    <p id="confirm-modal-message" className={styles.message}>
                        {message}
                    </p>
                </div>
                
                <div className={styles.footer}>
                    <button
                        type="button"
                        className={styles.cancelButton}
                        onClick={onCancel}
                        aria-label={cancelText}
                    >
                        {cancelText}
                    </button>
                    <button
                        type="button"
                        className={`${styles.confirmButton} ${styles[variant]}`}
                        onClick={onConfirm}
                        aria-label={confirmText}
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    )
}

export default ConfirmModal

