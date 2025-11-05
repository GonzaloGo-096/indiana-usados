/**
 * Tests para formatters.js
 * 
 * Enfoque: Tests profesionales y esenciales para funciones críticas
 * Prioridad: formatPrice (maneja dinero) es la más crítica
 * 
 * @author Indiana Usados
 * @version 1.0.0
 */

import { describe, it, expect } from 'vitest'
import { formatPrice } from '../formatters'

describe('formatters.js', () => {
  describe('formatPrice', () => {
    // ✅ CASOS CRÍTICOS: Precios válidos (happy path)
    it('formatea precio válido con formato argentino', () => {
      const result = formatPrice(15000000)
      // Verificar que tiene formato de moneda argentino (con espacio entre $ y número)
      // Usa espacio no-breakable (\u00A0) o espacio normal
      expect(result).toMatch(/^\$[\s\u00A0]\d{1,3}(\.\d{3})*$/)
      expect(result).toContain('15.000.000')
      expect(result).toContain('$')
    })

    it('formatea precio como string numérico', () => {
      const result = formatPrice('15000000')
      expect(result).toMatch(/^\$[\s\u00A0]\d{1,3}(\.\d{3})*$/)
      expect(result).toContain('15.000.000')
    })

    it('formatea número grande correctamente', () => {
      const result = formatPrice(999999999)
      expect(result).toMatch(/^\$[\s\u00A0]\d{1,3}(\.\d{3})*$/)
      expect(result).toContain('999.999.999')
    })

    // ✅ CASOS EDGE: Valores inválidos o límite
    it('retorna "Consultar" cuando price es 0', () => {
      const result = formatPrice(0)
      expect(result).toBe('Consultar')
    })

    it('retorna "Consultar" cuando price es null', () => {
      const result = formatPrice(null)
      expect(result).toBe('Consultar')
    })

    it('retorna "Consultar" cuando price es undefined', () => {
      const result = formatPrice(undefined)
      expect(result).toBe('Consultar')
    })

    it('retorna "Consultar" cuando price es string vacío', () => {
      const result = formatPrice('')
      expect(result).toBe('Consultar')
    })

    it('retorna "Consultar" cuando price es NaN', () => {
      const result = formatPrice(NaN)
      expect(result).toBe('Consultar')
    })

    it('retorna "Consultar" cuando price es string inválido', () => {
      const result = formatPrice('abc')
      expect(result).toBe('Consultar')
    })

    // ✅ CASOS DE FORMATO: Verificar formato correcto
    it('usa formato de moneda ARS', () => {
      const result = formatPrice(1000)
      expect(result).toContain('$')
      expect(result).toMatch(/^\$[\s\u00A0]\d/) // Tiene espacio (normal o no-breakable) entre $ y número
      expect(result).not.toContain(',') // Separador de miles en AR es punto, no coma
    })

    it('no muestra decimales', () => {
      const result = formatPrice(1000.50)
      expect(result).not.toContain(',')
      expect(result).not.toContain('.50')
    })
  })
})

