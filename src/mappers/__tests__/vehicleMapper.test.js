/**
 * Tests para vehicleMapper.js - mapVehiclesPage
 * 
 * Función crítica: Transforma datos del backend al formato frontend
 * Afecta directamente cómo se muestran los vehículos en la lista
 * 
 * @author Indiana Usados
 * @version 1.0.0
 */

// 🎭 MOCKS DEBEN ESTAR ANTES DE LOS IMPORTS
import { vi } from 'vitest'

// Mock de imageExtractors
vi.mock('@utils/imageExtractors', () => {
  const mockExtractVehicleImageUrls = vi.fn((vehicle) => {
    if (!vehicle || typeof vehicle !== 'object') {
      return { principal: null, hover: null }
    }
    const principal = vehicle.fotoPrincipal?.url || vehicle.imagen?.url || null
    const hover = vehicle.fotoHover?.url || null
    return { principal, hover }
  })

  const mockExtractAllImageUrls = vi.fn((vehicle, options = {}) => {
    if (!vehicle || typeof vehicle !== 'object') return []
    const { includeExtras = true } = options
    const urls = []
    
    if (vehicle.fotoPrincipal?.url) urls.push(vehicle.fotoPrincipal.url)
    if (vehicle.fotoHover?.url && vehicle.fotoHover.url !== vehicle.fotoPrincipal?.url) {
      urls.push(vehicle.fotoHover.url)
    }
    
    // ✅ SOLO incluir extras si includeExtras es true
    if (includeExtras && Array.isArray(vehicle.fotosExtra)) {
      vehicle.fotosExtra.forEach(img => {
        if (img?.url) urls.push(img.url)
      })
    }
    
    return [...new Set(urls)]
  })

  return {
    extractVehicleImageUrls: mockExtractVehicleImageUrls,
    extractAllImageUrls: mockExtractAllImageUrls
  }
})

// Mock del logger
vi.mock('@utils/logger', () => ({
  logger: {
    error: vi.fn()
  }
}))

// ✅ AHORA LOS IMPORTS
import { describe, it, expect, beforeEach } from 'vitest'
import { mapVehiclesPage } from '../vehicleMapper'
import { createBackendVehicle, createBackendPageResponse } from '@test'

describe('vehicleMapper.js', () => {
  describe('mapVehiclesPage', () => {
    beforeEach(() => {
      vi.clearAllMocks()
    })

    // ✅ CASO CRÍTICO: Página válida
    it('mapea página válida correctamente', () => {
      const backendPage = createBackendPageResponse({
        allPhotos: {
          docs: [createBackendVehicle({ _id: 1, marca: 'Toyota', modelo: 'Corolla' })],
          totalDocs: 100,
          hasNextPage: true,
          nextPage: 2
        }
      })

      const result = mapVehiclesPage(backendPage)

      expect(result.vehicles).toHaveLength(1)
      expect(result.vehicles[0]).toHaveProperty('id', 1)
      expect(result.vehicles[0]).toHaveProperty('marca', 'Toyota')
      expect(result.vehicles[0]).toHaveProperty('modelo', 'Corolla')
      expect(result.total).toBe(100)
      expect(result.hasNextPage).toBe(true)
      expect(result.nextPage).toBe(2)
    })

    it('extrae imágenes correctamente', () => {
      const backendPage = createBackendPageResponse({
        allPhotos: {
          docs: [createBackendVehicle({
            fotoPrincipal: { url: 'https://principal.jpg' },
            fotoHover: { url: 'https://hover.jpg' }
          })],
          totalDocs: 1,
          hasNextPage: false,
          nextPage: null
        }
      })

      const result = mapVehiclesPage(backendPage)

      expect(result.vehicles[0]).toHaveProperty('fotoPrincipal', 'https://principal.jpg')
      expect(result.vehicles[0]).toHaveProperty('fotoHover', 'https://hover.jpg')
      expect(result.vehicles[0]).toHaveProperty('imagen', 'https://principal.jpg') // Alias
      expect(Array.isArray(result.vehicles[0].imágenes)).toBe(true)
    })

    it('mantiene passthrough completo de campos del backend', () => {
      const backendVehicle = createBackendVehicle({
        _id: 1,
        marca: 'Toyota',
        modelo: 'Corolla',
        precio: 15000000,
        año: 2020,
        campoPersonalizado: 'valor personalizado'
      })

      const backendPage = createBackendPageResponse({
        allPhotos: {
          docs: [backendVehicle],
          totalDocs: 1,
          hasNextPage: false,
          nextPage: null
        }
      })

      const result = mapVehiclesPage(backendPage)

      expect(result.vehicles[0]).toHaveProperty('campoPersonalizado', 'valor personalizado')
      expect(result.vehicles[0]).toHaveProperty('precio', 15000000)
      expect(result.vehicles[0]).toHaveProperty('año', 2020)
    })

    // ✅ CASO CRÍTICO: Página vacía
    it('maneja página vacía correctamente', () => {
      const backendPage = createBackendPageResponse({
        allPhotos: {
          docs: [],
          totalDocs: 0,
          hasNextPage: false,
          nextPage: null
        }
      })

      const result = mapVehiclesPage(backendPage)

      expect(result.vehicles).toHaveLength(0)
      expect(result.total).toBe(0)
      expect(result.hasNextPage).toBe(false)
      expect(result.totalPages).toBe(0)
    })

    it('maneja página con estructura undefined', () => {
      const result = mapVehiclesPage(undefined)

      expect(result.vehicles).toHaveLength(0)
      expect(result.total).toBe(0)
      expect(result.hasNextPage).toBe(false)
    })

    it('maneja página con allPhotos undefined', () => {
      const result = mapVehiclesPage({})

      expect(result.vehicles).toHaveLength(0)
      expect(result.total).toBe(0)
      expect(result.hasNextPage).toBe(false)
    })

    // ✅ CASO CRÍTICO: Vehículos inválidos
    it('filtra vehículos inválidos (null)', () => {
      const backendPage = createBackendPageResponse({
        allPhotos: {
          docs: [createBackendVehicle(), null, createBackendVehicle({ _id: 2 })],
          totalDocs: 3,
          hasNextPage: false,
          nextPage: null
        }
      })

      const result = mapVehiclesPage(backendPage)

      expect(result.vehicles).toHaveLength(2)
      expect(result.vehicles.every(v => v !== null)).toBe(true)
    })

    it('filtra vehículos inválidos (no objeto)', () => {
      const backendPage = createBackendPageResponse({
        allPhotos: {
          docs: [createBackendVehicle(), 'string inválido', 123],
          totalDocs: 3,
          hasNextPage: false,
          nextPage: null
        }
      })

      const result = mapVehiclesPage(backendPage)

      expect(result.vehicles).toHaveLength(1)
      expect(result.vehicles[0]).toHaveProperty('id')
    })

    // ✅ CASO CRÍTICO: Mapeo de ID
    it('mapea _id a id correctamente', () => {
      const backendPage = createBackendPageResponse({
        allPhotos: {
          docs: [createBackendVehicle({ _id: 123 })],
          totalDocs: 1,
          hasNextPage: false,
          nextPage: null
        }
      })

      const result = mapVehiclesPage(backendPage)

      expect(result.vehicles[0]).toHaveProperty('id', 123)
      expect(result.vehicles[0]).toHaveProperty('_id', 123) // También mantiene _id (passthrough)
    })

    it('usa id si _id no existe', () => {
      const backendPage = createBackendPageResponse({
        allPhotos: {
          docs: [{ id: 456, marca: 'Toyota', modelo: 'Corolla' }],
          totalDocs: 1,
          hasNextPage: false,
          nextPage: null
        }
      })

      const result = mapVehiclesPage(backendPage)

      expect(result.vehicles[0]).toHaveProperty('id', 456)
    })

    it('usa 0 como fallback si no hay id ni _id', () => {
      const backendPage = createBackendPageResponse({
        allPhotos: {
          docs: [{ marca: 'Toyota', modelo: 'Corolla' }],
          totalDocs: 1,
          hasNextPage: false,
          nextPage: null
        }
      })

      const result = mapVehiclesPage(backendPage)

      expect(result.vehicles[0]).toHaveProperty('id', 0)
    })

    // ✅ CASO CRÍTICO: Título compuesto
    it('genera título compuesto correctamente', () => {
      const backendPage = createBackendPageResponse({
        allPhotos: {
          docs: [createBackendVehicle({ marca: 'Toyota', modelo: 'Corolla' })],
          totalDocs: 1,
          hasNextPage: false,
          nextPage: null
        }
      })

      const result = mapVehiclesPage(backendPage)

      expect(result.vehicles[0]).toHaveProperty('title', 'Toyota Corolla')
    })

    it('genera título solo con marca si no hay modelo', () => {
      const backendPage = createBackendPageResponse({
        allPhotos: {
          docs: [createBackendVehicle({ marca: 'Toyota', modelo: null })],
          totalDocs: 1,
          hasNextPage: false,
          nextPage: null
        }
      })

      const result = mapVehiclesPage(backendPage)

      expect(result.vehicles[0].title).toBe('Toyota')
    })

    // ✅ CASO CRÍTICO: Paginación
    it('calcula totalPages correctamente', () => {
      const backendPage = createBackendPageResponse({
        allPhotos: {
          docs: [],
          totalDocs: 100,
          hasNextPage: true,
          nextPage: 2
        }
      })

      const result = mapVehiclesPage(backendPage)

      expect(result.totalPages).toBe(9) // Math.ceil(100 / 12) = 9
    })

    it('maneja currentCursor correctamente', () => {
      const backendPage = createBackendPageResponse({
        allPhotos: {
          docs: [],
          totalDocs: 0,
          hasNextPage: false,
          nextPage: null
        }
      })

      const result = mapVehiclesPage(backendPage, 5)

      expect(result.currentCursor).toBe(5)
    })

    it('retorna undefined para currentCursor si no se proporciona', () => {
      const backendPage = createBackendPageResponse()

      const result = mapVehiclesPage(backendPage)

      expect(result.currentCursor).toBeUndefined()
    })

    // ✅ CASO CRÍTICO: Múltiples vehículos
    it('mapea múltiples vehículos correctamente', () => {
      const backendPage = createBackendPageResponse({
        allPhotos: {
          docs: [
            createBackendVehicle({ _id: 1, marca: 'Toyota' }),
            createBackendVehicle({ _id: 2, marca: 'Ford' }),
            createBackendVehicle({ _id: 3, marca: 'Honda' })
          ],
          totalDocs: 3,
          hasNextPage: false,
          nextPage: null
        }
      })

      const result = mapVehiclesPage(backendPage)

      expect(result.vehicles).toHaveLength(3)
      expect(result.vehicles[0].marca).toBe('Toyota')
      expect(result.vehicles[1].marca).toBe('Ford')
      expect(result.vehicles[2].marca).toBe('Honda')
    })

    // ✅ CASO CRÍTICO: Manejo de errores
    it('retorna fallback seguro en caso de error', () => {
      // Crear un objeto que cause error al mapear
      const backendPage = {
        allPhotos: {
          docs: [{
            get propiedad() {
              throw new Error('Error intencional')
            }
          }],
          totalDocs: 1,
          hasNextPage: false,
          nextPage: null
        }
      }

      const result = mapVehiclesPage(backendPage)

      expect(result.vehicles).toHaveLength(0)
      expect(result.total).toBe(0)
      expect(result.hasNextPage).toBe(false)
      expect(result.totalPages).toBe(0)
    })

    it('maneja campos faltantes en allPhotos', () => {
      const backendPage = {
        allPhotos: {
          docs: [createBackendVehicle()]
          // Sin totalDocs, hasNextPage, nextPage
        }
      }

      const result = mapVehiclesPage(backendPage)

      expect(result.vehicles).toHaveLength(1)
      expect(result.total).toBe(0)
      expect(result.hasNextPage).toBe(false)
      expect(result.nextPage).toBeNull()
    })

    // ✅ CASO CRÍTICO: extractAllImageUrls con includeExtras: false
    it('no incluye fotosExtra en lista (includeExtras: false)', () => {
      const backendPage = createBackendPageResponse({
        allPhotos: {
          docs: [createBackendVehicle({
            fotoPrincipal: { url: 'principal.jpg' },
            fotoHover: { url: 'hover.jpg' },
            fotosExtra: [
              { url: 'extra1.jpg' },
              { url: 'extra2.jpg' }
            ]
          })],
          totalDocs: 1,
          hasNextPage: false,
          nextPage: null
        }
      })

      const result = mapVehiclesPage(backendPage)

      // En lista, imágenes solo debe incluir principal y hover, NO extras
      const imagenes = result.vehicles[0].imágenes
      expect(imagenes).toContain('principal.jpg')
      expect(imagenes).toContain('hover.jpg')
      expect(imagenes).not.toContain('extra1.jpg') // Verificar que NO incluye extras
      expect(imagenes).not.toContain('extra2.jpg')
    })
  })
})
