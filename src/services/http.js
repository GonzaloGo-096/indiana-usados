import axios from 'axios';
import { VITE_API_BASE_URL } from '../config/env.js';

// Cliente Axios base con configuración
const httpClient = axios.create({
  baseURL: VITE_API_BASE_URL,
  timeout: 10000, // 10 segundos
  headers: {
    'Content-Type': 'application/json',
  },
});

// Token en memoria para el interceptor
let authToken = null;

// Función para setear token (usada por auth service)
export const setAuthToken = (token) => {
  authToken = token;
  if (token) {
    localStorage.setItem('auth_token', token);
  } else {
    localStorage.removeItem('auth_token');
  }
};

// Función para obtener token (opcional)
export const getAuthToken = () => {
  return authToken;
};

// Interceptor para requests - agrega Authorization header si hay token
httpClient.interceptors.request.use(
  (config) => {
    if (authToken) {
      config.headers.Authorization = `Bearer ${authToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para responses - manejo básico de errores
httpClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Si es 401, limpiar token
    if (error.response?.status === 401) {
      setAuthToken(null);
    }
    return Promise.reject(error);
  }
);

export default httpClient; 