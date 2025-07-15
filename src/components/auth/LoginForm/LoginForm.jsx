/**
 * LoginForm - Formulario de inicio de sesión
 * 
 * Migrado a React Hook Form para mantener consistencia con el resto del proyecto
 * 
 * @author Indiana Usados
 * @version 2.0.0
 */

import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import styles from './LoginForm.module.css'

const LoginForm = ({ onSubmit, isSubmitting, errors: externalErrors }) => {
    const { 
        register, 
        handleSubmit, 
        formState: { errors: formErrors },
        setError,
        clearErrors
    } = useForm({
        defaultValues: {
            usuario: '',
            contraseña: ''
        }
    })

    // Si hay errores externos, los mostramos
    useEffect(() => {
        if (externalErrors) {
            Object.entries(externalErrors).forEach(([field, message]) => {
                setError(field, { type: 'server', message })
            })
        } else {
            // Limpiar errores externos cuando no hay
            clearErrors()
        }
    }, [externalErrors, setError, clearErrors])

    // Combinamos errores del formulario con errores externos
    const errors = { ...formErrors.errors, ...externalErrors }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
            <div className={styles.formGroup}>
                <label className={styles.label}>Usuario</label>
                <input
                    type="text"
                    {...register('usuario', {
                        required: 'El usuario es requerido'
                    })}
                    className={styles.input}
                    disabled={isSubmitting}
                />
                {errors.usuario && (
                    <span className={styles.error}>{errors.usuario.message}</span>
                )}
            </div>

            <div className={styles.formGroup}>
                <label className={styles.label}>Contraseña</label>
                <input
                    type="password"
                    {...register('contraseña', {
                        required: 'La contraseña es requerida'
                    })}
                    className={styles.input}
                    disabled={isSubmitting}
                />
                {errors.contraseña && (
                    <span className={styles.error}>{errors.contraseña.message}</span>
                )}
            </div>

            <button 
                type="submit" 
                className={styles.submitButton}
                disabled={isSubmitting}
            >
                {isSubmitting ? 'Iniciando sesión...' : 'Iniciar Sesión'}
            </button>
        </form>
    )
}

export default LoginForm 