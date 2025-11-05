/**
 * Tests para filters.js - buildFiltersForBackend
 * 
 * Función crítica: Convierte filtros del frontend a URLSearchParams para el backend
 * Afecta directamente las búsquedas de vehículos
 * 
 * @author Indiana Usados
 * @version 1.0.0
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { buildFiltersForBackend, parseFilters } from '../filters'
import { FILTER_DEFAULTS } from '@constants'

// Mock del logger para evitar logs en tests
vi.mock('@utils/logger', () => ({
  logger: {
    debug: vi.fn()
  }
}))

describe('filters.js', () => {
  describe('buildFiltersForBackend', () => {
    // ✅ CASO CRÍTICO: Filtros vacíos
    it('retorna URLSearchParams vacío cuando no hay filtros', () => {
      const result = buildFiltersForBackend({})
      expect(result.toString()).toBe('')
    })

    it('retorna URLSearchParams vacío cuando recibe undefined', () => {
      const result = buildFiltersForBackend(undefined)
      expect(result.toString()).toBe('')
    })

    // ✅ CASOS CRÍTICOS: Filtros simples (arrays → strings con comas)
    describe('filtros simples', () => {
      it('incluye marca cuando tiene valores', () => {
        const filters = { marca: ['Toyota'] }
        const result = buildFiltersForBackend(filters)
        expect(result.get('marca')).toBe('Toyota')
      })

      it('une múltiples marcas con comas', () => {
        const filters = { marca: ['Toyota', 'Ford', 'Honda'] }
        const result = buildFiltersForBackend(filters)
        expect(result.get('marca')).toBe('Toyota,Ford,Honda')
      })

      it('incluye caja cuando tiene valores', () => {
        const filters = { caja: ['Automática'] }
        const result = buildFiltersForBackend(filters)
        expect(result.get('caja')).toBe('Automática')
      })

      it('une múltiples cajas con comas', () => {
        const filters = { caja: ['Manual', 'Automática'] }
        const result = buildFiltersForBackend(filters)
        expect(result.get('caja')).toBe('Manual,Automática')
      })

      it('incluye combustible cuando tiene valores', () => {
        const filters = { combustible: ['Nafta'] }
        const result = buildFiltersForBackend(filters)
        expect(result.get('combustible')).toBe('Nafta')
      })

      it('no incluye arrays vacíos', () => {
        const filters = { marca: [], caja: [], combustible: [] }
        const result = buildFiltersForBackend(filters)
        expect(result.has('marca')).toBe(false)
        expect(result.has('caja')).toBe(false)
        expect(result.has('combustible')).toBe(false)
      })
    })

    // ✅ CASOS CRÍTICOS: Rangos (arrays → "min,max")
    describe('rangos', () => {
      it('incluye año cuando NO es valor por defecto', () => {
        const filters = { año: [2010, 2020] }
        const result = buildFiltersForBackend(filters)
        expect(result.get('anio')).toBe('2010,2020')
      })

      it('NO incluye año cuando ES valor por defecto', () => {
        const filters = { 
          año: [FILTER_DEFAULTS.AÑO.min, FILTER_DEFAULTS.AÑO.max] 
        }
        const result = buildFiltersForBackend(filters)
        expect(result.has('anio')).toBe(false)
      })

      it('incluye precio cuando NO es valor por defecto', () => {
        const filters = { precio: [10000000, 20000000] }
        const result = buildFiltersForBackend(filters)
        expect(result.get('precio')).toBe('10000000,20000000')
      })

      it('NO incluye precio cuando ES valor por defecto', () => {
        const filters = { 
          precio: [FILTER_DEFAULTS.PRECIO.min, FILTER_DEFAULTS.PRECIO.max] 
        }
        const result = buildFiltersForBackend(filters)
        expect(result.has('precio')).toBe(false)
      })

      it('incluye kilometraje cuando NO es valor por defecto', () => {
        const filters = { kilometraje: [50000, 100000] }
        const result = buildFiltersForBackend(filters)
        expect(result.get('km')).toBe('50000,100000')
      })

      it('NO incluye kilometraje cuando ES valor por defecto', () => {
        const filters = { 
          kilometraje: [FILTER_DEFAULTS.KILOMETRAJE.min, FILTER_DEFAULTS.KILOMETRAJE.max] 
        }
        const result = buildFiltersForBackend(filters)
        expect(result.has('km')).toBe(false)
      })

      it('no incluye rangos con length !== 2', () => {
        const filters = { año: [2010], precio: [10000000, 20000000, 30000000] }
        const result = buildFiltersForBackend(filters)
        expect(result.has('anio')).toBe(false)
        expect(result.has('precio')).toBe(false)
      })
    })

    // ✅ CASOS CRÍTICOS: Combinaciones
    describe('combinaciones', () => {
      it('combina múltiples filtros correctamente', () => {
        const filters = {
          marca: ['Toyota', 'Ford'],
          año: [2010, 2020],
          precio: [10000000, 20000000]
        }
        const result = buildFiltersForBackend(filters)
        expect(result.get('marca')).toBe('Toyota,Ford')
        expect(result.get('anio')).toBe('2010,2020')
        expect(result.get('precio')).toBe('10000000,20000000')
      })

      it('solo incluye filtros no vacíos', () => {
        const filters = {
          marca: ['Toyota'],
          caja: [],
          año: [2010, 2020],
          precio: [FILTER_DEFAULTS.PRECIO.min, FILTER_DEFAULTS.PRECIO.max] // Por defecto
        }
        const result = buildFiltersForBackend(filters)
        expect(result.has('marca')).toBe(true)
        expect(result.has('caja')).toBe(false)
        expect(result.has('anio')).toBe(true)
        expect(result.has('precio')).toBe(false) // No incluye porque es por defecto
      })
    })
  })

  describe('parseFilters', () => {
    // ✅ CASO CRÍTICO: URLSearchParams vacío
    it('retorna objeto vacío cuando URLSearchParams está vacío', () => {
      const params = new URLSearchParams()
      const result = parseFilters(params)
      expect(result).toEqual({})
    })

    it('retorna objeto vacío cuando URLSearchParams tiene solo espacios', () => {
      const params = new URLSearchParams(' ')
      const result = parseFilters(params)
      expect(result).toEqual({})
    })

    // ✅ CASOS CRÍTICOS: Filtros simples (strings → arrays)
    describe('filtros simples', () => {
      it('parse marca correctamente', () => {
        const params = new URLSearchParams('marca=Toyota')
        const result = parseFilters(params)
        expect(result.marca).toEqual(['Toyota'])
      })

      it('parse múltiples marcas separadas por comas', () => {
        const params = new URLSearchParams('marca=Toyota,Ford,Honda')
        const result = parseFilters(params)
        expect(result.marca).toEqual(['Toyota', 'Ford', 'Honda'])
      })

      it('parse caja correctamente', () => {
        const params = new URLSearchParams('caja=Automática')
        const result = parseFilters(params)
        expect(result.caja).toEqual(['Automática'])
      })

      it('parse múltiples cajas separadas por comas', () => {
        const params = new URLSearchParams('caja=Manual,Automática')
        const result = parseFilters(params)
        expect(result.caja).toEqual(['Manual', 'Automática'])
      })

      it('parse combustible correctamente', () => {
        const params = new URLSearchParams('combustible=Nafta')
        const result = parseFilters(params)
        expect(result.combustible).toEqual(['Nafta'])
      })

      it('parse múltiples combustibles separados por comas', () => {
        const params = new URLSearchParams('combustible=Nafta,Diesel')
        const result = parseFilters(params)
        expect(result.combustible).toEqual(['Nafta', 'Diesel'])
      })
    })

    // ✅ CASOS CRÍTICOS: Rangos (strings → arrays de números)
    describe('rangos', () => {
      it('parse año correctamente', () => {
        const params = new URLSearchParams('anio=2010,2020')
        const result = parseFilters(params)
        expect(result.año).toEqual([2010, 2020])
      })

      it('parse precio correctamente', () => {
        const params = new URLSearchParams('precio=10000000,20000000')
        const result = parseFilters(params)
        expect(result.precio).toEqual([10000000, 20000000])
      })

      it('parse kilometraje correctamente', () => {
        const params = new URLSearchParams('km=50000,100000')
        const result = parseFilters(params)
        expect(result.kilometraje).toEqual([50000, 100000])
      })

      it('no incluye rangos con valores inválidos', () => {
        const params = new URLSearchParams('anio=abc,def')
        const result = parseFilters(params)
        expect(result.año).toBeUndefined()
      })

      it('parse rangos con números grandes correctamente', () => {
        const params = new URLSearchParams('precio=5000000,100000000')
        const result = parseFilters(params)
        expect(result.precio).toEqual([5000000, 100000000])
      })

      it('convierte valores decimales a números en rangos', () => {
        const params = new URLSearchParams('anio=2010.5,2020.7')
        const result = parseFilters(params)
        expect(result.año).toEqual([2010.5, 2020.7]) // Number() convierte, no redondea
      })
    })

    // ✅ CASOS CRÍTICOS: Combinaciones
    describe('combinaciones', () => {
      it('parse múltiples filtros combinados', () => {
        const params = new URLSearchParams('marca=Toyota&anio=2010,2020&precio=10000000,20000000')
        const result = parseFilters(params)
        expect(result.marca).toEqual(['Toyota'])
        expect(result.año).toEqual([2010, 2020])
        expect(result.precio).toEqual([10000000, 20000000])
      })

      it('parse filtros simples y rangos juntos', () => {
        const params = new URLSearchParams('marca=Toyota,Ford&caja=Automática&km=50000,100000')
        const result = parseFilters(params)
        expect(result.marca).toEqual(['Toyota', 'Ford'])
        expect(result.caja).toEqual(['Automática'])
        expect(result.kilometraje).toEqual([50000, 100000])
      })

      it('ignora parámetros desconocidos', () => {
        const params = new URLSearchParams('marca=Toyota&unknown=value&otro=123')
        const result = parseFilters(params)
        expect(result.marca).toEqual(['Toyota'])
        expect(result.unknown).toBeUndefined()
        expect(result.otro).toBeUndefined()
      })
    })

    // ✅ CASO CRÍTICO: Redondeo ida y vuelta
    it('parse y build son inversos (ida y vuelta)', () => {
      const originalFilters = {
        marca: ['Toyota', 'Ford'],
        año: [2010, 2020],
        precio: [10000000, 20000000]
      }
      
      // Frontend → Backend
      const params = buildFiltersForBackend(originalFilters)
      
      // Backend → Frontend
      const parsedFilters = parseFilters(params)
      
      expect(parsedFilters.marca).toEqual(originalFilters.marca)
      expect(parsedFilters.año).toEqual(originalFilters.año)
      expect(parsedFilters.precio).toEqual(originalFilters.precio)
    })
  })
})

