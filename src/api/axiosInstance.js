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
export { detailAxiosInstance } 