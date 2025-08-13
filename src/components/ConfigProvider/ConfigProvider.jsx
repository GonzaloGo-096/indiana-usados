/**
 * ConfigProvider - Proveedor de configuración centralizada
 * 
 * Características:
 * - Configuración disponible en toda la app
 * - Validación automática en desarrollo
 * - Logging inteligente
 * - Performance optimizada
 * 
 * @author Indiana Usados
 * @version 1.0.0
 */

import React, { createContext, useContext, useMemo } from 'react'
import { useConfig } from '@hooks'

// ✅ CONTEXTO DE CONFIGURACIÓN
const ConfigContext = createContext(null)

/**
 * Hook para usar la configuración en cualquier componente
 * @returns {Object} - Configuración completa de la aplicación
 */
export const useAppConfig = () => {
  const context = useContext(ConfigContext)
  if (!context) {
    throw new Error('useAppConfig debe usarse dentro de ConfigProvider')
  }
  return context
}

/**
 * Proveedor de configuración para toda la aplicación
 * @param {Object} props - Props del componente
 * @param {React.ReactNode} props.children - Componentes hijos
 * @returns {JSX.Element} - Proveedor de configuración
 */
export const ConfigProvider = ({ children }) => {
  const config = useConfig()
  
  // ✅ CONFIGURACIÓN MEMOIZADA PARA PERFORMANCE
  const configValue = useMemo(() => {
    return {
      // ✅ CONFIGURACIÓN COMPLETA
      ...config,
      
      // ✅ MÉTODOS DE UTILIDAD
      isFeatureEnabled: (featureName) => {
        return config.features?.[featureName] === true
      },
      
      getApiConfig: () => config.api,
      
      getAuthConfig: () => config.auth,
      
      getContactConfig: () => config.contact,
      
      // ✅ VALIDACIÓN RÁPIDA
      validate: () => config.validate(),
      
      // ✅ LOGGING INTELIGENTE
      log: (message, data) => {
        if (config.isDevelopment && config.features?.debug) {
          console.log(`🔧 APP CONFIG: ${message}`, data)
        }
      },
      
      logError: (message, error) => {
        if (config.isDevelopment) {
          console.error(`❌ APP CONFIG ERROR: ${message}`, error)
        }
      }
    }
  }, [config])
  
  // ✅ LOGGING DE INICIALIZACIÓN
  React.useEffect(() => {
    if (config.isDevelopment && config.features?.debug) {
      console.log('🚀 CONFIG PROVIDER INICIALIZADO:', {
        environment: config.environment,
        features: config.features,
        api: config.api,
        auth: config.auth
      })
    }
  }, [config])
  
  return (
    <ConfigContext.Provider value={configValue}>
      {children}
    </ConfigContext.Provider>
  )
}

export default ConfigProvider 