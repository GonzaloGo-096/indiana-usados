/**
 * Login - Página de inicio de sesión para administradores
 * 
 * @author Indiana Usados
 * @version 1.0.0
 */

import React from 'react'
import { LoginForm } from '@components/auth/LoginForm'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@hooks/useAuth'
import { AUTH_CONFIG } from '@config/auth'
import styles from './Login.module.css'

const Login = () => {
    const navigate = useNavigate()
    const { login, isAuthenticated, isLoading, error, clearError } = useAuth()
    const [errors, setErrors] = React.useState({})
    const [isSubmitting, setIsSubmitting] = React.useState(false) // ✅ ESTADO SEPARADO PARA SUBMIT

    // Si ya está autenticado, redirigir
    React.useEffect(() => {
        if (isAuthenticated && !isLoading) {
            navigate(AUTH_CONFIG.routes.dashboard)
        }
    }, [isAuthenticated, isLoading, navigate])

    // ✅ SINCRONIZAR ERRORES DEL HOOK CON ESTADO LOCAL
    React.useEffect(() => {
        if (error) {
            setErrors({ general: error })
        }
    }, [error])

    const handleSubmit = async (values) => {
        clearError()
        setErrors({})
        setIsSubmitting(true)
        
        try {
            // Intentar login
            const result = await login(values)
            
            if (result.success) {
                // Login exitoso
                console.log('✅ LOGIN EXITOSO - Redirigiendo al dashboard')
                navigate('/admin')
            } else {
                // Error en login
                console.log('❌ LOGIN FALLIDO:', result.error)
                setErrors({ general: result.error || 'Error al iniciar sesión' })
            }
        } catch (error) {
            console.error('💥 ERROR:', error)
            setErrors({ general: 'Error al iniciar sesión' })
        } finally {
            setIsSubmitting(false)
        }
    }

    // Si está cargando, mostrar loading
    if (isLoading) {
        return (
            <div className={styles.container}>
                <div className={styles.content}>
                    <div className={styles.card}>
                        <div className={styles.cardBody}>
                            <div style={{ textAlign: 'center', fontSize: '18px', color: '#666' }}>
                                Verificando sesión...
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className={styles.container}>
            <div className={styles.content}>
                <div className={styles.card}>
                    <div className={styles.cardBody}>
                        <h2 className={styles.title}>Iniciar Sesión</h2>
                        
                        <div className={styles.credentials}>
                            <p>Usuario: indiana-autos</p>
                            <p>Contraseña: 12345678</p>
                        </div>
                        
                        {/* Mostrar error general */}
                        {error && (
                            <div className={styles.error}>
                                {error}
                            </div>
                        )}
                        
                        {errors.general && (
                            <div className={styles.error}>
                                {errors.general}
                            </div>
                        )}
                        
                        <LoginForm 
                            onSubmit={handleSubmit} 
                            isSubmitting={isSubmitting} 
                            errors={errors} 
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Login 