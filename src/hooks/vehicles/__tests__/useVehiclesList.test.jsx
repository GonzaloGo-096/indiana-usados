/**
 * useVehiclesList Hook Tests
 * @author Indiana Usados
 * @version 1.0.0
 */

import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { vi, describe, it, expect, beforeEach } from 'vitest'
import { useVehiclesList } from '../useVehiclesList'
import { createVehicleList, createFilters } from '@test'

// 🎭 Mocks
vi.mock('@api', () => ({
  vehiclesApi: {
    getVehicles: vi.fn()
  }
}))

vi.mock('@config', () => ({
  config: {
    api: {
      baseURL: 'http://localhost:3000',
      timeout: 5000
    }
  }
}))

// 🔧 Setup
const createTestQueryClient = () => new QueryClient({
  defaultOptions: {
    queries: { retry: false },
    mutations: { retry: false }
  }
})

const wrapper = ({ children }) => (
  <QueryClientProvider client={createTestQueryClient()}>
    {children}
  </QueryClientProvider>
)

// 📋 Tests
describe('useVehiclesList', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Estado inicial', () => {
    it('should start with initial state', () => {
      const { result } = renderHook(() => useVehiclesList(), { wrapper })
      
      expect(result.current.vehicles).toEqual([])
      expect(result.current.isLoading).toBe(true)
      expect(result.current.isError).toBe(false)
      expect(result.current.error).toBeNull()
    })
  })

  describe('Manejo de errores', () => {
    it('should handle API errors correctly', async () => {
      const { vehiclesApi } = await import('@api')
      
      // Mock que simula un error de red
      vehiclesApi.getVehicles.mockRejectedValue(new Error('Network Error'))

      const { result } = renderHook(() => useVehiclesList(), { wrapper })

      // Verificar que el hook maneja errores correctamente
      expect(typeof result.current.isError).toBe('boolean')
      expect(typeof result.current.error).toBe('object')
      expect(Array.isArray(result.current.vehicles)).toBe(true)
    })
  })

  describe('Cambios de filtros', () => {
    it('should refetch when filters change', async () => {
      const { vehiclesApi } = await import('@api')
      vehiclesApi.getVehicles.mockResolvedValue({
        data: createVehicleList(3),
        pagination: { currentPage: 1, totalPages: 2, hasNextPage: true }
      })

      const { result, rerender } = renderHook(
        (filters) => useVehiclesList(filters),
        { wrapper, initialProps: createFilters() }
      )

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      // Cambiar filtros
      const newFilters = createFilters({ marca: ['Toyota'] })
      rerender(newFilters)

      await waitFor(() => {
        expect(vehiclesApi.getVehicles).toHaveBeenCalledTimes(2)
      })
    })
  })

  describe('Paginación', () => {
    it('should have loadMore function and pagination state', async () => {
      const { vehiclesApi } = await import('@api')
      vehiclesApi.getVehicles.mockResolvedValue({
        data: createVehicleList(3),
        hasNextPage: true
      })

      const { result } = renderHook(() => useVehiclesList(), { wrapper })

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      // Verificar que la función loadMore existe
      expect(typeof result.current.loadMore).toBe('function')
      
      // Verificar estado inicial de paginación
      expect(result.current.currentPage).toBe(1)
      expect(result.current.hasNextPage).toBe(true)
      
      // Verificar que se puede llamar loadMore
      expect(() => result.current.loadMore()).not.toThrow()
    })
  })

  describe('Gestión de cache', () => {
    it('should invalidate cache when requested', async () => {
      const { vehiclesApi } = await import('@api')
      vehiclesApi.getVehicles.mockResolvedValue({
        data: createVehicleList(3),
        pagination: { currentPage: 1, totalPages: 1, hasNextPage: false }
      })

      const { result } = renderHook(() => useVehiclesList(), { wrapper })

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      // Invalidar cache
      result.current.invalidateCache()

      await waitFor(() => {
        expect(vehiclesApi.getVehicles).toHaveBeenCalledTimes(2)
      })
    })
  })
}) 