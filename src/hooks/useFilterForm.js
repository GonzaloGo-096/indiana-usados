/**
 * useFilterForm - Hook para lógica del formulario de filtros
 * 
 * Extrae la lógica del formulario del FilterFormSimplified
 * para reutilización y testing independiente.
 * 
 * @author Indiana Usados
 * @version 1.0.0 - Modular
 */

import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { FILTER_DEFAULTS } from '@constants'

export const useFilterForm = (currentFilters) => {
  // Función para validar rangos (min siempre <= max)
  const validateRange = ([min, max]) => [Math.min(min, max), Math.max(min, max)]

  // Valores por defecto que se sincronizan con la URL
  const getDefaultValues = () => ({
    marca: currentFilters.marca || [],
    caja: currentFilters.caja || [],
    combustible: currentFilters.combustible || [],
    año: currentFilters.año || [FILTER_DEFAULTS.AÑO.min, FILTER_DEFAULTS.AÑO.max],
    precio: currentFilters.precio || [FILTER_DEFAULTS.PRECIO.min, FILTER_DEFAULTS.PRECIO.max],
    kilometraje: currentFilters.kilometraje || [FILTER_DEFAULTS.KILOMETRAJE.min, FILTER_DEFAULTS.KILOMETRAJE.max]
  })

  // Configurar React Hook Form
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    watch,
    formState: { errors }
  } = useForm({
    defaultValues: getDefaultValues()
  })

  // Watch específico por campo
  const marca = watch('marca')
  const combustible = watch('combustible')
  const caja = watch('caja')
  const año = watch('año') || [FILTER_DEFAULTS.AÑO.min, FILTER_DEFAULTS.AÑO.max]
  const precio = watch('precio') || [FILTER_DEFAULTS.PRECIO.min, FILTER_DEFAULTS.PRECIO.max]
  const kilometraje = watch('kilometraje') || [FILTER_DEFAULTS.KILOMETRAJE.min, FILTER_DEFAULTS.KILOMETRAJE.max]

  // Cálculo de filtros activos
  const activeFiltersCount = (() => {
    const hasMarca = marca?.length > 0
    const hasCombustible = combustible?.length > 0
    const hasCaja = caja?.length > 0
    const hasRanges = año[0] !== FILTER_DEFAULTS.AÑO.min || año[1] !== FILTER_DEFAULTS.AÑO.max || 
                     precio[0] !== FILTER_DEFAULTS.PRECIO.min || precio[1] !== FILTER_DEFAULTS.PRECIO.max || 
                     kilometraje[0] !== FILTER_DEFAULTS.KILOMETRAJE.min || kilometraje[1] !== FILTER_DEFAULTS.KILOMETRAJE.max
    
    return [hasMarca, hasCombustible, hasCaja, hasRanges].filter(Boolean).length
  })()

  // Handlers para ranges únicos
  const handleAñoChange = ([min, max]) => {
    setValue('año', [min, max])
  }

  const handlePrecioChange = ([min, max]) => {
    setValue('precio', [min, max])
  }

  const handleKilometrajeChange = ([min, max]) => {
    setValue('kilometraje', [min, max])
  }

  // Handlers para selects
  const handleMarcaChange = (values) => {
    setValue('marca', values)
  }

  const handleCombustibleChange = (values) => {
    setValue('combustible', values)
  }

  const handleCajaChange = (values) => {
    setValue('caja', values)
  }

  // Función para limpiar filtros
  const handleClear = () => {
    reset({
      marca: [],
      caja: [],
      combustible: [],
      año: [FILTER_DEFAULTS.AÑO.min, FILTER_DEFAULTS.AÑO.max],
      precio: [FILTER_DEFAULTS.PRECIO.min, FILTER_DEFAULTS.PRECIO.max],
      kilometraje: [FILTER_DEFAULTS.KILOMETRAJE.min, FILTER_DEFAULTS.KILOMETRAJE.max]
    })
  }

  // Función para validar y preparar datos para envío
  const prepareSubmitData = (data) => {
    return {
      marca: data.marca || [],
      caja: data.caja || [],
      combustible: data.combustible || [],
      año: validateRange(data.año || [FILTER_DEFAULTS.AÑO.min, FILTER_DEFAULTS.AÑO.max]),
      precio: validateRange(data.precio || [FILTER_DEFAULTS.PRECIO.min, FILTER_DEFAULTS.PRECIO.max]),
      kilometraje: validateRange(data.kilometraje || [FILTER_DEFAULTS.KILOMETRAJE.min, FILTER_DEFAULTS.KILOMETRAJE.max])
    }
  }

  // Formateadores
  const formatPrice = (value) => `$${value.toLocaleString()}`
  const formatKms = (value) => `${value.toLocaleString()} km`
  const formatYear = (value) => value.toString()

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
    getDefaultValues,
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
