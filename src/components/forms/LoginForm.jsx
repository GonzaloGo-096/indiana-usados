import React from 'react'
import { useForm } from '../../hooks/useForm'
import { FormInput } from '../ui/FormInput'

const LoginForm = ({ onSubmit, isSubmitting, errors: externalErrors }) => {
    const { 
        values, 
        errors: formErrors, 
        handleChange, 
        handleSubmit,
        setErrors 
    } = useForm({ 
        usuario: '', 
        contraseña: '' 
    })

    // Si hay errores externos, los mostramos
    React.useEffect(() => {
        if (externalErrors) {
            setErrors(externalErrors)
        }
    }, [externalErrors, setErrors])

    // Combinamos errores del formulario con errores externos
    const errors = { ...formErrors, ...externalErrors }

    const onFormSubmit = (e) => {
        handleSubmit(e, onSubmit)
    }

    return (
        <form onSubmit={onFormSubmit}>
            <FormInput
                label="Usuario"
                type="text"
                name="usuario"
                value={values.usuario}
                onChange={handleChange}
                error={errors.usuario}
                required
            />
            <FormInput
                label="Contraseña"
                type="password"
                name="contraseña"
                value={values.contraseña}
                onChange={handleChange}
                error={errors.contraseña}
                required
            />
            <button 
                type="submit" 
                className="btn btn-primary w-100"
                disabled={isSubmitting}
            >
                {isSubmitting ? 'Iniciando sesión...' : 'Iniciar Sesión'}
            </button>
        </form>
    )
}

export default LoginForm 