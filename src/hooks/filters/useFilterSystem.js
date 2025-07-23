/**
 * useFilterSystem - Hook simplificado para manejo de filtros
 * 
 * Responsabilidades:
 * - Manejar estado de filtros (pendientes y aplicados)
 * - Usar useGetCars para obtener datos
 * - Proporcionar acciones para manipular filtros
 * - Notificaciones de feedback
 * 
 * Arquitectura:
 * - useGetCars: Maneja la obtención de datos y paginación
 * - useFilterSystem: Maneja el estado de filtros
 * - Separación clara de responsabilidades
 * 
 * @author Indiana Usados
 * @version 9.0.0
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

    // ===== QUERY PRINCIPAL (LISTA COMPLETA) =====
    const {
        autos: allCars,
        allVehicles,
        totalCount,
        isLoading: isLoadingAll,
        error: errorAll,
        refetch: refetchAll
    } = useGetCars({}, {
        // Query principal siempre activa
        enabled: true,
        staleTime: 1000 * 60 * 10, // 10 minutos
        cacheTime: 1000 * 60 * 60, // 1 hora
    })

    // ===== QUERY PARA RESULTADOS FILTRADOS =====
    const {
        data: filteredData,
        isLoading: isLoadingFiltered,
        error: errorFiltered,
        refetch: refetchFiltered
    } = useQuery({
        queryKey: ['filtered-vehicles', currentFilters],
        queryFn: () => autoService.applyFilters(currentFilters),
        enabled: Object.keys(currentFilters).length > 0,
        staleTime: 1000 * 60 * 5, // 5 minutos
        cacheTime: 1000 * 60 * 30, // 30 minutos
        retry: 1,
        refetchOnWindowFocus: false
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
            
            // 2. SEGUNDO: Actualizar cache con los datos filtrados del backend
            queryClient.setQueryData(['filtered-vehicles', pendingFilters], result)
            
            // 3. TERCERO: Invalidación más agresiva - limpiar todo el cache relacionado
            queryClient.invalidateQueries({ queryKey: ['all-vehicles'] })
            queryClient.invalidateQueries({ queryKey: ['filtered-vehicles'] })
            queryClient.removeQueries({ queryKey: ['all-vehicles'] })
            
            // 4. CUARTO: Forzar refetch inmediato
            queryClient.refetchQueries({ queryKey: ['all-vehicles'] })
            
            // 5. QUINTO: Mostrar notificación de éxito
            const filteredCount = result.filteredCount || result.items?.length || 0
            const totalCount = result.totalCount || allVehicles?.length || 0
            
            if (filteredCount > 0) {
                notifications.showSuccessNotification(
                    `Filtros aplicados correctamente. ${filteredCount} de ${totalCount} vehículos encontrados.`
                )
            } else {
                notifications.showInfoNotification('No se encontraron vehículos con los filtros aplicados.')
            }
            
            console.log('✅ Flujo completado: POST → UI → Cache (Invalidación agresiva)')
        },
        onError: (error) => {
            console.error('❌ Error en mutation de filtros:', error)
            notifications.showErrorNotification(`Error al aplicar filtros: ${error.message}`)
        }
    })

    // ===== FUNCIÓN PARA TRANSFORMAR FILTROS =====
    const transformFiltersToQueryParams = (filters) => {
        return transformFiltersToBackend(filters)
    }

    // ===== ACCIONES DE FILTROS =====
    
    /**
     * Actualizar filtros pendientes
     * @param {Object} filters - Nuevos filtros a aplicar
     */
    const handleFiltersChange = useCallback((filters) => {
        setPendingFilters(filters)
    }, [])



    /**
     * Aplicar filtros pendientes via POST al backend
     */
    const applyFilters = useCallback(() => {
        // Verificar si hay filtros válidos para aplicar
        const validFilters = getValidFilters(pendingFilters)

        if (Object.keys(validFilters).length > 0) {
            // Aplicar filtros via POST al backend
            applyFiltersMutation.mutate(validFilters)
        } else {
            // Si no hay filtros válidos, limpiar todos
            setCurrentFilters({})
            setPendingFilters({})
            notifications.showInfoNotification('Filtros limpiados. Mostrando todos los vehículos.')
        }
    }, [pendingFilters, applyFiltersMutation, notifications])

    /**
     * Limpiar un filtro específico
     * @param {string} filterKey - Clave del filtro a limpiar
     */
    const clearFilter = useCallback((filterKey) => {
        const newPendingFilters = { ...pendingFilters }
        delete newPendingFilters[filterKey]
        setPendingFilters(newPendingFilters)
        
        const newCurrentFilters = { ...currentFilters }
        delete newCurrentFilters[filterKey]
        setCurrentFilters(newCurrentFilters)
    }, [pendingFilters, currentFilters])

    /**
     * Limpiar todos los filtros
     */
    const clearAllFilters = useCallback(() => {
        setPendingFilters({})
        setCurrentFilters({})
        
        // Limpiar cache al limpiar filtros
        queryClient.invalidateQueries({ queryKey: ['all-vehicles'] })
        queryClient.invalidateQueries({ queryKey: ['filtered-vehicles'] })
        
        notifications.showInfoNotification('Filtros limpiados. Mostrando todos los vehículos.')
    }, [notifications, queryClient])

    // ===== DATOS A MOSTRAR =====
    const cars = useMemo(() => {
        // Si hay filtros aplicados, mostrar resultados filtrados
        if (Object.keys(currentFilters).length > 0 && filteredData) {
            return filteredData.items || []
        }
        // Si no hay filtros, mostrar lista completa
        return allCars
    }, [currentFilters, filteredData, allCars])

    const filteredCount = useMemo(() => {
        if (Object.keys(currentFilters).length > 0 && filteredData) {
            return filteredData.filteredCount || filteredData.items?.length || 0
        }
        return allCars.length
    }, [currentFilters, filteredData, allCars])

    // ===== ESTADOS DE CARGA =====
    const isLoading = isLoadingAll || isLoadingFiltered || applyFiltersMutation.isPending
    const isError = errorAll || errorFiltered
    const error = errorAll || errorFiltered

    // ===== VALORES DERIVADOS =====
    const activeFiltersCount = useMemo(() => {
        return Object.keys(getValidFilters(currentFilters)).length
    }, [currentFilters])

    const hasActiveFilters = useMemo(() => {
        return Object.keys(getValidFilters(currentFilters)).length > 0
    }, [currentFilters])

    return {
        // ===== ESTADO DE FILTROS =====
        currentFilters,
        pendingFilters,
        activeFiltersCount,
        hasActiveFilters,
        
        // ===== DATOS DE VEHÍCULOS =====
        cars,
        allVehicles,
        filteredCount,
        totalCount,
        isLoading,
        isError,
        error,
        isFiltering: applyFiltersMutation.isPending,
        
        // ===== DATOS DE FILTRADOS =====
        filteredData,
        isLoadingFiltered,
        errorFiltered,
        
        // ===== ACCIONES =====
        handleFiltersChange,
        applyFilters,
        clearFilter,
        clearAllFilters,
        refetch: refetchAll,
        refetchFiltered,
        
        // ===== FUNCIONES DE TEST =====
        setCurrentFilters, // Exponer para test
        transformFiltersToQueryParams, // Exponer para debug
    }
} 