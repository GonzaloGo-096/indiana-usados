/**
 * Login - Página de inicio de sesión para administradores
 * 
 * @author Indiana Usados
 * @version 1.0.0
 */

import React from 'react'
import { logger } from '@utils/logger'
import { LoginForm } from '@components/auth/LoginForm'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@hooks/useAuth'
import { AUTH_CONFIG } from '@config/auth'
import { config } from '@config'
import styles from './Login.module.css'

const Login = () => {
    const navigate = useNavigate()
    const { login, isAuthenticated, isLoading, error, clearError } = useAuth()
    const [isSubmitting, setIsSubmitting] = React.useState(false) // ✅ ESTADO SIMPLIFICADO
    
    // ✅ DEBUG TEMPORAL: Ver estado del hook
    logger.debug('auth:login', 'LOGIN DEBUG', {
        isAuthenticated,
        isLoading,
        error,
        hasToken: !!localStorage.getItem('auth_token'),
        hasUser: !!localStorage.getItem('auth_user')
    })

    // Si ya está autenticado, redirigir
    React.useEffect(() => {
        if (isAuthenticated && !isLoading) {
            navigate(AUTH_CONFIG.routes.dashboard)
        }
    }, [isAuthenticated, isLoading, navigate])

    // ✅ ERRORES MANEJADOS DIRECTAMENTE POR useAuth

    const handleSubmit = async (values) => {
        clearError()
        setIsSubmitting(true)
        
        try {
            // Intentar login
            const result = await login(values)
            
            if (result.success) {
                // Login exitoso - useAuth maneja la navegación automáticamente
                logger.info('auth:login', 'Login exitoso, redirigiendo')
                navigate('/admin')
            } else {
                // Error en login - useAuth ya maneja el error
                logger.warn('auth:login', 'Login fallido', { error: result.error })
            }
        } catch (error) {
            logger.error('auth:login', 'Error durante login', { error: error.message })
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
                        
                        {/* ✅ CREDENCIALES SOLO EN DESARROLLO */}
                        {config.isDevelopment && (
                            <div className={styles.credentials}>
                                <p><strong>Desarrollo:</strong> Usuario: indiana-autos | Contraseña: 12345678</p>
                            </div>
                        )}
                        
                        {/* Mostrar error general */}
                        {error && (
                            <div className={styles.error}>
                                {error}
                            </div>
                        )}
                        
                        <LoginForm 
                            onSubmit={handleSubmit} 
                            isSubmitting={isSubmitting} 
                            errors={{}} 
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Login 