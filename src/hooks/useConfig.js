/**
 * useConfig - Hook personalizado para configuración centralizada
 * 
 * Características:
 * - Acceso limpio a toda la configuración
 * - Validación automática
 * - Fallbacks inteligentes
 * - Performance optimizada
 * 
 * @author Indiana Usados
 * @version 1.0.0
 */

import { useMemo } from 'react'
import { config, validateConfig } from '../config'

/**
 * Hook para acceder a la configuración de manera limpia
 * 
 * @param {string} section - Sección específica de configuración (opcional)
 * @returns {Object} - Configuración completa o sección específica
 */
export const useConfig = (section = null) => {
  // ✅ VALIDACIÓN AUTOMÁTICA en desarrollo
  const isValid = useMemo(() => {
    if (config.isDevelopment) {
      return validateConfig()
    }
    return true
  }, [])

  // ✅ CONFIGURACIÓN MEMOIZADA para performance
  const configuration = useMemo(() => {
    // Si se especifica una sección, devolver solo esa
    if (section && config[section]) {
      return config[section]
    }
    
    // Si no hay sección, devolver configuración completa
    return config
  }, [section])

  // ✅ LOGGING en desarrollo
  if (config.isDevelopment && config.features.debug) {
    console.log(`🔧 useConfig - ${section || 'completa'}:`, configuration)
  }

  return {
    // ✅ CONFIGURACIÓN
    config: configuration,
    
    // ✅ VALIDACIÓN
    isValid,
    
    // ✅ UTILIDADES RÁPIDAS
    isDevelopment: config.isDevelopment,
    isProduction: config.isProduction,
    isStaging: config.isStaging,
    
    // ✅ ACCESO DIRECTO A SECCIONES COMUNES
    api: config.api,
    features: config.features,
    auth: config.auth,
    contact: config.contact,
    
    // ✅ MÉTODOS DE VALIDACIÓN
    validate: validateConfig
  }
} 