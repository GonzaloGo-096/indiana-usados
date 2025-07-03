/**
 * ListAutosContainer - Contenedor inteligente para ListAutos
 * 
 * Responsabilidades:
 * - Manejo de estado de filtros
 * - Lógica de drawer mobile
 * - Coordinación entre filtros y datos
 * - Preparación de queries para API
 * 
 * @author Indiana Usados
 * @version 1.0.0
 */

import React, { useState, useCallback, useMemo } from 'react'
import { useFilters } from '../../../hooks/useFilters'
import { useGetCars } from '../../../hooks/useGetCars'
import ListAutos from './ListAutos'

const ListAutosContainer = () => {
    // ===== ESTADO DE FILTROS =====
    const [isDrawerOpen, setIsDrawerOpen] = useState(false)
    const [currentFilters, setCurrentFilters] = useState({})
    
    // ===== HOOKS PERSONALIZADOS =====
    const {
        isSubmitting,
        handleFiltersChange: handleFiltersChangeFromHook,
        getQueryParams,
        getActiveFiltersCount
    } = useFilters()

    const { 
        autos, 
        loadMore, 
        hasNextPage, 
        isLoading, 
        isError, 
        error, 
        isFetchingNextPage,
        refetch
    } = useGetCars()

    // ===== MANEJO DE FILTROS =====
    
    /**
     * Función para manejar cambios en filtros
     */
    const handleFiltersChange = useCallback((filters) => {
        setCurrentFilters(filters)
        handleFiltersChangeFromHook(filters)
        
        // Aquí en el futuro se conectaría con la API
        // const queryParams = getQueryParams(filters)
        // refetch({ queryParams })
    }, [handleFiltersChangeFromHook])

    /**
     * Función para abrir el drawer en mobile
     */
    const handleOpenDrawer = useCallback(() => {
        setIsDrawerOpen(true)
    }, [])

    /**
     * Función para cerrar el drawer en mobile
     */
    const handleCloseDrawer = useCallback(() => {
        setIsDrawerOpen(false)
    }, [])

    /**
     * Función para limpiar un filtro específico
     */
    const handleClearFilter = useCallback((filterKey) => {
        const newFilters = { ...currentFilters }
        delete newFilters[filterKey]
        setCurrentFilters(newFilters)
        handleFiltersChangeFromHook(newFilters)
    }, [currentFilters, handleFiltersChangeFromHook])

    /**
     * Función para limpiar todos los filtros
     */
    const handleClearAllFilters = useCallback(() => {
        setCurrentFilters({})
        handleFiltersChangeFromHook({})
    }, [handleFiltersChangeFromHook])

    /**
     * Función para manejar reintento
     */
    const handleRetry = useCallback(() => {
        refetch()
        if (autos.length > 0) {
            loadMore()
        }
    }, [refetch, loadMore, autos.length])

    // ===== VALORES DERIVADOS (MEMOIZADOS) =====
    const activeFiltersCount = useMemo(() => 
        getActiveFiltersCount(currentFilters), 
        [currentFilters, getActiveFiltersCount]
    )
    
    const queryParams = useMemo(() => 
        getQueryParams(currentFilters), 
        [currentFilters, getQueryParams]
    )

    // ===== PROPS PARA EL COMPONENTE DE PRESENTACIÓN (MEMOIZADOS) =====
    const listAutosProps = useMemo(() => ({
        // Datos
        autos,
        currentFilters,
        activeFiltersCount,
        queryParams,
        
        // Estados
        isLoading,
        isError,
        error,
        isFetchingNextPage,
        hasNextPage,
        isSubmitting,
        isDrawerOpen,
        
        // Acciones
        onFiltersChange: handleFiltersChange,
        onOpenDrawer: handleOpenDrawer,
        onCloseDrawer: handleCloseDrawer,
        onClearFilter: handleClearFilter,
        onClearAllFilters: handleClearAllFilters,
        onRetry: handleRetry,
        onLoadMore: loadMore
    }), [
        autos,
        currentFilters,
        activeFiltersCount,
        queryParams,
        isLoading,
        isError,
        error,
        isFetchingNextPage,
        hasNextPage,
        isSubmitting,
        isDrawerOpen,
        handleFiltersChange,
        handleOpenDrawer,
        handleCloseDrawer,
        handleClearFilter,
        handleClearAllFilters,
        handleRetry,
        loadMore
    ])

    return <ListAutos {...listAutosProps} />
}

export default ListAutosContainer 