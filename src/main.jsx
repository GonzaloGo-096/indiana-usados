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
 * @version 1.1.0 - Prefetch de rutas críticas agregado
 * @version 1.2.0 - FCP/LCP Phase 3: Runtime diagnostics agregado
 */

import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './styles/globals.css'
import './styles/fonts.css'
import { QueryClient, QueryClientProvider, QueryCache, MutationCache } from '@tanstack/react-query'
import { GlobalErrorBoundary } from '@shared'
import { validateConfig, REACT_QUERY_CONFIG } from './config'

// FCP/LCP Phase 3: Runtime diagnostics - Medir tiempos de ejecución
console.time('App bootstrap')

// FCP/LCP Phase 3: Performance API - Medir first-paint y first-contentful-paint
if (typeof window !== 'undefined' && window.performance) {
  window.addEventListener('load', () => {
    const paints = performance.getEntriesByType('paint')
    paints.forEach(p => {
      console.log(`[Performance API] ${p.name}: ${p.startTime.toFixed(2)} ms`)
    })
  })

  // FCP/LCP Phase 3: PerformanceObserver para LCP (Largest Contentful Paint)
  if ('PerformanceObserver' in window) {
    try {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries()
        const lastEntry = entries[entries.length - 1]
        console.log(`[PerformanceObserver] LCP: ${lastEntry.startTime.toFixed(2)} ms`)
        console.log(`[PerformanceObserver] LCP element:`, lastEntry.element || lastEntry)
      })
      observer.observe({ entryTypes: ['largest-contentful-paint'] })
    } catch (e) {
      console.warn('[PerformanceObserver] LCP observer no disponible:', e.message)
    }
  }
}

// Validar configuración al inicio
if (!validateConfig()) {
  // Error crítico - usar console.error como fallback ya que logger podría no estar disponible
  console.error('❌ Error en configuración de la aplicación')
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
