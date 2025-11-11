import { AUTH_CONFIG } from '@config/auth'
import { config } from '@config'
import { authAxiosInstance } from '@api/axiosInstance'
import { logger } from '@utils/logger'

/**
 * Servicio de autenticación para backend Node.js REAL
 * 
 * @author Indiana Usados
 * @version 3.0.0 - Migrado a axiosInstance
 */

// Función helper para limpiar localStorage (centralizada)
const clearLocalStorage = () => {
  localStorage.removeItem(AUTH_CONFIG.storage.tokenKey)
  localStorage.removeItem(AUTH_CONFIG.storage.userKey)
}





/**
 * Servicios de autenticación
 */
export const authService = {
  // Login - Listo para backend Node.js REAL con axiosInstance
  login: async (credentials) => {

    // ✅ BACKEND REAL: Enviar datos en formato correcto
    const loginData = {
      username: credentials.username,
      password: credentials.password
    }

    try {
      // ✅ LOG PROFESIONAL: Intentando login
      logger.debug('auth:login', 'Iniciando proceso de login', {
        endpoint: AUTH_CONFIG.api.endpoints.login,
        baseURL: config.api.baseURL,
        timeout: config.api.timeout,
        username: credentials.username
      })

      // ✅ USAR AXIOS INSTANCE EN LUGAR DE FETCH
      logger.debug('auth:login', 'Enviando request al backend')
      const response = await authAxiosInstance.post(AUTH_CONFIG.api.endpoints.login, loginData)

      // ✅ LOG PROFESIONAL: Respuesta del backend
      logger.info('auth:login', 'Respuesta recibida del backend', {
        status: response.status,
        hasError: !!response.data.error,
        hasToken: !!response.data.token
      })

      // ✅ ADAPTAR A LA RESPUESTA REAL DEL BACKEND
      if (response.data.error) {
        throw new Error(response.data.msg || 'Error en el login')
      }

      return {
        success: true,
        data: {
          token: response.data.token,
          user: {
            username: credentials.username,
            role: 'user'
          }
        }
      }
    } catch (error) {
      // ✅ LOG PROFESIONAL: Error detallado
      logger.error('auth:login', 'Error durante login', {
        message: error.message,
        status: error.response?.status,
        code: error.code,
        isTimeout: error.code === 'ECONNABORTED',
        isNetworkError: !error.response
      })

      // ✅ MANEJO ESPECÍFICO DE TIMEOUT
      if (error.code === 'ECONNABORTED') {
        return {
          success: false,
          message: `Timeout: El backend no respondió en ${config.api.timeout}ms. Verifica que esté ejecutándose en ${config.api.baseURL}`
        }
      }

      // ✅ MANEJO DE ERRORES DE RED
      if (!error.response) {
        return {
          success: false,
          message: `Error de conexión: No se pudo conectar con ${config.api.baseURL}. Verifica que el backend esté ejecutándose.`
        }
      }

      return {
        success: false,
        message: error.response?.data?.msg || error.message || 'Error de conexión'
      }
    }
  },

  // Logout - Simplificado para backend real (sin endpoint de logout)
  logout: async () => {
    const token = localStorage.getItem(AUTH_CONFIG.storage.tokenKey)
    
    if (token) {
      try {
        // ✅ BACKEND REAL: No hay endpoint de logout, solo limpiar local
        logger.debug('auth:logout', 'Token encontrado, limpiando localStorage')
      } catch (error) {
        logger.error('auth:logout', 'Error durante logout', { error: error.message })
        // Continuar con la limpieza local aunque falle
      }
    }
    
    // Limpiar localStorage (centralizado)
    clearLocalStorage()
  },

  // Verificar token (simplificado para backend real)
  verifyToken: async () => {
    const token = localStorage.getItem(AUTH_CONFIG.storage.tokenKey)
    
    if (!token) {
      logger.debug('auth:verify', 'No token found')
      return { valid: false }
    }

    try {
      // ✅ BACKEND REAL: No hay endpoint de verificación
      // Los interceptors de Axios manejan tokens expirados automáticamente
      logger.debug('auth:verify', 'Token found, trusting interceptors for validation')
      return { valid: true }
    } catch (error) {
      logger.error('auth:verify', 'Error during token verification', { error: error.message })
      return { valid: false, error: error.message }
    }
  },



  // Función helper para limpiar localStorage (exportada para uso externo)
  clearLocalStorage
} 