import React from 'react'
import './Modal.css'

export const Modal = ({ 
    isOpen, 
    onClose, 
    title, 
    children, 
    size = 'medium',
    className = ''
}) => {
    if (!isOpen) return null

    const sizeClass = `modal-${size}`
    
    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className={`modal ${sizeClass} ${className}`} onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <h3 className="modal-title">{title}</h3>
                    <button 
                        type="button" 
                        className="btn-close" 
                        onClick={onClose}
                        aria-label="Cerrar"
                    />
                </div>
                <div className="modal-body">
                    {children}
                </div>
            </div>
        </div>
    )
} 