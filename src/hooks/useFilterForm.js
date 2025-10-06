/**
 * useFilterForm - Hook optimizado para lógica del formulario de filtros
 * 
 * Arquitectura Controlled Component con dependencias estables:
 * - useCallback para handlers estables
 * - useMemo para valores computados estables
 * - useEffect controlado para sincronización
 * - Single Source of Truth para el estado del formulario
 * 
 * @author Indiana Usados
 * @version 2.0.0 - Arquitectura optimizada
 */

import { useEffect, useCallback, useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { FILTER_DEFAULTS } from '@constants'

export const useFilterForm = (currentFilters) => {
  // ✅ OPTIMIZADO: Función para validar rangos (min siempre <= max)
  const validateRange = useCallback(([min, max]) => [Math.min(min, max), Math.max(min, max)], [])

  // ✅ OPTIMIZADO: Valores por defecto estables con useMemo
  const defaultValues = useMemo(() => ({
    marca: currentFilters.marca || [],
    caja: currentFilters.caja || [],
    combustible: currentFilters.combustible || [],
    año: currentFilters.año || [FILTER_DEFAULTS.AÑO.min, FILTER_DEFAULTS.AÑO.max],
    precio: currentFilters.precio || [FILTER_DEFAULTS.PRECIO.min, FILTER_DEFAULTS.PRECIO.max],
    kilometraje: currentFilters.kilometraje || [FILTER_DEFAULTS.KILOMETRAJE.min, FILTER_DEFAULTS.KILOMETRAJE.max]
  }), [currentFilters.marca, currentFilters.caja, currentFilters.combustible, currentFilters.año, currentFilters.precio, currentFilters.kilometraje])

  // ✅ OPTIMIZADO: Configurar React Hook Form con valores estables
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    watch,
    formState: { errors }
  } = useForm({
    defaultValues
  })

  // Watch específico por campo
  const marca = watch('marca')
  const combustible = watch('combustible')
  const caja = watch('caja')
  const año = watch('año') || [FILTER_DEFAULTS.AÑO.min, FILTER_DEFAULTS.AÑO.max]
  const precio = watch('precio') || [FILTER_DEFAULTS.PRECIO.min, FILTER_DEFAULTS.PRECIO.max]
  const kilometraje = watch('kilometraje') || [FILTER_DEFAULTS.KILOMETRAJE.min, FILTER_DEFAULTS.KILOMETRAJE.max]

  // ✅ OPTIMIZADO: Cálculo de filtros activos con useMemo
  const activeFiltersCount = useMemo(() => {
    const hasMarca = marca?.length > 0
    const hasCombustible = combustible?.length > 0
    const hasCaja = caja?.length > 0
    const hasRanges = año[0] !== FILTER_DEFAULTS.AÑO.min || año[1] !== FILTER_DEFAULTS.AÑO.max || 
                     precio[0] !== FILTER_DEFAULTS.PRECIO.min || precio[1] !== FILTER_DEFAULTS.PRECIO.max || 
                     kilometraje[0] !== FILTER_DEFAULTS.KILOMETRAJE.min || kilometraje[1] !== FILTER_DEFAULTS.KILOMETRAJE.max
    
    return [hasMarca, hasCombustible, hasCaja, hasRanges].filter(Boolean).length
  }, [marca, combustible, caja, año, precio, kilometraje])

  // ✅ OPTIMIZADO: Handlers para ranges únicos con useCallback
  const handleAñoChange = useCallback(([min, max]) => {
    setValue('año', [min, max])
  }, [setValue])

  const handlePrecioChange = useCallback(([min, max]) => {
    setValue('precio', [min, max])
  }, [setValue])

  const handleKilometrajeChange = useCallback(([min, max]) => {
    setValue('kilometraje', [min, max])
  }, [setValue])

  // ✅ OPTIMIZADO: Handlers para selects con useCallback
  const handleMarcaChange = useCallback((values) => {
    setValue('marca', values)
  }, [setValue])

  const handleCombustibleChange = useCallback((values) => {
    setValue('combustible', values)
  }, [setValue])

  const handleCajaChange = useCallback((values) => {
    setValue('caja', values)
  }, [setValue])

  // ✅ OPTIMIZADO: Función para limpiar filtros con useCallback
  const handleClear = useCallback(() => {
    reset({
      marca: [],
      caja: [],
      combustible: [],
      año: [FILTER_DEFAULTS.AÑO.min, FILTER_DEFAULTS.AÑO.max],
      precio: [FILTER_DEFAULTS.PRECIO.min, FILTER_DEFAULTS.PRECIO.max],
      kilometraje: [FILTER_DEFAULTS.KILOMETRAJE.min, FILTER_DEFAULTS.KILOMETRAJE.max]
    })
  }, [reset])

  // ✅ OPTIMIZADO: Función para validar y preparar datos para envío con useCallback
  const prepareSubmitData = useCallback((data) => {
    return {
      marca: data.marca || [],
      caja: data.caja || [],
      combustible: data.combustible || [],
      año: validateRange(data.año || [FILTER_DEFAULTS.AÑO.min, FILTER_DEFAULTS.AÑO.max]),
      precio: validateRange(data.precio || [FILTER_DEFAULTS.PRECIO.min, FILTER_DEFAULTS.PRECIO.max]),
      kilometraje: validateRange(data.kilometraje || [FILTER_DEFAULTS.KILOMETRAJE.min, FILTER_DEFAULTS.KILOMETRAJE.max])
    }
  }, [validateRange])

  // ✅ OPTIMIZADO: Formateadores con useCallback
  const formatPrice = useCallback((value) => `$${value.toLocaleString()}`, [])
  const formatKms = useCallback((value) => `${value.toLocaleString()} km`, [])
  const formatYear = useCallback((value) => value.toString(), [])

  return {
    // React Hook Form
    register,
    handleSubmit,
    setValue,
    reset,
    watch,
    errors,
    
    // Valores actuales
    marca,
    combustible,
    caja,
    año,
    precio,
    kilometraje,
    
    // Utilidades
    activeFiltersCount,
    defaultValues,
    prepareSubmitData,
    handleClear,
    
    // Handlers
    handleAñoChange,
    handlePrecioChange,
    handleKilometrajeChange,
    handleMarcaChange,
    handleCombustibleChange,
    handleCajaChange,
    
    // Formateadores
    formatPrice,
    formatKms,
    formatYear
  }
}
