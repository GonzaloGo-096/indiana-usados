/**
 * useCarMutation Hook Tests
 * @author Indiana Usados
 * @version 1.0.0
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useCarMutation } from '../useCarMutation'
import vehiclesAdminService from '@services/admin/vehiclesAdminService'
import { AUTH_CONFIG } from '@config/auth'

// Mock services
vi.mock('@services/admin/vehiclesAdminService')
vi.mock('@config/auth', () => ({
  AUTH_CONFIG: {
    storage: {
      tokenKey: 'auth_token'
    }
  }
}))

describe('useCarMutation', () => {
  let queryClient
  let wrapper

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false, gcTime: 0 },
        mutations: { retry: false }
      }
    })
    wrapper = ({ children }) => (
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    )
    
    // Mock localStorage correctamente
    const localStorageMock = {
      getItem: vi.fn((key) => {
        if (key === 'auth_token') return 'mock-token'
        return null
      }),
      setItem: vi.fn(),
      removeItem: vi.fn(),
      clear: vi.fn()
    }
    global.localStorage = localStorageMock
    
    vi.clearAllMocks()
  })

  afterEach(() => {
    queryClient.clear()
    vi.restoreAllMocks()
  })

  describe('Create Vehicle', () => {
    it('should create vehicle successfully', async () => {
      const mockResponse = { data: { id: 1, marca: 'Toyota', modelo: 'Corolla' } }
      vehiclesAdminService.createVehicle.mockResolvedValue(mockResponse)

      const formData = new FormData()
      formData.append('marca', 'Toyota')
      formData.append('modelo', 'Corolla')

      const { result } = renderHook(() => useCarMutation(), { wrapper })

      result.current.createMutation.mutate(formData)

      await waitFor(() => {
        expect(result.current.createMutation.isSuccess).toBe(true)
      })

      expect(vehiclesAdminService.createVehicle).toHaveBeenCalledWith(formData)
      expect(result.current.createMutation.data).toEqual(mockResponse.data)
    })

    it('should handle errors in create', async () => {
      const mockError = { 
        response: { status: 400, data: { message: 'Validation error' } },
        message: 'Bad Request'
      }
      vehiclesAdminService.createVehicle.mockRejectedValue(mockError)

      const formData = new FormData()
      formData.append('marca', '')

      const { result } = renderHook(() => useCarMutation(), { wrapper })

      result.current.createMutation.mutate(formData)

      await waitFor(() => {
        expect(result.current.createMutation.isError).toBe(true)
      })

      expect(result.current.createMutation.error).toBeDefined()
    })
  })

  describe('Update Vehicle', () => {
    it('should update vehicle successfully', async () => {
      const mockResponse = { data: { id: 1, marca: 'Toyota', modelo: 'Corolla Updated' } }
      vehiclesAdminService.updateVehicle.mockResolvedValue(mockResponse)

      const formData = new FormData()
      formData.append('marca', 'Toyota')
      formData.append('modelo', 'Corolla Updated')

      const { result } = renderHook(() => useCarMutation(), { wrapper })

      result.current.updateMutation.mutate({ id: 1, formData })

      await waitFor(() => {
        expect(result.current.updateMutation.isSuccess).toBe(true)
      })

      expect(vehiclesAdminService.updateVehicle).toHaveBeenCalledWith(1, formData)
      expect(result.current.updateMutation.data).toEqual(mockResponse.data)
    })

    it('should handle errors in update', async () => {
      const mockError = {
        response: { status: 404, data: { error: 'Vehicle not found' } },
        message: 'Not Found'
      }
      vehiclesAdminService.updateVehicle.mockRejectedValue(mockError)

      const formData = new FormData()
      formData.append('marca', 'Toyota')

      const { result } = renderHook(() => useCarMutation(), { wrapper })

      result.current.updateMutation.mutate({ id: 999, formData })

      await waitFor(() => {
        expect(result.current.updateMutation.isError).toBe(true)
      })

      expect(result.current.updateMutation.error).toBeDefined()
    })
  })

  describe('Delete Vehicle', () => {
    it('should delete vehicle successfully', async () => {
      const mockResponse = { data: { success: true } }
      vehiclesAdminService.deleteVehicle.mockResolvedValue(mockResponse)

      const { result } = renderHook(() => useCarMutation(), { wrapper })

      result.current.deleteMutation.mutate(1)

      await waitFor(() => {
        expect(result.current.deleteMutation.isSuccess).toBe(true)
      })

      expect(vehiclesAdminService.deleteVehicle).toHaveBeenCalledWith(1)
      expect(result.current.deleteMutation.data).toEqual(mockResponse.data)
    })

    it('should handle errors in delete', async () => {
      const mockError = {
        response: { status: 403 },
        message: 'Forbidden'
      }
      vehiclesAdminService.deleteVehicle.mockRejectedValue(mockError)

      const { result } = renderHook(() => useCarMutation(), { wrapper })

      result.current.deleteMutation.mutate(1)

      await waitFor(() => {
        expect(result.current.deleteMutation.isError).toBe(true)
      })

      expect(result.current.deleteMutation.error).toBeDefined()
    })
  })
})
