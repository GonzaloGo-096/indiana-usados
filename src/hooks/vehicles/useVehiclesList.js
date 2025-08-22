/**
 * useVehiclesList - Hook unificado para listas de vehículos
 * 
 * Características:
 * - Query única para lista y filtros
 * - Botón "Cargar más" con acumulación
 * - Cache invalidation al aplicar filtros
 * - Backend maneja paginación automáticamente
 * 
 * @author Indiana Usados
 * @version 1.0.0 - Hook unificado optimizado
 */

import React from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useState, useCallback, useMemo } from 'react'
import { vehiclesApi } from '@api'
// import { mapListResponse } from '../../mappers/vehicleMapper.js' // TEMPORALMENTE COMENTADO

/**
 * Hook unificado para listas de vehículos
 * 
 * @param {Object} filters - Filtros a aplicar
 * @param {Object} options - Opciones del hook
 * @param {boolean} options.enabled - Si la query debe ejecutarse
 * @param {number} options.staleTime - Tiempo antes de considerar datos obsoletos
 * @param {number} options.gcTime - Tiempo para mantener en cache
 * @param {number} options.retry - Número de reintentos
 * @param {boolean} options.refetchOnWindowFocus - Si refetch al enfocar ventana
 * 
 * @returns {Object} - Datos y funciones del hook
 */
export const useVehiclesList = (filters = {}, options = {}) => {
  const {
    enabled = true,
    staleTime = 1000 * 60 * 5, // 5 minutos
    gcTime = 1000 * 60 * 30, // 30 minutos
    retry = 2,
    refetchOnWindowFocus = false
  } = options

  const queryClient = useQueryClient()
  
  // ✅ ESTADO LOCAL para acumular vehículos
  const [accumulatedVehicles, setAccumulatedVehicles] = useState([])
  const [currentCursor, setCurrentCursor] = useState(null)
  const [hasMoreData, setHasMoreData] = useState(true)
  const [isLoadingMore, setIsLoadingMore] = useState(false)

  // ✅ HASH DE FILTROS para cache consistente
  const filtersHash = useMemo(() => {
    if (!filters || Object.keys(filters).length === 0) {
      return 'no-filters'
    }
    return JSON.stringify(filters, Object.keys(filters).sort())
  }, [filters])

  // ✅ DETECTAR si hay filtros activos
  const hasActiveFilters = useMemo(() => {
    return filters && Object.keys(filters).length > 0
  }, [filters])

  // ✅ QUERY PRINCIPAL - siempre se ejecuta
  const query = useQuery({
    queryKey: ['vehicles-list', filtersHash, currentCursor],
    queryFn: () => vehiclesApi.getVehicles({ ...filters, cursor: currentCursor, limit: 50 }), // ✅ Aumentar límite para ver más datos
    enabled,
    staleTime: hasActiveFilters ? 1000 * 60 * 2 : 1000 * 60 * 10, // ✅ Cache inteligente
    gcTime,
    retry,
    refetchOnWindowFocus,
    refetchOnMount: false,
    refetchOnReconnect: false,
    // ✅ OPTIMIZACIÓN: Retry inteligente
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    // ✅ OPTIMIZACIÓN: Manejo de errores específico
    onError: (error) => {
      if (error?.response?.status === 404) {
        console.warn('⚠️ No se encontraron vehículos con esos filtros')
      } else if (error?.response?.status === 500) {
        console.error('❌ Error del servidor:', error)
      }
    }
  })

  // ✅ EFECTO para manejar nuevos datos
  React.useEffect(() => {
    if (!query.data) return
    
    console.log('🔍 HOOK DEBUG - query.data recibido:', query.data)
    
    // ✅ DETECTAR SI ES RESPUESTA DEL BACKEND (ROLLBACK AL ESTADO FUNCIONAL)
    if (query.data?.allPhotos?.docs && Array.isArray(query.data.allPhotos.docs)) {
      // Respuesta del backend
      const backendData = query.data.allPhotos
      console.log('🔍 HOOK DEBUG - Respuesta del backend detectada:', {
        totalDocs: backendData.docs.length,
        firstVehicle: backendData.docs[0],
        hasNextPage: backendData.hasNextPage,
        fuente: 'BACKEND REAL - MongoDB',
        timestamp: new Date().toISOString()
      })
      
      if (!currentCursor) {
        // ✅ PRIMERA CARGA: Reemplazar lista
        setAccumulatedVehicles(backendData.docs)
        setHasMoreData(backendData.hasNextPage || false)
      } else {
        // ✅ CARGAR MÁS: Acumular vehículos
        setAccumulatedVehicles(prev => [...prev, ...backendData.docs])
        setHasMoreData(backendData.hasNextPage || false)
      }
    } else if (query.data?.data && Array.isArray(query.data.data)) {
      // Respuesta mock (mantener compatibilidad)
      if (!currentCursor) {
        // ✅ PRIMERA CARGA: Reemplazar lista
        setAccumulatedVehicles(query.data.data)
        setHasMoreData(query.data.hasNextPage || false)
      } else {
        // ✅ CARGAR MÁS: Acumular vehículos
        setAccumulatedVehicles(prev => [...prev, ...query.data.data])
        setHasMoreData(query.data.hasNextPage || false)
      }
    }
  }, [query.data]) // ✅ SOLO query.data, NO currentCursor

  // ✅ FUNCIÓN para cargar más vehículos
  const loadMore = useCallback(async () => {
    if (!hasMoreData || isLoadingMore || query.isFetching) {
      return
    }

    setIsLoadingMore(true)
    try {
      // ✅ OBTENER CURSOR del último vehículo para paginación
      const lastVehicle = accumulatedVehicles[accumulatedVehicles.length - 1]
      const nextCursor = lastVehicle?._id || lastVehicle?.id || null
      
      if (nextCursor) {
        setCurrentCursor(nextCursor)
        // ✅ La query se ejecutará automáticamente con nuevo cursor
        await query.refetch()
      } else {
        console.warn('⚠️ No se pudo obtener cursor para la siguiente página')
        setHasMoreData(false)
      }
    } catch (error) {
      console.error('❌ Error al cargar más vehículos:', error)
      // ✅ REVERTIR cursor en caso de error
      setCurrentCursor(null)
    } finally {
      setIsLoadingMore(false)
    }
  }, [hasMoreData, isLoadingMore, query.isFetching, accumulatedVehicles, query.refetch])

  // ✅ FUNCIÓN para limpiar cache y resetear
  const clearCache = useCallback(() => {
    queryClient.removeQueries(['vehicles-list'])
    setAccumulatedVehicles([])
    setCurrentCursor(null)
    setHasMoreData(true) // ✅ Solo para limpieza manual
    setIsLoadingMore(false)
  }, [queryClient])

  // ✅ FUNCIÓN para invalidar cache al aplicar filtros
  const invalidateCache = useCallback(() => {
    // ✅ LIMPIAR cache anterior
    queryClient.removeQueries(['vehicles-list'])
    // ✅ RESETEAR estado local
    setAccumulatedVehicles([])
    setCurrentCursor(null)
    // ✅ NO resetear hasMoreData aquí - el backend lo determinará
    setIsLoadingMore(false)
    // ✅ FORZAR nueva query
    query.refetch()
  }, [queryClient, query.refetch])

  // ✅ FUNCIÓN para resetear a primera página
  const resetToFirstPage = useCallback(() => {
    setCurrentCursor(null)
    setAccumulatedVehicles([])
    // ✅ NO resetear hasMoreData aquí - el backend lo determinará
    setIsLoadingMore(false)
    // ✅ La query se ejecutará automáticamente
  }, [])

  return {
    // ✅ DATOS ACUMULADOS
    vehicles: accumulatedVehicles,
    total: query.data?.total || 0,
    currentCursor,
    hasNextPage: hasMoreData,
    
    // ✅ ESTADOS
    isLoading: query.isLoading && !currentCursor, // ✅ Solo loading inicial
    isLoadingMore,
    isError: query.isError,
    error: query.error,
    isFetching: query.isFetching,
    
    // ✅ FUNCIONES
    refetch: query.refetch,
    loadMore,
    clearCache,
    invalidateCache, // ✅ NUEVA: Para aplicar filtros
    resetToFirstPage, // ✅ NUEVA: Para resetear
    
    // ✅ METADATOS
    hasActiveFilters,
    filtersHash,
    
    // ✅ DATOS RAW (para casos especiales)
    rawData: query.data
  }
} 