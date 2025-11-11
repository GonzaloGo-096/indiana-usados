/**
 * Configuración de autenticación para backend Node.js REAL
 * 
 * Nota: baseURL y timeout se obtienen de config.api (config/index.js)
 * para mantener una única fuente de verdad.
 * 
 * @author Indiana Usados
 * @version 4.0.0 - baseURL y timeout unificados con config.api
 */

export const AUTH_CONFIG = {
  // Configuración de API (solo endpoints, baseURL y timeout vienen de config.api)
  api: {
    endpoints: {
      login: '/user/loginuser'
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
  },

  // Configuración de headers para autorización
  headers: {
    authorization: 'Authorization',
    bearerPrefix: 'Bearer '
  }
} 