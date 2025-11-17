/**
 * main.jsx - Punto de entrada de la aplicación
 * 
 * Configuración:
 * - React Query
 * - Design Tokens
 * - Estilos globales
 * - Prefetch de rutas críticas
 * 
 * @author Indiana Usados
 * @version 1.3.0 - Logger integrado para métricas de performance
 */

import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './styles/globals.css'
import './styles/fonts.css'
import { QueryClient, QueryClientProvider, QueryCache, MutationCache } from '@tanstack/react-query'
import { GlobalErrorBoundary } from '@shared'
import { validateConfig, REACT_QUERY_CONFIG } from './config'
import { logger } from '@utils/logger'

// Hacer logger disponible globalmente para scripts que lo necesiten (ej: generateSitemap)
if (typeof window !== 'undefined') {
  window.logger = logger
}

// FCP/LCP Phase 3: Runtime diagnostics - Medir tiempos de ejecución
console.time('App bootstrap')

// FCP/LCP Phase 3: Performance API - Medir first-paint y first-contentful-paint
if (typeof window !== 'undefined' && window.performance) {
  window.addEventListener('load', () => {
    const paints = performance.getEntriesByType('paint')
    paints.forEach(p => {
      logger.debug('perf:paint', `${p.name}: ${p.startTime.toFixed(2)} ms`)
    })
  })

  // FCP/LCP Phase 3: PerformanceObserver para LCP (Largest Contentful Paint)
  if ('PerformanceObserver' in window) {
    try {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries()
        const lastEntry = entries[entries.length - 1]
        logger.debug('perf:lcp', `LCP: ${lastEntry.startTime.toFixed(2)} ms`, {
          element: lastEntry.element || lastEntry
        })
      })
      observer.observe({ entryTypes: ['largest-contentful-paint'] })
    } catch (e) {
      logger.warn('perf:observer', 'LCP observer no disponible', { error: e.message })
    }
  }
}

// Validar configuración al inicio
if (!validateConfig()) {
  logger.error('app:config', 'Error en configuración de la aplicación')
}

// ✅ Prefetch de ruta crítica (/vehiculos) cuando el navegador esté idle
if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
  requestIdleCallback(() => {
    // Prefetch del chunk de la ruta /vehiculos (segunda ruta más visitada)
    // Usar el mismo import que PublicRoutes.jsx para asegurar que se carga el mismo chunk
    import('./pages/Vehiculos').catch(() => {
      // Silenciar errores de prefetch (no crítico)
    })
  }, { timeout: 2000 })
}

// ✅ Crear QueryClient con configuración centralizada y handlers globales
const queryClient = new QueryClient({
  ...REACT_QUERY_CONFIG,
  queryCache: new QueryCache({
    onError: (error) => {
      const status = error?.response?.status
      if (status === 401) {
        try { window.dispatchEvent(new CustomEvent('auth:unauthorized')) } catch (_) { /* no-op */ }
      }
    }
  }),
  mutationCache: new MutationCache({
    onError: (error) => {
      const status = error?.response?.status
      if (status === 401) {
        try { window.dispatchEvent(new CustomEvent('auth:unauthorized')) } catch (_) { /* no-op */ }
      }
    }
  })
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

// FCP/LCP Phase 3: Runtime diagnostics - Finalizar medición de App bootstrap
console.timeEnd('App bootstrap')
