/**
 * useFilterReducer - Hook con useReducer para manejo de filtros
 * 
 * Ventajas:
 * - Estado más predecible
 * - Acciones tipadas
 * - Mejor para lógica compleja
 * 
 * @author Indiana Usados
 * @version 1.0.0
 */

import { useReducer, useCallback, useMemo } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import autoService, { queryKeys } from '../service/service'

// ===== TIPOS DE ACCIONES =====
const ACTIONS = {
    SET_PENDING_FILTERS: 'SET_PENDING_FILTERS',
    SET_CURRENT_FILTERS: 'SET_CURRENT_FILTERS',
    CLEAR_FILTER: 'CLEAR_FILTER',
    CLEAR_ALL_FILTERS: 'CLEAR_ALL_FILTERS',
    APPLY_FILTERS: 'APPLY_FILTERS'
}

// ===== ESTADO INICIAL =====
const initialState = {
    currentFilters: {},
    pendingFilters: {},
    isFiltering: false
}

// ===== REDUCER =====
const filterReducer = (state, action) => {
    switch (action.type) {
        case ACTIONS.SET_PENDING_FILTERS:
            return {
                ...state,
                pendingFilters: action.payload
            }
            
        case ACTIONS.SET_CURRENT_FILTERS:
            return {
                ...state,
                currentFilters: action.payload
            }
            
        case ACTIONS.CLEAR_FILTER:
            const { filterKey } = action.payload
            const newPending = { ...state.pendingFilters }
            const newCurrent = { ...state.currentFilters }
            
            delete newPending[filterKey]
            delete newCurrent[filterKey]
            
            return {
                ...state,
                pendingFilters: newPending,
                currentFilters: newCurrent
            }
            
        case ACTIONS.CLEAR_ALL_FILTERS:
            return {
                ...state,
                pendingFilters: {},
                currentFilters: {}
            }
            
        case ACTIONS.APPLY_FILTERS:
            return {
                ...state,
                currentFilters: state.pendingFilters,
                isFiltering: true
            }
            
        default:
            return state
    }
}

export const useFilterReducer = () => {
    const [state, dispatch] = useReducer(filterReducer, initialState)
    const queryClient = useQueryClient()
    
    // ===== QUERY ÚNICA =====
    const {
        data: cars,
        isLoading,
        isError,
        error,
        refetch
    } = useQuery({
        queryKey: [queryKeys.autos, 'list', state.currentFilters],
        queryFn: async () => {
            const queryParams = new URLSearchParams()
            Object.entries(state.currentFilters).forEach(([key, value]) => {
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

    // ===== MUTATION =====
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
        onSuccess: (filteredCars) => {
            queryClient.setQueryData([queryKeys.autos, 'list', state.pendingFilters], filteredCars)
        }
    })

    // ===== ACCIONES =====
    const handleFiltersChange = useCallback((filters) => {
        dispatch({ type: ACTIONS.SET_PENDING_FILTERS, payload: filters })
    }, [])

    const applyFilters = useCallback(() => {
        if (Object.keys(state.pendingFilters).length > 0) {
            dispatch({ type: ACTIONS.APPLY_FILTERS })
            applyFiltersMutation.mutate(state.pendingFilters)
        }
    }, [state.pendingFilters, applyFiltersMutation])

    const clearFilter = useCallback((filterKey) => {
        dispatch({ type: ACTIONS.CLEAR_FILTER, payload: { filterKey } })
    }, [])

    const clearAllFilters = useCallback(() => {
        dispatch({ type: ACTIONS.CLEAR_ALL_FILTERS })
    }, [])

    // ===== VALORES DERIVADOS =====
    const activeFiltersCount = useMemo(() => {
        return Object.values(state.currentFilters).filter(value => value && value !== '').length
    }, [state.currentFilters])

    const hasActiveFilters = useMemo(() => {
        return Object.keys(state.currentFilters).length > 0
    }, [state.currentFilters])

    return {
        // Estado
        currentFilters: state.currentFilters,
        pendingFilters: state.pendingFilters,
        activeFiltersCount,
        hasActiveFilters,
        
        // Datos
        cars: cars || [],
        isLoading: isLoading || applyFiltersMutation.isPending,
        isError,
        error,
        isFiltering: applyFiltersMutation.isPending,
        
        // Acciones
        handleFiltersChange,
        applyFilters,
        clearFilter,
        clearAllFilters,
        refetch,
    }
} 