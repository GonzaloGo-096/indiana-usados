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
            username: '', // ✅ CAMPOS VACÍOS
            password: ''  // ✅ CAMPOS VACÍOS
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
                    {...register('username', { // ✅ INTERNO: username
                        required: 'El usuario es requerido'
                    })}
                    className={styles.input}
                    disabled={isSubmitting}
                    placeholder="Ingresa tu usuario" // ✅ PLACEHOLDER GENÉRICO
                />
                {errors.username && (
                    <span className={styles.error}>{errors.username.message}</span>
                )}
            </div>

            <div className={styles.formGroup}>
                <label className={styles.label}>Contraseña</label>
                <input
                    type="password"
                    {...register('password', { // ✅ INTERNO: password
                        required: 'La contraseña es requerida'
                    })}
                    className={styles.input}
                    disabled={isSubmitting}
                    placeholder="Ingresa tu contraseña" // ✅ PLACEHOLDER GENÉRICO
                />
                {errors.password && (
                    <span className={styles.error}>{errors.password.message}</span>
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