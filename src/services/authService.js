import { AUTH_CONFIG } from '@config/auth'

/**
 * Servicio de autenticación para backend Node.js
 * 
 * @author Indiana Usados
 * @version 2.0.0
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
      throw new Error(data.message || `Error ${response.status}: ${response.statusText}`)
    }

    return data
  } catch (error) {
    // Si es error de red, mantener el mensaje original
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      throw new Error('Error de conexión con el servidor')
    }
    throw error
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
          role: 'admin',
          name: 'Administrador'
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
  // Login - Listo para backend Node.js
  login: async (credentials) => {
    // Verificar si estamos en modo desarrollo (sin backend)
    const isDevelopment = AUTH_CONFIG.development.enableMock
    
    if (isDevelopment) {
      // Usar mock para desarrollo
      return mockLogin(credentials)
    }

    // Backend real - adaptar credenciales al formato esperado
    const loginData = {
      email: credentials.usuario, // Asumiendo que el backend espera 'email'
      password: credentials.contraseña
    }

    try {
      const response = await apiRequest(AUTH_CONFIG.api.endpoints.login, {
        method: 'POST',
        body: JSON.stringify(loginData)
      })

      return {
        success: true,
        data: {
          token: response.token || response.data?.token,
          user: response.user || response.data?.user
        }
      }
    } catch (error) {
      return {
        success: false,
        message: error.message
      }
    }
  },

  // Logout - Listo para backend Node.js
  logout: async () => {
    const token = localStorage.getItem(AUTH_CONFIG.storage.tokenKey)
    
    if (token) {
      try {
        // Verificar si estamos en modo desarrollo
        const isDevelopment = !AUTH_CONFIG.api.baseURL || AUTH_CONFIG.api.baseURL.includes('localhost:3001')
        
        if (!isDevelopment) {
          // Llamar al backend para invalidar el token
          await apiRequest(AUTH_CONFIG.api.endpoints.logout, {
            method: 'POST',
            headers: getAuthHeaders()
          })
        } else {
          // Log removido para limpiar debug info
        }
      } catch (error) {
        console.error('Error during logout API call:', error)
        // Continuar con la limpieza local aunque falle la API
      }
    }
  },

  // Verificar token (opcional)
  verifyToken: async () => {
    const token = localStorage.getItem(AUTH_CONFIG.storage.tokenKey)
    
    if (!token) {
      return { valid: false }
    }

    try {
      const response = await apiRequest('/auth/verify', {
        method: 'GET',
        headers: getAuthHeaders()
      })
      
      return { valid: true, user: response.user }
    } catch (error) {
      return { valid: false, error: error.message }
    }
  }
} 