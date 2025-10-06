/**
 * useSorting - Hook unificado para gestión de ordenamiento
 * 
 * Responsabilidades:
 * - Estado centralizado de sorting
 * - Handlers optimizados
 * - Sincronización con URL (opcional)
 * - Performance optimizada
 * 
 * @author Indiana Usados
 * @version 1.0.0 - Arquitectura unificada
 */

import { useState, useCallback, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { SORT_OPTIONS } from '@constants'
import { isValidSortOption } from '@utils'

export const useSorting = (options = {}) => {
  const {
    syncWithUrl = false,
    urlKey = 'sort',
    defaultSort = null
  } = options

  const [searchParams, setSearchParams] = useSearchParams()
  
  // ✅ ESTADO CENTRALIZADO
  const [selectedSort, setSelectedSort] = useState(() => {
    if (syncWithUrl) {
      return searchParams.get(urlKey) || defaultSort
    }
    return defaultSort
  })
  
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

  // ✅ HANDLERS OPTIMIZADOS CON useCallback
  const handleSortChange = useCallback((sortOption) => {
    // Validar opción
    if (sortOption && !isValidSortOption(sortOption)) {
      console.warn('Invalid sort option:', sortOption)
      return
    }

    setSelectedSort(sortOption)
    setIsDropdownOpen(false)

    // Sincronizar con URL si está habilitado
    if (syncWithUrl) {
      const newParams = new URLSearchParams(searchParams)
      if (sortOption) {
        newParams.set(urlKey, sortOption)
      } else {
        newParams.delete(urlKey)
      }
      setSearchParams(newParams, { replace: true })
    }
  }, [syncWithUrl, urlKey, searchParams, setSearchParams])

  const toggleDropdown = useCallback(() => {
    setIsDropdownOpen(prev => !prev)
  }, [])

  const closeDropdown = useCallback(() => {
    setIsDropdownOpen(false)
  }, [])

  const clearSort = useCallback(() => {
    handleSortChange(null)
  }, [handleSortChange])

  // ✅ SINCRONIZACIÓN CON URL (si está habilitada)
  useEffect(() => {
    if (syncWithUrl) {
      const urlSort = searchParams.get(urlKey)
      if (urlSort !== selectedSort) {
        setSelectedSort(urlSort || defaultSort)
      }
    }
  }, [searchParams, urlKey, syncWithUrl, selectedSort, defaultSort])

  // ✅ INFORMACIÓN DERIVADA
  const selectedSortOption = SORT_OPTIONS.find(option => option.value === selectedSort)
  const hasActiveSort = selectedSort !== null

  return {
    // Estado
    selectedSort,
    isDropdownOpen,
    selectedSortOption,
    hasActiveSort,
    
    // Handlers
    handleSortChange,
    toggleDropdown,
    closeDropdown,
    clearSort,
    
    // Opciones disponibles
    sortOptions: SORT_OPTIONS,
    
    // Utilidades
    isValidSort: (sortOption) => isValidSortOption(sortOption)
  }
}

export default useSorting
