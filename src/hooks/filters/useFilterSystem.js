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
 * - Paginación infinita
 * 
 * @author Indiana Usados
 * @version 8.0.0
 */

import { useState, useCallback, useMemo } from 'react'
import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import autoService, { queryKeys } from '../../services/service'
import { useFilterNotifications } from './useFilterNotifications'

export const useFilterSystem = () => {
    const queryClient = useQueryClient()
    const notifications = useFilterNotifications()
    
    // ===== ESTADO SIMPLIFICADO =====
    const [currentFilters, setCurrentFilters] = useState({})
    const [pendingFilters, setPendingFilters] = useState({})

    // ===== QUERY INFINITA CON FILTROS DINÁMICOS =====
    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading,
        isError,
        error,
        refetch
    } = useInfiniteQuery({
        queryKey: [queryKeys.autos, 'list', currentFilters],
        queryFn: async ({ pageParam = 1 }) => {
            try {
                console.log('Fetching page:', pageParam, 'with filters:', currentFilters);
                
                // Convertir filtros a query params
                const queryParams = new URLSearchParams();
                Object.entries(currentFilters).forEach(([key, value]) => {
                    if (value && value !== '') {
                        queryParams.append(key, value);
                    }
                });
                
                const result = await autoService.getAutos({ 
                    pageParam,
                    filters: queryParams.toString()
                });
                console.log('API Response:', result);
                return result;
            } catch (error) {
                console.error('Error al cargar vehículos:', error)
                notifications.showErrorNotification(`Error al cargar vehículos: ${error.message}`)
                throw new Error(`Error al cargar vehículos: ${error.message}`)
            }
        },
        initialPageParam: 1,
        getNextPageParam: (lastPage) => {
            console.log('Last page:', lastPage);
            return lastPage?.nextPage;
        },
        staleTime: 1000 * 60 * 5,
        cacheTime: 1000 * 60 * 30,
        refetchOnWindowFocus: false,
        retry: 1,
        keepPreviousData: true,
        select: (data) => {
            console.log('Select data:', data);
            const result = {
                ...data,
                autos: data.pages.flatMap(page => page?.items || [])
            };
            console.log('Transformed data:', result);
            return result;
        }
    });

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

    // ===== FUNCIÓN PARA CARGAR MÁS =====
    const loadMore = useCallback(() => {
        if (hasNextPage && !isFetchingNextPage) {
            console.log('Loading more...');
            fetchNextPage();
        }
    }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

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
            setCurrentFilters(pendingFilters)
            notifications.showSuccessNotification('Filtros aplicados correctamente.')
        } else {
            setCurrentFilters({})
            notifications.showInfoNotification('Filtros limpiados. Mostrando todos los vehículos.')
        }
    }, [pendingFilters, notifications])

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
        cars: data?.autos || [],
        isLoading: isLoading || applyFiltersMutation.isPending,
        isError,
        error,
        isFiltering: applyFiltersMutation.isPending,
        
        // Paginación
        loadMore,
        hasNextPage,
        isFetchingNextPage,
        
        // Acciones
        handleFiltersChange,
        applyFilters,
        clearFilter,
        clearAllFilters,
        refetch,
    }
} 