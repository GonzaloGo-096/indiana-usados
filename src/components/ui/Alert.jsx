import React from 'react'
import './Alert.css'

export const Alert = ({ 
    children, 
    variant = 'info', 
    dismissible = false,
    onDismiss,
    className = ''
}) => {
    const baseClass = 'alert'
    const variantClass = `alert-${variant}`
    const dismissibleClass = dismissible ? 'alert-dismissible' : ''
    
    return (
        <div className={`${baseClass} ${variantClass} ${dismissibleClass} ${className}`}>
            {children}
            {dismissible && (
                <button 
                    type="button" 
                    className="btn-close" 
                    onClick={onDismiss}
                    aria-label="Cerrar"
                />
            )}
        </div>
    )
} 