import { AUTH_CONFIG } from '@config/auth'
import { authAxiosInstance } from '@api/axiosInstance'

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

// Función mock temporal para desarrollo (sin backend)
const mockLogin = async (credentials) => {
  // Simular delay de red
  await new Promise(resolve => setTimeout(resolve, 500))
  
  // ✅ CREDENCIALES CORREGIDAS: Usar las del backend real
  if (credentials.username === 'indiana-autos' && credentials.password === '12345678') {
    return {
      success: true,
      data: {
        token: 'mock_jwt_token_' + Date.now(),
        user: {
          id: 1,
          username: 'indiana-autos',
          role: 'user',
          name: 'Indiana Autos'
        }
      }
    }
  } else {
    throw new Error('Credenciales inválidas')
  }
}

/**
 * Servicios de autenticación
 */
export const authService = {
  // Login - Listo para backend Node.js REAL con axiosInstance
  login: async (credentials) => {
    // Verificar si estamos en modo desarrollo (sin backend)
    const isDevelopment = AUTH_CONFIG.development.enableMock
    
    if (isDevelopment) {
      // Usar mock para desarrollo
      return mockLogin(credentials)
    }

    // ✅ BACKEND REAL: Enviar datos en formato correcto
    const loginData = {
      username: credentials.username,
      password: credentials.password
    }

    try {
      // ✅ LOG ESENCIAL: Intentando login
      console.log('🔐 LOGIN:', {
        endpoint: AUTH_CONFIG.api.endpoints.login,
        baseURL: AUTH_CONFIG.api.baseURL
      })

      // ✅ USAR AXIOS INSTANCE EN LUGAR DE FETCH
      const response = await authAxiosInstance.post(AUTH_CONFIG.api.endpoints.login, loginData)

      // ✅ LOG ESENCIAL: Respuesta del backend
      console.log('📥 RESPUESTA:', {
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
      // ✅ LOG ESENCIAL: Error
      console.error('❌ ERROR:', {
        message: error.message,
        status: error.response?.status
      })

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
        console.log('Logout: Token encontrado, limpiando localStorage')
      } catch (error) {
        console.error('Error durante logout:', error)
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
      return { valid: false }
    }

    try {
      // ✅ BACKEND REAL: No hay endpoint de verificación, solo verificar existencia local
      // En el futuro se puede implementar verificación JWT en el frontend
      return { valid: true, user: { username: 'indiana-autos', role: 'user' } }
    } catch (error) {
      return { valid: false, error: error.message }
    }
  },

  // Función helper para limpiar localStorage (exportada para uso externo)
  clearLocalStorage
} 