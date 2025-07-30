/**
 * Login - Página de inicio de sesión para administradores
 * 
 * @author Indiana Usados
 * @version 1.0.0
 */

import React from 'react'
import LoginForm from '../../../components/auth/LoginForm'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../../hooks/useAuth'
import { AUTH_CONFIG } from '../../../config/auth'
import styles from './Login.module.css'

const Login = () => {
    const navigate = useNavigate()
    const { login, isAuthenticated, isLoading } = useAuth()
    const [errors, setErrors] = React.useState({})

    // Si ya está autenticado, redirigir
    React.useEffect(() => {
        if (isAuthenticated && !isLoading) {
            navigate(AUTH_CONFIG.routes.dashboard)
        }
    }, [isAuthenticated, isLoading, navigate])

    const handleSubmit = async (values) => {
        setIsLoading(true)
        setError(null)
        
        try {
            // Intentar login
            const result = await loginMutation.mutateAsync(values)
            
            if (result.success) {
                // Login exitoso
                navigate('/admin/dashboard')
            } else {
                // Error en login
                setError(result.error || 'Error al iniciar sesión')
            }
        } catch (error) {
            setError('Error al iniciar sesión')
        } finally {
            setIsLoading(false)
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
                        <p style={{ textAlign: 'center', marginBottom: '20px', color: '#666', fontSize: '14px' }}>
                            Usuario: admin | Contraseña: admin123
                        </p>
                        <LoginForm 
                            onSubmit={handleSubmit} 
                            isSubmitting={isLoading} 
                            errors={errors} 
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Login 