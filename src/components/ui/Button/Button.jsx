/**
 * Button - Componente de botón reutilizable
 * 
 * Características:
 * - Múltiples variantes (primary, secondary, outline)
 * - Diferentes tamaños
 * - Estados disabled
 * - Hover effects
 * 
 * @author Indiana Usados
 * @version 1.0.0
 */

import styles from './Button.module.css'

/**
 * Componente Button
 * @param {React.ReactNode} children - Contenido del botón
 * @param {string} variant - Variante del botón (primary, secondary, outline)
 * @param {string} size - Tamaño del botón (small, medium, large)
 * @param {boolean} disabled - Estado deshabilitado
 * @param {string} className - Clases CSS adicionales
 * @param {Object} props - Props adicionales
 */
export const Button = ({ 
    children, 
    variant = 'primary', 
    size = 'medium',
    disabled = false,
    className = '',
    type = 'button',
    ...props 
}) => {
    const buttonClasses = [
        styles.button,
        styles[variant],
        styles[size],
        disabled && styles.disabled,
        className
    ].filter(Boolean).join(' ')
    
    return (
        <button 
            className={buttonClasses}
            disabled={disabled}
            type={type}
            {...props}
        >
            {children}
        </button>
    )
} 