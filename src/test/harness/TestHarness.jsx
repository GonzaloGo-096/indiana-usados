/**
 * TestHarness - Proporciona un entorno de testing consistente
 * @author Indiana Usados
 * @version 1.0.0
 */

import React from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { MemoryRouter } from 'react-router-dom'

// 🔧 Configuración por defecto del QueryClient
const createDefaultQueryClient = () => new QueryClient({
  defaultOptions: {
    queries: { 
      retry: false,
      staleTime: 0,
      gcTime: 0
    },
    mutations: { 
      retry: false 
    }
  }
})

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

// 🎯 Hook helper para crear QueryClient personalizado
export const useTestQueryClient = (options = {}) => {
  return new QueryClient({
    defaultOptions: {
      queries: { 
        retry: false,
        staleTime: 0,
        gcTime: 0,
        ...options.queries
      },
      mutations: { 
        retry: false,
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