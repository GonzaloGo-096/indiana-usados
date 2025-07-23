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

import React, { memo, useRef, useState } from 'react'
import { useFilterContext } from '../../../contexts/FilterContext'
import { useResponsiveContext } from '../../../contexts/ResponsiveContext'
import { 
    FilterForm, 
    FilterDrawer, 
    FilterButton, 
    FilterSummary 
} from '../../filters'
import { getValidFilters } from '../../../utils/filterUtils'
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
        activeFiltersCount,
        cars,
        isLoading,
        isError,
        error,
        isFiltering,
        loadMore,
        hasNextPage,
        isFetchingNextPage,
        applyFilters,
        clearAllFilters,
        refetch,
        setCurrentFilters
    } = useFilterContext()

    const {
        isMobile,
        isDrawerOpen,
        openDrawer,
        closeDrawer
    } = useResponsiveContext()

    const formRef = useRef();
    
    // Función para limpiar filtros usando utilidades centralizadas
    const cleanFilters = (filters) => {
        return getValidFilters(filters);
    };
    
    const [pendingFilters, setPendingFilters] = useState(cleanFilters(currentFilters));

    // Actualizar pendingFilters cada vez que cambian los valores del formulario
    const handleFiltersChange = (filters) => {
        setPendingFilters(filters);
    };

    // Sincronizar pendingFilters cuando cambien los currentFilters
    // Solo cuando no hay filtros pendientes activos
    React.useEffect(() => {
        if (currentFilters && Object.keys(currentFilters).length > 0) {
            // Solo sincronizar si pendingFilters está vacío o es diferente
            const hasPendingChanges = Object.keys(pendingFilters).length > 0;
            const isDifferent = JSON.stringify(currentFilters) !== JSON.stringify(pendingFilters);
            
            if (!hasPendingChanges || isDifferent) {
                // Limpiar valores vacíos o 0 antes de sincronizar
                const cleanFilters = Object.entries(currentFilters).reduce((acc, [key, value]) => {
                    if (value && value !== '' && value !== null && value !== undefined && value !== 0 && value !== '0') {
                        acc[key] = value;
                    }
                    return acc;
                }, {});
                
                setPendingFilters(cleanFilters);
            }
        }
    }, [currentFilters, pendingFilters]);

    // Función para limpiar un filtro individual usando el ref del formulario
    const handleClearFilter = (key) => {
        if (formRef.current && formRef.current.clearField) {
            formRef.current.clearField(key);
        }
        // También limpiar del estado local
        setPendingFilters(prev => {
            const newFilters = { ...prev };
            delete newFilters[key];
            return newFilters;
        });
    };

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
                            ref={formRef}
                            onFiltersChange={handleFiltersChange}
                            onApplyFilters={applyFilters}
                            isLoading={isLoading}
                            isFiltering={isFiltering}
                            initialValues={pendingFilters}
                            filterSummary={
                                <FilterSummary
                                    pendingFilters={pendingFilters}
                                    onClearFilter={handleClearFilter}
                                    isSubmitting={isFiltering}
                                />
                            }
                        />
                </div>
            )}

            {/* ===== FILTROS MOBILE ===== */}
            {isMobile && (
                <>
                    {/* Botón flotante solo en mobile */}
                    <FilterButton 
                        onClick={openDrawer}
                        activeFiltersCount={activeFiltersCount}
                        isSubmitting={isFiltering}
                    />
                    
                    {/* Drawer solo en mobile */}
                    <FilterDrawer 
                        isOpen={isDrawerOpen}
                        onClose={closeDrawer}
                    >
                        <FilterForm 
                            ref={formRef}
                            onFiltersChange={handleFiltersChange}
                            onApplyFilters={applyFilters}
                            isLoading={isLoading}
                            isFiltering={isFiltering}
                            initialValues={pendingFilters}
                            variant="mobile"
                            showApplyButton={true}
                            showClearButtonAtBottom={true}
                            filterSummary={
                                <FilterSummary
                                    pendingFilters={pendingFilters}
                                    onClearFilter={handleClearFilter}
                                    isSubmitting={isFiltering}
                                />
                            }
                        />
                    </FilterDrawer>
                </>
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