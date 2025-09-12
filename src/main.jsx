/**
 * main.jsx - Punto de entrada de la aplicación
 * 
 * Configuración:
 * - React Query
 * - Design Tokens
 * - Estilos globales
 * 
 * @author Indiana Usados
 * @version 1.0.0
 */

import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './styles/globals.css'
import './styles/fonts.css'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { GlobalErrorBoundary } from '@shared'
import { validateConfig } from './config'

// Validar configuración al inicio
if (!validateConfig()) {
  console.error('❌ Error en configuración de la aplicación')
}

// Crear una nueva instancia de QueryClient
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutos
      gcTime: 1000 * 60 * 30, // 30 minutos
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
})

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <GlobalErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </GlobalErrorBoundary>
  </React.StrictMode>,
)
