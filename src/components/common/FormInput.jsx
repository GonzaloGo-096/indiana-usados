import React from 'react'

export const FormInput = ({ 
    label, 
    type = 'text', 
    name, 
    value, 
    onChange, 
    error, 
    required = false,
    className = ''
}) => {
    return (
        <div className={`mb-3 ${className}`}>
            <label htmlFor={name} className="form-label">
                {label}
                {required && <span className="text-danger">*</span>}
            </label>
            <input
                type={type}
                className={`form-control ${error ? 'is-invalid' : ''}`}
                id={name}
                name={name}
                value={value}
                onChange={onChange}
                required={required}
            />
            {error && (
                <div className="invalid-feedback">
                    {error}
                </div>
            )}
        </div>
    )
} 