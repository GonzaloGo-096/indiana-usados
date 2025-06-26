/**
 * Modal - Componente de modal reutilizable
 * 
 * @author Indiana Usados
 * @version 1.0.0
 */

import React from 'react'
import styles from './Modal.module.css'

export const Modal = ({ 
    isOpen, 
    onClose, 
    title, 
    children, 
    size = 'medium',
    className = ''
}) => {
    if (!isOpen) return null

    const sizeClass = styles[size]
    
    return (
        <div className={styles.overlay} onClick={onClose}>
            <div className={`${styles.modal} ${sizeClass} ${className}`} onClick={e => e.stopPropagation()}>
                <div className={styles.header}>
                    <h3 className={styles.title}>{title}</h3>
                    <button 
                        type="button" 
                        className={styles.closeButton} 
                        onClick={onClose}
                        aria-label="Cerrar"
                    >
                        <span className={styles.closeIcon}>×</span>
                    </button>
                </div>
                <div className={styles.body}>
                    {children}
                </div>
            </div>
        </div>
    )
} 