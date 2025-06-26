import { Navigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { AUTH_CONFIG } from '../../config/auth'

export const RequireAuth = ({ children }) => {
    const { isAuthenticated, isLoading } = useAuth()

    // Mostrar loading mientras verifica autenticación
    if (isLoading) {
        return (
            <div style={{ 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center', 
                height: '100vh' 
            }}>
                <div>Cargando...</div>
            </div>
        )
    }

    return isAuthenticated ? children : <Navigate to={AUTH_CONFIG.routes.login} replace />
} 