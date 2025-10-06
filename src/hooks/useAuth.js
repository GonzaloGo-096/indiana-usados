import { useState, useEffect, useCallback } from 'react'
import { AUTH_CONFIG } from '@config/auth'
import { logger } from '@utils/logger'
import { authService } from '@services'

export const useAuth = () => {
  const [user, setUser] = useState(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  // Función de logout simplificada
  const logout = useCallback(async () => {
    try {
      // authService.logout() ya maneja clearLocalStorage internamente
      await authService.logout()
      logger.info('auth:logout', 'Logout exitoso')
    } catch (error) {
      logger.error('auth:logout', 'Error durante logout', { error: error.message })
      // Continuar con la limpieza local aunque falle la API
    } finally {
      // Solo limpiar estado local - localStorage ya fue limpiado por authService
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
        // ✅ SIMPLIFICADO: Solo verificar que exista el token
        try {
          const parsedUser = JSON.parse(userData)
          setUser(parsedUser)
          setIsAuthenticated(true)
        } catch (error) {
          logger.error('auth:parseUserData', 'Error parsing user data', { error: error.message })
          logout()
        }
      } else {
        // No está autenticado
        setUser(null)
        setIsAuthenticated(false)
      }
    } catch (error) {
      logger.error('auth:checkStatus', 'Error checking auth status', { error: error.message })
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
        
        // ✅ LOG PROFESIONAL: Token recibido
        logger.info('auth:login', 'Token recibido exitosamente', {
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