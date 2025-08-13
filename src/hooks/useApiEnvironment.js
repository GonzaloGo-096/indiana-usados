/**
 * useApiEnvironment - Hook especializado para configuración de API
 * 
 * Características:
 * - Detección automática de entorno
 * - Configuración de mock y Postman
 * - Logging inteligente
 * - Performance optimizada
 * 
 * @author Indiana Usados
 * @version 1.0.0
 */

import { useMemo } from 'react'
import { useApiConfig } from './useConfig'

/**
 * Hook para manejar la configuración del entorno de la API
 * 
 * @returns {Object} - Configuración del entorno de la API
 */
export const useApiEnvironment = () => {
  const apiConfig = useApiConfig()
  
  // ✅ CONFIGURACIÓN DEL ENTORNO MEMOIZADA
  const environment = useMemo(() => {
    const config = {
      // ✅ ENTORNO BASE
      isDevelopment: import.meta.env.DEV,
      isProduction: import.meta.env.PROD,
      mode: import.meta.env.MODE,
      
      // ✅ CONFIGURACIÓN DE MOCK
      useMockApi: import.meta.env.VITE_USE_MOCK_API === 'true',
      usePostmanMock: import.meta.env.VITE_USE_POSTMAN_MOCK === 'true',
      
      // ✅ CONFIGURACIÓN DE API
      apiUrl: apiConfig.config?.baseURL || import.meta.env.VITE_API_URL,
      timeout: apiConfig.config?.timeout || 5000,
      
      // ✅ FEATURES
      debug: import.meta.env.VITE_DEBUG === 'true',
      errorBoundaries: import.meta.env.VITE_ERROR_BOUNDARIES !== 'false'
    }
    
    // ✅ LOGGING INTELIGENTE
    if (config.isDevelopment && config.debug) {
      console.log('🔧 API ENVIRONMENT CONFIG:', {
        environment: config.mode,
        useMock: config.useMockApi,
        usePostman: config.usePostmanMock,
        apiUrl: config.apiUrl,
        timeout: config.timeout
      })
    }
    
    return config
  }, [apiConfig])
  
  // ✅ MÉTODOS DE UTILIDAD
  const isMockEnabled = useMemo(() => {
    return environment.useMockApi && !environment.usePostmanMock
  }, [environment.useMockApi, environment.usePostmanMock])
  
  const isPostmanEnabled = useMemo(() => {
    return environment.usePostmanMock
  }, [environment.usePostmanMock])
  
  const isRealBackend = useMemo(() => {
    return !environment.useMockApi && !environment.usePostmanMock
  }, [environment.useMockApi, environment.usePostmanMock])
  
  return {
    // ✅ CONFIGURACIÓN BASE
    ...environment,
    
    // ✅ ESTADOS COMPUTADOS
    isMockEnabled,
    isPostmanEnabled,
    isRealBackend,
    
    // ✅ MÉTODOS DE UTILIDAD
    shouldUseMock: () => isMockEnabled,
    shouldUsePostman: () => isPostmanEnabled,
    shouldUseRealBackend: () => isRealBackend,
    
    // ✅ LOGGING CONDICIONAL
    log: (message, data) => {
      if (environment.isDevelopment && environment.debug) {
        console.log(`🔧 API ENV: ${message}`, data)
      }
    },
    
    logError: (message, error) => {
      if (environment.isDevelopment) {
        console.error(`❌ API ENV ERROR: ${message}`, error)
      }
    }
  }
} 