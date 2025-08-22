/**
 * env.js - Configuración de variables de entorno para el navegador
 * 
 * Reemplaza process.env por import.meta.env para compatibilidad con Vite
 * 
 * @author Indiana Usados
 * @version 1.0.0
 */

// Variables de entorno disponibles en el navegador
export const env = {
  // Entorno
  NODE_ENV: import.meta.env.MODE || 'development',
  DEV: import.meta.env.DEV || false,
  PROD: import.meta.env.PROD || false,
  
  // API
  VITE_API_URL: import.meta.env.VITE_API_URL,
  VITE_API_TIMEOUT: import.meta.env.VITE_API_TIMEOUT,
  VITE_MOCK_ENABLED: import.meta.env.VITE_MOCK_ENABLED,
  VITE_USE_POSTMAN_MOCK: import.meta.env.VITE_USE_POSTMAN_MOCK,
  
  // Features
  VITE_DEBUG: import.meta.env.VITE_DEBUG,
  VITE_LAZY_LOADING: import.meta.env.VITE_LAZY_LOADING,
  VITE_PREFETCH: import.meta.env.VITE_PREFETCH,
  VITE_IMAGE_OPTIMIZATION: import.meta.env.VITE_IMAGE_OPTIMIZATION,
  
  // Imágenes
  VITE_IMAGE_PLACEHOLDER: import.meta.env.VITE_IMAGE_PLACEHOLDER,
  VITE_IMAGE_LAZY_LOAD: import.meta.env.VITE_IMAGE_LAZY_LOAD,
  VITE_IMAGE_QUALITY: import.meta.env.VITE_IMAGE_QUALITY,
  
  // Performance
  VITE_DEBOUNCE_DELAY: import.meta.env.VITE_DEBOUNCE_DELAY,
  VITE_THROTTLE_DELAY: import.meta.env.VITE_THROTTLE_DELAY,
  VITE_INTERSECTION_THRESHOLD: import.meta.env.VITE_INTERSECTION_THRESHOLD,
  VITE_INTERSECTION_ROOT_MARGIN: import.meta.env.VITE_INTERSECTION_ROOT_MARGIN,
  
  // Paginación
  VITE_PAGE_SIZE: import.meta.env.VITE_PAGE_SIZE,
  VITE_INFINITE_SCROLL: import.meta.env.VITE_INFINITE_SCROLL,
  
  // Contacto
  VITE_CONTACT_EMAIL: import.meta.env.VITE_CONTACT_EMAIL,
  VITE_CONTACT_WHATSAPP: import.meta.env.VITE_CONTACT_WHATSAPP
}

// Helper para verificar si estamos en desarrollo
export const isDevelopment = () => env.DEV

// Helper para verificar si estamos en producción
export const isProduction = () => env.PROD

// Helper para obtener una variable de entorno con valor por defecto
export const getEnvVar = (key, defaultValue = '') => {
  return env[key] || defaultValue
}

// Helper para verificar si una feature está habilitada
export const isFeatureEnabled = (featureKey) => {
  const value = env[featureKey]
  return value === 'true' || value === true
}

// Helper para obtener configuración de API
export const getApiConfig = () => ({
  baseURL: env.VITE_API_URL || (isDevelopment() ? 'http://localhost:3001' : 'https://tu-backend-real.com'),
  timeout: Number(env.VITE_API_TIMEOUT) || 10000,
  mock: isFeatureEnabled('VITE_MOCK_ENABLED') || isDevelopment(),
  postman: isFeatureEnabled('VITE_USE_POSTMAN_MOCK')
})

// Helper para obtener configuración de performance
export const getPerformanceConfig = () => ({
  debounceDelay: Number(env.VITE_DEBOUNCE_DELAY) || 300,
  throttleDelay: Number(env.VITE_THROTTLE_DELAY) || 100,
  intersectionThreshold: Number(env.VITE_INTERSECTION_THRESHOLD) || 0.1,
  intersectionRootMargin: env.VITE_INTERSECTION_ROOT_MARGIN || '100px'
})

// Helper para obtener configuración de imágenes
export const getImageConfig = () => ({
  placeholder: env.VITE_IMAGE_PLACEHOLDER || 'blur',
  lazyLoad: env.VITE_IMAGE_LAZY_LOAD !== 'false',
  quality: Number(env.VITE_IMAGE_QUALITY) || 80
})

// Helper para obtener configuración de paginación
export const getPaginationConfig = () => ({
  pageSize: Number(env.VITE_PAGE_SIZE) || 12,
  infiniteScroll: env.VITE_INFINITE_SCROLL !== 'false'
})

// Helper para obtener configuración de contacto
export const getContactConfig = () => ({
  email: env.VITE_CONTACT_EMAIL || 'contacto@indiana-usados.com',
  whatsapp: env.VITE_CONTACT_WHATSAPP || '+5491112345678'
})

export default env 