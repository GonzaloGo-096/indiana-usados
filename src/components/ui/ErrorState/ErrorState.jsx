/**
 * ErrorState - Componente para mostrar estados de error
 * 
 * @author Indiana Usados
 * @version 1.0.0
 */

import React from 'react'
import { Link } from 'react-router-dom'
import styles from './ErrorState.module.css'

/**
 * Componente ErrorState
 * @param {Object} props - Propiedades del componente
 * @param {string} props.title - Título del error
 * @param {string} props.message - Mensaje descriptivo del error
 * @param {string} props.actionText - Texto del botón de acción
 * @param {string} props.actionLink - Enlace del botón de acción
 * @param {string} props.variant - Variante del error ('error', 'notFound', 'warning')
 */
export const ErrorState = ({ 
    title, 
    message, 
    actionText, 
    actionLink, 
    variant = 'error' 
}) => {
    return (
        <div className={styles.container}>
            <div className={`${styles.errorContainer} ${styles[variant]}`}>
                <div className={styles.content}>
                    <h4 className={styles.title}>{title}</h4>
                    <p className={styles.message}>{message}</p>
                    {actionText && actionLink && (
                        <>
                            <hr className={styles.divider} />
                            <Link to={actionLink} className={styles.button}>
                                {actionText}
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </div>
    )
} 