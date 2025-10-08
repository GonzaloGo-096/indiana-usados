/**
 * config/reactQuery.js - Configuración de React Query
 * 
 * Configuración centralizada para React Query (TanStack Query)
 * Reutilizable en producción y tests
 * 
 * @author Indiana Usados
 * @version 1.0.0 - Config centralizada
 */

// ===== CONFIGURACIÓN DE REACT QUERY =====
export const REACT_QUERY_CONFIG = {
  defaultOptions: {
    queries: {
      // Cache & Stale Time
      staleTime: 1000 * 60 * 5,    // 5 minutos - datos considerados frescos
      gcTime: 1000 * 60 * 30,       // 30 minutos - tiempo antes de garbage collection
      
      // Retry & Refetch
      retry: 1,                     // 1 reintento en caso de error
      refetchOnWindowFocus: false,  // No refetch al cambiar de tab
      refetchOnReconnect: true,     // Sí refetch al reconectar internet
      
      // Network Mode
      networkMode: 'online',        // Solo ejecutar queries si hay conexión
    },
    mutations: {
      retry: 2,                     // 2 reintentos para mutations (más críticas)
      networkMode: 'online',
    }
  }
}

// ===== CONFIGURACIÓN PARA TESTS =====
export const REACT_QUERY_TEST_CONFIG = {
  defaultOptions: {
    queries: {
      retry: false,                 // No retry en tests
      staleTime: 0,                 // Siempre stale en tests
      gcTime: 0,                    // Sin cache en tests
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
    },
    mutations: {
      retry: false,
    }
  }
}

export default REACT_QUERY_CONFIG

