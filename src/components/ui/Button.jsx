import React from 'react'
import './Button.css'

export const Button = ({ 
    children, 
    variant = 'primary', 
    size = 'medium',
    className = '',
    ...props 
}) => {
    const baseClass = 'btn'
    const variantClass = `btn-${variant}`
    const sizeClass = `btn-${size}`
    
    return (
        <button 
            className={`${baseClass} ${variantClass} ${sizeClass} ${className}`}
            {...props}
        >
            {children}
        </button>
    )
} 