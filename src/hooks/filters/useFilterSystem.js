/**
 * useFilterSystem - Hook simplificado para manejo de filtros
 * 
 * Responsabilidades:
 * - Manejar estado de filtros (pendientes y aplicados)
 * - Usar useGetCars para obtener datos con paginación infinita
 * - Proporcionar acciones para manipular filtros
 * - Notificaciones de feedback
 * 
 * Arquitectura:
 * - useGetCars: Maneja la obtención de datos y paginación infinita
 * - useFilterSystem: Maneja el estado de filtros
 * - Separación clara de responsabilidades
 * 
 * @author Indiana Usados
 * @version 10.0.0 - Migrado a paginación infinita
 */

import { useState, useCallback, useMemo } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useGetCars } from '../useGetCars'
import { useFilterNotifications } from './useFilterNotifications'
import autoService from '../../services/service'
import { 
    getValidFilters, 
    transformFiltersToBackend,
    filterVehicles 
} from '../../utils/filterUtils'

export const useFilterSystem = () => {
    const queryClient = useQueryClient()
    const notifications = useFilterNotifications()
    
    // ===== ESTADO DE FILTROS =====
    const [currentFilters, setCurrentFilters] = useState({})
    const [pendingFilters, setPendingFilters] = useState({})

    // ===== QUERY PRINCIPAL CON PAGINACIÓN INFINITA =====
    const {
        autos: cars,
        allVehicles,
        totalCount,
        filteredCount,
        isLoading,
        isError,
        error,
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

    // ===== MUTATION PARA APLICAR FILTROS =====
    const applyFiltersMutation = useMutation({
        mutationFn: async (filters) => {
            try {
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
                notifications.showErrorNotification(`Error al aplicar filtros: ${error.message}`)
                throw error
            }
        },
        onSuccess: (result) => {
            console.log('🔄 Procesando respuesta del backend:', result)
            
            // 1. PRIMERO: Actualizar filtros aplicados
            setCurrentFilters(pendingFilters)
            
            // 2. SEGUNDO: Invalidar cache para forzar nueva consulta con filtros
            queryClient.invalidateQueries({ queryKey: ['vehicles-infinite'] })
            
            // 3. TERCERO: Mostrar notificación de éxito
            notifications.showSuccessNotification(
                `Filtros aplicados: ${result.filteredCount || 0} vehículos encontrados`
            )
        },
        onError: (error) => {
            console.error('❌ Error en mutation:', error)
            notifications.showErrorNotification(`Error: ${error.message}`)
        }
    })

    // ===== ESTADOS COMPUTADOS =====
    const isFiltering = applyFiltersMutation.isPending
    const activeFiltersCount = Object.keys(currentFilters).length

    // ===== FUNCIONES =====
    
    /**
     * Aplicar filtros pendientes
     */
    const applyFilters = useCallback(async () => {
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
    const clearAllFilters = useCallback(() => {
        setCurrentFilters({})
        setPendingFilters({})
        
        // Invalidar cache para recargar sin filtros
        queryClient.invalidateQueries({ queryKey: ['vehicles-infinite'] })
        
        notifications.showSuccessNotification('Filtros limpiados')
    }, [queryClient, notifications])

    /**
     * Actualizar filtros pendientes
     */
    const updatePendingFilters = useCallback((filters) => {
        setPendingFilters(getValidFilters(filters))
    }, [])

    // ===== TRANSFORMAR FILTROS PARA BACKEND =====
    const transformFiltersToQueryParams = (filters) => {
        const validFilters = getValidFilters(filters)
        return transformFiltersToBackend(validFilters)
    }

    return {
        // ===== DATOS =====
        cars, // Lista de autos con paginación infinita
        allVehicles, // Compatibilidad
        totalCount,
        filteredCount,
        
        // ===== ESTADOS =====
        isLoading,
        isError,
        error,
        isFiltering,
        
        // ===== FILTROS =====
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
        applyFilters,
        clearAllFilters,
        setPendingFilters: updatePendingFilters,
        refetch
    }
} 