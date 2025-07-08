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
import { useFilterContext } from '../../../contexts/FilterContext'
import { useResponsiveContext } from '../../../contexts/ResponsiveContext'
import { 
    FilterForm, 
    FilterDrawer, 
    FilterButton, 
    FilterSummary 
} from '../../forms/filters'
import AutosGrid from './AutosGrid'
import styles from './ListAutos.module.css'

/**
 * Componente de presentación puro
 * Recibe todas las props del contenedor y se enfoca solo en renderizar
 */
const ListAutos = memo(({
    // Datos
    autos,
    
    // Estados
    isLoading,
    isError,
    error,
    isFetchingNextPage,
    hasNextPage,
    
    // Acciones
    onRetry,
    onLoadMore
}) => {
    // ===== CONTEXT =====
    const {
        // Estado de filtros
        currentFilters,
        isSubmitting,
        activeFiltersCount,
        
        // Acciones de filtros
        handleFiltersChange,
        clearFilter,
        clearAllFilters,
    } = useFilterContext()

    const {
        // Estado responsive
        isMobile,
        isDrawerOpen,
        
        // Acciones responsive
        openDrawer,
        closeDrawer
    } = useResponsiveContext()


    return (
        <div className={styles.container}>
            {/* ===== SISTEMA DE FILTROS ===== */}
            
            {/* Filtro visible en desktop */}
            {!isMobile && (
                <div className={styles.filterSection}>
                    <FilterForm 
                        variant="desktop"
                        initialValues={currentFilters}
                        onFiltersChange={handleFiltersChange}
                        isSubmitting={isSubmitting}
                    />
                    
                    {/* Resumen de filtros activos */}
                    <FilterSummary 
                        activeFilters={currentFilters}
                        onClearFilter={clearFilter}
                        onClearAll={clearAllFilters}
                        isSubmitting={isSubmitting}
                    />
                </div>
            )}

            {/* Botón flotante para mobile */}
            {isMobile && (
                <FilterButton 
                    onClick={openDrawer}
                    activeFiltersCount={activeFiltersCount}
                    isSubmitting={isSubmitting}
                />
            )}
            


            {/* Drawer para mobile */}
            {isMobile && (
                <FilterDrawer 
                    isOpen={isDrawerOpen}
                    onClose={closeDrawer}
                    onFiltersChange={handleFiltersChange}
                    isSubmitting={isSubmitting}
                    initialValues={currentFilters}
                />
            )}

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