/**
 * ListAutos - Componente de presentación para lista de vehículos
 * 
 * Responsabilidades:
 * - Layout y estructura visual
 * - Integración de componentes de filtros
 * - Renderizado del grid de autos
 * - NO maneja lógica de estado
 * 
 * @author Indiana Usados
 * @version 2.0.0
 */

import React, { memo } from 'react'
import FilterForm from '../../forms/FilterForm'
import FilterDrawer from '../../forms/FilterDrawer'
import FilterButton from '../../forms/FilterButton'
import FilterSummary from '../../forms/FilterSummary'
import AutosGrid from './AutosGrid'
import styles from './ListAutos.module.css'

/**
 * Componente de presentación puro
 * Recibe todas las props del contenedor y se enfoca solo en renderizar
 */
const ListAutos = memo(({
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
    onFiltersChange,
    onOpenDrawer,
    onCloseDrawer,
    onClearFilter,
    onClearAllFilters,
    onRetry,
    onLoadMore
}) => {
    return (
        <div className={styles.container}>
            {/* ===== SISTEMA DE FILTROS ===== */}
            
            {/* Filtro visible en desktop */}
            <div className={styles.filterSection}>
                <FilterForm 
                    onFiltersChange={onFiltersChange}
                    isSubmitting={isSubmitting}
                />
                
                {/* Resumen de filtros activos */}
                <FilterSummary 
                    activeFilters={currentFilters}
                    onClearFilter={onClearFilter}
                    onClearAll={onClearAllFilters}
                    isSubmitting={isSubmitting}
                />
            </div>

            {/* Botón flotante para mobile */}
            <FilterButton 
                onClick={onOpenDrawer}
                activeFiltersCount={activeFiltersCount}
                isSubmitting={isSubmitting}
            />

            {/* Drawer para mobile */}
            <FilterDrawer 
                isOpen={isDrawerOpen}
                onClose={onCloseDrawer}
                onFiltersChange={onFiltersChange}
                isSubmitting={isSubmitting}
            />

            {/* ===== GRID DE VEHÍCULOS ===== */}
            <AutosGrid 
                autos={autos}
                isLoading={isLoading}
                isError={isError}
                error={error}
                isFetchingNextPage={isFetchingNextPage}
                hasNextPage={hasNextPage}
                onRetry={onRetry}
                onLoadMore={onLoadMore}
            />
        </div>
    )
})

export default ListAutos