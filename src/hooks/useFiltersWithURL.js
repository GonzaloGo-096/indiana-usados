/**
 * Hook para manejar filtros sincronizados con la URL
 * Permite que los filtros se reflejen en la URL y se mantengan al recargar la página
 * 
 * @author Indiana Usados
 * @version 1.0.0
 */

import { useState, useEffect, useCallback, useMemo } from 'react'
import { useSearchParams, useNavigate, useLocation } from 'react-router-dom'
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
  limit: config.pagination.pageSize || 12
}

/**
 * Hook principal para filtros sincronizados con URL
 * @param {Object} options - Opciones de configuración
 * @returns {Object} - Estado y métodos para manejar filtros
 */
export const useFiltersWithURL = (options = {}) => {
  const [searchParams, setSearchParams] = useSearchParams()
  const navigate = useNavigate()
  const location = useLocation()
  
  // Estado local de filtros
  const [localFilters, setLocalFilters] = useState(DEFAULT_FILTERS)
  const [localPagination, setLocalPagination] = useState(DEFAULT_PAGINATION)
  
  // Estado de loading y error
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  // Parsear filtros de la URL al cargar
  useEffect(() => {
    try {
      const urlFilters = parseFiltersFromURL(searchParams)
      const urlPagination = parsePaginationFromURL(searchParams)
      
      setLocalFilters(urlFilters)
      setLocalPagination(urlPagination)
    } catch (error) {
      console.error('Error parsing filters from URL:', error)
      setError('Error al cargar filtros de la URL')
    }
  }, [searchParams])

  // Función para parsear filtros de la URL
  const parseFiltersFromURL = useCallback((params) => {
    const filters = { ...DEFAULT_FILTERS }
    
    // Parsear arrays (marcas, transmisiones, combustibles)
    const brandParam = params.get('brand')
    if (brandParam) {
      filters.brand = brandParam.split(',').filter(Boolean)
    }
    
      const cajaParam = params.get('caja')
  if (cajaParam) {
    filters.caja = cajaParam.split(',').filter(Boolean)
  }
    
    const fuelParam = params.get('fuel')
    if (fuelParam) {
      filters.fuel = fuelParam.split(',').filter(Boolean)
    }
    
    const conditionParam = params.get('condition')
    if (conditionParam) {
      filters.condition = conditionParam.split(',').filter(Boolean)
    }
    
    // Parsear números
    const priceMinParam = params.get('priceMin')
    if (priceMinParam) {
      filters.priceMin = Number(priceMinParam) || ''
    }
    
    const priceMaxParam = params.get('priceMax')
    if (priceMaxParam) {
      filters.priceMax = Number(priceMaxParam) || ''
    }
    
    const yearMinParam = params.get('yearMin')
    if (yearMinParam) {
      filters.yearMin = Number(yearMinParam) || ''
    }
    
    const yearMaxParam = params.get('yearMax')
    if (yearMaxParam) {
      filters.yearMax = Number(yearMaxParam) || ''
    }
    
    return filters
  }, [])

  // Función para parsear paginación de la URL
  const parsePaginationFromURL = useCallback((params) => {
    const pagination = { ...DEFAULT_PAGINATION }
    
    const pageParam = params.get('page')
    if (pageParam) {
      pagination.page = Number(pageParam) || 1
    }
    
    const limitParam = params.get('limit')
    if (limitParam) {
      pagination.limit = Number(limitParam) || config.pagination.pageSize || 12
    }
    
    return pagination
  }, [])

  // Función para actualizar filtros y sincronizar con URL
  const updateFilters = useCallback((newFilters, resetPagination = true) => {
    try {
      setIsLoading(true)
      setError(null)
      
      // Combinar filtros existentes con nuevos
      const updatedFilters = { ...localFilters, ...newFilters }
      
      // Limpiar valores vacíos
      Object.keys(updatedFilters).forEach(key => {
        if (Array.isArray(updatedFilters[key]) && updatedFilters[key].length === 0) {
          updatedFilters[key] = []
        } else if (updatedFilters[key] === '' || updatedFilters[key] === null) {
          updatedFilters[key] = ''
        }
      })
      
      // Actualizar estado local
      setLocalFilters(updatedFilters)
      
      // Resetear paginación si se solicitó
      if (resetPagination) {
        setLocalPagination(prev => ({ ...prev, page: 1 }))
      }
      
      // Actualizar URL
      updateURL(updatedFilters, resetPagination ? 1 : localPagination.page)
      
    } catch (error) {
      console.error('Error updating filters:', error)
      setError('Error al actualizar filtros')
    } finally {
      setIsLoading(false)
    }
  }, [localFilters, localPagination.page])

  // Función para actualizar paginación
  const updatePagination = useCallback((newPagination) => {
    try {
      const updatedPagination = { ...localPagination, ...newPagination }
      setLocalPagination(updatedPagination)
      
      // Actualizar URL
      updateURL(localFilters, updatedPagination.page)
      
    } catch (error) {
      console.error('Error updating pagination:', error)
      setError('Error al actualizar paginación')
    }
  }, [localFilters, localPagination])

  // Función para actualizar la URL
  const updateURL = useCallback((filters, page) => {
    try {
      const newSearchParams = new URLSearchParams()
      
      // Agregar filtros a la URL
      Object.entries(filters).forEach(([key, value]) => {
        if (Array.isArray(value) && value.length > 0) {
          newSearchParams.set(key, value.join(','))
        } else if (value !== '' && value !== null && value !== undefined) {
          newSearchParams.set(key, String(value))
        }
      })
      
      // Agregar paginación
      if (page && page > 1) {
        newSearchParams.set('page', String(page))
      }
      
      // Actualizar URL sin recargar la página
      setSearchParams(newSearchParams, { replace: true })
      
    } catch (error) {
      console.error('Error updating URL:', error)
    }
  }, [setSearchParams])

  // Función para limpiar todos los filtros
  const clearFilters = useCallback(() => {
    setLocalFilters(DEFAULT_FILTERS)
    setLocalPagination(DEFAULT_PAGINATION)
    setSearchParams({}, { replace: true })
  }, [setSearchParams])

  // Función para resetear solo la paginación
  const resetPagination = useCallback(() => {
    const newPagination = { ...localPagination, page: 1 }
    setLocalPagination(newPagination)
    updateURL(localFilters, 1)
  }, [localFilters, localPagination, updateURL])

  // Función para obtener filtros activos (no vacíos)
  const activeFilters = useMemo(() => {
    const active = {}
    
    Object.entries(localFilters).forEach(([key, value]) => {
      if (Array.isArray(value) && value.length > 0) {
        active[key] = value
      } else if (value !== '' && value !== null && value !== undefined) {
        active[key] = value
      }
    })
    
    return active
  }, [localFilters])

  // Función para verificar si hay filtros activos
  const hasActiveFilters = useMemo(() => {
    return Object.keys(activeFilters).length > 0
  }, [activeFilters])

  // Función para obtener el número total de filtros activos
  const activeFiltersCount = useMemo(() => {
    return Object.keys(activeFilters).length
  }, [activeFilters])

  // Función para exportar filtros para la API
  const getFiltersForAPI = useCallback(() => {
    return {
      filters: activeFilters,
      pagination: localPagination
    }
  }, [activeFilters, localPagination])

  // Función para importar filtros desde la API
  const importFiltersFromAPI = useCallback((apiFilters) => {
    if (apiFilters && typeof apiFilters === 'object') {
      const newFilters = { ...DEFAULT_FILTERS }
      
      // Mapear filtros de la API a nuestro formato
      if (apiFilters.brand) newFilters.brand = Array.isArray(apiFilters.brand) ? apiFilters.brand : [apiFilters.brand]
      if (apiFilters.priceMin) newFilters.priceMin = Number(apiFilters.priceMin)
      if (apiFilters.priceMax) newFilters.priceMax = Number(apiFilters.priceMax)
      if (apiFilters.yearMin) newFilters.yearMin = Number(apiFilters.yearMin)
      if (apiFilters.yearMax) newFilters.yearMax = Number(apiFilters.yearMax)
      if (apiFilters.caja) newFilters.caja = Array.isArray(apiFilters.caja) ? apiFilters.caja : [apiFilters.caja]
      if (apiFilters.fuel) newFilters.fuel = Array.isArray(apiFilters.fuel) ? apiFilters.fuel : [apiFilters.fuel]
      if (apiFilters.condition) newFilters.condition = Array.isArray(apiFilters.condition) ? apiFilters.condition : [apiFilters.condition]
      
      updateFilters(newFilters, true)
    }
  }, [updateFilters])

  return {
    // Estado
    filters: localFilters,
    pagination: localPagination,
    activeFilters,
    isLoading,
    error,
    
    // Métodos de actualización
    updateFilters,
    updatePagination,
    clearFilters,
    resetPagination,
    
    // Utilidades
    hasActiveFilters,
    activeFiltersCount,
    getFiltersForAPI,
    importFiltersFromAPI,
    
    // Estado de la URL
    searchParams: Object.fromEntries(searchParams),
    currentPath: location.pathname
  }
}

/**
 * Hook simplificado para filtros básicos
 * @param {Object} initialFilters - Filtros iniciales
 * @returns {Object} - Estado y métodos básicos
 */
export const useSimpleFilters = (initialFilters = {}) => {
  const [filters, setFilters] = useState({ ...DEFAULT_FILTERS, ...initialFilters })
  
  const updateFilter = useCallback((key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }, [])
  
  const clearFilters = useCallback(() => {
    setFilters(DEFAULT_FILTERS)
  }, [])
  
  return {
    filters,
    updateFilter,
    clearFilters,
    hasActiveFilters: Object.values(filters).some(value => 
      Array.isArray(value) ? value.length > 0 : value !== '' && value !== null
    )
  }
} 