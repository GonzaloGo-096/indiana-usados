/**
 * axiosInstance.js - Configuración de Axios optimizada
 * 
 * Características:
 * - Configuración dinámica basada en variables de entorno
 * - Manejo de errores centralizado
 * - Timeouts configurables
 * - Performance optimizada
 * 
 * @author Indiana Usados
 * @version 3.0.0 - Variables de entorno dinámicas
 * 
 * ⚠️ IMPORTANTE: Configurar variables de entorno en .env.local
 */

import axios from 'axios'

// ✅ CONFIGURACIÓN DINÁMICA BASADA EN VARIABLES DE ENTORNO
const getBaseURL = () => {
    // Si está habilitado el mock API
    if (import.meta.env.VITE_USE_MOCK_API === 'true') {
        // Si está habilitado Postman Mock
        if (import.meta.env.VITE_USE_POSTMAN_MOCK === 'true') {
            return import.meta.env.VITE_POSTMAN_MOCK_URL || 'https://c65a35e4-099e-4f66-a282-1f975219d583.mock.pstmn.io'
        }
        // Fallback a mock local (futuro)
        return import.meta.env.VITE_MOCK_API_URL || 'http://localhost:3000/api'
    }
    
    // Backend real
    return import.meta.env.VITE_API_URL || 'http://localhost:3001/api'
}

const getDetailBaseURL = () => {
    // Para detalle, usar la misma lógica pero con URL específica si existe
    if (import.meta.env.VITE_USE_MOCK_API === 'true' && import.meta.env.VITE_USE_POSTMAN_MOCK === 'true') {
        return import.meta.env.VITE_POSTMAN_DETAIL_URL || import.meta.env.VITE_POSTMAN_MOCK_URL || 'https://0ce757d8-1c7a-4cec-9872-b3e45dd2d032.mock.pstmn.io'
    }
    
    return getBaseURL()
}

// ✅ CONFIGURACIÓN DE TIMEOUT DINÁMICA
const getTimeout = () => {
    return parseInt(import.meta.env.VITE_API_TIMEOUT) || 5000
}

// Instancia principal para listado de vehículos
const axiosInstance = axios.create({
    baseURL: getBaseURL(),
    timeout: getTimeout(),
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
})

// Instancia separada para detalle de vehículos
const detailAxiosInstance = axios.create({
    baseURL: getDetailBaseURL(),
    timeout: getTimeout(),
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
})

// ✅ LOGGING DE CONFIGURACIÓN (solo en desarrollo)
if (import.meta.env.DEV) {
    console.log('🔧 CONFIGURACIÓN AXIOS:', {
        baseURL: getBaseURL(),
        detailBaseURL: getDetailBaseURL(),
        timeout: getTimeout(),
        useMock: import.meta.env.VITE_USE_MOCK_API,
        usePostman: import.meta.env.VITE_USE_POSTMAN_MOCK
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