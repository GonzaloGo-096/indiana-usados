/**
 * RangeFilterSlider - Slider de rango con fetch automático
 * 
 * Características:
 * - Slider con valor visible
 * - Fetch automático con debounce de 200ms
 * - Cancelación de requests previos con AbortController
 * - Soporte para filtros adicionales (marca, año, caja, cursor)
 * - Paginación automática
 * - Cache opcional para evitar refetches innecesarios
 * - Logs claros de operaciones
 * - Cleanup correcto al desmontar
 * 
 * @author Indiana Usados
 * @version 1.0.0
 */

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import vehiclesService from '@services/vehiclesApi'
import { logger } from '@utils/logger'
import { mapVehiclesPage } from '@mappers'
import styles from './RangeFilterSlider.module.css'

const RangeFilterSlider = ({
  min = 0,
  max = 100,
  step = 1,
  initialValue = 50,
  label = 'Rango',
  formatValue = (val) => val.toString(),
  // Filtros adicionales
  marca = null,
  año = null,
  caja = null,
  // Paginación
  limit = 8,
  initialCursor = 1,
  // Cache
  enableCache = true,
  // Callbacks
  onVehiclesLoaded = null,
  onError = null,
  className = ''
}) => {
  // ✅ Estado del slider
  const [rangeValue, setRangeValue] = useState(initialValue)
  const [displayValue, setDisplayValue] = useState(initialValue)

  // ✅ Estado de vehículos
  const [vehicles, setVehicles] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [total, setTotal] = useState(0)
  const [currentCursor, setCurrentCursor] = useState(initialCursor)
  const [hasNextPage, setHasNextPage] = useState(false)

  // ✅ Refs para control de requests
  const abortControllerRef = useRef(null)
  const debounceTimeoutRef = useRef(null)
  const cacheRef = useRef(new Map()) // Cache: key -> { vehicles, total, hasNextPage, timestamp }

  // ✅ Construir filtros para el fetch
  const buildFilters = useCallback(() => {
    const filters = {}
    if (marca) filters.marca = Array.isArray(marca) ? marca : [marca]
    if (año) filters.año = Array.isArray(año) ? año : [año]
    if (caja) filters.caja = Array.isArray(caja) ? caja : [caja]
    // Agregar rango al filtro (asumiendo que el backend acepta un parámetro 'rango')
    filters.rango = rangeValue
    return filters
  }, [marca, año, caja, rangeValue])

  // ✅ Generar cache key
  const getCacheKey = useCallback((filters, cursor) => {
    return JSON.stringify({ filters, cursor, limit })
  }, [limit])

  // ✅ Verificar cache
  const getCachedData = useCallback((cacheKey) => {
    if (!enableCache) return null
    
    const cached = cacheRef.current.get(cacheKey)
    if (!cached) return null

    // Verificar si el cache es válido (5 minutos)
    const CACHE_TTL = 1000 * 60 * 5
    const now = Date.now()
    if (now - cached.timestamp > CACHE_TTL) {
      cacheRef.current.delete(cacheKey)
      return null
    }

    return cached
  }, [enableCache])

  // ✅ Guardar en cache
  const setCachedData = useCallback((cacheKey, data) => {
    if (!enableCache) return
    
    cacheRef.current.set(cacheKey, {
      ...data,
      timestamp: Date.now()
    })
  }, [enableCache])

  // ✅ Función de fetch con cancelación
  const fetchVehicles = useCallback(async (filters, cursor, signal) => {
    try {
      logger.log('slider:fetch', 'Iniciando fetch de vehículos', {
        filters,
        cursor,
        limit
      })

      const result = await vehiclesService.getVehicles({
        filters,
        limit,
        cursor,
        signal
      })

      // Mapear datos usando el mapper existente
      const mappedPage = mapVehiclesPage(result)
      
      const vehicleCount = mappedPage.vehicles?.length || 0
      const totalCount = mappedPage.total || 0
      const hasNext = result?.allPhotos?.hasNextPage || false

      logger.log('slider:fetch', 'Fetch completado', {
        vehicleCount,
        totalCount,
        hasNext,
        cursor
      })

      return {
        vehicles: mappedPage.vehicles || [],
        total: totalCount,
        hasNextPage: hasNext,
        nextCursor: result?.allPhotos?.nextPage || null
      }
    } catch (err) {
      // Verificar si fue cancelado
      if (err.name === 'AbortError' || err.code === 'ERR_CANCELED') {
        logger.debug('slider:fetch', 'Fetch cancelado', { cursor })
        throw err // Re-lanzar para que el caller sepa que fue cancelado
      }

      // Error real
      logger.error('slider:fetch', 'Error en fetch de vehículos', {
        error: err.message,
        filters,
        cursor
      })
      throw err
    }
  }, [limit])

  // ✅ Función principal de carga con cache y cancelación
  const loadVehicles = useCallback(async (filters, cursor, isNewRange = false, currentVehicles = []) => {
    // Cancelar request anterior si existe
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
      logger.debug('slider:fetch', 'Request anterior cancelado')
      abortControllerRef.current = null
    }

    // Si es un nuevo rango, resetear cursor
    const effectiveCursor = isNewRange ? initialCursor : cursor
    const cacheKey = getCacheKey(filters, effectiveCursor)

    // Verificar cache
    const cached = getCachedData(cacheKey)
    if (cached) {
      logger.debug('slider:cache', 'Usando datos del cache', { cacheKey })
      setVehicles(cached.vehicles)
      setTotal(cached.total)
      setHasNextPage(cached.hasNextPage)
      setCurrentCursor(effectiveCursor)
      setIsLoading(false)
      setError(null)
      if (onVehiclesLoaded) {
        onVehiclesLoaded(cached.vehicles, cached.total)
      }
      return
    }

    // Crear nuevo AbortController
    const abortController = new AbortController()
    abortControllerRef.current = abortController

    setIsLoading(true)
    setError(null)

    try {
      const data = await fetchVehicles(filters, effectiveCursor, abortController.signal)

      // Verificar si el request fue cancelado después de completar
      if (abortController.signal.aborted) {
        logger.debug('slider:fetch', 'Request completado pero ya fue cancelado')
        return
      }

      // Actualizar estado
      // Si es nueva página, acumular vehículos; si es nuevo rango/filtro, reemplazar
      const updatedVehicles = isNewRange 
        ? data.vehicles 
        : [...currentVehicles, ...data.vehicles]
      
      setVehicles(updatedVehicles)
      setTotal(data.total)
      setHasNextPage(data.hasNextPage)
      setCurrentCursor(effectiveCursor)

      // Guardar en cache (solo la página actual, no acumulada)
      setCachedData(cacheKey, {
        vehicles: data.vehicles,
        total: data.total,
        hasNextPage: data.hasNextPage
      })

      // Callback (pasar todos los vehículos acumulados)
      if (onVehiclesLoaded) {
        onVehiclesLoaded(updatedVehicles, data.total)
      }

      const loadedCount = updatedVehicles.length
      logger.log('slider:success', `Vehículos cargados: ${loadedCount} de ${data.total}`)
    } catch (err) {
      // Ignorar errores de cancelación
      if (err.name === 'AbortError' || err.code === 'ERR_CANCELED') {
        logger.debug('slider:fetch', 'Fetch cancelado durante ejecución')
        return
      }

      // Error real
      setError(err.message || 'Error al cargar vehículos')
      setVehicles([])
      setTotal(0)
      setHasNextPage(false)

      if (onError) {
        onError(err)
      }

      logger.error('slider:error', 'Error al cargar vehículos', {
        error: err.message,
        filters,
        cursor: effectiveCursor
      })
    } finally {
      // Solo limpiar loading si no fue cancelado
      if (!abortController.signal.aborted) {
        setIsLoading(false)
      }
      abortControllerRef.current = null
    }
  }, [
    getCacheKey,
    getCachedData,
    setCachedData,
    fetchVehicles,
    initialCursor,
    onVehiclesLoaded,
    onError
  ])

  // ✅ Handler de cambio del slider con debounce
  const handleRangeChange = useCallback((e) => {
    const newValue = Number(e.target.value)
    setDisplayValue(newValue) // Actualizar display inmediatamente

    // Cancelar debounce anterior
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current)
    }

    // Debounce de 200ms
    debounceTimeoutRef.current = setTimeout(() => {
      setRangeValue(newValue)
      logger.debug('slider:change', `Rango cambiado a: ${newValue}`)
    }, 200)
  }, [])

  // ✅ Efecto para cargar vehículos cuando cambia el rango o filtros
  useEffect(() => {
    const filters = buildFilters()
    // Resetear vehículos y cursor cuando cambia rango o filtros
    setVehicles([])
    setCurrentCursor(initialCursor)
    loadVehicles(filters, initialCursor, true, []) // true = nuevo rango, resetear cursor

    // Cleanup: cancelar debounce
    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current)
      }
    }
  }, [rangeValue, marca, año, caja]) // Dependencias: rango y filtros

  // ✅ Efecto para cargar siguiente página cuando cambia cursor
  useEffect(() => {
    // Evitar cargar si el cursor es el inicial (ya se cargó en el efecto anterior)
    // o si no hay vehículos (significa que es un nuevo rango/filtro)
    if (currentCursor === initialCursor || vehicles.length === 0) return

    const filters = buildFilters()
    loadVehicles(filters, currentCursor, false, vehicles) // false = no es nuevo rango, acumular
  }, [currentCursor]) // Solo cuando cambia cursor (no cuando cambia rango)

  // ✅ Handler para cargar más (paginación)
  const handleLoadMore = useCallback(() => {
    if (!hasNextPage || isLoading) return

    const nextCursor = currentCursor + 1
    setCurrentCursor(nextCursor)
    logger.debug('slider:pagination', `Cargando página ${nextCursor}`)
  }, [hasNextPage, isLoading, currentCursor])

  // ✅ Cleanup al desmontar
  useEffect(() => {
    return () => {
      // Cancelar request en curso
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
        logger.debug('slider:cleanup', 'Request cancelado al desmontar')
      }

      // Limpiar debounce
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current)
      }

      logger.debug('slider:cleanup', 'Componente desmontado, cleanup completado')
    }
  }, [])

  // ✅ Memoizar filtros para evitar recreaciones
  const filters = useMemo(() => buildFilters(), [buildFilters])

  return (
    <div className={`${styles.container} ${className}`}>
      {/* Slider */}
      <div className={styles.sliderSection}>
        <label className={styles.label}>
          {label}: <span className={styles.valueDisplay}>{formatValue(displayValue)}</span>
        </label>
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={displayValue}
          onChange={handleRangeChange}
          className={styles.slider}
          aria-label={`${label} slider`}
          aria-valuemin={min}
          aria-valuemax={max}
          aria-valuenow={displayValue}
        />
        <div className={styles.rangeLabels}>
          <span>{formatValue(min)}</span>
          <span>{formatValue(max)}</span>
        </div>
      </div>

      {/* Estado de carga */}
      {isLoading && (
        <div className={styles.status}>
          <span>Cargando vehículos...</span>
        </div>
      )}

      {/* Error */}
      {error && !isLoading && (
        <div className={styles.error}>
          <span>Error: {error}</span>
        </div>
      )}

      {/* Lista de vehículos */}
      {!isLoading && !error && vehicles.length > 0 && (
        <div className={styles.vehiclesSection}>
          <div className={styles.vehiclesHeader}>
            <h3>Vehículos encontrados: {total}</h3>
            {hasNextPage && (
              <button
                onClick={handleLoadMore}
                className={styles.loadMoreButton}
                disabled={isLoading}
              >
                Cargar más
              </button>
            )}
          </div>
          <ul className={styles.vehiclesList}>
            {vehicles.map((vehicle) => (
              <li key={vehicle.id || vehicle._id} className={styles.vehicleItem}>
                <div className={styles.vehicleInfo}>
                  <strong>{vehicle.marca} {vehicle.modelo}</strong>
                  {vehicle.version && <span> - {vehicle.version}</span>}
                </div>
                <div className={styles.vehicleDetails}>
                  <span>Año: {vehicle.anio || vehicle.año || 'N/A'}</span>
                  <span>Km: {vehicle.kilometraje || vehicle.kms || 'N/A'}</span>
                  <span>Precio: ${vehicle.precio?.toLocaleString() || 'N/A'}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Sin resultados */}
      {!isLoading && !error && vehicles.length === 0 && (
        <div className={styles.empty}>
          <span>No se encontraron vehículos con los filtros seleccionados</span>
        </div>
      )}
    </div>
  )
}

export default RangeFilterSlider

