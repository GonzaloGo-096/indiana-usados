/**
 * useSimpleFilter - Hook muy simple para filtros
 * 
 * Ventajas:
 * - Código mínimo
 * - Fácil de entender
 * - Sin dependencias complejas
 * 
 * @author Indiana Usados
 * @version 1.0.0
 */

import { useState, useEffect, useCallback, useMemo } from 'react'
import autoService from '../../services/service'

export const useSimpleFilter = () => {
    const [currentFilters, setCurrentFilters] = useState({})
    const [pendingFilters, setPendingFilters] = useState({})
    const [cars, setCars] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState(null)

    // ===== CARGAR DATOS INICIALES =====
    useEffect(() => {
        const loadInitialData = async () => {
            setIsLoading(true)
            setError(null)
            
            try {
                const result = await autoService.getAutos({ pageParam: 1, filters: '' })
                setCars(result.items || [])
            } catch (err) {
                setError(err.message)
            } finally {
                setIsLoading(false)
            }
        }

        loadInitialData()
    }, [])

    // ===== APLICAR FILTROS =====
    const applyFilters = useCallback(async () => {
        if (Object.keys(pendingFilters).length === 0) return

        setIsLoading(true)
        setError(null)

        try {
            const queryParams = new URLSearchParams()
            Object.entries(pendingFilters).forEach(([key, value]) => {
                if (value && value !== '') {
                    queryParams.append(key, value)
                }
            })

            const result = await autoService.getAutos({ 
                pageParam: 1, 
                filters: queryParams.toString() 
            })

            setCars(result.items || [])
            setCurrentFilters(pendingFilters)
        } catch (err) {
            setError(err.message)
        } finally {
            setIsLoading(false)
        }
    }, [pendingFilters])

    // ===== ACCIONES =====
    const handleFiltersChange = useCallback((filters) => {
        setPendingFilters(filters)
    }, [])

    const clearFilter = useCallback((filterKey) => {
        const newPendingFilters = { ...pendingFilters }
        delete newPendingFilters[filterKey]
        setPendingFilters(newPendingFilters)
        
        const newCurrentFilters = { ...currentFilters }
        delete newCurrentFilters[filterKey]
        setCurrentFilters(newCurrentFilters)
    }, [pendingFilters, currentFilters])

    const clearAllFilters = useCallback(async () => {
        setPendingFilters({})
        setCurrentFilters({})
        setIsLoading(true)
        
        try {
            const result = await autoService.getAutos({ pageParam: 1, filters: '' })
            setCars(result.items || [])
        } catch (err) {
            setError(err.message)
        } finally {
            setIsLoading(false)
        }
    }, [])

    // ===== VALORES DERIVADOS =====
    const activeFiltersCount = useMemo(() => {
        return Object.values(currentFilters).filter(value => value && value !== '').length
    }, [currentFilters])

    const hasActiveFilters = useMemo(() => {
        return Object.keys(currentFilters).length > 0
    }, [currentFilters])

    return {
        // Estado
        currentFilters,
        pendingFilters,
        activeFiltersCount,
        hasActiveFilters,
        
        // Datos
        cars,
        isLoading,
        error,
        isError: !!error,
        
        // Acciones
        handleFiltersChange,
        applyFilters,
        clearFilter,
        clearAllFilters,
    }
} 