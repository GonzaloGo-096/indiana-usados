/**
 * ListAutos - Componente de presentación para lista de vehículos
 * 
 * Responsabilidades:
 * - Layout y estructura visual
 * - Integración de componentes de filtros
 * - Renderizado del grid de autos
 * - Usa datos del FilterContext
 * 
 * @author Indiana Usados
 * @version 5.0.0
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
 * Componente de presentación que usa datos del FilterContext
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

    return (
        <div className={styles.container}>
            {/* ===== SISTEMA DE FILTROS ===== */}
            
            {/* Filtro visible en desktop */}
            {!isMobile && (
                <div className={styles.filterSection}>
                    <FilterForm 
                        variant="desktop"
                        initialValues={pendingFilters}
                        onFiltersChange={handleFiltersChange}
                        onApplyFilters={applyFilters}
                        isLoading={isLoading}
                        isFiltering={isFiltering}
                        showApplyButton={true}
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

            {/* Botón flotante para mobile */}
            {isMobile && (
                <FilterButton 
                    onClick={openDrawer}
                    activeFiltersCount={activeFiltersCount}
                    isSubmitting={isFiltering}
                />
            )}

            {/* Drawer para mobile */}
            {isMobile && (
                <FilterDrawer 
                    isOpen={isDrawerOpen}
                    onClose={closeDrawer}
                    onFiltersChange={handleFiltersChange}
                    onApplyFilters={applyFilters}
                    isSubmitting={isFiltering}
                    initialValues={pendingFilters}
                />
            )}

            {/* ===== GRID DE VEHÍCULOS ===== */}
            <AutosGrid 
                autos={cars}
                isLoading={isLoading}
                isError={isError}
                error={error}
                onRetry={handleRetry}
            />
        </div>
    )
})

export default ListAutos