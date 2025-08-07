/**
 * useApiError - Hook especializado para errores de API
 * 
 * Responsabilidades:
 * - Manejo específico de errores de API
 * - Clasificación de errores por tipo
 * - Mensajes de error amigables
 * - Estrategias de recuperación
 * 
 * @author Indiana Usados
 * @version 1.0.0
 */

import { useState, useCallback, useEffect } from 'react'
import { config } from '../config'

/**
 * Hook para manejo de errores de API
 * 
 * @param {Object} options - Opciones del hook
 * @param {number} options.autoClearTime - Tiempo para limpiar error automáticamente
 * @param {boolean} options.enableAutoClear - Si habilitar limpieza automática
 * @param {Function} options.onError - Callback cuando ocurre error
 * @returns {Object} - Estado y funciones del hook
 */
export const useApiError = (options = {}) => {
    const {
        autoClearTime = 8000, // Más tiempo para errores de API
        enableAutoClear = true,
        onError = null
    } = options

    const [error, setError] = useState(null)
    const [isError, setIsError] = useState(false)
    const [errorCount, setErrorCount] = useState(0)

    // Limpiar error automáticamente
    useEffect(() => {
        if (error && enableAutoClear) {
            const timer = setTimeout(() => {
                clearError()
            }, autoClearTime)

            return () => clearTimeout(timer)
        }
    }, [error, enableAutoClear, autoClearTime])

    // Clasificar error de API
    const classifyApiError = useCallback((error) => {
        if (!error) return 'unknown'

        const status = error.response?.status
        const message = error.message?.toLowerCase()

        // Errores de red
        if (message?.includes('network') || message?.includes('fetch')) {
            return 'network'
        }

        // Errores de timeout
        if (message?.includes('timeout') || error.code === 'ECONNABORTED') {
            return 'timeout'
        }

        // Errores HTTP por status
        if (status) {
            if (status >= 500) return 'server'
            if (status === 404) return 'not-found'
            if (status === 403) return 'forbidden'
            if (status === 401) return 'unauthorized'
            if (status >= 400) return 'client'
        }

        return 'unknown'
    }, [])

    // Obtener mensaje amigable
    const getFriendlyMessage = useCallback((error) => {
        const type = classifyApiError(error)
        
        const messages = {
            network: 'Problema de conexión. Verifica tu internet.',
            timeout: 'La solicitud tardó demasiado. Intenta de nuevo.',
            server: 'Error del servidor. Intenta más tarde.',
            'not-found': 'Recurso no encontrado.',
            forbidden: 'No tienes permisos para acceder a este recurso.',
            unauthorized: 'Debes iniciar sesión para continuar.',
            client: 'Error en la solicitud. Verifica los datos.',
            unknown: 'Error inesperado. Intenta de nuevo.'
        }

        return messages[type] || messages.unknown
    }, [classifyApiError])

    // Manejar error de API
    const handleApiError = useCallback((error, endpoint = '') => {
        const errorType = classifyApiError(error)
        const friendlyMessage = getFriendlyMessage(error)
        
        const errorInfo = {
            type: 'api-error',
            errorType,
            message: friendlyMessage,
            originalError: error,
            endpoint,
            timestamp: new Date().toISOString(),
            count: errorCount + 1
        }

        if (config.isDevelopment && config.features.debug) {
            console.error(`❌ Error de API (${errorType}):`, {
                endpoint,
                status: error.response?.status,
                message: error.message,
                friendlyMessage
            })
        }

        setError(errorInfo)
        setIsError(true)
        setErrorCount(prev => prev + 1)

        // Callback personalizado
        if (onError) {
            onError(errorInfo)
        }

        // Reportar a monitoreo
        reportToMonitoring(errorInfo)
    }, [classifyApiError, getFriendlyMessage, errorCount, onError])

    // Limpiar error
    const clearError = useCallback(() => {
        setError(null)
        setIsError(false)
    }, [])

    // Reintentar operación
    const retryOperation = useCallback(async (operation, maxRetries = 3) => {
        let lastError = null
        
        for (let attempt = 1; attempt <= maxRetries; attempt++) {
            try {
                const result = await operation()
                clearError()
                return result
            } catch (error) {
                lastError = error
                
                if (config.isDevelopment) {
                    console.warn(`⚠️ Intento ${attempt}/${maxRetries} falló:`, error)
                }
                
                if (attempt < maxRetries) {
                    // Esperar antes del siguiente intento (backoff exponencial)
                    await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, attempt - 1)))
                }
            }
        }
        
        // Si todos los intentos fallan
        handleApiError(lastError, 'retry-operation')
        throw lastError
    }, [handleApiError, clearError])

    // Reportar a monitoreo
    const reportToMonitoring = useCallback((errorInfo) => {
        const report = {
            ...errorInfo,
            userAgent: navigator.userAgent,
            url: window.location.href,
            sessionId: sessionStorage.getItem('sessionId') || 'unknown'
        }
        
        if (config.isDevelopment) {
            console.log('📊 Error de API reportado:', report)
        }
        
        // ✅ FUTURO: Enviar a servicio real
        // sendToMonitoringService(report)
    }, [])

    return {
        // Estado
        error,
        isError,
        errorCount,
        errorType: error?.errorType,
        
        // Funciones
        handleApiError,
        clearError,
        retryOperation,
        
        // Utilidades
        classifyApiError,
        getFriendlyMessage
    }
} 