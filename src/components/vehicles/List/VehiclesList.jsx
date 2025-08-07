/**
 * VehiclesList - Componente principal de lista de vehículos optimizado
 * 
 * Responsabilidades:
 * - Integración con hook unificado
 * - Manejo de filtros
 * - Scroll to top integrado
 * - Error boundaries robustos
 * - Error handling completo
 * 
 * @author Indiana Usados
 * @version 3.2.0 - Performance optimizada
 */

import React, { memo, useCallback, useState, useMemo } from 'react'
import { useVehiclesQuery } from '@hooks/vehicles/useVehiclesQuery'
import { useErrorHandler } from '@hooks/useErrorHandler'
import { FilterFormSimplified } from '@vehicles'
import { AutosGrid } from '@vehicles'
import { ScrollToTop } from '@ui'
import { VehiclesErrorBoundary } from '@shared'
import styles from './ListAutos/ListAutos.module.css'

const VehiclesList = memo(() => {
    const [isFiltering, setIsFiltering] = useState(false)
    
    // Error handler integrado
    const { handleError, clearError, isError, error } = useErrorHandler({
        autoClearTime: 5000,
        enableAutoClear: true
    })
    
    // Hook unificado optimizado
    const {
        vehicles,
        isLoading,
        isError: isQueryError,
        error: queryError,
        hasNextPage,
        isFetchingNextPage,
        loadMore,
        refetch,
        clearCache
    } = useVehiclesQuery()

    // Manejar errores de query
    React.useEffect(() => {
        if (isQueryError && queryError) {
            handleError(queryError, 'vehicles-query')
        }
    }, [isQueryError, queryError, handleError])

    // ✅ OPTIMIZADO: Función para aplicar filtros memoizada
    const applyFilters = useCallback(async (filters) => {
        setIsFiltering(true)
        clearError()
        
        try {
            // Limpiar cache y recargar con nuevos filtros
            clearCache()
            await refetch()
        } catch (error) {
            handleError(error, 'apply-filters')
            throw error
        } finally {
            setIsFiltering(false)
        }
    }, [clearCache, refetch, handleError, clearError])

    // ✅ OPTIMIZADO: Manejar reintento memoizado
    const handleRetry = useCallback(() => {
        clearError()
        refetch()
    }, [clearError, refetch])

    // ✅ OPTIMIZADO: Props memoizadas para FilterFormSimplified
    const filterFormProps = useMemo(() => ({
        onApplyFilters: applyFilters,
        isLoading: isLoading || isFiltering
    }), [applyFilters, isLoading, isFiltering])

    // ✅ OPTIMIZADO: Props memoizadas para AutosGrid
    const autosGridProps = useMemo(() => ({
        vehicles,
        isLoading,
        isError,
        error,
        hasNextPage,
        isFetchingNextPage,
        onLoadMore: loadMore,
        onRetry: handleRetry
    }), [vehicles, isLoading, isError, error, hasNextPage, isFetchingNextPage, loadMore, handleRetry])

    return (
        <VehiclesErrorBoundary>
            <div className={styles.container}>
                {/* Filtros simplificados */}
                <FilterFormSimplified {...filterFormProps} />

                {/* Contenedor de lista con título */}
                <div className={styles.listContainer}>
                    {/* Línea vertical sutil izquierda */}
                    <div className={styles.verticalLine}></div>
                    
                    {/* Línea vertical sutil derecha */}
                    <div className={styles.verticalLineRight}></div>
                    
                    {/* Título principal */}
                    <div className={styles.titleSection}>
                        <h1 className={styles.mainTitle}>Nuestros Usados</h1>
                    </div>

                    {/* Grid de vehículos */}
                    <AutosGrid {...autosGridProps} />
                </div>
            </div>
            
            {/* Scroll to top */}
            <ScrollToTop />
        </VehiclesErrorBoundary>
    )
})

export default VehiclesList 