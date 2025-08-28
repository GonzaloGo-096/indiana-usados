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
 * @version 1.0.0 - Configuración simplificada
 */

// ===== VALIDACIÓN DE ENTORNO =====
const validateEnvironment = () => {
  const environment = import.meta.env.VITE_ENVIRONMENT || 'development'
  const validEnvironments = ['development', 'staging', 'production']
  
  if (!validEnvironments.includes(environment)) {
    console.warn(`⚠️ Entorno inválido: ${environment}. Usando 'development'`)
    return 'development'
  }
  
  return environment
}

// ===== CONFIGURACIÓN DE API =====
const getApiConfig = () => {
  const environment = validateEnvironment()
  
  // Configuración base
  const baseConfig = {
    timeout: parseInt(import.meta.env.VITE_API_TIMEOUT) || 5000,
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

// ===== CONFIGURACIÓN DE AUTH =====
const getAuthConfig = () => {
  return {
    enabled: import.meta.env.VITE_AUTH_ENABLED !== 'false',
    storageKey: import.meta.env.VITE_AUTH_STORAGE_KEY || 'indiana_auth_token',
    userStorageKey: import.meta.env.VITE_USER_STORAGE_KEY || 'indiana_user_data'
  }
}

// ===== CONFIGURACIÓN DE CONTACTO =====
const getContactConfig = () => {
  return {
    email: import.meta.env.VITE_CONTACT_EMAIL || 'info@indianausados.com',
    whatsapp: import.meta.env.VITE_CONTACT_WHATSAPP || '5491112345678'
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
  
  // Autenticación
  auth: getAuthConfig(),
  
  // Contacto
  contact: getContactConfig(),
  
  // Utilidades
  isDevelopment: validateEnvironment() === 'development',
  isProduction: validateEnvironment() === 'production',
  isStaging: validateEnvironment() === 'staging'
}

// ===== LOGGING DE CONFIGURACIÓN (solo en desarrollo) =====
if (config.isDevelopment && config.features.debug) {
  console.log('🔧 CONFIGURACIÓN CARGADA:', {
    environment: config.environment,
    api: {
      baseURL: config.api.baseURL,
      timeout: config.api.timeout
    },
    features: config.features,
    auth: config.auth
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
    console.error('❌ ERRORES DE CONFIGURACIÓN:', errors)
    return false
  }
  
  return true
}

export default config 