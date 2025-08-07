import { Navigate } from 'react-router-dom'
import { useAuth } from '@hooks/useAuth'
import { AUTH_CONFIG } from '@config/auth'

export const RequireAuth = ({ children }) => {
    const { isAuthenticated, isLoading } = useAuth()

    // Mostrar loading mientras verifica autenticación
    if (isLoading) {
        return (
            <div style={{ 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center', 
                height: '100vh',
                fontSize: '18px',
                color: '#666'
            }}>
                <div>Verificando autenticación...</div>
            </div>
        )
    }

    // Si está autenticado, mostrar el contenido
    if (isAuthenticated) {
        return children
    }

    // Si no está autenticado, redirigir al login
    return <Navigate to={AUTH_CONFIG.routes.login} replace />
} 