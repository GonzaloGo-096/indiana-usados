/**
 * Configuración de autenticación para backend Node.js
 * 
 * @author Indiana Usados
 * @version 2.0.0
 */

export const AUTH_CONFIG = {
  // Configuración de API
  api: {
    // URL del backend - cambiar según el entorno
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3001/api',
    endpoints: {
      login: '/auth/login',
      logout: '/auth/logout',
      verify: '/auth/verify' // Opcional para verificar token
    },
    // Timeout para requests (en ms)
    timeout: 10000
  },
  
  // Configuración de localStorage
  storage: {
    tokenKey: 'auth_token',
    userKey: 'auth_user'
  },
  
  // Rutas de la aplicación
  routes: {
    login: '/admin/login',
    dashboard: '/admin',
    home: '/'
  },

  // Configuración de desarrollo
  development: {
    // Habilitar modo mock cuando no hay backend
    enableMock: true, // Forzar modo mock para desarrollo
    // Credenciales de desarrollo
    mockCredentials: {
      usuario: 'admin',
      contraseña: 'admin123'
    }
  }
} 