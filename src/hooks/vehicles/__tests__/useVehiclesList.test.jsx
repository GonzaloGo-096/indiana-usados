/**
 * useVehiclesList Hook Tests
 * @author Indiana Usados
 * @version 1.0.0
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useVehiclesList } from '../useVehiclesList'
import vehiclesService from '@services/vehiclesApi'
import { mapVehiclesPage } from '@mappers'

// Mock services
vi.mock('@services/vehiclesApi')
vi.mock('@mappers', () => ({
  mapVehiclesPage: vi.fn((page) => page)
}))

describe('useVehiclesList', () => {
  let queryClient
  let wrapper

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
          gcTime: 0,
          refetchOnWindowFocus: false
        }
      }
    })
    wrapper = ({ children }) => (
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    )
    vi.clearAllMocks()
    mapVehiclesPage.mockImplementation((page) => page)
  })

  afterEach(() => {
    queryClient.clear()
  })

  describe('Carga inicial', () => {
    it('should load vehicles on mount', async () => {
      const mockBackendResponse = {
        allPhotos: {
          docs: [
            { _id: 1, marca: 'Toyota', modelo: 'Corolla', precio: 25000 },
            { _id: 2, marca: 'Ford', modelo: 'Focus', precio: 22000 }
          ],
          totalDocs: 2,
          hasNextPage: false,
          nextPage: null
        }
      }

      vehiclesService.getVehicles.mockResolvedValue(mockBackendResponse)

      // Mock mapVehiclesPage para retornar formato esperado
      mapVehiclesPage.mockReturnValue({
        vehicles: [
          { id: 1, marca: 'Toyota', modelo: 'Corolla' },
          { id: 2, marca: 'Ford', modelo: 'Focus' }
        ],
        total: 2,
        hasNextPage: false,
        nextPage: null
      })

      const { result } = renderHook(() => useVehiclesList(), { wrapper })

      expect(result.current.isLoading).toBe(true)
      expect(result.current.vehicles).toEqual([])

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      expect(vehiclesService.getVehicles).toHaveBeenCalledWith({
        filters: {},
        limit: 8,
        cursor: 1,
        signal: expect.any(AbortSignal)
      })

      expect(result.current.vehicles).toHaveLength(2)
      expect(result.current.total).toBe(2)
      expect(result.current.hasNextPage).toBe(false)
      expect(result.current.isError).toBe(false)
    })

    it('should handle errors', async () => {
      const mockError = new Error('Network error')
      vehiclesService.getVehicles.mockRejectedValue(mockError)

      const { result } = renderHook(() => useVehiclesList(), { wrapper })

      // Esperar a que React Query procese el error (con retry: 2 del hook, puede tomar tiempo)
      await waitFor(() => {
        expect(result.current.isError || result.current.error).toBeTruthy()
      }, { timeout: 5000 })

      // Verificar que el error está presente
      expect(result.current.isError).toBe(true)
      expect(result.current.error).toBeDefined()
      expect(result.current.vehicles).toEqual([])
    })
  })

  describe('Filtros', () => {
    it('should apply filters correctly', async () => {
      const filters = { marca: ['Toyota'], año: [2020, 2021] }
      
      const mockBackendResponse = {
        allPhotos: {
          docs: [
            { _id: 1, marca: 'Toyota', modelo: 'Corolla', año: 2020 }
          ],
          totalDocs: 1,
          hasNextPage: false,
          nextPage: null
        }
      }

      vehiclesService.getVehicles.mockResolvedValue(mockBackendResponse)
      
      mapVehiclesPage.mockReturnValue({
        vehicles: [{ id: 1, marca: 'Toyota', modelo: 'Corolla', año: 2020 }],
        total: 1,
        hasNextPage: false,
        nextPage: null
      })

      const { result } = renderHook(() => useVehiclesList(filters), { wrapper })

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      expect(vehiclesService.getVehicles).toHaveBeenCalledWith({
        filters,
        limit: 8,
        cursor: 1,
        signal: expect.any(AbortSignal)
      })

      expect(result.current.vehicles).toHaveLength(1)
    })

    it('should reset to empty filters when filters change to empty', async () => {
      // Primera carga con filtros
      const filtersWithData = { marca: ['Toyota'] }
      const filteredResponse = {
        allPhotos: {
          docs: [{ _id: 1, marca: 'Toyota', modelo: 'Corolla' }],
          totalDocs: 1,
          hasNextPage: false,
          nextPage: null
        }
      }

      // Segunda carga sin filtros
      const emptyFiltersResponse = {
        allPhotos: {
          docs: [
            { _id: 1, marca: 'Toyota', modelo: 'Corolla' },
            { _id: 2, marca: 'Ford', modelo: 'Focus' }
          ],
          totalDocs: 2,
          hasNextPage: false,
          nextPage: null
        }
      }

      vehiclesService.getVehicles
        .mockResolvedValueOnce(filteredResponse)
        .mockResolvedValueOnce(emptyFiltersResponse)

      mapVehiclesPage.mockImplementation((page) => {
        const docs = page?.allPhotos?.docs || []
        return {
          vehicles: docs.map(v => ({
            id: v._id,
            marca: v.marca,
            modelo: v.modelo
          })),
          total: page?.allPhotos?.totalDocs || 0,
          hasNextPage: page?.allPhotos?.hasNextPage || false,
          nextPage: page?.allPhotos?.nextPage || null
        }
      })

      // Primera carga con filtros
      const { result, rerender } = renderHook(
        ({ filters }) => useVehiclesList(filters),
        { wrapper, initialProps: { filters: filtersWithData } }
      )

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      expect(result.current.vehicles).toHaveLength(1)
      expect(vehiclesService.getVehicles).toHaveBeenCalledWith({
        filters: filtersWithData,
        limit: 8,
        cursor: 1,
        signal: expect.any(AbortSignal)
      })

      // Cambiar a filtros vacíos (limpiar)
      rerender({ filters: {} })

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
        expect(result.current.vehicles.length).toBeGreaterThan(1)
      }, { timeout: 3000 })

      expect(vehiclesService.getVehicles).toHaveBeenCalledWith({
        filters: {},
        limit: 8,
        cursor: 1,
        signal: expect.any(AbortSignal)
      })
    })
  })

  describe('Paginación', () => {
    it('should load more pages when loadMore is called', async () => {
      const firstPageResponse = {
        allPhotos: {
          docs: [
            { _id: 1, marca: 'Toyota', modelo: 'Corolla' },
            { _id: 2, marca: 'Ford', modelo: 'Focus' }
          ],
          totalDocs: 4,
          hasNextPage: true,
          nextPage: 2
        }
      }

      const secondPageResponse = {
        allPhotos: {
          docs: [
            { _id: 3, marca: 'Chevrolet', modelo: 'Onix' },
            { _id: 4, marca: 'Volkswagen', modelo: 'Gol' }
          ],
          totalDocs: 4,
          hasNextPage: false,
          nextPage: null
        }
      }

      vehiclesService.getVehicles
        .mockResolvedValueOnce(firstPageResponse)
        .mockResolvedValueOnce(secondPageResponse)

      // Mock mapVehiclesPage para procesar páginas dinámicamente
      mapVehiclesPage.mockImplementation((page) => {
        const docs = page?.allPhotos?.docs || []
        return {
          vehicles: docs.map(v => ({
            id: v._id,
            marca: v.marca,
            modelo: v.modelo
          })),
          total: page?.allPhotos?.totalDocs || 0,
          hasNextPage: page?.allPhotos?.hasNextPage || false,
          nextPage: page?.allPhotos?.nextPage || null
        }
      })

      const { result } = renderHook(() => useVehiclesList(), { wrapper })

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      expect(result.current.vehicles).toHaveLength(2)
      expect(result.current.hasNextPage).toBe(true)

      // Cargar más
      result.current.loadMore()

      await waitFor(() => {
        expect(result.current.isLoadingMore).toBe(false)
        expect(result.current.vehicles.length).toBeGreaterThanOrEqual(4)
      }, { timeout: 3000 })

      expect(result.current.vehicles).toHaveLength(4)
      expect(result.current.hasNextPage).toBe(false)
    })

    it('should indicate hasNextPage correctly', async () => {
      const mockResponse = {
        allPhotos: {
          docs: [{ _id: 1, marca: 'Toyota' }],
          totalDocs: 2,
          hasNextPage: true,
          nextPage: 2
        }
      }

      vehiclesService.getVehicles.mockResolvedValue(mockResponse)

      mapVehiclesPage.mockReturnValue({
        vehicles: [{ id: 1, marca: 'Toyota' }],
        total: 2,
        hasNextPage: true,
        nextPage: 2
      })

      const { result } = renderHook(() => useVehiclesList(), { wrapper })

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      expect(result.current.hasNextPage).toBe(true)
    })

    it('should show isLoadingMore when loading more pages', async () => {
      const firstPageResponse = {
        allPhotos: {
          docs: [{ _id: 1, marca: 'Toyota' }],
          totalDocs: 2,
          hasNextPage: true,
          nextPage: 2
        }
      }

      vehiclesService.getVehicles
        .mockResolvedValueOnce(firstPageResponse)
        .mockImplementationOnce(() => new Promise(resolve => {
          setTimeout(() => resolve({
            allPhotos: {
              docs: [{ _id: 2, marca: 'Ford' }],
              totalDocs: 2,
              hasNextPage: false,
              nextPage: null
            }
          }), 100)
        }))

      mapVehiclesPage
        .mockReturnValueOnce({
          vehicles: [{ id: 1, marca: 'Toyota' }],
          total: 2,
          hasNextPage: true,
          nextPage: 2
        })
        .mockReturnValueOnce({
          vehicles: [{ id: 2, marca: 'Ford' }],
          total: 2,
          hasNextPage: false,
          nextPage: null
        })

      const { result } = renderHook(() => useVehiclesList(), { wrapper })

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      result.current.loadMore()

      // Verificar que isLoadingMore se activa
      await waitFor(() => {
        expect(result.current.isLoadingMore).toBe(true)
      }, { timeout: 500 })

      // Esperar a que termine
      await waitFor(() => {
        expect(result.current.isLoadingMore).toBe(false)
      }, { timeout: 2000 })
    })
  })

  describe('Invalidación de caché', () => {
    it('should refetch data when refetch is called', async () => {
      const mockResponse = {
        allPhotos: {
          docs: [{ _id: 1, marca: 'Toyota' }],
          totalDocs: 1,
          hasNextPage: false,
          nextPage: null
        }
      }

      vehiclesService.getVehicles.mockResolvedValue(mockResponse)

      mapVehiclesPage.mockReturnValue({
        vehicles: [{ id: 1, marca: 'Toyota' }],
        total: 1,
        hasNextPage: false,
        nextPage: null
      })

      const { result } = renderHook(() => useVehiclesList(), { wrapper })

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      expect(vehiclesService.getVehicles).toHaveBeenCalledTimes(1)

      result.current.refetch()

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      expect(vehiclesService.getVehicles).toHaveBeenCalledTimes(2)
    })
  })
})
