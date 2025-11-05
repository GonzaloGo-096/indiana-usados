/**
 * vehiclesApi.test.js - Tests del servicio de vehículos
 * 
 * @author Indiana Usados
 * @version 1.0.0
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { vehiclesService } from '../vehiclesApi'
import axiosInstance from '@api/axiosInstance'
import { buildFiltersForBackend } from '@utils/filters'

// Mock de dependencias
vi.mock('@api/axiosInstance', () => ({
  default: {
    get: vi.fn()
  }
}))

vi.mock('@utils/filters', () => ({
  buildFiltersForBackend: vi.fn(() => new URLSearchParams())
}))

vi.mock('@utils/logger', () => ({
  logger: {
    log: vi.fn(),
    warn: vi.fn(),
    error: vi.fn()
  }
}))

describe('vehiclesApi', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('getVehicles', () => {
    it('TEST 1: should fetch vehicles without filters', async () => {
      const mockResponse = {
        data: {
          allPhotos: {
            photos: [
              { _id: '1', marca: 'Toyota', modelo: 'Corolla', anio: 2020 },
              { _id: '2', marca: 'Honda', modelo: 'Civic', anio: 2021 }
            ],
            hasNextPage: false,
            nextPage: null
          }
        }
      }

      axiosInstance.get.mockResolvedValueOnce(mockResponse)

      const result = await vehiclesService.getVehicles({})

      expect(axiosInstance.get).toHaveBeenCalledWith(
        expect.stringContaining('/photos/getallphotos'),
        {}
      )
      expect(result).toEqual(mockResponse.data)
    })

    it('TEST 2: should fetch vehicles with filters', async () => {
      const mockFilters = { marca: ['Toyota'], anioDesde: 2020 }
      const mockUrlParams = new URLSearchParams()
      mockUrlParams.set('marca', 'Toyota')
      mockUrlParams.set('anioDesde', '2020')
      
      buildFiltersForBackend.mockReturnValueOnce(mockUrlParams)

      const mockResponse = {
        data: {
          allPhotos: {
            photos: [{ _id: '1', marca: 'Toyota', modelo: 'Corolla', anio: 2020 }],
            hasNextPage: false
          }
        }
      }

      axiosInstance.get.mockResolvedValueOnce(mockResponse)

      const result = await vehiclesService.getVehicles({ filters: mockFilters })

      expect(buildFiltersForBackend).toHaveBeenCalledWith(mockFilters)
      expect(axiosInstance.get).toHaveBeenCalledWith(
        expect.stringContaining('marca=Toyota'),
        {}
      )
      expect(result).toEqual(mockResponse.data)
    })

    it('TEST 3: should handle pagination correctly', async () => {
      const mockResponse = {
        data: {
          allPhotos: {
            photos: [{ _id: '1', marca: 'Toyota' }],
            hasNextPage: true,
            nextPage: 2
          }
        }
      }

      axiosInstance.get.mockResolvedValueOnce(mockResponse)

      const result = await vehiclesService.getVehicles({
        cursor: 2,
        limit: 8
      })

      expect(axiosInstance.get).toHaveBeenCalledWith(
        expect.stringContaining('cursor=2'),
        {}
      )
      expect(axiosInstance.get).toHaveBeenCalledWith(
        expect.stringContaining('limit=8'),
        {}
      )
      expect(result.allPhotos.hasNextPage).toBe(true)
    })

    it('TEST 4: should get vehicle by ID successfully', async () => {
      const mockVehicle = {
        _id: '123',
        marca: 'Toyota',
        modelo: 'Corolla',
        anio: 2020,
        precio: 15000
      }

      const mockResponse = { data: mockVehicle }
      axiosInstance.get.mockResolvedValueOnce(mockResponse)

      const result = await vehiclesService.getVehicleById('123')

      expect(axiosInstance.get).toHaveBeenCalledWith('/photos/getonephoto/123')
      expect(result).toEqual(mockVehicle)
    })

    it('TEST 5: should handle 404 error when vehicle not found', async () => {
      const error = {
        response: {
          status: 404,
          data: { message: 'Vehículo no encontrado' }
        }
      }

      axiosInstance.get.mockRejectedValueOnce(error)

      await expect(vehiclesService.getVehicleById('999')).rejects.toEqual(error)
      expect(axiosInstance.get).toHaveBeenCalledWith('/photos/getonephoto/999')
    })

    it('TEST 6: should handle network errors', async () => {
      const networkError = new Error('Network Error')
      networkError.code = 'ERR_NETWORK'

      axiosInstance.get.mockRejectedValueOnce(networkError)

      await expect(vehiclesService.getVehicles({})).rejects.toThrow('Network Error')
    })

    it('TEST 7: should handle empty response', async () => {
      const mockResponse = {
        data: {
          allPhotos: {
            photos: [],
            hasNextPage: false,
            nextPage: null
          }
        }
      }

      axiosInstance.get.mockResolvedValueOnce(mockResponse)

      const result = await vehiclesService.getVehicles({})

      expect(result.allPhotos.photos).toEqual([])
      expect(result.allPhotos.hasNextPage).toBe(false)
    })

    it('TEST 8: should transform data correctly', async () => {
      const mockResponse = {
        data: {
          allPhotos: {
            photos: [
              {
                _id: '1',
                marca: 'Toyota',
                modelo: 'Corolla',
                anio: 2020,
                precio: 15000,
                fotoPrincipal: 'https://example.com/photo.jpg'
              }
            ],
            hasNextPage: false
          }
        }
      }

      axiosInstance.get.mockResolvedValueOnce(mockResponse)

      const result = await vehiclesService.getVehicles({})

      expect(result.allPhotos.photos[0]).toHaveProperty('_id')
      expect(result.allPhotos.photos[0]).toHaveProperty('marca')
      expect(result.allPhotos.photos[0]).toHaveProperty('modelo')
    })

    it('TEST 9: should handle timeout errors', async () => {
      const timeoutError = new Error('timeout of 5000ms exceeded')
      timeoutError.code = 'ECONNABORTED'

      axiosInstance.get.mockRejectedValueOnce(timeoutError)

      await expect(vehiclesService.getVehicles({})).rejects.toThrow('timeout')
    })

    it('TEST 10: should handle multiple pages correctly', async () => {
      // Primera página
      const page1Response = {
        data: {
          allPhotos: {
            photos: [{ _id: '1', marca: 'Toyota' }],
            hasNextPage: true,
            nextPage: 2
          }
        }
      }

      // Segunda página
      const page2Response = {
        data: {
          allPhotos: {
            photos: [{ _id: '2', marca: 'Honda' }],
            hasNextPage: false,
            nextPage: null
          }
        }
      }

      axiosInstance.get
        .mockResolvedValueOnce(page1Response)
        .mockResolvedValueOnce(page2Response)

      const page1 = await vehiclesService.getVehicles({ cursor: 1 })
      const page2 = await vehiclesService.getVehicles({ cursor: 2 })

      expect(page1.allPhotos.hasNextPage).toBe(true)
      expect(page2.allPhotos.hasNextPage).toBe(false)
      expect(axiosInstance.get).toHaveBeenCalledTimes(2)
    })

    it('TEST 11: should handle request cancellation with AbortSignal', async () => {
      const abortController = new AbortController()
      const signal = abortController.signal

      const cancelledError = new Error('Request cancelled')
      cancelledError.name = 'AbortError'

      axiosInstance.get.mockRejectedValueOnce(cancelledError)

      await expect(
        vehiclesService.getVehicles({ signal })
      ).rejects.toThrow('Request cancelled')

      expect(axiosInstance.get).toHaveBeenCalledWith(
        expect.any(String),
        { signal }
      )
    })

    it('TEST 12: should handle rate limiting (429 error)', async () => {
      const rateLimitError = {
        response: {
          status: 429,
          data: { message: 'Too Many Requests' },
          headers: {
            'retry-after': '60'
          }
        }
      }

      axiosInstance.get.mockRejectedValueOnce(rateLimitError)

      await expect(vehiclesService.getVehicles({})).rejects.toEqual(rateLimitError)
      expect(axiosInstance.get).toHaveBeenCalledTimes(1)
    })

    describe('Edge cases', () => {
      it('should use default limit when invalid limit provided', async () => {
        const mockResponse = { data: { allPhotos: { photos: [] } } }
        axiosInstance.get.mockResolvedValueOnce(mockResponse)

        await vehiclesService.getVehicles({ limit: -5 })
        
        expect(axiosInstance.get).toHaveBeenCalledWith(
          expect.stringContaining('limit=12'),
          {}
        )
      })

      it('should use default cursor when invalid cursor provided', async () => {
        const mockResponse = { data: { allPhotos: { photos: [] } } }
        axiosInstance.get.mockResolvedValueOnce(mockResponse)

        await vehiclesService.getVehicles({ cursor: 'invalid' })
        
        expect(axiosInstance.get).toHaveBeenCalledWith(
          expect.stringContaining('cursor=1'),
          {}
        )
      })

      it('should throw error for invalid vehicle ID', async () => {
        await expect(vehiclesService.getVehicleById(null)).rejects.toThrow('ID de vehículo inválido')
        await expect(vehiclesService.getVehicleById('')).rejects.toThrow('ID de vehículo inválido')
        await expect(vehiclesService.getVehicleById(undefined)).rejects.toThrow('ID de vehículo inválido')
        
        expect(axiosInstance.get).not.toHaveBeenCalled()
      })
    })
  })
})
