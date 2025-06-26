/**
 * Alert - Componente de alerta reutilizable
 * 
 * Características:
 * - Múltiples variantes (info, success, warning, error)
 * - Opción de dismissible
 * - Diseño responsive
 * 
 * @author Indiana Usados
 * @version 1.0.0
 */

import React from 'react'
import styles from './Alert.module.css'

/**
 * Componente Alert
 * @param {React.ReactNode} children - Contenido de la alerta
 * @param {string} variant - Variante de la alerta (info, success, warning, error)
 * @param {boolean} dismissible - Si la alerta se puede cerrar
 * @param {function} onDismiss - Función para cerrar la alerta
 * @param {string} className - Clases CSS adicionales
 */
export const Alert = ({ 
    children, 
    variant = 'info', 
    dismissible = false,
    onDismiss,
    className = ''
}) => {
    const alertClasses = [
        styles.alert,
        styles[variant],
        dismissible && styles.dismissible,
        className
    ].filter(Boolean).join(' ')
    
    return (
        <div className={alertClasses}>
            {children}
            {dismissible && (
                <button 
                    type="button" 
                    className={styles.closeButton} 
                    onClick={onDismiss}
                    aria-label="Cerrar"
                >
                    ×
                </button>
            )}
        </div>
    )
} 