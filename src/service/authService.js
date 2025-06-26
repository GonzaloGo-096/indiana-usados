import { AUTH_CONFIG } from '../config/auth'

/**
 * Servicio de autenticación simplificado
 * 
 * @author Indiana Usados
 * @version 1.0.0
 */

// Función helper para hacer requests a la API
const apiRequest = async (endpoint, options = {}) => {
  const url = `${AUTH_CONFIG.api.baseURL}${endpoint}`
  
  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers
    }
  }

  const config = {
    ...defaultOptions,
    ...options
  }

  try {
    const response = await fetch(url, config)
    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || 'Error en la petición')
    }

    return data
  } catch (error) {
    throw new Error(error.message || 'Error de conexión')
  }
}

// Función helper para agregar token de autorización
const getAuthHeaders = () => {
  const token = localStorage.getItem(AUTH_CONFIG.storage.tokenKey)
  return token ? { Authorization: `Bearer ${token}` } : {}
}

// Función mock temporal para desarrollo (sin backend)
const mockLogin = async (credentials) => {
  // Simular delay de red
  await new Promise(resolve => setTimeout(resolve, 500))
  
  // Credenciales hardcodeadas para desarrollo
  if (credentials.usuario === 'admin' && credentials.contraseña === 'admin123') {
    return {
      success: true,
      data: {
        token: 'mock_jwt_token_' + Date.now(),
        user: {
          id: 1,
          username: 'admin',
          email: 'admin@indiana.com',
          role: 'admin'
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
  // Login
  login: async (credentials) => {
    // Para desarrollo, usar mock login
    // Cuando tengas backend, cambiar por: return apiRequest(AUTH_CONFIG.api.endpoints.login, {...})
    return mockLogin(credentials)
  },

  // Logout
  logout: async () => {
    const token = localStorage.getItem(AUTH_CONFIG.storage.tokenKey)
    if (token) {
      try {
        // Para desarrollo, solo limpiar localStorage
        // Cuando tengas backend, descomentar: await apiRequest(AUTH_CONFIG.api.endpoints.logout, {...})
        console.log('Logout exitoso')
      } catch (error) {
        console.error('Error during logout API call:', error)
      }
    }
  }
} 