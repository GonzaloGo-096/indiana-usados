/**
 * imageUtils.test.js - Tests de utilidades de imágenes
 * 
 * @author Indiana Usados
 * @version 1.0.0
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { getCarouselImages, isValidImage } from '../imageUtils'
import { normalizeVehicleImages, normalizeImageField } from '../imageNormalizerOptimized'

// Mock de dependencias
vi.mock('../imageNormalizerOptimized', () => ({
  normalizeVehicleImages: vi.fn(),
  normalizeImageField: vi.fn()
}))

vi.mock('@assets', () => ({
  defaultCarImage: '/src/assets/auto1.jpg'
}))

vi.mock('@utils/logger', () => ({
  logger: {
    warn: vi.fn(),
    error: vi.fn()
  }
}))

describe('imageUtils', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('TEST 1: getCarouselImages - Validación de entrada', () => {
    it('should return default image when auto is null', () => {
      const result = getCarouselImages(null)
      
      expect(result).toEqual(['/src/assets/auto1.jpg'])
      expect(normalizeVehicleImages).not.toHaveBeenCalled()
    })

    it('should return default image when auto is undefined', () => {
      const result = getCarouselImages(undefined)
      
      expect(result).toEqual(['/src/assets/auto1.jpg'])
    })

    it('should return default image when auto is an array', () => {
      const result = getCarouselImages([1, 2, 3])
      
      expect(result).toEqual(['/src/assets/auto1.jpg'])
    })

    it('should return default image when auto is not an object', () => {
      const result = getCarouselImages('string')
      
      expect(result).toEqual(['/src/assets/auto1.jpg'])
    })
  })

  describe('TEST 2: getCarouselImages - Con imágenes normalizadas', () => {
    it('should return carousel images when normalized images exist', () => {
      const mockNormalized = {
        fotoPrincipal: { url: 'image1.jpg', public_id: 'id1', original_name: 'img1.jpg' },
        fotoHover: { url: 'image2.jpg', public_id: 'id2', original_name: 'img2.jpg' },
        fotosExtra: [
          { url: 'image3.jpg', public_id: 'id3', original_name: 'img3.jpg' }
        ]
      }

      normalizeVehicleImages.mockReturnValue(mockNormalized)

      const result = getCarouselImages({})

      expect(result).toHaveLength(3)
      expect(result[0]).toEqual(mockNormalized.fotoPrincipal)
      expect(result[1]).toEqual(mockNormalized.fotoHover)
      expect(result[2]).toEqual(mockNormalized.fotosExtra[0])
    })

    it('should exclude fotoHover if it does not exist', () => {
      const mockNormalized = {
        fotoPrincipal: { url: 'image1.jpg', public_id: 'id1', original_name: 'img1.jpg' },
        fotoHover: null,
        fotosExtra: []
      }

      normalizeVehicleImages.mockReturnValue(mockNormalized)

      const result = getCarouselImages({})

      expect(result).toHaveLength(1)
      expect(result[0]).toEqual(mockNormalized.fotoPrincipal)
    })

    it('should exclude invalid images', () => {
      const mockNormalized = {
        fotoPrincipal: { url: 'image1.jpg', public_id: 'id1', original_name: 'img1.jpg' },
        fotoHover: null,
        fotosExtra: [
          { url: '', public_id: 'id2', original_name: 'img2.jpg' }, // URL vacía
          { url: 'undefined', public_id: 'id3', original_name: 'img3.jpg' }, // URL inválida
          { url: 'image3.jpg', public_id: 'id3', original_name: 'img3.jpg' } // Válida
        ]
      }

      normalizeVehicleImages.mockReturnValue(mockNormalized)

      const result = getCarouselImages({})

      expect(result).toHaveLength(2) // Solo fotoPrincipal e image3.jpg
      expect(result[0]).toEqual(mockNormalized.fotoPrincipal)
      expect(result[1]).toEqual(mockNormalized.fotosExtra[2])
    })
  })

  describe('TEST 3: getCarouselImages - Fallback a imagen simple', () => {
    it('should use fallback imagen field when no normalized images', () => {
      normalizeVehicleImages.mockReturnValue({
        fotoPrincipal: null,
        fotoHover: null,
        fotosExtra: []
      })

      normalizeImageField.mockReturnValue({
        url: 'fallback.jpg',
        public_id: 'fallback-id',
        original_name: 'fallback.jpg'
      })

      const result = getCarouselImages({ imagen: 'fallback.jpg' })

      expect(normalizeImageField).toHaveBeenCalledWith('fallback.jpg')
      expect(result).toHaveLength(1)
      expect(result[0].url).toBe('fallback.jpg')
    })

    it('should use default image when fallback imagen is also invalid', () => {
      normalizeVehicleImages.mockReturnValue({
        fotoPrincipal: null,
        fotoHover: null,
        fotosExtra: []
      })

      normalizeImageField.mockReturnValue(null)

      const result = getCarouselImages({ imagen: '' })

      expect(result).toEqual(['/src/assets/auto1.jpg'])
    })
  })

  describe('TEST 4: getCarouselImages - Manejo de errores', () => {
    it('should catch errors and return fallback', () => {
      normalizeVehicleImages.mockImplementation(() => {
        throw new Error('Test error')
      })

      normalizeImageField.mockReturnValue(null)

      const result = getCarouselImages({})

      expect(result).toEqual(['/src/assets/auto1.jpg'])
    })

    it('should try fallback imagen when normalization throws error', () => {
      normalizeVehicleImages.mockImplementation(() => {
        throw new Error('Test error')
      })

      normalizeImageField.mockReturnValue({
        url: 'fallback.jpg',
        public_id: 'fallback-id',
        original_name: 'fallback.jpg'
      })

      const result = getCarouselImages({ imagen: 'fallback.jpg' })

      expect(normalizeImageField).toHaveBeenCalledWith('fallback.jpg')
      expect(result).toHaveLength(1)
      expect(result[0].url).toBe('fallback.jpg')
    })
  })

  describe('TEST 5: isValidImage - Validación de estructura', () => {
    it('should return true for valid image object', () => {
      const validImage = {
        url: 'https://example.com/image.jpg',
        public_id: 'test-id',
        original_name: 'image.jpg'
      }

      expect(isValidImage(validImage)).toBe(true)
    })

    it('should return false for null', () => {
      expect(isValidImage(null)).toBe(false)
    })

    it('should return false for undefined', () => {
      expect(isValidImage(undefined)).toBe(false)
    })

    it('should return false for string', () => {
      expect(isValidImage('string')).toBe(false)
    })

    it('should return false for array', () => {
      expect(isValidImage([1, 2, 3])).toBe(false)
    })

    it('should return false for object without url', () => {
      expect(isValidImage({ public_id: 'test' })).toBe(false)
    })

    it('should return false for object with empty url', () => {
      expect(isValidImage({ url: '' })).toBe(false)
    })

    it('should return false for object with whitespace-only url', () => {
      expect(isValidImage({ url: '   ' })).toBe(false)
    })

    it('should return true for object with valid url even without other fields', () => {
      expect(isValidImage({ url: 'https://example.com/image.jpg' })).toBe(true)
    })
  })

  describe('TEST 6: getCarouselImages - Deduplicación', () => {
    it('should include all images even if URLs are duplicated (deduplication handled by normalizeVehicleImages)', () => {
      // La deduplicación se maneja en normalizeVehicleImages, no aquí
      // Este test verifica que getCarouselImages procesa correctamente las imágenes recibidas
      const mockNormalized = {
        fotoPrincipal: { url: 'image1.jpg', public_id: 'id1', original_name: 'img1.jpg' },
        fotoHover: { url: 'image2.jpg', public_id: 'id2', original_name: 'img2.jpg' },
        fotosExtra: [
          { url: 'image3.jpg', public_id: 'id3', original_name: 'img3.jpg' },
          { url: 'image4.jpg', public_id: 'id4', original_name: 'img4.jpg' }
        ]
      }

      normalizeVehicleImages.mockReturnValue(mockNormalized)

      const result = getCarouselImages({})

      // Debería incluir todas las imágenes normalizadas
      expect(result).toHaveLength(4)
      expect(result[0]).toEqual(mockNormalized.fotoPrincipal)
      expect(result[1]).toEqual(mockNormalized.fotoHover)
      expect(result[2]).toEqual(mockNormalized.fotosExtra[0])
      expect(result[3]).toEqual(mockNormalized.fotosExtra[1])
    })
  })

  describe('TEST 7: getCarouselImages - Casos edge', () => {
    it('should handle empty fotosExtra array', () => {
      const mockNormalized = {
        fotoPrincipal: { url: 'image1.jpg', public_id: 'id1', original_name: 'img1.jpg' },
        fotoHover: null,
        fotosExtra: []
      }

      normalizeVehicleImages.mockReturnValue(mockNormalized)

      const result = getCarouselImages({})

      expect(result).toHaveLength(1)
      expect(result[0]).toEqual(mockNormalized.fotoPrincipal)
    })

    it('should handle object with null values', () => {
      normalizeVehicleImages.mockReturnValue({
        fotoPrincipal: null,
        fotoHover: null,
        fotosExtra: []
      })

      normalizeImageField.mockReturnValue(null)

      const result = getCarouselImages({ imagen: null })

      expect(result).toEqual(['/src/assets/auto1.jpg'])
    })
  })
})

