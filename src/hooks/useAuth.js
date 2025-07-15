import { useState, useEffect, useCallback } from 'react'
import { AUTH_CONFIG } from '../config/auth'
import { authService } from '../services/authService'

export const useAuth = () => {
  const [user, setUser] = useState(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  // Verificar autenticación al cargar
  useEffect(() => {
    checkAuthStatus()
  }, [])

  // Verificar si hay un token válido
  const checkAuthStatus = useCallback(async () => {
    try {
      const token = localStorage.getItem(AUTH_CONFIG.storage.tokenKey)
      const userData = localStorage.getItem(AUTH_CONFIG.storage.userKey)

      if (token && userData) {
        // Para desarrollo, solo verificamos que exista el token
        setUser(JSON.parse(userData))
        setIsAuthenticated(true)
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
  }, [])

  // Función de login
  const login = useCallback(async (credentials) => {
    try {
      setError(null)
      setIsLoading(true)

      const response = await authService.login(credentials)
      
      if (response.success) {
        const { token, user: userData } = response.data
        
        // Guardar en localStorage
        localStorage.setItem(AUTH_CONFIG.storage.tokenKey, token)
        localStorage.setItem(AUTH_CONFIG.storage.userKey, JSON.stringify(userData))
        
        setUser(userData)
        setIsAuthenticated(true)
        
        return { success: true, data: userData }
      } else {
        throw new Error(response.message || 'Error de autenticación')
      }
    } catch (error) {
      setError(error.message)
      return { success: false, error: error.message }
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Función de logout
  const logout = useCallback(async () => {
    try {
      // Llamar al backend para invalidar el token (opcional)
      await authService.logout()
    } catch (error) {
      console.error('Error during logout:', error)
    } finally {
      // Limpiar localStorage
      localStorage.removeItem(AUTH_CONFIG.storage.tokenKey)
      localStorage.removeItem(AUTH_CONFIG.storage.userKey)
      
      setUser(null)
      setIsAuthenticated(false)
      setError(null)
    }
  }, [])

  // Obtener token actual
  const getToken = useCallback(() => {
    return localStorage.getItem(AUTH_CONFIG.storage.tokenKey)
  }, [])

  return {
    user,
    isAuthenticated,
    isLoading,
    error,
    login,
    logout,
    getToken
  }
} 