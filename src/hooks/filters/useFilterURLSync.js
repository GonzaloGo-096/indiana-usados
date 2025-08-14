/**
 * useFilterURLSync - Hook para sincronización de filtros con URL
 * 
 * Responsabilidades:
 * - Parsear filtros de la URL
 * - Sincronizar filtros con la URL
 * - Mantener estado en navegación
 * 
 * @author Indiana Usados
 * @version 1.0.0
 */

import { useCallback, useEffect } from 'react'
import { useSearchParams, useNavigate, useLocation } from 'react-router-dom'

/**
 * Hook para sincronización de filtros con URL
 * @param {Object} options - Opciones de configuración
 * @param {Function} options.onFiltersChange - Callback cuando cambian los filtros
 * @param {Function} options.onPaginationChange - Callback cuando cambia la paginación
 * @returns {Object} - Funciones para sincronización con URL
 */
export const useFilterURLSync = (options = {}) => {
  const [searchParams, setSearchParams] = useSearchParams()
  const navigate = useNavigate()
  const location = useLocation()
  
  const { onFiltersChange, onPaginationChange } = options

  // ✅ PARSEAR FILTROS DE LA URL
  const parseFiltersFromURL = useCallback((params) => {
    const filters = {}
    
    // Parsear arrays (marcas, caja, combustibles, condición)
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

  // ✅ PARSEAR PAGINACIÓN DE LA URL
  const parsePaginationFromURL = useCallback((params) => {
    const pagination = {}
    
    const pageParam = params.get('page')
    if (pageParam) {
      pagination.page = Number(pageParam) || 1
    }
    
    const limitParam = params.get('limit')
    if (limitParam) {
      pagination.limit = Number(limitParam) || 12
    }
    
    return pagination
  }, [])

  // ✅ SINCRONIZAR FILTROS CON URL
  const syncFiltersToURL = useCallback((filters, replace = false) => {
    const newParams = new URLSearchParams(searchParams)
    
    // Limpiar parámetros existentes
    newParams.delete('brand')
    newParams.delete('caja')
    newParams.delete('fuel')
    newParams.delete('condition')
    newParams.delete('priceMin')
    newParams.delete('priceMax')
    newParams.delete('yearMin')
    newParams.delete('yearMax')
    
    // Agregar nuevos filtros
    if (filters.brand && filters.brand.length > 0) {
      newParams.set('brand', filters.brand.join(','))
    }
    
    if (filters.caja && filters.caja.length > 0) {
      newParams.set('caja', filters.caja.join(','))
    }
    
    if (filters.fuel && filters.fuel.length > 0) {
      newParams.set('fuel', filters.fuel.join(','))
    }
    
    if (filters.condition && filters.condition.length > 0) {
      newParams.set('condition', filters.condition.join(','))
    }
    
    if (filters.priceMin) {
      newParams.set('priceMin', filters.priceMin.toString())
    }
    
    if (filters.priceMax) {
      newParams.set('priceMax', filters.priceMax.toString())
    }
    
    if (filters.yearMin) {
      newParams.set('yearMin', filters.yearMin.toString())
    }
    
    if (filters.yearMax) {
      newParams.set('yearMax', filters.yearMax.toString())
    }
    
    // Actualizar URL
    if (replace) {
      navigate(`${location.pathname}?${newParams.toString()}`, { replace: true })
    } else {
      setSearchParams(newParams)
    }
  }, [searchParams, navigate, location.pathname, setSearchParams])

  // ✅ SINCRONIZAR PAGINACIÓN CON URL
  const syncPaginationToURL = useCallback((pagination, replace = false) => {
    const newParams = new URLSearchParams(searchParams)
    
    // Limpiar parámetros de paginación
    newParams.delete('page')
    newParams.delete('limit')
    
    // Agregar nueva paginación
    if (pagination.page && pagination.page > 1) {
      newParams.set('page', pagination.page.toString())
    }
    
    if (pagination.limit && pagination.limit !== 12) {
      newParams.set('limit', pagination.limit.toString())
    }
    
    // Actualizar URL
    if (replace) {
      navigate(`${location.pathname}?${newParams.toString()}`, { replace: true })
    } else {
      setSearchParams(newParams)
    }
  }, [searchParams, navigate, location.pathname, setSearchParams])

  // ✅ LIMPIAR URL DE FILTROS
  const clearFiltersFromURL = useCallback((replace = false) => {
    const newParams = new URLSearchParams(searchParams)
    
    // Limpiar todos los parámetros de filtros
    newParams.delete('brand')
    newParams.delete('caja')
    newParams.delete('fuel')
    newParams.delete('condition')
    newParams.delete('priceMin')
    newParams.delete('priceMax')
    newParams.delete('yearMin')
    newParams.delete('yearMax')
    newParams.delete('page')
    newParams.delete('limit')
    
    // Actualizar URL
    if (replace) {
      navigate(location.pathname, { replace: true })
    } else {
      setSearchParams(newParams)
    }
  }, [searchParams, navigate, location.pathname, setSearchParams])

  // ✅ OBTENER FILTROS ACTUALES DE LA URL
  const getCurrentFiltersFromURL = useCallback(() => {
    return parseFiltersFromURL(searchParams)
  }, [searchParams, parseFiltersFromURL])

  // ✅ OBTENER PAGINACIÓN ACTUAL DE LA URL
  const getCurrentPaginationFromURL = useCallback(() => {
    return parsePaginationFromURL(searchParams)
  }, [searchParams, parsePaginationFromURL])

  // ✅ VERIFICAR SI HAY FILTROS EN LA URL
  const hasFiltersInURL = useCallback(() => {
    const filters = getCurrentFiltersFromURL()
    return Object.values(filters).some(value => {
      if (Array.isArray(value)) return value.length > 0
      return value !== '' && value !== null && value !== undefined
    })
  }, [getCurrentFiltersFromURL])

  return {
    // Funciones de parseo
    parseFiltersFromURL,
    parsePaginationFromURL,
    
    // Funciones de sincronización
    syncFiltersToURL,
    syncPaginationToURL,
    clearFiltersFromURL,
    
    // Funciones de consulta
    getCurrentFiltersFromURL,
    getCurrentPaginationFromURL,
    hasFiltersInURL,
    
    // Estado de la URL
    searchParams,
    location
  }
} 