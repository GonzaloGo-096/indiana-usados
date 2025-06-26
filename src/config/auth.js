/**
 * Configuración de autenticación simplificada
 * 
 * @author Indiana Usados
 * @version 1.0.0
 */

export const AUTH_CONFIG = {
  // Configuración de API
  api: {
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3001/api',
    endpoints: {
      login: '/auth/login',
      logout: '/auth/logout'
    }
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
  }
} 