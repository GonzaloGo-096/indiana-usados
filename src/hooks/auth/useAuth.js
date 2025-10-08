/**
 * useAuth - Hook consolidado para autenticación completa
 * 
 * ✅ REFACTORIZADO v3.0.0: Consolidado con useAutoLogout + validación de token
 * 
 * Responsabilidades:
 * - Gestión completa de autenticación (login, logout, estado)
 * - Validación automática de tokens expirados
 * - Auto-logout en cambio de página
 * - Manejo robusto de errores y retry
 * - Ciclo de vida completo de sesión
 * 
 * @author Indiana Usados
 * @version 3.0.0 - Consolidado y seguro
 */

import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { AUTH_CONFIG } from '@config/auth'
import { logger } from '@utils/logger'
import { authService } from '@services'

export const useAuth = () => {
  const navigate = useNavigate()
  
  // Estados de autenticación
  const [user, setUser] = useState(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  // ✅ NUEVO: Validar si un token está expirado
  const isTokenExpired = useCallback((token) => {
    if (!token) return true
    
    try {
      // Decodificar JWT (solo payload, sin verificar firma)
      const payload = JSON.parse(atob(token.split('.')[1]))
      const currentTime = Math.floor(Date.now() / 1000)
      
      // Verificar expiración
      if (payload.exp && payload.exp < currentTime) {
        logger.warn('auth:token', 'Token expirado detectado', {
          exp: payload.exp,
          currentTime,
          expired: true
        })
        return true
      }
      
      return false
    } catch (error) {
      logger.error('auth:token', 'Error decodificando token', { error: error.message })
      return true // Si no se puede decodificar, considerarlo expirado
    }
  }, [])

  // ✅ MEJORADO: Verificar autenticación con validación de token
  const checkAuthStatus = useCallback(async () => {
    try {
      const token = localStorage.getItem(AUTH_CONFIG.storage.tokenKey)
      const userData = localStorage.getItem(AUTH_CONFIG.storage.userKey)

      if (token && userData) {
        // ✅ NUEVO: Validar expiración del token
        if (isTokenExpired(token)) {
          logger.info('auth:check', 'Token expirado, limpiando sesión')
          await logout()
          return
        }

        try {
          const parsedUser = JSON.parse(userData)
          setUser(parsedUser)
          setIsAuthenticated(true)
          logger.debug('auth:check', 'Sesión válida restaurada')
        } catch (error) {
          logger.error('auth:parseUserData', 'Error parsing user data', { error: error.message })
          await logout()
        }
      } else {
        // No está autenticado
        setUser(null)
        setIsAuthenticated(false)
        logger.debug('auth:check', 'No hay sesión activa')
      }
    } catch (error) {
      logger.error('auth:checkStatus', 'Error checking auth status', { error: error.message })
      await logout()
    } finally {
      setIsLoading(false)
    }
  }, [isTokenExpired])

  // ✅ MEJORADO: Logout con limpieza completa
  const logout = useCallback(async () => {
    try {
      logger.info('auth:logout', 'Iniciando logout')
      
      // Limpiar localStorage
      authService.clearLocalStorage()
      
      // Limpiar estado
      setUser(null)
      setIsAuthenticated(false)
      setError(null)
      
      logger.info('auth:logout', 'Logout completado')
    } catch (error) {
      logger.error('auth:logout', 'Error durante logout', { error: error.message })
      // Continuar con la limpieza local aunque falle
      setUser(null)
      setIsAuthenticated(false)
      setError(null)
    }
  }, [])

  // ✅ MEJORADO: Login con mejor manejo de errores
  const login = useCallback(async (credentials) => {
    try {
      setError(null)
      setIsLoading(true)

      logger.debug('auth:login', 'Iniciando proceso de login', {
        username: credentials.username
      })

      const response = await authService.login(credentials)
      
      if (response.success) {
        const { token, user: userData } = response.data
        
        // ✅ NUEVO: Validar token antes de guardarlo
        if (isTokenExpired(token)) {
          throw new Error('Token recibido está expirado')
        }
        
        // Guardar en localStorage
        localStorage.setItem(AUTH_CONFIG.storage.tokenKey, token)
        localStorage.setItem(AUTH_CONFIG.storage.userKey, JSON.stringify(userData))
        
        // Actualizar estado
        setUser(userData)
        setIsAuthenticated(true)
        
        logger.info('auth:login', 'Login exitoso', {
          username: userData.username,
          tokenLength: token?.length
        })
        
        return { success: true, data: userData }
      } else {
        const errorMessage = response.message || 'Error de autenticación'
        setError(errorMessage)
        logger.warn('auth:login', 'Login fallido', { error: errorMessage })
        return { success: false, error: errorMessage }
      }
    } catch (error) {
      const errorMessage = error.message || 'Error de conexión con el servidor'
      setError(errorMessage)
      logger.error('auth:login', 'Error durante login', { error: errorMessage })
      return { success: false, error: errorMessage }
    } finally {
      setIsLoading(false)
    }
  }, [isTokenExpired])

  // ✅ NUEVO: Auto-logout integrado (reemplaza useAutoLogout)
  useEffect(() => {
    if (!isAuthenticated) return

    const handlePageHide = () => {
      logger.info('auth:autoLogout', 'Cambio de página detectado, cerrando sesión')
      authService.clearLocalStorage()
      navigate(AUTH_CONFIG.routes.login)
    }

    const handleBeforeUnload = (event) => {
      // Opcional: Confirmar antes de cerrar
      const message = '¿Estás seguro de que quieres cerrar la sesión?'
      event.returnValue = message
      return message
    }

    // Event listeners
    window.addEventListener('pagehide', handlePageHide)
    window.addEventListener('beforeunload', handleBeforeUnload)

    return () => {
      window.removeEventListener('pagehide', handlePageHide)
      window.removeEventListener('beforeunload', handleBeforeUnload)
    }
  }, [isAuthenticated, navigate])

  // ✅ MEJORADO: Verificar autenticación al cargar
  useEffect(() => {
    checkAuthStatus()
  }, [checkAuthStatus])

  // ✅ NUEVO: Verificar token periódicamente (cada 5 minutos)
  useEffect(() => {
    if (!isAuthenticated) return

    const interval = setInterval(() => {
      const token = localStorage.getItem(AUTH_CONFIG.storage.tokenKey)
      if (token && isTokenExpired(token)) {
        logger.info('auth:periodic', 'Token expirado detectado, cerrando sesión')
        logout()
      }
    }, 5 * 60 * 1000) // 5 minutos

    return () => clearInterval(interval)
  }, [isAuthenticated, isTokenExpired, logout])

  // Funciones utilitarias
  const getToken = useCallback(() => {
    const token = localStorage.getItem(AUTH_CONFIG.storage.tokenKey)
    return token && !isTokenExpired(token) ? token : null
  }, [isTokenExpired])

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