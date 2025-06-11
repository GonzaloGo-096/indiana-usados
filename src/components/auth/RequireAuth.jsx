import { Navigate } from 'react-router-dom'

export const RequireAuth = ({ children }) => {
    // TODO: Implementar lógica de autenticación
    const isAuthenticated = true // Esto vendrá de tu contexto de auth

    return isAuthenticated ? children : <Navigate to="/admin/login" replace />
} 