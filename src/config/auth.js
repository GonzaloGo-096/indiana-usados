/**
 * Configuración de autenticación para backend Node.js REAL
 * 
 * @author Indiana Usados
 * @version 3.0.0 - Migrado a backend real
 */

export const AUTH_CONFIG = {
  // Configuración de API
  api: {
    // URL del backend REAL
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3001',
    endpoints: {
      login: '/user/loginuser', // ✅ ENDPOINT REAL DEL BACKEND
      // logout: '/auth/logout', // ❌ NO EXISTE EN BACKEND REAL
      // verify: '/auth/verify' // ❌ NO EXISTE EN BACKEND REAL
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
    enableMock: import.meta.env.VITE_MOCK_ENABLED === 'true',
    // Credenciales de desarrollo (mantener para fallback)
    mockCredentials: {
      username: 'indiana-autos', // ✅ CAMBIADO A username
      password: '12345678'       // ✅ CREDENCIALES REALES
    }
  },

  // ✅ NUEVO: Configuración de headers para autorización
  headers: {
    authorization: 'Authorization',
    bearerPrefix: 'Bearer '
  }
} 