/**
 * config/index.js - Configuración centralizada de la aplicación
 * 
 * Características:
 * - Configuración unificada y simplificada
 * - Validación de variables de entorno
 * - Valores por defecto seguros
 * - Configuración por entorno
 * - Soporte para Vercel Preview Deployments
 * 
 * @author Indiana Usados
 * @version 2.0.0 - Soporte para Vercel Preview Deployments
 */

import { logger } from '@utils/logger'

// ===== VALIDACIÓN DE ENTORNO =====
const validateEnvironment = () => {
  // Prioridad 1: VERCEL_ENV (si existe process.env, es serverless/Node.js)
  // Prioridad 2: VITE_ENVIRONMENT (import.meta.env en cliente Vite)
  // Prioridad 3: Fallback a 'development'
  let rawEnvironment
  
  // En Node.js/serverless (process.env disponible)
  if (typeof process !== 'undefined' && process.env && process.env.VERCEL_ENV) {
    rawEnvironment = process.env.VERCEL_ENV
  }
  // En cliente Vite (import.meta.env disponible)
  else if (import.meta.env && import.meta.env.VITE_ENVIRONMENT) {
    rawEnvironment = import.meta.env.VITE_ENVIRONMENT
  }
  // Fallback
  else {
    rawEnvironment = 'development'
  }
  
  // Normalizar a minúsculas para evitar errores de case-sensitivity
  const environment = rawEnvironment.toLowerCase().trim()
  const validEnvironments = ['development', 'preview', 'staging', 'production']
  
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
    timeout: parseInt(import.meta.env?.VITE_API_TIMEOUT) || 15000, // ✅ 15 segundos por defecto
    retries: 2,
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    }
  }
  
  // Backend real
  const apiURL = import.meta.env?.VITE_API_URL || 'http://localhost:3001'
  
  return {
    ...baseConfig,
    baseURL: apiURL
  }
}

// ===== CONFIGURACIÓN DE ENTORNO COMPLETA =====
/**
 * Resuelve la URL del sitio según el entorno
 */
const resolveSiteUrl = (envName) => {
  // En Node.js/serverless (process.env disponible)
  if (typeof process !== 'undefined' && process.env) {
    // Prioridad 1: VITE_SITE_URL explícita
    if (process.env.VITE_SITE_URL) {
      return process.env.VITE_SITE_URL
    }
    // Prioridad 2: Si es preview, usar VERCEL_URL
    if (envName === 'preview' && process.env.VERCEL_URL) {
      return `https://${process.env.VERCEL_URL}`
    }
  }
  
  // En cliente Vite (import.meta.env disponible)
  if (import.meta.env) {
    // Prioridad 1: VITE_SITE_URL explícita
    if (import.meta.env.VITE_SITE_URL) {
      return import.meta.env.VITE_SITE_URL
    }
    // Prioridad 2: Si es preview, intentar usar VERCEL_URL (solo en browser si está disponible)
    if (envName === 'preview') {
      // En preview, usar window.location.origin como fallback
      if (typeof window !== 'undefined' && window.location) {
        return window.location.origin
      }
    }
    // Prioridad 3: Si es development, usar window.location.origin
    if (envName === 'development' && typeof window !== 'undefined' && window.location) {
      return window.location.origin
    }
  }
  
  // Fallback final: solo para producción
  return 'https://indiana.com.ar'
}

/**
 * Objeto de entorno completo con flags y URLs resueltas
 */
const getEnvironmentConfig = () => {
  const envName = validateEnvironment()
  const apiConfig = getApiConfig()
  
  return {
    name: envName,
    isProduction: envName === 'production',
    isPreview: envName === 'preview',
    isDevelopment: envName === 'development',
    isStaging: envName === 'staging',
    siteUrl: resolveSiteUrl(envName),
    apiUrl: apiConfig.baseURL
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

// ===== CONFIGURACIÓN DE ENTORNO =====
export const environment = getEnvironmentConfig()

// ===== CONFIGURACIÓN PRINCIPAL =====
export const config = {
  // Entorno (mantener compatibilidad con código existente)
  environment: environment.name,
  
  // API
  api: getApiConfig(),
  
  // Features
  features: getFeaturesConfig(),
  
  // Autenticación: delegada a AUTH_CONFIG (ver src/config/auth.js)
  
  // Contacto
  contact: getContactConfig(),
  
  // Imágenes
  images: getImagesConfig(),
  
  // Utilidades (mantener compatibilidad con código existente)
  isDevelopment: environment.isDevelopment,
  isProduction: environment.isProduction,
  isStaging: environment.isStaging
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