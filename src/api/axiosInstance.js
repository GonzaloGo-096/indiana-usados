import axios from 'axios';

// Configuración de la URL base desde variables de entorno
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://api.indiana-usados.com';

// Crear instancia de Axios con configuración base
const axiosInstance = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000, // 10 segundos
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
});

// Interceptor para requests (peticiones salientes)
axiosInstance.interceptors.request.use(
    (config) => {
        // Log de peticiones en desarrollo
        if (import.meta.env.DEV) {
            console.log(`🚀 [API Request] ${config.method?.toUpperCase()} ${config.url}`, {
                params: config.params,
                data: config.data,
            });
        }

        // Aquí puedes agregar token de autenticación si es necesario
        // const token = localStorage.getItem('authToken');
        // if (token) {
        //     config.headers.Authorization = `Bearer ${token}`;
        // }

        return config;
    },
    (error) => {
        console.error('❌ [API Request Error]:', error);
        return Promise.reject(error);
    }
);

// Interceptor para responses (respuestas entrantes)
axiosInstance.interceptors.response.use(
    (response) => {
        // Log de respuestas en desarrollo
        if (import.meta.env.DEV) {
            console.log(`✅ [API Response] ${response.status} ${response.config.url}`, {
                data: response.data,
            });
        }

        return response;
    },
    (error) => {
        // Log de errores
        console.error('❌ [API Response Error]:', {
            status: error.response?.status,
            statusText: error.response?.statusText,
            url: error.config?.url,
            message: error.message,
            data: error.response?.data,
        });

        // Manejo específico de errores HTTP
        if (error.response) {
            switch (error.response.status) {
                case 401:
                    console.error('🔐 Error de autenticación');
                    // Aquí puedes redirigir al login
                    break;
                case 403:
                    console.error('🚫 Error de autorización');
                    break;
                case 404:
                    console.error('🔍 Recurso no encontrado');
                    break;
                case 500:
                    console.error('💥 Error del servidor');
                    break;
                default:
                    console.error(`⚠️ Error HTTP ${error.response.status}`);
            }
        } else if (error.request) {
            console.error('🌐 Error de red - No se pudo conectar al servidor');
        } else {
            console.error('❓ Error desconocido:', error.message);
        }

        return Promise.reject(error);
    }
);

// Función helper para crear URLs de endpoints
export const createEndpoint = (path) => `${path}`;

// Función helper para manejar errores de API
export const handleApiError = (error) => {
    if (error.response?.data?.message) {
        return error.response.data.message;
    }
    if (error.message) {
        return error.message;
    }
    return 'Error desconocido';
};

// Función helper para validar respuestas
export const validateResponse = (response) => {
    if (!response || !response.data) {
        throw new Error('Respuesta inválida del servidor');
    }
    return response.data;
};

export default axiosInstance; 