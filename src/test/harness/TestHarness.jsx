/**
 * TestHarness - Proporciona un entorno de testing consistente
 * @author Indiana Usados
 * @version 1.0.0
 */

import React from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { MemoryRouter } from 'react-router-dom'
import { REACT_QUERY_TEST_CONFIG } from '@config'

// ✅ Crear QueryClient con configuración centralizada para tests
const createDefaultQueryClient = () => new QueryClient(REACT_QUERY_TEST_CONFIG)

// 🎭 Componente TestHarness principal
export const TestHarness = ({ 
  children, 
  queryClient = createDefaultQueryClient(),
  initialEntries = ['/'],
  ...routerProps 
}) => {
  return (
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={initialEntries} {...routerProps}>
        {children}
      </MemoryRouter>
    </QueryClientProvider>
  )
}

// 🎯 Hook helper para crear QueryClient personalizado con overrides
export const useTestQueryClient = (options = {}) => {
  return new QueryClient({
    defaultOptions: {
      queries: { 
        ...REACT_QUERY_TEST_CONFIG.defaultOptions.queries,
        ...options.queries
      },
      mutations: { 
        ...REACT_QUERY_TEST_CONFIG.defaultOptions.mutations,
        ...options.mutations
      }
    }
  })
}

// 📱 Helper para simular diferentes rutas
export const createRouterProps = (path = '/') => ({
  initialEntries: [path],
  initialIndex: 0
}) 