/**
 * useFilterSystem - Hook simplificado para manejo de filtros
 * 
 * Responsabilidades:
 * - 🚀 NUEVO: Usar reducer para estado complejo
 * - Usar useGetCars para obtener datos con paginación infinita
 * - Proporcionar acciones para manipular filtros
 * - Notificaciones de feedback
 * 
 * Arquitectura:
 * - useGetCars: Maneja la obtención de datos y paginación infinita
 * - useFilterSystem: 🚀 NUEVO: Orquestador que usa reducer
 * - Separación clara de responsabilidades
 * 
 * @author Indiana Usados
 * @version 11.0.0 - Migrado a reducer para estado complejo
 */

import { useCallback } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useGetCars } from '../useGetCars'
import { useFilterNotifications } from './useFilterNotifications'
import { useFilterReducer } from './useFilterReducer' // 🚀 NUEVO: Importar reducer
import autoService from '../../services/service'
import { 
    getValidFilters, 
    transformFiltersToBackend,
    filterVehicles 
} from '../../utils/filterUtils'

export const useFilterSystem = () => {
    const queryClient = useQueryClient()
    const notifications = useFilterNotifications()
    
    // 🚀 NUEVO: Usar reducer para estado complejo
    const {
        // 🎯 ESTADO DESDE REDUCER
        currentFilters,
        pendingFilters,
        isLoading,
        isError,
        error,
        isSubmitting,
        
        // 🎯 ACCIONES DESDE REDUCER
        setPendingFilters,
        applyFilters,
        clearFilters,
        setLoading,
        setError,
        clearError
    } = useFilterReducer()

    // ===== QUERY PRINCIPAL CON PAGINACIÓN INFINITA =====
    const {
        autos: cars,
        allVehicles,
        totalCount,
        filteredCount,
        loadMore,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        refetch,
        currentPage,
        totalPages
    } = useGetCars(currentFilters, {
        // Query principal con infinite scroll habilitado
        enabled: true,
        useInfiniteScroll: true, // 🚀 HABILITAR PAGINACIÓN INFINITA
        staleTime: 1000 * 60 * 10, // 10 minutos
        cacheTime: 1000 * 60 * 60, // 1 hora
    })

    // ===== MUTATION SIMPLIFICADA =====
    const applyFiltersMutation = useMutation({
        mutationFn: async (filters) => {
            try {
                // 🚀 NUEVO: Usar reducer para estados
                setLoading(true)
                clearError()
                notifications.showLoadingNotification('Aplicando filtros...')
                
                // Transformar pending filters en queries aptas para backend
                const queryParams = transformFiltersToQueryParams(filters)
                
                console.log('🚀 Enviando filtros al backend:', queryParams)
                
                // Hacer petición POST al backend
                const result = await autoService.applyFilters(queryParams)
                
                console.log('✅ Respuesta del backend:', result)
                return result
            } catch (error) {
                console.error('❌ Error al aplicar filtros:', error)
                // 🚀 NUEVO: Usar reducer para error
                setError(error.message)
                notifications.showErrorNotification(`Error al aplicar filtros: ${error.message}`)
                throw error
            } finally {
                // 🚀 NUEVO: Usar reducer para loading
                setLoading(false)
            }
        },
        onSuccess: (result) => {
            console.log('🔄 Procesando respuesta del backend:', result)
            
            // 🚀 NUEVO: Usar reducer para aplicar filtros
            applyFilters()
            
            // Invalidar cache para forzar nueva consulta con filtros
            queryClient.invalidateQueries({ queryKey: ['vehicles-infinite'] })
            
            // Mostrar notificación de éxito
            notifications.showSuccessNotification(
                `Filtros aplicados: ${result.filteredCount || 0} vehículos encontrados`
            )
        },
        onError: (error) => {
            console.error('❌ Error en mutation:', error)
            // 🚀 NUEVO: Usar reducer para error
            setError(error.message)
            notifications.showErrorNotification(`Error: ${error.message}`)
        }
    })

    // ===== ESTADOS COMPUTADOS =====
    const isFiltering = applyFiltersMutation.isPending
    const activeFiltersCount = Object.keys(currentFilters).length

    // ===== FUNCIONES SIMPLIFICADAS =====
    
    /**
     * Aplicar filtros pendientes
     */
    const handleApplyFilters = useCallback(async () => {
        if (Object.keys(pendingFilters).length === 0) {
            notifications.showWarningNotification('No hay filtros para aplicar')
            return
        }

        try {
            await applyFiltersMutation.mutateAsync(pendingFilters)
        } catch (error) {
            console.error('❌ Error al aplicar filtros:', error)
        }
    }, [pendingFilters, applyFiltersMutation, notifications])

    /**
     * Limpiar todos los filtros
     */
    const handleClearAllFilters = useCallback(() => {
        // 🚀 NUEVO: Usar reducer para limpiar
        clearFilters()
        
        // Invalidar cache para recargar sin filtros
        queryClient.invalidateQueries({ queryKey: ['vehicles-infinite'] })
        
        notifications.showSuccessNotification('Filtros limpiados')
    }, [queryClient, notifications, clearFilters])

    /**
     * Actualizar filtros pendientes
     */
    const updatePendingFilters = useCallback((filters) => {
        // 🚀 NUEVO: Usar reducer para actualizar
        setPendingFilters(getValidFilters(filters))
    }, [setPendingFilters])

    // ===== TRANSFORMAR FILTROS PARA BACKEND =====
    const transformFiltersToQueryParams = (filters) => {
        const validFilters = getValidFilters(filters)
        return transformFiltersToBackend(validFilters)
    }

    return {
        // ===== DATOS =====
        cars,
        allVehicles,
        totalCount,
        filteredCount,
        
        // ===== ESTADOS (DESDE REDUCER) =====
        isLoading,
        isError,
        error,
        isFiltering,
        
        // ===== FILTROS (DESDE REDUCER) =====
        currentFilters,
        pendingFilters,
        activeFiltersCount,
        
        // ===== PAGINACIÓN INFINITA =====
        loadMore,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        currentPage,
        totalPages,
        
        // ===== FUNCIONES =====
        applyFilters: handleApplyFilters,
        clearAllFilters: handleClearAllFilters,
        setPendingFilters: updatePendingFilters,
        refetch
    }
} 