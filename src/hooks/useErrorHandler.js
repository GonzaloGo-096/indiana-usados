/**
 * useErrorHandler - Hook para manejo centralizado de errores
 * 
 * Características:
 * - Manejo de errores consistente
 * - Recuperación automática
 * - Logging detallado
 * - UI feedback
 * 
 * @author Indiana Usados
 * @version 2.0.0 - OPTIMIZADO CON HOOK BASE
 */

import { useCallback } from 'react'
import { useErrorBase } from './useErrorBase'

/**
 * Hook para manejo de errores
 * @param {Object} options - Opciones del hook
 * @param {number} options.autoClearTime - Tiempo en ms para limpiar error automáticamente
 * @param {boolean} options.enableAutoClear - Si habilitar limpieza automática
 * @param {Function} options.onError - Callback cuando ocurre error
 * @returns {Object} - Estado y funciones del hook
 */
export const useErrorHandler = (options = {}) => {
    // ✅ USAR HOOK BASE PARA LÓGICA COMPARTIDA
    const errorBase = useErrorBase({
        autoClearTime: options.autoClearTime || 5000,
        enableAutoClear: options.enableAutoClear !== false,
        onError: options.onError,
        onClear: options.onClear
    })

    // ✅ MANEJAR ERROR CON LÓGICA ESPECÍFICA
    const handleError = useCallback((error, context = '') => {
        const errorInfo = {
            message: error?.message || 'Error inesperado',
            context,
            timestamp: new Date().toISOString(),
            stack: error?.stack,
            count: errorBase.errorCount + 1
        }

        console.error(`❌ Error en ${context}:`, errorInfo)
        
        // ✅ USAR FUNCIONES DEL HOOK BASE
        errorBase.handleError(errorInfo, context)

        // ✅ REPORTAR A MONITORING (FUTURO)
        reportToMonitoring(errorInfo)
    }, [errorBase])

    // ✅ REINTENTAR OPERACIÓN
    const retryOperation = useCallback(async (operation, maxRetries = 3) => {
        let lastError = null
        
        for (let attempt = 1; attempt <= maxRetries; attempt++) {
            try {
                const result = await operation()
                errorBase.clearError()
                return result
            } catch (error) {
                lastError = error
                console.warn(`⚠️ Intento ${attempt}/${maxRetries} falló:`, error)
                
                if (attempt < maxRetries) {
                    // ✅ ESPERAR ANTES DEL SIGUIENTE INTENTO
                    await new Promise(resolve => setTimeout(resolve, 1000 * attempt))
                }
            }
        }
        
        // ✅ SI TODOS LOS INTENTOS FALLAN
        handleError(lastError, 'retry-operation')
        throw lastError
    }, [handleError, errorBase.clearError])

    // ✅ REPORTAR A MONITORING
    const reportToMonitoring = (errorInfo) => {
        // ✅ FUTURO: Integrar con servicio real (Sentry, LogRocket, etc.)
        const report = {
            ...errorInfo,
            userAgent: navigator.userAgent,
            url: window.location.href,
            sessionId: sessionStorage.getItem('sessionId') || 'unknown'
        }
        
        console.log('📊 Error reported to monitoring service:', report)
        
        // ✅ FUTURO: Enviar a servicio real
        // sendToMonitoringService(report)
    }

    // ✅ VALIDAR SI ES ERROR RECUPERABLE
    const isRecoverableError = useCallback((error) => {
        const recoverableErrors = [
            'Network Error',
            'Request timeout',
            'Failed to fetch',
            'ERR_NETWORK',
            'ERR_TIMEOUT'
        ]
        
        return recoverableErrors.some(pattern => 
            error?.message?.includes(pattern) || 
            error?.name?.includes(pattern)
        )
    }, [])

    // ✅ OBTENER MENSAJE AMIGABLE
    const getFriendlyMessage = useCallback((error) => {
        if (!error) return 'Error inesperado'

        const friendlyMessages = {
            'Network Error': 'Problema de conexión. Verifica tu internet.',
            'Request timeout': 'La solicitud tardó demasiado. Intenta de nuevo.',
            'Failed to fetch': 'No se pudo conectar al servidor.',
            'ERR_NETWORK': 'Error de red. Verifica tu conexión.',
            'ERR_TIMEOUT': 'Tiempo de espera agotado. Intenta de nuevo.'
        }

        for (const [pattern, message] of Object.entries(friendlyMessages)) {
            if (error.message?.includes(pattern) || error.name?.includes(pattern)) {
                return message
            }
        }

        return error.message || 'Error inesperado'
    }, [])

    return {
        // ✅ ESTADO Y FUNCIONES DEL HOOK BASE
        ...errorBase,
        
        // ✅ FUNCIONES ESPECÍFICAS
        handleError,
        retryOperation,
        
        // ✅ UTILIDADES
        isRecoverableError,
        getFriendlyMessage
    }
}

/**
 * Hook especializado para errores de API
 */
export const useApiErrorHandler = (options = {}) => {
    const errorHandler = useErrorHandler({
        autoClearTime: 8000, // ✅ MÁS TIEMPO PARA ERRORES DE API
        enableAutoClear: true,
        ...options
    })

    // ✅ MANEJAR ERRORES DE API ESPECÍFICAMENTE
    const handleApiError = useCallback((error, endpoint = '') => {
        const apiError = {
            ...error,
            context: `API: ${endpoint}`,
            type: 'api-error'
        }
        
        errorHandler.handleError(apiError, `api-${endpoint}`)
    }, [errorHandler])

    return {
        ...errorHandler,
        handleApiError
    }
}

/**
 * Hook especializado para errores de validación
 */
export const useValidationErrorHandler = (options = {}) => {
    const errorHandler = useErrorHandler({
        autoClearTime: 3000, // ✅ MENOS TIEMPO PARA ERRORES DE VALIDACIÓN
        enableAutoClear: true,
        ...options
    })

    // ✅ MANEJAR ERRORES DE VALIDACIÓN
    const handleValidationError = useCallback((errors, field = '') => {
        const validationError = new Error(
            Array.isArray(errors) ? errors.join(', ') : errors
        )
        
        validationError.name = 'ValidationError'
        validationError.field = field
        validationError.errors = Array.isArray(errors) ? errors : [errors]
        
        errorHandler.handleError(validationError, `validation-${field}`)
    }, [errorHandler])

    return {
        ...errorHandler,
        handleValidationError
    }
} 