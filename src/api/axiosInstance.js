/**
 * axiosInstance.js - Configuración de Axios simplificada
 * 
 * Características:
 * - Configuración centralizada usando config/index.js
 * - Manejo de errores centralizado
 * - Timeouts configurables
 * - Performance optimizada
 * 
 * @author Indiana Usados
 * @version 4.0.0 - Configuración simplificada
 */

import axios from 'axios'
import { config } from '@config'
import { AUTH_CONFIG } from '@config/auth'
import { logger } from '@utils/logger'

// ✅ CONFIGURACIÓN SIMPLIFICADA USANDO CONFIG CENTRALIZADO
const getBaseURL = () => {
    return config.api.baseURL
}

const getTimeout = () => {
    return config.api.timeout
}

// Instancia principal para listado de vehículos
const axiosInstance = axios.create({
    baseURL: getBaseURL(),
    timeout: getTimeout(),
    headers: config.api.headers
})

// ✅ Instancia específica para autenticación
const authAxiosInstance = axios.create({
    baseURL: getBaseURL(),
    timeout: getTimeout(),
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
})

// ✅ INTERCEPTOR AUTOMÁTICO PARA TOKEN DE AUTH
authAxiosInstance.interceptors.request.use(
    (config) => {
        // Agregar token automáticamente si existe
        const token = localStorage.getItem(AUTH_CONFIG.storage.tokenKey)
        if (token) {
            config.headers.Authorization = `Bearer ${token}`
        }
        return config
    },
    (error) => {
        return Promise.reject(error)
    }
)

// ✅ INTERCEPTOR DE RESPUESTA PARA AUTH
authAxiosInstance.interceptors.response.use(
    (response) => {
        return response
    },
    (error) => {
        // Si el token expiró, limpiar localStorage
        if (error.response?.status === 401) {
            localStorage.removeItem(AUTH_CONFIG.storage.tokenKey)
            localStorage.removeItem(AUTH_CONFIG.storage.userKey)
            // Emitir evento global para que la UI decida navegar
            try {
                window.dispatchEvent(new CustomEvent('auth:unauthorized'))
            } catch (_) { /* no-op */ }
        }
        return Promise.reject(error)
    }
)

// ✅ LOGGING DE CONFIGURACIÓN (solo en desarrollo)
if (config.isDevelopment && config.features.debug) {
    logger.debug('axios:config', {
        baseURL: getBaseURL(),
        timeout: getTimeout(),
        mock: config.api.mock,
        environment: config.environment
    })
}

// Interceptor de request con timestamp para medir duración
axiosInstance.interceptors.request.use(
    (config) => {
        config.metadata = { start: performance.now() }
        return config
    },
    (error) => {
        return Promise.reject(error)
    }
)

// Interceptor de response con logging de errores (nivel-aware)
axiosInstance.interceptors.response.use(
    (response) => {
        if (response?.config?.metadata?.start) {
            response.config.metadata.durationMs = Math.round(performance.now() - response.config.metadata.start)
        }
        return response
    },
    (error) => {
        try {
            const cfg = error.config || {}
            const method = (cfg.method || 'GET').toUpperCase()
            const path = cfg.url || ''
            const base = cfg.baseURL || ''
            const url = `${base}${path}` || 'unknown'
            const status = error.response?.status
            const durationMs = cfg.metadata?.start ? Math.round(performance.now() - cfg.metadata.start) : undefined
            const tag = 'axios:error'

            const payload = { method, url, status, ms: durationMs }

            // Ignorar cancelaciones benignas
            const code = error.code
            const name = error.name
            const isCanceled = code === 'ERR_CANCELED' || name === 'CanceledError'
            if (isCanceled) {
                logger.debug('axios:cancel', payload)
                return Promise.reject(error)
            }

            if (status >= 500 || !status) {
                logger.error(tag, 'HTTP failure', payload)
            } else if (status >= 400) {
                logger.warn(tag, 'HTTP error', payload)
            } else {
                logger.warn(tag, 'Network/Unknown error', payload)
            }
        } catch (_) {
            // no-op, no romper en caso de fallo de logging
        }
        return Promise.reject(error)
    }
)

export default axiosInstance
export { authAxiosInstance } 