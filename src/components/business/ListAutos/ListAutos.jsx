/**
 * ListAutos - Componente principal para lista de vehículos
 * 
 * Responsabilidades:
 * - Layout y estructura visual
 * - Integración de componentes de filtros
 * - Renderizado del grid de autos
 * - Usa datos del FilterContext
 * - Paginación infinita con scroll automático
 * 
 * @author Indiana Usados
 * @version 7.0.0
 */

import React, { memo } from 'react'
import { useFilterContext } from '../../../contexts/FilterContext'
import { useResponsiveContext } from '../../../contexts/ResponsiveContext'
import { 
    FilterForm, 
    FilterDrawer, 
    FilterButton, 
    FilterSummary 
} from '../../filters'
import AutosGrid from './AutosGrid'
import styles from './ListAutos.module.css'

/**
 * Componente principal que usa datos del FilterContext
 */
const ListAutos = memo(() => {
    // ===== CONTEXT =====
    const {
        // Estado de filtros
        currentFilters,
        pendingFilters,
        activeFiltersCount,
        
        // Datos
        cars,
        isLoading,
        isError,
        error,
        isFiltering,
        
        // Paginación
        loadMore,
        hasNextPage,
        isFetchingNextPage,
        
        // Acciones de filtros
        handleFiltersChange,
        applyFilters,
        clearFilter,
        clearAllFilters,
        refetch
    } = useFilterContext()

    const {
        // Estado responsive
        isMobile,
        isDrawerOpen,
        
        // Acciones responsive
        openDrawer,
        closeDrawer
    } = useResponsiveContext()

    // Manejar reintento
    const handleRetry = () => {
        refetch()
    }

    // Manejar carga de más vehículos
    const handleLoadMore = () => {
        loadMore()
    }

    // ===== RENDERIZADO =====
    
    return (
        <div className={styles.container}>
            {/* ===== FILTROS DESKTOP ===== */}
            {!isMobile && (
                <div className={styles.filtersDesktop}>
                    <FilterForm 
                        onFiltersChange={handleFiltersChange}
                        onApplyFilters={applyFilters}
                        isLoading={isLoading}
                        isFiltering={isFiltering}
                        initialValues={currentFilters}
                    />
                    
                    {/* Resumen de filtros activos */}
                    <FilterSummary 
                        pendingFilters={pendingFilters}
                        onClearFilter={clearFilter}
                        onClearAll={clearAllFilters}
                        isSubmitting={isFiltering}
                    />
                </div>
            )}

            {/* ===== FILTROS MOBILE ===== */}
            {isMobile && (
                <>
                    <FilterButton 
                        onClick={openDrawer}
                        activeFiltersCount={activeFiltersCount}
                    />
                    
                    <FilterDrawer 
                        isOpen={isDrawerOpen}
                        onClose={closeDrawer}
                    >
                        <FilterForm 
                            onFiltersChange={handleFiltersChange}
                            onApplyFilters={applyFilters}
                            isLoading={isLoading}
                            isFiltering={isFiltering}
                            initialValues={currentFilters}
                            variant="mobile"
                            showApplyButton={true}
                            showClearButtonAtBottom={true}
                        />
                    </FilterDrawer>
                </>
            )}

            {/* ===== RESUMEN DE FILTROS ===== */}
            {activeFiltersCount > 0 && (
                <FilterSummary 
                    pendingFilters={pendingFilters}
                    onClearFilter={clearFilter}
                    onClearAll={clearAllFilters}
                    isSubmitting={isFiltering}
                />
            )}

            {/* ===== GRID DE VEHÍCULOS ===== */}
            <AutosGrid 
                autos={cars}
                isLoading={isLoading}
                isError={isError}
                error={error}
                onRetry={handleRetry}
                // Props de paginación
                hasNextPage={hasNextPage}
                isFetchingNextPage={isFetchingNextPage}
                onLoadMore={handleLoadMore}
            />
        </div>
    )
})

export default ListAutos