/**
 * useFilterState - Hook para manejo del estado local de filtros
 * 
 * Responsabilidades:
 * - Estado local de filtros
 * - Validación básica
 * - Reset de filtros
 * 
 * @author Indiana Usados
 * @version 1.0.0
 */

import { useState, useCallback, useMemo } from 'react'
import { config } from '@config'

// Configuración de filtros por defecto
const DEFAULT_FILTERS = {
  brand: [],
  priceMin: '',
  priceMax: '',
  yearMin: '',
  yearMax: '',
  caja: [],
  fuel: [],
  condition: []
}

// Configuración de paginación por defecto
const DEFAULT_PAGINATION = {
  page: 1,
  limit: config.pagination?.pageSize || 12
}

/**
 * Hook para manejo del estado local de filtros
 * @param {Object} options - Opciones de configuración
 * @returns {Object} - Estado y métodos para manejar filtros
 */
export const useFilterState = (options = {}) => {
  const [localFilters, setLocalFilters] = useState(DEFAULT_FILTERS)
  const [localPagination, setLocalPagination] = useState(DEFAULT_PAGINATION)
  
  // Estado de loading y error
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  // ✅ VALIDAR FILTROS
  const validateFilters = useCallback((filters) => {
    const errors = []
    
    // Validar precios
    if (filters.priceMin && filters.priceMax) {
      if (Number(filters.priceMin) > Number(filters.priceMax)) {
        errors.push('El precio mínimo no puede ser mayor al máximo')
      }
    }
    
    // Validar años
    if (filters.yearMin && filters.yearMax) {
      if (Number(filters.yearMin) > Number(filters.yearMax)) {
        errors.push('El año mínimo no puede ser mayor al máximo')
      }
    }
    
    // Validar arrays vacíos
    Object.entries(filters).forEach(([key, value]) => {
      if (Array.isArray(value) && value.length === 0) {
        // Arrays vacíos son válidos (sin filtro aplicado)
      } else if (value === '' || value === null || value === undefined) {
        // Valores vacíos son válidos (sin filtro aplicado)
      }
    })
    
    return errors
  }, [])

  // ✅ ACTUALIZAR FILTROS
  const updateFilters = useCallback((newFilters) => {
    const errors = validateFilters(newFilters)
    
    if (errors.length > 0) {
      setError(errors.join(', '))
      return false
    }
    
    setLocalFilters(prev => ({ ...prev, ...newFilters }))
    setError(null)
    return true
  }, [validateFilters])

  // ✅ ACTUALIZAR PAGINACIÓN
  const updatePagination = useCallback((newPagination) => {
    setLocalPagination(prev => ({ ...prev, ...newPagination }))
  }, [])

  // ✅ RESET FILTROS
  const resetFilters = useCallback(() => {
    setLocalFilters(DEFAULT_FILTERS)
    setLocalPagination(DEFAULT_PAGINATION)
    setError(null)
  }, [])

  // ✅ RESET PAGINACIÓN
  const resetPagination = useCallback(() => {
    setLocalPagination(DEFAULT_PAGINATION)
  }, [])

  // ✅ VERIFICAR SI HAY FILTROS ACTIVOS
  const hasActiveFilters = useMemo(() => {
    return Object.values(localFilters).some(value => {
      if (Array.isArray(value)) return value.length > 0
      return value !== '' && value !== null && value !== undefined
    })
  }, [localFilters])

  // ✅ VERIFICAR SI HAY CAMBIOS
  const hasChanges = useMemo(() => {
    return JSON.stringify(localFilters) !== JSON.stringify(DEFAULT_FILTERS) ||
           JSON.stringify(localPagination) !== JSON.stringify(DEFAULT_PAGINATION)
  }, [localFilters, localPagination])

  // ✅ SET LOADING
  const setLoading = useCallback((loading) => {
    setIsLoading(loading)
  }, [])

  // ✅ SET ERROR
  const setFilterError = useCallback((errorMessage) => {
    setError(errorMessage)
  }, [])

  // ✅ CLEAR ERROR
  const clearError = useCallback(() => {
    setError(null)
  }, [])

  return {
    // Estado
    filters: localFilters,
    pagination: localPagination,
    isLoading,
    error,
    
    // Funciones
    updateFilters,
    updatePagination,
    resetFilters,
    resetPagination,
    setLoading,
    setFilterError,
    clearError,
    
    // Utilidades
    validateFilters,
    hasActiveFilters,
    hasChanges,
    
    // Constantes
    DEFAULT_FILTERS,
    DEFAULT_PAGINATION
  }
} 