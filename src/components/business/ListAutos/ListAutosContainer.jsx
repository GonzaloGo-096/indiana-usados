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

import React, { useCallback, useMemo } from 'react'
import { useFilterContext } from '../../../contexts/FilterContext'
import { useGetCars } from '../../../hooks/useGetCars'
import ListAutos from './ListAutos'

const ListAutosContainer = () => {
    // ===== CONTEXT =====
    const {
        // Estado responsive
        isMobile,
        isDrawerOpen,
        
        // Estado de filtros
        currentFilters,
        isSubmitting,
        activeFiltersCount,
        queryParams,
        
        // Acciones
        handleFiltersChange,
        clearFilter,
        clearAllFilters,
        openDrawer,
        closeDrawer
    } = useFilterContext()

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

    // ===== MANEJO DE DATOS =====
    
    /**
     * Función para manejar reintento
     */
    const handleRetry = useCallback(() => {
        refetch()
        if (autos.length > 0) {
            loadMore()
        }
    }, [refetch, loadMore, autos.length])

    // ===== PROPS PARA EL COMPONENTE DE PRESENTACIÓN (MEMOIZADOS) =====
    const listAutosProps = useMemo(() => ({
        // Datos
        autos,
        
        // Estados
        isLoading,
        isError,
        error,
        isFetchingNextPage,
        hasNextPage,
        
        // Acciones
        onRetry: handleRetry,
        onLoadMore: loadMore
    }), [
        autos,
        isLoading,
        isError,
        error,
        isFetchingNextPage,
        hasNextPage,
        handleRetry,
        loadMore
    ])

    return <ListAutos {...listAutosProps} />
}

export default ListAutosContainer 