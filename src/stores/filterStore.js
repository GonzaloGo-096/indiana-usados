/**
 * filterStore - Store de Zustand para manejo de filtros
 * 
 * Ventajas sobre Context:
 * - No re-renderiza componentes innecesariamente
 * - Estado más simple y directo
 * - Mejor performance
 * 
 * @author Indiana Usados
 * @version 1.0.0
 */

import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import autoService, { queryKeys } from '../service/service'

// Store principal
export const useFilterStore = create(
    devtools(
        (set, get) => ({
            // ===== ESTADO =====
            currentFilters: {},
            pendingFilters: {},
            
            // ===== ACCIONES =====
            setPendingFilters: (filters) => set({ pendingFilters: filters }),
            
            setCurrentFilters: (filters) => set({ currentFilters: filters }),
            
            clearFilter: (filterKey) => {
                const { currentFilters, pendingFilters } = get()
                const newPending = { ...pendingFilters }
                const newCurrent = { ...currentFilters }
                
                delete newPending[filterKey]
                delete newCurrent[filterKey]
                
                set({ 
                    pendingFilters: newPending,
                    currentFilters: newCurrent 
                })
            },
            
            clearAllFilters: () => set({ 
                pendingFilters: {}, 
                currentFilters: {} 
            }),
            
            // ===== COMPUTED VALUES =====
            getActiveFiltersCount: () => {
                const { currentFilters } = get()
                return Object.values(currentFilters).filter(value => value && value !== '').length
            },
            
            getHasActiveFilters: () => {
                const { currentFilters } = get()
                return Object.keys(currentFilters).length > 0
            }
        }),
        { name: 'filter-store' }
    )
)

// Hook para queries (separado del store para mejor organización)
export const useFilterQueries = () => {
    const queryClient = useQueryClient()
    const { currentFilters, pendingFilters, setCurrentFilters } = useFilterStore()
    
    // Query para lista completa
    const allCarsQuery = useQuery({
        queryKey: [queryKeys.autos, 'all'],
        queryFn: async () => {
            const result = await autoService.getAutos({ pageParam: 1, filters: '' })
            return result.items || []
        },
        staleTime: 1000 * 60 * 5,
        cacheTime: 1000 * 60 * 30,
    })
    
    // Mutation para aplicar filtros
    const filterMutation = useMutation({
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
            setCurrentFilters(pendingFilters)
            queryClient.setQueryData([queryKeys.autos, 'filtered', pendingFilters], filteredCars)
        }
    })
    
    // Query para datos filtrados
    const filteredCarsQuery = useQuery({
        queryKey: [queryKeys.autos, 'filtered', currentFilters],
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
        enabled: Object.keys(currentFilters).length > 0,
        staleTime: 1000 * 60 * 5,
        cacheTime: 1000 * 60 * 30,
    })
    
    return {
        // Queries
        allCarsQuery,
        filteredCarsQuery,
        filterMutation,
        
        // Datos derivados
        cars: Object.keys(currentFilters).length > 0 
            ? (filteredCarsQuery.data || [])
            : (allCarsQuery.data || []),
            
        isLoading: Object.keys(currentFilters).length > 0
            ? (filteredCarsQuery.isLoading || filterMutation.isPending)
            : allCarsQuery.isLoading,
            
        isError: Object.keys(currentFilters).length > 0 
            ? filteredCarsQuery.isError 
            : allCarsQuery.isError,
            
        error: Object.keys(currentFilters).length > 0 
            ? filteredCarsQuery.error 
            : allCarsQuery.error,
    }
} 