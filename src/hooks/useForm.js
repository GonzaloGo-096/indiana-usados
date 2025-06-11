import { useState, useCallback } from 'react'

export const useForm = (initialValues = {}) => {
    const [values, setValues] = useState(initialValues)
    const [errors, setErrors] = useState({})

    const handleChange = useCallback((e) => {
        const { name, value } = e.target
        setValues(prev => ({
            ...prev,
            [name]: value
        }))
        // Limpiar error del campo cuando el usuario modifica
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }))
        }
    }, [errors])

    const resetForm = useCallback(() => {
        setValues(initialValues)
        setErrors({})
    }, [initialValues])

    const validateForm = useCallback(() => {
        const newErrors = {}
        
        // Validación básica de campos requeridos
        Object.entries(values).forEach(([key, value]) => {
            if (!value) {
                newErrors[key] = 'Este campo es requerido'
            }
        })

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }, [values])

    const handleSubmit = useCallback((e, callback) => {
        e.preventDefault()
        if (validateForm()) {
            callback(values)
        }
    }, [values, validateForm])

    return {
        values,
        errors,
        handleChange,
        handleSubmit,
        resetForm,
        setErrors
    }
} 