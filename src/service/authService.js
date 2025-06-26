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

/**
 * Servicios de autenticación
 */
export const authService = {
  // Login
  login: async (credentials) => {
    return apiRequest(AUTH_CONFIG.api.endpoints.login, {
      method: 'POST',
      body: JSON.stringify(credentials)
    })
  },

  // Logout
  logout: async () => {
    const token = localStorage.getItem(AUTH_CONFIG.storage.tokenKey)
    if (token) {
      try {
        await apiRequest(AUTH_CONFIG.api.endpoints.logout, {
          method: 'POST',
          headers: getAuthHeaders()
        })
      } catch (error) {
        console.error('Error during logout API call:', error)
      }
    }
  }
} 