import { useState, useEffect, useCallback } from 'react'
import { AUTH_CONFIG } from '@config/auth'
import { authService } from '@services'

export const useAuth = () => {
  const [user, setUser] = useState(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  // Función de logout
  const logout = useCallback(async () => {
    try {
      // Llamar al backend para invalidar el token
      await authService.logout()
    } catch (error) {
      console.error('Error during logout:', error)
      // Continuar con la limpieza local aunque falle la API
    } finally {
      // Limpiar localStorage usando función centralizada
      authService.clearLocalStorage()
      
      setUser(null)
      setIsAuthenticated(false)
      setError(null)
    }
  }, [])

  // Verificar si hay un token válido
  const checkAuthStatus = useCallback(async () => {
    try {
      const token = localStorage.getItem(AUTH_CONFIG.storage.tokenKey)
      const userData = localStorage.getItem(AUTH_CONFIG.storage.userKey)

      if (token && userData) {
        // En desarrollo, solo verificamos que exista el token
        // En producción, podríamos verificar con el backend
        const isDevelopment = AUTH_CONFIG.development.enableMock
        
        if (isDevelopment) {
          const parsedUser = JSON.parse(userData)
          setUser(parsedUser)
          setIsAuthenticated(true)
        } else {
          // Verificar token con el backend
          const verification = await authService.verifyToken()
          if (verification.valid) {
            setUser(verification.user || JSON.parse(userData))
            setIsAuthenticated(true)
          } else {
            // Token inválido, limpiar
            logout()
          }
        }
      } else {
        // No está autenticado
        setUser(null)
        setIsAuthenticated(false)
      }
    } catch (error) {
      console.error('Error checking auth status:', error)
      logout()
    } finally {
      setIsLoading(false)
    }
  }, [logout])

  // Verificar autenticación al cargar
  useEffect(() => {
    checkAuthStatus()
  }, [checkAuthStatus])

  // Función de login
  const login = useCallback(async (credentials) => {
    try {
      setError(null)
      setIsLoading(true)

      const response = await authService.login(credentials)
      
      if (response.success) {
        const { token, user: userData } = response.data
        
        // ✅ LOG ESENCIAL: Token recibido
        console.log('🎫 TOKEN RECIBIDO:', {
          token: token?.substring(0, 50) + '...',
          tokenLength: token?.length,
          hasToken: !!token
        })
        
        // Guardar en localStorage
        localStorage.setItem(AUTH_CONFIG.storage.tokenKey, token)
        localStorage.setItem(AUTH_CONFIG.storage.userKey, JSON.stringify(userData))
        
        setUser(userData)
        setIsAuthenticated(true)
        
        return { success: true, data: userData }
      } else {
        // Error del backend
        const errorMessage = response.message || 'Error de autenticación'
        setError(errorMessage)
        return { success: false, error: errorMessage }
      }
    } catch (error) {
      // Error de red o conexión
      const errorMessage = error.message || 'Error de conexión con el servidor'
      setError(errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Obtener token actual
  const getToken = useCallback(() => {
    return localStorage.getItem(AUTH_CONFIG.storage.tokenKey)
  }, [])

  // Limpiar errores
  const clearError = useCallback(() => {
    setError(null)
  }, [])

  return {
    user,
    isAuthenticated,
    isLoading,
    error,
    login,
    logout,
    getToken,
    clearError
  }
} 