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

// Instancia separada para detalle de vehículos (misma configuración)
const detailAxiosInstance = axios.create({
    baseURL: getBaseURL(), // Usar misma URL para simplificar
    timeout: getTimeout(),
    headers: config.api.headers
})

// ✅ NUEVA: Instancia específica para autenticación
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
        const token = localStorage.getItem('auth_token')
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
            localStorage.removeItem('auth_token')
            localStorage.removeItem('auth_user')
            // Redirigir al login si es necesario
            if (window.location.pathname !== '/admin/login') {
                window.location.href = '/admin/login'
            }
        }
        return Promise.reject(error)
    }
)

// ✅ LOGGING DE CONFIGURACIÓN (solo en desarrollo)
if (config.isDevelopment && config.features.debug) {
    console.log('🔧 CONFIGURACIÓN AXIOS:', {
        baseURL: getBaseURL(),
        timeout: getTimeout(),
        mock: config.api.mock,
        environment: config.environment
    })
}

// Interceptor de request simplificado
axiosInstance.interceptors.request.use(
    (config) => {
        return config
    },
    (error) => {
        return Promise.reject(error)
    }
)

// Interceptor de response simplificado
axiosInstance.interceptors.response.use(
    (response) => {
        return response
    },
    (error) => {
        return Promise.reject(error)
    }
)

export default axiosInstance
export { detailAxiosInstance, authAxiosInstance } 