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
import { validateConfig, REACT_QUERY_CONFIG } from './config'
import { initImageMetrics } from './metrics/imageTiming'

// Validar configuración al inicio
if (!validateConfig()) {
  // Error crítico - usar console.error como fallback ya que logger podría no estar disponible
  console.error('❌ Error en configuración de la aplicación')
}

// Inicializar métricas de imágenes
initImageMetrics()

// ✅ Crear QueryClient con configuración centralizada
const queryClient = new QueryClient(REACT_QUERY_CONFIG)

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <GlobalErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </GlobalErrorBoundary>
  </React.StrictMode>,
)
