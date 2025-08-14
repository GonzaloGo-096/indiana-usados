/**
 * useErrorBase - Hook base para lógica compartida de manejo de errores
 * 
 * Características:
 * - Estado común de errores
 * - Lógica de limpieza automática
 * - Callbacks personalizables
 * - Base para hooks especializados
 * 
 * @author Indiana Usados
 * @version 1.0.0
 */

import { useState, useCallback, useEffect } from 'react'

/**
 * Hook base para manejo de errores
 * @param {Object} options - Opciones del hook
 * @param {number} options.autoClearTime - Tiempo en ms para limpiar error automáticamente
 * @param {boolean} options.enableAutoClear - Si habilitar limpieza automática
 * @param {Function} options.onError - Callback cuando ocurre error
 * @param {Function} options.onClear - Callback cuando se limpia error
 * @returns {Object} - Estado y funciones base del hook
 */
export const useErrorBase = (options = {}) => {
    const {
        autoClearTime = 5000,
        enableAutoClear = true,
        onError = null,
        onClear = null
    } = options

    const [error, setError] = useState(null)
    const [isError, setIsError] = useState(false)
    const [errorCount, setErrorCount] = useState(0)

    // ✅ LIMPIAR ERROR AUTOMÁTICAMENTE
    useEffect(() => {
        if (error && enableAutoClear) {
            const timer = setTimeout(() => {
                clearError()
            }, autoClearTime)

            return () => clearTimeout(timer)
        }
    }, [error, enableAutoClear, autoClearTime])

    // ✅ MANEJAR ERROR BASE
    const handleError = useCallback((errorData, context = '') => {
        const errorInfo = {
            message: errorData?.message || 'Error inesperado',
            context,
            timestamp: new Date().toISOString(),
            stack: errorData?.stack,
            count: errorCount + 1,
            ...errorData // Permitir propiedades adicionales
        }

        console.error(`❌ Error en ${context}:`, errorInfo)
        
        setError(errorInfo)
        setIsError(true)
        setErrorCount(prev => prev + 1)

        // ✅ CALLBACK PERSONALIZADO
        if (onError) {
            onError(errorInfo)
        }
    }, [errorCount, onError])

    // ✅ LIMPIAR ERROR
    const clearError = useCallback(() => {
        setError(null)
        setIsError(false)
        
        // ✅ CALLBACK PERSONALIZADO
        if (onClear) {
            onClear()
        }
    }, [onClear])

    // ✅ REINICIAR CONTADOR
    const resetErrorCount = useCallback(() => {
        setErrorCount(0)
    }, [])

    // ✅ OBTENER ESTADO DEL ERROR
    const getErrorState = useCallback(() => ({
        error,
        isError,
        errorCount,
        hasError: isError && error !== null
    }), [error, isError, errorCount])

    return {
        // Estado
        error,
        isError,
        errorCount,
        
        // Funciones
        handleError,
        clearError,
        resetErrorCount,
        getErrorState,
        
        // Estado computado
        hasError: isError && error !== null
    }
} 