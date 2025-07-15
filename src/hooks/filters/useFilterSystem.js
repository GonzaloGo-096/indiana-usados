/**
 * useFilterSystem - Hook simplificado para manejo de filtros
 * 
 * Responsabilidades:
 * - Una sola query con filtros dinámicos
 * - Estado local simple
 * - Cache automático con React Query
 * - Sin duplicación de lógica
 * - Manejo mejorado de errores
 * - Notificaciones de feedback
 * 
 * @author Indiana Usados
 * @version 7.0.0
 */

import { useState, useCallback, useMemo } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import autoService, { queryKeys } from '../../services/service'
import { useFilterNotifications } from './useFilterNotifications'

export const useFilterSystem = () => {
    const queryClient = useQueryClient()
    const notifications = useFilterNotifications()
    
    // ===== ESTADO SIMPLIFICADO =====
    const [currentFilters, setCurrentFilters] = useState({})
    const [pendingFilters, setPendingFilters] = useState({})

    // ===== QUERY ÚNICA CON FILTROS DINÁMICOS =====
    const {
        data: cars,
        isLoading,
        isError,
        error,
        refetch
    } = useQuery({
        queryKey: [queryKeys.autos, 'list', currentFilters],
        queryFn: async () => {
            try {
                const result = await autoService.getAutos({ 
                    pageParam: 1, 
                    filters: currentFilters 
                })
                return result.items || []
            } catch (error) {
                console.error('Error al cargar vehículos:', error)
                notifications.showErrorNotification(`Error al cargar vehículos: ${error.message}`)
                throw new Error(`Error al cargar vehículos: ${error.message}`)
            }
        },
        staleTime: 1000 * 60 * 5,
        cacheTime: 1000 * 60 * 30,
    })

    // ===== MUTATION PARA APLICAR FILTROS =====
    const applyFiltersMutation = useMutation({
        mutationFn: async (filters) => {
            try {
                notifications.showLoadingNotification('Aplicando filtros...')
                
                const result = await autoService.getAutos({ 
                    pageParam: 1, 
                    filters 
                })
                return result.items || []
            } catch (error) {
                console.error('Error al aplicar filtros:', error)
                notifications.showErrorNotification(`Error al aplicar filtros: ${error.message}`)
                throw new Error(`Error al aplicar filtros: ${error.message}`)
            }
        },
        onSuccess: (filteredCars) => {
            setCurrentFilters(pendingFilters)
            // Actualizar cache con los nuevos datos
            queryClient.setQueryData([queryKeys.autos, 'list', pendingFilters], filteredCars)
            
            // Mostrar notificación de éxito
            const activeCount = Object.values(pendingFilters).filter(value => 
                value && value !== '' && value !== null && value !== undefined
            ).length
            
            if (activeCount > 0) {
                notifications.showSuccessNotification(`Filtros aplicados correctamente. ${filteredCars.length} vehículos encontrados.`)
            } else {
                notifications.showInfoNotification('Filtros limpiados. Mostrando todos los vehículos.')
            }
        },
        onError: (error) => {
            console.error('Error en mutation de filtros:', error)
            notifications.showErrorNotification('Error al aplicar filtros. Inténtalo de nuevo.')
        }
    })

    // ===== VALORES DERIVADOS =====
    const activeFiltersCount = useMemo(() => {
        return Object.values(currentFilters).filter(value => 
            value && value !== '' && value !== null && value !== undefined
        ).length
    }, [currentFilters])

    const hasActiveFilters = useMemo(() => {
        return Object.values(currentFilters).some(value => 
            value && value !== '' && value !== null && value !== undefined
        )
    }, [currentFilters])

    // ===== ACCIONES SIMPLIFICADAS =====
    const handleFiltersChange = useCallback((filters) => {
        setPendingFilters(filters)
    }, [])

    const applyFilters = useCallback(() => {
        const hasValidFilters = Object.values(pendingFilters).some(value => 
            value && value !== '' && value !== null && value !== undefined
        )
        
        if (hasValidFilters) {
            applyFiltersMutation.mutate(pendingFilters)
        } else {
            notifications.showInfoNotification('No hay filtros para aplicar.')
        }
    }, [pendingFilters, applyFiltersMutation, notifications])

    const clearFilter = useCallback((filterKey) => {
        const newPendingFilters = { ...pendingFilters }
        delete newPendingFilters[filterKey]
        setPendingFilters(newPendingFilters)
        
        const newCurrentFilters = { ...currentFilters }
        delete newCurrentFilters[filterKey]
        setCurrentFilters(newCurrentFilters)
        
        notifications.showInfoNotification(`Filtro "${filterKey}" removido.`)
    }, [pendingFilters, currentFilters, notifications])

    const clearAllFilters = useCallback(() => {
        setPendingFilters({})
        setCurrentFilters({})
        notifications.showInfoNotification('Todos los filtros han sido limpiados.')
    }, [notifications])

    return {
        // Estado
        currentFilters,
        pendingFilters,
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