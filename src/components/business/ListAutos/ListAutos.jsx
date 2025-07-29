/**
 * ListAutos - Componente principal para lista de vehículos
 * 
 * Responsabilidades:
 * - Layout y estructura visual
 * - Integración de componentes de filtros
 * - Renderizado del grid de autos
 * - Manejo directo de datos sin contexto
 * - Paginación infinita con scroll automático
 * 
 * @author Indiana Usados
 * @version 10.0.0
 */

import React, { memo, useState, useCallback } from 'react'
import { useGetCars } from '../../../hooks/useGetCars'
import FilterFormSimplified from '../../filters/FilterFormSimplified/FilterFormSimplified'
import AutosGrid from './AutosGrid'
import styles from './ListAutos.module.css'

/**
 * Componente principal con manejo directo de datos
 */
const ListAutos = memo(() => {
    const [isFiltering, setIsFiltering] = useState(false)
    
    // Usar useGetCars directamente
    const {
        autos: cars,
        allVehicles,
        totalCount,
        isLoading,
        isError,
        error,
        loadMore,
        hasNextPage,
        isFetchingNextPage,
        refetch
    } = useGetCars({}, {
        enabled: true,
        staleTime: 1000 * 60 * 10, // 10 minutos
        cacheTime: 1000 * 60 * 60, // 1 hora
    })

    // Función para aplicar filtros
    const applyFilters = useCallback(async (filters) => {
        setIsFiltering(true)
        try {
            // Aquí iría la lógica para aplicar filtros al backend
            // Por ahora, solo simulamos la aplicación
            await new Promise(resolve => setTimeout(resolve, 1000))
            
            // Refetch para obtener datos actualizados
            await refetch()
            
        } catch (error) {
            console.error('❌ Error al aplicar filtros:', error)
            throw error
        } finally {
            setIsFiltering(false)
        }
    }, [refetch])

    // ===== RENDERIZADO =====
    
    return (
        <div className={styles.container}>
            {/* ===== FILTROS SIMPLIFICADOS ===== */}
            <FilterFormSimplified 
                onApplyFilters={applyFilters}
                isLoading={isLoading || isFiltering}
            />

            {/* ===== GRID DE VEHÍCULOS ===== */}
            <div className={styles.content}>
                <AutosGrid 
                    autos={cars}
                    isLoading={isLoading}
                    isError={isError}
                    error={error}
                    onLoadMore={loadMore}
                    hasNextPage={hasNextPage}
                    isFetchingNextPage={isFetchingNextPage}
                    onRetry={refetch}
                />
            </div>
        </div>
    )
})

ListAutos.displayName = 'ListAutos'

export default ListAutos