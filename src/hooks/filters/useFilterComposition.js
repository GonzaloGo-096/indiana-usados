/**
 * useFilterComposition - Hook usando composition pattern
 * 
 * Ventajas:
 * - Más modular y reutilizable
 * - Separación clara de responsabilidades
 * - Fácil de testear
 * - Mejor performance
 * 
 * @author Indiana Usados
 * @version 1.0.0
 */

import { useState, useCallback, useMemo } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import autoService, { queryKeys } from '../../services/service'

// ===== HOOKS ESPECIALIZADOS =====

// Hook para estado de filtros
const useFilterState = () => {
    const [currentFilters, setCurrentFilters] = useState({})
    const [pendingFilters, setPendingFilters] = useState({})

    const updatePendingFilters = useCallback((filters) => {
        setPendingFilters(filters)
    }, [])

    const updateCurrentFilters = useCallback((filters) => {
        setCurrentFilters(filters)
    }, [])

    const clearFilter = useCallback((filterKey) => {
        setPendingFilters(prev => {
            const newFilters = { ...prev }
            delete newFilters[filterKey]
            return newFilters
        })
        setCurrentFilters(prev => {
            const newFilters = { ...prev }
            delete newFilters[filterKey]
            return newFilters
        })
    }, [])

    const clearAllFilters = useCallback(() => {
        setPendingFilters({})
        setCurrentFilters({})
    }, [])

    return {
        currentFilters,
        pendingFilters,
        updatePendingFilters,
        updateCurrentFilters,
        clearFilter,
        clearAllFilters
    }
}

// Hook para queries
const useFilterQueries = (currentFilters) => {
    const queryClient = useQueryClient()

    const {
        data: cars,
        isLoading,
        isError,
        error,
        refetch
    } = useQuery({
        queryKey: [queryKeys.autos, 'list', currentFilters],
        queryFn: async () => {
            const queryParams = new URLSearchParams()
            Object.entries(currentFilters).forEach(([key, value]) => {
                if (value && value !== '') {
                    queryParams.append(key, value)
                }
            })
            
            const result = await autoService.getAutos({ 
                pageParam: 1, 
                filters: queryParams.toString() 
            })
            return result.items || []
        },
        staleTime: 1000 * 60 * 5,
        cacheTime: 1000 * 60 * 30,
    })

    const applyFiltersMutation = useMutation({
        mutationFn: async (filters) => {
            const queryParams = new URLSearchParams()
            Object.entries(filters).forEach(([key, value]) => {
                if (value && value !== '') {
                    queryParams.append(key, value)
                }
            })
            
            const result = await autoService.getAutos({ 
                pageParam: 1, 
                filters: queryParams.toString() 
            })
            return result.items || []
        },
        onSuccess: (filteredCars, variables) => {
            queryClient.setQueryData([queryKeys.autos, 'list', variables], filteredCars)
        }
    })

    return {
        cars: cars || [],
        isLoading: isLoading || applyFiltersMutation.isPending,
        isError,
        error,
        isFiltering: applyFiltersMutation.isPending,
        refetch,
        applyFiltersMutation
    }
}

// Hook para valores derivados
const useFilterDerived = (currentFilters) => {
    const activeFiltersCount = useMemo(() => {
        return Object.values(currentFilters).filter(value => value && value !== '').length
    }, [currentFilters])

    const hasActiveFilters = useMemo(() => {
        return Object.keys(currentFilters).length > 0
    }, [currentFilters])

    return {
        activeFiltersCount,
        hasActiveFilters
    }
}

// ===== HOOK PRINCIPAL =====
export const useFilterComposition = () => {
    // Componer los hooks especializados
    const filterState = useFilterState()
    const filterQueries = useFilterQueries(filterState.currentFilters)
    const filterDerived = useFilterDerived(filterState.currentFilters)

    // Acción para aplicar filtros
    const applyFilters = useCallback(() => {
        if (Object.keys(filterState.pendingFilters).length > 0) {
            filterQueries.applyFiltersMutation.mutate(filterState.pendingFilters, {
                onSuccess: () => {
                    filterState.updateCurrentFilters(filterState.pendingFilters)
                }
            })
        }
    }, [filterState.pendingFilters, filterQueries.applyFiltersMutation, filterState.updateCurrentFilters])

    return {
        // Estado
        currentFilters: filterState.currentFilters,
        pendingFilters: filterState.pendingFilters,
        activeFiltersCount: filterDerived.activeFiltersCount,
        hasActiveFilters: filterDerived.hasActiveFilters,
        
        // Datos
        cars: filterQueries.cars,
        isLoading: filterQueries.isLoading,
        isError: filterQueries.isError,
        error: filterQueries.error,
        isFiltering: filterQueries.isFiltering,
        
        // Acciones
        handleFiltersChange: filterState.updatePendingFilters,
        applyFilters,
        clearFilter: filterState.clearFilter,
        clearAllFilters: filterState.clearAllFilters,
        refetch: filterQueries.refetch,
    }
} 