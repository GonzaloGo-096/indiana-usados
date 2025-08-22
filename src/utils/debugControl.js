/**
 * debugControl.js - Control de logging para debugging
 * 
 * Permite activar/desactivar logging temporalmente
 * 
 * @author Indiana Usados
 * @version 1.0.0
 */

// Control global de debug
let DEBUG_ENABLED = true
let LOG_LEVEL = 'normal' // 'minimal', 'normal', 'verbose'

// Función para desactivar debug temporalmente
export const disableDebug = () => {
    DEBUG_ENABLED = false
    console.log('🔇 DEBUG DESACTIVADO - Logging reducido')
}

// Función para activar debug
export const enableDebug = () => {
    DEBUG_ENABLED = true
    console.log('🔊 DEBUG ACTIVADO - Logging normal')
}

// Función para cambiar nivel de logging
export const setLogLevel = (level) => {
    if (['minimal', 'normal', 'verbose'].includes(level)) {
        LOG_LEVEL = level
        console.log(`📊 NIVEL DE LOGGING CAMBIADO A: ${level}`)
    } else {
        console.warn('⚠️ Nivel de logging inválido. Usando "normal"')
        LOG_LEVEL = 'normal'
    }
}

// Función para verificar si debug está habilitado
export const isDebugEnabled = () => DEBUG_ENABLED

// Función para obtener nivel de logging
export const getLogLevel = () => LOG_LEVEL

// Función para logging condicional
export const debugLog = (message, data = null, level = 'normal') => {
    if (!DEBUG_ENABLED) return
    
    const levelOrder = { 'minimal': 1, 'normal': 2, 'verbose': 3 }
    const currentLevel = levelOrder[LOG_LEVEL] || 2
    const messageLevel = levelOrder[level] || 2
    
    if (messageLevel <= currentLevel) {
        if (data) {
            console.log(message, data)
        } else {
            console.log(message)
        }
    }
}

// Función para logging de error (siempre se muestra)
export const debugError = (message, error = null) => {
    if (error) {
        console.error(message, error)
    } else {
        console.error(message)
    }
}

// Función para logging de warning
export const debugWarn = (message, data = null) => {
    if (!DEBUG_ENABLED) return
    
    if (data) {
        console.warn(message, data)
    } else {
        console.warn(message)
    }
}

// Función para limpiar consola
export const clearConsole = () => {
    if (DEBUG_ENABLED) {
        console.clear()
        console.log('🧹 Consola limpiada')
    }
}

// Función para mostrar estado del debug
export const showDebugStatus = () => {
    console.log('🔧 ESTADO DEL DEBUG:', {
        enabled: DEBUG_ENABLED,
        level: LOG_LEVEL,
        timestamp: new Date().toISOString()
    })
}

// Función para logging de performance
export const debugPerformance = (operation, startTime) => {
    if (!DEBUG_ENABLED || LOG_LEVEL !== 'verbose') return
    
    const endTime = performance.now()
    const duration = endTime - startTime
    
    console.log(`⚡ PERFORMANCE - ${operation}:`, {
        duration: `${duration.toFixed(2)}ms`,
        startTime: startTime.toFixed(2),
        endTime: endTime.toFixed(2)
    })
}

// Exportar funciones para uso en consola
if (typeof window !== 'undefined') {
    window.debugControl = {
        disableDebug,
        enableDebug,
        setLogLevel,
        isDebugEnabled,
        getLogLevel,
        debugLog,
        debugError,
        debugWarn,
        clearConsole,
        showDebugStatus,
        debugPerformance
    }
    
    console.log('🔧 FUNCIONES DE CONTROL DE DEBUG DISPONIBLES:')
    console.log('- debugControl.disableDebug() - Desactiva debug')
    console.log('- debugControl.enableDebug() - Activa debug')
    console.log('- debugControl.setLogLevel("minimal") - Cambia nivel de logging')
    console.log('- debugControl.showDebugStatus() - Muestra estado actual')
    console.log('- debugControl.clearConsole() - Limpia consola')
}

export default {
    disableDebug,
    enableDebug,
    setLogLevel,
    isDebugEnabled,
    getLogLevel,
    debugLog,
    debugError,
    debugWarn,
    clearConsole,
    showDebugStatus,
    debugPerformance
}
