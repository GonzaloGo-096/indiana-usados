/**
 * config/index.js - Configuración centralizada de la aplicación
 * 
 * Características:
 * - Configuración unificada y simplificada
 * - Validación de variables de entorno
 * - Valores por defecto seguros
 * - Configuración por entorno
 * 
 * @author Indiana Usados
 * @version 1.1.0 - Logger importado directamente
 */

import { logger } from '@utils/logger'

// ===== VALIDACIÓN DE ENTORNO =====
const validateEnvironment = () => {
  const rawEnvironment = import.meta.env.VITE_ENVIRONMENT || 'development'
  // Normalizar a minúsculas para evitar errores de case-sensitivity
  const environment = rawEnvironment.toLowerCase().trim()
  const validEnvironments = ['development', 'staging', 'production']
  
  if (!validEnvironments.includes(environment)) {
    logger.warn('config:env', `Entorno inválido: ${rawEnvironment}. Usando 'development'`)
    return 'development'
  }
  
  return environment
}

// ===== CONFIGURACIÓN DE API =====
const getApiConfig = () => {
  // Configuración base
  const baseConfig = {
    timeout: parseInt(import.meta.env.VITE_API_TIMEOUT) || 15000, // ✅ 15 segundos por defecto
    retries: 2,
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    }
  }
  
  // Backend real
  const apiURL = import.meta.env.VITE_API_URL || 'http://localhost:3001'
  
  return {
    ...baseConfig,
    baseURL: apiURL
  }
}

// ===== CONFIGURACIÓN DE FEATURES =====
const getFeaturesConfig = () => {
  const environment = validateEnvironment()
  
  return {
    debug: import.meta.env.VITE_DEBUG === 'true' && environment === 'development',
    errorBoundaries: import.meta.env.VITE_ERROR_BOUNDARIES !== 'false',
    lazyLoading: import.meta.env.VITE_LAZY_LOADING !== 'false',
    imageOptimization: import.meta.env.VITE_IMAGE_OPTIMIZATION !== 'false'
  }
}

// Autenticación: delegada a AUTH_CONFIG (ver src/config/auth.js)

// ===== CONFIGURACIÓN DE CONTACTO =====
const getContactConfig = () => {
  return {
    email: import.meta.env.VITE_CONTACT_EMAIL || 'info@indianausados.com',
    whatsapp: import.meta.env.VITE_CONTACT_WHATSAPP || '5491112345678'
  }
}

// ===== CONFIGURACIÓN DE IMÁGENES =====
const getImagesConfig = () => {
  return {
    cloudinary: {
      cloudName: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || 'drbeomhcu',
      progressiveJpeg: import.meta.env.VITE_IMG_PROGRESSIVE_JPEG === 'true',
      blurPlaceholder: import.meta.env.VITE_IMG_PLACEHOLDER_BLUR === 'true'
    }
  }
}

// ===== CONFIGURACIÓN PRINCIPAL =====
export const config = {
  // Entorno
  environment: validateEnvironment(),
  
  // API
  api: getApiConfig(),
  
  // Features
  features: getFeaturesConfig(),
  
  // Autenticación: delegada a AUTH_CONFIG (ver src/config/auth.js)
  
  // Contacto
  contact: getContactConfig(),
  
  // Imágenes
  images: getImagesConfig(),
  
  // Utilidades
  isDevelopment: validateEnvironment() === 'development',
  isProduction: validateEnvironment() === 'production',
  isStaging: validateEnvironment() === 'staging'
}

// ===== LOGGING DE CONFIGURACIÓN (solo en desarrollo) =====
if (config.isDevelopment && config.features.debug) {
  logger.info('config:loaded', 'CONFIGURACIÓN CARGADA', {
    environment: config.environment,
    api: {
      baseURL: config.api.baseURL,
      timeout: config.api.timeout
    },
    features: config.features
  })
}

// ===== VALIDACIÓN DE CONFIGURACIÓN =====
export const validateConfig = () => {
  const errors = []
  
  // Validar API URL
  if (!config.api.baseURL) {
    errors.push('API URL no configurada')
  }
  
  // Validar timeout
  if (config.api.timeout < 1000 || config.api.timeout > 30000) {
    errors.push('API timeout debe estar entre 1000ms y 30000ms')
  }
  
  // Validar contact info
  if (!config.contact.email || !config.contact.whatsapp) {
    errors.push('Información de contacto incompleta')
  }
  
  if (errors.length > 0) {
    logger.error('config:validation', 'ERRORES DE CONFIGURACIÓN', { errors })
    return false
  }
  
  return true
}

// ===== EXPORTAR CONFIG DE REACT QUERY =====
export { REACT_QUERY_CONFIG, REACT_QUERY_TEST_CONFIG } from './reactQuery'

// ===== EXPORTAR CONFIG SEO =====
export { SEO_CONFIG } from './seo'

export default config 