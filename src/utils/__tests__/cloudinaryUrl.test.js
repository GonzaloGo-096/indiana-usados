/**
 * cloudinaryUrl.test.js - Tests de utilidades de Cloudinary
 * 
 * @author Indiana Usados
 * @version 1.0.0
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { cldUrl, cldPlaceholderUrl, cldSrcset } from '../cloudinaryUrl'

// Mock de variables de entorno
const originalEnv = import.meta.env

describe('cloudinaryUrl', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    // Resetear caché
    vi.resetModules()
  })

  describe('TEST 1: cldUrl - Generación básica', () => {
    it('should return empty string when publicId is empty', () => {
      expect(cldUrl('')).toBe('')
      expect(cldUrl(null)).toBe('')
      expect(cldUrl(undefined)).toBe('')
    })

    it('should generate basic Cloudinary URL', () => {
      const result = cldUrl('test-image')
      
      expect(result).toContain('res.cloudinary.com')
      expect(result).toContain('test-image')
      expect(result).toContain('f_auto')
      expect(result).toContain('q_auto')
      expect(result).toContain('dpr_auto')
    })

    it('should remove leading slash from publicId', () => {
      const result1 = cldUrl('/test-image')
      const result2 = cldUrl('test-image')
      
      expect(result1).toBe(result2)
      expect(result1).not.toContain('//')
    })
  })

  describe('TEST 2: cldUrl - Transformaciones', () => {
    it('should add width transformation', () => {
      const result = cldUrl('test-image', { width: 800 })
      
      expect(result).toContain('w_800')
    })

    it('should add height transformation', () => {
      const result = cldUrl('test-image', { height: 600 })
      
      expect(result).toContain('h_600')
    })

    it('should add width and height together', () => {
      const result = cldUrl('test-image', { width: 800, height: 600 })
      
      expect(result).toContain('w_800')
      expect(result).toContain('h_600')
    })

    it('should use custom crop mode', () => {
      const result = cldUrl('test-image', { crop: 'fill' })
      
      expect(result).toContain('c_fill')
    })

    it('should use default crop mode (limit)', () => {
      const result = cldUrl('test-image')
      
      expect(result).toContain('c_limit')
    })

    it('should add gravity when crop is not limit', () => {
      const result = cldUrl('test-image', { crop: 'fill', gravity: 'face' })
      
      expect(result).toContain('g_face')
    })

    it('should not add gravity when crop is limit', () => {
      const result = cldUrl('test-image', { crop: 'limit', gravity: 'face' })
      
      expect(result).not.toContain('g_face')
    })

    it('should add aspect ratio', () => {
      const result = cldUrl('test-image', { aspectRatio: '16:9' })
      
      expect(result).toContain('ar_16:9')
    })
  })

  describe('TEST 3: cldUrl - Quality modes', () => {
    it('should use auto quality mode by default', () => {
      const result = cldUrl('test-image')
      
      expect(result).toContain('q_auto')
    })

    it('should use eco quality mode when specified', () => {
      const result = cldUrl('test-image', { qualityMode: 'eco' })
      
      expect(result).toContain('q_80')
      expect(result).not.toContain('q_auto')
    })

    it('should use auto quality mode when specified', () => {
      const result = cldUrl('test-image', { qualityMode: 'auto' })
      
      expect(result).toContain('q_auto')
    })
  })

  describe('TEST 4: cldUrl - Effects', () => {
    it('should add effects array', () => {
      const result = cldUrl('test-image', { effects: ['blur:300', 'brightness:50'] })
      
      expect(result).toContain('e_blur:300')
      expect(result).toContain('e_brightness:50')
    })

    it('should handle empty effects array', () => {
      const result = cldUrl('test-image', { effects: [] })
      
      expect(result).not.toContain('e_')
    })
  })

  describe('TEST 5: cldUrl - Caching', () => {
    it('should cache URLs with same parameters', () => {
      const result1 = cldUrl('test-image', { width: 800 })
      const result2 = cldUrl('test-image', { width: 800 })
      
      expect(result1).toBe(result2)
    })

    it('should generate different URLs for different parameters', () => {
      const result1 = cldUrl('test-image', { width: 800 })
      const result2 = cldUrl('test-image', { width: 1200 })
      
      expect(result1).not.toBe(result2)
    })

    it('should cache URLs with same publicId and transformations', () => {
      const options = { width: 800, height: 600, crop: 'fill' }
      const result1 = cldUrl('test-image', options)
      const result2 = cldUrl('test-image', options)
      
      expect(result1).toBe(result2)
    })
  })

  describe('TEST 6: cldPlaceholderUrl - Generación de placeholder', () => {
    it('should return empty string when publicId is empty', () => {
      expect(cldPlaceholderUrl('')).toBe('')
      expect(cldPlaceholderUrl(null)).toBe('')
    })

    it('should generate placeholder URL with blur effect', () => {
      const result = cldPlaceholderUrl('test-image')
      
      expect(result).toContain('res.cloudinary.com')
      expect(result).toContain('test-image')
      expect(result).toContain('w_24')
      expect(result).toContain('q_10')
      expect(result).toContain('e_blur:200')
    })

    it('should use default placeholder options', () => {
      const result = cldPlaceholderUrl('test-image')
      
      expect(result).toContain('c_limit')
      expect(result).toContain('f_auto')
    })

    it('should allow custom placeholder options', () => {
      const result = cldPlaceholderUrl('test-image', { width: 50 })
      
      expect(result).toContain('w_50')
    })
  })

  describe('TEST 7: cldSrcset - Generación de srcset', () => {
    it('should return empty string when publicId is empty', () => {
      expect(cldSrcset('')).toBe('')
      expect(cldSrcset('test-image', [])).toBe('')
    })

    it('should generate srcset with multiple widths', () => {
      const result = cldSrcset('test-image', [400, 800, 1200])
      
      expect(result).toContain('w_400')
      expect(result).toContain('w_800')
      expect(result).toContain('w_1200')
      expect(result).toContain('400w')
      expect(result).toContain('800w')
      expect(result).toContain('1200w')
    })

    it('should apply base options to all widths', () => {
      const result = cldSrcset('test-image', [400, 800], { crop: 'fill', gravity: 'face' })
      
      expect(result).toContain('c_fill')
      expect(result).toContain('g_face')
      // Verificar que aparece en ambas URLs
      const parts = result.split(', ')
      expect(parts[0]).toContain('c_fill')
      expect(parts[1]).toContain('c_fill')
    })

    it('should format srcset correctly', () => {
      const result = cldSrcset('test-image', [400, 800])
      
      expect(result).toMatch(/^https:\/\/.*400w, https:\/\/.*800w$/)
    })
  })

  describe('TEST 8: cldUrl - Variants', () => {
    it('should handle variant parameter', () => {
      const result = cldUrl('test-image', { variant: 'fluid' })
      
      // El variant no afecta la URL directamente, pero está documentado
      expect(result).toContain('test-image')
    })
  })

  describe('TEST 9: cldUrl - Edge cases', () => {
    it('should handle publicId with extension', () => {
      const result = cldUrl('test-image.jpg')
      
      expect(result).toContain('test-image.jpg')
    })

    it('should handle complex publicId paths', () => {
      const result = cldUrl('folder/subfolder/test-image')
      
      expect(result).toContain('folder/subfolder/test-image')
    })

    it('should handle special characters in publicId', () => {
      const result = cldUrl('test-image_v2-final')
      
      expect(result).toContain('test-image_v2-final')
    })
  })
})


