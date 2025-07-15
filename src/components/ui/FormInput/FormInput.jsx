import React from 'react'
import './FormInput.css'

export const FormInput = ({ 
    label, 
    type = 'text', 
    name, 
    value, 
    onChange, 
    error, 
    required = false,
    className = '',
    placeholder = '',
    size = 'medium'
}) => {
    return (
        <div className={`form-input form-input-${size} ${className}`}>
            {label && (
                <label htmlFor={name} className="form-input__label">
                    {label}
                    {required && <span className="form-input__required">*</span>}
                </label>
            )}
            <input
                type={type}
                className={`form-input__field ${error ? 'form-input__field--error' : ''}`}
                id={name}
                name={name}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                required={required}
            />
            {error && (
                <div className="form-input__error">
                    {error}
                </div>
            )}
        </div>
    )
} 