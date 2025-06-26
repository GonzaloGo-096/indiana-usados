/**
 * Login - Página de inicio de sesión para administradores
 * 
 * @author Indiana Usados
 * @version 1.0.0
 */

import React from 'react'
import LoginForm from '../../../components/forms/LoginForm'
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
        setErrors({})
        
        // Usar el hook de autenticación
        const result = await login(values)
        
        if (result.success) {
            navigate(AUTH_CONFIG.routes.dashboard)
        } else {
            setErrors({
                usuario: result.error || 'Error de autenticación',
                contraseña: result.error || 'Error de autenticación',
            })
        }
    }

    // Si está cargando, mostrar loading
    if (isLoading) {
        return (
            <div className={styles.container}>
                <div className={styles.content}>
                    <div className={styles.card}>
                        <div className={styles.cardBody}>
                            <div>Cargando...</div>
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